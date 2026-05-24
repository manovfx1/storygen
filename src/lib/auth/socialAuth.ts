/**
 * Frontend social sign-in entry points.
 * Replace the simulated flows with OAuth redirects or SDK calls when backend auth is wired up.
 */

export type AuthRedirect = (path: string) => void;

export async function signInWithGoogle(redirect: AuthRedirect): Promise<void> {
  // TODO: connect Google OAuth provider / One Tap SDK here
  await new Promise((resolve) => setTimeout(resolve, 350));
  redirect("/dashboard");
}

export async function signInWithApple(redirect: AuthRedirect): Promise<void> {
  // TODO: connect Apple Sign In JS SDK or OAuth redirect here
  await new Promise((resolve) => setTimeout(resolve, 350));
  redirect("/dashboard");
}
