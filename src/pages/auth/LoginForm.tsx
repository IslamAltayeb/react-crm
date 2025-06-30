'use client';
 
import React , {useEffect} from 'react';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { Button, Paper, Stack, Typography } from '@mui/material';
 
export const LoginForm: React.FC<{ toggleForm: () => void }> = ({
  toggleForm,
}) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
 
  const navigate = useNavigate();
 
  const getuserRole = async () => {
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      };
  
      try {
        const res = await fetch("http://localhost:8000/api/auth/login/?email="+email, {
          method: 'GET',
          headers: headers,
        });
  
        if (!res.ok) {
          alert('HTTP error! status: ${res.status}');
        }
  
        const userData = await res.json();
        const permissionNames = userData.role.permissions.map((p: any) => p.name);
        localStorage.setItem('permissions', JSON.stringify(permissionNames));
      } catch (error) {
        alert('An error occurred please try again');
        console.error("Failed to fetch user details:", error);
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
 
    try {
      const response = await fetch('http://localhost:8000/api/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
 
      const data = await response.json();
 
      if (response.ok) {
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        
        getuserRole(); //get user details to store user permissions

        alert('Login successful!');
        navigate('/app');
      } else {
        alert('Login failed: ' + (data.detail || 'Invalid credentials'));
      }
    } catch (error) {
      alert('An error occurred during login');
      console.error('Login error:', error);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert('Please enter your email first.');
      return;
    }
 
    try {
      const response = await fetch(
        'http://localhost:8000/api/reset-password/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );
 
      if (response.ok) {
        alert('Password reset email has been sent!');
      } else {
        const data = await response.json();
        alert('Error: ' + (data.detail || 'Could not send email.'));
      }
    } catch (error) {
      alert('An error occurred while sending the reset email.');
      console.error('Reset error:', error);
    }
  };
 
  return (
<Paper
      elevation={4}
      sx={{
        width: { xs: '90%', sm: '80%', md: '60%', lg: '50%' },
        maxWidth: 800,
        mx: 'auto',
        mt: 5,
        mb: 5,
        p: 5,
        borderRadius: 4,
        autoComplete: 'off',
      }}
>
<Stack
        spacing={5}
        sx={{ pt: 25, pb: 5 }}
        component="form"
        onSubmit={handleSubmit}
>
<Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          justifyContent={'center'}
>
          Sign-in
</Typography>
 
        <TextField
          id="email-id"
          label="Email"
          variant="outlined"
          value={email}
          onChange={(event: any) => setEmail(event.target.value)}
        />
<TextField
          id="password-id"
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(event: any) => setPassword(event.target.value)}
        />
 
        {/* Forgot Password Link */}
<Typography
          variant="body2"
          align="right"
          sx={{
            cursor: 'pointer',
            color: 'primary.main',
            textDecoration: 'underline',
            '&:hover': { color: 'primary.dark' },
            mt: -2,
          }}
          onClick={handleForgotPassword}
>
          Forgot your password?
</Typography>
 
        <Button variant="contained" type="submit">
          Login
</Button>
 
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          Don't have an account?{' '}
<Button onClick={toggleForm}>Signup Here</Button>
</Typography>
</Stack>
</Paper>
  );
};