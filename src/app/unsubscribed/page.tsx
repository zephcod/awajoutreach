export default function UnsubscribedPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <div className="max-w-md rounded-lg border border-gray-200 bg-white p-8 text-center">
        <h1 className="text-xl font-semibold">You’re unsubscribed</h1>
        <p className="mt-3 text-sm text-gray-500">
          You won’t receive any more marketing emails from us. Service emails about your
          account (receipts, password resets) may still be delivered.
        </p>
      </div>
    </main>
  );
}
