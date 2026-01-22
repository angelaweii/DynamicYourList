import React from 'react';
import styled from 'styled-components';

/**
 * Rail Component - HBO Max Design System Implementation
 * Horizontal scrolling list of tiles with section heading
 */
const RailContainer = styled.div`
  width: 100%;
  margin-bottom: var(--space-vertical-far-lg, 24px);
  
  /* Add top spacing for first rail */
  &:first-child {
    /* BP-01 (0-439px): margin 20px */
    padding-top: 20px;
    
    /* BP-02 (440-599px): margin 20px */
    @media (min-width: 440px) {
      padding-top: 20px;
    }
    
    /* BP-03 (600-799px): margin 24px */
    @media (min-width: 600px) {
      padding-top: 24px;
    }
    
    /* BP-04 (800-1099px): margin 36px */
    @media (min-width: 800px) {
      padding-top: 36px;
    }
    
    /* BP-05 (1100-1399px): margin 48px */
    @media (min-width: 1100px) {
      padding-top: 48px;
    }
    
    /* BP-06 (1400-1799px): margin 60px */
    @media (min-width: 1400px) {
      padding-top: 60px;
    }
    
    /* BP-07 (1800px+): margin 60px */
    @media (min-width: 1800px) {
      padding-top: 60px;
    }
  }
`;

const RailTitle = styled.h2`
  margin: 0 0 var(--space-vertical-near-md, 8px) 0;
  font-family: 'Handset Sans UI', sans-serif;
  font-weight: 700;
  letter-spacing: 0;
  color: #FFFFFF;
  
  /* Rail title (heading.xs) - capped at 16px max */
  /* BP-01, BP-02 (0-599px): 12.8px / 16px */
  font-size: 12.8px;
  line-height: 16px;
  
  /* BP-03+ (600px+): max 16px / 20px */
  @media (min-width: 600px) {
    font-size: 16px;
    line-height: 20px;
  }
  
  /* Responsive margins matching page margins per breakpoint */
  /* BP-01 (0-439px): margin 20px */
  margin-left: 20px;
  margin-right: 20px;
  
  /* BP-02 (440-599px): margin 20px */
  @media (min-width: 440px) {
    margin-left: 20px;
    margin-right: 20px;
  }
  
  /* BP-03 (600-799px): margin 24px */
  @media (min-width: 600px) {
    margin-left: 24px;
    margin-right: 24px;
  }
  
  /* BP-04 (800-1099px): margin 36px */
  @media (min-width: 800px) {
    margin-left: 36px;
    margin-right: 36px;
  }
  
  /* BP-05 (1100-1399px): margin 48px */
  @media (min-width: 1100px) {
    margin-left: 48px;
    margin-right: 48px;
  }
  
  /* BP-06 (1400-1799px): margin 60px */
  @media (min-width: 1400px) {
    margin-left: 60px;
    margin-right: 60px;
  }
  
  /* BP-07 (1800px+): margin 60px */
  @media (min-width: 1800px) {
    margin-left: 60px;
    margin-right: 60px;
  }
`;

const RailScrollContainer = styled.div`
  display: flex;
  overflow-x: auto;
  overflow-y: visible;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
  
  /* Add padding to prevent focus ring clipping (4.5px outer ring + some buffer) */
  padding-top: 6px;
  padding-bottom: 6px;
  
  /* Responsive padding matching page margins per breakpoint */
  /* Note: gap removed - using margins on tiles for smooth shift animation */
  /* BP-01 (0-439px): margin 20px */
  padding-left: 20px;
  padding-right: 20px;
  
  /* BP-02 (440-599px): margin 20px */
  @media (min-width: 440px) {
    padding-left: 20px;
    padding-right: 20px;
  }
  
  /* BP-03 (600-799px): margin 24px */
  @media (min-width: 600px) {
    padding-left: 24px;
    padding-right: 24px;
  }
  
  /* BP-04 (800-1099px): margin 36px */
  @media (min-width: 800px) {
    padding-left: 36px;
    padding-right: 36px;
  }
  
  /* BP-05 (1100-1399px): margin 48px */
  @media (min-width: 1100px) {
    padding-left: 48px;
    padding-right: 48px;
  }
  
  /* BP-06 (1400-1799px): margin 60px */
  @media (min-width: 1400px) {
    padding-left: 60px;
    padding-right: 60px;
  }
  
  /* BP-07 (1800px+): margin 60px */
  @media (min-width: 1800px) {
    padding-left: 60px;
    padding-right: 60px;
  }
`;

const TileWrapper = styled.div`
  flex-shrink: 0;
  /* Smooth slide animation - dramatic slow-down at end */
  transition: transform 350ms cubic-bezier(0.16, 1, 0.3, 1);
  
  /* Responsive gutter spacing (for banner positioning) */
  /* BP-01 (0-439px): gutter 10px */
  margin-right: 10px;
  
  /* BP-02 (440-599px): gutter 10px */
  @media (min-width: 440px) {
    margin-right: 10px;
  }
  
  /* BP-03 (600-799px): gutter 8px */
  @media (min-width: 600px) {
    margin-right: 8px;
  }
  
  /* BP-04 (800-1099px): gutter 12px */
  @media (min-width: 800px) {
    margin-right: 12px;
  }
  
  /* BP-05 (1100-1399px): gutter 16px */
  @media (min-width: 1100px) {
    margin-right: 16px;
  }
  
  /* BP-06 (1400-1799px): gutter 20px */
  @media (min-width: 1400px) {
    margin-right: 20px;
  }
  
  /* BP-07 (1800px+): gutter 20px */
  @media (min-width: 1800px) {
    margin-right: 20px;
  }
`;

/**
 * Rail Component
 * 
 * @param {Object} props
 * @param {string} props.title - Rail section title
 * @param {React.ReactNode} props.children - Tile components to display
 */
export function Rail({ title, children, ...props }) {
  return (
    <RailContainer {...props}>
      <RailTitle>{title}</RailTitle>
      <RailScrollContainer>
        {React.Children.map(children, (child, index) => (
          <TileWrapper key={index}>
            {child}
          </TileWrapper>
        ))}
      </RailScrollContainer>
    </RailContainer>
  );
}

export default Rail;

