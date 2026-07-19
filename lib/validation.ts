export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const VALIDATION_MESSAGES = {
  required: "This field is required",
  email: "Please enter a valid email address (name@domain.tld)",
  passwordMin: "Password must be at least 8 characters",
  passwordMatch: "Passwords do not match",
} as const;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

export function validateRequired(value: string): string | undefined {
  if (!value.trim()) {
    return VALIDATION_MESSAGES.required;
  }
  return undefined;
}

export function validateEmail(email: string): string | undefined {
  const requiredError = validateRequired(email);
  if (requiredError) return requiredError;
  if (!isValidEmail(email)) {
    return VALIDATION_MESSAGES.email;
  }
  return undefined;
}

export function validatePassword(password: string): string | undefined {
  const requiredError = validateRequired(password);
  if (requiredError) return requiredError;
  if (!isValidPassword(password)) {
    return VALIDATION_MESSAGES.passwordMin;
  }
  return undefined;
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string,
): string | undefined {
  const requiredError = validateRequired(confirmPassword);
  if (requiredError) return requiredError;
  if (password !== confirmPassword) {
    return VALIDATION_MESSAGES.passwordMatch;
  }
  return undefined;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface SignupFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  form?: string;
}

export interface SignupFormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
}

export function validateLoginForm(values: LoginFormValues): LoginFormErrors {
  const errors: LoginFormErrors = {};
  const emailError = validateEmail(values.email);
  const passwordError = validatePassword(values.password);

  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;

  return errors;
}

export function validateSignupForm(values: SignupFormValues): SignupFormErrors {
  const errors: SignupFormErrors = {};
  const fullNameError = validateRequired(values.fullName);
  const emailError = validateEmail(values.email);
  const passwordError = validatePassword(values.password);
  const confirmPasswordError = validateConfirmPassword(
    values.password,
    values.confirmPassword,
  );

  if (fullNameError) errors.fullName = fullNameError;
  if (emailError) errors.email = emailError;
  if (passwordError) errors.password = passwordError;
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;

  return errors;
}

export function hasValidationErrors<T extends object>(errors: T): boolean {
  return Object.keys(errors).length > 0;
}
