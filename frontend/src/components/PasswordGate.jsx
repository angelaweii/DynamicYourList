import React, { useState } from 'react';

/**
 * Full-screen password gate shown before the main experience.
 * On success, writes to sessionStorage so the gate does not re-appear
 * within the same browser session, then calls onUnlock().
 */
export function PasswordGate({ onUnlock }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const expected = import.meta.env.VITE_PREVIEW_PASSWORD;
    if (value === expected) {
      sessionStorage.setItem('unlocked', '1');
      onUnlock();
    } else {
      setError(true);
      setValue('');
    }
  };

  return (
    <div style={styles.backdrop}>
      <form onSubmit={handleSubmit} style={styles.card} noValidate>
        <div style={styles.lockIcon}>🔒</div>
        <h1 style={styles.heading}>Preview Access</h1>
        <p style={styles.subheading}>Enter the password to continue.</p>

        <input
          type="password"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          placeholder="Password"
          autoFocus
          style={{
            ...styles.input,
            ...(error ? styles.inputError : {}),
          }}
        />

        {error && <p style={styles.errorText}>Incorrect password. Try again.</p>}

        <button
          type="submit"
          disabled={!value}
          style={{
            ...styles.button,
            ...(value ? {} : styles.buttonDisabled),
          }}
        >
          Enter
        </button>
      </form>
    </div>
  );
}

const styles = {
  backdrop: {
    minHeight: '100vh',
    background: '#040A0A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--text-font-family-default, system-ui, sans-serif)',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    width: '100%',
    maxWidth: '360px',
    padding: '48px 32px',
    background: 'rgba(255,255,255,0.04)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  lockIcon: {
    fontSize: '32px',
    lineHeight: 1,
  },
  heading: {
    margin: 0,
    fontSize: '22px',
    fontWeight: 600,
    color: '#ffffff',
    letterSpacing: '-0.01em',
  },
  subheading: {
    margin: 0,
    fontSize: '14px',
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '15px',
    color: '#ffffff',
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '8px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  },
  inputError: {
    borderColor: '#e05c5c',
  },
  errorText: {
    margin: 0,
    fontSize: '13px',
    color: '#e05c5c',
    alignSelf: 'flex-start',
  },
  button: {
    width: '100%',
    padding: '12px',
    fontSize: '15px',
    fontWeight: 600,
    color: '#ffffff',
    background: 'var(--color-action-primary-fill-mid, #005FCC)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'opacity 0.15s',
    marginTop: '4px',
  },
  buttonDisabled: {
    opacity: 0.35,
    cursor: 'default',
  },
};

export default PasswordGate;
