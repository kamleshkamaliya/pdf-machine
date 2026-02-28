import PdfToWordClient from "./PdfToWordClient"; // Upar wali file import karein

// ✅ SEO Metadata (Google Ranking ke liye)
export const metadata = {
  title: "Free PDF to Word Converter | Convert PDF to Docx Instantly",
  description: "Convert PDF to editable Word (Docx) documents online for free. Powered by Adobe for 100% layout accuracy. Secure, fast, and no registration required.",
  keywords: [
    "pdf to word",
    "convert pdf to word",
    "pdf to docx",
    "online pdf converter",
    "free pdf to word",
    "adobe pdf converter",
    "editable word document",
    "ocr pdf to word"
  ],
  alternates: {
    canonical: "/pdf-to-word", // Aapki website ka URL
  },
  openGraph: {
    title: "Best Free PDF to Word Converter",
    description: "Convert your PDFs to editable Word files in seconds. 100% Free & Secure.",
    type: "website",
    // images: ["/og-image.jpg"], // Agar koi social media image ho to yahan lagayein
  },
};

// ✅ JSON-LD Schema (Google Rich Snippets ke liye)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "PDF to Word Converter",
  "applicationCategory": "ProductivityApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "description": "A free online tool to convert PDF files to editable Microsoft Word documents with high accuracy.",
  "featureList": "Convert PDF to DOCX, OCR Support, High Fidelity Layout Preservation"
};

export default function Page() {
  return (
    <>
      {/* Schema Script add karna zaroori hai */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PdfToWordClient />
    </>
  );
}