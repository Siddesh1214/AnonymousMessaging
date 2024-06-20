"use client";
import { useDebugValue, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signupSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
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
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";
import { Result } from "postcss";

function Page() {

	const [isSubmitting, setIsSubmitting] = useState(false);

	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			identifier: "",
			password: "",
		},
	});

	

	const submitSignUpForm = async (data: z.infer<typeof signInSchema>) => {
		setIsSubmitting(true);
		console.log("print ing form data", data);
    const result=await signIn('credentials', {
      redirect:false,
      identifier: data.identifier,
      password:data.password
    })
    console.log(result);

    if (result?.error) {
      toast({
        title: "Error signing in",
        description: result?.error,
        variant:'destructive'
      })
    }
    setIsSubmitting(false);
    if(result?.url){
      router.replace('/dashboard')
    }
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-800">
			<div className='"w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
				<div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
						Join The World of Anonymous Feedback
					</h1>
					<p className="mb-4">Sign in to start your anonymous adventure</p>
				</div>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(submitSignUpForm)} className="space-y-6">
							<FormField
								control={form.control}
								name="identifier"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<Input placeholder="email" {...field} name="email" />
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
              name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<Input type="password" placeholder="password" {...field} name="password" />
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" className="w-full" disabled={isSubmitting}>
								{isSubmitting ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Please wait
									</>
								) : (
									<>SignIn</>
								)}
							</Button>
						</form>
					</Form>

				<div className="text-center mt-4">
					<p>
						New to platform ?{" "}
						<Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
							Sign Up
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}

export default Page;


