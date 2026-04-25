import React, { useState, useEffect } from 'react';
import {
  Box, Container, Typography, Button, Card, CardMedia, Grid,
  Chip, Skeleton, Paper, Stack, alpha, Avatar, Divider, Rating
} from '@mui/material';
import {
  ArrowBack, AirplanemodeActive, LocalMall, EventAvailable, 
  WbSunny, Hotel, LocalOffer, VerifiedUser, 
  ChevronRight, FlightClass, AccessTime, Thermostat, InfoOutlined
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const DestinationDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.destination || null;
  const [loading, setLoading] = useState(true);

  const flights = [
    {
      id: 1, airline: 'Japan Airlines', airlineCode: 'JL 123',
      origin: 'JFK', destinationCode: 'HND',
      departureTime: '10:30 AM', arrivalTime: '08:45 AM',
      duration: '14h 15m', stops: 0, price: 1250, originalPrice: 1890,
      class: 'Economy',
    },
    {
      id: 2, airline: 'ANA', airlineCode: 'NH 456',
      origin: 'JFK', destinationCode: 'HND',
      departureTime: '02:15 PM', arrivalTime: '11:30 AM',
      duration: '15h 15m', stops: 1, price: 980, originalPrice: 1560,
      class: 'Economy',
    },
    {
      id: 3, airline: 'Delta Air Lines', airlineCode: 'DL 789',
      origin: 'EWR', destinationCode: 'HND',
      departureTime: '08:00 AM', arrivalTime: '06:15 AM',
      duration: '13h 15m', stops: 0, price: 1450, originalPrice: 2100,
      class: 'Economy',
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!destination) return <Box sx={{ p: 10, textAlign: 'center' }}>No Destination Selected</Box>;

  return (
    <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', pb: 10 }}>
      {/* 1. HERO SECTION */}
      <Box sx={{ position: 'relative', height: 260, width: '100%', overflow: 'hidden' }}>
        <CardMedia component="img" image={destination.image} sx={{ height: '100%', width: '100%', objectFit: 'cover' }} />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.85) 100%)' }} />
        
        <Container maxWidth="lg" sx={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', py: 3 }}>
          <Button 
            startIcon={<ArrowBack />} onClick={() => navigate(-1)} 
            sx={{ alignSelf: 'flex-start', color: 'white', bgcolor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', textTransform: 'none', px: 2, borderRadius: 2 }}
          >
            Back to search
          </Button>
          
          <Box>
            <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
              <Chip label={destination.country} size="small" sx={{ bgcolor: '#3B82F6', color: 'white', fontWeight: 800, height: 22, fontSize: '0.65rem' }} />
              <Chip icon={<VerifiedUser sx={{ color: 'white !important', fontSize: 14 }} />} label="Verified" size="small" variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', height: 22, fontSize: '0.65rem' }} />
            </Stack>
            <Typography variant="h3" sx={{ color: 'white', fontWeight: 900, fontSize: { xs: '2rem', md: '3rem' }, mb: 1 }}>{destination.name}</Typography>
            
            <Stack direction="row" spacing={4} sx={{ mt: 1.5, color: 'rgba(255,255,255,0.8)' }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <WbSunny fontSize="small" sx={{ color: '#F59E0B' }} />
                <Typography variant="caption" fontWeight={700}>Average 22°C</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                <Rating value={4.9} precision={0.1} readOnly size="small" sx={{ fontSize: '0.85rem' }} />
                <Typography variant="caption" fontWeight={700}>4.9/5</Typography>
              </Stack>
            </Stack>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {/* LEFT: FLIGHTS */}
          <Grid item xs={12} md={9}>
            <Stack spacing={3}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: 'white' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#3B82F6', mb: 1, letterSpacing: 0.5 }}>THE VIBE</Typography>
                <Typography variant="body1" sx={{ color: '#475569', lineHeight: 1.7, fontSize: '0.95rem' }}>
                  {destination.description} Explore a destination tailored to your aesthetic and travel preferences.
                </Typography>
              </Paper>

              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 0.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>Top Flight Connections</Typography>
                <Chip icon={<InfoOutlined sx={{ fontSize: '14px !important' }} />} label="Price tracking active" size="small" variant="outlined" sx={{ fontSize: '0.65rem', color: '#64748B', borderColor: '#E2E8F0' }} />
              </Stack>
              
              {loading ? <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 3 }} /> : flights.map((flight) => (
                <Card key={flight.id} elevation={0} sx={{ 
                  borderRadius: 3, border: '1px solid #E2E8F0', 
                  transition: '0.2s', '&:hover': { borderColor: '#3B82F6', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)' } 
                }}>
                  <Box sx={{ p: 3 }}>
                    <Grid container spacing={2} alignItems="center">
                      {/* Journey Details - 70% Horizontal Span */}
                      <Grid item xs={12} md={9.5}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Box sx={{ minWidth: 90 }}>
                            <Typography variant="h6" fontWeight={800} sx={{ fontSize: '1.15rem' }}>{flight.departureTime}</Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={700}>{flight.origin}</Typography>
                          </Box>
                          
                          <Box sx={{ flexGrow: 1, textAlign: 'center', px: 6 }}>
                            <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ fontSize: '0.7rem' }}>{flight.duration}</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
                              <Box sx={{ width: 8, height: 8, borderRadius: '50%', border: '2.5px solid #3B82F6' }} />
                              <Divider sx={{ flexGrow: 1, borderStyle: 'dashed', borderColor: '#CBD5E1', borderBottomWidth: 2 }} />
                              <AirplanemodeActive sx={{ color: '#3B82F6', transform: 'rotate(90deg)', mx: 2, fontSize: 20 }} />
                              <Divider sx={{ flexGrow: 1, borderStyle: 'dashed', borderColor: '#CBD5E1', borderBottomWidth: 2 }} />
                              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#3B82F6' }} />
                            </Box>
                            <Typography variant="caption" color="success.main" fontWeight={800} sx={{ fontSize: '0.65rem', letterSpacing: 1 }}>
                              DIRECT FLIGHT
                            </Typography>
                          </Box>

                          <Box sx={{ minWidth: 90, textAlign: 'right' }}>
                            <Typography variant="h6" fontWeight={800} sx={{ fontSize: '1.15rem' }}>{flight.arrivalTime}</Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={700}>{flight.destinationCode}</Typography>
                          </Box>
                        </Stack>
                        
                        <Stack direction="row" spacing={3} sx={{ mt: 3, alignItems: 'center' }}>
                          <Stack direction="row" spacing={1.5} alignItems="center">
                            <Avatar sx={{ width: 22, height: 22, bgcolor: '#0F172A', fontSize: '0.65rem', fontWeight: 800 }}>{flight.airline[0]}</Avatar>
                            <Typography variant="caption" fontWeight={700} color="#475569">{flight.airline}</Typography>
                          </Stack>
                          <Divider orientation="vertical" flexItem sx={{ height: 14, my: 'auto' }} />
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <FlightClass sx={{ fontSize: 16, color: '#94A3B8' }} />
                            <Typography variant="caption" fontWeight={700} color="text.secondary">{flight.class}</Typography>
                          </Stack>
                        </Stack>
                      </Grid>

                      {/* Select Button - Spanned Right */}
                      <Grid item xs={12} md={2.5} sx={{ textAlign: 'right', borderLeft: { md: '1px solid #F1F5F9' }, pl: { md: 3 } }}>
                        <Typography variant="caption" sx={{ color: '#94A3B8', textDecoration: 'line-through', fontSize: '0.75rem' }}>${flight.originalPrice}</Typography>
                        <Typography variant="h5" fontWeight={900} color="#0F172A" sx={{ mt: 0.2, mb: 1.5 }}>${flight.price}</Typography>
                        <Button fullWidth variant="contained" sx={{ bgcolor: '#3B82F6', borderRadius: 2, textTransform: 'none', fontWeight: 800, fontSize: '0.85rem', py: 1.2 }}>Select Flight</Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Card>
              ))}
            </Stack>
          </Grid>

          {/* RIGHT: SIDEBAR */}
          <Grid item xs={12} md={3}>
            <Stack spacing={2.5}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #E2E8F0', bgcolor: 'white' }}>
                <Typography variant="caption" sx={{ fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: 1, mb: 2, display: 'block' }}>Insights</Typography>
                <Stack spacing={2.5}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Thermostat sx={{ color: '#F59E0B', fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" fontWeight={800}>Weather Forecast</Typography>
                      <Typography variant="caption" color="text.secondary">Average 22°C — Ideal visibility</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <LocalMall sx={{ color: '#3B82F6', fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" fontWeight={800}>Baggage Policy</Typography>
                      <Typography variant="caption" color="text.secondary">1 Cabin + 1 Checked item</Typography>
                    </Box>
                  </Box>
                </Stack>
              </Paper>

              <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #E2E8F0', overflow: 'hidden', bgcolor: 'white' }}>
                <Box sx={{ height: 140, position: 'relative' }}>
                  <CardMedia component="img" image="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600" sx={{ height: '100%', objectFit: 'cover' }} />
                  {/* Adjusted Badge Position to avoid curve clipping */}
                  <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
                    <Chip label="SAVE 15%" size="small" sx={{ bgcolor: '#EF4444', color: 'white', fontWeight: 900, fontSize: '0.65rem', border: 'none' }} />
                  </Box>
                </Box>
                <Box sx={{ p: 2.5 }}>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    <Hotel sx={{ color: '#3B82F6', fontSize: 18 }} />
                    <Typography variant="subtitle2" fontWeight={900}>Exclusive Stays</Typography>
                  </Stack>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2.5, lineHeight: 1.5 }}>
                    Unlock special DreamTrip rates when you bundle your flight and hotel stay.
                  </Typography>
                  <Button fullWidth variant="outlined" endIcon={<ChevronRight />} sx={{ borderRadius: 2, fontWeight: 800, textTransform: 'none', fontSize: '0.75rem', borderColor: '#3B82F6', color: '#3B82F6' }}>Browse Hotels</Button>
                </Box>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default DestinationDetail;