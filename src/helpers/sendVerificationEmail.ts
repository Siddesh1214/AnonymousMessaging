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
      // html: emailHtml,
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






// ------------------------------------
export async function sendVerificationEmail2(email: string, username: string, verifyCode: string){
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      }
    })

    let info = await transporter.sendMail({
      from:"Study Notion",
      to:`${email}`,
      subject: 'Anonymous | Verification Code',
      html: `${otpTemplate(verifyCode)}`,
      
    })

    console.log(info);
    return info;
  } catch (error) {
    console.log(error);
  }
}

// module.exports = sendVerificationEmail;




// ----------------------------------------
import { Resend } from 'resend';

export async function sendVerificationEmail1(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  const resend = new Resend('re_NxBJHsxo_TNmHWinG39Nhiin3eAgrRSLA');

  try {
    const response=await resend.emails.send({
      from: 'Anonmyous Messaging',
      to: email,
      subject: 'Mystery Message Verification Code',
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    console.log('response ', response);
    return { success: true, message: 'Verification email sent successfully.' };
  } catch (emailError) {
    console.error('Error sending verification email:', emailError);
    return { success: false, message: 'Failed to send verification email.' };
  }
}


// import nodemailer from 'nodemailer';
