import Header from "@/components/header";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />

      <div className="bg-gray-50">
        <div className="max-container mx-auto bg-gray-50 px-4 pt-4">
          {children}
        </div>
      </div>
    </>
  );
}
