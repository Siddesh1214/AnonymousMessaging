'use client'
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/User'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form';


function Page() {

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  }

  const { data: session } = useSession();

  const form = useForm({
    resolver:zodResolver(acceptMessageSchema)
  })

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/acceptMessages');
      setValue('acceptMessages', response.data.isAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message || 'Failed to fetch message settings',
        variant:'destructive'
      })
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(async(refresh :boolean=false) => {
    setIsLoading(true);
    setIsSwitchLoading(false);

    try {
      const response = await axios.get<ApiResponse>('/api/getMessages');
      console.log('response', response);
      setMessages(response.data.messages || []);

      if (refresh) {
        
        
        
        
      }
    } catch (error) {
      
    }
  },[])
  
  return (
    <div>page</div>
  )
}

export default Page;