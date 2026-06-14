import { Button } from "@/components/ui/button";

function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 ">
      <section className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
        <p className="mb-3 text-sm uppercase tracking-[0.3em] text-teal-400">
          Duality
        </p>

        <h1 className="mb-4 text-4xl font-semibold">
          Discover the other side of your story.
        </h1>

        <p className="text-slate-400">
          An AI reflection companion for daily journalling, alternative
          perspectives, and intentional growth.
        </p>

        <Button>Get Started</Button>
      </section>
    </main>
  );
}

export default App;