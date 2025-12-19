import AuthForm from "@/components/authentication/auth-form";

export default function Page() {
  return (
    <div className="flex flex-row h-full">
      <img className="w-1/2" src="/auth.png" alt="" />
      <AuthForm />
    </div>
  );
}
