"use client"
import { Button } from '@/components/ui/button'
import { Form, FormField, FormItem,FormLabel,FormControl,FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { messageSchema } from '@/schemas/messageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';


function Page() {

  const params = useParams<{username:string}>();
  const username=params.username
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver:zodResolver(messageSchema),
  })
  
  const messageContent = form.watch('content');
  
  const handleMessageClick = (message: string) => {
    form.setValue('content',message)
  }


  const submitMessage = async(data:z.infer<typeof messageSchema>) => {
    // setLoading(true);
    setLoading(true);
    console.log(data);
    try {
      const response = await axios.post<ApiResponse>('/api/sendMessages', { data,username });
      console.log(response)
      toast({
        title: response.data.message,
        variant:'default'
      })
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to sent message',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }

  }
  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form action="" onSubmit={form.handleSubmit(submitMessage)} className="space-y-6 mb-6">
          <FormField
            control={form.control}
            name='content'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          >
          </FormField>
          <div className='flex justify-center'>
            {
              loading ? (
                <Button disabled>
                  <Loader2  className="mr-2 h-4 w-4 animate-spin"/> Please wait
                </Button>
              ) : (
                  <Button type='submit' disabled={loading || !messageContent}>Send It</Button>
              )
            }
          </div>
        </form>
      </Form>

    </div>
  )
}

export default Page