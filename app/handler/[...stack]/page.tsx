import { StackHandler, StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "@/stack";

export default function Handler(props: { params: Promise<{ stack: string[] }> }) {
  return (
    <StackProvider app={stackServerApp}>
      <StackTheme>
        <StackHandler fullPage app={stackServerApp} params={props.params} />
      </StackTheme>
    </StackProvider>
  );
}

