import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

export const Home = (_props: any) => {
  const [open, _setOpen] = useState(true);
  // const [orgSelected, setOrgSelected] = useState<boolean | null>(null);
  // const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar open={open} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>
    </Box>
  );
};
