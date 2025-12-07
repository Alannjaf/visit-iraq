"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();
  
  // Initialize search query from URL params
  useEffect(() => {
    const query = searchParams.get("search") || "";
    setSearchQuery(query);
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const type = searchParams.get("type");
    const city = searchParams.get("city");
    const params = new URLSearchParams();
    
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }
    if (type) params.set("type", type);
    if (city) params.set("city", city);
    
    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : "/");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="bg-white rounded-full shadow-lg border border-gray-200 p-2 flex items-center gap-2 hover:shadow-xl transition-shadow">
        <div className="flex-1 px-6 py-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('home.searchPlaceholder')}
            className="w-full text-sm text-gray-900 placeholder-gray-500 outline-none bg-transparent"
          />
        </div>
        <button
          type="submit"
          className="bg-[var(--primary)] text-white rounded-full p-3 hover:bg-[var(--primary-light)] transition-colors flex-shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>
    </form>
  );
}

