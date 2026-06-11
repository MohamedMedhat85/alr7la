import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../App.css';
import ResponsiveAppBar from '../../components/ResponsiveAppBar';
import PostCard from '../../components/Post';
import Sidebar from '../../components/SideBar';
import AboutSection from '../../components/AboutSection';
import VisitedCountriesMap from '../../components/VisitedCountries';
import UserAvatar from '../../components/UserAvatar';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  IconButton,
  useTheme,
  CircularProgress,
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  Backdrop
} from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useUserContext } from '../../context/UserContext';
import LeftSider from '../../components/LeftSider';
import { visitedCountryService, postService, uploadService } from '../../services/networkService'
import { profileService } from '../../services/networkService'
import localStorageService from '../../services/localStorageService';
import FriendsList from '../../components/FriendsList';
import CreatePost from '../../components/CreatePost';
import FriendButton from '../../components/FriendButton';
import { friendService } from "../../services/networkService";
import userAvatar from '../../assets/images/hazem.jpg';
import CloseIcon from '@mui/icons-material/Close';
import defaultProfilePic from '../../assets/images/default-profile.svg';
import defaultWallpaper from '../../assets/images/default-wallpaper.svg';
import DeleteIcon from '@mui/icons-material/Delete';
// Map of country IDs to alpha2 codes
const countryIdToAlpha2 = {
  1: 'AF', // Afghanistan
  2: 'AL', // Albania
  3: 'DZ', // Algeria
  4: 'AD', // Andorra
  5: 'AO', // Angola
  6: 'AG', // Antigua and Barbuda
  7: 'AR', // Argentina
  8: 'AM', // Armenia
  9: 'AU', // Australia
  10: 'AT', // Austria
  11: 'AZ', // Azerbaijan
  12: 'BS', // Bahamas
  13: 'BH', // Bahrain
  14: 'BD', // Bangladesh
  15: 'BB', // Barbados
  16: 'BY', // Belarus
  17: 'BE', // Belgium
  18: 'BZ', // Belize
  19: 'BJ', // Benin
  20: 'BT', // Bhutan
  21: 'BO', // Bolivia
  22: 'BA', // Bosnia and Herzegovina
  23: 'BW', // Botswana
  24: 'BR', // Brazil
  25: 'BN', // Brunei
  26: 'BG', // Bulgaria
  27: 'BF', // Burkina Faso
  28: 'BI', // Burundi
  29: 'CV', // Cabo Verde
  30: 'KH', // Cambodia
  31: 'CM', // Cameroon
  32: 'CA', // Canada
  33: 'CF', // Central African Republic
  34: 'TD', // Chad
  35: 'CL', // Chile
  36: 'CN', // China
  37: 'CO', // Colombia
  38: 'KM', // Comoros
  39: 'CG', // Congo (Congo-Brazzaville)
  40: 'CD', // Congo (Democratic Republic)
  41: 'CR', // Costa Rica
  42: 'HR', // Croatia
  43: 'CU', // Cuba
  44: 'CY', // Cyprus
  45: 'CZ', // Czechia (Czech Republic)
  46: 'DK', // Denmark
  47: 'DJ', // Djibouti
  48: 'DM', // Dominica
  49: 'DO', // Dominican Republic
  50: 'EC', // Ecuador
  51: 'EG', // Egypt
  52: 'SV', // El Salvador
  53: 'GQ', // Equatorial Guinea
  54: 'ER', // Eritrea
  55: 'EE', // Estonia
  56: 'SZ', // Eswatini (Swaziland)
  57: 'ET', // Ethiopia
  58: 'FJ', // Fiji
  59: 'FI', // Finland
  60: 'FR', // France
  61: 'GA', // Gabon
  62: 'GM', // Gambia
  63: 'GE', // Georgia
  64: 'DE', // Germany
  65: 'GH', // Ghanay
  66: 'GR', // Greece
  67: 'GD', // Grenada
  68: 'GT', // Guatemala
  69: 'GN', // Guinea
  70: 'GW', // Guinea-Bissau
  71: 'GY', // Guyana
  72: 'HT', // Haiti
  73: 'HN', // Honduras
  74: 'HU', // Hungary
  75: 'IS', // Iceland
  76: 'IN', // India
  77: 'ID', // Indonesia
  78: 'IR', // Iran
  79: 'IQ', // Iraq
  80: 'IE', // Ireland
  81: 'IL', // Israel
  82: 'IT', // Italy
  83: 'JM', // Jamaica
  84: 'JP', // Japan
  85: 'JO', // Jordan
  86: 'KZ', // Kazakhstan
  87: 'KE', // Kenya
  88: 'KI', // Kiribati
  89: 'KP', // Korea North
  90: 'KR', // Korea South
  91: 'XK', // Kosovo
  92: 'KW', // Kuwait
  93: 'KG', // Kyrgyzstan
  94: 'LA', // Laos
  95: 'LV', // Latvia
  96: 'LB', // Lebanon
  97: 'LS', // Lesotho
  98: 'LR', // Liberia
  99: 'LY', // Libya
  100: 'LI', // Liechtenstein
  101: 'LT', // Lithuania
  102: 'LU', // Luxembourg
  103: 'MG', // Madagascar
  104: 'MW', // Malawi
  105: 'MY', // Malaysia
  106: 'MV', // Maldives
  107: 'ML', // Mali
  108: 'MT', // Malta
  109: 'MH', // Marshall Islands
  110: 'MR', // Mauritania
  111: 'MU', // Mauritius
  112: 'MX', // Mexico
  113: 'FM', // Micronesia
  114: 'MD', // Moldova
  115: 'MC', // Monaco
  116: 'MN', // Mongolia
  117: 'ME', // Montenegro
  118: 'MA', // Morocco
  119: 'MZ', // Mozambique
  120: 'MM', // Myanmar (Burma)
  121: 'NA', // Namibia
  122: 'NR', // Nauru
  123: 'NP', // Nepal
  124: 'NL', // Netherlands
  125: 'NZ', // New Zealand
  126: 'NI', // Nicaragua
  127: 'NE', // Niger
  128: 'NG', // Nigeria
  129: 'MK', // North Macedonia
  130: 'NO', // Norway
  131: 'OM', // Oman
  132: 'PK', // Pakistan
  133: 'PW', // Palau
  134: 'PS', // Palestine
  135: 'PA', // Panama
  136: 'PG', // Papua New Guinea
  137: 'PY', // Paraguay
  138: 'PE', // Peru
  139: 'PH', // Philippines
  140: 'PL', // Poland
  141: 'PT', // Portugal
  142: 'QA', // Qatar
  143: 'RO', // Romania
  144: 'RU', // Russia
  145: 'RW', // Rwanda
  146: 'KN', // Saint Kitts and Nevis
  147: 'LC', // Saint Lucia
  148: 'VC', // Saint Vincent and the Grenadines
  149: 'WS', // Samoa
  150: 'SM', // San Marino
  151: 'ST', // São Tomé and Príncipe
  152: 'SA', // Saudi Arabia
  153: 'SN', // Senegal
  154: 'RS', // Serbia
  155: 'SC', // Seychelles
  156: 'SL', // Sierra Leone
  157: 'SG', // Singapore
  158: 'SK', // Slovakia
  159: 'SI', // Slovenia
  160: 'SB', // Solomon Islands
  161: 'SO', // Somalia
  162: 'ZA', // South Africa
  163: 'SS', // South Sudan
  164: 'ES', // Spain
  165: 'LK', // Sri Lanka
  166: 'SD', // Sudan
  167: 'SR', // Suriname
  168: 'SE', // Sweden
  169: 'CH', // Switzerland
  170: 'SY', // Syria
  171: 'TW', // Taiwan
  172: 'TJ', // Tajikistan
  173: 'TZ', // Tanzania
  174: 'TH', // Thailand
  175: 'TL', // Timor-Leste (East Timor)
  176: 'TG', // Togo
  177: 'TO', // Tonga
  178: 'TT', // Trinidad and Tobago
  179: 'TN', // Tunisia
  180: 'TR', // Turkey
  181: 'TM', // Turkmenistan
  182: 'TV', // Tuvalu
  183: 'UG', // Uganda
  184: 'UA', // Ukraine
  185: 'AE', // United Arab Emirates
  186: 'GB', // United Kingdom
  187: 'US', // United States
  188: 'UY', // Uruguay
  189: 'UZ', // Uzbekistan
  190: 'VU', // Vanuatu
  191: 'VA', // Vatican City (Holy See)
  192: 'VE', // Venezuela
  193: 'VN', // Vietnam
  194: 'YE', // Yemen
  195: 'ZM', // Zambia
  196: 'ZW', // Zimbabwe
  197: 'CI', // Côte d'Ivoire
};

