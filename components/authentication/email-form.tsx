import { Icon } from "@iconify/react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function EmailForm() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-xl text-primary-500 font-bold">Start Yout Journey</h1>
      <p className="text-gray-600 text-xs text-center mt-1">
        Set up your account to begin your journey and <br /> manage your
        assessments.
      </p>

      <Button variant="outline" className="mt-6">
        <Icon icon="material-icon-theme:google" />
        <span className="text-sm">Continue With Google</span>
      </Button>

      <div className="my-4 w-full flex items-center gap-3">
        <div className=" bg-gray-400 w-full h-px" />
        <span>OR</span>
        <div className=" bg-gray-400 w-full h-px" />
      </div>
      <Input
        placeholder="Enter your email"
        // value={email}
        // onChange={(e) => onEmailChange(e.target.value)}
      />
    </div>
  );
}
