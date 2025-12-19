export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="p-4 md:p-6 h-screen">{children}</div>;
}
