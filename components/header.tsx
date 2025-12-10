"use client";

import { LayoutDashboard, FileText, Briefcase } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export default function Header() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/",
      icon: "humbleicons:dashboard",
    },
    {
      label: "Assessment",
      href: "/assesments",
      icon: "mdi:help-box-multiple-outline",
    },
    {
      label: "Jobs",
      href: "/jobs",
      icon: "mingcute:briefcase-2-line",
    },
  ];

  return (
    <>
      {/* Desktop & Mobile Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-container mx-auto flex items-center justify-between px-4 md:px-6 h-16 w-full">
          {/* Logo */}
          <div className="flex items-center h-8">
            <img src="/Logo.svg" alt="techSmartHire logo" className="h-full" />
          </div>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center gap-5 h-16">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href === "/assesments" &&
                  pathname?.startsWith("/assesments"));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col h-16 items-start justify-center relative",
                    isActive && "border-b-2 border-primary-500"
                  )}
                >
                  <span
                    className={cn(
                      "text-base text-center whitespace-nowrap",
                      isActive
                        ? "text-primary-500 font-semibold"
                        : "text-gray-800 font-normal"
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Notification & Avatar */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <Button
              variant="outline"
              // className="rounded-full size-8"
              className="bg-primary-50 border border-primary-500 flex items-center justify-center rounded-full size-8 hover:bg-primary-100 transition-colors"
              aria-label="Notifications"
            >
              <Icon
                icon="material-symbols:notifications-outline-rounded"
                className="text-primary-500 size-5"
              />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="bg-gray-50 border border-zinc-300 size-8">
                  <AvatarFallback className="bg-zinc-300 text-white text-sm font-semibold">
                    TA
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation - Only visible on mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-center h-20 z-50">
        <div className="flex items-center justify-center w-full max-w-md">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/assesments" &&
                pathname?.startsWith("/assesments"));

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col gap-1 h-20 items-center justify-center w-32 group"
              >
                <div
                  className={cn(
                    "flex h-8 items-center justify-center rounded-full w-16 group-hover:bg-primary-50 transition-colors",
                    isActive && "bg-primary-50"
                  )}
                >
                  <Icon
                    className={cn(
                      "size-6 group-hover:text-primary-500 transition-colors text-gray-400",
                      isActive && "text-primary-500"
                    )}
                    icon={item.icon}
                  />
                </div>
                <span
                  className={cn(
                    "text-xs text-center whitespace-nowrap font-medium group-hover:text-black transition-colors",
                    isActive ? "text-black" : "text-gray-400"
                  )}
                >
                  {item.label === "Assessment" ? "Assessments" : item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
