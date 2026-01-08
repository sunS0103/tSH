import Header from "@/components/header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />

      <div className="bg-gray-50">
        <div className="max-container mx-auto bg-gray-50 px-4 pt-4 h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
