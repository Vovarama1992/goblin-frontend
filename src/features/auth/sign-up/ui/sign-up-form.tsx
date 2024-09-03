/* eslint-disable max-lines */
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { useSignUpMutation } from '@/entities/session'
import { ROUTER_PATHS } from '@/shared/config/routes'
import { Button } from '@/shared/ui-shad-cn/ui/button'
import { useToast } from '@/shared/ui-shad-cn/ui/use-toast'
import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'

import { SignUpFormData, signUpSchema } from '../model/sign-up-schema'

type SignUpFormProps = React.ComponentPropsWithoutRef<'form'>

export const SignUpForm = (props: SignUpFormProps) => {
  const { toast } = useToast()
  const navigate = useNavigate()

  const {
    control,
    formState: { dirtyFields, errors },
    handleSubmit,
    register,
  } = useForm<SignUpFormData>({
    defaultValues: {
      confirmPassword: '',
      email: '',
      password: '',
    },
    resolver: zodResolver(signUpSchema),
  })

  const [signUp, { isLoading }] = useSignUpMutation()

  const onSubmit = handleSubmit(data => {
    signUp(data)
      .unwrap()
      .then(user => {
        toast({
          description: `Мы отправили сообщение на почту ${user.email}`,
          title: 'Регистрация успешна',
          type: 'background',
        })

        navigate(ROUTER_PATHS.HOME, { replace: true })
      })
      .catch(error => {
        toast({
          description: JSON.stringify(error.data),
          title: 'Ошибка регистрации',
          variant: 'destructive',
        })
      })
  })

  const isAllFieldsDirty = dirtyFields.email && dirtyFields.password && dirtyFields.confirmPassword

  return (
    <form className={'grid gap-4'} noValidate translate={'no'} {...props} onSubmit={onSubmit}>
      <div className={'flex flex-col space-y-4'}>
        <div>
          <label className={'block'}>Почта</label>
          <input
            className={'border p-2 w-full'}
            {...register('email')}
            placeholder={'Введите почту'}
            type={'email'}
          />
          {errors.email && <span className={'text-red-500'}>{errors.email.message}</span>}
        </div>

        <div>
          <label className={'block'}>Пароль</label>
          <input
            className={'border p-2 w-full'}
            {...register('password')}
            placeholder={'Введите пароль'}
            type={'password'}
          />
          {errors.password && <span className={'text-red-500'}>{errors.password.message}</span>}
        </div>

        <div>
          <label className={'block'}>Подтвердите пароль</label>
          <input
            className={'border p-2 w-full'}
            {...register('confirmPassword')}
            placeholder={'Повторите пароль'}
            type={'password'}
          />
          {errors.confirmPassword && (
            <span className={'text-red-500'}>{errors.confirmPassword.message}</span>
          )}
        </div>
      </div>

      <Button
        className={'w-full mt-4 h-[40px]'}
        disabled={isLoading || !isAllFieldsDirty}
        type={'submit'}
      >
        Зарегистрироваться
      </Button>

      {import.meta.env.DEV && <DevTool control={control} />}
    </form>
  )
}
