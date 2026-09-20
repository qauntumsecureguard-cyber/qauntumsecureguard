import * as React from "react";
import {
  PhoneInput as InternationalPhoneInput,
  type PhoneInputProps as InternationalPhoneInputProps,
} from "react-international-phone";
import "react-international-phone/style.css";

interface PhoneInputProps
  extends Omit<InternationalPhoneInputProps, "value" | "onChange"> {
  id?: string;
  value: string;
  onChange: (value: string) => void;
}

function PhoneInput({ id, value, onChange, className, ...props }: PhoneInputProps) {
  return (
    <InternationalPhoneInput
      {...props}
      value={value}
      onChange={(phone) => onChange(phone)}
      defaultCountry="us"
      className={className}
      inputProps={{ id }}
      inputClassName="!h-12 !w-full !border-0 !bg-transparent !px-3 !text-sm !text-black !shadow-none !outline-none"
      countrySelectorStyleProps={{
        buttonClassName:
          "!h-12 !border-0 !border-r !border-gray-200 !bg-gray-50 !px-3",
        dropdownStyleProps: {
          className: "!z-50",
        },
      }}
      style={{
        width: "100%",
        border: "2px solid rgb(229 231 235)",
        borderRadius: "0.75rem",
        background: "white",
      }}
    />
  );
}

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };
