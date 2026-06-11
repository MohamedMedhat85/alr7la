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
} from '@mui/material';
import { MailOutline, Visibility, VisibilityOff } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import bgImage from '../../../assets/images/SignIn.png';
import React from 'react';
import PropTypes from 'prop-types';
import { authService } from '../../../services/networkService';

const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
    otp: Yup.string().required('OTP is required'),
});

const ResetPasswordModal = ({ open, onClose, onSwitchToOtp }) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState('');

    const formik = useFormik({
        initialValues: { email: '', password: '', otp: '' },
        validationSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                setIsLoading(true);
                setError('');
                await authService.verifyOTP(values.email, values.otp, values.password, { newPassword: values.password });
                resetForm();
                onClose();
            } catch (err) {
                if (err.response?.data?.message?.includes('email')) {
                    setError('This email is not registered. Please sign up first.');
                }
                else if (err.response?.data?.meesage.include('expired'))
                    setError("OTP Expired")
                else if (err.response?.data?.message.include('Invalid OTP'))
                    setError("Invalid OTP")
                else {
                    setError('Failed to reset password. Please try again.');
                }
                console.error('Password reset error:', err);
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
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
                            Reset Password
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            align="center"
                            sx={{ color: 'text.secondary', mb: 2, fontSize: { xs: '0.9rem', sm: '0.95rem' }, maxWidth: '90%', mx: 'auto' }}
                        >
                            Enter your new password and verification code
                        </Typography>

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
                                            <MailOutline fontSize="small" />
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
                                label="New Password"
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
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
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

                            <TextField
                                fullWidth
                                id="otp"
                                name="otp"
                                label="Verification Code"
                                variant="outlined"
                                margin="dense"
                                size="small"
                                value={formik.values.otp}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.otp && Boolean(formik.errors.otp)}
                                helperText={formik.touched.otp && formik.errors.otp}
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
                                    fontWeight: 700,
                                    fontSize: { xs: '0.95rem', sm: '1rem' },
                                    mb: 1.5,
                                    width: '100%',
                                    maxWidth: '100%',
                                    boxSizing: 'border-box',
                                }}
                            >
                                {isLoading ? 'Resetting...' : 'Reset Password →'}
                            </Button>

                            {error && (
                                <Typography
                                    color="error"
                                    variant="body2"
                                    align="center"
                                    sx={{ mt: 1 }}
                                >
                                    {error}
                                </Typography>
                            )}
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
                                onClick={onSwitchToOtp}
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
                            Go back to send OTP
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

ResetPasswordModal.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSwitchToOtp: PropTypes.func.isRequired,
};

export default ResetPasswordModal;
