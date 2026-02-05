import { Icon } from "@iconify/react";
import Link from "next/link";

export default function TermsAndConditions() {
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
            Terms & Conditions
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
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using TechSmartHire's platform, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not use our services.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              2. Services Overview
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              TechSmartHire provides a comprehensive platform for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Technical skill assessments and certifications</li>
              <li>Job matching between candidates and recruiters</li>
              <li>Career development resources and guidance</li>
              <li>Recruiter access to verified talent pools</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              3. User Accounts
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              To access certain features, you must create an account. You agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Not share your account with others</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              4. Assessment Packages & Payments
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              TechSmartHire offers various assessment packages (Basic, Premium, Platinum). By purchasing a package:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>You agree to pay the specified fees for the selected package</li>
              <li>All payments are processed securely through authorized payment gateways</li>
              <li>Package features and pricing are subject to change with prior notice</li>
              <li>Access to purchased assessments is granted upon successful payment</li>
            </ul>
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-900 font-medium flex items-start gap-2">
                <Icon icon="material-symbols:info-outline" className="w-5 h-5 mt-0.5 shrink-0" />
                <span><strong>No Refund Policy:</strong> All purchases are final. We do not offer refunds for assessment packages once payment has been processed. Please carefully review package details before completing your purchase.</span>
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              5. Assessment Integrity
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              To maintain the integrity of our assessment platform, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Complete assessments independently without external assistance</li>
              <li>Not share assessment questions or answers with others</li>
              <li>Not use unauthorized materials or resources during assessments</li>
              <li>Not attempt to manipulate or compromise the assessment system</li>
              <li>Accept that violation of these rules may result in account termination</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              6. Intellectual Property
            </h2>
            <p className="text-gray-700 leading-relaxed">
              All content on the TechSmartHire platform, including but not limited to assessment questions, logos, text, graphics, and software, is the property of TechSmartHire and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without our explicit written permission.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              7. Privacy & Data Protection
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy. By using our services, you consent to the collection and use of your information as described in the Privacy Policy.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              8. Limitation of Liability
            </h2>
            <p className="text-gray-700 leading-relaxed">
              TechSmartHire provides services "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of our platform. Our total liability shall not exceed the amount you paid for the services in question.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              9. Termination
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to suspend or terminate your account at any time for violation of these Terms & Conditions, fraudulent activity, or any other reason we deem necessary to protect our platform and users.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              10. Changes to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update these Terms & Conditions from time to time. We will notify you of any material changes by posting the updated terms on our platform. Your continued use of our services after such changes constitutes acceptance of the updated terms.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              11. Contact Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              If you have any questions about these Terms & Conditions, please contact us:
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
