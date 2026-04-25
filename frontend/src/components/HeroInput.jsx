import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  InputBase,
} from '@mui/material';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80';

const HeroInput = ({ onSubmit, isLoading, query, setQuery, error }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query);
    }
  };

  return (
    <Box
      sx={{
        minHeight: { xs: 'calc(100vh - 56px)', md: 'calc(100vh - 64px)' },
        mt: 0,
        pt: 0,
        pb: { xs: 5, md: 8 },
        display: 'flex',
        alignItems: 'center',
        color: '#ffffff',
        backgroundImage:
          'linear-gradient(135deg, rgba(15,23,42,0.65) 0%, rgba(37,99,235,0.35) 100%), url(' +
          HERO_IMAGE +
          ')',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            maxWidth: 840,
            mx: 'auto',
            textAlign: 'center',
            animation: 'fadeIn 0.9s ease-out',
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: '#ffffff',
              textShadow: '0 10px 28px rgba(15, 23, 42, 0.35)',
              mb: 1.5,
              fontWeight: 700,
            }}
          >
            Your Dream Trip Starts Here
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'rgba(255, 255, 255, 0.92)',
              fontWeight: 500,
              mb: 3,
            }}
          >
            Tell us what you love — we&apos;ll find the perfect escape.
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: { xs: 1.25, sm: 1.25 },
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#ffffff',
              borderRadius: '999px',
              p: { xs: 1.1, sm: 1 },
              boxShadow: '0 18px 48px rgba(15, 23, 42, 0.18)',
              animation: 'slideUp 0.9s ease-out 0.2s both',
            }}
          >
            <InputBase
              fullWidth
              placeholder="e.g., 'A sunny beach with great food' or 'Mountains and adventure'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading}
              sx={{
                px: { xs: 2, sm: 2.5 },
                py: { xs: 1.1, sm: 1 },
                fontSize: '1rem',
                color: '#0f172a',
              }}
              inputProps={{
                'aria-label': 'Search your dream trip',
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading || !query.trim()}
              sx={{
                px: { xs: 3.5, sm: 4 },
                py: 1.1,
                whiteSpace: 'nowrap',
                borderRadius: '999px',
                minWidth: { xs: '100%', sm: '190px' },
                background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)',
                boxShadow: '0 16px 30px rgba(37, 99, 235, 0.35)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 24px 40px rgba(37, 99, 235, 0.4)',
                },
              }}
            >
              Find my destination
            </Button>
          </Box>

          {error && (
            <Typography
              variant="body2"
              sx={{
                mt: 2,
                color: '#fee2e2',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                display: 'inline-block',
                px: 2,
                py: 0.75,
                borderRadius: '999px',
              }}
            >
              {error}
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default HeroInput;
