import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className="rounded-l-2xl">
        <SheetHeader className="border-b border-gray-100 py-4 px-6">
          <SheetTitle className="text-xl font-bold font-sans text-gray-900">
            {headerTitle}
          </SheetTitle>
        </SheetHeader>
        <div className="px-6 py-6 overflow-y-auto h-[calc(100vh-80px)]">
          <div className="flex flex-col gap-2">
            <span className="text-gray-900 text-sm font-medium font-sans">
              About
            </span>
            <p className="text-gray-900 text-base font-normal font-sans leading-relaxed whitespace-pre-wrap">
              {about}
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
