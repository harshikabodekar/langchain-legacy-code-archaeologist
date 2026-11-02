import "./globals.css";

export const metadata = {
  title: "LeadDesk",
  description: "A small lead-capture tool with a public form and an admin dashboard.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
