"use client"

import { useState, useRef, useEffect } from "react"
import { useContent, FeaturedWriting, GalleryImage, Award } from "@/components/portfolio/content-context"
import { getVideoType, isValidVideoUrl, getAutoThumbnail } from "@/utils/video"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ArrowLeft, Save, LogOut, Home, User, BookOpen, 
  Image as ImageIcon, Award as AwardIcon, MessageSquare,
  Settings, Eye, EyeOff, CheckCircle, Upload, Trash2,
  Plus, Music, Mail, Key, Hash, Link as LinkIcon, Video, Users, Download, Camera, GripVertical, Menu, X, Inbox
} from "lucide-react"

interface AdminDashboardProps {
  onClose: () => void
  onLogout: () => void
}


interface ContactMessage {
  id: string
  name: string
  email: string
  inquiryType: string
  message: string
  createdAt: string
  status?: string
}

const menuItems = [
  { id: "hero", label: "Hero Section", icon: Home },
  { id: "navbar", label: "Navigation & Social", icon: Hash },
  { id: "about", label: "About & Video", icon: User },
  { id: "writings", label: "Featured Writings", icon: BookOpen },
  { id: "blog", label: "Blog", icon: BookOpen },
  { id: "publications", label: "Publications", icon: BookOpen },
  { id: "gallery", label: "Gallery", icon: ImageIcon },
  { id: "awards", label: "Awards", icon: AwardIcon },
  { id: "quote", label: "Featured Quote", icon: MessageSquare },
  { id: "contact", label: "Contact Info", icon: Mail },
  { id: "music", label: "Background Music", icon: Music },
  { id: "settings", label: "Section Visibility", icon: Eye },
  { id: "admin", label: "Admin Access", icon: Key },
  { id: "newsletter", label: "Newsletter Manager", icon: Users },
  { id: "messages", label: "Messages", icon: Inbox },
]

