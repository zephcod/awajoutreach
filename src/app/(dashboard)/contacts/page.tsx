import { COLLECTIONS, DB, Query, db, type Contact } from "@/lib/appwrite";
import { ContactForm, CsvImport } from "./ui";

export const dynamic = "force-dynamic";

export default async function ContactsPage() {
  const res = await db().listDocuments(DB(), COLLECTIONS.contacts, [
    Query.limit(200),
    Query.orderDesc("$createdAt"),
  ]);
  const contacts = res.documents as unknown as Contact[];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Contacts ({res.total})</h1>
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <ContactForm />
        <CsvImport />
      </div>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="px-4 py-2 font-medium">Email</th>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Company</th>
              <th className="px-4 py-2 font-medium">Source</th>
              <th className="px-4 py-2 font-medium">Tags</th>
              <th className="px-4 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c.$id} className="border-t border-gray-100">
                <td className="px-4 py-2">{c.email}</td>
                <td className="px-4 py-2">{[c.firstName, c.lastName].filter(Boolean).join(" ")}</td>
                <td className="px-4 py-2">{c.company}</td>
                <td className="px-4 py-2 text-gray-500">{c.source}</td>
                <td className="px-4 py-2 text-gray-500">{c.tags?.join(", ")}</td>
                <td className="px-4 py-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      c.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
            {contacts.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No contacts yet — add one or import a CSV.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
