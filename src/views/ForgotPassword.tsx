'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'

// Third-party Imports
import classnames from 'classnames'
import { Controller, useForm } from 'react-hook-form'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { object, minLength, string, email, pipe } from 'valibot'
import type { SubmitHandler } from 'react-hook-form'
import type { InferInput } from 'valibot'
import { sendPasswordResetEmail } from 'firebase/auth'

// Type Imports
import type { Mode } from '@core/types'

// Component Imports
import Logo from '@components/layout/shared/Logo'
import DirectionalIcon from '@components/DirectionalIcon'

// Config Imports
import { auth } from '@configs/firebase'

// Hook Imports
import { useImageVariant } from '@core/hooks/useImageVariant'
import { useSettings } from '@core/hooks/useSettings'

type FormData = InferInput<typeof schema>

type AlertType = {
  type: 'success' | 'error'
  message: string
}

const schema = object({
  email: pipe(string(), minLength(1, 'This field is required'), email('Please enter a valid email address'))
})

const ForgotPasswordV2 = ({ mode }: { mode: Mode }) => {
  // States
  const [alert, setAlert] = useState<AlertType | null>(null)

  // Vars
  const darkImg = '/images/pages/auth-v2-mask-4-dark.png'
  const lightImg = '/images/pages/auth-v2-mask-4-light.png'
  const darkIllustration = '/images/illustrations/auth/v2-forgot-password-dark.png'
  const lightIllustration = '/images/illustrations/auth/v2-forgot-password-light.png'
  const borderedDarkIllustration = '/images/illustrations/auth/v2-forgot-password-dark-border.png'
  const borderedLightIllustration = '/images/illustrations/auth/v2-forgot-password-light-border.png'

  // Hooks
  const { settings } = useSettings()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: valibotResolver(schema),
    defaultValues: {
      email: ''
    }
  })

  const authBackground = useImageVariant(mode, lightImg, darkImg)

  const characterIllustration = useImageVariant(
    mode,
    lightIllustration,
    darkIllustration,
    borderedLightIllustration,
    borderedDarkIllustration
  )

  const onSubmit: SubmitHandler<FormData> = async (data: FormData) => {
    try {
      await sendPasswordResetEmail(auth, data.email)
      setAlert({
        type: 'success',
        message: 'Password reset email sent! Check your inbox.'
      })
    } catch (error: any) {
      setAlert({
        type: 'error',
        message: error.message
      })
    }
  }

  return (
    <div className='flex bs-full justify-center'>
      <div
        className={classnames(
          'flex items-center justify-center bs-full flex-1 min-bs-[100dvh] relative p-6 max-md:hidden',
          {
            'border-ie': settings.skin === 'bordered'
          }
        )}
      >
        <div className='pli-6 max-lg:mbs-40 lg:mbe-24'>
          <img
            src={characterIllustration}
            alt='character-illustration'
            className='max-bs-[677px] max-is-full bs-auto'
          />
        </div>
        <img
          src={authBackground}
          className='absolute bottom-[4%] z-[-1] is-full max-md:hidden'
          alt='auth-background'
          title='Authentication background'
        />
      </div>
      <div className='flex justify-center items-center bs-full bg-backgroundPaper !min-is-full p-6 md:!min-is-[unset] md:p-12 md:is-[480px]'>
        <Link href={'/'} className='absolute block-start-5 sm:block-start-[38px] inline-start-6 sm:inline-start-[38px]'>
          <Logo />
        </Link>
        <div className='flex flex-col gap-5 is-full sm:is-auto md:is-full sm:max-is-[400px] md:max-is-[unset] mbs-11 sm:mbs-14 md:mbs-0'>
          <div>
            <Typography variant='h4'>Forgot Password 🔒</Typography>
            <Typography className='mbs-1'>
              Enter your email and we&#39;ll send you instructions to reset your password
            </Typography>
          </div>
          {alert && (
            <Alert severity={alert.type} onClose={() => setAlert(null)}>
              {alert.message}
            </Alert>
          )}
          <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
            <Controller
              name='email'
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <TextField
                  {...field}
                  autoFocus
                  fullWidth
                  label='Email'
                  onChange={e => {
                    field.onChange(e.target.value)
                    alert !== null && setAlert(null)
                  }}
                  {...(errors.email && { error: true, helperText: errors.email.message })}
                />
              )}
            />
            <Button fullWidth variant='contained' type='submit'>
              Send reset link
            </Button>
            <Typography className='flex justify-center items-center' color='primary.main'>
              <Link href='/login' className='flex items-center gap-1.5'>
                <DirectionalIcon
                  ltrIconClass='ri-arrow-left-s-line'
                  rtlIconClass='ri-arrow-right-s-line'
                  className='text-xl'
                />
                <span>Back to Login</span>
              </Link>
            </Typography>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordV2
