import { ReflectionForm } from '@/features/reflections/components/ReflectionForm'

export default function Reflection() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Welcome back, Shaun.</h1>

        <p className="text-muted-foreground">Every story has another side.</p>
      </div>

      <ReflectionForm />
    </main>
  )
}
