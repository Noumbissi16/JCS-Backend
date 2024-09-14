import { mailtrapClient, sender } from "../utils/mailtrap.config";
import { PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplates";

export const sendUserWelcomeEmail = async (email: string) => {
  const recipients = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: "JCS Welcome Email",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Welcome Email",
    });
  } catch (error) {
    console.error("Error sending welcome email to user");

    throw new Error("Error sending welcome email to user");
  }
};
