import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("🔹 Sending Data to HubSpot:", body); // Log 1: Frontend se kya aaya?

    const { name, email, type, message } = body;

    // HubSpot Config
    const PORTAL_ID = '22779655'; 
    const FORM_GUID = '0ae71fcc-f5e4-4513-9575-4b46432d9596';

    const hubSpotData = {
      fields: [
        { name: 'email', value: email },
        { name: 'firstname', value: name },
        { name: 'what_is_this_about', value: type }, // Ye value Dropdown se exact match honi chahiye
        { name: 'message', value: message }
      ],
      context: {
        pageUri: 'https://pdfmachine.pro/contact',
        pageName: 'Contact Page'
      }
    };

    // Send Request
    const response = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${PORTAL_ID}/${FORM_GUID}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(hubSpotData),
      }
    );

    const result = await response.json();
    
    // Log 2: HubSpot ne kya jawab diya?
    console.log("🔸 HubSpot Response:", JSON.stringify(result, null, 2));

    if (!response.ok) {
      return NextResponse.json({ success: false, error: result.errors?.[0]?.message || "HubSpot Error" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Success" });

  } catch (error) {
    console.error("❌ Server Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}