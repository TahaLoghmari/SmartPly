export function PrivacyPolicyPage() {
  return (
    <div className="flex h-screen w-screen flex-col items-center overflow-y-auto">
      <div className="mb-10 flex w-[90%] flex-col gap-8 sm:w-[80%] md:w-[70%] lg:w-[90%] xl:w-[90%] 2xl:w-[67%]">
        <p className="mt-12 self-center text-[32px] font-extrabold xl:text-[32px]">
          Privacy Policy
        </p>
        <p className="text-[16px] font-semibold text-gray-700">
          SmartPly (“we,” “our,” or “us”) values your privacy. This Privacy
          Policy explains how we collect, use, and protect your information when
          you use our AI-powered job application tracker.
        </p>
        <p className="text-[27px] font-extrabold xl:text-[27px]">
          1. Information We Collect
        </p>
        <p className="text-[16px] font-semibold text-gray-700">
          We collect the following information from you:
        </p>
        <ul className="list-inside list-disc space-y-2 pl-4 text-[16px] font-semibold text-gray-700">
          <li>
            <span className="text-primary font-bold">Account Information:</span>{" "}
            Username, email address, and password.
          </li>
          <li>
            <span className="text-primary font-bold">Profile Details:</span>{" "}
            Resume content, Cover Letter content, work history, education,
            skills, and any other information you provide to generate job
            applications.
          </li>
          <li>
            <span className="text-primary font-bold">Stored Emails:</span> We
            may store emails associated with your account creation and related
            communications.
          </li>
        </ul>
        <p className="text-[27px] font-extrabold xl:text-[27px]">
          2. How We Use Your Information
        </p>
        <p className="text-[16px] font-semibold text-gray-700">
          We use the information we collect to:
        </p>
        <ul className="list-inside list-disc space-y-2 pl-4 text-[16px] font-semibold text-gray-700">
          <li>
            Provide and personalize our job application tracking services.
          </li>
          <li>Securely store your account information and documents.</li>
          <li>Improve and maintain the functionality of the platform.</li>
        </ul>
        <p className="text-[27px] font-extrabold xl:text-[27px]">
          3. Data Sharing and Disclosure
        </p>
        <p className="text-[16px] font-semibold text-gray-700">
          We do not sell or rent your personal data. We may share your data only
          in the following cases:
        </p>
        <ul className="list-inside list-disc space-y-2 pl-4 text-[16px] font-semibold text-gray-700">
          <li>
            <span className="text-primary font-bold">Service Providers:</span>{" "}
            With trusted third-party services (e.g., hosting, storage,
            authentication) that help us operate our platform.
          </li>
          <li>
            <span className="text-primary font-bold">Legal Compliance:</span>{" "}
            When required to comply with applicable laws, regulations, or legal
            processes.
          </li>
          <li>
            <span className="text-primary font-bold">
              Protection of Rights:
            </span>{" "}
            To enforce our terms and protect our rights, privacy, safety, or
            property.
          </li>
        </ul>
        <p className="text-[27px] font-extrabold xl:text-[27px]">
          4. Data Security
        </p>
        <p className="text-[16px] font-semibold text-gray-700">
          We take reasonable technical and organizational measures to protect
          your information from unauthorized access, loss, misuse, or
          alteration. However, no system is completely secure, and we cannot
          guarantee absolute protection.
        </p>
        <p className="text-[27px] font-extrabold xl:text-[27px]">
          5. Contact Us
        </p>
        <p className="text-[16px] font-semibold text-gray-700">
          If you have questions or concerns about this Privacy Policy, please
          contact us at:
        </p>
        <p>📧 medtahalog@gmail.com</p>
      </div>
    </div>
  );
}
