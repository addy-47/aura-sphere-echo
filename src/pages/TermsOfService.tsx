
import React from 'react';
import Layout from '../components/Layout';

const TermsOfService = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto glassmorphism p-8 rounded-2xl">
          <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
          
          <div className="space-y-6 text-gray-300">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Agreement to Terms</h2>
              <p>By accessing or using the Neura AI service, website, and any other linked pages or applications (collectively, the "Service"), you agree to be bound by these Terms of Service. If you do not agree to these Terms, you may not access or use the Service.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
              <p>Neura AI provides an AI-powered digital companion that adapts to your personality and preferences through continuous interaction. The Service may include various features, tools, and functionalities that may be updated from time to time.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
              <p>To access certain features of the Service, you must create an account. You are responsible for:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Providing accurate and complete information</li>
                <li>Maintaining the confidentiality of your account password</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use of your account</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">4. User Content and Conduct</h2>
              <p>You retain ownership of any content you submit, post, or display on or through the Service. By providing content to the Service, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, and display such content.</p>
              <p className="mt-2">You agree not to use the Service to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Violate any laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Submit false or misleading information</li>
                <li>Upload or transmit viruses or any other harmful code</li>
                <li>Interfere with or disrupt the Service</li>
                <li>Collect or track personal information of other users</li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">5. Intellectual Property</h2>
              <p>The Service and its original content, features, and functionality are owned by Neura AI and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, create derivative works of, publicly display, or publicly perform any of the materials from the Service without prior written consent.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">6. Subscription and Payment</h2>
              <p>Some aspects of the Service may be provided on a subscription basis. By subscribing, you agree to pay the fees as they become due. We may modify subscription fees upon reasonable notice. Refunds are provided in accordance with our Refund Policy.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">7. Termination</h2>
              <p>We may terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we determine violates these Terms or is harmful to other users of the Service, us, or third parties, or for any other reason at our sole discretion.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">8. Limitation of Liability</h2>
              <p>In no event shall Neura AI, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">9. Indemnification</h2>
              <p>You agree to defend, indemnify, and hold harmless Neura AI and its licensee and licensors, and their employees, contractors, agents, officers, and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses, resulting from or arising out of your use of the Service.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">10. Changes to Terms</h2>
              <p>We reserve the right to modify these Terms at any time. We will provide notice of changes by posting the updated Terms on this page. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">11. Governing Law</h2>
              <p>These Terms shall be governed by and construed in accordance with the laws of [Jurisdiction], without regard to its conflict of law provisions.</p>
            </section>
            
            <section>
              <h2 className="text-xl font-semibold mb-3">12. Contact Us</h2>
              <p>If you have any questions about these Terms, please contact us at:</p>
              <p className="mt-2">legal@neuraai.com</p>
            </section>
            
            <div className="pt-4 text-sm text-gray-400">
              <p>Last Updated: May 14, 2025</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;
