"use client";

import { FormEvent, useState } from "react";
import {
  authenticateUser,
  INVALID_CREDENTIALS_MESSAGE,
} from "@/lib/mockUsers";
import {
  hasValidationErrors,
  validateLoginForm,
  type LoginFormErrors,
} from "@/lib/validation";
import FormField from "./FormField";
import styles from "./form.module.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [successMessage, setSuccessMessage] = useState("");

  function submitForm() {
    setSuccessMessage("");

    const nextErrors = validateLoginForm({ email, password });
    setErrors(nextErrors);

    if (hasValidationErrors(nextErrors)) {
      return;
    }

    const user = authenticateUser(email, password);
    if (!user) {
      setErrors({ form: INVALID_CREDENTIALS_MESSAGE });
      return;
    }

    setErrors({});
    setSuccessMessage(`Welcome back, ${user.fullName}!`);
  }

  function onFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitForm();
  }

  return (
    <form className={styles.form} noValidate onSubmit={onFormSubmit}>
      <FormField
        id="email"
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        error={errors.email}
        autoComplete="email"
      />
      <FormField
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        error={errors.password}
        autoComplete="current-password"
        showPasswordToggle
      />

      {errors.form ? (
        <p className={`${styles.formMessage} ${styles.formError}`} role="alert">
          {errors.form}
        </p>
      ) : null}

      {successMessage ? (
        <p
          className={`${styles.formMessage} ${styles.successMessage}`}
          role="status"
        >
          {successMessage}
        </p>
      ) : null}

      <button type="submit" className={styles.submitButton}>
        Log in
      </button>
    </form>
  );
}
