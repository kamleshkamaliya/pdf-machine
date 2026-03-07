import ChatPDFClient from "./ChatPDFClient"; // Aapke client component ka path

export const metadata = {
  title: "Chat with PDF Online - Free AI PDF Assistant | PDF Machine",
  description: "Upload your PDF and instantly ask questions, extract summaries, and find exact data points using our free AI assistant. No registration required.",
  keywords: "Chat PDF, AI PDF Chatbot, PDF Assistant, Read PDF with AI, Summarize PDF, PDF Machine",
  openGraph: {
    title: "Chat with PDF Online - Free AI PDF Assistant",
    description: "Upload your PDF and chat with it instantly using AI.",
    url: "https://pdfmachine.pro/chat-pdf",
    siteName: "PDF Machine",
    images: [
      {
        url: "https://pdfmachine.pro/images/chat-pdf-og.webp", // Apna OG image path dalein
        width: 1200,
        height: 630,
        alt: "Chat with PDF using AI",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function ChatPDFPage() {
  return <ChatPDFClient />;
}