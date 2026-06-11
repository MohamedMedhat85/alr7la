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
    Alert,
} from '@mui/material';
import { MailOutline, Visibility, VisibilityOff, Person } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import bgImage from '../../../assets/images/SignIn.png';
import React from 'react';
import PropTypes from 'prop-types';
import { authService } from '../../../services/networkService'

const validationSchema = Yup.object({
    name: Yup.string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters'),
    email: Yup.string()
        .email('Please enter a valid email address')
        .required('Email is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
});

const RegisterModal = ({ open, onClose, onSwitchToLogin }) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                setIsLoading(true);
                setError('');
                await authService.register(values);
                resetForm();
                onClose();
            } catch (err) {
                if (err.response?.data?.message?.includes('email')) {
                    setError('This email is already registered. Please use a different email or sign in.');
                } else {
                    setError('An error occurred during registration. Please try again.');
                }
                console.error('Registration error:', err);
            } finally {
                setIsLoading(false);
            }
        },
    });

    const handleClose = () => {
        setError('');
        formik.resetForm();
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="register-modal-title"
            aria-describedby="register-modal-description"
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
                            Create Account
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
                            Join us and start your journey
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 2, mx: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={formik.handleSubmit} noValidate style={{ width: '100%', boxSizing: 'border-box', paddingLeft: 16, paddingRight: 16 }}>
                            <TextField
                                fullWidth
                                id="name"
                                name="name"
                                label="Full Name"
                                variant="outlined"
                                margin="dense"
                                size="small"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                                disabled={isLoading}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Person fontSize="small" color="action" />
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
                                disabled={isLoading}
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
                                disabled={isLoading}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                                size="small"
                                                disabled={isLoading}
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
                                }}
                            >
                                {isLoading ? (
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
                                ) : (
                                    'Create Account →'
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
                                Already have an account?
                            </Typography>
                            <Button
                                onClick={onSwitchToLogin}
                                disabled={isLoading}
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
                                Sign in
                            </Button>
                        </Box>
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
                            alt="Sign up background"
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

RegisterModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSwitchToLogin: PropTypes.func.isRequired,
};

export default RegisterModal;
