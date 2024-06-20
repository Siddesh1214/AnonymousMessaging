import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

export async function POST(request: Request) {
	await dbConnect();
	try {
		const { verifyCode, username } = await request.json();

		const user = await UserModel.findOne({ username });
		if (!user) {
			return Response.json(
				{
					success: false,
					message: "Invalid username, no user exist",
				},
				{ status: 400 }
			);
		}

		const isCodeValid = user.verifyCode === verifyCode;
		const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

		if (isCodeValid && isCodeNotExpired) {
			user.isVerified = true;
			await user.save();

			return Response.json(
				{
					success: true,
					message: "Account verified successfully",
				},
				{ status: 200 }
			);
		} else if (!isCodeNotExpired) {
			return Response.json(
				{
					success: false,
					message:
						"Verification code expired. Please sign up again to get a new code.",
				},
				{ status: 400 }
			);
		} else {
			return Response.json(
				{
					success: false,
					message: "Error in verifying the code",
				},
				{ status: 400 }
			);
		}
	} catch (error) {
		console.log("error in verifying OTP ", error);
		return Response.json(
			{
				success: false,
				message: "Error in verifyng the verification code",
			},
			{ status: 500 }
		);
	}
}
