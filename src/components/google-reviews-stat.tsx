"use client";

import { useState, useEffect } from "react";

export function GoogleReviewsStat() {
  const [rating, setRating] = useState(4.9);
  const [count, setCount] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/google-reviews")
      .then((r) => r.json())
      .then((d) => {
        if (d.rating) setRating(d.rating);
        if (d.reviewCount) setCount(d.reviewCount);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  return (
    <a
      href="https://www.google.com/search?q=GoFetch+Auto+Tampa+Bay+reviews"
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
      {count > 0 && (
        <div className="text-xs text-gray-500 mt-1">{count} reviews</div>
      )}
      <div className="text-[10px] text-gray-500 mt-0.5">See our reviews &rarr;</div>
    </a>
  );
}
