import React from 'react';
import styled from 'styled-components';
import { Tile23 } from './Tile23';

const TileContainer = styled.div`
  display: flex;
  flex-direction: column;
  cursor: ${props => props.$isDragging ? 'grabbing' : 'grab'};
  opacity: ${props => props.$isDragging ? 0.5 : 1};
  transition: opacity var(--motion-duration-10, 100ms) var(--motion-easing-ease-out, cubic-bezier(0, 0, 0.34, 1));
  
  /* Match the responsive tile width to enable text truncation */
  /* Same calculations as Tile23 component for 2:3 tiles */
  --col-width: calc((100vw - 2 * 20px - 11 * 10px) / 12);
  width: calc(var(--col-width) * 6 + 5 * 10px);
  
  @media (min-width: 440px) {
    --col-width: calc((100vw - 2 * 20px - 11 * 10px) / 12);
    width: calc(var(--col-width) * 4 + 3 * 10px);
  }
  
  @media (min-width: 600px) {
    --col-width: calc((100vw - 2 * 24px - 11 * 8px) / 12);
    width: calc(var(--col-width) * 3 + 2 * 8px);
  }
  
  @media (min-width: 800px) {
    --col-width: calc((100vw - 2 * 36px - 11 * 12px) / 12);
    width: calc(var(--col-width) * 2 + 1 * 12px);
  }
  
  @media (min-width: 1100px) {
    --col-width: calc((100vw - 2 * 48px - 11 * 16px) / 12);
    width: calc(var(--col-width) * 2 + 1 * 16px);
  }
  
  @media (min-width: 1400px) {
    --col-width: calc((100vw - 2 * 60px - 11 * 20px) / 12);
    width: calc(var(--col-width) * 2 + 1 * 20px);
  }
  
  @media (min-width: 1800px) {
    --col-width: calc((100vw - 2 * 60px - 11 * 20px) / 12);
    width: calc(var(--col-width) * 2 + 1 * 20px);
  }
  
  /* Premium slide reveal animation for new tiles emerging from seed tile */
  @keyframes elasticReveal {
    0% {
      opacity: 0;
      transform: translateX(-40px) scale(0.95);
    }
    100% {
      opacity: 1;
      transform: translateX(0) scale(1);
    }
  }
  
  /* Cross-dissolve animation for tile replacement - embodies refresh/swap */
  @keyframes replaceCrossfade {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.3;
      transform: scale(0.97);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  /* Very subtle animation for restored tiles (undo replacement) */
  @keyframes subtleRestore {
    0% {
      opacity: 0.85;
    }
    100% {
      opacity: 1;
    }
  }
  
  ${props => props.$isNew && `
    animation: elasticReveal var(--motion-duration-40, 400ms) var(--motion-easing-ease-in-out, cubic-bezier(0.66, 0, 0.34, 1));
    animation-delay: ${props.$animationDelay || '0ms'};
    animation-fill-mode: both;
  `}
  
  ${props => props.$isReplacement && `
    animation: replaceCrossfade var(--motion-duration-40, 400ms) var(--motion-easing-ease-in-out, cubic-bezier(0.66, 0, 0.34, 1));
    animation-fill-mode: both;
  `}
  
  ${props => props.$isRestored && `
    animation: subtleRestore var(--motion-duration-40, 400ms) var(--motion-easing-ease-out, cubic-bezier(0, 0, 0.34, 1));
    animation-fill-mode: both;
  `}
`;

const TileTitle = styled.h3`
  margin: 0;
  font-family: 'Handset Sans UI', sans-serif;
  font-weight: 700;
  letter-spacing: 0;
  color: rgba(255, 255, 255, 0.5);
  transition: color var(--motion-duration-20, 200ms) var(--motion-easing-ease-out, cubic-bezier(0, 0, 0.34, 1));
  
  /* Text truncation with ellipsis */
  width: 100%;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  ${TileContainer}:hover & {
    color: #FFFFFF;
  }
  
  /* Title (heading.sm) - BP-01, BP-02 (0-599px): Small scale - step 0 = 16px */
  font-size: 16px;
  line-height: 20px;
  
  /* Title (heading.sm) - BP-03, BP-04 (600-1099px): Small scale - step 0 = 16px */
  @media (min-width: 600px) {
    font-size: 16px;
    line-height: 20px;
  }
  
  /* Title (heading.sm) - BP-05, BP-06 (1100-1799px): Medium scale - step 0 = 16px anchor */
  @media (min-width: 1100px) {
    font-size: 16px;
    line-height: 20px;
  }
  
  /* Title (heading.sm) - BP-07 (1800px+): Large scale - proportional increase */
  @media (min-width: 1800px) {
    font-size: 20px;
    line-height: 25px;
  }
`;

