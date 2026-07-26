export default function AdminErrorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50/50 dark:bg-background px-4">
      {children}
    </div>
  );
}
