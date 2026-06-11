"use client"

import { useState, useEffect, useRef, lazy, Suspense } from "react"
import { useLocation, useParams, useNavigate } from "react-router-dom"
// import { ChevronLeft, ChevronRight, Calendar, Clock, Compass, Activity, Car } from "lucide-react"
import { ChevronLeft, ChevronRight, Calendar, Clock, Compass, Activity, Car, Luggage, Info, AlertTriangle, Save, Loader } from "lucide-react"
import { Badge } from "../../../components/ui/badge"
import { Card, CardContent, CardHeader } from "../../../components/ui/card"
import CountryInfoModal from "./country-info-modal"
import PackingListModal from "./packing-list-modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Button } from "../../../components/ui/button"
import type { RouteInfo } from "./trip-map"
import { tripService } from "../../../services/networkService"
import "./globals.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Add global type for Leaflet Routing Machine
declare global {
  interface Window {
    L: any
  }
}

// Types for trip data
interface Activity {
  id: number;
  time: string;
  time_window: string;
  place: string;
  description: string;
  duration: string;
  notes: string;
  place_label?: string;
  parent_label?: string;
  latitude?: number;
  longitude?: number;
  image_url?: string;
  location?: {
    longitude: string;
    latitude: string;
    city: string;
    country: string;
    countryId: number;
    image_url: string;
  };
}

interface Day {
  day: number;
  activities: Activity[];
}

interface TripPlanData {
  trip_name: string;
  destination: string;
  duration_days: number;
  trip_style: string;
  pace: string;
  traveler_preferences?: string[];
  itinerary: Day[];
  estimated_costs?: {
    currency: string;
    accommodation: string;
    meals: string;
    transportation: string;
    activities: string;
    total_estimate: string;
  };
  travel_tips?: string[];
}

interface TripDetails {
  days: number;
  preferences: string[];
  id?: number;
  start_date?: string;
  end_date?: string;
  status?: string;
}

interface Destination {
  country: string;
  city: string;
  weather?: {
    data: {
      main: {
        temp: number;
        humidity: number;
      };
      weather: Array<{
        main: string;
        description: string;
        icon: string;
      }>;
    };
  };
}

interface LocationState {
  tripDetails: TripDetails;
  tripPlan: {
    data: TripPlanData;
  };
  destination: Destination;
  visaRequirements?: any;
  currencyInfo?: any;
  electricalInfo?: any;
  packingList?: any;
}

interface ApiTripResponse {
  success: boolean;
  data: {
    tripDetails: {
      id: number;
      trip_name: string;
      destination: string;
      duration_days: number;
      trip_style: string;
      pace: string;
      start_date: string;
      end_date: string;
      status: string;
    };
    itinerary: Day[];
  };
}

// Lazy load the map component to avoid SSR issues with Leaflet
const TripMap = lazy(() => import("./trip-map"))

