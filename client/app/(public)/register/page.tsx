"use client"


import { useSignupMutation } from '@/redux/apis/auth.api'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import z from 'zod'

const Register = () => {
    const router = useRouter()
    const [signup] = useSignupMutation()

  const registerSchema = z.object({
          name: z.string().min(1),
          email: z.string().min(1),
          password: z.string().min(1),

      })
      type registerType = z.infer<typeof registerSchema>
  
      const { reset, register,  handleSubmit, formState: {errors} } = useForm<registerType>({
          defaultValues : { 
              name: "",
              email : "",
              password : "",
          },
          resolver: zodResolver(registerSchema)
      })

      const handleLogin = async (data: registerType) => {
        console.log(data);
        try {
            await signup(data).unwrap()
            toast.success("register success")
            router.push("/")
            reset()
        } catch (error) {
            console.log(error);
            toast.error("unable to register")
        }
        
      }


  return <>
  <form onSubmit={handleSubmit(handleLogin)}>
    <input {...register("name")}  type="text" placeholder='Enter name' />
    <input {...register("email")}  type="email" placeholder='Enter email' />
    <input {...register("password")}  type="text" placeholder='Enter pass' />
    <button type='submit'>register</button>
  </form>
   
  </>
}

export default Register