"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Button } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  deleteCookie,
  getCookie,
  getCookies,
  setCookie,
} from "cookies-next/client";
import { toast } from "sonner";
import { getCandidateProfile, getRecruiterProfile } from "@/api/profile";
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import Image from "next/image";

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

const HIDE_HEADER_ROUTES = ["/authentication"];

function shouldHideHeader(pathname: string | null): boolean {
  if (!pathname) return false;

  return HIDE_HEADER_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}
// Routes where bottom navigation should be visible
// Supports exact routes (e.g., "/") and route patterns (e.g., "/assessments/*")
const BOTTOM_NAV_VISIBLE_ROUTES: string[] = [
  "/",
  "/talent-pool",
  "/assessments",
  "/jobs",
];

/**
 * Checks if the current pathname matches any route in the visible routes array
 * Supports exact matches and wildcard patterns (e.g., "/route/*")
 */
const BOTTOM_NAV_VISIBLE_ROUTES_BY_ROLE: Record<string, string[]> = {
  RECRUITER: ["/dashboard", "/talent-pool", "/assessments", "/jobs", "/jobs/*"],
  CANDIDATE: ["/dashboard", "/assessments", "/jobs", "/jobs/*"],
};

function shouldShowBottomNav(pathname: string | null, role?: string): boolean {
  if (!pathname || !role) return false;

  return BOTTOM_NAV_VISIBLE_ROUTES_BY_ROLE[role]?.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

const NAV_CONFIG: Record<string, NavItem[]> = {
  RECRUITER: [
    { label: "Dashboard", href: "/dashboard", icon: "humbleicons:dashboard" },
    {
      label: "Talent Pool",
      href: "/talent-pool",
      icon: "mdi:lightbulb-variant-outline",
    },
    { label: "Jobs", href: "/jobs", icon: "mingcute:briefcase-2-line" },
    {
      label: "Assessments",
      href: "/assessments",
      icon: "mdi:help-box-multiple-outline",
    },
    {
      label: "Credits",
      href: "/credits",
      icon: "mdi:coin-outline",
    },
  ],
  CANDIDATE: [
    { label: "Dashboard", href: "/dashboard", icon: "humbleicons:dashboard" },
    {
      label: "Assessment",
      href: "/assessments",
      icon: "mdi:help-box-multiple-outline",
    },
    { label: "Jobs", href: "/jobs", icon: "mingcute:briefcase-2-line" },
  ],
};

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | undefined>(undefined);
  const [userDetails, setUserDetails] = useState();
  // Track mounted state to prevent hydration mismatch
  // This is necessary because getCookie is client-only and causes SSR/client mismatch
  const [mounted, setMounted] = useState(false);

  // Initialize role and mounted state on client side only
  // This prevents hydration mismatch by ensuring server and client render the same initial state
  // Note: Setting state in useEffect is necessary here to prevent SSR/client mismatch
  // This is a standard Next.js pattern for client-only values (like cookies)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const userRole = getCookie("user_role");
    setRole(userRole as string | undefined);
  }, []);

  useEffect(() => {
    // Only call getUserDetails if role is present
    const fetchUserDetails = async () => {
      if (role === "CANDIDATE") {
        await getCandidateProfile().then((res) => {
          setUserDetails(res.data);
          setCookie("profile_data", JSON.stringify(res.data));
        });
      }
      if (role === "RECRUITER") {
        await getRecruiterProfile().then((res) => {
          setUserDetails(res.data);
          setCookie("profile_data", JSON.stringify(res.data));
        });
      }
    };
    if (role) {
      fetchUserDetails();
    }
  }, [role]);

  if (shouldHideHeader(pathname)) {
    return null;
  }

  // Prevent hydration mismatch by not rendering nav items until mounted
  const navItems: NavItem[] =
    mounted && role && NAV_CONFIG[role as keyof typeof NAV_CONFIG]
      ? NAV_CONFIG[role as keyof typeof NAV_CONFIG]
      : [];

  return (
    <>
      {/* Desktop & Mobile Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-container mx-auto flex items-center justify-between px-4 md:px-6 h-16 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center h-8 cursor-pointer">
            <Image
              src="/Logo.svg"
              alt="techSmartHire logo"
              className="h-full w-36"
              width={120}
              height={40}
            />
          </Link>

          {/* Desktop Navigation - Hidden on mobile */}
          <nav className="hidden md:flex items-center gap-5 h-16">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname?.startsWith(`${item.href}/`));

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

          <div className="flex items-center gap-3">
            {role === "RECRUITER" && (
              <>
                <Button
                  variant="outline"
                  className="md:hidden bg-primary-50 border border-primary-500 flex items-center justify-center rounded-full size-8 hover:bg-primary-100 transition-colors p-0"
                  onClick={() => router.push("/jobs/create")}
                >
                  <Icon icon="mdi:plus" className="text-primary-500 size-5" />
                </Button>
                <Button
                  className="hidden md:flex bg-primary-500 hover:bg-primary-600 text-white rounded-full px-4 h-9 text-sm font-medium gap-0"
                  onClick={() => router.push("/jobs/create")}
                >
                  <Icon icon="mdi:plus" className="mr-2 size-4" />
                  Create Job
                </Button>
              </>
            )}
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

            <Logout data={userDetails} />
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation - Only visible on mobile and configured routes */}
      {mounted && shouldShowBottomNav(pathname, role as string) && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex items-center justify-center h-20 z-50">
          <div className="flex items-center justify-center w-full max-w-md">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname?.startsWith(`${item.href}/`));

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
      )}
    </>
  );
}

