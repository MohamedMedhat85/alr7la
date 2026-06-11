import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Divider,
  Tooltip,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Autocomplete,
  CircularProgress,
  Fade,
  Slide,
  Paper,
  LinearProgress
} from '@mui/material';
import {
  CalendarMonth,
  Edit,
  Close,
  Cake,
  Public,
  Save,
  Person,
  Info,
  Favorite,
} from '@mui/icons-material';
import { profileService } from '../services/networkService';
import { useTheme } from '@mui/material/styles';
import FriendButton from './FriendButton';

// Update country data structure to include numeric IDs
const ALL_COUNTRIES_DATA = Object.entries({
  "AF": "Afghanistan", "AL": "Albania", "DZ": "Algeria", "AD": "Andorra", "AO": "Angola",
  "AG": "Antigua and Barbuda", "AR": "Argentina", "AM": "Armenia", "AU": "Australia", "AT": "Austria",
  "AZ": "Azerbaijan", "BS": "Bahamas", "BH": "Bahrain", "BD": "Bangladesh", "BB": "Barbados",
  "BY": "Belarus", "BE": "Belgium", "BZ": "Belize", "BJ": "Benin", "BT": "Bhutan",
  "BO": "Bolivia", "BA": "Bosnia and Herzegovina", "BW": "Botswana", "BR": "Brazil", "BN": "Brunei",
  "BG": "Bulgaria", "BF": "Burkina Faso", "BI": "Burundi", "CV": "Cabo Verde", "KH": "Cambodia",
  "CM": "Cameroon", "CA": "Canada", "CF": "Central African Republic", "TD": "Chad", "CL": "Chile",
  "CN": "China", "CO": "Colombia", "KM": "Comoros", "CG": "Congo (Brazzaville)", "CD": "Congo (Kinshasa)",
  "CR": "Costa Rica", "HR": "Croatia", "CU": "Cuba", "CY": "Cyprus", "CZ": "Czech Republic",
  "DK": "Denmark", "DJ": "Djibouti", "DM": "Dominica", "DO": "Dominican Republic", "EC": "Ecuador",
  "EG": "Egypt", "SV": "El Salvador", "GQ": "Equatorial Guinea", "ER": "Eritrea", "EE": "Estonia",
  "SZ": "Eswatini", "ET": "Ethiopia", "FJ": "Fiji", "FI": "Finland", "FR": "France",
  "GA": "Gabon", "GL": "Greenland", "GM": "Gambia", "GE": "Georgia", "DE": "Germany",
  "GH": "Ghana", "GR": "Greece", "GD": "Grenada", "GT": "Guatemala", "GN": "Guinea",
  "GW": "Guinea-Bissau", "GY": "Guyana", "HT": "Haiti", "HN": "Honduras", "HU": "Hungary",
  "IS": "Iceland", "IN": "India", "ID": "Indonesia", "IR": "Iran", "IQ": "Iraq",
  "IE": "Ireland", "IL": "Israel", "IT": "Italy", "JM": "Jamaica", "JP": "Japan",
  "JO": "Jordan", "KZ": "Kazakhstan", "KE": "Kenya", "KI": "Kiribati", "KP": "North Korea",
  "KR": "South Korea", "XK": "Kosovo", "KW": "Kuwait", "KG": "Kyrgyzstan", "LA": "Laos",
  "LV": "Latvia", "LB": "Lebanon", "LS": "Lesotho", "LR": "Liberia", "LY": "Libya",
  "LI": "Liechtenstein", "LT": "Lithuania", "LU": "Luxembourg", "MG": "Madagascar", "MW": "Malawi",
  "MY": "Malaysia", "MV": "Maldives", "ML": "Mali", "MT": "Malta", "MH": "Marshall Islands",
  "MR": "Mauritania", "MU": "Mauritius", "MX": "Mexico", "FM": "Micronesia", "MD": "Moldova",
  "MC": "Monaco", "MN": "Mongolia", "ME": "Montenegro", "MA": "Morocco", "MZ": "Mozambique",
  "MM": "Myanmar", "NA": "Namibia", "NR": "Nauru", "NP": "Nepal", "NL": "Netherlands",
  "NZ": "New Zealand", "NI": "Nicaragua", "NE": "Niger", "NG": "Nigeria", "MK": "North Macedonia",
  "NO": "Norway", "OM": "Oman", "PK": "Pakistan", "PW": "Palau", "PA": "Panama",
  "PG": "Papua New Guinea", "PY": "Paraguay", "PE": "Peru", "PH": "Philippines", "PL": "Poland",
  "PT": "Portugal", "QA": "Qatar", "RO": "Romania", "RU": "Russia", "RW": "Rwanda",
  "KN": "Saint Kitts and Nevis", "LC": "Saint Lucia", "VC": "Saint Vincent and the Grenadines", "WS": "Samoa",
  "SM": "San Marino", "ST": "Sao Tome and Principe", "SA": "Saudi Arabia", "SN": "Senegal",
  "RS": "Serbia", "SC": "Seychelles", "SL": "Sierra Leone", "SG": "Singapore", "SK": "Slovakia",
  "SI": "Slovenia", "SB": "Solomon Islands", "SO": "Somalia", "ZA": "South Africa", "SS": "South Sudan",
  "ES": "Spain", "LK": "Sri Lanka", "SD": "Sudan", "SR": "Suriname", "SE": "Sweden",
  "CH": "Switzerland", "SY": "Syria", "TW": "Taiwan", "TJ": "Tajikistan", "TZ": "Tanzania",
  "TH": "Thailand", "TL": "Timor-Leste", "TG": "Togo", "TO": "Tonga", "TT": "Trinidad and Tobago",
  "TN": "Tunisia", "TR": "Turkey", "TM": "Turkmenistan", "TV": "Tuvalu", "UG": "Uganda",
  "UA": "Ukraine", "AE": "United Arab Emirates", "GB": "United Kingdom", "US": "United States",
  "UY": "Uruguay", "UZ": "Uzbekistan", "VU": "Vanuatu", "VA": "Vatican City", "VE": "Venezuela",
  "VN": "Vietnam", "YE": "Yemen", "ZM": "Zambia", "ZW": "Zimbabwe"
}).map(([code, name], index) => ({
  id: index + 2,  // Numeric ID starting from 2 (shifted by +2)
  code,           // Alpha-2 code
  name            // Country name
}));

