export interface RegisteredUser {
  fullName: string;
  email: string;
  password: string;
}

export const registeredUsers: RegisteredUser[] = [
  {
    fullName: "Alex Morgan",
    email: "alex@flyrank.com",
    password: "password123",
  },
  {
    fullName: "Jordan Lee",
    email: "jordan@example.com",
    password: "securepass",
  },
];

export const INVALID_CREDENTIALS_MESSAGE = "Invalid email or password";

export function authenticateUser(
  email: string,
  password: string,
): RegisteredUser | null {
  const normalizedEmail = email.trim().toLowerCase();
  const user = registeredUsers.find(
    (entry) => entry.email.toLowerCase() === normalizedEmail,
  );

  if (!user || user.password !== password) {
    return null;
  }

  return user;
}

export function registerUser(user: RegisteredUser): void {
  const normalizedEmail = user.email.trim().toLowerCase();
  const existingIndex = registeredUsers.findIndex(
    (entry) => entry.email.toLowerCase() === normalizedEmail,
  );

  if (existingIndex >= 0) {
    registeredUsers[existingIndex] = user;
    return;
  }

  registeredUsers.push(user);
}

export function resetRegisteredUsers(): void {
  registeredUsers.length = 0;
  registeredUsers.push(
    {
      fullName: "Alex Morgan",
      email: "alex@flyrank.com",
      password: "password123",
    },
    {
      fullName: "Jordan Lee",
      email: "jordan@example.com",
      password: "securepass",
    },
  );
}
