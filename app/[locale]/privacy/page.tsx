import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getUserRole } from "@/lib/db";
import { stackServerApp } from "@/stack";

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const user = await stackServerApp.getUser();
  const userRole = user ? await getUserRole(user.id) : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header userRole={userRole} />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-foreground-muted mb-8">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="space-y-8 text-foreground">
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
              <p className="text-foreground-muted leading-relaxed">
                Welcome to Visit Iraq ("we," "our," or "us"). We are committed to protecting your privacy and ensuring
                you have a positive experience on our website and in using our services. This Privacy Policy explains how
                we collect, use, disclose, and safeguard your information when you visit our website and use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">2.1 Information You Provide</h3>
              <p className="text-foreground-muted leading-relaxed mb-4">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground-muted ml-4">
                <li>Account registration information (name, email address, password)</li>
                <li>Profile information and preferences</li>
                <li>Listing information (if you are a host: property details, images, pricing, contact information)</li>
                <li>Communications with us (support requests, feedback, inquiries)</li>
                <li>Payment information (processed securely through third-party payment processors)</li>
              </ul>

              <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">2.2 Automatically Collected Information</h3>
              <p className="text-foreground-muted leading-relaxed mb-4">
                When you use our services, we automatically collect certain information, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground-muted ml-4">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages visited, time spent, links clicked)</li>
                <li>Location data (if you choose to share it)</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
              <p className="text-foreground-muted leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground-muted ml-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process your registrations, transactions, and requests</li>
                <li>Send you administrative information, updates, and marketing communications (with your consent)</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Monitor and analyze usage patterns and trends</li>
                <li>Detect, prevent, and address technical issues and security threats</li>
                <li>Comply with legal obligations and enforce our terms</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Information Sharing and Disclosure</h2>
              <p className="text-foreground-muted leading-relaxed mb-4">
                We may share your information in the following circumstances:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground-muted ml-4">
                <li>
                  <strong>With Hosts:</strong> When you contact a host or make an inquiry, we share your contact
                  information with the host to facilitate communication.
                </li>
                <li>
                  <strong>With Service Providers:</strong> We may share information with third-party service providers
                  who perform services on our behalf (e.g., hosting, analytics, payment processing).
                </li>
                <li>
                  <strong>For Legal Reasons:</strong> We may disclose information if required by law, court order, or
                  government regulation, or to protect our rights and safety.
                </li>
                <li>
                  <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your
                  information may be transferred to the acquiring entity.
                </li>
                <li>
                  <strong>With Your Consent:</strong> We may share your information with your explicit consent or at
                  your direction.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Data Security</h2>
              <p className="text-foreground-muted leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information against
                unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the
                Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Your Rights and Choices</h2>
              <p className="text-foreground-muted leading-relaxed mb-4">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 text-foreground-muted ml-4">
                <li>
                  <strong>Access:</strong> You can request access to the personal information we hold about you.
                </li>
                <li>
                  <strong>Correction:</strong> You can update or correct your personal information through your account
                  settings.
                </li>
                <li>
                  <strong>Deletion:</strong> You can request deletion of your personal information, subject to certain
                  legal obligations.
                </li>
                <li>
                  <strong>Opt-Out:</strong> You can opt out of marketing communications by following the unsubscribe
                  instructions in our emails.
                </li>
                <li>
                  <strong>Account Closure:</strong> You can close your account at any time through your account settings.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Cookies and Tracking Technologies</h2>
              <p className="text-foreground-muted leading-relaxed">
                We use cookies and similar tracking technologies to collect and store information about your preferences
                and usage patterns. You can control cookies through your browser settings, but disabling cookies may
                affect the functionality of our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Children's Privacy</h2>
              <p className="text-foreground-muted leading-relaxed">
                Our services are not intended for children under the age of 18. We do not knowingly collect personal
                information from children. If you believe we have collected information from a child, please contact us
                immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. International Data Transfers</h2>
              <p className="text-foreground-muted leading-relaxed">
                Your information may be transferred to and processed in countries other than your country of residence.
                These countries may have data protection laws that differ from those in your country. By using our
                services, you consent to the transfer of your information to these countries.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Changes to This Privacy Policy</h2>
              <p className="text-foreground-muted leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
                Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy
                Policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">11. Contact Us</h2>
              <p className="text-foreground-muted leading-relaxed">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-background-alt rounded-lg">
                <p className="text-foreground-muted">
                  <strong>Email:</strong> privacy@visitiraq.com
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