const AboutSection = ({ userData, refetchUserData, isOwnProfile }) => {
  const theme = useTheme();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [editedFields, setEditedFields] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Format date to "Month, Year" format
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Format birthdate to "Month Day, Year" format
  const formatBirthDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const preferenceOptions = [
    { id: 1, name: 'Adventure' },
    { id: 2, name: 'Art' },
    { id: 3, name: 'Café' },
    { id: 4, name: 'Children Activity' },
    { id: 5, name: 'Historic Landmark' },
    { id: 6, name: 'Hotel' },
    { id: 7, name: 'Museum' },
    { id: 8, name: 'Park' },
    { id: 9, name: 'Religious Landmark' },
    { id: 10, name: 'Restaurant' },
    { id: 11, name: 'Shop' },
    { id: 12, name: 'Sightseeing' },
    { id: 13, name: 'Sports Activity' },
    { id: 14, name: 'Theater' },
    { id: 15, name: 'Tourist Office' },
    { id: 16, name: 'Water Activity' }
  ];

  // Synchronize edits with current userData on open
  useEffect(() => {
    if (openEditDialog) {
      // Convert userData.labels to preference names for display
      const initialPreferences = userData.labels?.map(label => label.label_name) || [];

      setEditedUser({
        ...userData,
        preferences: initialPreferences
      });

      // Initialize editedFields with preferences
      setEditedFields({
        preferences: userData.labels?.map(label => label.id) || []
      });
    }
  }, [openEditDialog, userData]);

  const handleOpenEditDialog = () => {
    setActiveStep(0);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setActiveStep(0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({
      ...editedUser,
      [name]: value
    });
    setEditedFields(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddPreference = (event, value) => {
    if (value && !editedUser.preferences?.includes(value.name)) {
      const newPreferences = [...(editedUser.preferences || []), value.name];
      setEditedUser({
        ...editedUser,
        preferences: newPreferences
      });
      // Store only preference IDs in editedFields
      setEditedFields(prev => ({
        ...prev,
        preferences: [...(prev.preferences || []), value.id]
      }));
      setInputValue('');
    }
  };

  const handleRemovePreference = (preferenceToRemove) => {
    const newPreferences = (editedUser.preferences || []).filter(pref => pref !== preferenceToRemove);
    setEditedUser({
      ...editedUser,
      preferences: newPreferences
    });
    // Update editedFields with only preference IDs
    setEditedFields(prev => ({
      ...prev,
      preferences: newPreferences.map(prefName => {
        const option = preferenceOptions.find(opt => opt.name === prefName);
        return option ? option.id : null;
      }).filter(id => id !== null)
    }));
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      // Ensure we're sending the correct format with preferences
      const dataToSend = {
        ...editedFields,
        preferences: editedFields.preferences || []
      };
      console.log("!1111111", dataToSend)
      const response = await profileService.updateProfile(dataToSend);
      handleCloseEditDialog();
      // After successful update, trigger a refresh
      if (response && response.data) {
        // Call refetchUserData to update the parent component's data
        if (refetchUserData) {
          refetchUserData();
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { icon: <Person />, title: 'Basic Info' },
    { icon: <Info />, title: 'Details' },
    { icon: <Favorite />, title: 'Preferences' }
  ];

  // SAFETY: show loading if userData not ready
  if (!userData) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {/* CARD: NOW THEME-AWARE BACKGROUND */}
      <Card
        variant="outlined"
        sx={{
          p: 2,
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ position: 'relative', zIndex: 1 }}>
          {/* Name + Username + Edit Icon */}
          <Box display="flex" alignItems="center" mb={1}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {userData.name}
            </Typography>

            {/* Show Edit Profile if own profile, else show FriendButton */}
            {isOwnProfile ? (
              <Tooltip title="Edit Profile">
                <IconButton
                  onClick={handleOpenEditDialog}
                  size="small"
                  sx={{
                    ml: 1,
                    color: theme.palette.primary.main,
                    bgcolor: theme.palette.action.hover,
                    '&:hover': { bgcolor: theme.palette.action.selected }
                  }}
                >
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
            ) : (
              <Box ml={2}>
                <FriendButton targetUserId={userData.id} isOwnProfile={isOwnProfile} />
              </Box>
            )}
          </Box>

          {/* Bio */}
          <Typography variant="body2" mt={2}>
            {userData.bio || 'No bio available'}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* Info Section */}
          <Box display="flex" flexDirection="column" gap={1}>
            <Box display="flex" alignItems="center" gap={1}>
              <CalendarMonth fontSize="small" color="action" />
              <Typography variant="body2">Joined {formatDate(userData.created_at)}</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Cake fontSize="small" color="action" />
              <Typography variant="body2">Born {formatBirthDate(userData.birth_date)}</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Public fontSize="small" color="action" />
              <Typography variant="body2">
                {userData.country
                  ? userData.countryId
                    ? `${userData.country} (ID: ${userData.countryId})`
                    : userData.country
                  : 'No country set'}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography><Favorite sx={{ color: '#f06292', fontSize: 'inherit', mb: '2px' }} /></Typography>
              <Typography variant="body2">{userData.marital_status || 'N/A'}</Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Preferences */}
          <Typography variant="subtitle2" fontWeight="medium" gutterBottom color="text.primary">
            Preferences
          </Typography>
          <Box display="flex" gap={1} flexWrap="wrap">
            {userData.labels?.length > 0 ? (
              userData.labels.map((pref) => (
                <Chip
                  key={pref.id}
                  label={pref.label_name}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: '12px',
                    bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100',
                    color: theme.palette.text.primary,
                    borderColor: theme.palette.mode === 'dark' ? 'grey.800' : 'grey.200'
                  }}
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">No preferences set</Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* DIALOG: EDIT PROFILE */}
      <Dialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: '20px',
            background: theme.palette.background.paper,
            color: theme.palette.text.primary,
            minHeight: '600px',
            overflow: 'hidden'
          }
        }}
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
      >
        <DialogTitle sx={{ p: 0 }}>
          <Box
            sx={{
              background: theme.palette.background.paper,
              p: 3,
              borderBottom: '1px solid',
              borderColor: theme.palette.divider
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 1 }}>
                  ✨ Edit Your Profile
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Make your profile shine with personality
                </Typography>
              </Box>
              <IconButton
                edge="end"
                onClick={handleCloseEditDialog}
                sx={{ color: 'grey.700', bgcolor: 'grey.100', '&:hover': { bgcolor: 'grey.200' } }}
              >
                <Close />
              </IconButton>
            </Box>

            {/* Progress Steps */}
            <Box sx={{ mt: 3 }}>
              <Box display="flex" justifyContent="space-between" mb={2}>
                {steps.map((step, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      opacity: activeStep >= index ? 1 : 0.5,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onClick={() => setActiveStep(index)}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        bgcolor: activeStep >= index ? 'primary.light' : 'grey.100',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: activeStep === index
                          ? '2px solid #3f51b5'
                          : '1px solid #e0e0e0',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {step.icon}
                    </Box>
                    <Typography
                      variant="caption"
                      fontWeight={activeStep === index ? 'bold' : 'normal'}
                      color={activeStep === index ? 'primary.main' : 'text.secondary'}
                    >
                      {step.title}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <LinearProgress
                variant="determinate"
                value={(activeStep + 1) / steps.length * 100}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  bgcolor: 'grey.100',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: 'primary.main',
                    borderRadius: 2
                  }
                }}
              />
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent
          sx={{
            pt: 0, // Remove top padding
            px: 4,
            pb: 4,
            background: theme.palette.background.paper,
            minHeight: 300
          }}
        >
          <Fade in timeout={300}>
            <Box>
              {activeStep === 0 && (
                <Stack spacing={2} sx={{ mt: 0, pt: 0 }}>
                  <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 2 }}>
                    ✨ Basic Info
                  </Typography>
                  {/* Name field */}
                  <TextField
                    label="✨ Your Name"
                    name="name"
                    value={editedUser.name || ''}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  {/* Bio field */}
                  <TextField
                    label="💫 Tell us about yourself"
                    name="bio"
                    value={editedUser.bio || ''}
                    onChange={handleInputChange}
                    fullWidth
                    multiline
                    rows={4}
                  />
                </Stack>
              )}

              {activeStep === 1 && (
                <Stack spacing={4}>
                  <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                    🌟 Personal Details
                  </Typography>

                  {/* Birth Date field */}
                  <TextField
                    label="🎂 Birth Date"
                    name="birth_date"
                    type="date"
                    value={editedUser.birth_date ? new Date(editedUser.birth_date).toISOString().split('T')[0] : ''}
                    onChange={handleInputChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />

                  {/* Country field */}
                  <Autocomplete
                    options={ALL_COUNTRIES_DATA}
                    value={ALL_COUNTRIES_DATA.find(country => country.name === editedUser.country) || null}
                    onChange={(event, newValue) => {
                      setEditedUser({
                        ...editedUser,
                        country: newValue ? newValue.name : '',
                        countryId: newValue ? newValue.id : null,
                        countryCode: newValue ? newValue.code : ''
                      });
                      // Only track country_id in editedFields
                      setEditedFields(prev => ({
                        ...prev,
                        country_id: newValue ? newValue.id : null
                      }));
                    }}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Country"
                        variant="outlined"
                        fullWidth
                      />
                    )}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                  />

                  {/* Relationship Status */}
                  <FormControl fullWidth>
                    <InputLabel>💕 Relationship Status</InputLabel>
                    <Select
                      name="marital_status"
                      value={editedUser.marital_status || ''}
                      onChange={handleInputChange}
                      label="💕 Relationship Status"
                    >
                      <MenuItem value="Single">💫 Single</MenuItem>
                      <MenuItem value="Married">💑 Married</MenuItem>
                      <MenuItem value="Divorced">💔Divorced</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              )}

              {activeStep === 2 && (
                <Stack spacing={4}>
                  <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                    🎯 Your Interests
                  </Typography>

                  {/* Current Preferences */}
                  <Paper
                    sx={{
                      p: 3,
                      bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100',
                      borderRadius: '16px',
                      border: '1px solid',
                      borderColor: theme.palette.divider
                    }}
                  >
                    <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
                      Selected Preferences
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {(editedUser.preferences || []).map((pref, index) => (
                        <Chip
                          key={index}
                          label={pref}
                          onDelete={() => handleRemovePreference(pref)}
                          size="medium"
                          sx={{
                            borderRadius: '20px',
                            bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'white',
                            color: theme.palette.text.primary,
                            '&:hover': { bgcolor: theme.palette.mode === 'dark' ? 'grey.700' : 'primary.light' }
                          }}
                        />
                      ))}
                      {(!editedUser.preferences || editedUser.preferences.length === 0) && (
                        <Typography variant="body2" color="text.secondary">
                          No preferences selected
                        </Typography>
                      )}
                    </Box>
                  </Paper>

                  {/* Add New Preferences */}
                  <Autocomplete
                    options={preferenceOptions.filter(option =>
                      !(editedUser.preferences || []).includes(option.name)
                    )}
                    onChange={handleAddPreference}
                    value={null}
                    inputValue={inputValue}
                    onInputChange={(event, newInputValue) => {
                      setInputValue(newInputValue);
                    }}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) =>
                      <TextField
                        {...params}
                        label="🔍 Add new interests"
                        fullWidth
                      />
                    }
                    disableClearable
                    forcePopupIcon
                  />
                </Stack>
              )}
            </Box>
          </Fade>
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            background: theme.palette.background.paper,
            borderTop: '1px solid',
            borderColor: theme.palette.divider,
            gap: 2
          }}
        >
          <Button
            onClick={handleCloseEditDialog}
            sx={{
              color: 'grey.700',
              borderColor: 'grey.300',
              '&:hover': {
                borderColor: 'grey.400',
                bgcolor: 'grey.100'
              }
            }}
            variant="outlined"
          >
            Cancel
          </Button>

          {activeStep > 0 && (
            <Button
              onClick={() => setActiveStep(activeStep - 1)}
              sx={{
                bgcolor: 'grey.100',
                color: 'grey.800',
                '&:hover': { bgcolor: 'grey.200' }
              }}
            >
              Previous
            </Button>
          )}

          {activeStep < steps.length - 1 ? (
            <Button
              onClick={() => setActiveStep(activeStep + 1)}
              variant="contained"
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                fontWeight: 'bold',
                px: 4,
                borderRadius: '25px',
                transition: 'all 0.3s ease'
              }}
            >
              Next Step
            </Button>
          ) : (
            <Button
              onClick={handleSaveChanges}
              variant="contained"
              disabled={isLoading}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                fontWeight: 'bold',
                px: 4,
                borderRadius: '25px',
                transition: 'all 0.3s ease'
              }}
              startIcon={isLoading ? <CircularProgress size={20} /> : <Save />}
            >
              {isLoading ? 'Saving...' : 'Save Profile'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AboutSection;