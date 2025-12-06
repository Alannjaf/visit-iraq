"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface Category {
  icon: string;
  label: string;
  type?: string;
  search?: string;
}

interface CategoryScrollProps {
  categories: Category[];
  typeFilter?: string;
  cityFilter?: string;
  searchQuery?: string;
}

export function CategoryScroll({ categories, typeFilter, cityFilter, searchQuery }: CategoryScrollProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScrollButtons = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollButtons);
      window.addEventListener("resize", checkScrollButtons);
      return () => {
        container.removeEventListener("scroll", checkScrollButtons);
        window.removeEventListener("resize", checkScrollButtons);
      };
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollAmount = 300;
    const targetScroll = direction === "left" 
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;
    
    container.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative">
      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full p-2 shadow-lg hover:bg-white transition-all"
          aria-label="Scroll left"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full p-2 shadow-lg hover:bg-white transition-all"
          aria-label="Scroll right"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Fade Overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent pointer-events-none z-5" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent pointer-events-none z-5" />

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((category) => {
          const isActive = 
            (category.type && typeFilter === category.type) ||
            (category.search && searchQuery === category.search);
          
          let href = "";
          if (category.type) {
            href = `/?type=${category.type}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}${cityFilter ? `&city=${cityFilter}` : ""}`;
          } else if (category.search) {
            href = `/?search=${encodeURIComponent(category.search)}${typeFilter ? `&type=${typeFilter}` : ""}${cityFilter ? `&city=${cityFilter}` : ""}`;
          }
          
          return (
            <Link
              key={category.label}
              href={href}
              className={`flex flex-col items-center gap-2 pb-2 border-b-2 transition-colors group flex-shrink-0 ${
                isActive
                  ? "border-[var(--primary)]"
                  : "border-transparent hover:border-gray-300"
              }`}
              style={{ minWidth: "80px" }}
            >
              <div className={`text-3xl group-hover:scale-110 transition-transform ${
                isActive ? "scale-110" : ""
              }`}>
                {category.icon}
              </div>
              <span className={`text-sm font-medium whitespace-nowrap ${
                isActive ? "text-[var(--primary)] font-semibold" : "text-gray-600"
              }`}>
                {category.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

