export const metadata = {
  // Yahan maine title update kar diya hai
  title: "Word to PDF Converter | PDF Machine",
  description: "Convert Word documents (DOC, DOCX) to PDF instantly. Preserve original formatting, fonts, and images. Free, secure, and no registration required.",
  keywords: "word to pdf, doc to pdf, docx to pdf, convert word to pdf, free pdf converter, PDF Machine",
};

// Ye part zaroori hai (Iske bina error aata hai "Not a React Component")
export default function Layout({ children }) {
  return (
    <>
      {children}
    </>
  );
}