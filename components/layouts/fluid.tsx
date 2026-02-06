export default function FluidLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative left-1/2 right-1/2 -mx-[50dvw] w-dvw">
      {children}
    </div>
  );
}
