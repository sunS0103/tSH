import { Icon } from "@iconify/react";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-6"
          >
            <Icon icon="material-symbols:arrow-back" className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600">
            Last Updated: January 30, 2026
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10 space-y-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              At TechSmartHire, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, store, and protect your data when you use our platform and services.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              2. Information We Collect
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We collect various types of information to provide and improve our services:
            </p>
            
            <div className="space-y-4 ml-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">2.1 Personal Information</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Name, email address, phone number</li>
                  <li>Professional details (education, work experience, skills)</li>
                  <li>Location and work preferences</li>
                  <li>Resume and portfolio information</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">2.2 Assessment Data</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Assessment scores and performance metrics</li>
                  <li>Skill certifications and badges</li>
                  <li>Test completion timestamps and progress</li>
                  <li>Answer patterns and response times</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">2.3 Technical Information</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>IP address, browser type, and device information</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Usage patterns and interaction data</li>
                  <li>Log files and error reports</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">2.4 Payment Information</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Transaction details and purchase history</li>
                  <li>Payment method information (processed securely by third-party providers)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              3. How We Use Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We use your information for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>To provide and maintain our assessment and job matching services</li>
              <li>To create and manage your user account</li>
              <li>To process payments and maintain transaction records</li>
              <li>To match candidates with relevant job opportunities</li>
              <li>To share your masked profile with verified recruiters (with your consent)</li>
              <li>To send assessment results, certifications, and notifications</li>
              <li>To improve our platform and develop new features</li>
              <li>To communicate important updates and promotional offers</li>
              <li>To ensure platform security and prevent fraudulent activity</li>
              <li>To comply with legal obligations and enforce our terms</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              4. Information Sharing & Disclosure
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We respect your privacy and only share your information in the following circumstances:
            </p>
            
            <div className="space-y-4 ml-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">4.1 With Recruiters</h3>
                <p className="text-gray-700">
                  Your masked profile (excluding personal contact details) and assessment scores are shared with verified recruiters to facilitate job matching. You control the visibility of your profile.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">4.2 Service Providers</h3>
                <p className="text-gray-700">
                  We work with trusted third-party service providers (payment processors, email services, hosting providers) who help us operate our platform. These providers are bound by confidentiality agreements.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">4.3 Legal Requirements</h3>
                <p className="text-gray-700">
                  We may disclose your information when required by law, court order, or to protect our rights and safety.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">4.4 Business Transfers</h3>
                <p className="text-gray-700">
                  In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new entity.
                </p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              5. Data Security
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure authentication and access controls</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Secure payment processing through PCI-DSS compliant providers</li>
              <li>Employee training on data protection best practices</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security but continuously work to enhance our protections.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              6. Your Rights & Choices
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your account and data</li>
              <li><strong>Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Profile Visibility:</strong> Control who can see your assessment scores</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              To exercise any of these rights, please contact us at info@techsmarthire.com
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              7. Cookies & Tracking Technologies
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We use cookies and similar technologies to enhance your experience:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Essential Cookies:</strong> Required for platform functionality and security</li>
              <li><strong>Analytics Cookies:</strong> Help us understand usage patterns and improve services</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              You can control cookie preferences through your browser settings, but disabling certain cookies may limit platform functionality.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              8. Data Retention
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal information for as long as necessary to provide our services and comply with legal obligations. Assessment data and certifications are retained indefinitely to maintain the integrity of your professional profile. You may request deletion of your account at any time, subject to legal retention requirements.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              9. Children's Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              10. International Data Transfers
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy and applicable laws.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              11. Changes to Privacy Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of material changes by posting the updated policy on our platform and updating the "Last Updated" date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              12. Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p className="flex items-center gap-2">
                <Icon icon="mdi:email-outline" className="w-5 h-5 text-primary-600" />
                <span>info@techsmarthire.com</span>
              </p>
              <p className="flex items-start gap-2">
                <Icon icon="mdi:map-marker-outline" className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                <span>Pranav Business Park, Kondapur, Hyderabad, India</span>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
