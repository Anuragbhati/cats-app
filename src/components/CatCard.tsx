import React from 'react';
import styled from 'styled-components';
import { CatImage } from '../services/api';

// Styled Components
// In the CardWrapper styled component, add cursor: pointer
const CardWrapper = styled.div`
  position: relative;
  background-color: white;
  border-radius: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  height: 100%;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-0.5rem);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
`;

const ImageContainer = styled.div`
  aspect-ratio: 1/1;
  overflow: hidden;
  position: relative;
  border-radius: 1.5rem;
  margin: 0.75rem;
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 1.25rem;
  transition: transform 0.5s ease;

  ${CardWrapper}:hover & {
    transform: scale(1.05);
  }
`;

const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 50%,
    rgba(0, 0, 0, 0.7) 100%
  );
  border-radius: 1.25rem;
  opacity: 0.8;
  transition: opacity 0.3s ease;
`;

const CardContent = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  z-index: 1;
`;

const CardTitle = styled.h3`
  color: white;
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const CardDescription = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

interface CatCardProps {
  image: CatImage;
}

export const CatCard: React.FC<CatCardProps> = ({ image }) => {
  return (
    <CardWrapper>
      <ImageContainer>
        <CardImage
          src={image.url}
          alt={image.breeds[0]?.name || 'Cat'}
          loading="lazy"
        />
        <ImageOverlay />
      </ImageContainer>
      <CardContent>
        <CardTitle>
          {image.breeds[0]?.name || 'Beautiful Cat'}
        </CardTitle>
        <CardDescription>
          {image.breeds[0]?.description || 'A lovely cat picture'}
        </CardDescription>
      </CardContent>
    </CardWrapper>
  );
};