import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-8">
        <h1 className="text-3xl font-bold text-center mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground text-center mb-6">Welcome to the admin portal. From here, you can manage health challenges and more.</p>
        <Link
          href="/challenges/new"
          className="w-full rounded-xl bg-black text-white text-lg font-semibold py-4 px-6 text-center shadow-md hover:bg-gray-900 transition-colors"
        >
          + Create New Challenge
        </Link>
      </div>
    </div>
  );
}
