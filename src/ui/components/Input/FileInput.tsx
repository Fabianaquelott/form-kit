import React, { forwardRef, useState, useImperativeHandle } from 'react';
import styles from './FileInput.module.css';
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
    const inputRef = React.useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
      input: inputRef.current,
      clear: () => {
        if (inputRef.current) {
          inputRef.current.value = '';
          setFileName(null);
        }
      },
    }));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setFileName(e.target.files[0].name);
      } else {
        setFileName(null);
      }

      // Chama o onChange externo se existir (ex: react-hook-form)
      props.onChange && props.onChange(e);
    };

    const handleClear = () => {
      if (inputRef.current) {
        inputRef.current.value = '';
        setFileName(null);
      }
    };

    return (
      <div className={`${styles.container} ${fullWidth ? styles.fullWidth : ''}`}>
        {label && <Label htmlFor={inputId}>{label}</Label>}

        {!fileName ? (
          <label htmlFor={inputId} className={styles.button}>
            {buttonText} <span className={styles.icon}>📷</span>
          </label>
        ) : (
          <div className={styles.fileInfo}>
            <span className={styles.fileName}>{fileName}</span>
            <button type="button" className={styles.clearButton} onClick={handleClear}>
              ✖
            </button>
          </div>
        )}

        <input
          id={inputId}
          type="file"
          ref={inputRef}
          {...props}
          className={styles.hiddenInput}
          onChange={handleChange}
        />

        {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
      </div>
    );
  }
);

FileButtonInput.displayName = 'FileButtonInput';
