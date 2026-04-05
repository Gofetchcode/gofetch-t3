// Fetches live Google Reviews data for GoFetch Auto
// Tries new Places API first, falls back to legacy, caches 1 hour

let cache: { data: any; ts: number } | null = null;
const CACHE_TTL = 3600000; // 1 hour
const PLACE_ID = "10131694458127019437";

export async function GET() {
  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return Response.json(cache.data);
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return Response.json({ rating: 4.9, reviewCount: null, reviews: [], live: false });
  }

  try {
    // Try new Places API
    const newRes = await fetch(
      `https://places.googleapis.com/v1/places/${PLACE_ID}?key=${apiKey}`,
      { headers: { "X-Goog-FieldMask": "rating,userRatingCount,reviews" } }
    );

    if (newRes.ok) {
      const data = await newRes.json();
      if (data.rating) {
        const result = {
          rating: data.rating,
          reviewCount: data.userRatingCount || null,
          reviews: (data.reviews || []).slice(0, 5).map((r: any) => ({
            author: r.authorAttribution?.displayName || "Client",
            rating: r.rating,
            text: r.text?.text || "",
            time: r.relativePublishTimeDescription || "",
          })),
          live: true,
        };
        cache = { data: result, ts: Date.now() };
        return Response.json(result);
      }
    }

    // Try text search to find the business
    const searchRes = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "places.id,places.rating,places.userRatingCount,places.reviews",
        },
        body: JSON.stringify({ textQuery: "GoFetch Auto Tampa Bay Florida" }),
      }
    );

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      const place = searchData.places?.[0];
      if (place?.rating) {
        const result = {
          rating: place.rating,
          reviewCount: place.userRatingCount || null,
          reviews: (place.reviews || []).slice(0, 5).map((r: any) => ({
            author: r.authorAttribution?.displayName || "Client",
            rating: r.rating,
            text: r.text?.text || "",
            time: r.relativePublishTimeDescription || "",
          })),
          live: true,
          placeId: place.id,
        };
        cache = { data: result, ts: Date.now() };
        return Response.json(result);
      }
    }

    // Fallback
    return Response.json({ rating: 4.9, reviewCount: null, reviews: [], live: false });
  } catch (err: any) {
    return Response.json({ rating: 4.9, reviewCount: null, reviews: [], live: false, error: err.message });
  }
}
