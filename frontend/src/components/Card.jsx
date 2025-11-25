import React from 'react';
import styled from 'styled-components';

/**
 * Styled Card Component using Slate Design System tokens
 */
const StyledCard = styled.div`
  background: var(--color-surface-mid, #1a1a1a);
  border: 1px solid var(--color-card-border-mid, #ffffff33);
  border-radius: var(--border-corner-general-lg, 8px);
  padding: ${props => {
    switch (props.padding) {
      case 'small':
        return '12px';
      case 'large':
        return '32px';
      default:
        return '20px';
    }
  }};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 200ms cubic-bezier(0, 0, 0.34, 1);
  position: relative;
  overflow: hidden;
  
  ${props => props.hoverable && `
    cursor: pointer;
    
    &:hover {
      border-color: var(--color-card-border-high, #ffffff4d);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
      transform: translateY(-2px);
    }
    
    &:active {
      border-color: var(--color-card-border-low, #ffffff1a);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      transform: translateY(0);
    }
  `}
  
  ${props => props.selected && `
    border-color: var(--color-card-border-selected, #0064ff);
    box-shadow: 0 0 0 2px var(--color-card-border-selected, #0064ff);
  `}
`;

const CardHeader = styled.div`
  margin-bottom: 16px;
  
  h2, h3, h4 {
    color: var(--color-general-text-high, #ffffff);
    margin: 0;
    font-weight: 700;
  }
  
  h2 {
    font-size: 26.667px;
    line-height: 33.333px;
  }
  
  h3 {
    font-size: 20px;
    line-height: 27px;
  }
  
  h4 {
    font-size: 16px;
    line-height: 21.6px;
  }
`;

const CardContent = styled.div`
  color: var(--color-general-text-mid, #ffffffb3);
  font-size: 16px;
  line-height: 21.6px;
  
  p {
    margin: 0 0 12px 0;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const CardFooter = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--color-general-border-lowest, #ffffff1a);
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: ${props => props.align || 'flex-start'};
`;

/**
 * Card Component
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {React.ReactNode} props.header - Optional header content
 * @param {React.ReactNode} props.footer - Optional footer content
 * @param {'small'|'medium'|'large'} props.padding - Padding size
 * @param {boolean} props.hoverable - Enable hover effects
 * @param {boolean} props.selected - Show selected state
 * @param {Function} props.onClick - Click handler
 */
export function Card({ 
  children, 
  header,
  footer,
  padding = 'medium',
  hoverable = false,
  selected = false,
  onClick,
  footerAlign,
  ...props 
}) {
  return (
    <StyledCard 
      padding={padding}
      hoverable={hoverable}
      selected={selected}
      onClick={onClick}
      {...props}
    >
      {header && <CardHeader>{header}</CardHeader>}
      <CardContent>{children}</CardContent>
      {footer && <CardFooter align={footerAlign}>{footer}</CardFooter>}
    </StyledCard>
  );
}

export default Card;

