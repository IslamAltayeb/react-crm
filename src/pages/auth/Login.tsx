import React, { useEffect, useState } from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import imgGoogle from '../../assets/images/auth/google.svg';
import imgLogo from '../../assets/images/auth/img_logo.png';
import { GoogleButton } from '../../styles/CssStyled';
import { fetchData } from '../../components/FetchData';
import { AuthUrl } from '../../services/ApiUrls';
import '../../styles/style.css';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import '../../styles/style.css';
import axios from 'axios';

declare global {
  interface Window {
    google: any;
    gapi: any;
  }
}

export default function Login() {
  const navigate = useNavigate();
  // const [token, setToken] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [googleEnabled, setGoogleEnabled] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      navigate('/app');
    }
    // Get ENABLE_GOOGLE_AUTH flag from backend
    axios
      .get('http://localhost:8000/api/auth/google-auth-config/')
      .then((res) => setGoogleEnabled(res.data.google_enabled))
      .catch((err) => {
        console.error('Could not fetch auth config:', err);
      });
  }, []);


  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      const apiToken = { token: tokenResponse.access_token };
      // const formData = new FormData()
      // formData.append('token', tokenResponse.access_token)
      const head = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
      fetchData(`${AuthUrl}/`, 'POST', JSON.stringify(apiToken), head)
        .then((res: any) => {
          localStorage.setItem('accessToken', `Bearer ${res.access_token}`);
          navigate('/organization');
        })
        .catch((error: any) => {
          console.error('Error:', error);
        });
    },
  });
  return (
    <div>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="center"
        alignItems="center"
        sx={{ height: '100%', width: '100%', position: 'fixed' }}
      >
        <Grid
          container
          item
          xs={8}
          direction="column"
          justifyContent="space-evenly"
          alignItems="center"
          sx={{ height: '100%', overflow: 'hidden' }}
        >
          <Grid item>
            <Grid sx={{ mt: 2 }}>
              <img
                src={imgLogo}
                alt="register_logo"
                className="register-logo"
              />
            </Grid>
            <Typography variant="h5" style={{ fontWeight: 'bolder' }}>
              Sign In
            </Typography>
            <Grid item sx={{ mt: 4 }}>
              {googleEnabled && (
                <GoogleButton
                  variant="outlined"
                  onClick={() => login()}
                  sx={{ fontSize: '12px', fontWeight: 500 }}
                >
                  Sign in with Google
                  <img
                    src={imgGoogle}
                    alt="google"
                    style={{ width: '17px', marginLeft: '5px' }}
                  />
                </GoogleButton>
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          item
          xs={8}
          direction="column"
          justifyContent="center"
          alignItems="center"
          className="rightBg"
          sx={{ height: '100%', overflow: 'hidden', justifyItems: 'center' }}
        >
          {isLogin ? (
            <LoginForm toggleForm={() => setIsLogin(false)} />
          ) : (
            <SignupForm toggleForm={() => setIsLogin(true)} />
          )}
        </Grid>
      </Stack>
    </div>
  );
}
