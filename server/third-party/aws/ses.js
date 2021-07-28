import AWS from 'aws-sdk';

const sesInstance = new AWS.SES({
  region: 'us-east-1'
});

export const createTemplate = ({
  templateName,
  htmlPart,
  subjectPart,
  textPart
}) =>
  new Promise((resolve, reject) => {
    const params = {
      Template: {
        TemplateName: templateName,
        HtmlPart: htmlPart,
        SubjectPart: subjectPart,
        TextPart: textPart
      }
    };

    sesInstance.createTemplate(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

export const sendTemplatedEmail = ({
  templateName,
  fromEmail,
  toEmails,
  templateData,
  bccAddress,
  fromName,
  replyToAddresses
}) =>
  new Promise((resolve, reject) => {
    const params = {
      Destination: {
        ToAddresses: toEmails
      },
      Source: fromEmail,
      Template: templateName,
      TemplateData: JSON.stringify(templateData)
    };

    if (bccAddress) {
      params.Destination.BccAddress = [bccAddress];
    }

    if (fromName) {
      params.Source = `${fromName} <${fromEmail}>`;
    }

    if (replyToAddresses) {
      params.ReplyToAddresses = replyToAddresses;
    }

    sesInstance.sendTemplatedEmail(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

export const sendEmail = ({
  fromEmail,
  toEmails,
  bccAddress,
  fromName,
  replyToAddresses,
  html,
  text,
  subject
}) =>
  new Promise((resolve, reject) => {
    const params = {
      Destination: {
        ToAddresses: toEmails
      },
      Source: fromEmail,
      Message: {
        Subject: {
          Data: subject,
          Charset: 'UTF-8'
        }
      }
    };

    if (bccAddress) {
      params.Destination.BccAddress = [bccAddress];
    }

    if (fromName) {
      params.Source = `${fromName} <${fromEmail}>`;
    }

    if (replyToAddresses) {
      params.ReplyToAddresses = replyToAddresses;
    }

    params.Message.Body = {};

    if (html) {
      params.Message.Body.Html = {
        Data: html,
        Charset: 'UTF-8'
      };
    } else if (text) {
      params.Message.Body.Text = {
        Data: text,
        Charset: 'UTF-8'
      };
    }

    sesInstance.sendEmail(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
