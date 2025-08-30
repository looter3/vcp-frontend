import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import { styled } from '@mui/material/styles';
import {Navigate, Link as RouterLink } from 'react-router-dom';
import ForgotPassword from './ForgotPassword';
import { SitemarkIcon } from './CustomIcons';
import {loginApi} from "../../api/login-api.ts";
import type {Credentials} from "../../model/Credentials.ts";
import {useAuth} from "../Context/AuthContext.tsx";

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const LoginContainer = styled(Stack)(({ theme }) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

export default function Login() {
    const [usernameError, setUsernameError] = React.useState(false);
    const [usernameErrorMessage, setUsernameErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [credentials, setCredentials] = React.useState<Credentials>({
        username: '',
        password: '',
    });
    const { login, isAuthenticated } = useAuth();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({...credentials, [event.target.name] : event.target.value});
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // add your validation here
        const isValid = validatePassword();

        if(!isValid) {
            return;
        }

        if (usernameError || passwordError) {
            event.preventDefault();
            return;
        }
        const data = new FormData(event.currentTarget);

        // Extract values
        const username = data.get('username') as string| null;
        const password = data.get('password') as string| null;

        if (!username || !password) {
            console.error("Missing username or password");
            return;
        }

        // Try to authenticate
        const submittedCredentials: Credentials = {
            username: username,
            password
        };
        setCredentials(submittedCredentials);

        const success = await loginApi(credentials);
        if (success) {
            login(credentials.username); // update context and sessionStorage
        } else {
            setOpen(true); // open error dialog or show error
        }
    };

    const validatePassword = () => {

        // Extract data from form
        //const username = document.getElementById('username') as HTMLInputElement;
        const password = document.getElementById('password') as HTMLInputElement;

        let isValid = true;

        /*
        // check for emails
        if (!username.value || !/\S+@\S+\.\S+/.test(username.value)) {
            setUsernameError(true);
            setUsernameErrorMessage('Please enter a valid username address.');
            isValid = false;
        } else {
         */
            setUsernameError(false);
            setUsernameErrorMessage('');
        //}

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    };

    if(isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    } else {
        return (
            <>
                <CssBaseline enableColorScheme />
                <LoginContainer direction="column" justifyContent="space-between">
                    <Card variant="outlined">
                        <SitemarkIcon />
                        <Typography
                            component="h1"
                            variant="h4"
                            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                        >
                            Sign in
                        </Typography>
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            noValidate
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                width: '100%',
                                gap: 2,
                            }}
                        >
                            <FormControl>
                                <FormLabel htmlFor="username">username</FormLabel>
                                <TextField
                                    onChange={handleChange}
                                    error={usernameError}
                                    helperText={usernameErrorMessage}
                                    id="username"
                                    type="username"
                                    name="username"
                                    placeholder="your@username.com"
                                    autoComplete="username"
                                    autoFocus
                                    required
                                    fullWidth
                                    variant="outlined"
                                    color={usernameError ? 'error' : 'primary'}
                                />
                            </FormControl>
                            <FormControl>
                                <FormLabel htmlFor="password">Password</FormLabel>
                                <TextField
                                    onChange={handleChange}
                                    error={passwordError}
                                    helperText={passwordErrorMessage}
                                    name="password"
                                    placeholder="••••••"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    autoFocus
                                    required
                                    fullWidth
                                    variant="outlined"
                                    color={passwordError ? 'error' : 'primary'}
                                />
                            </FormControl>
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
                            <ForgotPassword open={open} handleClose={handleClose} />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                            >
                                Sign in
                            </Button>
                            <Link
                                component="button"
                                type="button"
                                onClick={handleClickOpen}
                                variant="body2"
                                sx={{ alignSelf: 'center' }}
                            >
                                Forgot your password?
                            </Link>
                        </Box>
                        <Divider>or</Divider>
                        <Box>
                            <Typography sx={{ textAlign: 'center' }}>
                                Don&apos;t have an account?{' '}
                                <Link
                                    component={RouterLink}
                                    to="/signup"
                                    variant="body2"
                                    sx={{ alignSelf: 'center' }}
                                >
                                    Sign up
                                </Link>
                            </Typography>
                        </Box>
                    </Card>
                </LoginContainer>
            </>
        );
    }
}