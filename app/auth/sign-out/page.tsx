import { redirect } from "next/navigation";

export default function SignOutPage() {
  redirect("/handler/sign-out");
}
