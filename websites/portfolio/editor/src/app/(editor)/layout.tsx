import { ReactNode } from "react";
import Footer from "./footer";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Footer />
    </>
  );
}
