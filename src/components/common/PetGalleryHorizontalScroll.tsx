import React, { useRef, useState, useEffect } from "react";
import type { api_get_pet_info_PetPicture } from "../../authentication";

export default function PetGalleryHorizontalScroll({
  images,
  profile_picture_id,
}: {
  images: api_get_pet_info_PetPicture[];
  profile_picture_id: number | null;
}) {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Update current index on scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const width = container.clientWidth;
      const index = Math.round(scrollLeft / width);
      setCurrent(index);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col items-center bg-pink-50 p-6 rounded-xl">
      {/* Scrollable images */}
      <div
        ref={containerRef}
        className="flex overflow-x-auto gap-4 snap-x snap-mandatory scrollbar-hide w-full items-center"
      >
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`flex-shrink-0 w-full max-w-[300px] relative inline-block snap-center rounded-xl overflow-hidden shadow-lg ${idx === current ? "h-90" : "h-80"
              }`}
          >
            <img
              src={img.url}
              alt={`cat-${idx}`}
              className="w-full h-full object-cover"
            />
            {profile_picture_id && profile_picture_id === img.id && (
              <React.Fragment>
                <div className="absolute inset-0 rounded-md bg-gradient-to-t from-[#000148]/70 via-[#000148]/30 to-transparent" />
                <div className="absolute bottom-2  text-white px-2 py-1 flex w-full justify-between align-middle items-center">
                  <div>
                    <p>Ảnh đại diện</p>
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="flex mt-4 gap-2">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={` h-2 rounded-full transition-all ${idx === current ? "bg-pink-500 w-8" : "bg-pink-200 w-2"
              }`}
          />
        ))}
      </div>
    </div>
  );
};
