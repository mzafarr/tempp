import nodemailer from "nodemailer";

import { env } from "@/env";
import { ReactNode } from "react";

const transporter = nodemailer.createTransport({
  //@ts-ignore
  service: "gmail",
  host: env.EMAIL_SERVER_HOST!,
  port: env.EMAIL_SERVER_PORT!,
  secure: true,
  auth: {
    user: env.EMAIL_SERVER_USER!,
    pass: env.EMAIL_SERVER_PASSWORD!,
  },
});

export async function sendEmail(
  email: string,
  subject: string,
  body: ReactNode
) {
  const { rejected } = await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: email,
    subject,
    html: `${body}`,
  });

  if (rejected) {
    throw rejected;
  }
}

// TODO: implement me
// export async function batchSendEmails(
//   emails: {
//     to: string;
//     subject: string;
//     body: ReactNode;
//   }[]
// ) {
//   const { error } = await resend.batch.send(
//     emails.map((email) => ({
//       from: EMAIL_FROM,
//       to: email.to,
//       subject: email.subject,
//       react: email.body,
//     })
//   );
//   if (error) {
//     throw error;
//   }
// }
