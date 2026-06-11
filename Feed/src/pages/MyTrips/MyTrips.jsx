import React, { useState, useEffect } from 'react';
import { Plane, MapPin, Calendar, Plus, Search, Trash2, Edit3, Heart, Share2, Eye, Luggage } from 'lucide-react';
import { tripService } from '../../services/networkService';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import PackingListModal from '../TripPlanner/result/packing-list-modal';

const MyTrips = () => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [tripToDelete, setTripToDelete] = useState(null);
    const [isPackingListModalOpen, setIsPackingListModalOpen] = useState(false);
    const [selectedTripData, setSelectedTripData] = useState(null);

    // Fetch trips from backend
    useEffect(() => {
        const fetchTrips = async () => {
            try {
                setLoading(true);
                const userId = authService.getUserId();

                if (!userId) {
                    setError('User not authenticated');
                    setLoading(false);
                    return;
                }

                const response = await tripService.getUserTrips(userId);

                if (response.data.success) {
                    console.log("TESTTTTT", response.data);
                    // Transform backend data to match frontend structure
                    const transformedTrips = response.data.userTrips?.map(userTrip => ({
                        id: userTrip.id,
                        Trip: {
                            id: userTrip.Trip.id,
                            title: userTrip.Trip.trip_description || 'Untitled Trip',
                            destination: (userTrip.Trip.city || '') + ',' + ' ' + (userTrip.Trip.country || ''),
                            startDate: userTrip.Trip.start_time,
                            endDate: userTrip.Trip.end_time,
                            status: userTrip.Trip.trip_status || 'planning',
                            image: getTripImage(userTrip.Trip.country)
                        }
                    })) || []; // Default to empty array if userTrips is null/undefined

                    setTrips(transformedTrips);
                } else {
                    // Check if it's a "no trips" scenario vs actual error
                    if (response.data.message && response.data.message.toLowerCase().includes('no trips')) {
                        setTrips([]); // Set empty array instead of error
                    } else {
                        setError(response.data.message || 'Failed to fetch trips');
                    }
                }
            } catch (error) {
                console.error('Error fetching trips:', error);
                // Only set error for actual network/server errors
                if (error.response?.status === 404 || error.message.includes('no trips')) {
                    setTrips([]); // Treat 404 or "no trips" as empty state
                } else {
                    setError('Failed to load trips. Please try again.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, []);

    // Helper function to get trip image
    const countryImages = {
        "Egypt": "https://images.unsplash.com/photo-1666203598975-3bc09959a746?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "Switzerland": "https://images.unsplash.com/photo-1618493075021-1bbe5deebedf?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "Greece": "https://images.unsplash.com/photo-1603288986817-7973bc90d346?q=80&w=2068&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "Turkey": "https://images.unsplash.com/photo-1662584772997-01a8be747ad6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    };
    const getTripImage = (country) => {
        return countryImages[country] || "https://default-image-link.jpg";
    };

    const handleDeleteTrip = async (tripId) => {
        try {
            const response = await tripService.deleteTrip(tripId);

            if (response.data.success) {
                setTrips(prevTrips => prevTrips.filter(trip => trip.Trip.id !== tripId));
            } else {
                setError('Failed to delete trip');
            }
        } catch (error) {
            console.error('Error deleting trip:', error);
            setError('Failed to delete trip. Please try again.');
        }
    };

    const handleOpenPackingList = async (tripId) => {
        try {
            const response = await tripService.getTrip(tripId);
            if (response.data.success) {
                setSelectedTripData(response.data.data);
                setIsPackingListModalOpen(true);
            }
        } catch (error) {
            console.error('Error fetching trip data:', error);
            setError('Failed to load trip data for packing list.');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const filteredTrips = trips.filter(trip => {
        const matchesSearch = trip.Trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            trip.Trip.destination.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center pb-20 md:pb-0">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading your adventures...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center pb-20 md:pb-0">
                <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20 md:pb-0">
            {/* Header Section */}
            <div className="bg-white shadow-sm border-b border-gray-100 mt-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between mb-8 mt-4">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
                                <Plane className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900">My Trips</h1>
                                <p className="text-gray-600 mt-1">Manage and explore your travel adventures</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/trip-planner')}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                        >
                            <Plus className="h-5 w-5" />
                            <span>New Trip</span>
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6 mt-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search trips by destination or title..."
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Stats Card - Only Total Trips */}
                    <div className="mb-8 mt-8">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white max-w-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100">Total Trips</p>
                                    <p className="text-3xl font-bold">{trips.length}</p>
                                </div>
                                <Plane className="h-8 w-8 text-blue-200" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trips Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-8">
                {filteredTrips.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-gray-400 text-6xl mb-4">✈️</div>
                        <h3 className="text-2xl font-semibold text-gray-700 mb-2">No trips found</h3>
                        <p className="text-gray-500 mb-8">Start planning your next adventure!</p>
                        <button
                            onClick={() => navigate('/trip-planner')}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Plan Your First Trip
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                        {filteredTrips.map((userTrip) => (
                            <div key={userTrip.Trip.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                                {/* Trip Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={userTrip.Trip.image}
                                        alt={userTrip.Trip.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                {/* Trip Details */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                                        {userTrip.Trip.title}
                                    </h3>

                                    <div className="flex items-center text-gray-600 mb-3">
                                        <MapPin className="h-4 w-4 mr-2" />
                                        <span className="text-sm">{userTrip.Trip.destination}</span>
                                    </div>

                                    <div className="flex items-center text-gray-600 mb-6">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        <span className="text-sm">
                                            {formatDate(userTrip.Trip.startDate)} - {formatDate(userTrip.Trip.endDate)}
                                        </span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => navigate(`/trip-planner/${userTrip.Trip.id}`)}
                                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center space-x-2"
                                        >
                                            <Eye className="h-4 w-4" />
                                            <span>View Trip</span>
                                        </button>
                                        <button
                                            onClick={() => handleOpenPackingList(userTrip.Trip.id)}
                                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                                            title="Packing List"
                                        >
                                            <Luggage className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setTripToDelete(userTrip.Trip.id);
                                                setDeleteDialogOpen(true);
                                            }}
                                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            {deleteDialogOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
                    <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full text-center">
                        <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
                        <p className="mb-6">Are you sure you want to delete this trip?</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                className="bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
                                onClick={async () => {
                                    await handleDeleteTrip(tripToDelete);
                                    setDeleteDialogOpen(false);
                                    setTripToDelete(null);
                                }}
                            >
                                Yes
                            </button>
                            <button
                                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
                                onClick={() => {
                                    setDeleteDialogOpen(false);
                                    setTripToDelete(null);
                                }}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Packing List Modal */}
            {selectedTripData && (
                <PackingListModal
                    isOpen={isPackingListModalOpen}
                    onClose={() => {
                        setIsPackingListModalOpen(false);
                        setSelectedTripData(null);
                    }}
                    packingList={selectedTripData.packingList}
                    tripId={selectedTripData.tripDetails?.id}
                    userId={authService.getUserId()}
                    showSaveButton={true}
                />
            )}
        </div>
    );
};

export default MyTrips;