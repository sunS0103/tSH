import type { NextApiRequest, NextApiResponse } from "next";

const BREVO_API_KEY = process.env.BREVO_API_KEY!;

const LIST_MAP: Record<"candidate" | "recruiter", number> = {
  candidate: Number(process.env.BREVO_CANDIDATE_LIST_ID),
  recruiter: Number(process.env.BREVO_RECRUITER_LIST_ID),
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, role } = req.body;

  // ---- Validation (minimal but strict) ----
  if (
    !email ||
    typeof email !== "string" ||
    !/^\S+@\S+\.\S+$/.test(email)
  ) {
    return res.status(400).json({ error: "Invalid email" });
  }

  if (!role || !LIST_MAP[role]) {
    return res.status(400).json({ error: "Invalid role" });
  }

  try {
    const brevoResponse = await fetch(
      "https://api.brevo.com/v3/contacts",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": BREVO_API_KEY,
        },
        body: JSON.stringify({
          email,
          attributes: {
            FULLNAME: name || "",
            ROLE: role,
          },
          listIds: [LIST_MAP[role]],
          updateEnabled: true,
        }),
      }
    );

    if (!brevoResponse.ok) {
      const error = await brevoResponse.json();
      console.error("Brevo error:", error);
      return res.status(500).json({
        error: "Failed to join waitlist",
      });
    }

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Join waitlist error:", error);
    return res.status(500).json({
      error: "Server error",
    });
  }
}