function Profile() {
  const { coverPhoto, updateCoverPhoto, updateProfilePhoto, profilePhoto, updateUserFromBackend } = useUserContext();
  const theme = useTheme();
  const { id: urlId } = useParams();
  const loggedInId = localStorageService.getItem("id");
  const userId = urlId || loggedInId;
  const isOwnProfile = !urlId || urlId == loggedInId;
  
  const [activeTab, setActiveTab] = useState(0);
  const [visitedCountries, setVisitedCountries] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(() => {
    // Initialize with localStorage data if available and viewing own profile
    const savedUserData = localStorageService.getItem('userData');
    if (savedUserData && (!urlId || urlId == loggedInId)) {
      return savedUserData;
    }
    return null;
  });
  const [friends, setFriends] = useState([]);
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [isUploadingWallpaper, setIsUploadingWallpaper] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [profileUploadMessage, setProfileUploadMessage] = useState('');
  const [showProfileSuccess, setShowProfileSuccess] = useState(false);
  const [isProfilePicExpanded, setIsProfilePicExpanded] = useState(false);
  const [isWallpaperExpanded, setIsWallpaperExpanded] = useState(false);

  // Profile picture upload handlers
  const handleProfileUploadStart = (message) => {
    setIsUploadingProfile(true);
    setProfileUploadMessage(message);
  };

  const handleProfileUploadSuccess = (message) => {
    setShowProfileSuccess(true);
    setTimeout(() => setShowProfileSuccess(false), 2000);
  };

  const handleProfileUploadEnd = () => {
    setIsUploadingProfile(false);
    setProfileUploadMessage('');
  };

  const handleExpandProfilePic = () => setIsProfilePicExpanded(true);
  const handleCloseExpandProfilePic = () => setIsProfilePicExpanded(false);

  const handleExpandWallpaper = () => setIsWallpaperExpanded(true);
  const handleCloseExpandWallpaper = () => setIsWallpaperExpanded(false);

  const handleDeleteProfilePic = async () => {
    if (isOwnProfile) {
      try {
        await uploadService.deleteProfilePicture();
        await fetchUser();
        await updateProfilePhoto('');
      } catch (e) {
        console.error('Delete profile picture error:', e);
      }
    }
  };

  const handleDeleteWallpaper = async () => {
    if (isOwnProfile) {
      try {
        await uploadService.deleteWallpaper();
        await fetchUser();
        await updateCoverPhoto('');
      } catch (e) {
        console.error('Delete wallpaper error:', e);
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  useEffect(() => {
    fetchUserPosts();
  }, [userId]);

  // Always scroll to top when viewing a new profile
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [userId]);

  // Always reset the tab to "Posts" default on profile ID change
  useEffect(() => {
    setActiveTab(0);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    friendService.getFriends(userId)
      .then(res => {
        console.log("API response for friends:", res);
        const friendsArr = Array.isArray(res.data?.data) ? res.data.data : [];
        setFriends(friendsArr);
      })
      .catch((err) => {
        console.error("Error fetching friends:", err);
        setFriends([]);
      })
      .finally(() => setLoading(false));
    console.log("friendsssss", friends);
  }, [userId]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      if (!userId) {
        setError('No user ID found');
        return;
      }
      const response = await profileService.getProfile(userId);
      if (response.data) {
        setUserData(response.data);
        // Only update the global profile photo and cover photo if viewing own profile
        if (isOwnProfile) {
          updateUserFromBackend(response.data);
        }
        // Fetch visited countries for the profile we're viewing
        fetchVisitedCountries(userId);
      } else {
        setError('Failed to load user data');
      }
    } catch (err) {
      setError('Error loading user profile');
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVisitedCountries = async (profileId) => {
    try {
      setLoading(true);
      // Use the profile ID we're viewing, not the logged-in user's ID
      const response = await visitedCountryService.getVisitedCountries(profileId);
      // If no data at all, set empty array and return early
      if (!response || !response.data) {
        setVisitedCountries([]);
        return;
      }
      // Handle different possible response structures
      let countriesData = [];
      if (Array.isArray(response.data)) {
        countriesData = response.data;
      } else if (response.data && Array.isArray(response.data.countries)) {
        countriesData = response.data.countries;
      } else if (response.data && typeof response.data === 'object') {
        // If single country object
        if (response.data.id || response.data.countryId) {
          countriesData = [response.data];
        }
      }
      // If no valid countries data, set empty array and return early
      if (!countriesData || countriesData.length === 0) {
        setVisitedCountries([]);
        return;
      }
      // Transform the API response to get country codes
      const countryCodes = countriesData.map(country => {
        if (!country) return null;
        const countryId = country.id || country.countryId;
        if (!countryId) return null;
        const alpha2Code = countryIdToAlpha2[countryId];
        if (!alpha2Code) {
          console.warn('No alpha2 code found for country ID:', countryId);
          return null;
        }
        return alpha2Code;
      }).filter(code => code !== null);
      setVisitedCountries(countryCodes);
      setError(null);
    } catch (err) {
      console.error('Error fetching visited countries:', err);
      // Don't show error to user, just set empty array
      setVisitedCountries([]);
    } finally {
      setLoading(false);
    }
  };

  const addVisitedCountry = async (countryCode) => {
    try {
      const countryId = Object.entries(countryIdToAlpha2).find((entry) => entry[1] === countryCode)?.[0];
      if (!countryId) {
        setError('Invalid country code');
        return;
      }
      const loggedInId = localStorageService.getItem("id");
      console.log('Adding country:', countryId, 'for user:', loggedInId);
      const res = await visitedCountryService.addVisitedCountry(parseInt(countryId));
      console.log('Add response:', res);
      setVisitedCountries(prev => [...prev, countryCode]);
      setError(null);
    } catch (err) {
      setError('Failed to add country');
      console.error('Error adding visited country:', err);
    }
  };

  const removeVisitedCountry = async (countryCode) => {
    try {
      const countryId = Object.entries(countryIdToAlpha2).find((entry) => entry[1] === countryCode)?.[0];
      if (!countryId) {
        setError('Invalid country code');
        return;
      }
      const loggedInId = localStorageService.getItem("id");
      console.log('Removing country:', countryId, 'for user:', loggedInId);
      const res = await visitedCountryService.deleteVisitedCountry(parseInt(countryId));
      console.log('Remove response:', res);
      setVisitedCountries(prev => prev.filter(code => code !== countryCode));
      setError(null);
    } catch (err) {
      setError('Failed to remove country');
      console.error('Error removing visited country:', err);
    }
  };

        const fetchUserPosts = async () => {
    try {
      setLoading(true);
      if (!userId) {
        console.error('No user ID found');
        setError('No user ID found');
        return;
      }
      const response = await postService.getUserPosts(userId, { limit: 1000 });
      // Correctly extract posts array from API response
      const postsData = Array.isArray(response.data.data) ? response.data.data : [];
      // Create an array of transformed posts
      const postsArray = postsData.map(post => {
        // Support both 'images' and 'PostsImages' for images array
        const imagesArr = post.images || post.PostsImages || [];
        return {
          id: post.id?.toString(),
          user_id: post.user_id,
          user: {
            id: (post.user?.id || post.User?.id || post.user_id)?.toString(),
            name: post.user?.name || post.User?.name || 'User ' + post.user_id,
            avatar: post.user?.profile_picture || post.User?.profile_picture || '/default-avatar.png'
          },
          time: new Date(post.created_at),
          contentType: imagesArr.length > 0 ? 'image' : 'text',
          contentSrc: imagesArr[0]?.img_url || imagesArr[0]?.url || '',
          text: post.description || '',
          isFirstPost: false,
          likes: post.number_of_likes || 0,
          privacy: post.visibility,
          isLiked: post.isLiked || false, // Include the isLiked property from backend
          images: imagesArr.map(img => ({
            id: img.id || img.img_url,
            url: img.img_url || img.url,
            createdAt: img.created_at ? new Date(img.created_at) : undefined
          })),
          createdAt: new Date(post.created_at),
          updatedAt: new Date(post.updated_at),
          postSourceId: post.post_source_id
        };
      });
      // Sort posts by creation date (newest first)
      const sortedPosts = postsArray.sort((a, b) => b.createdAt - a.createdAt);
      setUserPosts(sortedPosts);
      setError(null);
    } catch (err) {
      console.error('Error fetching user posts:', err);
      setError('Failed to load user posts');
      setUserPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Add a handler to remove a post from userPosts immediately
  const handleDeleteUserPost = (postId) => {
    setUserPosts(prevPosts => prevPosts.filter(post => post.id.toString() !== postId.toString()));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            ) : userPosts.length === 0 ? (
              <Typography variant="body1" sx={{ textAlign: 'center', p: 3 }}>
                No posts yet
              </Typography>
            ) : (
              <Box sx={{ mt: 2 }}>
                {userPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    loggedInId={loggedInId}
                    onPostDeleted={handleDeleteUserPost}
                  />
                ))}
              </Box>
            )}
          </Box>
        );

      case 1: // Friends
        return (
          <FriendsList friends={friends} setFriends={setFriends} isOwnProfile={isOwnProfile} />
        );

      case 2: // Visited Countries
        return (
          <Box sx={{ maxWidth: 600, margin: 'auto', width: '100%' }}>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            ) : (
              <VisitedCountriesMap
                visitedCountries={visitedCountries}
                onAddCountry={addVisitedCountry}
                onRemoveCountry={removeVisitedCountry}
                isEditable={isOwnProfile}
              />
            )}
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <title>Profile</title>

      <Box display="flex" sx={{
        bgcolor: theme.palette.mode === 'dark' ? '#242526' : undefined,
        maxWidth: 1280,
        margin: '0 auto',
        padding: '2rem',
        paddingBottom: { xs: '5rem', md: '2rem' }, // Add bottom padding for mobile
        textAlign: 'center',
      }}>
        {/* Left Sidebar */}
        <LeftSider>
          <Sidebar page="profile" />
        </LeftSider>

        {/* Main Content */}
        <Box
          sx={{
            ml: { md: '40px', xs: 0 },
            pt: { xs: 1, sm: 2 },
            px: { xs: 1, sm: 2, md: 3 },
            maxWidth: { xs: '100%', md: 'calc(100% - 200px)' },
            width: '100%',
            mx: 'auto',
            bgcolor: theme.palette.mode === 'dark' ? '#242526' : undefined
          }}
        >
          {/* Cover Photo */}
          <Box
            sx={{
              backgroundColor: '#F5F5F5',
              ...(isOwnProfile
                ? (coverPhoto && coverPhoto !== defaultWallpaper
                    ? {
                        backgroundImage: `url(${coverPhoto})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                      }
                    : {
                        backgroundImage: `
                          radial-gradient(circle at 100px 100px, #D3D3D3 0px, transparent 20px),
                          radial-gradient(circle at 300px 150px, #D3D3D3 0px, transparent 18px),
                          radial-gradient(circle at 500px 80px, #D3D3D3 0px, transparent 22px),
                          radial-gradient(circle at 700px 200px, #D3D3D3 0px, transparent 19px),
                          radial-gradient(circle at 900px 120px, #D3D3D3 0px, transparent 21px),
                          radial-gradient(circle at 1100px 180px, #D3D3D3 0px, transparent 17px),
                          radial-gradient(circle at 200px 250px, #D3D3D3 0px, transparent 15px),
                          radial-gradient(circle at 400px 300px, #D3D3D3 0px, transparent 16px),
                          radial-gradient(circle at 600px 320px, #D3D3D3 0px, transparent 14px),
                          radial-gradient(circle at 800px 280px, #D3D3D3 0px, transparent 18px),
                          radial-gradient(circle at 1000px 350px, #D3D3D3 0px, transparent 15px)
                        `,
                        backgroundSize: '1200px 400px',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                      })
                : (userData?.wallpaper && userData.wallpaper !== defaultWallpaper
                    ? {
                        backgroundImage: `url(${userData.wallpaper})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                      }
                    : {
                        backgroundImage: `
                          radial-gradient(circle at 100px 100px, #D3D3D3 0px, transparent 20px),
                          radial-gradient(circle at 300px 150px, #D3D3D3 0px, transparent 18px),
                          radial-gradient(circle at 500px 80px, #D3D3D3 0px, transparent 22px),
                          radial-gradient(circle at 700px 200px, #D3D3D3 0px, transparent 19px),
                          radial-gradient(circle at 900px 120px, #D3D3D3 0px, transparent 21px),
                          radial-gradient(circle at 1100px 180px, #D3D3D3 0px, transparent 17px),
                          radial-gradient(circle at 200px 250px, #D3D3D3 0px, transparent 15px),
                          radial-gradient(circle at 400px 300px, #D3D3D3 0px, transparent 16px),
                          radial-gradient(circle at 600px 320px, #D3D3D3 0px, transparent 14px),
                          radial-gradient(circle at 800px 280px, #D3D3D3 0px, transparent 18px),
                          radial-gradient(circle at 1000px 350px, #D3D3D3 0px, transparent 15px)
                        `,
                        backgroundSize: '1200px 400px',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                      })
              ),
              height: { xs: 280, sm: 320, md: 360 },
              borderRadius: 3,
              position: 'relative',
              mb: 6,
              cursor: 'pointer',
              minHeight: { xs: 280, sm: 320, md: 360 },
              '&:hover .cover-photo-edit': {
                opacity: 1,
              },
            }}
            onClick={handleExpandWallpaper}
            onLoad={() => {
              console.log('Wallpaper URL:', isOwnProfile ? (coverPhoto || defaultWallpaper) : (userData?.wallpaper ? userData.wallpaper : defaultWallpaper));
            }}
          >
            {/* Cover Photo Edit Button */}
            {isOwnProfile && (
              <Box
                className="cover-photo-edit"
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  },
                  zIndex: 3,
                }}
                onClick={e => e.stopPropagation()}
              >
                <input
                  type="file"
                  accept="image/*"
                  id="cover-photo-input"
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setIsUploadingWallpaper(true);
                      setUploadMessage('Uploading wallpaper...');
                      try {
                        const response = await uploadService.uploadWallpaper(file);
                        if (response.data.success) {
                          const wallpaperUrl = response.data.data?.wallpaper;
                          if (wallpaperUrl) {
                            updateCoverPhoto(wallpaperUrl);
                            if (userData) {
                              const updatedUserData = {
                                ...userData,
                                wallpaper: wallpaperUrl
                              };
                              setUserData(updatedUserData);
                              setShowSuccess(true);
                              setTimeout(() => setShowSuccess(false), 2000);
                            }
                          } else {
                            console.error('Failed to upload wallpaper: No URL in response');
                          }
                        } else {
                          console.error('Failed to upload wallpaper:', response.data.message);
                        }
                      } catch (error) {
                        console.error('Error uploading wallpaper:', error);
                      } finally {
                        setIsUploadingWallpaper(false);
                        setUploadMessage('');
                      }
                    }
                  }}
                />
                <IconButton
                  onClick={e => {
                    e.stopPropagation();
                    document.getElementById('cover-photo-input').click();
                  }}
                  sx={{ color: 'white', p: 0.5 }}
                >
                  <PhotoCameraIcon fontSize="small" />
                </IconButton>
                {/* Delete Wallpaper Button */}
                {(isOwnProfile ? (coverPhoto && coverPhoto !== defaultWallpaper) : (userData?.wallpaper && userData.wallpaper !== defaultWallpaper)) && (
                  <IconButton
                    onClick={e => { e.stopPropagation(); handleDeleteWallpaper(); }}
                    sx={{ color: 'white', p: 0.5 }}
                    title="Delete Wallpaper"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            )}

            {/* Profile Photo with white circular frame */}
            <Box
              className="cover-photo"
              sx={{
                position: 'absolute',
                bottom: -60,
                left: '16%',
                transform: 'translateX(-50%)',
                width: 115,
                height: 115,
                borderRadius: '50%',
                border: '5px solid #fff',
                background: '#fff',
                boxShadow: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                '&:hover .profile-photo-edit': {
                  opacity: 1,
                },
                '&:hover .profile-photo-delete': {
                  opacity: 1,
                },
              }}
              onClick={e => e.stopPropagation()}
            >
              <UserAvatar 
                size={110} 
                allowChange={isOwnProfile} 
                onUploadStart={handleProfileUploadStart}
                onUploadSuccess={handleProfileUploadSuccess}
                onUploadEnd={handleProfileUploadEnd}
                src={isOwnProfile ? (profilePhoto || defaultProfilePic) : (userData?.profile_picture ? userData.profile_picture : defaultProfilePic)}
                onAvatarClick={handleExpandProfilePic}
              />
              {/* Delete Profile Pic Button */}
              {isOwnProfile && (isOwnProfile ? (profilePhoto && profilePhoto !== defaultProfilePic) : (userData?.profile_picture && userData.profile_picture !== defaultProfilePic)) && (
                <IconButton
                  className="profile-photo-delete"
                  onClick={e => { e.stopPropagation(); handleDeleteProfilePic(); }}
                  sx={{ position: 'absolute', top: 8, right: 8, color: 'red', background: 'white', zIndex: 3, opacity: 0, transition: 'opacity 0.2s', p: 0.5 }}
                  title="Delete Profile Picture"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>

          {/* Layout */}
          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2} flexWrap="wrap">
            {/* Left: About Section */}
            <Box flex={1} width="100%" maxWidth={{ md: 340 }}>
              <Paper
                elevation={1}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  bgcolor: theme.palette.mode === 'dark' ? '#242526' : undefined
                }}
              >
                <AboutSection
                  userData={userData}
                  refetchUserData={fetchUser}
                  isOwnProfile={isOwnProfile}
                />


              </Paper>
            </Box>

            {/* Right: Feed Section */}
            <Box flex={2} minWidth={0}>
              {/* Tabs */}
              <Paper
                elevation={1}
                sx={{
                  maxWidth: 600,
                  margin: 'auto',
                  width: '100%',
                  px: { xs: 1, sm: 1.5 },
                  py: 0.75,
                  mb: 2,
                  borderRadius: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  bgcolor: theme.palette.mode === 'dark' ? '#242526' : '#fff'
                }}
              >
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                }}>
                  <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    textColor="primary"
                    indicatorColor="primary"
                    sx={{
                      '& .MuiTab-root': {
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '16px',
                        mr: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 0.5
                      },
                      '& .MuiTabs-indicator': {
                        transition: 'all 0.2s ease-in-out'
                      }
                    }}
                  >
                    <Tab
                      label={
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Typography>Posts</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {userPosts.length}
                          </Typography>
                        </Box>
                      }
                    />
                    <Tab
                      label={
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Typography>Friends</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {friends.length}
                          </Typography>
                        </Box>
                      }
                    />
                    <Tab
                      label={
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Typography>Visited Countries</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {visitedCountries.length}
                          </Typography>
                        </Box>
                      }
                    />
                  </Tabs>
                </Box>
              </Paper>

              {/* Content based on selected tab */}
              {renderTabContent()}
            </Box>
          </Box>
        </Box>
      </Box>

      {userData && (
        <CreatePost
          open={createPostOpen}
          onClose={() => setCreatePostOpen(false)}
          onPostCreated={() => {
            setCreatePostOpen(false);
            fetchUserPosts();
          }}
          userData={userData}
        />
      )}

      {/* Upload Loading Dialog */}
      {isUploadingWallpaper && (
        <>
          {/* Full screen backdrop */}
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
          />
          {/* Centered popup */}
          <Box
            sx={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: (theme) => theme.zIndex.drawer + 2,
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              color: 'white',
              padding: 3,
              borderRadius: 2,
              boxShadow: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: 200,
              maxWidth: 300,
            }}
          >
            <CircularProgress size={40} sx={{ color: 'white', mb: 2 }} />
            <Typography variant="h6" sx={{ color: 'white', mb: 1, textAlign: 'center' }}>
              Please Wait
            </Typography>
            <Typography variant="body2" sx={{ color: 'white', textAlign: 'center' }}>
              {uploadMessage}
            </Typography>
          </Box>
        </>
      )}

      {/* Success Message */}
      {showSuccess && (
        <>
          {/* Full screen backdrop */}
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
          />
          {/* Centered popup */}
          <Box
            sx={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: (theme) => theme.zIndex.drawer + 2,
              backgroundColor: 'success.main',
              color: 'white',
              padding: 2,
              borderRadius: 2,
              boxShadow: 3,
              animation: 'slideIn 0.3s ease-out'
            }}
          >
            <Typography variant="body1">
              Wallpaper updated successfully!
            </Typography>
          </Box>
        </>
      )}

      {/* Profile Picture Upload Loading Dialog */}
      {isUploadingProfile && (
        <>
          {/* Full screen backdrop */}
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
          />
          {/* Centered popup */}
          <Box
            sx={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: (theme) => theme.zIndex.drawer + 2,
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              color: 'white',
              padding: 3,
              borderRadius: 2,
              boxShadow: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              minWidth: 200,
              maxWidth: 300,
            }}
          >
            <CircularProgress size={40} sx={{ color: 'white', mb: 2 }} />
            <Typography variant="h6" sx={{ color: 'white', mb: 1, textAlign: 'center' }}>
              Please Wait
            </Typography>
            <Typography variant="body2" sx={{ color: 'white', textAlign: 'center' }}>
              {profileUploadMessage}
            </Typography>
          </Box>
        </>
      )}

      {/* Profile Picture Success Message */}
      {showProfileSuccess && (
        <>
          {/* Full screen backdrop */}
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
          />
          {/* Centered popup */}
          <Box
            sx={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: (theme) => theme.zIndex.drawer + 2,
              backgroundColor: 'success.main',
              color: 'white',
              padding: 2,
              borderRadius: 2,
              boxShadow: 3,
              animation: 'slideIn 0.3s ease-out'
            }}
          >
            <Typography variant="body1">
              Profile picture updated successfully!
            </Typography>
          </Box>
        </>
      )}

      {/* Expanded Profile Picture Dialog */}
      <Dialog open={isProfilePicExpanded} onClose={handleCloseExpandProfilePic} maxWidth="xs" PaperProps={{ sx: { background: 'transparent', boxShadow: 'none', borderRadius: 3, overflow: 'visible' } }}>
        <DialogContent sx={{ p: 0, position: 'relative', background: 'transparent', overflow: 'visible' }}>
          <IconButton
            aria-label="close"
            onClick={handleCloseExpandProfilePic}
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 10,
              color: '#fff',
              background: 'rgba(0,0,0,0.5)',
              '&:hover': { background: 'rgba(0,0,0,0.8)' },
              boxShadow: 2
            }}
          >
            <CloseIcon fontSize="large" />
          </IconButton>
          <Box sx={{ width: { xs: 300, sm: 450 }, height: { xs: 300, sm: 450 }, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent' }}>
            <img
              src={isOwnProfile ? profilePhoto : userData?.profile_picture || ''}
              alt="Profile"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '50%',
                boxShadow: '0 0 0 8px #fff', // white glow, remove if not wanted
                background: '#fff' // white background for image, remove if not wanted
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>

{/* Expanded Wallpaper Dialog */}
<Dialog
  open={isWallpaperExpanded}
  onClose={handleCloseExpandWallpaper}
  maxWidth="lg"
  fullWidth
  PaperProps={{
    sx: {
      background: 'transparent',
      boxShadow: 'none',
      borderRadius: 0,
      overflow: 'visible'
    }
  }}
>
  <DialogContent
    sx={{
      p: 0,
      position: 'relative',
      background: 'transparent',
      overflow: 'visible'
    }}
  >
    <IconButton
      aria-label="close"
      onClick={handleCloseExpandWallpaper}
      sx={{
        position: 'absolute',
        top: 12,
        right: 12,
        zIndex: 10,
        color: '#fff',
        background: 'rgba(0,0,0,0.5)',
        '&:hover': { background: 'rgba(0,0,0,0.8)' },
        boxShadow: 2
      }}
    >
      <CloseIcon fontSize="large" />
    </IconButton>
    <Box
      sx={{
        width: '100%',
        height: { xs: '70vh', sm: '80vh', md: '85vh' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent'
      }}
    >
      <img
        src={isOwnProfile ? coverPhoto : userData?.wallpaper || ''}
        alt="Wallpaper"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
        }}
      />
    </Box>
  </DialogContent>
</Dialog>
    </>
  );
}

export default Profile;