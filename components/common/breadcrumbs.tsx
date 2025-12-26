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
        {routes.map((route) => (
          <BreadcrumbItem key={route.label}>
            <BreadcrumbLink href={route.href}>{route.label}</BreadcrumbLink>
          </BreadcrumbItem>
        ))}
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>{currentRoute.label}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
