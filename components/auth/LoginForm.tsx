"use client";

import { FormEvent, useState } from "react";
import { FormField } from "./FormField";
import styles from "./form.module.css";
import {
  type FieldErrors,
  validateEmail,
  validatePassword,
} from "@/lib/validation";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  function validate(): FieldErrors {
    const nextErrors: FieldErrors = {};
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError) nextErrors.email = emailError;
    if (passwordError) nextErrors.password = passwordError;

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

    setSuccessMessage("Signed in successfully. Welcome back!");
    setIsSubmitting(false);
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <FormField
        id="login-email"
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        error={errors.email}
        autoComplete="email"
        placeholder="you@example.com"
      />

      <FormField
        id="login-password"
        label="Password"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={setPassword}
        error={errors.password}
        autoComplete="current-password"
        placeholder="Enter your password"
        showToggle
        onToggle={() => setShowPassword((prev) => !prev)}
        toggleLabel={showPassword ? "Hide" : "Show"}
      />

      <p className={styles.forgot}>
        <a href="#">Forgot password?</a>
      </p>

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
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
