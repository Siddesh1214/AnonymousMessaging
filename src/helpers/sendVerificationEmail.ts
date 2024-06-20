import { render } from "@react-email/render";
import nodemailer from 'nodemailer';
import  VerificationEmail  from "../../emails/VerificationEmail";
// import  otpTemplate  from "../../emails/OtpTemplate";


import { ApiResponse } from "@/types/ApiResponse";


export async function sendVerificationEmail(email: string, username: string, verifyCode: string):Promise<ApiResponse> {
  try {

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });;


    const emailHtml = render(VerificationEmail({ username: username, otp: verifyCode }));

    const options = {
      from: 'Anonmyous Messaging',
      to: `${email}`,
      subject: 'Anonymous | Verification Code',
      html: emailHtml,
      react:VerificationEmail({ username: username, otp: verifyCode }),
    };

    

    console.log('after options');
    
    let transporterRes = await transporter.sendMail(options);


    
    // const info = await transporter.sendMail({
    //   from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
    //   to: "bar@example.com, baz@example.com", // list of receivers
    //   subject: "Hello ✔", // Subject line
    //   text: "Hello world?", // plain text body
    //   html: "<b>Hello world?</b>", // html body
    // });

    // console.log("Message sent: %s", info.messageId);
    console.log('after transporterRes',transporterRes);
    
    
    console.log('after sendMail transporter');

    return {
      success: true,
      message:'Successfully sent verification email'
    }
    
  } catch (error) {
    console.log("Error sending verification email ", error);
    return {
      success: false,
      message:'Failed to send verification email'
    }
  }  
}




