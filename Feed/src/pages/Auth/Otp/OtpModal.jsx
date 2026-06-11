import {
    Box,
    Modal,
    Typography,
    TextField,
    Button,
    InputAdornment,
    Container,
    Paper,
    CircularProgress,
    Alert,
} from '@mui/material';
import { MailOutline } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import bgImage from '../../../assets/images/SignIn.png';
import PropTypes from 'prop-types';
import { authService } from '../../../services/networkService'
import { useState } from 'react';

const validationSchema = Yup.object({
    email: Yup.string()
        .email('Please enter a valid email address')
        .required('Email is required'),
});

const OtpModal = ({ open, onClose, onSwitchToLogin, onSwitchToResetPassword }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const formik = useFormik({
        initialValues: { email: '' },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                setIsLoading(true);
                setError('');
                await authService.sendOTP(values.email);
                resetForm();
                onSwitchToResetPassword(values.email);
            } catch (err) {
                if (err.response?.data?.message?.includes('email')) {
                    setError('This email is not registered. Please sign up first.');
                } else {
                    setError('Failed to send verification code. Please try again.');
                }
                console.error('OTP request error:', err);
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="otp-modal-title"
            aria-describedby="otp-modal-description"
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
                        width: { xs: '100%', sm: '85%', md: '80%' },
                        maxWidth: 800,
                        margin: '0 auto',
                        minHeight: { xs: 'auto', md: 350 },
                        maxHeight: { xs: 'none', md: '70vh' },
                        boxShadow: 8,
                    }}
                >
                    {/* Left side: Form */}
                    <Box
                        sx={{
                            width: { xs: '100%', md: '50%' },
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            py: { xs: 2.5, sm: 3 },
                            background: 'rgba(255,255,255,0.98)',
                            flex: { xs: '1 1 auto', md: '1 1 50%' },
                            overflowY: { xs: 'auto', md: 'visible' },
                            maxHeight: { xs: '80vh', md: 'none' },
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
                            Reset Password
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
                            Enter your email to receive a verification code
                        </Typography>

                        <form onSubmit={formik.handleSubmit} noValidate style={{ width: '100%', boxSizing: 'border-box', paddingLeft: 16, paddingRight: 16 }}>
                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}
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
                                }}
                            >
                                {isLoading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    'Send OTP →'
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
                            flex: { xs: '0 0 0', md: '1 1 50%' },
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

OtpModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSwitchToLogin: PropTypes.func.isRequired,
    onSwitchToResetPassword: PropTypes.func.isRequired,
};

export default OtpModal;
