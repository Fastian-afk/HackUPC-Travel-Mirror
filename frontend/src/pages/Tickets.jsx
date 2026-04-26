import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ArrowBack, FlightTakeoff, AccessTime, MonetizationOn } from '@mui/icons-material';

const addDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const toDateInputValue = (value) => {
  const date = value instanceof Date ? value : new Date(value);
  return date.toISOString().slice(0, 10);
};

const TicketCard = ({ ticket }) => (
  <Card
    sx={{
      borderRadius: 2,
      boxShadow: '0 10px 28px rgba(15, 23, 42, 0.08)',
      border: '1px solid rgba(226, 232, 240, 0.7)',
      height: '100%',
    }}
  >
    <CardContent>
      <Stack spacing={1.2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {ticket.airline}
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b' }}>
              {ticket.origin} → {ticket.destination}
            </Typography>
          </Box>
          <Chip
            icon={<MonetizationOn />}
            label={`${Number(ticket.price).toFixed(0)} EUR`}
            color="primary"
            variant="outlined"
            sx={{ fontWeight: 700 }}
          />
        </Stack>

        <Divider />

        <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap">
          <Chip icon={<AccessTime />} label={`Departs ${ticket.departure}`} />
          <Chip icon={<AccessTime />} label={`Arrives ${ticket.arrival}`} />
        </Stack>
      </Stack>
    </CardContent>
  </Card>
);

function Tickets({ destination, onBack }) {
  const defaultDate = useMemo(() => toDateInputValue(addDays(30)), []);
  const defaultReturnDate = useMemo(() => toDateInputValue(addDays(37)), []);
  const [originIata, setOriginIata] = useState('BCN');
  const [destinationIata, setDestinationIata] = useState(destination?.iata || '');
  const [startDate, setStartDate] = useState(defaultDate);
  const [returnDate, setReturnDate] = useState(defaultReturnDate);
  const [adults, setAdults] = useState(1);
  const [market, setMarket] = useState('ES');
  const [currency, setCurrency] = useState('EUR');
  const [cabinClass, setCabinClass] = useState('CABIN_CLASS_ECONOMY');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (destination?.iata) {
      setDestinationIata(destination.iata);
    }
  }, [destination]);

  useEffect(() => {
    if (destinationIata) {
      void searchTickets();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destinationIata]);

  const searchTickets = async (event) => {
    if (event) {
      event.preventDefault();
    }

    if (!destinationIata) {
      setError('Please select a destination IATA code.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const startDateValue = new Date(startDate);
      const returnDateValue = returnDate ? new Date(returnDate) : null;

      if (returnDateValue && returnDateValue < startDateValue) {
        throw new Error('Return date must be after the start date.');
      }

      const response = await fetch('http://localhost:8000/flights/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          origin_iata: originIata,
          destination_iata: destinationIata,
          year: startDateValue.getFullYear(),
          month: startDateValue.getMonth() + 1,
          day: startDateValue.getDate(),
          return_year: returnDateValue ? returnDateValue.getFullYear() : undefined,
          return_month: returnDateValue ? returnDateValue.getMonth() + 1 : undefined,
          return_day: returnDateValue ? returnDateValue.getDate() : undefined,
          adults,
          market,
          currency,
          cabin_class: cabinClass,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.detail || 'Could not fetch flights.');
      }

      const data = await response.json();
      setTickets(data.tickets || []);
    } catch (err) {
      setTickets([]);
      setError(err.message || 'Failed to load flight tickets.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ py: { xs: 4, md: 6 }, backgroundColor: '#faf9f6', minHeight: '100%' }}>
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                Flight tickets
              </Typography>
              <Typography sx={{ color: '#64748b' }}>
                {destination?.city ? `Showing flights for ${destination.city}` : 'Search live plane tickets with Skyscanner'}
              </Typography>
            </Box>

            <Button startIcon={<ArrowBack />} variant="outlined" onClick={onBack} sx={{ borderRadius: '999px' }}>
              Back to trips
            </Button>
          </Stack>

          <Card sx={{ borderRadius: 2, boxShadow: '0 10px 28px rgba(15, 23, 42, 0.08)' }}>
            <CardContent>
              <Box component="form" onSubmit={searchTickets}>
                <Stack spacing={2}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField
                      label="From (IATA)"
                      value={originIata}
                      onChange={(e) => setOriginIata(e.target.value.toUpperCase())}
                      fullWidth
                    />
                    <TextField
                      label="To (IATA)"
                      value={destinationIata}
                      onChange={(e) => setDestinationIata(e.target.value.toUpperCase())}
                      fullWidth
                    />
                    <TextField
                      label="Start date"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                    <TextField
                      label="Return date"
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      fullWidth
                    />
                    <TextField
                      label="Adults"
                      type="number"
                      value={adults}
                      onChange={(e) => setAdults(Number(e.target.value) || 1)}
                      inputProps={{ min: 1, max: 9 }}
                      fullWidth
                    />
                  </Stack>

                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                    <TextField
                      label="Market"
                      value={market}
                      onChange={(e) => setMarket(e.target.value.toUpperCase())}
                      helperText="Example: ES, GB, FR"
                      fullWidth
                    />
                    <TextField
                      label="Currency"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                      helperText="Example: EUR"
                      fullWidth
                    />
                    <TextField
                      label="Cabin class"
                      value={cabinClass}
                      onChange={(e) => setCabinClass(e.target.value)}
                      helperText="Example: CABIN_CLASS_ECONOMY"
                      fullWidth
                    />
                  </Stack>

                  <Stack direction="row" spacing={1.5} flexWrap="wrap">
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<FlightTakeoff />}
                      disabled={loading || !destinationIata}
                      sx={{ borderRadius: 1.5 }}
                    >
                      {loading ? 'Searching...' : 'Search flights'}
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            </CardContent>
          </Card>

          {destination?.city && (
            <Chip
              label={`Destination: ${destination.city} (${destination.iata})`}
              color="secondary"
              sx={{ alignSelf: 'flex-start', fontWeight: 700, borderRadius: 1.5 }}
            />
          )}

          {error && (
            <Typography sx={{ color: '#b91c1c', fontWeight: 600 }}>
              {error}
            </Typography>
          )}

          {!loading && tickets.length === 0 && !error && (
            <Typography sx={{ color: '#64748b' }}>
              No flights loaded yet. Search flights to see live ticket options.
            </Typography>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Grid
              container
              spacing={2}
              sx={{
                maxWidth: 1120,
                width: '100%',
                justifyContent: 'center',
              }}
            >
              {tickets.map((ticket, index) => (
                <Grid key={`${ticket.airline}-${index}`} item xs={12} md={6}>
                  <TicketCard ticket={ticket} />
                </Grid>
              ))}
            </Grid>
          </Box>

          {tickets.length > 0 && (
            <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem' }}>
              Change any field above and press Search flights again to refresh results.
            </Typography>
          )}
        </Stack>
      </Container>
    </Box>
  );
}

export default Tickets;
