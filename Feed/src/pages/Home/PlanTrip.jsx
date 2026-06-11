import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Earth from '../../public/Earth.png';
import { TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

export default function PlanTrip() {
    return (
        <Box position="relative" height="100vh">
            {/* Fixed Image */}
            <Box
                component="img"
                src={Earth}
                alt="Earth"
                sx={{
                    position: 'fixed',
                    top: 0,
                    display: 'block',
                    alignItems: 'center',
                    width: '80%',
                    height: 'auto',

                }}
            />

            {/* Content */}
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                sx={{
                    zIndex: 1,
                    position: 'relative',
                    height: '100%',
                    padding: '20px',
                    color: 'white', // Optional, for contrast
                }}
            >
                {/* Typography */}
                <Typography variant="h4" gutterBottom>
                    Plan Your Next Trip
                </Typography>

                {/* Select boxes */}
                <Grid container spacing={2} justifyContent="center" mb={2}>
                    <Grid item>
                        <FormControl variant="outlined" sx={{ minWidth: 150 }}>
                            <InputLabel>Destination</InputLabel>
                            <Select defaultValue="" label="Destination">
                                <MenuItem value="location1">Location 1</MenuItem>
                                <MenuItem value="location2">Location 2</MenuItem>
                                <MenuItem value="location3">Location 3</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <FormControl variant="outlined" sx={{ minWidth: 150 }}>
                            <InputLabel>Travel Dates</InputLabel>
                            <Select defaultValue="" label="Travel Dates">
                                <MenuItem value="dates1">Dates 1</MenuItem>
                                <MenuItem value="dates2">Dates 2</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                {/* Search Bar */}
                <Box mt={2}>
                    <TextField
                        label="Search for destinations"
                        variant="outlined"
                        fullWidth
                        sx={{ maxWidth: 400 }}
                    />
                </Box>
            </Box>
        </Box>
    );
}
