import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "@/stack";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { SetHtmlAttributes } from '@/components/SetHtmlAttributes';
import { ensureUserRole } from '@/lib/auth';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Initialize user in database if they're authenticated
  // This ensures users created in Stack Auth are also created in Neon DB
  try {
    const user = await stackServerApp.getUser();
    if (user) {
      await ensureUserRole(user.id, 'user');
    }
  } catch (error) {
    // Silently fail if user is not authenticated or if there's an error
    // This is expected for unauthenticated users
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  // All locales use LTR layout (same as Kurdish)
  const dir = 'ltr';

  return (
    <>
      <SetHtmlAttributes lang={locale} dir={dir} />
      <NextIntlClientProvider messages={messages}>
        <StackProvider app={stackServerApp}>
          <StackTheme>
            {children}
          </StackTheme>
        </StackProvider>
      </NextIntlClientProvider>
    </>
  );
}

