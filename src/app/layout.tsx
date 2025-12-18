import "@/styles/globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Vyayam Coach",
  description: "Local fitness guidance powered by transparent calorie targets.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
