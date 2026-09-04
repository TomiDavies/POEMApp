'use server';

import { redirect } from 'next/navigation';
import { timingSafeEqualStrings } from '@/lib/auth-token';
import { createSession, deleteSession } from '@/lib/session';

export type LoginState = { error: string } | undefined;

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const expected = process.env.DATAROOM_PASSWORD;
  if (!expected) {
    return { error: 'Server is not configured for authentication. Set DATAROOM_PASSWORD.' };
  }

  const password = formData.get('password');
  if (typeof password !== 'string' || !timingSafeEqualStrings(password, expected)) {
    return { error: 'Incorrect password.' };
  }

  await createSession();
  redirect('/dataroom');
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}
