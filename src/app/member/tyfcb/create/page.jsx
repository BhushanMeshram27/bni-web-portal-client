import { Suspense } from "react";
import CreateTYFCBClient from "./CreateTYFCBClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <CreateTYFCBClient />
    </Suspense>
  );
}