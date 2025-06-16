// 'use client'
import React, { useEffect, useState } from 'react';
import {
  Typography
} from '@mui/material';

export const UserDetails = (props:any) => {
  const [_user, setUser] = useState([]);

  useEffect(() => {
    setUser(props.created_by.user_details);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Typography>
      </Typography>
    </div>
  );
};
