"use client"
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <section>
      <h2 className="text-2xl font-bold mb-2">Login</h2>
      <p className="text-gray-700 mb-4">A login form for students to access their study plans.</p>
      <form className="space-y-3 max-w-sm">
        <div>
          <label htmlFor="login-email" className="block text-sm">Email</label>
          <input id="login-email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className="mt-1 block w-full rounded border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400" />
        </div>
        <div>
          <label htmlFor="login-password" className="block text-sm">Password</label>
          <input id="login-password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="mt-1 block w-full rounded border px-2 py-1 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400" />
        </div>
        <button type="button" className="px-4 py-2 bg-primary text-white rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-400">Login (placeholder)</button>
      </form>
    </section>
  )
}
