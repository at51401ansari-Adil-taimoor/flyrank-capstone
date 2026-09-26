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
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 bg-slate-50">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-xl mx-auto">✓</div>
          <p role="status" className="text-base font-semibold text-slate-900">Account created successfully!</p>
          <p className="text-sm text-slate-500">You can now sign in to access your study plans.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 bg-slate-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        {/* Header */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 mb-1">Account</p>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create an account</h2>
          <p className="mt-1 text-sm text-slate-500">Join AI Study Planner to get personalized study schedules.</p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="signup-email" className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              aria-describedby={errors.email ? 'signup-email-error' : undefined}
            />
            {errors.email && (
              <p id="signup-email-error" role="alert" className="mt-1.5 text-xs text-red-600 font-medium">
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="signup-password" className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              aria-describedby={errors.password ? 'signup-password-error' : undefined}
            />
            {errors.password && (
              <p id="signup-password-error" role="alert" className="mt-1.5 text-xs text-red-600 font-medium">
                {errors.password}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  )
}
