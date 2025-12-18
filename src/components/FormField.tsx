import { InputHTMLAttributes, ReactNode } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helpText?: ReactNode;
}

export default function FormField({ label, helpText, ...props }: Props) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      <span className="mb-1 block">{label}</span>
      <input
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base shadow-sm focus:border-blue-500 focus:outline-none"
        {...props}
      />
      {helpText && <p className="mt-1 text-xs text-slate-500">{helpText}</p>}
    </label>
  );
}
