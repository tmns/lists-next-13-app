import "styles/globals.css";
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-default-bg">
      <body className="h-full"><Providers>{children}</Providers></body>
    </html>
  );
}
