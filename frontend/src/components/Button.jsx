import React from 'react';
import styled from 'styled-components';

/**
 * Styled Button Component using Slate Design System tokens
 */
const StyledButton = styled.button`
  /* Base styles */
  font-family: 'Handset Sans UI', sans-serif;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 200ms cubic-bezier(0, 0, 0.34, 1);
  position: relative;
  overflow: hidden;
  
  /* Size-specific styles */
  ${props => {
    switch (props.size) {
      case 'small':
        return `
          font-size: 12.8px;
          line-height: 16px;
          padding: 8px 16px;
          border-radius: var(--border-corner-action-sm, 4px);
        `;
      case 'large':
        return `
          font-size: 20px;
          line-height: 25px;
          padding: 16px 32px;
          border-radius: var(--border-corner-action-lg, 8px);
        `;
      default: // medium
        return `
          font-size: 16px;
          line-height: 20px;
          padding: 12px 24px;
          border-radius: var(--border-corner-action-md, 6px);
        `;
    }
  }}
  
  /* Variant-specific styles */
  ${props => {
    switch (props.variant) {
      case 'secondary':
        return `
          background: var(--color-action-secondary-fill-mid, #ffffff33);
          color: var(--color-action-secondary-text, #ffffff);
          
          &:hover:not(:disabled) {
            background: var(--color-action-secondary-fill-high, #ffffff4d);
          }
          
          &:active:not(:disabled) {
            background: var(--color-action-secondary-fill-low, #ffffff1a);
          }
        `;
      case 'neutral':
        return `
          background: var(--color-action-neutral-fill-mid, #00000033);
          color: var(--color-action-neutral-text, #ffffff);
          
          &:hover:not(:disabled) {
            background: var(--color-action-neutral-fill-high, #0000004d);
          }
          
          &:active:not(:disabled) {
            background: var(--color-action-neutral-fill-low, #0000001a);
          }
        `;
      case 'ghost':
        return `
          background: transparent;
          color: var(--color-general-text-high, #ffffff);
          
          &:hover:not(:disabled) {
            background: var(--color-action-neutral-fill-low, #ffffff1a);
          }
          
          &:active:not(:disabled) {
            background: var(--color-action-neutral-fill-mid, #ffffff33);
          }
        `;
      default: // primary
        return `
          background: var(--color-action-primary-fill-mid, #0064ff);
          color: var(--color-action-primary-text, #ffffff);
          
          &:hover:not(:disabled) {
            background: var(--color-action-primary-fill-high, #0070ff);
          }
          
          &:active:not(:disabled) {
            background: var(--color-action-primary-fill-low, #0050cc);
          }
        `;
    }
  }}
  
  /* States */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:focus-visible {
    outline: 2px solid var(--color-utility-focus-border-outer, #ffffff);
    outline-offset: 2px;
  }
  
  &:active:not(:disabled) {
    transform: scale(0.97);
  }
`;

/**
 * Button Component
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {'primary'|'secondary'|'neutral'|'ghost'} props.variant - Visual style variant
 * @param {'small'|'medium'|'large'} props.size - Button size
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.disabled - Disabled state
 */
export function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  onClick,
  disabled = false,
  type = 'button',
  ...props 
}) {
  return (
    <StyledButton 
      variant={variant} 
      size={size}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {children}
    </StyledButton>
  );
}

export default Button;

