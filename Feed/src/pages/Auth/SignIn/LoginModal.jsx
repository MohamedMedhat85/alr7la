import {
    Box,
    Modal,
    Typography,
    TextField,
    Button,
    InputAdornment,
    IconButton,
    Container,
    Paper,
    CircularProgress,
} from '@mui/material';
import { MailOutline, Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import bgImage from '../../../assets/images/SignIn.png';
import React from 'react';
import PropTypes from 'prop-types';
import { authService, profileService } from '../../../services/networkService'
import localStorageService from '../../../services/localStorageService'
import { useUserContext } from '../../../context/UserContext';
import { useAuth } from '../../../context/AuthContext';
const validationSchema = Yup.object({
    email: Yup.string()
        .email('Please enter a valid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(6, 'Password must be at least 8 characters')
        .required('Password is required'),
});
const LoginModal = ({ open, onClose, onSwitchToRegister, onSwitchToOtp, onLoginSuccess }) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [loginError, setLoginError] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const { updateUserFromBackend } = useUserContext();
    const { login } = useAuth();
    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            setLoginError('');
            setIsLoading(true);
            try {
                const loginResponse = await authService.login(values.email, values.password);
                
                // Store authentication data
                localStorageService.setItem('token', loginResponse.data.token);
                localStorageService.setItem('refreshToken', loginResponse.data.refreshToken);
                localStorageService.setItem('id', loginResponse.data.userId);
                localStorageService.setItem('profile_picture', loginResponse.data.profilePicture);
                
                // Fetch complete user data from backend
                const userResponse = await profileService.getProfile(loginResponse.data.userId);
                
                // Update UserContext with complete user data
                if (userResponse.data) {
                    updateUserFromBackend(userResponse.data);
                }
                
                // Store user data in localStorage for persistence
                localStorageService.setItem('userData', JSON.stringify(userResponse.data));
                
                // Dispatch custom event to notify other components about auth state change
                window.dispatchEvent(new Event('authStateChanged'));
                
                // Update AuthContext
                login(loginResponse.data.token);
                
                resetForm();
                onClose();
                onLoginSuccess();
            } catch (err) {
                console.log(err);
                setLoginError('Invalid email or password. Please try again.');
                resetForm();
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="login-modal-title"
            aria-describedby="login-modal-description"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: { xs: 1, sm: 2 },
            }}
        >
            <Container maxWidth="md" sx={{ p: 0 }}>
                <Paper
                    elevation={8}
                    sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        width: { xs: '95%', sm: '85%', md: '80%' },
                        maxWidth: 800,
                        margin: '0 auto',
                        minHeight: { xs: 'auto', md: 350 },
                        maxHeight: { xs: '90vh', md: '70vh' },
                        overflowY: 'auto',
                    }}
                >
                    {/* Left side: Form */}
                    <Box
                        sx={{
                            width: { xs: '100%', md: '50%' },
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            py: { xs: 2, sm: 3 },
                            background: 'rgba(255,255,255,0.98)',
                        }}
                    >
                        <Typography
                            variant="h4"
                            component="h1"
                            gutterBottom
                            align="center"
                            sx={{
                                fontWeight: 700,
                                color: 'primary.main',
                                mb: 1,
                                letterSpacing: 0.5,
                                fontSize: { xs: '1.35rem', sm: '1.5rem' },
                            }}
                        >
                            Welcome Back
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            align="center"
                            sx={{
                                color: 'text.secondary',
                                mb: 2,
                                fontSize: { xs: '0.9rem', sm: '0.95rem' },
                                maxWidth: '90%',
                                mx: 'auto',
                            }}
                        >
                            Sign in to continue your journey
                        </Typography>

                        {loginError && (
                            <Typography
                                color="error"
                                align="center"
                                sx={{
                                    mb: 2,
                                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                                    backgroundColor: 'error.light',
                                    color: 'error.contrastText',
                                    py: 1,
                                    px: 2,
                                    borderRadius: 1,
                                    mx: 2,
                                }}
                            >
                                {loginError}
                            </Typography>
                        )}

                        <form onSubmit={formik.handleSubmit} noValidate style={{ width: '100%', boxSizing: 'border-box', paddingLeft: 16, paddingRight: 16 }}>
                            <TextField
                                fullWidth
                                id="email"
                                name="email"
                                label="Email address"
                                variant="outlined"
                                margin="dense"
                                size="small"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <MailOutline fontSize="small" color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    mb: 1.5,
                                    width: '100%',
                                    maxWidth: '100%',
                                    boxSizing: 'border-box',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 1.5,
                                        backgroundColor: '#fafbfc',
                                    },
                                    '& .MuiInputBase-input': {
                                        fontSize: { xs: '0.9rem', sm: '0.95rem' },
                                    },
                                }}
                            />

                            <TextField
                                fullWidth
                                id="password"
                                name="password"
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                variant="outlined"
                                margin="dense"
                                size="small"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                size="small"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    mb: 1.5,
                                    width: '100%',
                                    maxWidth: '100%',
                                    boxSizing: 'border-box',
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 1.5,
                                        backgroundColor: '#fafbfc',
                                    },
                                    '& .MuiInputBase-input': {
                                        fontSize: { xs: '0.9rem', sm: '0.95rem' },
                                    },
                                }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                disabled={isLoading}
                                sx={{
                                    py: 1,
                                    borderRadius: 1.5,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: { xs: '0.95rem', sm: '1rem' },
                                    mb: 1.5,
                                    width: '100%',
                                    maxWidth: '100%',
                                    boxSizing: 'border-box',
                                    position: 'relative',
                                    '&:disabled': {
                                        backgroundColor: 'primary.main',
                                        opacity: 0.7,
                                    },
                                }}
                            >
                                {isLoading ? (
                                    <>
                                        <CircularProgress
                                            size={24}
                                            sx={{
                                                color: 'white',
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                marginTop: '-12px',
                                                marginLeft: '-12px',
                                            }}
                                        />
                                        <span style={{ visibility: 'hidden' }}>Sign in →</span>
                                    </>
                                ) : (
                                    'Sign in →'
                                )}
                            </Button>
                        </form>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                mt: 0.5,
                                flexWrap: 'wrap',
                                gap: 0.5,
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'text.secondary',
                                    fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                                }}
                            >
                                Don&apos;t have an account?
                            </Typography>
                            <Button
                                onClick={onSwitchToRegister}
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    color: 'primary.main',
                                    p: 0,
                                    minWidth: 0,
                                    fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                                    '&:hover': {
                                        backgroundColor: 'transparent',
                                        textDecoration: 'underline',
                                    },
                                }}
                            >
                                Register
                            </Button>
                        </Box>
                        <Button
                            onClick={onSwitchToOtp}
                            sx={{
                                textTransform: 'none',
                                color: 'secondary.main',
                                display: 'block',
                                mx: 'auto',
                                mt: 1,
                                fontWeight: 500,
                                fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                                '&:hover': {
                                    backgroundColor: 'transparent',
                                    textDecoration: 'underline',
                                },
                            }}
                        >
                            Forgot Password?
                        </Button>
                    </Box>

                    {/* Right side: Image */}
                    <Box
                        sx={{
                            width: { xs: 0, md: '50%' },
                            height: { xs: 0, md: 'auto' },
                            position: 'relative',
                            display: { xs: 'none', md: 'block' },
                            overflow: 'hidden',
                        }}
                    >
                        <Box
                            component="img"
                            src={bgImage}
                            alt="Sign in background"
                            sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block',
                                filter: 'brightness(0.9)',
                            }}
                        />
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(45deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 100%)',
                            }}
                        />
                    </Box>
                </Paper>
            </Container>
        </Modal>
    );
};

LoginModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSwitchToRegister: PropTypes.func.isRequired,
    onSwitchToOtp: PropTypes.func.isRequired,
    onLoginSuccess: PropTypes.func.isRequired,
};

export default LoginModal;
