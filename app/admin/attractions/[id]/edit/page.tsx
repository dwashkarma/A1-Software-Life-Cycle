import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";

import { connectDB } from "@/lib/mongodb";
import { decodeSession } from "@/lib/auth";
import Attraction from "@/models/Attraction";
import AttractionForm from "@/components/admin-attraction-form";

export default async function EditAttractionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await connectDB();

  const cookieStore = await cookies();
  const session = decodeSession(cookieStore.get("travel_mate_session")?.value);

  if (!session || session.role !== "admin") {
    redirect("/authentication/login");
  }

  const { id } = await params;

  const attraction = await Attraction.findById(id).populate("destination");

  if (!attraction) {
    notFound();
  }

  return (
    <AttractionForm
      attractionId={attraction._id.toString()}
      initialData={{
        name: attraction.name,
        destination: attraction.destination._id,
        category: attraction.category,
        location: attraction.location,
        description: attraction.description,
        image: attraction.image || "",
      }}
      isEdit={true}
    />
  );
}
