export default async function HealthPage() {
  const mod = await import('../../data/health.json')
  const data = (mod as any).default ?? mod

  return (
    <section>
      <h2 className="text-2xl font-bold mb-2">Health Check</h2>
      <p className="text-gray-700 mb-4">This server-rendered page proves data fetching from local files works.</p>
      <pre className="bg-white p-4 rounded border max-w-xl overflow-auto">{JSON.stringify(data, null, 2)}</pre>
    </section>
  )
}
