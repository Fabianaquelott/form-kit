import React from 'react';
import styles from './Toggle.module.css';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  id?: string;
  label?: string;
  labelPosition?: 'left' | 'right';
  onColor?: string;   
  offColor?: string; 
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  id,
  label,
  labelPosition = 'right',
  onColor = '#08068D',
  offColor = '#ccc',
}) => {
  return (
    <div className={`${styles.toggleContainer} ${labelPosition === 'left' ? styles.leftLabel : ''}`}>
      {label && labelPosition === 'left' && <label htmlFor={id} className={styles.label}>{label}</label>}
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        className={styles.toggle}
        onClick={() => onChange(!checked)}
        style={{ backgroundColor: checked ? onColor : offColor }}
      >
        <span className={styles.thumb} />
      </button>
      {label && labelPosition === 'right' && <label htmlFor={id} className={styles.label}>{label}</label>}
    </div>
  );
};
