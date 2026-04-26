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

const slugCity = (name) =>
  (name || 'destination')
    .toLowerCase()
    .trim()
    .replace(/[-\s]+/g, '_')
    .replace(/[^a-z0-9_]/g, '');

const resolveCitySlug = (name) => {
  const slug = slugCity(name);
  if (slug === 'bordeaux') return 'boardeaux';
  return slug;
};

const buildLocalImageCandidates = (name) => {
  const slug = resolveCitySlug(name);
  const exts = ['jpeg', 'jpg', 'png', 'webp'];
  const candidates = [];
  for (const ext of exts) {
    candidates.push(`http://localhost:8000/api/images/${slug}.${ext}`);
    candidates.push(`http://localhost:8000/images/${slug}.${ext}`);
  }
  return candidates;
};

const buildImageUrl = (name, seed = 1) => {
  const safeName = encodeURIComponent(name || 'travel');
  return `https://source.unsplash.com/1200x700/?${safeName},travel&sig=${seed}`;
};

const buildFallbackImageUrl = (name, seed = 1) => {
  const safeName = encodeURIComponent(name || 'destination');
  return `https://picsum.photos/seed/${safeName}-${seed}/1200/700`;
};

const ResultImage = ({ primarySrc, fallbackSources, alt, sx }) => {
  const [currentSrc, setCurrentSrc] = React.useState(primarySrc);
  const [fallbackIndex, setFallbackIndex] = React.useState(0);

  React.useEffect(() => {
    setCurrentSrc(primarySrc);
    setFallbackIndex(0);
  }, [primarySrc]);

  return (
    <CardMedia
      component="img"
      image={currentSrc}
      alt={alt}
      onError={() => {
        if (fallbackIndex < fallbackSources.length) {
          setCurrentSrc(fallbackSources[fallbackIndex]);
          setFallbackIndex((prev) => prev + 1);
        }
      }}
      sx={sx}
    />
  );
};

const DestinationResultCard = ({ destination, featured = false, onRefine, onExplore, imageSeed = 1 }) => {
  // const name = destination?.name || destination?.title || 'Dream destination';
  const name = destination?.city || 'Dream destination';
  // const description = destination?.description || 'A place where your dreams meet reality.';
  const description = destination?.key_features?.join(', ') || 'Great destination';
  const localCandidates = buildLocalImageCandidates(name);
  const imageUrl =
    destination?.image && destination.image.includes('localhost:8000')
      ? destination.image
      : localCandidates[0];
  const fallbackSources = [
    ...localCandidates.slice(1),
    buildImageUrl(name, imageSeed),
    buildFallbackImageUrl(name, imageSeed),
  ];
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
          minHeight: featured
            ? { xs: 150, sm: 165, md: 180 }
            : { xs: 130, sm: 150, md: 160 },
          flexShrink: 0,
          position: 'relative',
        }}
      >
        <ResultImage
          primarySrc={imageUrl}
          fallbackSources={fallbackSources}
          alt={name}
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
        <Box sx={{ display: 'flex', flexDirection: 'column', mb: 1.2 }}>
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
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            {destination?.country}
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

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
          {destination?.key_features?.map((tag, i) => (
            <Chip
              key={i}
              label={tag}
              size="small"
              sx={{ backgroundColor: '#f1f5f9' }}
            />
          ))}
        </Box>

        <Button
          variant="contained"
          onClick={() => (onExplore ? onExplore(destination) : onRefine(name))}
          sx={{ alignSelf: 'flex-start', minHeight: 36, px: 2.2, py: 0.8, fontSize: '0.86rem' }}
        >
          Explore →
        </Button>
      </CardContent>
    </Card>
  );
};

const ResultsSection = ({ query, results, interpretedTags, error, onReset, onExplore }) => {
  if (!results || results.length === 0) {
    return null;
  }

  const featuredResult = results[0];
  const firstPair = results.slice(1, 3);
  const secondPair = results.slice(3, 5);

  return (
    <Box sx={{ py: { xs: 5, md: 6 }, backgroundColor: '#faf9f6' }}>
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
            sx={{ borderRadius: '999px', px: 2.4, py: 0.6 }}
          >
            Start Over
          </Button>
        </Box>

        <Box sx={{ textAlign: 'center', mb: { xs: 3, md: 4 } }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1.5 }}>
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
            <DestinationResultCard destination={featuredResult} featured onExplore={onExplore} imageSeed={1} />
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
            {firstPair.map((destination, index) => (
              <Box key={`pair-one-${index}`} sx={{ display: 'flex', minWidth: 0 }}>
                <DestinationResultCard destination={destination} onExplore={onExplore} imageSeed={index + 2} />
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
            {secondPair.map((destination, index) => (
              <Box key={`pair-two-${index}`} sx={{ display: 'flex', minWidth: 0 }}>
                <DestinationResultCard destination={destination} onExplore={onExplore} imageSeed={index + 4} />
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ResultsSection;
