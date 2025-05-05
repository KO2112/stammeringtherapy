"use server"
import { Resend } from "resend"

// Initialize Resend with your API key from environment variable
const resend = new Resend(process.env.RESEND_API_KEY)

interface SupportEmailProps {
  name: string
  email: string
  category: string
  message: string
}

export async function sendSupportEmail({ name, email, category, message }: SupportEmailProps) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Support <onboarding@resend.dev>",
      to: ["info@stammeringtherapy.com"],
      replyTo: email,
      subject: `Support Request: ${getCategoryLabel(category)} from ${name}`,
      text: `
Name: ${name}
Email: ${email}
Category: ${getCategoryLabel(category)}

Message:
${message}
      `,
      html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #0d9488; margin-bottom: 24px;">New Support Request</h2>
  
  <div style="margin-bottom: 24px; padding: 20px; background-color: #f8fafc; border-radius: 8px;">
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Category:</strong> ${getCategoryLabel(category)}</p>
  </div>
  
  <div style="margin-bottom: 24px;">
    <h3 style="color: #334155; margin-bottom: 12px;">Message:</h3>
    <p style="white-space: pre-wrap; color: #334155;">${message}</p>
  </div>
  
  <div style="font-size: 14px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 12px;">
    <p>This email was sent from the Stammering Therapy support form.</p>
  </div>
</div>
      `,
    })

    if (error) {
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error("Error sending support email:", error)
    throw error
  }
}

function getCategoryLabel(categoryId: string): string {
  const categories: Record<string, string> = {
    technical: "Technical Issue",
    account: "Account Help",
    billing: "Billing Question",
    feature: "Feature Request",
    feedback: "General Feedback",
  }

  return categories[categoryId] || categoryId
}
