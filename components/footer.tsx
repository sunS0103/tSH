import Link from "next/link";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface QuickLinkGroup {
  title?: string;
  links: { label: string; href: string }[];
}

interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  const quickLinkGroups: QuickLinkGroup[] = [
    {
      links: [
        { label: "Assessments", href: "/assessments" },
        { label: "Jobs", href: "/jobs" },
      ],
    },
    {
      links: [
        { label: "Product Vision", href: "/techSmartHireVision" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    {
      links: [
        { label: "Terms & Condition", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
      ],
    },
  ];

  const socialLinks = [
    { icon: "mdi:facebook", href: "#", label: "Facebook" },
    { icon: "mdi:instagram", href: "#", label: "Instagram" },
    { icon: "ri:twitter-x-fill", href: "#", label: "Twitter" },
  ];

  return (
    <footer className={cn("max-container mx-auto", className)}>
      <div
        className={cn(
          "bg-gray-900 flex flex-col items-start rounded-3xl w-full pb-4 px-4 mb-24 md:mb-6",
          className
        )}
      >
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row items-start justify-between w-full py-6 md:py-10">
          {/* Logo & Contact Info */}
          <div className="flex flex-col gap-7 md:gap-10 items-start border-b md:border-b-0 md:border-r border-gray-800 pb-8 md:pb-0 md:pr-10 w-full md:w-auto">
            {/* Logo */}
            <div className="flex items-center h-9 md:h-20">
              <Image
                src="/darkLogo.svg"
                alt="techSmartHire logo"
                className="h-full w-full max-w-72"
                width={192}
                height={32}
                loading="eager"
              />
            </div>

            {/* Contact Details */}
            <div className="flex flex-col gap-3 items-start w-full md:w-auto">
              {/* Address */}
              <div className="flex gap-2 items-start">
                <Icon
                  icon="mdi:map-marker-outline"
                  className="size-4 md:size-5 text-white shrink-0 mt-0.5"
                />
                <p className="text-white text-xs md:text-sm font-normal leading-normal">
                  Pranav Business park, Kondapur, <br />
                  Hyderabad, India.
                </p>
              </div>

              {/* Phone */}
              <div className="flex gap-2 items-center">
              </div>

              {/* Email */}
              <div className="flex gap-2 items-center">
                <Icon
                  icon="mdi:email-outline"
                  className="size-4 md:size-5 text-white shrink-0"
                />
                <p className="text-white text-xs md:text-sm font-normal whitespace-nowrap">
                  info@techsmarthire.com
                </p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex gap-4 md:gap-12 justify-between items-start md:items-start pt-6 md:pt-3 w-full md:w-auto">
            {quickLinkGroups.map((group, groupIndex) => (
              <div
                key={groupIndex}
                className="flex flex-col gap-4 md:gap-3 items-start"
              >
                {group.links.map((link, index) => (
                  <Link
                    key={groupIndex + "-" + index}
                    href={link.href}
                    className="text-white text-xs md:text-sm font-normal hover:text-gray-300 transition-colors whitespace-nowrap"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4 py-3 px-4 rounded-xl w-full">
          {/* Copyright */}
          <p className="text-gray-400 text-xs sm:text-sm font-normal whitespace-nowrap">
            ©techSmartHire {new Date().getFullYear()}, All rights reserved.
          </p>

          {/* Social Media Icons */}
          <div className="flex gap-4 md:items-center">
            {socialLinks.map((social, index) => (
              <Link
                key={index}
                href={social.href}
                className="border border-gray-400 flex items-center justify-center rounded size-8 hover:border-gray-400 transition-colors"
                aria-label={social.label}
              >
                <Icon
                  icon={social.icon}
                  className="size-4 text-gray-400 hover:text-gray-300 transition-colors"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
