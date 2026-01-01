// lib/numeric-input-utils.ts

import { ChangeEvent, KeyboardEvent, ClipboardEvent } from "react";

export interface NumericInputHandlers {
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onPaste?: (e: ClipboardEvent<HTMLInputElement>) => void;
}

export function createNumericInputHandlers(
  fieldOnChange: (value: number | null) => void,
  options?: {
    allowDecimal?: boolean;
    maxLength?: number;
    min?: number;
    max?: number;
  }
): NumericInputHandlers {
  const { allowDecimal = false, maxLength, min, max } = options || {};

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    let numericValue = e.target.value.replace(
      allowDecimal ? /[^\d.]/g : /\D/g,
      ""
    );

    // Handle decimal point (only one allowed)
    if (allowDecimal) {
      const parts = numericValue.split(".");
      if (parts.length > 2) {
        numericValue = parts[0] + "." + parts.slice(1).join("");
      }
    }

    // Apply max length
    if (maxLength && numericValue.length > maxLength) {
      numericValue = numericValue.substring(0, maxLength);
    }

    // Apply min/max constraints
    const numValue =
      numericValue === ""
        ? null
        : allowDecimal
        ? parseFloat(numericValue)
        : Number(numericValue);
    if (numValue !== null) {
      if (min !== undefined && numValue < min) {
        numericValue = min.toString();
      }
      if (max !== undefined && numValue > max) {
        numericValue = max.toString();
      }
    }

    e.target.value = numericValue;
    fieldOnChange(
      numericValue === ""
        ? null
        : allowDecimal
        ? parseFloat(numericValue)
        : Number(numericValue)
    );
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Allow: backspace, delete, tab, escape, enter, and arrow keys
    if (
      [8, 9, 27, 13, 46, 37, 38, 39, 40, 35, 36].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.ctrlKey && [65, 67, 86, 88].indexOf(e.keyCode) !== -1)
    ) {
      return;
    }

    // Allow decimal point if allowed
    if (allowDecimal && (e.keyCode === 190 || e.keyCode === 110)) {
      const input = e.target as HTMLInputElement;
      if (input.value.includes(".")) {
        e.preventDefault();
      }
      return;
    }

    // Ensure that it is a number and stop the keypress
    if (
      (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    let numericValue = pastedText.replace(allowDecimal ? /[^\d.]/g : /\D/g, "");

    if (allowDecimal) {
      const parts = numericValue.split(".");
      if (parts.length > 2) {
        numericValue = parts[0] + "." + parts.slice(1).join("");
      }
    }

    if (maxLength && numericValue.length > maxLength) {
      numericValue = numericValue.substring(0, maxLength);
    }

    const input = e.target as HTMLInputElement;
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const currentValue = input.value;
    const newValue =
      currentValue.substring(0, start) +
      numericValue +
      currentValue.substring(end);
    const finalValue = allowDecimal
      ? newValue
          .replace(/[^\d.]/g, "")
          .split(".")
          .slice(0, 2)
          .join(".")
      : newValue.replace(/\D/g, "");

    input.value = finalValue;
    const numValue =
      finalValue === ""
        ? null
        : allowDecimal
        ? parseFloat(finalValue)
        : Number(finalValue);
    fieldOnChange(numValue);
  };

  return { onChange, onKeyDown, onPaste };
}
