import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

interface TalentAboutModalProps {
  about: string;
  trigger: ReactNode;
  headerTitle?: string;
}

export default function TalentAboutModal({
  about,
  trigger,
  headerTitle = "View About Details",
}: TalentAboutModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl bg-white p-0">
        <DialogHeader className="border-b border-gray-100 py-4 px-6">
          <DialogTitle className="text-xl font-bold font-sans text-gray-900">
            {headerTitle}
          </DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-6">
          <span className="text-gray-900 text-sm font-medium font-sans pb-1">
            About
          </span>
          <p className="text-gray-900 text-base font-normal font-sans leading-relaxed">
            {about}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
