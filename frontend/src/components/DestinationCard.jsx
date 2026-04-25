import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import { LocationOn, FavoriteBorder, Favorite } from '@mui/icons-material';

const DestinationCard = ({ destination, onLike, variant = 'default' }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const isFeatured = variant === 'featured';

  const handleLikeClick = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    if (onLike) onLike(destination);
  };

  const handleCardClick = () => {
    // Navigate to detail page with destination data
    navigate('/destination', { state: { destination } });
  };

  // ========== FEATURED CARD ==========
  if (isFeatured) {
    return (
      <Card
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          minHeight: { xs: 'auto', sm: '200px', md: '220px' },
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(59, 130, 246, 0.2)',
          boxShadow: isHovered 
            ? '0 12px 24px rgba(59, 130, 246, 0.15)' 
            : '0 2px 8px rgba(0, 0, 0, 0.04)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          backgroundColor: '#ffffff',
          '&:hover': { transform: 'translateY(-3px)' },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: { xs: '100%', sm: '35%' },
            minHeight: { xs: '160px', sm: '200px', md: '220px' },
            backgroundColor: '#f1f5f9',
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
              transition: 'transform 0.3s ease',
              transform: isHovered ? 'scale(1.02)' : 'scale(1)',
              opacity: imageLoaded ? 1 : 0,
            }}
          />
          
          <Box
            onClick={handleLikeClick}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              width: 30,
              height: 30,
              borderRadius: '50%',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
              '&:hover': { transform: 'scale(1.1)' },
              zIndex: 2,
            }}
          >
            {isLiked ? (
              <Favorite sx={{ fontSize: '14px', color: '#ef4444' }} />
            ) : (
              <FavoriteBorder sx={{ fontSize: '14px', color: '#64748b' }} />
            )}
          </Box>

          <Box
            sx={{
              position: 'absolute',
              bottom: 10,
              left: 10,
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
              padding: '3px 10px',
              borderRadius: '16px',
              fontSize: '0.65rem',
              fontWeight: 600,
              zIndex: 2,
            }}
          >
            TOP PICK
          </Box>
        </Box>

        <CardContent sx={{ flex: 1, p: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1rem', mb: 0.5, color: '#0f172a' }}>
            {destination.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <LocationOn sx={{ fontSize: '12px', color: '#3b82f6' }} />
            <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>
              {destination.country}
            </Typography>
          </Box>
          
          {destination.description && (
            <Typography sx={{ fontSize: '0.7rem', color: '#475569', lineHeight: 1.4, mb: 1 }}>
              {destination.description.length > 80 
                ? `${destination.description.slice(0, 80)}...` 
                : destination.description}
            </Typography>
          )}
          
          {destination.tags && destination.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {destination.tags.slice(0, 3).map((tag, idx) => (
                <Chip 
                  key={idx} 
                  label={tag} 
                  size="small" 
                  sx={{ 
                    fontSize: '0.6rem', 
                    height: '22px',
                    backgroundColor: '#eef2ff',
                    color: '#3b82f6',
                  }} 
                />
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    );
  }

  // ========== DEFAULT CARD - LARGER & MORE READABLE ==========
  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      sx={{
        width: '100%',
        borderRadius: '14px',
        overflow: 'hidden',
        border: '1px solid rgba(226, 232, 240, 0.5)',
        boxShadow: isHovered ? '0 6px 14px rgba(0, 0, 0, 0.08)' : '0 1px 3px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.25s ease',
        cursor: 'pointer',
        backgroundColor: '#ffffff',
        '&:hover': {
          transform: 'translateY(-3px)',
          borderColor: '#3b82f6',
          boxShadow: '0 8px 18px rgba(59, 130, 246, 0.12)',
        },
      }}
    >
      {/* Image - Square */}
      <Box sx={{ position: 'relative', aspectRatio: '1/1', backgroundColor: '#f8fafc' }}>
        <CardMedia
          component="img"
          image={destination.image}
          alt={destination.name}
          onLoad={() => setImageLoaded(true)}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            transform: isHovered ? 'scale(1.03)' : 'scale(1)',
            opacity: imageLoaded ? 1 : 0,
          }}
        />
        
        {/* Like Button */}
        <Box
          onClick={handleLikeClick}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 28,
            height: 28,
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            '&:hover': { transform: 'scale(1.1)' },
            zIndex: 2,
          }}
        >
          {isLiked ? (
            <Favorite sx={{ fontSize: '12px', color: '#ef4444' }} />
          ) : (
            <FavoriteBorder sx={{ fontSize: '12px', color: '#64748b' }} />
          )}
        </Box>
      </Box>

      {/* Content - Larger */}
      <CardContent sx={{ p: 1.2 }}>
        <Typography 
          sx={{ 
            fontWeight: 600, 
            fontSize: '0.85rem', 
            mb: 0.5,
            color: '#0f172a',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {destination.name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.75 }}>
          <LocationOn sx={{ fontSize: '10px', color: '#94a3b8' }} />
          <Typography sx={{ fontSize: '0.65rem', color: '#94a3b8' }}>
            {destination.country}
          </Typography>
        </Box>

        {/* Tags - Larger */}
        {destination.tags && destination.tags.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {destination.tags.slice(0, 2).map((tag, idx) => (
              <Chip 
                key={idx} 
                label={tag} 
                size="small" 
                sx={{ 
                  fontSize: '0.6rem', 
                  height: '22px',
                  backgroundColor: '#f1f5f9',
                  color: '#64748b',
                  '& .MuiChip-label': { px: 0.8 },
                }} 
              />
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default DestinationCard;