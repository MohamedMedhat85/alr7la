import { Box, Grid, Typography, Divider, } from '@mui/material';
import Logo from '../../assets/images/Logo.png'; // Adjust the path as necessary

export default function Footer() {
    return (
        <Box sx={{ px: 4, py: 6 }}>
            <Grid container spacing={4} alignItems="stretch" justifyContent="center">
                {/* Logo and Welcome Text */}
                <Grid item xs={12} md={3} >
                    <Box
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                        }}
                    >
                        <Box
                            component="img"
                            src={Logo}
                            alt="Logo"
                            sx={{
                                width: '200px',
                                height: 'auto',
                                cursor: 'pointer',
                                transition: 'transform 0.3s ease',
                                marginBottom: '1rem',
                                '&:hover': {
                                    transform: 'scale(1.2)',
                                    transformOrigin: 'center',
                                    transition: 'transform 0.3s ease',
                                },
                            }}
                        />
                        <Typography variant="body2" color="text.secondary" >
                            Welcome to ALR7LA, where we combine the power of AI with your travel preferences.
                            Our platform helps you plan the perfect trip. With personalized recommendations,
                            we ensure you find exactly what you&apos;re looking for, making every journey memorable.
                        </Typography>
                    </Box>
                </Grid>

                {/* Divider */}
                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block', marginLeft: '3rem' } }} />
                {/* AI Bot Section */}
                <Grid item xs={12} md={3}>
                    <Box
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center'
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            ALR7LA AI BOT
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Our AI works by letting you select your travel preferences, and then it generates a
                            custom trip based on those choices. It&apos;s like having a personal travel assistant
                            who understands exactly what you&apos;re looking for and builds the ideal journey.
                        </Typography>
                    </Box>
                </Grid>

                {/* Divider */}
                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block', marginLeft: '3rem' } }} />

                {/* Social Media Section */}
                <Grid item xs={12} md={3}>
                    <Box
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center'
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Social Media Platform
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Share your travel stories, connect with friends, and get inspired by fellow travelers
                            on our social media platform. Post your trips, exchange tips, and discover new places
                            as part of a community of adventure seekers.
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
