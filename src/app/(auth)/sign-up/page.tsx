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

function Page() {
	const [username, setUsername] = useState("");
	const [usernameMessage, setUsernameMessage] = useState("");
	const [isCheckingUsername, setIsCheckingUsername] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const debounced = useDebounceCallback(setUsername, 500);

	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<z.infer<typeof signupSchema>>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
		},
	});

	useEffect(() => {
		async function checkUniqueUN() {
			if (username) {
        setIsCheckingUsername(true);
				try {
					const response = await axios.get<ApiResponse>(
						`/api/checkUniqueUn?username=${username}`
          );
          console.log('the message is',response.data.message);
					setUsernameMessage(response.data.message);
				} catch (error) {
					// console.log("Error in checking UserName", error);
          const axiosError = error as AxiosError<ApiResponse>;
          // console.log('axiosError', axiosError);
					setUsernameMessage(
						axiosError.response?.data.message ?? "Error checking username"
					);
				} finally {
					setIsCheckingUsername(false);
				}
			}
		}
		checkUniqueUN();
	}, [username]);

	const submitSignUpForm = async (data: z.infer<typeof signupSchema>) => {
		setIsSubmitting(true);
		console.log("print ing form data", data);
		try {
			const response = await axios.post<ApiResponse>("/api/sign-up", data);
			console.log(response);
			toast({
				title: "Signup Successful",
				description: response.data.message,
			});
			router.replace(`/verify/${username}`);
			setIsSubmitting(false);
		} catch (error) {
			console.log("Signup apis response", error);
			const axiosError = error as AxiosError<ApiResponse>;
			let errorMessage = axiosError.response?.data.message;
			toast({
				title: "Error in Signup",
				description: axiosError.response?.data.message ?? "Error in Signup",
				variant: "destructive",
			});

			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-800">
			<div className='"w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
				<div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
						Join The World of Anonymous Feedback
					</h1>
					<p className="mb-4">Sign up to start your anonymous adventure</p>
				</div>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(submitSignUpForm)} className="space-y-6">
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Username</FormLabel>
										<Input
											placeholder="username"
											{...field}
											onChange={(e) => {
												field.onChange(e);
												debounced(e.target.value);
											}}
                    />
                     {isCheckingUsername && <Loader2 className="animate-spin" />}
                  {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage == 'Username is available'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
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
									<>SignUp</>
								)}
							</Button>
						</form>
					</Form>

				<div className="text-center mt-4">
					<p>
						Already a member?{" "}
						<Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
							Sign in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}

export default Page;


