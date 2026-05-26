export type AuthRedirect = (path: string) => void;

export async function signInWithGoogle(redirect: AuthRedirect): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 350));
  redirect("/dashboard");
}

export async function signInWithApple(redirect: AuthRedirect): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 350));
  redirect("/dashboard");
}
