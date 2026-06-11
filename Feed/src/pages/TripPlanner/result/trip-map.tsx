"use client"

import { useEffect, useState, useRef } from "react"
import { MapContainer, TileLayer, Marker as LeafletMarker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import { WaypointsIcon as Directions, MapPinOffIcon as MapOff } from "lucide-react"
import "leaflet/dist/leaflet.css"
import "leaflet-routing-machine/dist/leaflet-routing-machine.css"

// Fix Leaflet marker icon issue
const createMarkerIcon = (color: string, index: number , opacity:number) => {
  return new L.DivIcon({
    className: "custom-marker-icon",
    html: `
      <div style="
        background-color: ${color};
        opacity: ${opacity};
        width: 2rem;
        height: 2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        color: white;
        font-weight: bold;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      ">${index}</div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  })
}

// Custom control for toggling directions
const DirectionsToggle = ({
  showDirections,
  toggleDirections,
}: {
  showDirections: boolean
  toggleDirections: () => void
}) => {
  return (
    <div className="absolute top-4 right-16 z-[1000]">
      <button
        onClick={toggleDirections}
        className="bg-white p-2 rounded-md shadow-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary"
        title={showDirections ? "Hide directions" : "Show directions"}
      >
        {showDirections ? (
          <MapOff className="h-5 w-5 text-slate-700" />
        ) : (
          <Directions className="h-5 w-5 text-slate-700" />
        )}
      </button>
    </div>
  )
}

// Component to handle routing and map controls
function MapController({
  center,
  zoom,
  markers,
  selectedDay,
  showDirections,
  onRouteCalculated,
  isRoutingLoaded,
}: {
  center: [number, number]
  zoom: number
  markers: ActivityMarker[]
  selectedDay: number
  showDirections: boolean
  onRouteCalculated: (routes: RouteInfo[]) => void
  isRoutingLoaded: boolean
}) {
  const map = useMap()
  const routingControlRef = useRef<any>(null)
  const carRoutingControlRef = useRef<any>(null)
  const dayMarkersRef = useRef<ActivityMarker[]>([])
  const routeCalculatedRef = useRef(false)

  // Add zoom control properly
  useEffect(() => {
    const zoomControl = L.control.zoom({ position: "topright" })
    map.addControl(zoomControl)

    return () => {
      map.removeControl(zoomControl)
    }
  }, [map])

  // Update map center when selected activity changes
  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2) {
      map.flyTo(center, zoom, {
        duration: 1,
      })
    }
  }, [center, map, zoom])

  // Update routing when day markers change or showDirections changes
  useEffect(() => {
    // Only proceed if routing machine is loaded
    if (!isRoutingLoaded || !window.L || !window.L.Routing) {
      return
    }

    const dayMarkers = markers.filter((marker) => marker.day === selectedDay)

    // Only update if markers have changed or showDirections has changed
    if (
      JSON.stringify(dayMarkers) !== JSON.stringify(dayMarkersRef.current) ||
      routingControlRef.current?.options?.show !== showDirections
    ) {
      dayMarkersRef.current = dayMarkers
      routeCalculatedRef.current = false

      // Remove existing routing controls if they exist
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current)
        routingControlRef.current = null
      }

      if (carRoutingControlRef.current) {
        map.removeControl(carRoutingControlRef.current)
        carRoutingControlRef.current = null
      }

      // Add new routing if we have at least 2 markers
      if (dayMarkers.length >= 2) {
        const waypoints = dayMarkers.map((marker) => L.latLng(marker.position[0], marker.position[1]))

        // Visible walking routes
        routingControlRef.current = L.Routing.control({
          waypoints,
          routeWhileDragging: false,
          showAlternatives: false,
          fitSelectedRoutes: false,
          show: showDirections, // Show/hide directions panel based on state
          collapsible: true,
          lineOptions: {
            styles: [
              { color: "#6366f1", opacity: 0.8, weight: 4 },
              { color: "white", opacity: 0.3, weight: 6 },
            ],
          },
          createMarker: () => null, // Don't create default markers
          router: L.Routing.osrmv1({
            serviceUrl: "https://router.project-osrm.org/route/v1",
            profile: "walking", // Use walking profile by default
          }),
        }).addTo(map)

        // Apply custom styling to the directions container
        if (routingControlRef.current && routingControlRef.current._container) {
          routingControlRef.current._container.className += " leaflet-routing-container-custom"
        }

        // Hidden car routes for time calculation
        carRoutingControlRef.current = L.Routing.control({
          waypoints,
          routeWhileDragging: false,
          showAlternatives: false,
          fitSelectedRoutes: false,
          show: false, // Always hide this control
          createMarker: () => null,
          router: L.Routing.osrmv1({
            serviceUrl: "https://router.project-osrm.org/route/v1",
            profile: "car", // Use car profile for time calculation
          }),
        })

        // Don't add to map, just calculate routes
        carRoutingControlRef.current.route()

        // Listen for route calculation completion
        carRoutingControlRef.current.on("routesfound", (e: any) => {
          if (routeCalculatedRef.current) return // Prevent duplicate calculations

          const routes = e.routes
          if (routes && routes.length > 0) {
            routeCalculatedRef.current = true

            // Extract route information
            const routeInfos: RouteInfo[] = []
            const route = routes[0]

            // Process each segment between consecutive waypoints
            for (let i = 0; i < dayMarkers.length - 1; i++) {
              const fromMarker = dayMarkers[i]
              const toMarker = dayMarkers[i + 1]

              if (fromMarker && toMarker) {
                // Find the corresponding segment in the route
                // For simplicity, we'll use the direct segment between these waypoints
                const fromWaypointIndex = i
                const toWaypointIndex = i + 1

                // Extract the segment from the route summary
                if (route.waypoints && route.waypoints.length > toWaypointIndex) {
                  // Calculate segment distance and time
                  // We'll use the coordinates to find the segment in the route
                  const fromCoord = L.latLng(fromMarker.position[0], fromMarker.position[1])
                  const toCoord = L.latLng(toMarker.position[0], toMarker.position[1])

                  // Find the instructions that correspond to this segment
                  let segmentDistance = 0
                  let segmentTime = 0

                  // For simplicity, we'll estimate based on the total and number of segments
                  // This is a fallback if we can't get precise segment data
                  if (route.summary) {
                    // Get the direct distance between points (in meters)
                    const directDistance = fromCoord.distanceTo(toCoord)

                    // Calculate what portion of the total route this segment represents
                    const routeTotalDistance = route.summary.totalDistance
                    const segmentRatio = directDistance / routeTotalDistance

                    // Apply this ratio to get estimated time and distance
                    segmentDistance = directDistance
                    segmentTime = route.summary.totalTime * segmentRatio

                    routeInfos.push({
                      fromId: fromMarker.id,
                      toId: toMarker.id,
                      distance: Math.round(segmentDistance / 100) / 10, // Convert to km with 1 decimal
                      time: Math.max(1, Math.round(segmentTime / 60)), // Convert to minutes, minimum 1 minute
                    })
                  }
                }
              }
            }

            onRouteCalculated(routeInfos)
          }
        })
      }
    }
  }, [map, markers, selectedDay, showDirections, onRouteCalculated, isRoutingLoaded])

  return null
}

export type RouteInfo = {
  fromId: number
  toId: number
  distance: number // in km
  time: number // in minutes
}

type ActivityMarker = {
  id: number
  position: [number, number]
  name: string
  day: number
  index?: number // Activity index within the day
}

type TripMapProps = {
  markers: ActivityMarker[]
  selectedDay: number
  selectedActivity: number | null
  onMarkerClick: (id: number) => void
  onRouteCalculated: (routes: RouteInfo[]) => void
}

export default function TripMap({
  markers,
  selectedDay,
  selectedActivity,
  onMarkerClick,
  onRouteCalculated,
}: TripMapProps) {
  const [mapCenter, setMapCenter] = useState<[number, number]>([35.6762, 139.6503])
  const [mapZoom, setMapZoom] = useState(12)
  const [isRoutingLoaded, setIsRoutingLoaded] = useState(false)
  const [showDirections, setShowDirections] = useState(false)
  const scriptLoadAttemptedRef = useRef(false)

  // Filter markers for the selected day and add index property
  const dayMarkers =
    markers
      ?.filter((marker) => marker.day === selectedDay)
      .map((marker, index) => ({
        ...marker,
        index: index + 1, // Add 1-based index for display
      })) || []

  // Update map center when selected activity changes
  useEffect(() => {
    if (selectedActivity && markers) {
      const marker = markers.find((m) => m.id === selectedActivity)
      if (marker && marker.position) {
        setMapCenter(marker.position)
        setMapZoom(15)
      }
    } else if (dayMarkers.length > 0 && dayMarkers[0].position) {
      // Center on the first activity of the day if no activity is selected
      setMapCenter(dayMarkers[0].position)
      setMapZoom(13)
    }
  }, [selectedActivity, dayMarkers, markers])

  // Load Leaflet Routing Machine script
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === "undefined" || !document) {
      return
    }

    // Prevent multiple load attempts
    if (scriptLoadAttemptedRef.current) {
      return
    }

    scriptLoadAttemptedRef.current = true

    const loadRoutingMachine = async () => {
      try {
        // Check if script is already loaded
        if (window.L && window.L.Routing) {
          setIsRoutingLoaded(true)
          return
        }

        // Add Leaflet Routing Machine script
        const script = document.createElement("script")
        script.src = "https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js"
        script.async = true
        script.onload = () => {
          console.log("Leaflet Routing Machine loaded")
          setIsRoutingLoaded(true)
        }
        script.onerror = (e) => {
          console.error("Failed to load Leaflet Routing Machine:", e)
        }

        // Add CSS
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css"

        // Add custom CSS for the directions panel
        const customStyles = document.createElement("style")
        customStyles.textContent = `
          .leaflet-routing-container-custom {
            background-color: white;
            padding: 10px;
            border-radius: 4px;
            box-shadow: 0 1px 5px rgba(0,0,0,0.2);
            max-height: 70vh;
            overflow-y: auto;
            width: 320px;
            font-family: ui-sans-serif, system-ui, sans-serif;
          }
          .leaflet-routing-alt {
            max-height: none;
          }
          .leaflet-routing-alt h2 {
            font-size: 1rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #1e293b;
          }
          .leaflet-routing-alt h3 {
            font-size: 0.875rem;
            font-weight: 500;
            color: #475569;
          }
          .leaflet-routing-icon {
            background-color: #6366f1;
            border-radius: 50%;
          }
          .leaflet-routing-alt tr:hover {
            background-color: #f1f5f9;
          }
        `

        // Safely append elements to document
        if (document.head) {
          document.head.appendChild(link)
          document.head.appendChild(customStyles)
        }

        if (document.body) {
          document.body.appendChild(script)
        }
      } catch (error) {
        console.error("Failed to load Leaflet Routing Machine:", error)
      }
    }

    loadRoutingMachine()

    // We don't need to clean up the script and styles on unmount
    // as they should persist for the entire session
  }, [])

  const toggleDirections = () => {
    setShowDirections((prev) => !prev)
  }

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: "100%", width: "100%", zIndex: 10 }}
        zoomControl={false}
        className="relative z-10"
        key={`map-${selectedDay}`} // Force re-render when day changes
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Controller to handle map center changes and routing */}
        <MapController
          center={mapCenter}
          zoom={mapZoom}
          markers={markers}
          selectedDay={selectedDay}
          showDirections={showDirections}
          onRouteCalculated={onRouteCalculated}
          isRoutingLoaded={isRoutingLoaded}
        />

        {/* Markers - only render valid markers */}
        {markers &&
          markers.map((marker) => {
            if (!marker || !marker.position || !Array.isArray(marker.position) || marker.position.length !== 2) {
              return null
            }

            const isSelected = marker.id === selectedActivity
            const isCurrentDay = marker.day === selectedDay

            // Find the index of this marker within its day's activities
            const dayIndex = isCurrentDay ? dayMarkers.findIndex((m) => m.id === marker.id) + 1 : 0

            // Different colors for different states
            let markerColor = "#94a3b8" // Default gray for other days
            let markerOpacity = 0
            if (isCurrentDay) {
              markerColor = "#6366f1" // Primary color for current day
              markerOpacity=1
              if (isSelected) {
                markerColor = "#4338ca" // Darker primary for selected
              }
            }

            return (
              <LeafletMarker
                key={marker.id}
                position={marker.position}
                icon={createMarkerIcon(markerColor, dayIndex,markerOpacity)}
                eventHandlers={{
                  click: () => {
                    onMarkerClick(marker.id)
                  },
                }}
                opacity={isCurrentDay ? 1 : 0.6}
              >
                <Popup>
                  <div className="text-center">
                    <div className="font-medium">{marker.name}</div>
                    <div className="text-xs text-slate-500">
                      Day {marker.day}, Stop {dayIndex}
                    </div>
                  </div>
                </Popup>
              </LeafletMarker>
            )
          })}
      </MapContainer>

      {/* Directions toggle button */}
      <DirectionsToggle showDirections={showDirections} toggleDirections={toggleDirections} />
    </div>
  )
}
