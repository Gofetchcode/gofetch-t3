// Fetches live Google Reviews data for GoFetch Auto
// Caches for 1 hour to avoid burning API quota

let cache: { data: any; ts: number } | null = null;
const CACHE_TTL = 3600000; // 1 hour

const PLACE_ID = "10131694458127019437";

export async function GET() {
  // Return cache if fresh
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return Response.json(cache.data);
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return Response.json({ rating: 4.9, reviewCount: 0, reviews: [], cached: false, error: "No API key" });
  }

  try {
    // Use Places API (New) — Place Details
    const url = `https://places.googleapis.com/v1/places/${PLACE_ID}?fields=rating,userRatingCount,reviews&key=${apiKey}`;
    const res = await fetch(url, {
      headers: { "X-Goog-FieldMask": "rating,userRatingCount,reviews" },
    });

    if (!res.ok) {
      // Fallback: try legacy API format
      const legacyUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJ${PLACE_ID}&fields=rating,user_ratings_total,reviews&key=${apiKey}`;
      const legacyRes = await fetch(legacyUrl);
      const legacyData = await legacyRes.json();

      if (legacyData.result) {
        const result = {
          rating: legacyData.result.rating || 4.9,
          reviewCount: legacyData.result.user_ratings_total || 0,
          reviews: (legacyData.result.reviews || []).slice(0, 5).map((r: any) => ({
            author: r.author_name,
            rating: r.rating,
            text: r.text,
            time: r.relative_time_description,
            photo: r.profile_photo_url,
          })),
          source: "google_legacy",
        };
        cache = { data: result, ts: Date.now() };
        return Response.json(result);
      }
    }

    const data = await res.json();
    const result = {
      rating: data.rating || 4.9,
      reviewCount: data.userRatingCount || 0,
      reviews: (data.reviews || []).slice(0, 5).map((r: any) => ({
        author: r.authorAttribution?.displayName || "Client",
        rating: r.rating,
        text: r.text?.text || "",
        time: r.relativePublishTimeDescription || "",
        photo: r.authorAttribution?.photoUri || "",
      })),
      source: "google_new",
    };

    cache = { data: result, ts: Date.now() };
    return Response.json(result);
  } catch (err: any) {
    return Response.json({ rating: 4.9, reviewCount: 0, reviews: [], error: err.message });
  }
}
