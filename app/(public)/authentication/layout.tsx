export default function AuthenticationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @media (min-width: 768px) {
            html,
            body {
              overflow: hidden !important;
              height: 100% !important;
            }
          }
        `,
        }}
      />
      <div className="flex flex-col gap-4 md:flex-row md:h-full md:overflow-hidden p-4 md:p-6">
        <img
          className="md:w-1/2 object-cover rounded-2xl w-86 h-86 md:h-full mx-auto md:mx-0"
          src="/auth.png"
          alt="Authentication"
        />
        <div className="md:w-1/2 flex flex-col items-center overflow-y-auto">
          <div className="w-full md:my-auto md:shrink">{children}</div>
        </div>
      </div>
    </>
  );
}
