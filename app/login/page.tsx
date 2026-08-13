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
          <label className="block text-sm">Email</label>
          <input value={email} onChange={(e)=>setEmail(e.target.value)} className="mt-1 block w-full rounded border px-2 py-1" />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="mt-1 block w-full rounded border px-2 py-1" />
        </div>
        <button type="button" className="px-4 py-2 bg-primary text-white rounded">Login (placeholder)</button>
      </form>
    </section>
  )
}