export function AdminDashboard({ onClose, onLogout }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState("hero")
  const [showSaveMessage, setShowSaveMessage] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { content, updateContent, saveContent } = useContent()

  const handleSave = async () => {
    try {
      await saveContent()
      setShowSaveMessage(true)
      setTimeout(() => setShowSaveMessage(false), 3000)
    } catch {
      alert("Failed to save changes")
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void, folder = "portfolio") => {
    const file = e.target.files?.[0]
    if (!file) return

    const token = localStorage.getItem("admin-token") || ""
    const formData = new FormData()
    formData.append("file", file)
    formData.append("folder", folder)

    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    })
    const data = await res.json()
    if (!res.ok) {
      alert(data.message || data.error || "Upload failed")
      return
    }
    callback(data.secure_url)
  }

  // Newsletter state
  const [subscribers, setSubscribers] = useState<{id: string, email: string, createdAt: string}[]>([])
  const [loadingSubscribers, setLoadingSubscribers] = useState(false)
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)

  useEffect(() => {
    if (activeSection === "newsletter") {
      setLoadingSubscribers(true)
      fetch("/api/newsletter/subscribers", { headers: { Authorization: `Bearer ${localStorage.getItem("admin-token") || ""}` } })
        .then(res => res.json())
        .then(data => {
          if (data.success) setSubscribers(data.subscribers || [])
        })
        .finally(() => setLoadingSubscribers(false))
    }

    if (activeSection === "messages") {
      setLoadingMessages(true)
      fetch("/api/messages/get", { headers: { Authorization: `Bearer ${localStorage.getItem("admin-token") || ""}` } })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setMessages(data.messages || [])
          }
        })
        .finally(() => setLoadingMessages(false))
    }
  }, [activeSection])

  const handleDeleteMessage = async (messageId: string) => {
    const token = localStorage.getItem("admin-token") || ""
    const res = await fetch("/api/messages/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ messageId }),
    })
    const data = await res.json()
    if (!res.ok || !data.success) {
      alert(data.message || "Failed to delete message")
      return
    }

    const remaining = messages.filter((msg) => msg.id !== messageId)
    setMessages(remaining)
    if (selectedMessage?.id === messageId) setSelectedMessage(null)
  }

  const handleClearMessages = async () => {
    if (!confirm("Delete all messages? This action cannot be undone.")) return
    const token = localStorage.getItem("admin-token") || ""
    const res = await fetch("/api/messages/clear", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json()
    if (!res.ok || !data.success) {
      alert(data.message || "Failed to clear messages")
      return
    }

    setMessages([])
    setSelectedMessage(null)
  }

  const exportMessagesCSV = () => {
    const headers = ["Name", "Email", "InquiryType", "Message", "Date"]
    const toCell = (value: string) => `"${(value || "").replace(/"/g, '""')}"`
    const csvContent = [
      headers.join(","),
      ...messages.map((message) => [
        toCell(message.name),
        toCell(message.email),
        toCell(message.inquiryType),
        toCell(message.message),
        toCell(new Date(message.createdAt).toISOString()),
      ].join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `contact_messages_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }


  const sendNewsletter = () => {
    if (subscribers.length === 0) return

    const bcc = subscribers
      .map((sub) => sub.email)
      .filter(Boolean)
      .join(",")

    const subject = encodeURIComponent("Tanvi Sirsat Newsletter")
    const mailto = `mailto:?bcc=${encodeURIComponent(bcc)}&subject=${subject}`
    window.open(mailto, "_blank", "noopener,noreferrer")
  }

  const exportCSV = () => {
    const headers = ["Email", "Date Subscribed"]
    const csvContent = [
      headers.join(","),
      ...subscribers.map(sub => `${sub.email},${new Date(sub.createdAt).toLocaleDateString()}`)
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Handlers for dynamic lists
  const addWriting = () => {
    const newItems = [...content.writings, { id: Date.now().toString(), title: "", image: "", desc: "", category: "", readUrl: "" }]
    updateContent("writings", null, newItems)
  }
  const updateWriting = (id: string, field: string, value: string) => {
    const newItems = content.writings.map(w => w.id === id ? { ...w, [field]: value } : w)
    updateContent("writings", null, newItems)
  }
  const removeWriting = (id: string) => {
    updateContent("writings", null, content.writings.filter(w => w.id !== id))
  }

  const addBlog = () => {
    const newItems = [...(content.blog || []), { id: Date.now().toString(), title: "", description: "", image: "", link: "" }]
    updateContent("blog", null, newItems)
  }
  const updateBlog = (id: string, field: string, value: string) => {
    const newItems = (content.blog || []).map(item => item.id === id ? { ...item, [field]: value } : item)
    updateContent("blog", null, newItems)
  }
  const removeBlog = (id: string) => {
    updateContent("blog", null, (content.blog || []).filter(item => item.id !== id))
  }

  const addPublication = () => {
    const newItems = [...(content.publications || []), { id: Date.now().toString(), title: "", description: "", image: "", link: "" }]
    updateContent("publications", null, newItems)
  }
  const updatePublication = (id: string, field: string, value: string) => {
    const newItems = (content.publications || []).map(item => item.id === id ? { ...item, [field]: value } : item)
    updateContent("publications", null, newItems)
  }
  const removePublication = (id: string) => {
    updateContent("publications", null, (content.publications || []).filter(item => item.id !== id))
  }

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("imageId", id)
  }

  const handleDrop = (e: React.DragEvent, dropId: string) => {
    e.preventDefault()
    const dragId = e.dataTransfer.getData("imageId")
    if (dragId === dropId) return

    const newGallery = [...content.gallery]
    const dragIndex = newGallery.findIndex(g => g.id === dragId)
    const dropIndex = newGallery.findIndex(g => g.id === dropId)
    
    if (dragIndex > -1 && dropIndex > -1) {
      const [draggedItem] = newGallery.splice(dragIndex, 1)
      newGallery.splice(dropIndex, 0, draggedItem)
      updateContent("gallery", null, newGallery)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const addGallery = () => {
    const newItems = [...content.gallery, { id: Date.now().toString(), url: "", caption: "", year: "" }]
    updateContent("gallery", null, newItems)
  }
  const updateGallery = (id: string, field: string, value: string) => {
    const newItems = content.gallery.map(g => g.id === id ? { ...g, [field]: value } : g)
    updateContent("gallery", null, newItems)
  }
  const removeGallery = (id: string) => {
    updateContent("gallery", null, content.gallery.filter(g => g.id !== id))
  }

  const addAward = () => {
    const newItems = [...content.awards.list, { id: Date.now().toString(), title: "", year: "", org: "", description: "" }]
    updateContent("awards", "list", newItems)
  }
  const updateAward = (id: string, field: string, value: string) => {
    const newItems = content.awards.list.map(a => a.id === id ? { ...a, [field]: value } : a)
    updateContent("awards", "list", newItems)
  }
  const removeAward = (id: string) => {
    updateContent("awards", "list", content.awards.list.filter(a => a.id !== id))
  }

  return (
    <div className="relative flex h-[80vh] min-h-[540px] overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar overlay"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`hide-scrollbar absolute inset-y-0 left-0 z-30 flex w-[85%] max-w-xs flex-col border-r border-border bg-purple-700 text-white transition-transform duration-300 lg:relative lg:w-64 lg:max-w-none lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="border-b border-border p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <span className="text-lg font-medium text-primary">Edit Dashboard</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-muted lg:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <nav className="hide-scrollbar flex-1 space-y-1 overflow-y-auto p-3">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveSection(item.id); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeSection === item.id
                  ? "bg-primary text-primary-foreground font-medium"
                  : "hover:bg-white/10 text-purple-100 hover:text-white"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="p-3 border-t border-border">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-100 hover:bg-red-500/80 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-background bg-cover bg-center"
        style={{ backgroundImage: "linear-gradient(rgba(17, 8, 35, 0.78), rgba(17, 8, 35, 0.82)), url(/banner.jpg)" }}>
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-background p-3 sm:p-4 lg:p-6">
          <div className="flex items-center gap-2"><button onClick={() => setSidebarOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-lg border border-border hover:bg-muted lg:hidden"><Menu className="h-5 w-5" /></button><h2 className="font-serif text-lg tracking-tight text-primary sm:text-2xl">
            {menuItems.find(m => m.id === activeSection)?.label}
          </h2></div>
          <button
            onClick={handleSave}
            className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-md transition-all hover:bg-primary/90 active:scale-95 sm:px-4 sm:py-2.5"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>

        {/* Content Area */}
        <div className="hide-scrollbar flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="max-w-3xl mx-auto space-y-8 pb-12">
            
            {activeSection === "hero" && (
              <div className="space-y-6">
                <div className="grid gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Author Name</label>
                    <input
                      type="text"
                      value={content.hero.name}
                      onChange={(e) => updateContent("hero", "name", e.target.value)}
                      className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Badge Text</label>
                    <input
                      type="text"
                      value={content.hero.badge}
                      onChange={(e) => updateContent("hero", "badge", e.target.value)}
                      className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hero Description (Subtitle)</label>
                    <input
                      type="text"
                      value={content.hero.subtitle}
                      onChange={(e) => updateContent("hero", "subtitle", e.target.value)}
                      className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hero Quote</label>
                    <textarea
                      value={content.hero.quote}
                      onChange={(e) => updateContent("hero", "quote", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center justify-between">
                      <span>Profile Photo</span>
                      {content.hero.profilePhoto && (
                        <button onClick={() => updateContent("hero", "profilePhoto", "")} className="text-xs text-destructive hover:underline">Remove</button>
                      )}
                    </label>
                    <label className="border-2 border-dashed border-primary/20 bg-primary/5 rounded-xl p-8 text-center hover:bg-primary/10 hover:border-primary/50 transition-all cursor-pointer block group">
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (res) => updateContent("hero", "profilePhoto", res))} />
                      {content.hero.profilePhoto ? (
                        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-background shadow-lg relative">
                          <img loading="lazy" src={content.hero.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera className="w-6 h-6 text-white"/></div>
                        </div>
                      ) : (
                        <>
                          <div className="bg-background w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-border">
                            <Camera className="w-6 h-6 text-primary" />
                          </div>
                          <p className="font-medium text-foreground">Add Profile Photo</p>
                          <p className="text-xs text-muted-foreground mt-1">PNG, JPG recommended</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "navbar" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-serif mb-4 flex items-center gap-2 text-primary border-b border-border pb-2"><Hash className="w-5 h-5"/> Navbar Titles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["about", "writings", "blog", "publications", "awards", "gallery", "contact"].map(key => (
                      <div key={key}>
                        <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-2">{key}</label>
                        <input
                          type="text"
                          value={content.navbar[key as keyof typeof content.navbar]}
                          onChange={(e) => updateContent("navbar", key, e.target.value)}
                          className="w-full px-4 py-2.5 bg-card border border-border rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-serif mb-4 flex items-center gap-2 text-primary border-b border-border pb-2"><LinkIcon className="w-5 h-5"/> Social Links</h3>
                  <div className="grid gap-4">
                    {["twitter", "instagram", "linkedin", "medium"].map(key => (
                      <div key={key} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                        <label className="w-20 shrink-0 text-sm font-medium capitalize sm:w-24">{key}</label>
                        <input
                          type="text"
                          placeholder={`https://${key}.com/...`}
                          value={content.social[key as keyof typeof content.social] as string}
                          onChange={(e) => updateContent("social", key, e.target.value)}
                          className="flex-1 px-4 py-2.5 bg-card border border-border rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === "about" && (
              <div className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-serif border-b border-border pb-2 text-primary flex items-center gap-2"><User className="w-5 h-5"/> About Section</h3>
                  <div>
                    <label className="block text-sm font-medium mb-2">Section Title</label>
                    <input
                      type="text"
                      value={content.about.title}
                      onChange={(e) => updateContent("about", "title", e.target.value)}
                      className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Biography</label>
                    <textarea
                      value={content.about.bio}
                      onChange={(e) => updateContent("about", "bio", e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-purple-500 resize-y"
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-lg font-serif border-b border-border pb-2 text-primary flex items-center gap-2"><Video className="w-5 h-5"/> "Meet Tanvi" Video Intro</h3>
                  <p className="text-sm text-muted-foreground mb-4">Upload a video to introduce yourself to readers.</p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Video Title</label>
                      <input
                        type="text"
                        value={content.video.title}
                        onChange={(e) => updateContent("video", "title", e.target.value)}
                        placeholder="An Introduction"
                        className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Button Label</label>
                      <input
                        type="text"
                        value={content.video.caption}
                        onChange={(e) => updateContent("video", "caption", e.target.value)}
                        placeholder="Meet Tanvi"
                        className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center justify-between">
                      <span>Video Thumbnail Cover</span>
                      {content.video.thumbnail && (
                        <button onClick={() => updateContent("video", "thumbnail", "")} className="text-xs text-destructive hover:underline">Remove Custom</button>
                      )}
                    </label>
                    {(() => {
                      const autoThumb = getAutoThumbnail(content.video.url, content.video.thumbnail)
                      const isAuto = !content.video.thumbnail && !!autoThumb
                      return (
                        <>
                          <label className="flex flex-col items-center justify-center aspect-[21/9] border-2 border-dashed border-border rounded-xl relative overflow-hidden group hover:border-primary/50 cursor-pointer bg-muted/30">
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (res) => updateContent("video", "thumbnail", res))} />
                            {autoThumb ? (
                              <>
                                <img src={autoThumb} loading="lazy" alt="Thumbnail" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Camera className="w-8 h-8 text-white" />
                                </div>
                                {isAuto && (
                                  <div className="absolute top-2 left-2 z-10 px-2.5 py-1 bg-black/60 text-white text-[10px] font-semibold uppercase tracking-wider rounded-full backdrop-blur-sm">
                                    Auto-generated from YouTube
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="text-center text-muted-foreground">
                                <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                <span className="text-sm">Add Thumbnail Image</span>
                              </div>
                            )}
                          </label>
                          <p className="text-xs text-muted-foreground mt-2">
                            {isAuto
                              ? "Thumbnail auto-generated from YouTube. Upload a custom image to override."
                              : "Recommended size: 1920×1080px. YouTube videos will auto-generate a thumbnail."
                            }
                          </p>
                        </>
                      )
                    })()}
                  </div>
                  <div className="pt-4 border-t border-border">
                     <label className="block text-sm font-medium mb-2">Video Source URL</label>
                     <input
                        type="text"
                        placeholder="Paste YouTube, Vimeo, or direct video URL"
                        value={content.video.url}
                        onChange={(e) => updateContent("video", "url", e.target.value)}
                        className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-purple-500"
                     />
                     <div className="flex items-center gap-2 mt-2">
                        {content.video.url ? (
                           isValidVideoUrl(content.video.url) ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400">
                                 <span className="w-2 h-2 rounded-full bg-green-500" />
                                 {getVideoType(content.video.url) === "youtube" && "YouTube video detected"}
                                 {getVideoType(content.video.url) === "vimeo" && "Vimeo video detected"}
                                 {getVideoType(content.video.url) === "mp4" && "Local video file detected"}
                              </span>
                           ) : (
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-destructive">
                                 <span className="w-2 h-2 rounded-full bg-destructive" />
                                 Invalid video link. Please enter a valid YouTube or Vimeo URL.
                              </span>
                           )
                        ) : (
                           <span className="text-xs text-muted-foreground">Supports: YouTube, Vimeo, or MP4 upload. If empty, the video section will not be displayed.</span>
                        )}
                     </div>
                  </div>
                  <div className="text-center p-6 border border-dashed border-border rounded-xl bg-muted/30">
                     <p className="text-sm font-medium mb-2">Or Upload MP4 Video</p>
                     <label className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-lg cursor-pointer hover:bg-secondary/80 text-sm">
                        <Video className="w-4 h-4" /> Upload Video
                        <input type="file" accept="video/mp4" className="hidden" onChange={(e) => handleFileUpload(e, (res) => updateContent("video", "url", res))} />
                     </label>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "writings" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">Manage your featured essays and articles.</p>
                  <button onClick={addWriting} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-all">
                    <Plus className="w-4 h-4" /> Add Entry
                  </button>
                </div>

                <AnimatePresence>
                  {content.writings.length === 0 && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-center p-12 border-2 border-dashed border-border rounded-xl">
                      <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">No featured writings added. Click "Add Entry" to begin.</p>
                    </motion.div>
                  )}
                  {content.writings.map((writing, index) => (
                    <motion.div 
                      key={writing.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-card rounded-xl p-6 border border-border shadow-sm flex flex-col md:flex-row gap-6 relative group"
                    >
                      <button onClick={() => removeWriting(writing.id)} className="absolute -top-3 -right-3 w-8 h-8 bg-destructive text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      
                      <div className="w-full md:w-1/3">
                         <label className="border-2 border-dashed border-border rounded-xl h-32 flex items-center justify-center bg-muted/50 cursor-pointer hover:border-primary/50 overflow-hidden relative group/img">
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, res => updateWriting(writing.id, "image", res))} />
                            {writing.image ? (
                               <img src={writing.image} loading="lazy" alt={writing.title} className="w-full h-full object-cover" />
                            ) : (
                               <div className="text-center text-muted-foreground">
                                  <Camera className="w-6 h-6 mx-auto mb-2 opacity-50" />
                                  <span className="text-xs">Add Cover</span>
                               </div>
                            )}
                         </label>
                      </div>

                      <div className="flex-1 space-y-4">
                        <input
                          type="text"
                          placeholder="Title"
                          value={writing.title}
                          onChange={(e) => updateWriting(writing.id, "title", e.target.value)}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg font-serif text-lg focus:ring-2 focus:ring-purple-500"
                        />
                        <div className="grid grid-cols-2 gap-4">
                           <input
                              type="text"
                              placeholder="Category (e.g., Essay, Memoir)"
                              value={writing.category}
                              onChange={(e) => updateWriting(writing.id, "category", e.target.value)}
                              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                           />
                           <input
                              type="text"
                              placeholder="Link URL"
                              value={writing.readUrl}
                              onChange={(e) => updateWriting(writing.id, "readUrl", e.target.value)}
                              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                           />
                        </div>
                        <textarea
                          placeholder="Short description..."
                          value={writing.desc}
                          onChange={(e) => updateWriting(writing.id, "desc", e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm resize-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

            {activeSection === "blog" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">Manage blog cards.</p>
                  <button onClick={addBlog} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-all">
                    <Plus className="w-4 h-4" /> Add Entry
                  </button>
                </div>
                {(content.blog || []).length === 0 ? (
                  <div className="text-center p-12 border-2 border-dashed border-border rounded-xl text-muted-foreground">No blog entries yet.</div>
                ) : (
                  <div className="space-y-4">{(content.blog || []).map((item) => (
                    <div key={item.id} className="bg-card rounded-xl p-4 border border-border space-y-3">
                      <div className="flex justify-end"><button onClick={() => removeBlog(item.id)} className="text-destructive"><Trash2 className="w-4 h-4" /></button></div>
                      <input value={item.title} onChange={(e) => updateBlog(item.id, "title", e.target.value)} placeholder="Title" className="w-full px-3 py-2 bg-background border border-border rounded-lg" />
                      <textarea value={item.description} onChange={(e) => updateBlog(item.id, "description", e.target.value)} placeholder="Description" className="w-full px-3 py-2 bg-background border border-border rounded-lg" rows={3} />
                      <input value={item.link} onChange={(e) => updateBlog(item.id, "link", e.target.value)} placeholder="Link" className="w-full px-3 py-2 bg-background border border-border rounded-lg" />
                      <label className="border border-dashed border-border rounded-lg p-4 text-sm text-center cursor-pointer block">Upload image
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (res) => updateBlog(item.id, "image", res))} />
                      </label>
                    </div>
                  ))}</div>
                )}
              </div>
            )}

            {activeSection === "publications" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">Manage publication cards.</p>
                  <button onClick={addPublication} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-all">
                    <Plus className="w-4 h-4" /> Add Entry
                  </button>
                </div>
                {(content.publications || []).length === 0 ? (
                  <div className="text-center p-12 border-2 border-dashed border-border rounded-xl text-muted-foreground">No publications yet.</div>
                ) : (
                  <div className="space-y-4">{(content.publications || []).map((item) => (
                    <div key={item.id} className="bg-card rounded-xl p-4 border border-border space-y-3">
                      <div className="flex justify-end"><button onClick={() => removePublication(item.id)} className="text-destructive"><Trash2 className="w-4 h-4" /></button></div>
                      <input value={item.title} onChange={(e) => updatePublication(item.id, "title", e.target.value)} placeholder="Title" className="w-full px-3 py-2 bg-background border border-border rounded-lg" />
                      <textarea value={item.description} onChange={(e) => updatePublication(item.id, "description", e.target.value)} placeholder="Description" className="w-full px-3 py-2 bg-background border border-border rounded-lg" rows={3} />
                      <input value={item.link} onChange={(e) => updatePublication(item.id, "link", e.target.value)} placeholder="Link" className="w-full px-3 py-2 bg-background border border-border rounded-lg" />
                      <label className="border border-dashed border-border rounded-lg p-4 text-sm text-center cursor-pointer block">Upload image
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, (res) => updatePublication(item.id, "image", res))} />
                      </label>
                    </div>
                  ))}</div>
                )}
              </div>
            )}

            {activeSection === "gallery" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">Manage portfolio images.</p>
                  <button onClick={addGallery} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-all">
                    <Plus className="w-4 h-4" /> Add Image
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnimatePresence>
                  {content.gallery.length === 0 && (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="col-span-full text-center p-12 border-2 border-dashed border-border rounded-xl">
                      <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-muted-foreground">No gallery images added.</p>
                    </motion.div>
                  )}
                  {content.gallery.map((img) => (
                    <motion.div 
                      key={img.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      draggable
                      onDragStart={(e) => handleDragStart(e as unknown as React.DragEvent, img.id)}
                      onDrop={(e) => handleDrop(e as unknown as React.DragEvent, img.id)}
                      onDragOver={handleDragOver}
                      className="bg-card rounded-xl border border-border shadow-sm overflow-hidden relative group cursor-grab active:cursor-grabbing"
                    >
                      <div className="absolute top-2 left-2 z-10 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm cursor-grab">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <button onClick={() => removeGallery(img.id)} className="absolute top-2 right-2 z-10 w-8 h-8 bg-black/60 hover:bg-destructive text-white rounded-full flex items-center justify-center transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <label className="block aspect-[4/3] bg-muted relative cursor-pointer group/img">
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, res => updateGallery(img.id, "url", res))} />
                        {img.url ? (
                           <img src={img.url} loading="lazy" alt="Gallery" className="w-full h-full object-cover" />
                        ) : (
                           <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                              <Camera className="w-8 h-8 mb-2 opacity-50" />
                              <span className="text-sm font-medium">Add Image</span>
                           </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col justify-center items-center text-white backdrop-blur-sm">
                           <Upload className="w-6 h-6 mb-2" />
                           <span className="text-xs font-medium uppercase tracking-wider">Replace</span>
                        </div>
                      </label>
                      <div className="p-4 space-y-3">
                        <input type="text" placeholder="Caption (optional)" value={img.caption} onChange={e => updateGallery(img.id, "caption", e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-purple-500" />
                        <input type="text" placeholder="Year" value={img.year} onChange={e => updateGallery(img.id, "year", e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:ring-2 focus:ring-purple-500" />
                      </div>
                    </motion.div>
                  ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {activeSection === "awards" && (
              <div className="space-y-8">
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-center justify-between">
                   <div>
                      <h4 className="font-medium">Total Awards Count</h4>
                      <p className="text-sm text-muted-foreground">Used for the floating hero badge "X+ Awards"</p>
                   </div>
                   <div className="flex items-center gap-3">
                      <input 
                         type="number" 
                         value={content.awards.countNumber} 
                         onChange={e => updateContent("awards", "countNumber", parseInt(e.target.value) || 0)}
                         className="w-24 px-4 py-2 border border-border rounded-lg text-center font-bold text-lg bg-background"
                      />
                   </div>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-8">
                  <h3 className="font-serif text-lg text-primary">Awards List</h3>
                  <button onClick={addAward} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-all">
                    <Plus className="w-4 h-4" /> Add Award
                  </button>
                </div>
                
                <div className="space-y-4">
                  {content.awards.list.length === 0 && (
                     <div className="text-center p-8 border border-dashed border-border rounded-xl text-muted-foreground text-sm">No awards added.</div>
                  )}
                  {content.awards.list.map((award) => (
                    <div key={award.id} className="bg-card rounded-xl p-4 border border-border flex items-center gap-4 relative">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          placeholder="Award name (e.g. Booker Prize)"
                          value={award.title}
                          onChange={e => updateAward(award.id, "title", e.target.value)}
                          className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                          type="text"
                          placeholder="Year"
                          value={award.year}
                          onChange={e => updateAward(award.id, "year", e.target.value)}
                          className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                        />
                        <input
                          type="text"
                          placeholder="Organization"
                          value={award.org}
                          onChange={e => updateAward(award.id, "org", e.target.value)}
                          className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                        />
                        <textarea
                          placeholder="Description"
                          value={award.description || ""}
                          onChange={e => updateAward(award.id, "description", e.target.value)}
                          className="md:col-span-3 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
                          rows={2}
                        />
                      </div>
                      <button onClick={() => removeAward(award.id)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "quote" && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-4 flex items-center gap-2 text-primary"><MessageSquare className="w-5 h-5"/> Featured Big Quote</label>
                  <textarea
                    value={content.quote.text}
                    onChange={(e) => updateContent("quote", "text", e.target.value)}
                    rows={5}
                    placeholder="Enter the standout quote..."
                    className="w-full px-6 py-5 bg-card border border-border rounded-xl focus:ring-2 focus:ring-purple-500 resize-y font-serif text-2xl text-center leading-relaxed italic"
                  />
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    This block quote serves as a powerful standalone statement.
                  </p>
                </div>
              </div>
            )}

            {activeSection === "contact" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-serif mb-4 text-primary pb-2 border-b border-border">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Public Email</label>
                      <input type="email" value={content.contact.email} onChange={e => updateContent("contact", "email", e.target.value)} className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Location</label>
                      <input type="text" value={content.contact.location} onChange={e => updateContent("contact", "location", e.target.value)} className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-purple-500" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-serif mb-4 text-primary pb-2 border-b border-border">Literary Agent</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Agent Name</label>
                      <input type="text" value={content.contact.agentName} onChange={e => updateContent("contact", "agentName", e.target.value)} className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Agency / Organization</label>
                      <input type="text" value={content.contact.agentOrg} onChange={e => updateContent("contact", "agentOrg", e.target.value)} className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-purple-500" />
                    </div>
                  </div>
                </div>

                <div>
                   <h3 className="text-lg font-serif mb-4 text-primary pb-2 border-b border-border">Form Submission</h3>
                   <div>
                      <label className="block text-sm font-medium mb-2">Receiver Email Address</label>
                      <input type="email" value={content.contact.receiverEmail} onChange={e => updateContent("contact", "receiverEmail", e.target.value)} placeholder="hello@tanvisirsat.com" className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:ring-2 focus:ring-purple-500" />
                      <p className="text-xs text-muted-foreground mt-2">Emails sent via the contact form will be forwarded to this address.</p>
                   </div>
                </div>
              </div>
            )}

            {activeSection === "music" && (
              <div className="space-y-8">
                 <div className="bg-primary/5 p-6 rounded-xl border border-primary/20">
                    <div className="flex gap-4 items-start">
                       <div className="p-3 bg-primary/10 rounded-full text-primary">
                          <Music className="w-6 h-6" />
                       </div>
                       <div>
                          <h4 className="font-serif text-lg text-primary mb-1">Ambient Website Music</h4>
                          <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                             This music will play softly on the website when visitors enable it. It adds a premium atmosphere to the reading experience. The music is paused by default.
                          </p>
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                             <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" checked={content.music.enabled} onChange={(e) => updateContent("music", "enabled", e.target.checked)} />
                                <div className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${content.music.enabled ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${content.music.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                                </div>
                                <span className={`ml-3 font-medium text-sm ${content.music.enabled ? 'text-primary' : 'text-muted-foreground'}`}>Enable Music Feature on Website</span>
                             </label>
                          </div>
                       </div>
                    </div>
                 </div>

                 {content.music.enabled && (
                    <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="space-y-6">
                       <div>
                          <label className="block text-sm font-medium mb-3">Upload Audio Track (MP3/WAV)</label>
                          <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl p-8 hover:bg-muted/50 transition-colors cursor-pointer">
                             <input type="file" accept="audio/*" className="hidden" onChange={(e) => handleFileUpload(e, res => updateContent("music", "fileUrl", res))} />
                             <Music className="w-10 h-10 text-muted-foreground mb-3" />
                             <span className="text-sm font-medium">Click to select audio file</span>
                             {content.music.fileUrl && <span className="text-xs text-primary mt-2 font-mono truncate max-w-[200px]">Audio Loaded</span>}
                          </label>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-6 p-6 bg-card rounded-xl border border-border">
                          <div>
                             <label className="block text-sm font-medium mb-4 flex justify-between">
                                <span>Default Volume</span>
                                <span className="text-primary">{content.music.volume}%</span>
                             </label>
                             <input type="range" min="0" max="100" value={content.music.volume} onChange={(e) => updateContent("music", "volume", parseInt(e.target.value))} className="w-full accent-primary" />
                          </div>
                          <div className="flex items-center justify-end">
                             <label className="inline-flex items-center cursor-pointer">
                                <span className="mr-3 font-medium text-sm">Loop the Track</span>
                                <input type="checkbox" className="sr-only peer" checked={content.music.loop} onChange={(e) => updateContent("music", "loop", e.target.checked)} />
                                <div className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${content.music.loop ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                                  <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${content.music.loop ? 'translate-x-[20px]' : 'translate-x-0'}`} />
                                </div>
                             </label>
                          </div>
                       </div>
                    </motion.div>
                 )}
              </div>
            )}

            {activeSection === "settings" && (
              <div className="space-y-8">
                <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
                  <h3 className="font-serif text-lg mb-2 text-primary">Global Visibility Toggles</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Turn entire website sections ON or OFF instantly. The navigation bar will automatically update.
                  </p>
                  
                  <div className="space-y-1">
                    {Object.entries(content.visibility).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-4 border-b border-border/50 last:border-0 hover:bg-muted/30 px-4 -mx-4 rounded-lg transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${value ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                             {value ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </div>
                          <div className="flex flex-col">
                             <span className="font-medium capitalize">{key} Section</span>
                             <span className="text-xs text-muted-foreground">Appears {value ? 'publicly' : 'hidden'} on the homepage</span>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                           <input type="checkbox" className="sr-only peer" checked={value} onChange={() => updateContent("visibility", key, !value)} />
                           <div className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${value ? 'bg-primary' : 'bg-muted-foreground/30'}`}>
                             <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${value ? 'translate-x-5' : 'translate-x-0'}`} />
                           </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === "admin" && (
              <div className="space-y-6">
                 <div>
                    <h3 className="text-lg font-serif mb-4 flex items-center gap-2 text-primary border-b border-border pb-2"><Key className="w-5 h-5"/> Access Credentials</h3>
                    <div className="max-w-md bg-card p-6 border border-border rounded-xl">
                       <label className="block text-sm font-medium mb-3">Admin Dashboard Password</label>
                       <input 
                          type="text" 
                          value={content.admin.pass} 
                          onChange={e => updateContent("admin", "pass", e.target.value)}
                          className="w-full px-4 py-3 border border-border bg-background rounded-lg focus:ring-2 focus:ring-purple-500"
                       />
                       <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                          This is the password used to bypass the double-click lock on the main website. Ensure it is strong.
                       </p>
                    </div>
                 </div>
              </div>
            )}

            {activeSection === "newsletter" && (
              <div className="space-y-6">
                <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-serif flex items-center gap-2 text-primary">
                      <Users className="w-5 h-5"/> Newsletter Manager
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">Manage and export your newsletter subscribers.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={sendNewsletter}
                    disabled={subscribers.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
                  >
                    <Mail className="w-4 h-4" /> Send Newsletter
                  </button>
                  <button 
                    onClick={exportCSV} 
                    disabled={subscribers.length === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-all disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" /> Export CSV
                  </button>
                  </div>
                </div>

                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                  <div className="grid grid-cols-2 p-4 border-b border-border bg-muted/50 font-medium text-sm text-muted-foreground">
                    <div>Email Address</div>
                    <div>Date Subscribed</div>
                  </div>
                  {loadingSubscribers ? (
                    <div className="p-12 text-center text-muted-foreground flex justify-center items-center gap-3">
                      <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      Loading subscribers...
                    </div>
                  ) : subscribers.length === 0 ? (
                    <div className="p-12 text-center text-muted-foreground">
                      No subscribers found yet.
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {subscribers.map(sub => (
                        <div key={sub.id} className="grid grid-cols-2 p-4 text-sm hover:bg-muted/10 transition-colors">
                          <div className="font-medium">{sub.email}</div>
                          <div className="text-muted-foreground">{new Date(sub.createdAt).toLocaleDateString()}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeSection === "messages" && (
              <div className="space-y-6">
                <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-lg font-serif flex items-center gap-2 text-primary">
                      <Inbox className="w-5 h-5"/> Messages
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">Read, reply, delete, clear, and export contact messages.</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleClearMessages}
                      disabled={messages.length === 0}
                      className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg font-medium hover:bg-destructive hover:text-white transition-all disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" /> Clear All Messages
                    </button>
                    <button
                      onClick={exportMessagesCSV}
                      disabled={messages.length === 0}
                      className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-all disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" /> Export Messages
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="space-y-3">
                    {loadingMessages ? (
                      <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">Loading messages...</div>
                    ) : messages.length === 0 ? (
                      <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">No messages received yet.</div>
                    ) : (
                      messages.map((message) => (
                        <button
                          key={message.id}
                          onClick={() => setSelectedMessage(message)}
                          className={`w-full rounded-xl border bg-card p-4 text-left transition-colors hover:bg-muted/20 ${selectedMessage?.id === message.id ? "border-primary" : "border-border"}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-medium text-foreground">{message.name}</p>
                              <p className="text-sm text-muted-foreground break-all">{message.email}</p>
                            </div>
                            <span className="text-xs text-muted-foreground">{new Date(message.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="mt-2 text-xs uppercase tracking-wide text-primary">{message.inquiryType}</p>
                          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{message.message}</p>
                        </button>
                      ))
                    )}
                  </div>

                  <div className="rounded-xl border border-border bg-card p-5">
                    {selectedMessage ? (
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-lg font-serif text-primary">{selectedMessage.name}</h4>
                          <p className="text-sm text-muted-foreground break-all">{selectedMessage.email}</p>
                          <p className="mt-1 text-xs uppercase tracking-wide text-primary">{selectedMessage.inquiryType}</p>
                          <p className="mt-1 text-xs text-muted-foreground">Received {new Date(selectedMessage.createdAt).toLocaleString()}</p>
                        </div>
                        <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">{selectedMessage.message}</p>
                        <div className="flex flex-wrap gap-2">
                          <a
                            href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent("Re: Your message to Tanvi Sirsat")}`}
                            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                          >
                            <Mail className="w-4 h-4" /> Reply
                          </a>
                          <button
                            onClick={() => handleDeleteMessage(selectedMessage.id)}
                            className="inline-flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="py-8 text-center text-sm text-muted-foreground">Select a message to view the full details.</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
         {showSaveMessage && (
            <motion.div
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="fixed bottom-8 right-8 bg-primary text-primary-foreground px-6 py-4 rounded-xl shadow-2xl border border-white/20 flex items-center gap-3 z-50 backdrop-blur-md"
            >
               <CheckCircle className="w-5 h-5" />
               <span className="font-medium">All changes applied successfully to the website!</span>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  )
}
