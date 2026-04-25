import { useMemo } from 'react';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import DestinationDetail from './pages/DestinationDetail';
import getTheme from './theme/theme';

function App() {
  const theme = useMemo(() => getTheme(), []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={theme.customStyles.layout.appShell}>
          <Navbar />
          <Box sx={theme.customStyles.layout.contentArea}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/destination" element={<DestinationDetail />} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;