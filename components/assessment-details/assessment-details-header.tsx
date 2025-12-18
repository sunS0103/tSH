import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface AssessmentDetailsHeaderProps {
  assessmentTitle: string;
}

export default function AssessmentDetailsHeader({
  assessmentTitle,
}: AssessmentDetailsHeaderProps) {
  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link
                href="/assesments"
                className="text-gray-700 hover:text-black text-xs"
              >
                Assessment
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <span className="text-gray-400">/</span>
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-gray-900 text-xs font-medium">
              {assessmentTitle}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="font-bold text-gray-900 text-xl mt-4">
        {assessmentTitle}
      </h1>
      <p className="text-xs text-gray-700 mt-1">
        Evaluate your real-world QA Automation expertise in 30 minutes.
      </p>
    </>
  );
}
