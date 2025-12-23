import { InputHTMLAttributes, ReactNode } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helpText?: ReactNode;
}

export default function FormField({ label, helpText, ...props }: Props) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#1F2A33]">{label}</span>
      <input
        className="w-full rounded-xl border border-[#E6ECF2] px-4 py-3 text-base bg-white text-[#1F2A33] placeholder:text-[#9AAEC1] focus:border-[#6E8BA5] focus:outline-none focus:ring-2 focus:ring-[#6E8BA5]/20 transition-all"
        {...props}
      />
      {helpText && <p className="mt-2 text-xs text-[#6B7C8F]">{helpText}</p>}
    </label>
  );
}
