import SiteLayout from "@/components/layout/SiteLayout";
import { privacySections } from "@/data/privacySections";

export default function PrivacyPolicyPage() {
  return (
    <SiteLayout>
      <main className="bg-gray-50 min-h-screen">
        <section className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white py-20">
          <div className="max-w-5xl mx-auto px-6">
            <h1 className="text-5xl font-bold">Privacy Policy</h1>
            <p className="mt-4 text-lg text-blue-100">
              Learn how we collect, use, and protect your personal information
              while using the BNI Member Portal.
            </p>
          </div>
        </section>

        <section className="max-w-5xl mx-auto px-6 py-16">
          {privacySections.map((section) => (
            <div
              key={section.id}
              className="mb-10 rounded-2xl bg-white p-8 shadow-md border border-gray-200"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {section.title}
              </h2>

              {section.content && (
                <p className="whitespace-pre-line text-gray-700 leading-8">
                  {section.content}
                </p>
              )}

              {section.list && (
                <ul className="mt-4 list-disc pl-6 space-y-2 text-gray-700">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      </main>
    </SiteLayout>
  );
}