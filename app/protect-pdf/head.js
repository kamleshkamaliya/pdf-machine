export default function Head() {
  const url = "https://pdfmachine.pro/protect-pdf";

  return (
    <>
      <title>Protect PDF Online (AES-256) - Add Password Free | PDF Machine</title>
      <meta
        name="description"
        content="Protect your PDF with a password using AES-256 encryption. Fast, secure, and free. No registration required."
      />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content="Protect PDF Online (AES-256) - PDF Machine" />
      <meta
        property="og:description"
        content="Lock your PDF with a password instantly. AES-256 encryption. Secure processing. Auto delete."
      />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="PDF Machine" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Protect PDF Online (AES-256) - PDF Machine" />
      <meta
        name="twitter:description"
        content="Password protect your PDF in seconds. AES-256 encryption."
      />
    </>
  );
}
