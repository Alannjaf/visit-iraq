import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getUserRole } from "@/lib/db";
import { stackServerApp } from "@/stack";

export default async function TermsOfServicePage() {
  const user = await stackServerApp.getUser();
  const userRole = user ? await getUserRole(user.id) : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header userRole={userRole} />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-foreground mb-2">Terms of Service</h1>
          <p className="text-foreground-muted mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="space-y-8 text-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p className="text-foreground-muted leading-relaxed">
                By accessing and using Visit Iraq ("the Service"), you accept and agree to be bound by the terms and
                provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Description of Service</h2>
              <p className="text-foreground-muted leading-relaxed">
                Visit Iraq is a platform that connects travelers with hosts offering accommodations, attractions, tours,
                events, and other experiences in Iraq. We provide a marketplace where hosts can list their properties and
                services, and travelers can discover and contact hosts directly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. User Accounts</h2>
              
              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">3.1 Registration</h3>
              <p className="text-foreground-muted leading-relaxed mb-4">
                To use certain features of the Service, you must register for an account. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground-muted ml-4">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password and identification</li>
                <li>Accept all responsibility for activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">3.2 Account Types</h3>
              <ul className="list-disc list-inside space-y-2 text-foreground-muted ml-4">
                <li>
                  <strong>Travelers:</strong> Can browse listings, view details, and contact hosts
                </li>
                <li>
                  <strong>Hosts:</strong> Can create and manage listings for their properties or services
                </li>
                <li>
                  <strong>Admins:</strong> Manage the platform, review listings, and moderate content
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Host Responsibilities</h2>
              <p className="text-foreground-muted leading-relaxed mb-4">
                If you are a host, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground-muted ml-4">
                <li>Provide accurate, complete, and truthful information about your listings</li>
                <li>Use only high-quality, accurate images and videos that represent your property or service</li>
                <li>Honor all bookings and reservations made through the platform</li>
                <li>Respond promptly to inquiries from travelers</li>
                <li>Comply with all applicable laws, regulations, and local requirements</li>
                <li>Obtain all necessary licenses, permits, and insurance</li>
                <li>Maintain your property or service in a safe and habitable condition</li>
                <li>Not discriminate against travelers based on race, religion, nationality, gender, or other protected characteristics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Traveler Responsibilities</h2>
              <p className="text-foreground-muted leading-relaxed mb-4">
                If you are a traveler, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground-muted ml-4">
                <li>Use the Service only for lawful purposes</li>
                <li>Respect the property and rules of hosts</li>
                <li>Provide accurate information when contacting hosts</li>
                <li>Honor any agreements made with hosts</li>
                <li>Not engage in any fraudulent, abusive, or illegal activity</li>
                <li>Respect the privacy and rights of hosts and other users</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Listing Content and Moderation</h2>
              
              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">6.1 Content Standards</h3>
              <p className="text-foreground-muted leading-relaxed mb-4">
                All listings must comply with our content standards. Prohibited content includes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground-muted ml-4">
                <li>False, misleading, or deceptive information</li>
                <li>Illegal activities or services</li>
                <li>Content that violates intellectual property rights</li>
                <li>Offensive, discriminatory, or inappropriate material</li>
                <li>Spam, scams, or fraudulent listings</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">6.2 Listing Review</h3>
              <p className="text-foreground-muted leading-relaxed">
                All listings are subject to review and approval by our admin team. We reserve the right to reject,
                remove, or delist any listing that violates our terms or content standards. Hosts will be notified of
                any rejection with a reason provided.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Booking and Transactions</h2>
              <p className="text-foreground-muted leading-relaxed mb-4">
                Visit Iraq facilitates connections between hosts and travelers but is not a party to any booking or
                transaction. You acknowledge that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground-muted ml-4">
                <li>All bookings and transactions are directly between hosts and travelers</li>
                <li>We are not responsible for the quality, safety, or legality of listings</li>
                <li>We do not guarantee the accuracy of listing information</li>
                <li>Any disputes between hosts and travelers must be resolved directly between the parties</li>
                <li>We are not liable for any losses or damages arising from bookings or transactions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Intellectual Property</h2>
              <p className="text-foreground-muted leading-relaxed mb-4">
                The Service and its original content, features, and functionality are owned by Visit Iraq and are
                protected by international copyright, trademark, patent, trade secret, and other intellectual property
                laws. You may not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground-muted ml-4">
                <li>Reproduce, distribute, or create derivative works from our content without permission</li>
                <li>Use our trademarks, logos, or branding without authorization</li>
                <li>Reverse engineer or attempt to extract source code from the Service</li>
              </ul>
              <p className="text-foreground-muted leading-relaxed mt-4">
                By submitting content to the Service, you grant us a worldwide, non-exclusive, royalty-free license to
                use, display, and distribute your content on the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Prohibited Activities</h2>
              <p className="text-foreground-muted leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground-muted ml-4">
                <li>Use the Service for any illegal purpose or in violation of any laws</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Impersonate any person or entity</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Attempt to gain unauthorized access to any part of the Service</li>
                <li>Use automated systems to access the Service without permission</li>
                <li>Collect or harvest information about other users</li>
                <li>Transmit viruses, malware, or other harmful code</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Limitation of Liability</h2>
              <p className="text-foreground-muted leading-relaxed">
                To the maximum extent permitted by law, Visit Iraq shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly
                or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of
                the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">11. Indemnification</h2>
              <p className="text-foreground-muted leading-relaxed">
                You agree to indemnify and hold harmless Visit Iraq, its officers, directors, employees, and agents from
                any claims, damages, losses, liabilities, and expenses (including legal fees) arising out of or related
                to your use of the Service, your violation of these Terms, or your violation of any rights of another.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">12. Termination</h2>
              <p className="text-foreground-muted leading-relaxed mb-4">
                We may terminate or suspend your account and access to the Service immediately, without prior notice or
                liability, for any reason, including if you breach these Terms. Upon termination:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground-muted ml-4">
                <li>Your right to use the Service will immediately cease</li>
                <li>We may delete your account and content</li>
                <li>All provisions of these Terms that by their nature should survive termination shall survive</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">13. Changes to Terms</h2>
              <p className="text-foreground-muted leading-relaxed">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will
                provide at least 30 days notice prior to any new terms taking effect. Your continued use of the Service
                after any changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">14. Governing Law</h2>
              <p className="text-foreground-muted leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of Iraq, without regard to its
                conflict of law provisions. Any disputes arising from these Terms or the Service shall be subject to the
                exclusive jurisdiction of the courts of Iraq.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">15. Contact Information</h2>
              <p className="text-foreground-muted leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-background-alt rounded-lg">
                <p className="text-foreground-muted">
                  <strong>Email:</strong> legal@visitiraq.com
                  <br />
                  <strong>Website:</strong> visitiraq.com
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

