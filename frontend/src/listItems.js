import * as React from 'react';
import { Link } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LyricsIcon from '@mui/icons-material/Lyrics';

import MicIcon from '@mui/icons-material/Mic';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export const mainListItems = ({ onItemClick }) => (
  <React.Fragment>
    <ListItemButton onClick={() => onItemClick('Dashboard')}> 
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton onClick={() => onItemClick('Transcribe')}>
      <ListItemIcon>
        <LyricsIcon />
      </ListItemIcon>
      <ListItemText primary="Transcribe" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AccountCircleIcon />
      </ListItemIcon>
      <ListItemText primary="Account" />
    </ListItemButton>
    
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      
    </ListSubheader>
    {/* <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary=" " />
    </ListItemButton> */}
    
  </React.Fragment>
);