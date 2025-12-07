"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Select, Textarea } from "@/components/ui";
import { 
  iraqiRegions, 
  iraqiCities, 
  accommodationAmenities, 
  attractionFeatures, 
  tourFeatures 
} from "@/lib/utils";
import type { Listing, ListingType } from "@/lib/db";

interface ListingFormProps {
  listing?: Listing;
  mode: "create" | "edit";
}

export function ListingForm({ listing, mode }: ListingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagesVideosError, setImagesVideosError] = useState(false);

  const [formData, setFormData] = useState({
    type: listing?.type || "accommodation",
    title: listing?.title || "",
    description: listing?.description || "",
    region: listing?.region || "",
    city: listing?.city || "",
    location: listing?.location || "",
    full_address: listing?.full_address || "",
    price_range: listing?.price_range || "moderate",
    contact_phone: listing?.contact_phone || "",
    contact_email: listing?.contact_email || "",
    external_link: listing?.external_link || "",
    amenities: listing?.amenities || [],
    images: listing?.images || [],
    videos: listing?.videos || [],
    thumbnail: listing?.thumbnail || null,
  });

  const [newMediaUrl, setNewMediaUrl] = useState("");

  const getAmenitiesList = () => {
    switch (formData.type) {
      case "accommodation":
        return accommodationAmenities;
      case "attraction":
        return attractionFeatures;
      case "tour":
        return tourFeatures;
      default:
        return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setImagesVideosError(false);
    setLoading(true);

    // Validate required fields
    if (!formData.title.trim()) {
      setError("Title is required");
      setLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      setError("Description is required");
      setLoading(false);
      return;
    }

    if (!formData.region) {
      setError("Region is required");
      setLoading(false);
      return;
    }

    if (!formData.city) {
      setError("City is required");
      setLoading(false);
      return;
    }

    if (!formData.location.trim()) {
      setError("Location/Area is required");
      setLoading(false);
      return;
    }

    if (!formData.full_address.trim()) {
      setError("Full Address is required");
      setLoading(false);
      return;
    }

    if (formData.images.length === 0 && formData.videos.length === 0) {
      setError("At least one image or video is required");
      setImagesVideosError(true);
      setLoading(false);
      return;
    }

    try {
      const url = mode === "create" 
        ? "/api/listings" 
        : `/api/listings/${listing?.id}`;
      
      const method = mode === "create" ? "POST" : "PATCH";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save listing");
      }

      router.push("/host");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const isVideoUrl = (url: string): boolean => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    const videoDomains = ['youtube.com', 'youtu.be', 'vimeo.com', 'dailymotion.com'];
    const lowerUrl = url.toLowerCase();
    return videoExtensions.some(ext => lowerUrl.includes(ext)) || 
           videoDomains.some(domain => lowerUrl.includes(domain));
  };

  const getVideoThumbnail = (videoUrl: string): string | null => {
    // YouTube thumbnail
    if (videoUrl.includes('youtube.com/watch') || videoUrl.includes('youtu.be/')) {
      let videoId = '';
      if (videoUrl.includes('youtube.com/watch')) {
        videoId = videoUrl.split('v=')[1]?.split('&')[0] || '';
      } else if (videoUrl.includes('youtu.be/')) {
        videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0] || '';
      }
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    }
    
    // Vimeo thumbnail (using vumbnail service)
    if (videoUrl.includes('vimeo.com/')) {
      const videoId = videoUrl.split('vimeo.com/')[1]?.split('?')[0] || '';
      if (videoId) {
        return `https://vumbnail.com/${videoId}.jpg`;
      }
    }
    
    // For direct video URLs, return null (will need to use video poster or first frame)
    // For now, we'll use a placeholder or the video URL itself as a fallback
    return null;
  };

  const addMedia = () => {
    if (newMediaUrl.trim()) {
      const url = newMediaUrl.trim();
      if (isVideoUrl(url)) {
        setFormData(prev => {
          const newVideos = [...prev.videos, url];
          // Auto-set first video thumbnail as thumbnail if no images exist and no thumbnail is set
          const videoThumbnail = getVideoThumbnail(url);
          const newThumbnail = prev.thumbnail || 
            (prev.images.length === 0 && newVideos.length === 1 && videoThumbnail 
              ? videoThumbnail 
              : prev.thumbnail);
          return {
            ...prev,
            videos: newVideos,
            thumbnail: newThumbnail,
          };
        });
      } else {
        setFormData(prev => {
          const newImages = [...prev.images, url];
          // Auto-set first image as thumbnail if no thumbnail is selected
          const newThumbnail = prev.thumbnail || (newImages.length === 1 ? url : prev.thumbnail);
          return {
            ...prev,
            images: newImages,
            thumbnail: newThumbnail,
          };
        });
      }
      setNewMediaUrl("");
      setImagesVideosError(false); // Clear error when media is added
    }
  };

  const removeImage = (index: number) => {
    const imageToRemove = formData.images[index];
    setFormData(prev => {
      const newImages = prev.images.filter((_, i) => i !== index);
      // If thumbnail was removed, set first remaining image as thumbnail, or null if no images left
      const newThumbnail = prev.thumbnail === imageToRemove 
        ? (newImages.length > 0 ? newImages[0] : null)
        : prev.thumbnail;
      return {
        ...prev,
        images: newImages,
        thumbnail: newThumbnail,
      };
    });
  };

  const removeVideo = (index: number) => {
    setFormData(prev => {
      const videoToRemove = prev.videos[index];
      const videoThumbnail = getVideoThumbnail(videoToRemove);
      const newVideos = prev.videos.filter((_, i) => i !== index);
      
      // If the removed video's thumbnail was the current thumbnail, update it
      let newThumbnail = prev.thumbnail;
      if (prev.thumbnail === videoThumbnail) {
        // If there are still videos, use the first video's thumbnail
        // Otherwise, use first image if available, or null
        if (newVideos.length > 0) {
          const firstVideoThumbnail = getVideoThumbnail(newVideos[0]);
          newThumbnail = firstVideoThumbnail || (prev.images.length > 0 ? prev.images[0] : null);
        } else {
          newThumbnail = prev.images.length > 0 ? prev.images[0] : null;
        }
      }
      
      return {
        ...prev,
        videos: newVideos,
        thumbnail: newThumbnail,
      };
    });
  };

  const availableCities = formData.region 
    ? iraqiCities[formData.region] || []
    : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white rounded-xl border border-[var(--border)] p-6">
        <h2 className="text-lg font-bold text-[var(--foreground)] mb-6">Basic Information</h2>
        <div className="space-y-6">
          <Select
            label="Listing Type"
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              type: e.target.value as ListingType,
              amenities: [], 
            }))}
            options={[
              { value: "accommodation", label: "🏨 Accommodation (Hotel, Guesthouse, etc.)" },
              { value: "attraction", label: "🏛️ Attraction (Museum, Historical Site, etc.)" },
              { value: "tour", label: "🗺️ Tour (Guided Tour, Package, etc.)" },
              { value: "party", label: "🎉 Party" },
              { value: "festival", label: "🎪 Festival" },
              { value: "restaurant", label: "🍽️ Restaurant" },
              { value: "event", label: "🎭 Event" },
              { value: "live_music", label: "🎵 Live Music" },
              { value: "art_culture", label: "🎨 Art & Culture" },
              { value: "sport", label: "🏃 Sports" },
              { value: "shopping", label: "🛍️ Shopping" },
              { value: "nightlife", label: "🌙 Nightlife" },
              { value: "beach", label: "🏖️ Beach" },
              { value: "mountain", label: "⛰️ Mountain" },
              { value: "nature", label: "🏞️ Nature" },
            ]}
          />

          <Input
            label="Title *"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., Grand Hotel Baghdad, Ancient Babylon Tour"
            required
          />

          <Textarea
            label="Description *"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe your listing in detail..."
            rows={5}
            required
          />

          <Select
            label="Price Range"
            value={formData.price_range}
            onChange={(e) => setFormData(prev => ({ ...prev, price_range: e.target.value }))}
            options={[
              { value: "free", label: "🆓 Free" },
              { value: "budget", label: "$ Budget-friendly" },
              { value: "moderate", label: "$$ Moderate" },
              { value: "premium", label: "$$$ Premium" },
              { value: "luxury", label: "$$$$ Luxury" },
            ]}
          />
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-xl border border-[var(--border)] p-6">
        <h2 className="text-lg font-bold text-[var(--foreground)] mb-6">Location</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Region *"
              value={formData.region}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                region: e.target.value,
                city: "", 
              }))}
              placeholder="Select region"
              options={iraqiRegions.map(r => ({ value: r, label: r }))}
              required
            />

            <Select
              label="City *"
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              placeholder="Select city"
              options={availableCities.map(c => ({ value: c, label: c }))}
              disabled={!formData.region}
              required
            />
          </div>

          <Input
            label="Location/Area *"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            placeholder="e.g., City Center, Near the Citadel"
            required
          />

          <Input
            label="Full Address (shown to registered users) *"
            value={formData.full_address}
            onChange={(e) => setFormData(prev => ({ ...prev, full_address: e.target.value }))}
            placeholder="Full street address"
            required
          />
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-xl border border-[var(--border)] p-6">
        <h2 className="text-lg font-bold text-[var(--foreground)] mb-6">Contact Information</h2>
        <p className="text-sm text-[var(--foreground-muted)] mb-6">
          This information will only be visible to registered users.
        </p>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Phone Number"
              type="tel"
              value={formData.contact_phone}
              onChange={(e) => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
              placeholder="+964 xxx xxx xxxx"
            />

            <Input
              label="Email"
              type="email"
              value={formData.contact_email}
              onChange={(e) => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
              placeholder="contact@example.com"
            />
          </div>

          <Input
            label="Website / Booking Link"
            type="url"
            value={formData.external_link}
            onChange={(e) => setFormData(prev => ({ ...prev, external_link: e.target.value }))}
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Images & Videos */}
      <div className={`bg-white rounded-xl border p-6 ${imagesVideosError ? 'border-red-500 border-2' : 'border-[var(--border)]'}`}>
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[var(--foreground)] mb-2">
            Images & Videos <span className="text-red-500">*</span>
          </h2>
          <p className="text-sm text-[var(--foreground-muted)]">
            Add at least one image or video to showcase your listing. Select a thumbnail image to display on the homepage.
          </p>
          {imagesVideosError && (
            <p className="text-sm text-red-600 mt-2 font-medium">
              ⚠️ At least one image or video is required
            </p>
          )}
        </div>
        <div className="space-y-4">
          <div className="flex gap-3">
            <Input
              value={newMediaUrl}
              onChange={(e) => setNewMediaUrl(e.target.value)}
              placeholder="Enter image or video URL"
              className="flex-1"
            />
            <Button type="button" variant="secondary" onClick={addMedia}>
              Add Image/Video
            </Button>
          </div>
          
          {formData.images.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-[var(--foreground-muted)] mb-2">Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Listing image ${index + 1}`}
                      className={`w-full h-24 object-cover rounded-lg border-2 transition-all ${
                        formData.thumbnail === url
                          ? "border-primary ring-2 ring-primary ring-offset-2"
                          : "border-transparent"
                      }`}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Invalid+URL";
                      }}
                    />
                    {formData.thumbnail === url && (
                      <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                        Thumbnail
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-lg">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, thumbnail: url }))}
                        className="px-3 py-1 bg-primary text-white text-xs rounded hover:bg-primary-light transition-colors"
                      >
                        Set as Thumbnail
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {formData.videos.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-[var(--foreground-muted)] mb-2">Videos</h3>
              <p className="text-xs text-[var(--foreground-muted)] mb-4">
                Click "Set as Thumbnail" to use a video thumbnail as the listing thumbnail.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.videos.map((url, index) => {
                  const videoThumbnail = getVideoThumbnail(url);
                  const isThumbnail = formData.thumbnail === videoThumbnail;
                  
                  return (
                    <div key={index} className="relative group">
                      <div className="w-full aspect-video bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden relative">
                        {videoThumbnail ? (
                          <>
                            <img
                              src={videoThumbnail}
                              alt={`Video thumbnail ${index + 1}`}
                              className={`w-full h-full object-cover border-2 transition-all ${
                                isThumbnail
                                  ? "border-primary ring-2 ring-primary ring-offset-2"
                                  : "border-transparent"
                              }`}
                              onError={(e) => {
                                // Fallback to iframe if thumbnail fails to load
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                            {isThumbnail && (
                              <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded z-10">
                                Thumbnail
                              </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-lg">
                              <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, thumbnail: videoThumbnail }))}
                                className={`px-3 py-1 text-white text-xs rounded hover:bg-primary-light transition-colors ${
                                  isThumbnail ? "bg-primary-light" : "bg-primary"
                                }`}
                              >
                                {isThumbnail ? "Thumbnail Selected" : "Set as Thumbnail"}
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            {url.includes('youtube.com') || url.includes('youtu.be') ? (
                              <iframe
                                src={url.includes('youtube.com/watch') 
                                  ? url.replace('watch?v=', 'embed/').split('&')[0]
                                  : url.replace('youtu.be/', 'youtube.com/embed/')}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            ) : url.includes('vimeo.com') ? (
                              <iframe
                                src={`https://player.vimeo.com/video/${url.split('/').pop()}`}
                                className="w-full h-full"
                                allow="autoplay; fullscreen; picture-in-picture"
                                allowFullScreen
                              />
                            ) : (
                              <video
                                src={url}
                                className="w-full h-full object-cover"
                                controls
                              />
                            )}
                            {isThumbnail && (
                              <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded z-10">
                                Thumbnail
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          // If this video's thumbnail is the current thumbnail, clear it
                          if (isThumbnail) {
                            setFormData(prev => ({ ...prev, thumbnail: null }));
                          }
                          removeVideo(index);
                        }}
                        className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Amenities/Features */}
      <div className="bg-white rounded-xl border border-[var(--border)] p-6">
        <h2 className="text-lg font-bold text-[var(--foreground)] mb-6">
          {formData.type === "accommodation" ? "Amenities" : "Features"}
        </h2>
        <div className="flex flex-wrap gap-3">
          {getAmenitiesList().map((amenity) => (
            <button
              key={amenity}
              type="button"
              onClick={() => toggleAmenity(amenity)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                formData.amenities.includes(amenity)
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--background-alt)] text-[var(--foreground)] hover:bg-[var(--border)]"
              }`}
            >
              {amenity}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-4">
        <Button type="submit" variant="primary" isLoading={loading}>
          {mode === "create" ? "Submit for Review" : "Save Changes"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

