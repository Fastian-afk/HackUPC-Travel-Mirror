import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Skeleton,
  Alert,
  Paper
} from '@mui/material';
import { FlightTakeoff, FlightLand, DateRange, People, FilterList } from '@mui/icons-material';
// You will need to install date pickers later if you want them

const DestinationDetail = ({ destination, flights, loading, onRefine }) => {
  const [sortBy, setSortBy] = useState('best');

  const handleSort = (event, newSort) => {
    if (newSort !== null) setSortBy(newSort);
  };

  // Sort logic
  const sortedFlights = [...flights];
  if (sortBy === 'cheapest') sortedFlights.sort((a, b) => a.price - b.price);
  if (sortBy === 'fastest') sortedFlights.sort((a, b) => a.durationValue - b.durationValue);
  // 'best' is usually default ranking from API

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pt: 3 }}>
      <Container maxWidth="lg">
        
        {/* 1. HERO SECTION */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 5, mb: 4, background: 'linear-gradient(135deg, #e0f2fe 0%, #ffffff 100%)' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 600 }}>
                Your Dream Destination
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, fontFamily: 'Poppins' }}>
                {destination.name}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                {destination.description}
              </Typography>
              <Chip label="🇯🇵 Best season: March - May" variant="outlined" sx={{ borderRadius: 2 }} />
            </Grid>
            <Grid item xs={12} md={5}>
              <Box component="img" src={destination.image} alt={destination.name} sx={{ width: '100%', borderRadius: 4, height: 200, objectFit: 'cover', boxShadow: 3 }} />
            </Grid>
          </Grid>
        </Paper>

        {/* 2. SEARCH CONTROLS */}
        <Paper elevation={0} sx={{ p: 2, borderRadius: 5, mb: 3, border: '1px solid', borderColor: 'divider' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#f8fafc', p: 1, borderRadius: 3 }}>
                <DateRange color="primary" fontSize="small" />
                <Box>
                  <Typography variant="caption" color="text.secondary">Departure</Typography>
                  <Typography variant="body2" fontWeight={600}>May 15, 2025</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#f8fafc', p: 1, borderRadius: 3 }}>
                <DateRange color="primary" fontSize="small" />
                <Box>
                  <Typography variant="caption" color="text.secondary">Return</Typography>
                  <Typography variant="body2" fontWeight={600}>May 22, 2025</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#f8fafc', p: 1, borderRadius: 3 }}>
                <People color="primary" fontSize="small" />
                <Typography variant="body2" fontWeight={600}>2 Adults, Economy</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button variant="contained" fullWidth sx={{ borderRadius: 5 }}>
                Update Search
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* 3. RESULTS HEADER & SORTING */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
          <Typography variant="h6" fontWeight={600}>
            ✈️ {flights.length} flight options found
          </Typography>
          <ToggleButtonGroup
            value={sortBy}
            exclusive
            onChange={handleSort}
            size="small"
            sx={{ bgcolor: 'white', borderRadius: 4 }}
          >
            <ToggleButton value="best">Best</ToggleButton>
            <ToggleButton value="cheapest">Cheapest</ToggleButton>
            <ToggleButton value="fastest">Fastest</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* 4. FLIGHT LIST */}
        {loading ? (
          // Loading Skeletons
          [1,2,3].map(i => <Skeleton key={i} variant="rectangular" height={120} sx={{ mb: 2, borderRadius: 3 }} />)
        ) : (
          sortedFlights.map((flight) => (
            <Card key={flight.id} sx={{ mb: 2, borderRadius: 4, transition: '0.2s', '&:hover': { boxShadow: 6 } }}>
              <CardContent>
                <Grid container alignItems="center" spacing={2}>
                  {/* Airline & Time */}
                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {/* Placeholder for Airline Logo */}
                      <Box sx={{ bgcolor: '#e2e8f0', borderRadius: 2, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FlightTakeoff sx={{ color: '#64748b' }} />
                      </Box>
                      <Box>
                        <Typography fontWeight={700}>{flight.airline}</Typography>
                        <Typography variant="caption" color="text.secondary">{flight.flightNumber}</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  {/* Route Details */}
                  <Grid item xs={12} md={5}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box textAlign="center">
                        <Typography fontWeight={700}>{flight.departureTime}</Typography>
                        <Typography variant="caption">{flight.origin}</Typography>
                      </Box>
                      <Box sx={{ flex: 1, mx: 2, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">{flight.duration}</Typography>
                        <Divider sx={{ my: 0.5 }} />
                        <Typography variant="caption">{flight.stops === 0 ? 'Direct' : `${flight.stops} stop`}</Typography>
                      </Box>
                      <Box textAlign="center">
                        <Typography fontWeight={700}>{flight.arrivalTime}</Typography>
                        <Typography variant="caption">{flight.destination}</Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Price & Action */}
                  <Grid item xs={12} md={3}>
                    <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                      <Typography variant="h5" fontWeight={800} color="primary.main">
                        ${flight.price}
                      </Typography>
                      <Button 
                        variant="contained" 
                        sx={{ borderRadius: 5, mt: 1, background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)' }}
                        href={flight.bookingUrl}
                        target="_blank"
                      >
                        View Deal →
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))
        )}
        
        {/* Trust Badge */}
        <Box sx={{ textAlign: 'center', mt: 4, mb: 2 }}>
          <Typography variant="caption" color="text.secondary">
            *Prices are provided by Skyscanner. You will be redirected to the booking site to complete your purchase.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default DestinationDetail;