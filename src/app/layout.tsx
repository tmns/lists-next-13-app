import "styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full bg-default-bg">
      <body className="h-full">{children}</body>
    </html>
  );
}
