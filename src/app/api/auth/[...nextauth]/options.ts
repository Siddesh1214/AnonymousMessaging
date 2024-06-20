import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "text"},
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials:any):Promise<any> {
        await dbConnect();

        try {
          const user=await UserModel.findOne({
            $or: [
              {email:credentials.identifier},
              {username:credentials.identifier}
            ]
          })

          if (!user) {
            throw new Error("No user found with email");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your account");
          }
          
          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
          if (isPasswordCorrect) {
            return user;
          } else {
            throw new Error("Incorrect Password");
          }
        } catch (err:any) {
          console.error('Error in authorize:', err);
          throw new Error(err.message || 'Error in authorize');
        }
      }
    })
  ],

  callbacks:{
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString()
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session
    }
  },
  session: {
    strategy:"jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn:'/sign-in'
  },
}


console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET);
