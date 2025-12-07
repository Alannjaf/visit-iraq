import { redirect } from 'next/navigation';
import { routing } from '@/i18n/routing';

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/${routing.defaultLocale}/listings/${id}`);
}
