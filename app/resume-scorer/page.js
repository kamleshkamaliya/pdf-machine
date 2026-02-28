import ResumeScorerClient from "./ResumeScorerClient";

export const metadata = {
  title: "Free AI Resume Scorer - Why is your Resume Rejected? | PDF Machine",
  description: "Don't just get a score. Our AI explains strictly WHY your resume is not getting shortlisted and gives a step-by-step action plan to fix it.",
  keywords: ["ai resume checker", "ats score checker free", "resume roast", "why is my resume rejected", "free cv review"],
  alternates: {
    canonical: "/resume-scorer",
  },
  openGraph: {
    title: "Check your Resume Score with AI Logic",
    description: "Get a reality check on your resume. Find out missing skills and formatting errors instantly.",
    // images: ["/images/resume-scorer-og.jpg"], // Baad mein image daal dena
  },
};

export default function Page() {
  return <ResumeScorerClient />;
}