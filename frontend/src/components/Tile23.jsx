import React from 'react';
import styled from 'styled-components';

/**
 * Tile23 Component - HBO Max Design System Implementation
 * Standard size with 2:3 aspect ratio (portrait)
 * Uses exact design tokens for styling and animation
 */
const StyledTile = styled.div`
  position: relative;
  cursor: pointer;
  
  /* Responsive tile sizing based on 12-column grid system per design system */
  /* 2x3 STANDARD tile (2:3 portrait) - column-based width calculation */
  /* Formula: ((viewport - 2*margin - 11*gutter) / 12) * columns + (columns - 1) * gutter */
  
  /* BP-01 (0-439px): 6 columns (2 tiles per row), margin: 20px, gutter: 10px */
  --col-width: calc((100vw - 2 * 20px - 11 * 10px) / 12);
  width: calc(var(--col-width) * 6 + 5 * 10px);
  
  /* BP-02 (440-599px): 4 columns (3 tiles per row), margin: 20px, gutter: 10px */
  @media (min-width: 440px) {
    --col-width: calc((100vw - 2 * 20px - 11 * 10px) / 12);
    width: calc(var(--col-width) * 4 + 3 * 10px);
  }
  
  /* BP-03 (600-799px): 3 columns (4 tiles per row), margin: 24px, gutter: 8px */
  @media (min-width: 600px) {
    --col-width: calc((100vw - 2 * 24px - 11 * 8px) / 12);
    width: calc(var(--col-width) * 3 + 2 * 8px);
  }
  
  /* BP-04 (800-1099px): 2 columns (6 tiles per row), margin: 36px, gutter: 12px */
  @media (min-width: 800px) {
    --col-width: calc((100vw - 2 * 36px - 11 * 12px) / 12);
    width: calc(var(--col-width) * 2 + 1 * 12px);
  }
  
  /* BP-05 (1100-1399px): 2 columns (6 tiles per row), margin: 48px, gutter: 16px */
  @media (min-width: 1100px) {
    --col-width: calc((100vw - 2 * 48px - 11 * 16px) / 12);
    width: calc(var(--col-width) * 2 + 1 * 16px);
  }
  
  /* BP-06 (1400-1799px): 2 columns (6 tiles per row), margin: 60px, gutter: 20px */
  @media (min-width: 1400px) {
    --col-width: calc((100vw - 2 * 60px - 11 * 20px) / 12);
    width: calc(var(--col-width) * 2 + 1 * 20px);
  }
  
  /* BP-07 (1800px+): 2 columns (6 tiles per row), margin: 60px, gutter: 20px */
  @media (min-width: 1800px) {
    --col-width: calc((100vw - 2 * 60px - 11 * 20px) / 12);
    width: calc(var(--col-width) * 2 + 1 * 20px);
  }
  
  /* Square corners per design system - tiles have 0px border radius */
  border-radius: var(--border-corner-component-tile-standard, 0);
  
  /* No border by default */
  border: none;
  outline: none;
  
  /* No transition on outline - white border appears immediately on hover */
  
  /* Hover state - rounded corners and dual focus ring */
  &:hover,
  &.hover-state {
    /* Slightly rounded corners per design system */
    border-radius: var(--border-corner-general-sm, 2px);
    
    /* Dual focus ring per design system:
       - Inner ring: 2px black (extends to 2px from edge)
       - Outer ring: white (extends to 4.5px from edge, so 2.5px wide)
       Total outer extent: 4.5px
    */
    box-shadow: 
      0 0 0 2px rgb(0, 0, 0),
      0 0 0 4.5px rgb(255, 255, 255);
  }
  
  /* Active/press state */
  &:active {
    border-radius: var(--border-corner-general-sm, 2px);
    
    box-shadow: 
      0 0 0 2px rgb(0, 0, 0),
      0 0 0 4.5px rgb(255, 255, 255);
  }
  
  /* Focus state - keyboard navigation */
  &:focus {
    border-radius: var(--border-corner-general-sm, 2px);
    outline: none;
    
    box-shadow: 
      0 0 0 2px rgb(0, 0, 0),
      0 0 0 4.5px rgb(255, 255, 255);
  }
  
  /* Selected state */
  ${props => props.selected && `
    border-radius: var(--border-corner-general-sm, 2px);
    
    box-shadow: 
      0 0 0 2px rgb(0, 0, 0),
      0 0 0 4.5px rgb(255, 255, 255);
  `}
`;

const TileImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 2 / 3; /* 2:3 aspect ratio for portrait tile */
  overflow: hidden;
  border-radius: inherit; /* Inherit border radius from parent tile */
`;

const TileImage = styled.div`
  width: 100%;
  height: 100%;
  background-image: ${props => {
    if (props.image) return `url(${props.image})`;
    // Different gradient for replacement tiles
    if (props.$isReplacement) return 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
    // Default gradient
    return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  }};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  z-index: 0;