function Logout({
  data,
}: {
  data?: {
    account_type: string;
    country_code: string;
    date_of_birth: number;
    email: string;
    first_name: string;
    gender: string;
    last_name: string;
    mobile_number: string;
  };
}) {
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label="User account menu"
            className="focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-full"
          >
            <Avatar className="border border-primary size-8 cursor-pointer">
              <AvatarFallback className="bg-primary-50 text-primary text-sm font-semibold">
                {data && data.first_name && data.last_name ? (
                  `${data.first_name.charAt(0).toUpperCase()}${data.last_name
                    .charAt(0)
                    .toUpperCase()}`
                ) : (
                  <Icon
                    icon="material-symbols:person-outline-rounded"
                    className="size-4 text-inherit!"
                  />
                )}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-0 divide-y divide-gray-200">
          <DropdownMenuItem
            className="cursor-pointer rounded-b-none"
            onClick={() => {
              router.push("/profile");
            }}
          >
            <Icon
              icon="material-symbols:person-outline-rounded"
              className="size-4 text-inherit!"
            />
            My Profile
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer rounded-b-none"
            onClick={() => {
              router.push("/settings");
            }}
          >
            <Icon
              icon="material-symbols:settings-outline-rounded"
              className="size-4 text-inherit!"
            />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-red-500 hover:text-red-500!"
            onSelect={(e) => {
              e.preventDefault();
              setOpen(true);
            }}
          >
            <div className="flex gap-2 items-center cursor-pointer text-red-500 hover:text-red-500!">
              <Icon
                icon="material-symbols:logout-rounded"
                className="size-4 text-inherit!"
              />
              Logout
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-6 max-w-100!">
          <>
            <div className="flex flex-col items-center gap-2">
              <h6 className="text-base md:text-lg font-semibold">
                Are you sure?
              </h6>
              <p className="text-gray-700 text-xs text-center">
                You’re about to log out of your account. Any unsaved changes
                <br />
                may be lost. Do you still want to continue?
              </p>
            </div>

            <div className="flex justify-end w-full items-center gap-3">
              <Button
                variant="secondary"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Go Back
              </Button>

              <Button
                onClick={() => {
                  const cookies = getCookies?.();
                  if (
                    cookies &&
                    typeof cookies === "object" &&
                    cookies !== null
                  ) {
                    Object.keys(cookies).forEach((key: string) => {
                      deleteCookie(key);
                    });
                  }
                  toast.success("Logged out successfully");
                  router.refresh();
                }}
              >
                Logout
              </Button>
            </div>
          </>
        </DialogContent>
      </Dialog>
    </>
  );
}
