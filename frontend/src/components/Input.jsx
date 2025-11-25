import React, { useState } from 'react';
import styled from 'styled-components';

/**
 * Styled Input Component using Slate Design System tokens
 */
const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const Label = styled.label`
  display: block;
  color: var(--color-general-text-high, #ffffff);
  font-weight: 700;
  font-size: 16px;
  line-height: 21.6px;
`;

const StyledInput = styled.input`
  width: 100%;
  font-family: 'Handset Sans UI', sans-serif;
  font-size: 16px;
  line-height: 21.6px;
  padding: 12px 16px;
  border-radius: var(--border-corner-input-standard, 4px);
  transition: all 200ms cubic-bezier(0, 0, 0.34, 1);
  
  /* Default state - empty */
  background: var(--color-input-neutral-fill-mid, #ffffff1a);
  border: 1px solid var(--color-input-neutral-border-unselected, #ffffff33);
  color: var(--color-input-neutral-text-high, #ffffff);
  
  &::placeholder {
    color: var(--color-input-neutral-text-low, #ffffff66);
  }
  
  /* Filled state - has value but not focused */
  &:not(:placeholder-shown):not(:focus) {
    background: var(--color-input-neutral-fill-high, #ffffff26);
  }
  
  /* Focus state */
  &:focus {
    background: var(--color-input-primary-fill-high, #0064ff1a);
    border: 3px solid var(--color-input-primary-border-selected, #0064ff);
    color: var(--color-input-primary-text-high, #ffffff);
    outline: none;
    padding: 10px 14px; /* Adjust padding to account for thicker border */
  }
  
  /* Error state */
  ${props => props.error && `
    border: 2px solid var(--color-utility-error-border, #ff0000);
    background: var(--color-utility-error-fill, #ff00001a);
    
    &:focus {
      border: 3px solid var(--color-utility-error-border, #ff0000);
      padding: 10px 14px;
    }
  `}
  
  /* Disabled state */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--color-input-neutral-fill-low, #ffffff0d);
  }
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  font-family: 'Handset Sans UI', sans-serif;
  font-size: 16px;
  line-height: 21.6px;
  padding: 12px 16px;
  border-radius: var(--border-corner-input-standard, 4px);
  transition: all 200ms cubic-bezier(0, 0, 0.34, 1);
  resize: vertical;
  min-height: 100px;
  
  /* Default state - empty */
  background: var(--color-input-neutral-fill-mid, #ffffff1a);
  border: 1px solid var(--color-input-neutral-border-unselected, #ffffff33);
  color: var(--color-input-neutral-text-high, #ffffff);
  
  &::placeholder {
    color: var(--color-input-neutral-text-low, #ffffff66);
  }
  
  /* Filled state */
  &:not(:placeholder-shown):not(:focus) {
    background: var(--color-input-neutral-fill-high, #ffffff26);
  }
  
  /* Focus state */
  &:focus {
    background: var(--color-input-primary-fill-high, #0064ff1a);
    border: 3px solid var(--color-input-primary-border-selected, #0064ff);
    color: var(--color-input-primary-text-high, #ffffff);
    outline: none;
    padding: 10px 14px;
  }
  
  /* Error state */
  ${props => props.error && `
    border: 2px solid var(--color-utility-error-border, #ff0000);
    background: var(--color-utility-error-fill, #ff00001a);
    
    &:focus {
      border: 3px solid var(--color-utility-error-border, #ff0000);
      padding: 10px 14px;
    }
  `}
  
  /* Disabled state */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--color-input-neutral-fill-low, #ffffff0d);
  }
`;

const ErrorMessage = styled.span`
  color: var(--color-utility-error-text, #ff0000);
  font-size: 12.8px;
  line-height: 17.28px;
`;

const HelperText = styled.span`
  color: var(--color-general-text-low, #ffffff66);
  font-size: 12.8px;
  line-height: 17.28px;
`;

/**
 * Input Component
 * 
 * @param {Object} props
 * @param {string} props.label - Input label
 * @param {string} props.type - Input type (text, email, password, etc.)
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.value - Controlled value
 * @param {Function} props.onChange - Change handler
 * @param {boolean} props.error - Error state
 * @param {string} props.errorMessage - Error message to display
 * @param {string} props.helperText - Helper text to display
 * @param {boolean} props.disabled - Disabled state
 * @param {boolean} props.multiline - Render as textarea
 */
export function Input({ 
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error = false,
  errorMessage,
  helperText,
  disabled = false,
  multiline = false,
  required = false,
  ...props 
}) {
  const [internalValue, setInternalValue] = useState('');
  const isControlled = value !== undefined;
  const inputValue = isControlled ? value : internalValue;
  
  const handleChange = (e) => {
    if (!isControlled) {
      setInternalValue(e.target.value);
    }
    if (onChange) {
      onChange(e);
    }
  };
  
  const InputElement = multiline ? StyledTextarea : StyledInput;
  
  return (
    <InputWrapper>
      {label && (
        <Label>
          {label}
          {required && ' *'}
        </Label>
      )}
      <InputElement
        type={multiline ? undefined : type}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        error={error}
        disabled={disabled}
        required={required}
        {...props}
      />
      {error && errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      {!error && helperText && <HelperText>{helperText}</HelperText>}
    </InputWrapper>
  );
}

export default Input;

