"use client";

import { useId, useState } from "react";
import styles from "./form.module.css";

interface FormFieldProps {
  id: string;
  label: string;
  type?: "text" | "email" | "password";
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete?: string;
  showPasswordToggle?: boolean;
}

export default function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  autoComplete,
  showPasswordToggle = false,
}: FormFieldProps) {
  const errorId = useId();
  const [visible, setVisible] = useState(false);
  const isPasswordField = type === "password";
  const inputType =
    isPasswordField && showPasswordToggle
      ? visible
        ? "text"
        : "password"
      : type;

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={styles.inputWrapper}>
        <input
          id={id}
          name={id}
          type={inputType}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={`${styles.input} ${showPasswordToggle && isPasswordField ? styles.inputWithToggle : ""} ${error ? styles.inputError : ""}`}
        />
        {isPasswordField && showPasswordToggle ? (
          <button
            type="button"
            className={styles.toggleButton}
            onClick={() => setVisible((current) => !current)}
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
          >
            {visible ? "Hide" : "Show"}
          </button>
        ) : null}
      </div>
      {error ? (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
