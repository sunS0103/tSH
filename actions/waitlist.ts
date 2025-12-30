export async function joinWaitlistAction(data: {
  email: string;
  name: string;
  role: "candidate" | "recruiter";
  company?: string;
}) {
  const apiKey = process.env.NEXT_PUBLIC_BREVO_API_KEY;

  console.log("Brevo API Key:", apiKey);

  if (!apiKey) {
    return { success: false, error: "Configuration error: API Key missing." };
  }

  // Determine list ID based on role
  const listId = data.role === "candidate" ? 23 : 24;

  try {
    // Step 1: Check if contact already exists
    const checkResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BREVO_API_URL}/contacts/${encodeURIComponent(data.email)}`,
      {
        method: "GET",
        headers: {
          "api-key": apiKey,
        },
      }
    );

    const isExisting = checkResponse.ok;

    // Step 2: Import/Update the contact
    const response = await fetch(`${process.env.NEXT_PUBLIC_BREVO_API_URL}/contacts/import`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        jsonBody: [
          {
            email: data.email,
            attributes: {
              FIRSTNAME: data.name,
              ROLE: data.role.toUpperCase(),
              COMPANY_NAME: data.company || "",
            },
          },
        ],
        listIds: [listId],
      }),
    });

    const result = await response.json();

    // Handle successful import
    if (response.ok) {
      return {
        success: true,
        isExisting,
      };
    }

    // Handle API Errors
    console.error("Brevo API Error:", result);
    return {
      success: false,
      error: result.message || "Failed to join the waitlist.",
    };
  } catch (err: any) {
    console.error("Brevo Server Action Error:", err);
    return {
      success: false,
      error: "Network error. Please check your connection.",
    };
  }
}