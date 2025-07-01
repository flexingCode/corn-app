import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from 'react-hook-form';
import { toast } from "react-toastify";
import { z } from 'zod';
import { Button } from './common/Button';
import { Input } from './common/Input';
import PurchaseService from "./service/PurchaseService";


type FormProps = {
  email: string
}

const formSchema = z.object({
  email: z.string().email(),
})

function App() {
  const { handleSubmit, control, formState: { errors }, watch } = useForm<FormProps>({
    resolver: zodResolver(formSchema),
  })
  const [lastPurchase, setLastPurchase] = useState<string | null>(null)
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0)

  useEffect(()=>{
    if(watch('email')){
      setLastPurchase(null)
      setRemainingSeconds(0)
    }
  },[watch('email')])

  useEffect(() => {
    if (lastPurchase && remainingSeconds > 0) {
      const interval = setInterval(() => {
        setRemainingSeconds(prev => {
          const newValue = prev - 1
          if (newValue <= 0) {
            clearInterval(interval)
            return 0
          }
          return newValue
        })
      }, 1000)
      
      return () => clearInterval(interval)
    }
  }, [lastPurchase, remainingSeconds])

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormProps) => PurchaseService.buyCorn(data.email),
    onSuccess: (data) => {
      setLastPurchase(data.lastPurchase)
      getMinutesUntilNextPurchase(data.lastPurchase)
      toast.success('Corn purchased successfully')
    },
    onError: (error: any) => {
      setLastPurchase(error.response?.data.lastPurchase)
      getMinutesUntilNextPurchase(error.response?.data.lastPurchase)
    }
  })

  const onSubmit = (data: FormProps) => {
    mutate(data)
  }

  const getMinutesUntilNextPurchase = useCallback((lastPurchase: string) => {
    console.log(lastPurchase)
    const now = moment().utc()
    const lastPurchaseDate = moment.utc(lastPurchase)
    const diffInSeconds = now.diff(lastPurchaseDate, 'seconds')
    const remainingSeconds = Math.max(0, 60 - diffInSeconds)
    setRemainingSeconds(remainingSeconds)
  }, [])

  return (
    <div className='flex flex-col items-center justify-center h-screen w-screen'>
      <h1 className='text-3xl font-bold'>Buy your corn! 🌽</h1>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 w-1/4 mt-12'>
        <Controller
          control={control}
          name='email'
          render={({ field }) => <Input
            {...field}
            ref={field.ref}
            className="w-full"
            value={field.value}
            placeholder="Enter your email"
            helperText={errors.email?.message}
            status={errors.email ? 'error' : 'default'}
          />}
        />
        <Button type='submit' loading={isPending} disabled={remainingSeconds > 0}>
          {lastPurchase && remainingSeconds > 0 ? `Wait ${remainingSeconds}s to purchase again` : "Purchase"}
        </Button>
      </form>
    </div>
  )
}

export default App
