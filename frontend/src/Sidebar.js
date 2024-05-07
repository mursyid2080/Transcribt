// Sidebar.js
import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MicIcon from '@mui/icons-material/Mic';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export const mainListItems = [
  {
    path: '/dashboard',
    icon: <DashboardIcon />,
    text: 'Dashboard'
  },
  {
    path: '/record',
    icon: <MicIcon />,
    text: 'Record'
  },
  {
    path: '/account',
    icon: <AccountCircleIcon />,
    text: 'Account'
  }
];

export const secondaryListItems = [];