`;

const TileOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: 1;
  /* Motion: duration 20 (200ms), easing ease-out */
  transition: background var(--motion-duration-20, 200ms) var(--motion-easing-ease-out, cubic-bezier(0, 0, 0.34, 1));
  pointer-events: none;
  
  /* Show scrim_low overlay on hover */
  ${StyledTile}:hover &,
  ${StyledTile}.hover-state &,
  ${StyledTile}:active & {
    background: rgba(0, 0, 0, 0.4); /* scrim_low from design system */
  }
`;

const BottomProtectionGradient = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  /* Design system tile.action protection gradient: linear gradient from bottom to top */
  /* From base.50 (50% black) at bottom to base.0 (transparent) at 50% height */
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.5) 100%
  );
  pointer-events: none;
  z-index: 2;
  opacity: 0;
  transition: opacity var(--motion-duration-10, 100ms) var(--motion-easing-ease-out, cubic-bezier(0, 0, 0.34, 1));
  
  /* Show gradient on hover to provide contrast for bottom actions */
  ${StyledTile}:hover &,
  ${StyledTile}.hover-state &,
  ${StyledTile}:active & {
    opacity: 1;
  }
`;

const HoverActionsContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 4;
  padding: var(--space-vertical-near-md, 8px) var(--space-horizontal-near-md, 8px);
  display: flex;
  flex-direction: column;
  gap: var(--space-vertical-near-xs, 2px);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--motion-duration-20, 200ms) var(--motion-easing-ease-out, cubic-bezier(0, 0, 0.34, 1));
  
  ${StyledTile}:hover &,
  ${StyledTile}.hover-state & {
    opacity: 1;
    pointer-events: auto;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  padding: 4px 0;
  cursor: pointer;
  font-family: 'Handset Sans UI', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 19px;
  letter-spacing: 0;
  color: #FFFFFF;
  text-align: left;
  transition: opacity var(--motion-duration-10, 100ms) var(--motion-easing-ease-out, cubic-bezier(0, 0, 0.34, 1));
  
  &:hover {
    opacity: 0.7;
  }
  
  img {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  }
`;

const KebabMenuGradient = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 80px;
  height: 80px;
  background: linear-gradient(
    225deg,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(0, 0, 0, 0.3) 12%,
    rgba(0, 0, 0, 0.2) 24%,
    rgba(0, 0, 0, 0) 50%
  );
  pointer-events: none;
  z-index: 2;
  opacity: 0;
  transition: opacity var(--motion-duration-10, 100ms) var(--motion-easing-ease-out, cubic-bezier(0, 0, 0.34, 1));
  
  /* Show gradient on hover along with the x icon */
  ${StyledTile}:hover &,
  ${StyledTile}.hover-state &,
  ${StyledTile}:active & {
    opacity: 1;
  }
`;

const DismissButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--motion-duration-10, 100ms) var(--motion-easing-ease-out, cubic-bezier(0, 0, 0.34, 1));
  
  ${StyledTile}:hover &,
  ${StyledTile}.hover-state & {
    opacity: 1;
    pointer-events: auto;
  }
  
  ${StyledTile}:hover &:hover,
  ${StyledTile}.hover-state &:hover {
    opacity: 0.7;
  }
  
  img {
    width: 100%;
    height: 100%;
  }
`;

/**
 * Tile23 Component - 2:3 Portrait Tile
 * 
 * @param {Object} props
 * @param {string} props.image - Optional image URL for tile background
 * @param {boolean} props.selected - Show selected state
 * @param {boolean} props.isReplacement - Show replacement gradient color
 * @param {Function} props.onClick - Click handler
 * @param {Function} props.onDismiss - Dismiss/close button handler
 * @param {Function} props.onMoreLikeThis - More Like This action handler
 * @param {Function} props.onSomethingElse - Something Else action handler
 */
export function Tile23({ 
  image,
  selected = false,
  isReplacement = false,
  onClick,
  onDismiss,
  onMoreLikeThis,
  onSomethingElse,
  ...props 
}) {
  return (
    <StyledTile 
      selected={selected}
      onClick={onClick}
      {...props}
    >
      <TileImageContainer>
        <TileImage image={image} $isReplacement={isReplacement} />
        <TileOverlay className="tile-overlay" />
        <KebabMenuGradient />
        <BottomProtectionGradient />
        <DismissButton onClick={(e) => {
          e.stopPropagation();
          onDismiss && onDismiss(e);
        }}>
          <img src="/icons/dismiss/regular.svg" alt="Dismiss" />
        </DismissButton>
        
        <HoverActionsContainer>
          <ActionButton onClick={(e) => {
            e.stopPropagation();
            onMoreLikeThis && onMoreLikeThis(e);
          }}>
            <img src="/icons/rate/like/regular.svg" alt="Like" />
            <span>More Like This</span>
          </ActionButton>
          
          <ActionButton onClick={(e) => {
            e.stopPropagation();
            onSomethingElse && onSomethingElse(e);
          }}>
            <img src="/icons/restart/regular.svg" alt="Restart" />
            <span>Something Else</span>
          </ActionButton>
        </HoverActionsContainer>
      </TileImageContainer>
    </StyledTile>
  );
}

export default Tile23;

