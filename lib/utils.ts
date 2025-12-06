import { type ClassValue, clsx } from 'clsx';

// Simple className utility (without tailwind-merge to keep dependencies minimal)
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

// Format date to human-readable string
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Format date with time
export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Truncate text with ellipsis
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

// Capitalize first letter
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Format price range display
export function formatPriceRange(range: string): string {
  const ranges: Record<string, string> = {
    budget: '$ Budget-friendly',
    moderate: '$$ Moderate',
    premium: '$$$ Premium',
    luxury: '$$$$ Luxury',
  };
  return ranges[range] || range;
}

// Get listing type display name
export function getListingTypeLabel(type: string): string {
  const types: Record<string, string> = {
    accommodation: 'Accommodation',
    attraction: 'Attraction',
    tour: 'Tour',
    party: 'Party',
    festival: 'Festival',
    restaurant: 'Restaurant',
    event: 'Event',
    live_music: 'Live Music',
    art_culture: 'Art & Culture',
    sport: 'Sports',
    shopping: 'Shopping',
    nightlife: 'Nightlife',
    beach: 'Beach',
    mountain: 'Mountain',
    nature: 'Nature',
  };
  return types[type] || type;
}

// Get listing type emoji
export function getListingTypeEmoji(type: string): string {
  const emojis: Record<string, string> = {
    accommodation: "🏨",
    attraction: "🏛️",
    tour: "🗺️",
    party: "🎉",
    festival: "🎪",
    restaurant: "🍽️",
    event: "🎭",
    live_music: "🎵",
    art_culture: "🎨",
    sport: "🏃",
    shopping: "🛍️",
    nightlife: "🌙",
    beach: "🏖️",
    mountain: "⛰️",
    nature: "🏞️",
  };
  return emojis[type] || "📍";
}

// Get status badge color class
export function getStatusBadgeClass(status: string): string {
  const classes: Record<string, string> = {
    pending: 'badge-pending',
    approved: 'badge-approved',
    rejected: 'badge-rejected',
  };
  return classes[status] || '';
}

// Iraqi regions for dropdown
export const iraqiRegions = [
  'Baghdad',
  'Basra',
  'Erbil',
  'Sulaymaniyah',
  'Duhok',
  'Najaf',
  'Karbala',
  'Mosul (Nineveh)',
  'Kirkuk',
  'Anbar',
  'Diyala',
  'Babylon',
  'Wasit',
  'Maysan',
  'Dhi Qar',
  'Muthanna',
  'Qadisiyyah',
  'Saladin',
];

// Iraqi cities grouped by region
export const iraqiCities: Record<string, string[]> = {
  Baghdad: ['Baghdad'],
  Basra: ['Basra', 'Abu Al-Khaseeb', 'Shatt Al-Arab'],
  Erbil: ['Erbil', 'Rawanduz', 'Shaqlawa', 'Soran'],
  Sulaymaniyah: ['Sulaymaniyah', 'Halabja', 'Ranya'],
  Duhok: ['Duhok', 'Zakho', 'Amedi'],
  Najaf: ['Najaf', 'Kufa'],
  Karbala: ['Karbala'],
  'Mosul (Nineveh)': ['Mosul', 'Tal Afar', 'Sinjar'],
  Kirkuk: ['Kirkuk'],
  Anbar: ['Ramadi', 'Fallujah', 'Haditha'],
  Diyala: ['Baqubah', 'Khanaqin'],
  Babylon: ['Hillah'],
  Wasit: ['Kut'],
  Maysan: ['Amarah'],
  'Dhi Qar': ['Nasiriyah', 'Ur'],
  Muthanna: ['Samawah'],
  Qadisiyyah: ['Diwaniyah'],
  Saladin: ['Tikrit', 'Samarra'],
};

// Amenities list for accommodations
export const accommodationAmenities = [
  'WiFi',
  'Air Conditioning',
  'Parking',
  'Restaurant',
  'Room Service',
  'Pool',
  'Gym',
  'Spa',
  'Airport Shuttle',
  'Business Center',
  'Laundry Service',
  'Pet Friendly',
  '24/7 Reception',
  'Safe',
  'Mini Bar',
];

// Features for attractions
export const attractionFeatures = [
  'Guided Tours Available',
  'Audio Guide',
  'Wheelchair Accessible',
  'Gift Shop',
  'Café/Restaurant',
  'Parking',
  'Photography Allowed',
  'Family Friendly',
  'Historical Site',
  'UNESCO Heritage',
  'Museum',
  'Religious Site',
  'Natural Wonder',
  'Cultural Experience',
];

// Tour features
export const tourFeatures = [
  'Professional Guide',
  'Transportation Included',
  'Meals Included',
  'Hotel Pickup',
  'Small Group',
  'Private Tour Available',
  'Multi-day',
  'Adventure',
  'Cultural',
  'Historical',
  'Food Tour',
  'Photography Tour',
  'Family Friendly',
  'Accessible',
];

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone format (basic)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

