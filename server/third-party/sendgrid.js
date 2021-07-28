import sgMail from '@sendgrid/mail';

export const sendMail = async (message) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    await sgMail.send(message);
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
};
