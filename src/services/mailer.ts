// do normal nodemailer setup

import nodemailer from "nodemailer";
require('dotenv').config();
const configOpt = {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
      user: process.env.MAIL_USER, 
      pass: process.env.MAIL_PASS,
  },
};
const transporter = nodemailer.createTransport(
    configOpt
  );

export async function mailOrder(subject:string,html:string,to:string){
  try{
    let info = await transporter.sendMail({
        from: configOpt.auth.user,
        to,
        subject: subject, // Subject line
        html // html body
      });
      console.log("Message sent: %s", info.messageId);    
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
  catch(err){
    console.log(err);
  }

}
async function main() {
    mailOrder("test","test",'');
}
