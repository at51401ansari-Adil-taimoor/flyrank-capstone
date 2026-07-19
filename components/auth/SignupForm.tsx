"use client";

import { FormEvent, useState } from "react";
import { registerUser } from "@/lib/mockUsers";
import {
  hasValidationErrors,
  validateSignupForm,
  type SignupFormErrors,
} from "@/lib/validation";
import FormField from "./FormField";
import styles from "./form.module.css";

export default function SignupForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [successMessage, setSuccessMessage] = useState("");

  function submitForm() {
    setSuccessMessage("");

    const nextErrors = validateSignupForm({
      fullName,
      email,
      password,
      confirmPassword,
    });
    setErrors(nextErrors);

    if (hasValidationErrors(nextErrors)) {
      return;
    }

    registerUser({
      fullName: fullName.trim(),
      email: email.trim(),
      password,
    });

    setErrors({});
    setSuccessMessage("Account created successfully. You can now log in.");
  }

  function onFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitForm();
  }

  return (
    <form className={styles.form} noValidate onSubmit={onFormSubmit}>
      <FormField
        id="fullName"
        label="Full name"
        type="text"
        value={fullName}
        onChange={setFullName}
        error={errors.fullName}
        autoComplete="name"
      />
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
        autoComplete="new-password"
        showPasswordToggle
      />
      <FormField
        id="confirmPassword"
        label="Confirm password"
        type="password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        error={errors.confirmPassword}
        autoComplete="new-password"
        showPasswordToggle
      />

      {successMessage ? (
        <p
          className={`${styles.formMessage} ${styles.successMessage}`}
          role="status"
        >
          {successMessage}
        </p>
      ) : null}

      <button type="submit" className={styles.submitButton}>
        Create account
      </button>
    </form>
  );
}
