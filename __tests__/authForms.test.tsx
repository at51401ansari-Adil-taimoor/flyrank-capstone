import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import {
  INVALID_CREDENTIALS_MESSAGE,
  resetRegisteredUsers,
} from "@/lib/mockUsers";
import { VALIDATION_MESSAGES } from "@/lib/validation";

describe("SignupForm validation", () => {
  beforeEach(() => {
    resetRegisteredUsers();
  });

  it("blocks empty form submission", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(screen.getAllByRole("alert")).toHaveLength(4);
    expect(
      screen.getAllByText(VALIDATION_MESSAGES.required),
    ).toHaveLength(4);
    expect(
      screen.queryByText(/account created successfully/i),
    ).not.toBeInTheDocument();
  });

  it("rejects an invalid email", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByLabelText(/full name/i), "Test User");
    await user.type(screen.getByLabelText(/^email$/i), "not-an-email");
    await user.type(screen.getByLabelText(/^password$/i), "password123");
    await user.type(
      screen.getByLabelText(/confirm password/i),
      "password123",
    );
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(screen.getByText(VALIDATION_MESSAGES.email)).toBeInTheDocument();
    expect(
      screen.queryByText(/account created successfully/i),
    ).not.toBeInTheDocument();
  });

  it("rejects a password under 8 characters", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByLabelText(/full name/i), "Test User");
    await user.type(screen.getByLabelText(/^email$/i), "user@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "short");
    await user.type(screen.getByLabelText(/confirm password/i), "short");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(
      screen.getByText(VALIDATION_MESSAGES.passwordMin),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/account created successfully/i),
    ).not.toBeInTheDocument();
  });

  it("rejects mismatched passwords", async () => {
    const user = userEvent.setup();
    render(<SignupForm />);

    await user.type(screen.getByLabelText(/full name/i), "Test User");
    await user.type(screen.getByLabelText(/^email$/i), "user@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "password123");
    await user.type(
      screen.getByLabelText(/confirm password/i),
      "different123",
    );
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(
      screen.getByText(VALIDATION_MESSAGES.passwordMatch),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/account created successfully/i),
    ).not.toBeInTheDocument();
  });

  it("prevents native form submission", () => {
    render(<SignupForm />);
    const form = screen
      .getByRole("button", { name: /create account/i })
      .closest("form");
    expect(form).not.toBeNull();

    const event = new Event("submit", { bubbles: true, cancelable: true });
    const preventDefault = jest.spyOn(event, "preventDefault");

    fireEvent(form!, event);

    expect(preventDefault).toHaveBeenCalled();
  });
});

describe("LoginForm authentication", () => {
  beforeEach(() => {
    resetRegisteredUsers();
  });

  it("blocks empty form submission", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(screen.getAllByRole("alert")).toHaveLength(2);
    expect(
      screen.getAllByText(VALIDATION_MESSAGES.required),
    ).toHaveLength(2);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("rejects an invalid email", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/^email$/i), "bad-email");
    await user.type(screen.getByLabelText(/^password$/i), "password123");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(screen.getByText(VALIDATION_MESSAGES.email)).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("rejects a password under 8 characters", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/^email$/i), "alex@flyrank.com");
    await user.type(screen.getByLabelText(/^password$/i), "short");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(
      screen.getByText(VALIDATION_MESSAGES.passwordMin),
    ).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("shows an error for unregistered credentials instead of success", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(
      screen.getByLabelText(/^email$/i),
      "unknown@example.com",
    );
    await user.type(screen.getByLabelText(/^password$/i), "password123");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(
      screen.getByText(INVALID_CREDENTIALS_MESSAGE),
    ).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("shows success for correct mock credentials", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    await user.type(screen.getByLabelText(/^email$/i), "alex@flyrank.com");
    await user.type(screen.getByLabelText(/^password$/i), "password123");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(screen.getByRole("status")).toHaveTextContent(
      /welcome back, alex morgan/i,
    );
    expect(
      screen.queryByText(INVALID_CREDENTIALS_MESSAGE),
    ).not.toBeInTheDocument();
  });

  it("prevents native form submission", () => {
    render(<LoginForm />);
    const form = screen.getByRole("button", { name: /log in/i }).closest("form");
    expect(form).not.toBeNull();

    const event = new Event("submit", { bubbles: true, cancelable: true });
    const preventDefault = jest.spyOn(event, "preventDefault");

    fireEvent(form!, event);

    expect(preventDefault).toHaveBeenCalled();
  });
});
