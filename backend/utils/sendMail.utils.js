/* eslint-disable no-undef */
const nodemailer = require('nodemailer');
const {google} = require('googleapis');


const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET =  process.env.CLIENT_SECRET;
const REFRESH_TOKEN =  process.env.REFRESH_TOKEN;
const REDIRECT_URI = process.env.REDIRECT_URI;

// create a oauth client
const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
  );
  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  // function for sending a mail to a specific user
  async function sendMail(body,subject,recipient) {
    try {
      const accessToken = await oAuth2Client.getAccessToken();
      const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAUTH2',
          user: 'yschouhan0502@gmail.com',
          clientId: CLIENT_ID,
          clientSecret: CLIENT_SECRET,
          refreshToken: REFRESH_TOKEN,
          accessToken: accessToken,
        },
      });
      const mailOptions = {
        from: 'yschouhan0502@gmail.com',
        to: recipient,
        subject: subject,
        html:body
      };
      const result = await transport.sendMail(mailOptions);
      return result;
    } catch (error) {
      return error;
    }
  }
  module.exports = {sendMail}