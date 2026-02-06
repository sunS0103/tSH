// components/ui/numeric-input.tsx

"use client";

import { Input } from "@/components/ui/input";
import { createNumericInputHandlers } from "@/lib/numeric-inputs";
import { InputHTMLAttributes } from "react";

interface NumericInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "onChange" | "onKeyDown" | "onPaste" | "value"
  > {
  value: number | null | undefined;
  onValueChange: (value: number | null) => void;
  allowDecimal?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  className?: string;
  placeholder?: string;
}

export function NumericInput({
  value,
  onValueChange,
  allowDecimal = false,
  maxLength,
  min,
  max,
  className,
  placeholder,
  ...props
}: NumericInputProps) {
  const handlers = createNumericInputHandlers(onValueChange, {
    allowDecimal,
    maxLength,
    min,
    max,
  });

  return (
    <Input
      type="text"
      value={value || ""}
      className={className}
      placeholder={placeholder}
      onChange={handlers.onChange}
      onKeyDown={handlers.onKeyDown}
      onPaste={handlers.onPaste}
      {...props}
    />
  );
}
