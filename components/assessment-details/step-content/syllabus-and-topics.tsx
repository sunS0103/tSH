import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Icon } from "@iconify/react";

interface SyllabusAndTopicsProps {
  isConfirmed: boolean;
  onConfirmChange: (isConfirmed: boolean) => void;
  topics: { id: string; value: string }[];
}

export default function SyllabusAndTopics({
  isConfirmed,
  onConfirmChange,
  topics,
}: SyllabusAndTopicsProps) {
  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="flex gap-2">
          <Icon
            icon="material-symbols:menu-book-outline"
            className="text-primary-500 size-6"
          />
          <h1 className="text-lg font-semibold text-gray-900 mb-4">
            Syllabus and Topics Covered
          </h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {topics?.map((item) => (
            <div
              key={item.id}
              className="text-center bg-primary-50 text-primary-500 text-xs px-4 py-3 rounded-lg"
            >
              <span>{item.value}</span>
            </div>
          ))}
        </div>
        <Button variant="secondary" className="mt-3 group text-xs md:text-sm">
          <Icon
            icon="humbleicons:download-alt"
            className="text-primary-500 size-4.5 group-hover:text-white"
          />
          Download detailed list of topics assessed.
        </Button>
      </div>
      <div className="flex items-center gap-2 mt-10">
        <Checkbox
          id="syllabus-and-topics"
          checked={isConfirmed}
          onCheckedChange={(checked) => onConfirmChange(Boolean(checked))}
        />
        <Label htmlFor="syllabus-and-topics" className="inline">
          I have reviewed and understood the syllabus.
        </Label>
      </div>
    </div>
  );
}
