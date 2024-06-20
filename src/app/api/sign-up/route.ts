import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcrypt"

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";



export async function POST(request: Request) {
  await dbConnect();
  console.log('after db connect');

  try {
    const { email, password, username } = await request.json();

    const existingUserByUN = await UserModel.findOne({ username, isVerified: true });
    if (existingUserByUN) {
      return Response.json({
        success:false,
        message: "Username is already taken",
      },
      {status: 400})
    }

    

    const existingUserByEmail = await UserModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();


    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json({
          success: false,
          message: "User already exist with this email",
        },
        { status: 400, })
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
    
      // const newUser = await UserModel.create({
      //   username,
      //   email,
      //   password: hashedPassword,
      //   verifyCode,
      //   verifyCodeExpiry:expiryDate,
      //   isVerified: false,
      //   isAcceptingMessage: true,
      //   messages:[],
      // })

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry:expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages:[],
      })

      console.log('newUser ',newUser)
      await newUser.save();

    }

    //send verif email
    const emailResponse = await sendVerificationEmail(email, username, verifyCode);
    console.log("emailResponse is --- ", emailResponse);
    
    return Response.json({
      success: true,
      message: "User Registration Success",
    },
    { status: 201, })
    
  } catch (error) {
    console.log('Error registering user ', error);
    return Response.json({
      success: false,
      message: 'Error registering user',
    },
    {
      status:500,
    }
    )
  }
}