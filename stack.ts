import { StackServerApp } from "@stackframe/stack";

// Stack Auth requires these environment variables
// They are automatically read from process.env by StackServerApp
export const stackServerApp = new StackServerApp({
  tokenStore: "nextjs-cookie",
  urls: {
    signIn: "/handler/sign-in",
    signUp: "/handler/sign-up", 
    signOut: "/handler/sign-out",
    afterSignIn: "/",
    afterSignUp: "/",
    afterSignOut: "/",
    home: "/",
  },
});

