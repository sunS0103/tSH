import Header from "@/components/header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      <main className="max-container mx-auto w-full flex-1 px-4 pt-4">
        {children}
      </main>
    </div>
  );
}
