"use client"
import { useState } from 'react'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const next: { email?: string; password?: string } = {}
    if (!email.trim()) {
      next.email = 'Email is required.'
    } else if (!isValidEmail(email)) {
      next.email = 'Please enter a valid email address.'
    }
    if (!password) {
      next.password = 'Password is required.'
    } else if (password.length < 8) {
      next.password = 'Password must be at least 8 characters.'
    }
    if (Object.keys(next).length > 0) {
      setErrors(next)
      return
    }
    setErrors({})
    setSubmitted(true)
  }

  if (submitted) {
    return <p role="status">Account created successfully!</p>
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-2">Sign Up</h2>
      <p className="text-gray-700 mb-4">A signup form for new students to create accounts.</p>
      <form className="space-y-3 max-w-sm" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="signup-email" className="block text-sm">Email</label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded border px-2 py-1"
            aria-describedby={errors.email ? 'signup-email-error' : undefined}
          />
          {errors.email && (
            <p id="signup-email-error" role="alert" className="text-sm text-red-600 mt-1">{errors.email}</p>
          )}
        </div>
        <div>
          <label htmlFor="signup-password" className="block text-sm">Password</label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded border px-2 py-1"
            aria-describedby={errors.password ? 'signup-password-error' : undefined}
          />
          {errors.password && (
            <p id="signup-password-error" role="alert" className="text-sm text-red-600 mt-1">{errors.password}</p>
          )}
        </div>
        <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Sign Up</button>
      </form>
    </section>
  )
}
