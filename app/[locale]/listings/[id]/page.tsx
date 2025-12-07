import { notFound } from "next/navigation";
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getListingById, getUserRole } from "@/lib/db";
import { Header, Footer } from "@/components/layout";
import { Button, Badge } from "@/components/ui";
import { stackServerApp } from "@/stack";
import { getListingTypeLabel, formatPriceRange, formatDate } from "@/lib/utils";
import { ImageGallery } from "@/components/listings/ImageGallery";

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations();
  const user = await stackServerApp.getUser();
  let userRole = null;
  if (user) {
    userRole = await getUserRole(user.id);
  }

  const listing = await getListingById(id);

  if (!listing || listing.status !== "approved") {
    notFound();
  }

  const isAuthenticated = !!user;

  const defaultImages: Record<string, string> = {
    accommodation: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
    attraction: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&h=600&fit=crop",
    tour: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop",
    party: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&h=600&fit=crop",
    festival: "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=800&h=600&fit=crop",
    restaurant: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop",
    event: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop",
    live_music: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
    art_culture: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop",
    sport: "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=800&h=600&fit=crop",
    shopping: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
    nightlife: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop",
    beach: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
    mountain: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    nature: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop",
  };

  const mainImage = listing.thumbnail || listing.images?.[0] || defaultImages[listing.type] || defaultImages.accommodation;

  return (
    <div className="min-h-screen flex flex-col">
      <Header userRole={userRole} />

      <main className="flex-1 bg-[var(--background)]">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-[var(--border)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <nav className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-[var(--foreground-muted)] hover:text-[var(--primary)]">
                {t('listing.home')}
              </Link>
              <span className="text-[var(--foreground-muted)]">/</span>
              <span className="text-[var(--foreground)]">{listing.title}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <ImageGallery
                images={listing.images || []}
                title={listing.title}
                defaultImage={mainImage}
                fallbackSrc={defaultImages[listing.type]}
              />

              {/* Videos */}
              {listing.videos && listing.videos.length > 0 && (
                <div className="bg-white rounded-xl border border-[var(--border)] p-6">
                  <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">{t('listing.videos')}</h2>
                  <div className="space-y-4">
                    {listing.videos.map((videoUrl, index) => (
                      <div key={index} className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
                          <iframe
                            src={videoUrl.includes('youtube.com/watch') 
                              ? videoUrl.replace('watch?v=', 'embed/').split('&')[0]
                              : videoUrl.replace('youtu.be/', 'youtube.com/embed/')}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : videoUrl.includes('vimeo.com') ? (
                          <iframe
                            src={`https://player.vimeo.com/video/${videoUrl.split('/').pop()}`}
                            className="w-full h-full"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <video
                            src={videoUrl}
                            className="w-full h-full object-cover"
                            controls
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Header Info */}
              <div className="bg-white rounded-xl border border-[var(--border)] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-[var(--primary)]/10 rounded-full text-sm font-medium text-[var(--primary)]">
                    {getListingTypeLabel(listing.type)}
                  </span>
                  <Badge variant="approved">{t('listing.live')}</Badge>
                </div>
                <h1 className="text-3xl font-display font-bold text-[var(--foreground)] mb-4">
                  {listing.title}
                </h1>
                <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{listing.location}, {listing.city}, {listing.region}</span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl border border-[var(--border)] p-6">
                <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">{t('listing.about')}</h2>
                <p className="text-[var(--foreground)] whitespace-pre-wrap leading-relaxed">
                  {listing.description}
                </p>
              </div>

              {/* Amenities */}
              {listing.amenities && listing.amenities.length > 0 && (
                <div className="bg-white rounded-xl border border-[var(--border)] p-6">
                  <h2 className="text-xl font-bold text-[var(--foreground)] mb-4">
                    {listing.type === "accommodation" ? t('listing.amenities') : t('listing.features')}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {listing.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-[var(--success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-[var(--foreground)]">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price & Contact Card */}
              <div className="bg-white rounded-xl border border-[var(--border)] p-6 sticky top-24">
                {isAuthenticated ? (
                  <>
                    {/* Price */}
                    <div className="mb-6 pb-6 border-b border-[var(--border)]">
                      <p className="text-sm text-[var(--foreground-muted)] mb-1">{t('listing.priceRange')}</p>
                      <p className="text-2xl font-bold text-[var(--primary)]">
                        {formatPriceRange(listing.price_range)}
                      </p>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4 mb-6">
                      <h3 className="font-bold text-[var(--foreground)]">{t('listing.contactInformation')}</h3>
                      
                      {listing.contact_phone && (
                        <a
                          href={`tel:${listing.contact_phone}`}
                          className="flex items-center gap-3 p-3 bg-[var(--background-alt)] rounded-lg hover:bg-[var(--border)] transition-colors"
                        >
                          <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-[var(--foreground)]">{listing.contact_phone}</span>
                        </a>
                      )}

                      {listing.contact_email && (
                        <a
                          href={`mailto:${listing.contact_email}`}
                          className="flex items-center gap-3 p-3 bg-[var(--background-alt)] rounded-lg hover:bg-[var(--border)] transition-colors"
                        >
                          <svg className="w-5 h-5 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-[var(--foreground)]">{listing.contact_email}</span>
                        </a>
                      )}

                      {listing.full_address && (
                        <div className="flex items-start gap-3 p-3 bg-[var(--background-alt)] rounded-lg">
                          <svg className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="text-[var(--foreground)]">{listing.full_address}</span>
                        </div>
                      )}
                    </div>

                    {listing.external_link && (
                      <a
                        href={listing.external_link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="primary" className="w-full">
                          {t('listing.visitWebsite')}
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </Button>
                      </a>
                    )}
                  </>
                ) : (
                  /* Sign Up CTA for Guests */
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-[var(--foreground)] mb-2">
                      {t('listing.signUpToSeeDetails')}
                    </h3>
                    <p className="text-sm text-[var(--foreground-muted)] mb-6">
                      {t('listing.signUpDescription')}
                    </p>
                    <Link href={`/handler/sign-up?after_auth_return_to=/${locale}/listings/${id}`}>
                      <Button variant="primary" className="w-full mb-3">
                        {t('listing.signUpFree')}
                      </Button>
                    </Link>
                    <Link href={`/handler/sign-in?after_auth_return_to=/${locale}/listings/${id}`}>
                      <Button variant="outline" className="w-full">
                        {t('listing.alreadyHaveAccount')}
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Info Card */}
              <div className="bg-white rounded-xl border border-[var(--border)] p-6">
                <h3 className="font-bold text-[var(--foreground)] mb-4">{t('listing.listingInfo')}</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground-muted)]">{t('listing.type')}</span>
                    <span className="text-[var(--foreground)]">{getListingTypeLabel(listing.type)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground-muted)]">{t('listing.region')}</span>
                    <span className="text-[var(--foreground)]">{listing.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground-muted)]">{t('listing.city')}</span>
                    <span className="text-[var(--foreground)]">{listing.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--foreground-muted)]">{t('listing.listed')}</span>
                    <span className="text-[var(--foreground)]">{formatDate(listing.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