const TileSubtitle = styled.p`
  margin: var(--space-vertical-near-xs, 2px) 0 0 0;
  font-family: 'Handset Sans UI', sans-serif;
  font-weight: 400;
  letter-spacing: 0;
  color: rgba(255, 255, 255, 0.5);
  transition: color var(--motion-duration-20, 200ms) var(--motion-easing-ease-out, cubic-bezier(0, 0, 0.34, 1));
  
  /* Text truncation with ellipsis */
  width: 100%;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  ${TileContainer}:hover & {
    color: #FFFFFF;
  }
  
  /* Subtitle (metadata.sm) - BP-01, BP-02 (0-599px): Small scale - step-2 = 10.24px */
  font-size: 10.24px;
  line-height: 12.8px;
  
  /* Subtitle (metadata.sm) - BP-03, BP-04 (600-1099px): Small scale - step-2 = 10.24px */
  @media (min-width: 600px) {
    font-size: 10.24px;
    line-height: 12.8px;
  }
  
  /* Subtitle (metadata.sm) - BP-05, BP-06 (1100-1799px): Medium scale - step-2 = 13.889px -> use 12px anchor */
  @media (min-width: 1100px) {
    font-size: 12px;
    line-height: 15px;
  }
  
  /* Subtitle (metadata.sm) - BP-07 (1800px+): Large scale - proportional increase */
  @media (min-width: 1800px) {
    font-size: 14px;
    line-height: 17.5px;
  }
`;

const MetadataContainer = styled.div`
  margin-top: var(--space-vertical-near-md, 8px);
  width: 100%;
  min-width: 0; /* Allow flex items to shrink below content size */
`;

/**
 * Tile23WithMetadata Component
 * 2:3 tile with title and subtitle metadata below
 * 
 * @param {Object} props
 * @param {string} props.image - Optional image URL for tile background
 * @param {string} props.title - Title text displayed below tile
 * @param {string} props.subtitle - Subtitle text displayed below title
 * @param {boolean} props.selected - Show selected state
 * @param {boolean} props.isNew - Trigger slide-in animation for newly added tiles
 * @param {boolean} props.isReplacement - Trigger cross-dissolve animation for replaced tiles
 * @param {boolean} props.isRestored - Trigger subtle animation for restored tiles (undo)
 * @param {string} props.animationDelay - Delay before animation starts
 * @param {boolean} props.draggable - Enable drag and drop
 * @param {boolean} props.isDragging - Currently being dragged
 * @param {Function} props.onClick - Click handler for tile
 * @param {Function} props.onDismiss - Dismiss/close button handler
 * @param {Function} props.onMoreLikeThis - More Like This action handler
 * @param {Function} props.onSomethingElse - Something Else action handler
 * @param {Function} props.onDragStart - Drag start handler
 * @param {Function} props.onDragEnd - Drag end handler
 * @param {Function} props.onDragOver - Drag over handler
 * @param {Function} props.onDrop - Drop handler
 */
export function Tile23WithMetadata({
  image,
  title,
  subtitle,
  selected = false,
  isNew = false,
  isReplacement = false,
  isRestored = false,
  animationDelay = '0ms',
  draggable = false,
  isDragging = false,
  onClick,
  onDismiss,
  onMoreLikeThis,
  onSomethingElse,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  ...props
}) {
  return (
    <TileContainer 
      $isNew={isNew}
      $isReplacement={isReplacement}
      $isRestored={isRestored}
      $animationDelay={animationDelay}
      $isDragging={isDragging}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      {...props}
    >
      <Tile23
        image={image}
        selected={selected}
        isReplacement={isReplacement}
        isDragging={isDragging}
        onClick={onClick}
        onDismiss={onDismiss}
        onMoreLikeThis={onMoreLikeThis}
        onSomethingElse={onSomethingElse}
      />
      <MetadataContainer>
        {title && <TileTitle>{title}</TileTitle>}
        {subtitle && <TileSubtitle>{subtitle}</TileSubtitle>}
      </MetadataContainer>
    </TileContainer>
  );
}

export default Tile23WithMetadata;

