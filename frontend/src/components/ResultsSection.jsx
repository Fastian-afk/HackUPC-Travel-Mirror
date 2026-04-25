import React from 'react';
import {
  Box,
  Container,
  Typography,
  Chip,
  Button,
  Card,
  CardMedia,
  CardContent,
} from '@mui/material';
import { Refresh } from '@mui/icons-material';

const buildImageUrl = (name, seed = 1) => {
  const safeName = encodeURIComponent(name || 'travel');
  return `https://source.unsplash.com/1200x700/?${safeName},travel&sig=${seed}`;
};

const buildFallbackImageUrl = (name, seed = 1) => {
  const safeName = encodeURIComponent(name || 'destination');
  return `https://picsum.photos/seed/${safeName}-${seed}/1200/700`;
};

const ResultImage = ({ primarySrc, fallbackSrc, alt, sx }) => {
  const [currentSrc, setCurrentSrc] = React.useState(primarySrc);
  const [usedFallback, setUsedFallback] = React.useState(false);

  React.useEffect(() => {
    setCurrentSrc(primarySrc);
    setUsedFallback(false);
  }, [primarySrc]);

  return (
    <CardMedia
      component="img"
      image={currentSrc}
      alt={alt}
      onError={() => {
        if (!usedFallback) {
          setCurrentSrc(fallbackSrc);
          setUsedFallback(true);
        }
      }}
      sx={sx}
    />
  );
};

const DestinationResultCard = ({ destination, featured = false, onRefine, imageSeed = 1 }) => {
  const name = destination?.name || destination?.title || 'Dream destination';
  const description = destination?.description || 'A place where your dreams meet reality.';
  const imageUrl = destination?.image || buildImageUrl(name, imageSeed);
  const fallbackImageUrl = buildFallbackImageUrl(name, imageSeed);
  const priceLabel = destination?.price ? `From $${destination.price}` : null;

  return (
      <Card
      sx={{
        height: '100%',
        borderRadius: '28px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: featured ? 'column' : 'row',
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-6px)',
          boxShadow: '0 18px 40px rgba(15, 23, 42, 0.12)',
        },
      }}
    >
      <Box
        sx={{
          width: featured ? '100%' : '42%',
          height: featured
            ? { xs: 180, sm: 220, md: 260 }
            : { xs: 160, sm: 180, md: 200 },
          minHeight: featured ? { xs: 180, sm: 220, md: 260 } : undefined,
          flexShrink: 0,
          position: 'relative',
        }}
      >
        <ResultImage
          primarySrc={imageUrl}
          fallbackSrc={fallbackImageUrl}
          alt={name}
          sx={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {featured && (
          <Chip
            label="Best Match"
            color="secondary"
            sx={{
              position: 'absolute',
              top: 14,
              left: 14,
              fontWeight: 700,
            }}
          />
        )}
      </Box>

      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          p: featured ? { xs: 1.4, sm: 1.8 } : { xs: 1.5, sm: 1.4 },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1.2, mb: 1.2 }}>
          <Typography
            variant={featured ? 'h5' : 'h6'}
            sx={{
              fontWeight: 700,
              lineHeight: 1.2,
              fontSize: featured ? { xs: '1rem', sm: '1.1rem' } : { xs: '0.95rem', sm: '0.92rem' },
            }}
          >
            {name}
          </Typography>
          {priceLabel && (
            <Chip
              label={priceLabel}
              color="secondary"
              variant="filled"
              size={featured ? 'medium' : 'small'}
              sx={{ fontWeight: 600 }}
            />
          )}
        </Box>

        <Typography
          variant="body2"
          sx={{
            color: '#475569',
            mb: 1.2,
            lineHeight: 1.45,
            flexGrow: 1,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontSize: featured ? '0.92rem' : '0.84rem',
          }}
        >
          {description}
        </Typography>

        <Button
          variant="contained"
          onClick={() => onRefine?.(name)}
          sx={{ 
            alignSelf: 'flex-start', 
            minHeight: 36, 
            px: 2.2, 
            py: 0.8, 
            fontSize: '0.86rem',
            background: 'linear-gradient(135deg, #60a5fa 0%, #2563eb 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
            },
          }}
        >
          Explore →
        </Button>
      </CardContent>
    </Card>
  );
};

const ResultsSection = ({ query, results, interpretedTags, error, onReset, onRefine }) => {
  if (!results || results.length === 0) {
    return null;
  }

  const featuredResult = results[0];
  const firstPair = results.slice(1, 3);
  const secondPair = results.slice(3, 5);

  return (
    <Box
      sx={{
        py: { xs: 3, md: 4 },
        // CHANGED: Background to match logo's light blue
        background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
        transition: 'background 0.3s ease',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            width: '100%',
            maxWidth: { xs: 700, lg: 960 },
            mx: 'auto',
            display: 'flex',
            justifyContent: 'flex-end',
            mb: { xs: 1, lg: 0.8 },
          }}
        >
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={onReset}
            sx={{ 
              borderRadius: '999px', 
              px: 2.4, 
              py: 0.6,
              borderColor: '#3b82f6',
              color: '#2563eb',
              '&:hover': {
                borderColor: '#1e40af',
                backgroundColor: 'rgba(37, 99, 235, 0.04)',
              },
            }}
          >
            Start Over
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1.5, color: '#0f172a' }}>
            Based on your search: "{query}"
          </Typography>

          {interpretedTags && interpretedTags.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: 1.5,
                mb: 3,
              }}
            >
              {interpretedTags.map((tag, index) => (
                <Chip
                  key={`${tag}-${index}`}
                  label={tag}
                  variant="outlined"
                  color="secondary"
                  sx={{ fontWeight: 600 }}
                />
              ))}
            </Box>
          )}

          {error && (
            <Typography
              variant="body2"
              sx={{
                mt: 2,
                color: '#b91c1c',
                backgroundColor: 'rgba(254, 226, 226, 0.9)',
                border: '1px solid #fecaca',
                display: 'inline-block',
                px: 2,
                py: 0.8,
                borderRadius: '999px',
                fontWeight: 500,
              }}
            >
              {error}
            </Typography>
          )}
        </Box>

        <Box sx={{ mb: { xs: 2.5, lg: 1.5 }, display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ width: '100%', maxWidth: { xs: 640, lg: 780 } }}>
            <DestinationResultCard 
              destination={featuredResult} 
              featured 
              imageSeed={1} 
              onRefine={onRefine}
            />
          </Box>
        </Box>

        <Box sx={{ width: '100%', maxWidth: { xs: 700, lg: 960 }, mx: 'auto' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gridAutoRows: '1fr',
              gap: { xs: 1.6, lg: 1.25 },
              mb: { xs: 1.6, lg: 1.25 },
            }}
          >
            {firstPair.map((destination, index) => (
              <Box key={`pair-one-${index}`} sx={{ display: 'flex', minWidth: 0, alignItems: 'stretch' }}>
                <DestinationResultCard 
                  destination={destination} 
                  imageSeed={index + 2} 
                  onRefine={onRefine}
                />
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gridAutoRows: '1fr',
              gap: { xs: 1.6, lg: 1.25 },
            }}
          >
            {secondPair.map((destination, index) => (
              <Box key={`pair-two-${index}`} sx={{ display: 'flex', minWidth: 0, alignItems: 'stretch' }}>
                <DestinationResultCard 
                  destination={destination} 
                  imageSeed={index + 4} 
                  onRefine={onRefine}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ResultsSection;