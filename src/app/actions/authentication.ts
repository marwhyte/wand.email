'use server'

import { signIn, signOut } from '@/auth'

export async function doGoogleLogin() {
  return signIn('google', { callbackUrl: 'false' })
}

export async function doCredentialsLogin(formData: FormData) {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    })
  } catch (e) {
    throw e
  }
}

export async function doLogout() {
  await signOut({ redirectTo: '/' })
}

export async function doGoogleLoginWithInitialProject() {
  return signIn('google', { callbackUrl: 'false' })
}
