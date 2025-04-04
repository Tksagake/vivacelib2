import nodemailer from "nodemailer";
import { emailTemplates } from "./emailTemplates";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // e.g., smtp.gmail.com
  port: 587, // Use 465 for SSL, 587 for TLS
  secure: false, // true for port 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

const sendEmail = async ({ to, subject, html }: EmailParams) => {
  try {
    const info = await transporter.sendMail({
      from: '"Farova Welfare" <malcolmsikolia@gmail.com>',
      to,
      subject,
      html,
    });
    console.log(`📧 Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw new Error("Email sending failed");
  }
};

// Loan Application Email
export const sendLoanApplicationEmail = async (to: string, loanId: string) => {
  return sendEmail({
    to,
    subject: "🎉 Loan Application Received - Farova Welfare",
    html: emailTemplates.loanApplication(loanId),
  });
};

// Loan Approval Email
export const sendLoanApprovalEmail = async (to: string, loanId: string) => {
  return sendEmail({
    to,
    subject: "✅ Loan Approved - Farova Welfare",
    html: emailTemplates.loanApproval(loanId),
  });
};

// Loan Rejection Email
export const sendLoanRejectionEmail = async (to: string, loanId: string) => {
  return sendEmail({
    to,
    subject: "❌ Loan Declined - Farova Welfare",
    html: emailTemplates.loanRejection(loanId),
  });
};

// Loan Disbursement Email
export const sendDisbursementEmail = async (to: string) => {
  return sendEmail({
    to,
    subject: "💸 Loan Disbursed - Farova Welfare",
    html: emailTemplates.disbursement(),
  });
};

// Payment Received Email
export const sendPaymentReceivedEmail = async (to: string, amount: number) => {
  return sendEmail({
    to,
    subject: "✅ Payment Received - Farova Welfare",
    html: emailTemplates.paymentReceived(amount),
  });
};

// Custom Admin Email
export const sendCustomEmail = async (to: string, subject: string, html: string) => {
  return sendEmail({
    to,
    subject,
    html,
  });
};
