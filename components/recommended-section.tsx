import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";

import ExploreAttractionCard from "@/components/explore-attraction-card";
import { decodeSession, SESSION_COOKIE } from "@/lib/auth";
import { getRecommendations } from "@/lib/recommendation/getRecommendations";

// Same card layout as "Popular destinations" on the explore page.
function DestinationCard({ doc }: { doc: any }) {
    return (
        <article className="rounded-xl border border-[#D4D9DE] bg-white p-3">
            <div className="group flex h-[122px] items-center overflow-hidden rounded-[10px] bg-[#D6DEE0]">
                {doc?.image ? (
                    <Image
                        src={doc.image}
                        alt={doc.name}
                        width={600}
                        height={300}
                        className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <p className="text-sm text-[#636E75]">No image available</p>
                    </div>
                )}
            </div>

            <div className="px-1 pt-3">
                <h4 className="text-lg font-semibold text-[#1A1F24]">{doc.name}</h4>
                <p className="mt-1 text-xs text-[#636E75]">{doc.description}</p>

                <Link
                    href={`/destinations/${doc._id}`}
                    className="mt-4 flex h-11 items-center justify-center rounded-lg border border-[#D4D9DE] text-sm font-semibold text-[#1A1F24] transition hover:border-primary hover:text-primary"
                >
                    Explore
                </Link>
            </div>
        </article>
    );
}

// Reuses the attraction card of the explore page, which links to the details page.
function AttractionGrid({ items }: { items: { doc: any }[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {items.map(({ doc }) => (
            <ExploreAttractionCard
                key={doc._id.toString()}
                attractionId={doc._id.toString()}
                attractionName={doc.name}
                location={doc.location}
                category={doc.category}
                image={doc.image}
            />
        ))}
    </div>
  );
}

export default async function RecommendedSection() {
    const cookieStore = await cookies();
    const session = decodeSession(cookieStore.get(SESSION_COOKIE)?.value);
    if (!session) return null; // visitors see the page as before

    const recommendations = await getRecommendations(session.id);
    if (!recommendations.preferenceSet) return null; // no preference or skipped: page as before

    const { destinations, attractions } = recommendations;

    return (
        <section className="grid gap-6">
            <div>
                <h2 className="text-xl font-semibold text-[#1A1F24]">
                    Recommended for you
                </h2>
                <p className="mt-1 text-sm text-[#636E75]">
                    Based on the destinations and categories you selected.
                </p>
            </div>

            {destinations.length > 0 && (
            <div className="grid gap-4">
                <h3 className="text-sm font-semibold text-[#636E75]">Destinations</h3>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                {destinations.map(({ doc }) => (
                    <DestinationCard key={doc._id.toString()} doc={doc} />
                ))}
                </div>
            </div>
            )}

            {attractions.length > 0 && (
                <div className="grid gap-4">
                    <h3 className="text-sm font-semibold text-[#636E75]">Attractions</h3>
                    <AttractionGrid items={attractions} />
                </div>
            )}
        </section>
    );
}