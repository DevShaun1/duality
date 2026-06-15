import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">

      <h1 className="text-4xl font-bold">404</h1>

      <h2 className="mt-4 text-xl font-semibold">
        Page not found
      </h2>

      <p className="mt-2 text-muted-foreground">
        The page you're looking for doesn't exist in this reality.
      </p>

      <div className="mt-4">
        <Link to="/">Go to Home</Link>
      </div>

    </main>
  );
}