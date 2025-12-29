"use server";

export async function joinWaitlistAction(data: {
  email: string;
  name: string;
  role: "candidate" | "recruiter";
  company?: string;
}) {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    return { success: false, error: "Configuration error: API Key missing." };
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        email: data.email,
        attributes: {
          FIRSTNAME: data.name,
          ROLE: data.role.toUpperCase(),
          COMPANY_NAME: data.company || "",
        },
        listIds: [data.role === "candidate" ? 23 : 24],
        updateEnabled: true,
      }),
    });

    // Handle 204 No Content (Update successful)
    if (response.status === 204) {
      return { success: true, message: "Welcome back! Your info is updated." };
    }

    const result = await response.json();

    // Handle 201 Created (New contact)
    if (response.ok) {
      return { success: true };
    }

    // Handle API Errors (e.g., 400 Bad Request)
    return { 
      success: false, 
      error: result.message || "Failed to join the waitlist." 
    };

  } catch (err: any) {
    console.error("Brevo Server Action Error:", err);
    return { success: false, error: "Network error. Please check your connection." };
  }
}