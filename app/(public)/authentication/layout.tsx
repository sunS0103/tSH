export default function AuthenticationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:h-dvh p-4 md:p-6">
      <img
        className="md:w-1/2 object-cover rounded-2xl w-86 h-86 md:h-full mx-auto md:mx-0"
        src="/auth.png"
        alt="Authentication"
      />
      <div className="md:w-1/2 flex flex-col items-center overflow-y-auto">
        <div className="my-auto w-full">{children}</div>
      </div>
    </div>
  );
}
