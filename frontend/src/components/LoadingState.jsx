import React from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Skeleton,
  useTheme,
} from '@mui/material';

const buildLoadingImageUrl = (query, seed = 1) => {
  const safeQuery = encodeURIComponent(query || 'dream travel destination');
  return `https://source.unsplash.com/1200x700/?${safeQuery},travel&sig=${seed}`;
};

const SkeletonCard = ({ featured = false, query = '', seed = 1 }) => {
  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.06)',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        '@keyframes pulse': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        display: 'flex',
        flexDirection: featured ? 'column' : 'row',
      }}
    >
      <Box sx={{ width: featured ? '100%' : '42%', flexShrink: 0 }}>
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            width: '100%',
            height: featured ? { xs: 180, sm: 220, md: 260 } : { xs: 160, sm: 180, md: 200 },
            backgroundColor: 'rgba(226, 232, 240, 0.6)',
            display: 'block',
          }}
        />
      </Box>
      <CardContent sx={{ p: featured ? 2.3 : 1.4, flexGrow: 1 }}>
        <Skeleton variant="text" width="65%" height={30} sx={{ mb: 0.8 }} />
        <Skeleton variant="text" width="40%" height={20} sx={{ mb: 2 }} />
        <Skeleton variant="text" width="100%" height={16} sx={{ mb: 0.7 }} />
        <Skeleton variant="text" width="92%" height={16} sx={{ mb: 2 }} />
      </CardContent>
    </Card>
  );
};

const LoadingState = ({ query }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: { xs: 'calc(100vh - 72px)', md: 'calc(100vh - 84px)' },
        py: { xs: 4, lg: 3 },
        background: 'linear-gradient(180deg, rgba(248,250,252,0.95) 0%, rgba(255,255,255,0.98) 100%)',
        transition: 'background 0.3s ease, opacity 0.25s ease',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
          <Box sx={{ textAlign: 'center', mb: { xs: 3.25, lg: 2.5 } }}>
            <Typography
              variant="h4"
              sx={{
                color: '#0f172a',
                fontWeight: 700,
                mb: 1,
                animation: 'fadeIn 0.8s ease-in',
              }}
            >
              Finding destinations that match your vibe...
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: '#64748b',
                animation: 'fadeIn 0.8s ease-in 0.2s both',
              }}
            >
              {query && `Searching for: "${query}"`}
            </Typography>
          </Box>

          <Box sx={{ mb: { xs: 2.5, lg: 1.5 }, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: { xs: 640, lg: 780 } }}>
              <SkeletonCard featured query={query} seed={1} />
            </Box>
          </Box>

          <Box sx={{ width: '100%', maxWidth: { xs: 700, lg: 960 }, mx: 'auto' }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: { xs: 1.6, lg: 1.25 },
                mb: { xs: 1.6, lg: 1.25 },
              }}
            >
              {[1, 2].map((index) => (
                <Box key={`row-two-${index}`} sx={{ display: 'flex', minWidth: 0 }}>
                  <Box
                    sx={{
                      width: '100%',
                      animation: 'slideUp 0.6s ease-out',
                      animationDelay: `${index * 0.08}s`,
                      animationFillMode: 'both',
                    }}
                  >
                    <SkeletonCard query={query} seed={index + 1} />
                  </Box>
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: { xs: 1.6, lg: 1.25 },
              }}
            >
              {[1, 2].map((index) => (
                <Box key={`row-three-${index}`} sx={{ display: 'flex', minWidth: 0 }}>
                  <Box
                    sx={{
                      width: '100%',
                      animation: 'slideUp 0.6s ease-out',
                      animationDelay: `${index * 0.08 + 0.16}s`,
                      animationFillMode: 'both',
                    }}
                  >
                    <SkeletonCard query={query} seed={index + 3} />
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LoadingState;
