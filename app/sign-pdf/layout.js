// app/sign-pdf/layout.js

export const metadata = {
  title: "Sign PDF Online - Free Digital Signature Tool | PDF Machine",
  description: "Sign PDF documents online for free. Add electronic signatures, text, and stamps securely. No registration required. Easy to use and secure.",
  keywords: ["sign pdf", "digital signature", "electronic signature", "free pdf signer", "online pdf tools"],
  openGraph: {
    title: "Sign PDF Online | PDF Machine",
    description: "Securely sign your PDF documents in your browser.",
    type: "website",
    url: "https://yourdomain.com/sign-pdf", // Apni URL daal dena
  },
};

export default function SignPDFLayout({ children }) {
  return <>{children}</>;
}