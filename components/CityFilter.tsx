"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const popularCities = [
  "Baghdad",
  "Erbil",
  "Basra",
  "Najaf",
  "Mosul",
  "Sulaymaniyah",
  "Kurdistan",
  "Karbala",
  "Kirkuk",
  "Nasiriyah",
];

export function CityFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const selectedCity = searchParams.get("city") || "";

  const handleCityChange = (city: string) => {
    const params = new URLSearchParams();
    const type = searchParams.get("type");
    const search = searchParams.get("search");
    
    if (type) params.set("type", type);
    if (search) params.set("search", search);
    if (city) params.set("city", city);
    
    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors bg-white"
      >
        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-sm font-medium text-gray-700">
          {selectedCity || "All Cities"}
        </span>
        <svg 
          className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto">
            <div className="p-2">
              <button
                onClick={() => handleCityChange("")}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  !selectedCity
                    ? "bg-[var(--primary)] text-white"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                All Cities
              </button>
              <div className="border-t border-gray-200 my-2" />
              <div className="space-y-1">
                {popularCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleCityChange(city)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedCity === city
                        ? "bg-[var(--primary)] text-white"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