export default function TripPlanner() {
  const location = useLocation();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [tripData, setTripData] = useState<LocationState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null);
  const [isCountryModalOpen, setIsCountryModalOpen] = useState(false);
  const [isPackingListModalOpen, setIsPackingListModalOpen] = useState(false);
  const [routeInfos, setRouteInfos] = useState<RouteInfo[]>([]);
  const scriptLoadAttemptedRef = useRef(false);
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);

  // Determine if we're viewing from MyTrips (has ID) or from trip planner results (no ID)
  const isFromMyTrips = Boolean(id);

  // Initialize data from either API or state
  useEffect(() => {
    const initializeData = async () => {
      try {
        if (id) {
          // Fetch from API if we have an ID
          const response = await tripService.getTrip(parseInt(id));
          console.log('Full API Response:', response); // Debug log
          console.log('API Response Data:', response.data); // Debug log
          console.log('API Response Status:', response.status); // Debug log

          // Check if response is empty or has error
          if (!response.data) {
            console.error('Empty API response');
            throw new Error('No data received from API');
          }

          // Check response status
          if (response.status !== 200) {
            console.error('API returned non-200 status:', response.status);
            throw new Error(`API returned status ${response.status}`);
          }

          // Handle different possible response structures
          let tripDetails, itinerary, destination, packingList, visaRequirements, currencyInfo, electricalInfo;

          if (response.data.data) {
            // Structure: { success: true, data: { tripDetails: {...}, tripPlan: {data: {...}}, destination: {...} } }
            tripDetails = response.data.data.tripDetails;
            itinerary = response.data.data.tripPlan?.data?.itinerary;
            destination = response.data.data.destination;
            packingList = response.data.data.packingList;
            visaRequirements = response.data.data.visaRequirements;
            currencyInfo = response.data.data.currencyInfo;
            electricalInfo = response.data.data.electricalInfo;
          } else if (response.data.tripDetails) {
            // Alternative structure: { tripDetails: {...}, itinerary: [...] }
            tripDetails = response.data.tripDetails;
            itinerary = response.data.itinerary;
            destination = response.data.destination;
            packingList = response.data.packingList;
            visaRequirements = response.data.visaRequirements;
            currencyInfo = response.data.currencyInfo;
            electricalInfo = response.data.electricalInfo;
          } else {
            // Direct structure: { tripDetails: {...}, itinerary: [...] }
            tripDetails = response.data;
            itinerary = response.data.itinerary;
            destination = response.data.destination;
            packingList = response.data.packingList;
            visaRequirements = response.data.visaRequirements;
            currencyInfo = response.data.currencyInfo;
            electricalInfo = response.data.electricalInfo;
          }

          // Validate required data
          if (!tripDetails || !itinerary) {
            console.error('Missing required data in API response:', response.data);
            console.error('Trip Details:', tripDetails);
            console.error('Itinerary:', itinerary);
            throw new Error('Missing required trip data in API response');
          }



          // Transform API response to match the expected format
          const transformedData: LocationState = {
            tripDetails: {
              days: tripDetails.days || tripDetails.duration_days,
              preferences: tripDetails.preferences || [],
              id: tripDetails.id,
              start_date: tripDetails.start_date,
              end_date: tripDetails.end_date,
              status: tripDetails.status
            },
            tripPlan: {
              data: {
                trip_name: tripDetails.trip_name || 'Trip',
                destination: destination?.city && destination?.country ? `${destination.city}, ${destination.country}` : 'Unknown Destination',
                duration_days: tripDetails.days || tripDetails.duration_days,
                trip_style: tripDetails.trip_style || 'moderate',
                pace: tripDetails.pace || 'moderate',
                itinerary: itinerary.map((day: any) => ({
                  day: day.day,
                  activities: day.activities.map((activity: any) => ({
                    ...activity,
                    // Handle both old and new location formats
                    latitude: activity.latitude || (activity.location ? parseFloat(activity.location.latitude) : 0),
                    longitude: activity.longitude || (activity.location ? parseFloat(activity.location.longitude) : 0),
                    image_url: activity.image_url || activity.location?.image_url || '',
                    place_label: activity.place_label || 'Attraction',
                    parent_label: activity.parent_label || 'Tourism'
                  }))
                }))
              }
            },
            destination: {
              country: destination?.country || itinerary[0]?.activities[0]?.location?.country || 'Unknown',
              city: destination?.city || itinerary[0]?.activities[0]?.location?.city || 'Unknown',
              weather: destination?.weather
            },
            visaRequirements,
            currencyInfo,
            electricalInfo,
            packingList
          };



          setTripData(transformedData);
        } else if (location.state) {
          // Use state data if available
          setTripData(location.state);
        } else {
          setError('No trip data available');
        }
      } catch (err) {
        setError('Failed to fetch trip data');
        console.error('Error initializing trip:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [id, location.state]);

  // Check for data availability
  useEffect(() => {
    if (!isLoading && !tripData) {
      setError('No trip data available');
    }
  }, [isLoading, tripData]);

  // Load Leaflet Routing Machine script globally to ensure it's available for all components
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === "undefined" || !document) {
      return;
    }

    // Prevent multiple load attempts
    if (scriptLoadAttemptedRef.current) {
      return;
    }

    scriptLoadAttemptedRef.current = true;

    // Check if the script is already loaded
    if (window.L && window.L.Routing) {
      return;
    }

    try {
      // Add script to head
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js";
      script.async = true;
      script.id = "leaflet-routing-machine";

      // Add CSS
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css";
      link.id = "leaflet-routing-machine-css";

      // Safely append elements to document
      if (document.head) {
        document.head.appendChild(link);
      }

      if (document.body) {
        document.body.appendChild(script);
      }
    } catch (error) {
      console.error("Failed to load Leaflet Routing Machine:", error);
    }
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Loading trip data...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  if (!tripData?.tripPlan?.data || !tripData?.tripDetails) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl text-red-600">No trip data available</div>
      </div>
    );
  }

  const handleDayChange = (day: number) => {
    setSelectedDay(day);
    setSelectedActivity(null);
    setRouteInfos([]); // Clear route infos when changing day
  };

  const handleActivityClick = (activityId: number) => {
    setSelectedActivity(activityId);
  };

  const handleRouteCalculated = (routes: RouteInfo[]) => {
    setRouteInfos(routes);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Transform the trip data to match the expected format
      const places = tripData.tripPlan.data.itinerary.flatMap((day: { day: number; activities: any[] }) =>
        day.activities.map((activity: { id: number; notes: string; time: string }) => ({
          id: activity.id,
          notes: activity.notes || "",
          time: activity.time,
          day: day.day
        }))
      );

      const tripDataToSave = {
        tripDescription: tripData.tripPlan.data.trip_name,
        startTime: tripData.tripDetails.start_date || location.state?.startDate,
        endTime: tripData.tripDetails.end_date || location.state?.endDate,
        tripStyle: (location.state?.tripStyle || tripData.tripPlan.data.trip_style).toLowerCase(),
        tripPace: tripData.tripPlan.data.pace.toLowerCase(),
        places: places,
        destinationCountry: tripData.destination.country,
        destinationCity: tripData.destination.city,
        packingList: tripData.packingList
      };

      const response = await tripService.createTrip(tripDataToSave);
      if (response.data.success) {
        toast.success("🎉 Trip saved successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        setTimeout(() => {
          navigate('/my-trips');
        }, 1200); // Delay to allow toast to show
        // Do not re-enable button, user is leaving
      } else {
        setIsSaving(false);
        throw new Error("Failed to save trip");
      }
    } catch (error) {
      setIsSaving(false);
      console.error('Error saving trip:', error);
      toast.error("Failed to save trip. Please try again.");
    }
  };

  const handlePackingListSave = (updatedPackingList: any) => {
    // Update the trip data with the new packing list without refreshing the entire trip
    setTripData(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        packingList: updatedPackingList
      };
    });
  };

  const currentDayActivities = tripData.tripPlan.data.itinerary.find((day) => day.day === selectedDay)?.activities || [];

  // Transform activities to include position data for markers
  const allMarkers = tripData.tripPlan.data.itinerary.flatMap((day) =>
    day.activities.map((activity) => ({
      id: activity.id,
      position: [
        activity.latitude || (activity.location ? parseFloat(activity.location.latitude) : 0),
        activity.longitude || (activity.location ? parseFloat(activity.location.longitude) : 0)
      ] as [number, number],
      name: activity.place,
      day: day.day,
    }))
  );

  // Find route info for a specific activity
  const getRouteInfoForActivity = (activityId: number) => {
    return routeInfos.find((route) => route.toId === activityId);
  };

  return (
    <div className="flex flex-col h-screen mt-16">
      {/* Header */}
      <header className="bg-white border-b shadow-sm p-4 z-10">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">{tripData.tripPlan.data.trip_name}</h1>
              <div className="flex items-center mt-1">
                <button
                  onClick={() => setIsCountryModalOpen(true)}
                  className="text-slate-600 hover:text-slate-900 hover:underline focus:outline-none"
                  type="button"
                >
                  {tripData.tripPlan.data.destination}
                </button>
              </div>
            </div>
            {!isFromMyTrips && (
              <Button
                onClick={handleSave}
                size="sm"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white flex items-center gap-2 shadow-md hover:scale-105 transition-transform duration-150 font-semibold px-6 py-2 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isSaving}
              >
                {isSaving && <Loader className="animate-spin mr-2 w-4 h-4" />}
                <Save className="h-4 w-4" />
                Save Trip
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Left panel */}
        <div className="w-full md:w-2/5 lg:w-1/3 overflow-y-auto p-4 bg-slate-50">
          <div className="space-y-6">
            {/* Trip details */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center justify-center p-3 bg-slate-100 rounded-lg text-center">
                    <Calendar className="h-5 w-5 text-slate-600 mb-1" />
                    <span className="text-xs text-slate-500">Duration</span>
                    <span className="font-medium text-sm">{tripData.tripPlan.data.duration_days} days</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 bg-slate-100 rounded-lg text-center">
                    <Compass className="h-5 w-5 text-slate-600 mb-1" />
                    <span className="text-xs text-slate-500">Style</span>
                    <span className="font-medium text-sm">{tripData.tripPlan.data.trip_style}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 bg-slate-100 rounded-lg text-center">
                    <Activity className="h-5 w-5 text-slate-600 mb-1" />
                    <span className="text-xs text-slate-500">Pace</span>
                    <span className="font-medium text-sm">{tripData.tripPlan.data.pace}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            {tripData.tripPlan.data.traveler_preferences && tripData.tripPlan.data.traveler_preferences.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-slate-700 mb-2">Traveler Preferences</h3>
                <div className="flex flex-wrap gap-2">
                  {tripData.tripPlan.data.traveler_preferences.map((preference) => (
                    <Badge
                      key={preference}
                      variant="secondary"
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700"
                    >
                      {preference}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Weather */}
            {tripData.destination?.weather && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-slate-700 mb-2">Current Weather</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">{Math.round(tripData.destination.weather.data.main.temp)}°C</div>
                      <div className="text-sm text-slate-500">{tripData.destination.weather.data.weather[0].description}</div>
                    </div>
                    <img
                      src={`http://openweathermap.org/img/w/${tripData.destination.weather.data.weather[0].icon}.png`}
                      alt={tripData.destination.weather.data.weather[0].description}
                      className="w-16 h-16"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Itinerary */}
            <div>
              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPackingListModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 min-w-[140px]"
                >
                  <Luggage className="h-4 w-4" />
                  Packing List
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCountryModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 min-w-[140px]"
                >
                  <Info className="h-4 w-4" />
                  Country Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => alert("Travel Cautions - Coming Soon!")}
                  className="flex items-center gap-2 px-4 py-2 min-w-[140px]"
                >
                  <AlertTriangle className="h-4 w-4" />
                  Cautions
                </Button>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-800">Itinerary</h2>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-slate-700">Select Day</h3>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDayChange(Math.max(1, selectedDay - 1))}
                      disabled={selectedDay === 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Previous day</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDayChange(Math.min(tripData.tripPlan.data.itinerary.length, selectedDay + 1))}
                      disabled={selectedDay === tripData.tripPlan.data.itinerary.length}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                      <span className="sr-only">Next day</span>
                    </Button>
                  </div>
                </div>

                <Select
                  value={selectedDay.toString()}
                  onValueChange={(value) => handleDayChange(Number(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a day" />
                  </SelectTrigger>
                  <SelectContent>
                    {tripData.tripPlan.data.itinerary.map((day) => (
                      <SelectItem key={day.day} value={day.day.toString()}>
                        Day {day.day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Current day activities */}
              <div className="space-y-4">
                {currentDayActivities.map((activity, index) => {
                  const routeInfo = getRouteInfoForActivity(activity.id);

                  return (
                    <Card
                      key={activity.id}
                      className={`overflow-hidden transition-all ${selectedActivity === activity.id ? "ring-2 ring-primary" : ""
                        }`}
                      onClick={() => handleActivityClick(activity.id)}
                    >
                      <CardHeader className="p-0">
                        <div className="relative h-48 w-full">
                          <img
                            src={activity.image_url || activity.location?.image_url || ''}
                            alt={`View of ${activity.place}`}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-slate-800/70 text-white text-xs px-2 py-1 rounded">
                            {activity.time_window}
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/80 to-transparent p-4">
                            <div className="flex items-center">
                              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center mr-3 flex-shrink-0 ">
                                {index + 1}
                              </div>
                              <div>
                                <h3 className="font-medium text-white">{activity.place}</h3>
                                <div className="flex items-center text-sm text-slate-200 mt-1">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {activity.time}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="p-4">
                        <p className="text-sm text-slate-600 mb-3">{activity.description}</p>

                        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                          <div className="bg-slate-50 p-2 rounded">
                            <span className="block text-slate-500">Duration</span>
                            <span className="font-medium">{activity.duration}</span>
                          </div>
                          <div className="bg-slate-50 p-2 rounded">
                            <span className="block text-slate-500">Type</span>
                            <span className="font-medium">{activity.place_label || 'Attraction'}</span>
                          </div>
                        </div>

                        {routeInfo && (
                          <div className="bg-slate-50 p-2 rounded text-xs mb-3 flex items-center">
                            <Car className="h-3 w-3 text-slate-500 mr-1.5" />
                            <span className="font-medium">
                              {routeInfo.time} min by car ({routeInfo.distance} km)
                            </span>
                          </div>
                        )}

                        {activity.notes && (
                          <div className="bg-amber-50 p-2 rounded text-xs text-amber-800 border border-amber-100">
                            <span className="font-medium">Note:</span> {activity.notes}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          {allMarkers.length > 0 && (
            <Suspense fallback={
              <div className="h-full w-full flex items-center justify-center bg-muted ">
                <div className="text-muted-foreground">Loading map...</div>
              </div>
            }>
              <TripMap
                markers={allMarkers}
                selectedDay={selectedDay}
                selectedActivity={selectedActivity}
                onMarkerClick={handleActivityClick}
                onRouteCalculated={handleRouteCalculated}
              />
            </Suspense>
          )}
        </div>
      </div>

      {/* Country Info Modal */}
      <CountryInfoModal
        isOpen={isCountryModalOpen}
        onClose={() => setIsCountryModalOpen(false)}
        country={tripData.destination.country}
        city={tripData.destination.city}
      />

      {/* Packing List Modal */}
      <PackingListModal
        isOpen={isPackingListModalOpen}
        onClose={() => setIsPackingListModalOpen(false)}
        packingList={tripData.packingList}
        tripId={id ? parseInt(id) : undefined}
        userId={localStorage.getItem('id') || undefined}
        onSave={handlePackingListSave}
        showSaveButton={isFromMyTrips}
      />
    </div>
  );
}
