/**
 * Video URL utilities for YouTube, Vimeo, and local MP4 support.
 */

export type VideoType = "youtube" | "vimeo" | "mp4" | "unknown"

/**
 * Detect the type of video from a URL string.
 */
export function getVideoType(url: string): VideoType {
  if (!url) return "unknown"

  // Data URLs from local file uploads (base64 encoded)
  if (url.startsWith("data:video/")) return "mp4"

  // Local file paths or blob URLs
  if (url.endsWith(".mp4") || url.endsWith(".webm") || url.endsWith(".ogg")) return "mp4"
  if (url.startsWith("blob:")) return "mp4"

  // YouTube
  if (
    url.includes("youtube.com") ||
    url.includes("youtu.be") ||
    url.includes("youtube-nocookie.com")
  ) {
    return "youtube"
  }

  // Vimeo
  if (url.includes("vimeo.com")) {
    return "vimeo"
  }

  return "unknown"
}

/**
 * Extract the YouTube video ID from various URL formats:
 *   - https://www.youtube.com/watch?v=VIDEO_ID
 *   - https://youtu.be/VIDEO_ID
 *   - https://www.youtube.com/embed/VIDEO_ID
 *   - https://www.youtube-nocookie.com/embed/VIDEO_ID
 */
export function extractYouTubeId(url: string): string | null {
  // Already an embed URL → grab the last path segment
  const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/)
  if (embedMatch) return embedMatch[1]

  const noCookieMatch = url.match(/youtube-nocookie\.com\/embed\/([a-zA-Z0-9_-]+)/)
  if (noCookieMatch) return noCookieMatch[1]

  // Standard watch URL
  const watchMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/)
  if (watchMatch) return watchMatch[1]

  // Short URL
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/)
  if (shortMatch) return shortMatch[1]

  return null
}

/**
 * Extract the Vimeo video ID from various URL formats:
 *   - https://vimeo.com/VIDEO_ID
 *   - https://player.vimeo.com/video/VIDEO_ID
 */
export function extractVimeoId(url: string): string | null {
  const playerMatch = url.match(/player\.vimeo\.com\/video\/(\d+)/)
  if (playerMatch) return playerMatch[1]

  const standardMatch = url.match(/vimeo\.com\/(\d+)/)
  if (standardMatch) return standardMatch[1]

  return null
}

/**
 * Convert any supported video URL into a proper embeddable URL.
 * Returns null if the URL is invalid or unrecognised.
 */
export function getEmbedUrl(url: string): string | null {
  const type = getVideoType(url)

  switch (type) {
    case "youtube": {
      const id = extractYouTubeId(url)
      if (!id) return null
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
    }
    case "vimeo": {
      const id = extractVimeoId(url)
      if (!id) return null
      return `https://player.vimeo.com/video/${id}?autoplay=1`
    }
    case "mp4":
      return url // pass through as-is for <video> element
    default:
      return null
  }
}

/**
 * Validate that a video URL is recognisable and can be rendered.
 */
export function isValidVideoUrl(url: string): boolean {
  if (!url) return false
  const type = getVideoType(url)
  if (type === "mp4") return true
  if (type === "youtube") return !!extractYouTubeId(url)
  if (type === "vimeo") return !!extractVimeoId(url)
  return false
}

/**
 * Get a YouTube thumbnail URL for a given video ID.
 * Uses maxresdefault for best quality, with hqdefault as fallback.
 */
export function getYouTubeThumbnail(
  videoId: string,
  quality: "maxresdefault" | "hqdefault" | "mqdefault" | "sddefault" = "maxresdefault"
): string {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`
}

/**
 * Get the best available thumbnail for a video.
 *
 * Priority:
 *   1. Custom thumbnail uploaded by admin
 *   2. Auto-generated YouTube thumbnail (if YouTube video)
 *   3. null (caller should show a placeholder)
 */
export function getAutoThumbnail(
  videoUrl: string,
  customThumbnail?: string
): string | null {
  // 1. Custom thumbnail always wins
  if (customThumbnail) return customThumbnail

  // 2. YouTube auto-thumbnail
  const type = getVideoType(videoUrl)
  if (type === "youtube") {
    const id = extractYouTubeId(videoUrl)
    if (id) return getYouTubeThumbnail(id)
  }

  // 3. No thumbnail available
  return null
}
