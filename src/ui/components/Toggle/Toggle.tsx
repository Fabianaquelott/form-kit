import React from 'react';

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
    <div className={`toggle-container ${labelPosition === 'left' ? 'toggle-container--left-label' : ''}`}>
      {label && labelPosition === 'left' && <label htmlFor={id} className="toggle-label">{label}</label>}
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        className="toggle"
        onClick={() => onChange(!checked)}
        style={{ backgroundColor: checked ? onColor : offColor }}
      >
        <span className="toggle__thumb" />
      </button>
      {label && labelPosition === 'right' && <label htmlFor={id} className="toggle-label">{label}</label>}
    </div>
  );
};
