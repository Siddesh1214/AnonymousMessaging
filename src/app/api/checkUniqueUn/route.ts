import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { usernameValidation } from '@/schemas/signUpSchema';
import { z } from 'zod';


const userNameQuerySchema = z.object({
  username:usernameValidation,
})


export async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    console.log('serachParams', searchParams);
    const queryParam = {
      username: searchParams.get('username')
    }

    //zod vaildation
    const result = userNameQuerySchema.safeParse(queryParam);

    console.log(result);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];


      return Response.json({
        success: false,
        message:usernameErrors?.length > 0
              ? usernameErrors.join(', ')
              : 'Invalid query parameters',
      },{status:400})
    }

    const { username } = result.data;
    const existingUser = await UserModel.findOne({ username, isVerified: true });
    if (existingUser) {
      return Response.json({
        success: false,
        message:'Username is already taken '
      },{status:200})
    }


    return Response.json({
      success: true,
      message:'Username is available '
    },{status:200})

  } catch (error) {
    console.log('Error in checking Username',error);
    return Response.json({
      success: false,
      message:"Error checking username"
    },{status:500})
  }
}

