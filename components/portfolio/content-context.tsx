"use client"

import * as React from "react"
import useSWR from "swr"
import { ContentState, defaultContent, FeaturedWriting, GalleryImage, Award } from "@/lib/content"

export type { SocialLink, ContentState, FeaturedWriting, GalleryImage, Award } from "@/lib/content"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Failed to load content")
  return res.json()
}

type ContentContextType = {
  content: ContentState
  updateContent: (section: keyof ContentState, field: string | null, value: any) => void
  saveContent: () => Promise<void>
  isLoading: boolean
}

const ContentContext = React.createContext<ContentContextType | undefined>(undefined)

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, mutate } = useSWR("/api/content/get", fetcher)
  const [content, setContent] = React.useState<ContentState>(defaultContent)

  React.useEffect(() => {
    if (data?.content) setContent(data.content)
  }, [data])

  const updateContent = React.useCallback((section: keyof ContentState, field: string | null, value: any) => {
    setContent(prev => {
      if (field === null) return { ...prev, [section]: value }
      return { ...prev, [section]: { ...(prev[section] as object), [field]: value } }
    })
  }, [])

  const saveContent = React.useCallback(async () => {
    const token = localStorage.getItem("admin-token") || ""
    const res = await fetch("/api/content/update", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ content }),
    })
    if (!res.ok) throw new Error("Failed to save")
    await mutate()
  }, [content, mutate])

  return <ContentContext.Provider value={{ content, updateContent, saveContent, isLoading }}>{children}</ContentContext.Provider>
}

export function useContent() {
  const context = React.useContext(ContentContext)
  if (!context) throw new Error("useContent must be used within a ContentProvider")
  return context
}
