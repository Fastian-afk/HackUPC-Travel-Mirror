import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Container,
  Typography,
} from '@mui/material';
import { FlightTakeoff } from '@mui/icons-material';
import logoSvg from '../assets/logo.svg';
import logoPng from '../assets/logo.png';

const Navbar = () => {
  const [logoError, setLogoError] = useState(false);
  const [logoIndex, setLogoIndex] = useState(0);
  const logoSources = [logoPng, logoSvg]; // prefer the PNG (likely higher-res / exact crop) and fall back to SVG
  const logoSrc = logoSources[logoIndex];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 1200,
        backgroundColor: '#e6f0fa',
        borderBottom: '1px solid rgba(37, 99, 235, 0.15)', // ADD THIS
        boxShadow: 'none',
        py: 0,
        minHeight: 'auto',
      }}
    >
      <Container 
        maxWidth="lg"
        sx={{ 
          px: { xs: 2, sm: 3 }
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          py: { xs: 1, sm: 1.25 },  // comfortable padding (8-10px)
        }}>
          {!logoError ? (
            <Box
              component="img"
              src={logoSrc}
              alt="DreamTrip logo"
              onError={() => {
                if (logoIndex < logoSources.length - 1) {
                  setLogoIndex((prev) => prev + 1);
                  return;
                }
                console.warn('Logo failed to load, using fallback.');
                setLogoError(true);
              }}
              loading="eager"
              sx={{
                maxHeight: { xs: 40, sm: 48, md: 56 },  // ← REDUCED: professional logo size
                width: 'auto',
                maxWidth: { xs: 160, sm: 200, md: 240 },  // ← REDUCED: proportional
                display: 'block',
                backgroundColor: 'transparent',
                p: 0,
                borderRadius: 0,
                boxShadow: 'none',
                imageRendering: 'auto',
              }}
            />
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FlightTakeoff sx={{ color: '#2563eb', fontSize: 32 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a' }}>
                DreamTrip
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </AppBar>
  );
};

export default Navbar;