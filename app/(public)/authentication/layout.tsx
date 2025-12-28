export default function AuthenticationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row p-4 md:p-6 md:pb-4 md:h-dvh md:overflow-hidden">
      <img
        className="md:w-1/2 object-cover rounded-2xl w-86 h-86 md:h-full mx-auto md:mx-0"
        src="/auth.png"
        alt="Authentication"
      />
      <div className="md:w-1/2 flex flex-col items-center justify-start scrollbar-hide">
        <div className="w-full h-screen md:overflow-auto">{children}</div>
      </div>
    </div>
  );
}
