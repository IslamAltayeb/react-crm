import React, { useEffect, useState } from 'react';
import {
  Card,
  Avatar,
  Box,
  Typography,
  Grid,
} from '@mui/material';


import { CustomAppBar } from '../../components/CustomAppBar';
import { useLocation, useNavigate } from 'react-router-dom';
import { AntSwitch } from '../../styles/CssStyled';
import { UserUrl } from '../../services/ApiUrls';
import { fetchData } from '../../components/FetchData';

type response = {
  user_details: {
    username: string;
    email: string;
    is_active: boolean;
    profile_pic: string;
  };
  role_details: {
    name: string;
    description: string;
  };
  address: {
    address_line: string;
    street: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  is_organization_admin: boolean;
  has_marketing_access: boolean;
  has_sales_access: boolean;
  phone: string;
  alternate_phone: string;
  date_of_joining: string;
  is_active: boolean;
};

export const formatDate = (dateString: any) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function UserDetails() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [userDetails, setUserDetails] = useState<response | null>(null);

  useEffect(() => {
    getUserDetail(state.userId);
  }, [state.userId]);

  const getUserDetail = (id: string) => {
    const Header = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      org: localStorage.getItem('org'),
    };

    fetchData(`${UserUrl}/${id}/`, 'GET', null as any, Header).then((res) => {
      console.log(res, 'res');
      if (!res.error) {
        setUserDetails(res?.data?.profile_obj);
      }
    });
  };

  const backbtnHandle = () => {
    navigate('/app/users');
  };

  const editHandle = () => {
    navigate('/app/users/edit-user', {
      state: {
        value: {
          username: userDetails?.user_details?.username,
          email: userDetails?.user_details?.email,
          role: userDetails?.role_details?.name,
          phone: userDetails?.phone,
          alternate_phone: userDetails?.alternate_phone,
          address_line: userDetails?.address?.address_line,
          street: userDetails?.address?.street,
          city: userDetails?.address?.city,
          state: userDetails?.address?.state,
          postcode: userDetails?.address?.postcode,
          country: userDetails?.address?.country,
          profile_pic: userDetails?.user_details?.profile_pic,
          has_sales_access: userDetails?.has_sales_access,
          has_marketing_access: userDetails?.has_marketing_access,
          is_organization_admin: userDetails?.is_organization_admin,
        },
        id: state?.userId,
      },
    });
  };

  const module = 'Users';
  const crntPage = 'User Detail';
  const backBtn = 'Back To Users';

  return (
    <Box sx={{ mt: '60px' }}>
      <CustomAppBar
        backbtnHandle={backbtnHandle}
        module={module}
        backBtn={backBtn}
        crntPage={crntPage}
        editHandle={editHandle}
      />
      <Box
        sx={{
          mt: '120px',
          p: '20px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ width: '100%' }}>
          <Card sx={{ borderRadius: '7px' }}>
            <Box
              sx={{
                p: 2,
                borderBottom: '1px solid lightgray',
                display: 'flex',
                // flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="h6"
                sx={{ fontWeight: 600, fontSize: '18px', color: '#1a3353f0' }}>
                User Details
              </Typography>
            </Box>
            <Grid container spacing={2} sx={{ p: 2 }}>
              <Grid item xs={8} sm={4}>
                <Typography variant="h6">Email Name</Typography>
                <Typography variant="body1">
                  {userDetails?.user_details?.email || '---'}
                </Typography>
              </Grid>

              <Grid item xs={8} sm={4}>
                <Typography variant="h6">Is Active</Typography>
                <Typography variant="body1">
                  <AntSwitch checked={userDetails?.user_details?.is_active} />
                </Typography>
              </Grid>

              <Grid item xs={8} sm={4}>
                <Typography variant="h6">Profile pic</Typography>
                <Avatar
                  sx={{ width: 150, height: 150, mb: 2, }}
                  alt={'User'}
                  src={"http://localhost:8000/" + userDetails?.user_details?.profile_pic}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ p: 2 }}>
              <Grid item xs={8} sm={4}>
                <Typography variant="h6">Role</Typography>
                <Typography
                  sx={{
                    fontSize: 16,
                    color: '#1E90FF',
                    mt: '5%',
                  }}
                >
                  {userDetails?.role_details?.name || '---'}
                </Typography>
              </Grid>

              <Grid item xs={8} sm={4}>
                <Typography variant="h6">Mobile Number</Typography>
                <Typography variant="h6">{userDetails?.phone || '---'}</Typography>
              </Grid>

              <Grid item xs={8} sm={4}>
                <Typography variant="h6">Marketing Access</Typography>
                <AntSwitch checked={userDetails?.has_marketing_access} />
              </Grid>

            </Grid>

            <Grid container spacing={2} sx={{ p: 2 }}>
              <Grid item xs={8} sm={4}>
                <Typography variant="h6">Sales Access</Typography>
                <AntSwitch checked={userDetails?.has_sales_access} />
              </Grid>

              <Grid item xs={8} sm={4}>
                <Typography variant="h6">Date of joining</Typography>
                <Typography variant="h6">
                  {userDetails?.date_of_joining || '---'}
                </Typography>
              </Grid>
            </Grid>

            <Box sx={{ mt: 2 }} >
              <Box
                sx={{
                  px: 2,
                  py: 2,
                  borderBottom: '1px solid lightgray',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a3353f0' }}>
                  Address
                </Typography>
              </Box>

              <Grid container spacing={2} sx={{ px: 2, py: 2 }}>
                <Grid item xs={12} sm={4} >
                  <Typography variant="h6">Address Lane</Typography>
                  <Typography variant="h6">
                    {userDetails?.address?.address_line || '---'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={4} >
                  <Typography variant="h6">Street</Typography>
                  <Typography variant="h6">
                    {userDetails?.address?.street || '---'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={4} >
                  <Typography variant="h6">City</Typography>
                  <Typography variant="h6">
                    {userDetails?.address?.city || '---'}
                  </Typography>
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ px: 2, py: 2 }}>
                <Grid item xs={12} sm={4} >
                  <Typography variant="h6">Postcode</Typography>
                  <Typography variant="h6">
                    {userDetails?.address?.postcode || '---'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={4} >
                  <Typography variant="h6">State</Typography>
                  <Typography variant="h6">
                    {userDetails?.address?.state || '---'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={4} >
                  <Typography variant="h6">Country</Typography>
                  <Typography variant="h6">
                    {userDetails?.address?.country || '---'}
                  </Typography>
                </Grid>
              </Grid>

            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
