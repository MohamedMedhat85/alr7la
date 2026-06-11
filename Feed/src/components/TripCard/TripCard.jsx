import React from 'react';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Chip,
    Stack,
    IconButton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';

const TripCard = ({ trip, onDelete }) => {
    const theme = useTheme();
    const isDarkMode = theme.palette.mode === 'dark';
    const navigate = useNavigate();

    const handleTripClick = () => {
        navigate(`/trip-planner/result/${trip.id}`);
    };
    //trip-planner/result/id
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getTripDuration = (startTime, endTime) => {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays} ${diffDays === 1 ? 'Day' : 'Days'}`;
    };

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: isDarkMode ? 'linear-gradient(145deg, #2a2a2a, #1e1e1e)' : 'linear-gradient(145deg, #f5f5f5, #e0e0e0)',
                borderRadius: 2,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                },
            }}
        >
            <CardMedia
                component="img"
                height="200"
                image="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt={trip.trip_description}
                sx={{
                    objectFit: 'cover',
                    cursor: 'pointer',
                }}
                onClick={handleTripClick}
            />
            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Typography
                    variant="h6"
                    component="h2"
                    sx={{
                        color: isDarkMode ? '#E4E6EB' : '#1E1E1E',
                        mb: 1,
                        cursor: 'pointer',
                        '&:hover': {
                            color: '#147DFF',
                        },
                    }}
                    onClick={handleTripClick}
                >
                    {trip.trip_description}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    <Chip
                        icon={<CalendarTodayIcon />}
                        label={formatDate(trip.start_time)}
                        size="small"
                        sx={{
                            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : '#F0F2F5',
                            color: isDarkMode ? '#E4E6EB' : '#1E1E1E',
                        }}
                    />
                    <Chip
                        label={getTripDuration(trip.start_time, trip.end_time)}
                        size="small"
                        sx={{
                            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : '#F0F2F5',
                            color: isDarkMode ? '#E4E6EB' : '#1E1E1E',
                        }}
                    />
                </Stack>

                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    {trip.trip_style && (
                        <Chip
                            label={`${trip.trip_style.charAt(0).toUpperCase() + trip.trip_style.slice(1)} Style`}
                            size="small"
                            sx={{
                                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : '#F0F2F5',
                                color: isDarkMode ? '#E4E6EB' : '#1E1E1E',
                            }}
                        />
                    )}
                    {trip.trip_pace && (
                        <Chip   
                            label={`${trip.trip_pace.charAt(0).toUpperCase() + trip.trip_pace.slice(1)} Pace`}
                            size="small"
                            sx={{
                                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : '#F0F2F5',
                                color: isDarkMode ? '#E4E6EB' : '#1E1E1E',
                            }}
                        />
                    )}
                </Stack>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <IconButton
                        size="small"
                        onClick={() => onDelete(trip.id)}
                        sx={{
                            color: isDarkMode ? '#E4E6EB' : '#1E1E1E',
                            '&:hover': {
                                color: '#FF4444',
                                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
                            },
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </CardContent>
        </Card>
    );
};

export default TripCard; 