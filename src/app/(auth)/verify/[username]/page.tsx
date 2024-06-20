'use client';
import { useToast } from '@/components/ui/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useParams,useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from "zod";
import {
	Form,
	FormField,
	FormMessage,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";


function VerifAccount() {
  const router = useRouter();
  const params = useParams<{username:string}>();

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),

  })


  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    console.log('Data recived', data);
    setLoading(true);
    try {
      const response = await axios.post('/api/verifyOtp', {username:params.username,code:data.code});
      console.log('response', response);
      toast({
        title: 'Success',
        description: 'Your account has been verified successfully.',
      })
      setLoading(false);
      router.push('/sign-in')
    } catch (error) {
      console.log('verify otp api error', error)
      toast({
        title: 'Verification Failed',
        description:'An error occurred. Please try again.',
        variant: 'destructive',
      });
      setLoading(false);
    }
  }
  return (

    <div className="flex justify-center items-center min-h-screen bg-gray-800">
			<div className='"w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
				<div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
					</h1>
					<p className="mb-4">Enter the verification code sent to your email</p>
				</div>
        <Form {...form}>
          <form className='space-y-12' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <Input {...field} name='code'/>
                  <FormMessage/>
                </FormItem>
              )}
            />
           
            <Button type="submit" className="w-full" disabled={loading}>
								{loading ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Please wait
									</>
								) : (
									<>Verify</>
								)}
							</Button>

          </form>
        </Form>
					
			</div>
		</div>
  )
}

export default VerifAccount