import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icon } from "@iconify/react";

export default function PaymentCards() {
  const basicPackageIncludedItems = [
    "Unlock assessment",
    "Masked profile + score visibility to 100+ verified recruiters",
    "Custom job notifications based on your assessed skill set",
  ];

  const premiumPackageIncludedItems = [
    "One free retake (question set varies) after period. Best Score chosen.",
    "Skilled Certification issued under the TSH (TechSmartHire) brand — valid for 1 year",
    "Personal QR Code to verify certification on our secure cloud servers",
    "Detailed private analysis of your performance with improvement areas",
  ];

  const platinumPackageIncludedItems = [
    "Mentorship to strengthen the core skills covered in the assessment",
    "Learning resources, online training, and hands-on projects with a 6–8 week plan",
    "Detailed 1:1 analysis and personalized guidance for your retake (if required)",
    "Identification of exact knowledge gaps and improvement roadmap",
  ];

  const cards = [
    {
      title: "Basic Package",
      description:
        "<div>Get started at a minimal cost, pay the remaining when hiring interest is confirmed. <a href='#' class='text-black underline'>Learn More</a></div>",
      price: "₹999",
      includedItems: basicPackageIncludedItems,
      topNotes: "Pay Only 1% Today",
      bottomNotes:
        "₹900 later — only if you and a recruiter mutually connect (handshake)",
      buttonText: "Activate for ₹99",
      icon: "material-symbols:star-shine-outline-rounded",
    },
    {
      title: "Premium Package",
      description:
        "<div>Best value for professionals who want certification + improvement feedback</div>",
      price: "₹1299",
      includedItems: premiumPackageIncludedItems,
      buttonText: "Upgrade to Premium",
      icon: "material-symbols:diamond-outline-rounded",
    },
    {
      title: "Platinum Package",
      description:
        "<div>Complete coaching + exam strategy to level up fast</div>",
      price: "₹7999",
      includedItems: platinumPackageIncludedItems,
      buttonText: "Upgrade to Platinum",
      icon: "material-symbols:crown-outline-rounded",
      mentorServices: [
        "1:1 guidance and personalized learning roadmap",
        "Curated learning videos / online coaching",
        "Practice exercises and quick mock interview prep",
      ],
    },
  ];

  return (
    <div className="flex gap-3 overflow-auto">
      {cards.map((card) => (
        <div
          key={card.title}
          className="border border-gray-200 rounded-lg p-2 md:p-3 flex flex-col gap-10 justify-between min-w-64"
        >
          <div>
            <div className="flex items-center justify-between w-full mb-1">
              <div className="bg-gray-50 flex items-center justify-center rounded-lg size-8">
                <Icon icon={card.icon} className="size-5 text-primary-500" />
              </div>
              <span className="text-xs italic underline text-primary-500">
                {card.topNotes}
              </span>
            </div>
            <div className="font-semibold text-xs md:text-sm mb-1">
              {card.title}
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: card.description }}
              className="text-xs text-gray-500 mb-2"
            />

            <h2 className="text-lg md:text-xl font-bold">{card.price}</h2>

            <hr className="my-4 border-gray-200" />

            <div className="text-xs md:text-sm font-semibold">
              What&apos;s Included
            </div>

            <ul className="list-disc list-outside text-gray-600 px-2 mt-2 marker:text-primary-100 pl-4">
              {card.includedItems.map((item: string) => (
                <li key={item} className="text-xs text-gray-600 font-medium">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            {/* Notes */}
            {card.bottomNotes && (
              <p className="text-xs text-gray-700 text-center mt-2">
                {card.bottomNotes}
              </p>
            )}

            {card.title === "Platinum Package" ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="w-full mt-1">
                    {card.buttonText}
                  </Button>
                </DialogTrigger>
                <DialogContent className="py-4 px-0 md:max-w-100!">
                  <DialogHeader className="px-6">
                    <DialogTitle className="text-left text-base md:text-lg">
                      {card.title}
                    </DialogTitle>
                  </DialogHeader>
                  <hr className="border-gray-200" />
                  <div className="pl-6">
                    <div className="text-xs md:text-sm font-semibold">
                      Mentor Services Typically Include (May Vary):
                    </div>

                    <ul className="list-disc list-outside text-gray-600 px-2 mt-2 marker:text-primary-100 pl-4">
                      {card.mentorServices?.map((item: string) => (
                        <li
                          key={item}
                          className="text-xs md:text-sm text-gray-600 font-medium"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex gap-2 justify-end px-6">
                    <Button variant="secondary" className="">
                      Cancel
                    </Button>
                    <Button className="">Proceed</Button>
                  </div>
                </DialogContent>
              </Dialog>
            ) : (
              <Button variant="secondary" className="w-full mt-1">
                {card.buttonText}
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
