import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideUp = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-8px);
  }
`;

const BannerContainer = styled.div`
  background: rgba(0, 0, 0, 0.7);
  padding: var(--space-vertical-near-md, 8px) var(--space-horizontal-near-md, 8px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-horizontal-near-md, 8px);
  animation: ${props => props.$isExiting ? slideUp : slideDown} 
    var(--motion-duration-30, 300ms) 
    var(--motion-easing-ease-out, cubic-bezier(0, 0, 0.34, 1));
  animation-fill-mode: both;
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const BannerText = styled.div`
  font-family: var(--text-body-md-font-family, 'Handset Sans UI', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif);
  font-size: var(--text-body-md-sz, 16px);
  line-height: var(--text-body-md-lh, 24px);
  font-weight: 400;
  color: rgb(255, 255, 255);
  letter-spacing: var(--text-body-md-ls, 0);
`;

const BannerTitle = styled.span`
  font-weight: 700;
`;

const UndoButton = styled.button`
  background: transparent;
  border: none;
  padding: var(--space-vertical-near-xs, 2px) var(--space-horizontal-near-sm, 4px);
  cursor: pointer;
  font-family: var(--text-action-md-font-family, 'Handset Sans UI', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif);
  font-size: var(--text-action-md-sz, 16px);
  line-height: var(--text-action-md-lh, 24px);
  font-weight: 700;
  letter-spacing: var(--text-action-md-ls, 0);
  color: rgb(255, 255, 255);
  transition: opacity var(--motion-duration-10, 100ms) var(--motion-easing-ease-out, cubic-bezier(0, 0, 0.34, 1));
  flex-shrink: 0;
  
  &:hover {
    opacity: 0.7;
  }
  
  &:active {
    opacity: 0.5;
  }
`;

/**
 * RemovalBanner Component
 * Shows a confirmation banner when a tile is removed or replaced from the list
 * 
 * @param {Object} props
 * @param {string} props.title - The title of the removed/replaced item
 * @param {string} props.action - Action type: 'removed' or 'replaced'
 * @param {Function} props.onUndo - Callback function when Undo is clicked
 * @param {Function} props.onDismiss - Callback function when banner auto-dismisses
 * @param {number} props.duration - Auto-dismiss duration in ms (default: 3000)
 */
export function RemovalBanner({ 
  title, 
  action = 'removed',
  onUndo, 
  onDismiss,
  duration = 3000 
}) {
  const [isExiting, setIsExiting] = React.useState(false);

  useEffect(() => {
    // Set up auto-dismiss
    const dismissTimer = setTimeout(() => {
      setIsExiting(true);
      // Wait for exit animation to complete before calling onDismiss
      setTimeout(() => {
        onDismiss && onDismiss();
      }, 300); // Match animation duration
    }, duration);

    return () => {
      clearTimeout(dismissTimer);
    };
  }, [duration, onDismiss]);

  const handleUndo = () => {
    setIsExiting(true);
    // Wait for exit animation before calling onUndo
    setTimeout(() => {
      onUndo && onUndo();
    }, 300);
  };

  const actionText = action === 'replaced' ? 'Replaced' : 'Removed';
  const suffixText = action === 'replaced' ? '' : ' from Your List';

  return (
    <BannerContainer $isExiting={isExiting}>
      <BannerText>
        {actionText} <BannerTitle>{title}</BannerTitle>{suffixText}
      </BannerText>
      <UndoButton onClick={handleUndo}>
        Undo
      </UndoButton>
    </BannerContainer>
  );
}

export default RemovalBanner;

