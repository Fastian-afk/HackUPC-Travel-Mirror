import React from 'react';
import {
  Box,
  Container,
  Typography,
  Chip,
  Button,
} from '@mui/material';
import { Refresh, TrendingUp } from '@mui/icons-material';
import DestinationCard from './DestinationCard';

const ResultsSection = ({ query, results, interpretedTags, error, onReset, onRefine }) => {
  if (!results || results.length === 0) {
    return null;
  }

  const formattedResults = results.map((result, index) => ({
    id: result.id || index,
    name: result.name || result.title || 'Dream Destination',
    country: result.country || result.location || 'Explore',
    description: result.description || result.summary || '',
    image: result.image || `https://source.unsplash.com/featured/500x500?${encodeURIComponent(result.name || 'travel')}`,
    tags: result.tags || interpretedTags || [],
    price: result.price || Math.floor(Math.random() * 400) + 150,
  }));

  const featuredResult = formattedResults[0];
  const otherResults = formattedResults.slice(1, 7); // Show 6 more destinations

  return (
    <Box
      sx={{
        py: { xs: 3, md: 4 },
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        minHeight: '100vh',
      }}
    >
      <Container maxWidth="lg">
        
        {/* ========== HEADER SECTION ========== */}
        <Box sx={{ mb: 4 }}>
          {/* Top bar with Start Over button */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={onReset}
              size="small"
              sx={{ 
                borderRadius: '40px',
                borderColor: '#3b82f6',
                color: '#3b82f6',
                backgroundColor: '#ffffff',
                textTransform: 'none',
                px: 2,
                '&:hover': { 
                  backgroundColor: '#3b82f6', 
                  color: '#ffffff',
                },
              }}
            >
              Start Over
            </Button>
          </Box>

          {/* Search Query Display */}
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: '#0f172a',
              fontSize: { xs: '1.5rem', sm: '2rem' },
              mb: 1,
            }}
          >
            "{query}"
          </Typography>

          {/* Interpreted Tags */}
          {interpretedTags && interpretedTags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Based on:
              </Typography>
              {interpretedTags.map((tag, index) => (
                <Chip 
                  key={index} 
                  label={tag} 
                  size="small"
                  sx={{
                    backgroundColor: '#dbeafe',
                    color: '#1d4ed8',
                    fontWeight: 500,
                    fontSize: '0.7rem',
                    height: '26px',
                    borderRadius: '20px',
                  }}
                />
              ))}
            </Box>
          )}

          {error && (
            <Typography variant="body2" sx={{ color: '#b91c1c', bgcolor: '#fee2e2', display: 'inline-block', px: 2, py: 0.5, borderRadius: '999px', fontSize: '0.7rem' }}>
              {error}
            </Typography>
          )}
        </Box>

        {/* ========== FEATURED CARD SECTION ========== */}
        {featuredResult && (
          <Box sx={{ mb: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <TrendingUp sx={{ color: '#f59e0b', fontSize: 18 }} />
              <Typography sx={{ fontWeight: 600, color: '#f59e0b', fontSize: '0.8rem', letterSpacing: 0.5 }}>
                TOP PICK FOR YOU
              </Typography>
            </Box>
            <DestinationCard 
              destination={featuredResult}
              variant="featured"
            />
          </Box>
        )}

        {/* ========== OTHER DESTINATIONS SECTION - CENTERED GRID ========== */}
        {otherResults.length > 0 && (
          <Box>
            <Typography sx={{ fontWeight: 600, color: '#475569', fontSize: '0.8rem', mb: 2 }}>
              More destinations you might like
            </Typography>
            
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { 
                  xs: 'repeat(2, 1fr)',   // 2 columns on mobile
                  sm: 'repeat(2, 1fr)',   // 2 columns on tablet
                  md: 'repeat(4, 1fr)',   // 4 columns on desktop
                },
                gap: 3,
                justifyItems: 'center',
                alignItems: 'start',
              }}
            >
              {otherResults.map((destination, idx) => (
                <Box 
                  key={destination.id}
                  sx={{
                    width: '100%',
                    maxWidth: '280px', // Larger card width
                    animation: `fadeInUp 0.3s ease-out ${Math.min(idx * 0.05, 0.3)}s both`,
                  }}
                >
                  <DestinationCard 
                    destination={destination}
                    variant="default"
                  />
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ResultsSection;