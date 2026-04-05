"use client";

import { useState, useEffect } from "react";

// GoFetch Auto CID for direct Google Maps link
const GOOGLE_MAPS_URL = "https://www.google.com/maps?cid=10131694458127019437";

export function GoogleReviewsStat() {
  const [rating, setRating] = useState(5.0);
  const [count, setCount] = useState<number | null>(2);
  const [live, setLive] = useState(false);

  useEffect(() => {
    fetch("/api/google-reviews")
      .then((r) => r.json())
      .then((d) => {
        if (d.live && d.rating) {
          setRating(d.rating);
          if (d.reviewCount && d.reviewCount > 0) setCount(d.reviewCount);
          setLive(true);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <a
      href={GOOGLE_MAPS_URL}
      target="_blank"
      rel="noopener"
      className="text-center block hover:scale-105 transition-transform duration-200"
    >
      <div className="text-4xl md:text-5xl font-bold text-amber mb-2">
        {rating}&thinsp;&#9733;
      </div>
      <div className="text-sm text-gray-400 uppercase tracking-wider">
        Google Reviews
      </div>
      {count && count > 0 && (
        <div className="text-xs text-gray-500 mt-1">{count} reviews</div>
      )}
      <div className="text-[10px] text-gray-500 mt-0.5 underline decoration-gray-600">See reviews &rarr;</div>
    </a>
  );
}
