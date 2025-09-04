import React, { forwardRef, useState, useImperativeHandle } from 'react';
import CameraIcon from '../../../assets/camera-icon.svg';
import TrashIcon from '../../../assets/trash-icon.svg';
import PaperIcon from '../../../assets/paper-icon.svg';
import { Label } from '../Label/Label';

interface FileButtonInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  buttonText?: string;
  errorMessage?: string;
  fullWidth?: boolean;
}

export interface FileButtonInputRef {
  input: HTMLInputElement | null;
  clear: () => void;
}

export const FileButtonInput = forwardRef<FileButtonInputRef, FileButtonInputProps>(
  ({ label, buttonText = 'Enviar arquivo', errorMessage, fullWidth, id, ...props }, ref) => {
    const inputId = id || `file-input-${Math.random().toString(36).substr(2, 9)}`;
    const [fileName, setFileName] = useState<string | null>(null);
    const [internalError, setInternalError] = useState<string | null>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpeg', 'application/pdf', 'image/webp'];

    useImperativeHandle(ref, () => ({
      input: inputRef.current,
      clear: () => {
        if (inputRef.current) {
          inputRef.current.value = '';
          setFileName(null);
          setInternalError(null);
          const event = { target: { files: null } } as unknown as React.ChangeEvent<HTMLInputElement>;
          props.onChange?.(event);
        }
      },
    }));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalError(null); 
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        if (!allowedTypes.includes(file.type)) {
          setInternalError('Tipo de arquivo não permitido. Use .svg, .png, .jpeg, .jpg, .pdf ou .webp.');
          if (inputRef.current) inputRef.current.value = '';
          setFileName(null);
          return;
        }
        setFileName(file.name);
      } else {
        setFileName(null);
      }
      props.onChange?.(e);
    };

    const handleClear = () => {
      if (inputRef.current) {
        inputRef.current.value = '';
        setFileName(null);
        setInternalError(null);
        props.onChange?.({
          target: { files: undefined }
        } as unknown as React.ChangeEvent<HTMLInputElement>);
      }
    };

    return (
      <div className={`file-input-container ${fullWidth ? 'file-input-container--full-width' : ''}`}>
        {label && <Label htmlFor={inputId}>{label}</Label>}

        {!fileName ? (
          <label htmlFor={inputId} className="file-input__button">
            {buttonText}
            <span className="file-input__icon-camera">
              <img src={CameraIcon} alt='Ícone de câmera' />
            </span>
          </label>
        ) : (
          <div className="file-input__file-info">
            <div className="file-input__file-name-container">
              <span><img src={PaperIcon} /></span>
              <span className="file-input__file-name">{fileName}</span>
            </div>
            <button type="button" className="file-input__clear-button" onClick={handleClear}>
              <span className="file-input__icon-trash"><img src={TrashIcon} /></span>
            </button>
          </div>
        )}

        <input
          id={inputId}
          type="file"
          ref={inputRef}
          accept=".svg,.png,.jpeg,.jpg,.pdf,.webp"
          {...props}
          className="file-input__hidden"
          onChange={handleChange}
        />

        {(internalError || errorMessage) && (
          <div className="file-input__error-message">{internalError || errorMessage}</div>
        )}
      </div>
    );
  }
);

FileButtonInput.displayName = 'FileButtonInput';
