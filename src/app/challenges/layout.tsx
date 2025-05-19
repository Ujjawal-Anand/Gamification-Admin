export default function ChallengesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6">
        {children}
      </div>
    </div>
  );
} 