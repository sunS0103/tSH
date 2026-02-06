import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

interface BreadcrumbsProps {
  routes: {
    label: string;
    href: string;
  }[];
  currentRoute: {
    label: string;
    href?: string;
  };
}

export default function Breadcrumbs({
  routes,
  currentRoute,
}: BreadcrumbsProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList className="sm:gap-1.5">
        {routes.map((route, index) => (
          <React.Fragment key={route.label}>
            <BreadcrumbItem>
              <BreadcrumbLink href={route.href}>{route.label}</BreadcrumbLink>
            </BreadcrumbItem>
            {index < routes.length - 1 && (
              <BreadcrumbSeparator>/</BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
        {routes.length > 0 && <BreadcrumbSeparator>/</BreadcrumbSeparator>}
        <BreadcrumbItem>
          <BreadcrumbPage>{currentRoute.label}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
