import UnlockPDFClient from "./UnlockPDFClient";

export const metadata = {
  title: "Unlock PDF Online - Remove Password Protection | PDF Machine",
  description: "Instantly remove passwords and restrictions from your PDF files. 100% secure, fast, and easy to use online PDF decrypter tool. No installation required.",
  keywords: ["unlock pdf", "remove pdf password", "decrypt pdf", "pdf password remover online", "free pdf unlocker"],
  alternates: {
    canonical: "/unlock-pdf",
  },
  openGraph: {
    title: "Unlock PDF Online - Remove Password Protection",
    description: "Forget your PDF password? Use PDF Machine to instantly remove encryption and restrictions securely.",
    url: "/unlock-pdf",
    siteName: "PDF Machine",
    locale: "en_US",
    type: "website",
  },
};

export default function Page() {
  return <UnlockPDFClient />;
}