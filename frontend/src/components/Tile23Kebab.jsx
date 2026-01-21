import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

/**
 * Tile23Kebab Component - HBO Max Design System Implementation
 * Standard size with 2:3 aspect ratio (portrait)
 * Features kebab menu (three dots) with context dropdown instead of X dismiss button
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
  
  /* Cap tile size on large screens to prevent oversized tiles */
  max-width: 264px;
  
  /* Square corners per design system - tiles have 0px border radius */
  border-radius: var(--border-corner-component-tile-standard, 0);
  
  /* No border by default */
  border: none;
  outline: none;
  
  /* Hover state - rounded corners and dual focus ring */
  &:hover,
  &.hover-state {
    border-radius: var(--border-corner-general-sm, 2px);
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
  border-radius: inherit;
`;

const TileImage = styled.div`
  width: 100%;
  height: 100%;
  background-image: ${props => {
    if (props.image) return `url(${props.image})`;
    if (props.$isReplacement) return 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)';
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
  transition: background var(--motion-duration-20, 200ms) var(--motion-easing-ease-out, cubic-bezier(0, 0, 0.34, 1));
  pointer-events: none;
  
  ${StyledTile}:hover &,
  ${StyledTile}.hover-state &,
  ${StyledTile}:active & {
    background: rgba(0, 0, 0, 0.4);
  }
`;

const BottomProtectionGradient = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.5) 100%
  );
  pointer-events: none;
  z-index: 2;
  opacity: 0;
  transition: opacity var(--motion-duration-10, 100ms) var(--motion-easing-ease-out, cubic-bezier(0, 0, 0.34, 1));
  
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
  
  ${StyledTile}:hover &,
  ${StyledTile}.hover-state &,
  ${StyledTile}:active & {
    opacity: 1;
  }
`;

const KebabButton = styled.button`
  position: absolute;
  top: 8px;
  right: 6px;
  width: 24px;
  height: 24px;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  z-index: 5;
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

/* Context Menu - Design System Compliant */
const ContextMenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
`;

const ContextMenu = styled.div`
  position: absolute;
  top: 44px;
  right: 8px;
  /* Fixed width - constant across all breakpoints, wide enough for longest text */
  width: 240px;
  background: var(--color-surface-high, #262626);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5), 0 4px 8px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  overflow: hidden;
  padding: 8px 0;
  animation: contextMenuFadeIn 150ms var(--motion-easing-ease-out, cubic-bezier(0, 0, 0.34, 1));
  
  @keyframes contextMenuFadeIn {
    from {
      opacity: 0;
      transform: translateY(-8px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const ContextMenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  /* Fixed padding - constant across all breakpoints */
  padding: 14px 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: 'Handset Sans UI', sans-serif;
  font-weight: 400;
  /* Fixed font size - constant across all breakpoints */
  font-size: 16px;
  line-height: 22px;
  letter-spacing: 0;
  color: var(--color-general-text-high, #FFFFFF);
  text-align: left;
  white-space: nowrap;
  transition: background var(--motion-duration-10, 100ms) var(--motion-easing-ease-out, cubic-bezier(0, 0, 0.34, 1));
  
  &:hover {
    background: var(--color-action-neutral-fill-high, rgba(255, 255, 255, 0.12));
  }
  
  &:active {
    background: var(--color-action-neutral-fill-low, rgba(255, 255, 255, 0.06));
  }
  
  img {
    /* Fixed icon size - constant across all breakpoints */
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    opacity: 0.9;
  }
`;

/**
 * Tile23Kebab Component - 2:3 Portrait Tile with Kebab Menu
 * 
 * @param {Object} props
 * @param {string} props.image - Optional image URL for tile background
 * @param {boolean} props.selected - Show selected state
 * @param {boolean} props.isReplacement - Show replacement gradient color
 * @param {Function} props.onClick - Click handler
 * @param {Function} props.onRemove - Remove action handler (same as dismiss)
 * @param {Function} props.onMoreInfo - More Info action handler
 * @param {Function} props.onMoreLikeThis - More Like This action handler
 * @param {Function} props.onSomethingElse - Something Else action handler
 */
export function Tile23Kebab({ 
  image,
  selected = false,
  isReplacement = false,
  onClick,
  onRemove,
  onMoreInfo,
  onMoreLikeThis,
  onSomethingElse,
  ...props 
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleKebabClick = (e) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    onRemove && onRemove(e);
  };

  const handleMoreInfo = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    onMoreInfo && onMoreInfo(e);
  };

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
        
        <KebabButton 
          onClick={handleKebabClick}
          aria-label="More options"
          aria-expanded={menuOpen}
        >
          <img src="/icons/more-options/regular.svg" alt="More options" />
        </KebabButton>
        
        {menuOpen && (
          <>
            <ContextMenuOverlay onClick={() => setMenuOpen(false)} />
            <ContextMenu ref={menuRef}>
              <ContextMenuItem onClick={handleRemove}>
                <img src="/icons/dismiss/regular.svg" alt="" />
                <span>Remove from Your List</span>
              </ContextMenuItem>
              <ContextMenuItem onClick={handleMoreInfo}>
                <img src="/icons/info/regular.svg" alt="" />
                <span>More Info</span>
              </ContextMenuItem>
            </ContextMenu>
          </>
        )}
        
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

export default Tile23Kebab;

