import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { decodeSession } from "@/lib/auth";
import AttractionForm from "@/components/admin-attraction-form";

export default async function AddAttractionPage() {
  const cookieStore = await cookies();
  const session = decodeSession(cookieStore.get("travel_mate_session")?.value);

  if (!session || session.role !== "admin") {
    redirect("/authentication/login");
  }

  return <AttractionForm />;
}
