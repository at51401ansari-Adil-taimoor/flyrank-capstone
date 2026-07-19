import styles from "./form.module.css";

type FormFieldProps = {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  autoComplete?: string;
  placeholder?: string;
  showToggle?: boolean;
  onToggle?: () => void;
  toggleLabel?: string;
};

export function FormField({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  autoComplete,
  placeholder,
  showToggle,
  onToggle,
  toggleLabel,
}: FormFieldProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={styles.inputWrapper}>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${styles.input} ${error ? styles.inputError : ""} ${
            showToggle ? styles.inputWithToggle : ""
          }`}
        />
        {showToggle && onToggle && (
          <button
            type="button"
            className={styles.togglePassword}
            onClick={onToggle}
            aria-label={toggleLabel}
          >
            {toggleLabel}
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
