"use client";

import { FormEvent, useState } from "react";
import { FormField } from "./FormField";
import styles from "./form.module.css";
import {
  type FieldErrors,
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
} from "@/lib/validation";

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  function validate(): FieldErrors {
    const nextErrors: FieldErrors = {};
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmError = validateConfirmPassword(password, confirmPassword);

    if (nameError) nextErrors.name = nameError;
    if (emailError) nextErrors.email = emailError;
    if (passwordError) nextErrors.password = passwordError;
    if (confirmError) nextErrors.confirmPassword = confirmError;

    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage("");

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);

    // Placeholder until auth API is wired up
    await new Promise((resolve) => setTimeout(resolve, 800));

    setSuccessMessage("Account created successfully. You can now sign in.");
    setIsSubmitting(false);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <FormField
        id="signup-name"
        label="Full name"
        value={name}
        onChange={setName}
        error={errors.name}
        autoComplete="name"
        placeholder="Jane Doe"
      />

      <FormField
        id="signup-email"
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        error={errors.email}
        autoComplete="email"
        placeholder="you@example.com"
      />

      <FormField
        id="signup-password"
        label="Password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={setPassword}
        error={errors.password}
        autoComplete="new-password"
        placeholder="At least 8 characters"
        showToggle
        onToggle={() => setShowPassword((prev) => !prev)}
        toggleLabel={showPassword ? "Hide" : "Show"}
      />

      <FormField
        id="signup-confirm-password"
        label="Confirm password"
        type={showPassword ? "text" : "password"}
        value={confirmPassword}
        onChange={setConfirmPassword}
        error={errors.confirmPassword}
        autoComplete="new-password"
        placeholder="Re-enter your password"
      />

      {successMessage && (
        <p className={styles.success} role="status">
          {successMessage}
        </p>
      )}

      <button
        type="submit"
        className={styles.submit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
