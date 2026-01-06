import { Icon } from "@iconify/react";

export default function NoJobFound() {
  return (
    <div className="flex flex-col items-center justify-center w-full flex-1">
      <div className="relative mb-6">
        <div className="relative">
          <Icon icon="mdi:file-document" className="w-24 h-24 text-blue-100" />
          <div className="absolute -right-2 top-0 bg-white rounded-full p-1 shadow-sm">
            <Icon
              icon="mdi:message-question-outline"
              className="w-10 h-10 text-blue-400"
            />
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">No Data Found</h3>

      <p className="text-gray-500 text-center max-w-sm text-sm">
        There are no Jobs at the moment. Please come back later.
      </p>
    </div>
  );
}
