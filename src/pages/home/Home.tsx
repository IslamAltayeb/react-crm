import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useNavigate, Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Organization from '../organization/Organization';

export const Home = (props: any) => {
  const [open, setOpen] = useState(true);
  const [orgSelected, setOrgSelected] = useState<boolean | null>(null);
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar open={open} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};
