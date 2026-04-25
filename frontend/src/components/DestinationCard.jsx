import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  useTheme,
} from '@mui/material';
import { LocationOn, FavoriteBorder, Favorite } from '@mui/icons-material';

const DestinationCard = ({ destination, onLike, variant = 'default' }) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const isFeatured = variant === 'featured';

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    if (onLike) {
      onLike(destination);
    }
  };

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        maxWidth: '100%',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', sm: isFeatured ? 'row' : 'column' },
        ...(isFeatured && {
          minHeight: { xs: 'auto', sm: '400px', md: '460px' },
        }),
        borderRadius: '24px',
        overflow: 'hidden',
        border: '1px solid rgba(226, 232, 240, 0.5)',
        boxShadow: isHovered
          ? '0 20px 40px rgba(37, 99, 235, 0.15)'
          : '0 4px 12px rgba(15, 23, 42, 0.06)',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        cursor: 'pointer',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Image Container */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          width: isFeatured ? { xs: '100%', sm: '50%' } : '100%',
          aspectRatio: isFeatured ? { xs: '16/9', sm: '4/3' } : '16/9',
          flexShrink: 0,
          backgroundColor: '#e2e8f0',
          ...(isFeatured && {
            minHeight: { sm: '400px', md: '460px' },
            aspectRatio: { sm: 'auto' },
          }),
        }}
      >
        <CardMedia
          component="img"
          image={destination.image}
          alt={destination.name}
          onLoad={() => setImageLoaded(true)}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease-out, opacity 0.3s ease-in',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            opacity: imageLoaded ? 1 : 0,
          }}
        />

        {/* Overlay on hover */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: isHovered
              ? 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(15,23,42,0.3) 100%)'
              : 'linear-gradient(180deg, rgba(0,0,0,0) 0%, transparent 100%)',
            transition: 'all 0.3s ease',
          }}
        />

        {/* Like Button */}
        <Box
          onClick={handleLikeClick}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            width: 32,
            height: 32,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            transform: isLiked ? 'scale(1.1)' : 'scale(1)',
            '&:hover': {
              backgroundColor: '#ffffff',
              transform: 'scale(1.1)',
            },
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            zIndex: 2,
          }}
        >
          {isLiked ? (
            <Favorite sx={{ fontSize: '18px', color: '#ef4444' }} />
          ) : (
            <FavoriteBorder sx={{ fontSize: '18px', color: '#cbd5e1' }} />
          )}
        </Box>

        {/* Featured Badge */}
        {isFeatured && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              backgroundColor: 'rgba(37, 99, 235, 0.9)',
              backdropFilter: 'blur(4px)',
              color: 'white',
              padding: '6px 16px',
              borderRadius: '24px',
              fontSize: '0.8rem',
              fontWeight: 600,
              letterSpacing: '0.5px',
              zIndex: 2,
            }}
          >
            BEST MATCH
          </Box>
        )}
      </Box>

      {/* Content - WITH PROFESSIONAL TEXT WRAPPING */}
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          p: isFeatured ? { xs: 2.5, sm: 4 } : 2,
          width: isFeatured ? { xs: '100%', sm: '50%' } : '100%',
          minWidth: 0,
          // Professional text wrapping
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
        }}
      >
        {/* Title with Location */}
        <Box sx={{ mb: 1.5 }}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              color: '#0f172a',
              fontSize: isFeatured ? { xs: '1.4rem', sm: '1.8rem' } : '1rem',
              lineHeight: 1.3,
              mb: 1,
              // Professional text wrapping for long titles
              wordBreak: 'break-word',
              whiteSpace: 'normal',
              overflowWrap: 'break-word',
              hyphens: 'auto',
            }}
          >
            {destination.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <LocationOn sx={{ fontSize: isFeatured ? '20px' : '16px', color: '#2563eb', flexShrink: 0 }} />
            <Typography
              variant="body2"
              sx={{
                color: '#64748b',
                fontSize: isFeatured ? '1rem' : '0.8rem',
                wordBreak: 'break-word',
                whiteSpace: 'normal',
              }}
            >
              {destination.country}
            </Typography>
          </Box>
        </Box>

        {/* Description - Professional text wrapping with ellipsis */}
        <Typography
          variant="body2"
          sx={{
            color: '#475569',
            mb: 2.5,
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: isFeatured ? 3 : 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontSize: isFeatured ? '0.95rem' : '0.8rem',
            // Professional text wrapping
            wordBreak: 'break-word',
            whiteSpace: 'normal',
            overflowWrap: 'break-word',
          }}
        >
          {destination.description}
        </Typography>

        {/* Tags - Responsive wrapping */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,
            mt: 'auto',
          }}
        >
          {(isFeatured ? destination.tags.slice(0, 4) : destination.tags.slice(0, 3)).map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size={isFeatured ? "medium" : "small"}
              sx={{
                backgroundColor: '#f1f5f9',
                color: '#2563eb',
                fontWeight: 500,
                fontSize: isFeatured ? '0.8rem' : '0.7rem',
                height: isFeatured ? '32px' : '24px',
                borderRadius: isFeatured ? '16px' : '12px',
                // Professional chip text handling
                maxWidth: '100%',
                '& .MuiChip-label': {
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  px: 1.5,
                },
                '&:hover': {
                  backgroundColor: '#e0e7ff',
                },
              }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DestinationCard;