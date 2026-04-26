import { useMemo, useState } from 'react';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Tickets from './pages/Tickets';
import getTheme from './theme/theme';

function App() {
  const theme = useMemo(() => getTheme(), []);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedDestination, setSelectedDestination] = useState(null);

  const handleExplore = (destination) => {
    setSelectedDestination(destination || null);
    setCurrentPage('tickets');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box sx={theme.customStyles.layout.appShell}>
        <Navbar />
        <Box sx={theme.customStyles.layout.contentArea}>
          {currentPage === 'home' ? (
            <Home onExplore={handleExplore} />
          ) : (
            <Tickets
              destination={selectedDestination}
              onBack={() => setCurrentPage('home')}
            />
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;