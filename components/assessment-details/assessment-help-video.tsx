import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export default function AssessmentHelpVideo() {
  const videoTitle = "What will be tested and how to prepare.";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-3 flex items-center gap-3 lg:block h-fit mb-4">
      <Dialog>
        <DialogTrigger asChild>
          <video
            className="w-18 h-10 lg:hidden"
            role="button"
            aria-label={`Play video: ${videoTitle}`}
            tabIndex={0}
          >
            <source
              src="https://7span-website.b-cdn.net/4f1ec705-fc25-43df-8ab4-a60aa8bf7058.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="sr-only">
            <DialogTitle>{videoTitle}</DialogTitle>
          </DialogHeader>
          <video
            className="w-full h-full rounded-md"
            aria-label={videoTitle}
            controls
          >
            <source
              src="https://7span-website.b-cdn.net/4f1ec705-fc25-43df-8ab4-a60aa8bf7058.mp4"
              type="video/mp4"
            />
          </video>
        </DialogContent>
      </Dialog>

      <div className="flex flex-col gap-1 lg:gap-3">
        <div className="text-xs font-medium">{videoTitle}</div>
        <Dialog>
          <DialogTrigger asChild className="hidden lg:block">
            <video
              className="w-full h-full rounded-md max-w-60"
              role="button"
              aria-label={`Play video: ${videoTitle}`}
              tabIndex={0}
            >
              <source
                src="https://7span-website.b-cdn.net/4f1ec705-fc25-43df-8ab4-a60aa8bf7058.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="sr-only">
              <DialogTitle>{videoTitle}</DialogTitle>
            </DialogHeader>
            <video
              className="w-full h-full rounded-md"
              aria-label={videoTitle}
              controls
            >
              <source
                src="https://7span-website.b-cdn.net/4f1ec705-fc25-43df-8ab4-a60aa8bf7058.mp4"
                type="video/mp4"
              />
            </video>
          </DialogContent>
        </Dialog>

        <Link
          href="https://www.google.com"
          className="text-primary-500 text-xs underline block"
          aria-label="Get help with upskilling on these topics"
        >
          Need help in Upskilling on these topics?
        </Link>
      </div>
    </div>
  );
}
