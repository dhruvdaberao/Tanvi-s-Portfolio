"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  ArrowLeft, 
  Save, 
  LogOut, 
  Home, 
  User, 
  BookOpen, 
  Image as ImageIcon, 
  Award, 
  MessageSquare,
  Settings,
  Eye,
  EyeOff,
  CheckCircle,
  Upload
} from "lucide-react"

interface AdminDashboardProps {
  onClose: () => void
  onLogout: () => void
}

const menuItems = [
  { id: "hero", label: "Hero Section", icon: Home },
  { id: "about", label: "About", icon: User },
  { id: "writings", label: "Featured Writings", icon: BookOpen },
  { id: "gallery", label: "Gallery", icon: ImageIcon },
  { id: "awards", label: "Awards", icon: Award },
  { id: "quote", label: "Featured Quote", icon: MessageSquare },
  { id: "settings", label: "Section Visibility", icon: Settings },
]

export function AdminDashboard({ onClose, onLogout }: AdminDashboardProps) {
  const [activeSection, setActiveSection] = useState("hero")
  const [showSaveMessage, setShowSaveMessage] = useState(false)
  
  // Content state
  const [content, setContent] = useState({
    hero: {
      badge: "Award-Winning Author",
      subtitle: "Writer & Essayist",
      quote: "Words have the power to change the world.",
      name: "Tanvi Sirsat",
    },
    about: {
      title: "Crafting stories that resonate",
      bio: "I am Tanvi Sirsat, a writer exploring the intersections of memory, identity, and the human condition.",
    },
    quote: {
      text: "Every word we write is a bridge between what was and what could be.",
    },
    visibility: {
      hero: true,
      about: true,
      writings: true,
      blog: true,
      publications: true,
      awards: true,
      gallery: true,
      quote: true,
      contact: true,
    },
  })

  const handleSave = () => {
    // In production, save to database
    setShowSaveMessage(true)
    setTimeout(() => setShowSaveMessage(false), 3000)
  }

  const updateContent = (section: string, field: string, value: string | boolean) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  return (
    <div className="flex h-[80vh]">
      {/* Sidebar */}
      <div className="w-64 bg-muted/50 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="font-medium">Admin Dashboard</span>
          </div>
        </div>
        
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeSection === item.id
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
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
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="font-serif text-xl">
            {menuItems.find(m => m.id === activeSection)?.label}
          </h2>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeSection === "hero" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium mb-2">Badge Text</label>
                <input
                  type="text"
                  value={content.hero.badge}
                  onChange={(e) => updateContent("hero", "badge", e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subtitle</label>
                <input
                  type="text"
                  value={content.hero.subtitle}
                  onChange={(e) => updateContent("hero", "subtitle", e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hero Quote</label>
                <textarea
                  value={content.hero.quote}
                  onChange={(e) => updateContent("hero", "quote", e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Author Name</label>
                <input
                  type="text"
                  value={content.hero.name}
                  onChange={(e) => updateContent("hero", "name", e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hero Image</label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === "about" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium mb-2">Section Title</label>
                <input
                  type="text"
                  value={content.about.title}
                  onChange={(e) => updateContent("about", "title", e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Biography</label>
                <textarea
                  value={content.about.bio}
                  onChange={(e) => updateContent("about", "bio", e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Profile Photo</label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload profile photo</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Video Introduction</label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Upload video or paste YouTube/Vimeo link</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === "writings" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Featured Writings</h3>
                <button className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors">
                  + Add Writing
                </button>
              </div>
              
              {/* Sample writing cards */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-muted/50 rounded-xl p-4 border border-border">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        placeholder="Writing title"
                        defaultValue={`Featured Writing ${i}`}
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      <input
                        type="text"
                        placeholder="Short description"
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      <input
                        type="text"
                        placeholder="Link URL"
                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === "gallery" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Gallery Images</h3>
                <button className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors">
                  + Upload Images
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-square bg-muted rounded-xl flex items-center justify-center relative group cursor-pointer">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    <div className="absolute inset-0 bg-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                      <span className="text-white text-sm">Replace</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "awards" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Awards & Recognition</h3>
                <button className="px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors">
                  + Add Award
                </button>
              </div>
              
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-muted/50 rounded-xl p-4 border border-border">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Award name"
                      defaultValue={`Award ${i}`}
                      className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <input
                      type="text"
                      placeholder="Year"
                      defaultValue="2024"
                      className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <input
                      type="text"
                      placeholder="Category"
                      className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === "quote" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium mb-2">Featured Quote</label>
                <textarea
                  value={content.quote.text}
                  onChange={(e) => updateContent("quote", "text", e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none font-serif text-lg"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                This quote will be displayed prominently on the website with elegant typography.
              </p>
            </div>
          )}

          {activeSection === "settings" && (
            <div className="space-y-6 max-w-2xl">
              <p className="text-muted-foreground mb-6">
                Toggle sections on or off to customize what appears on your website.
              </p>
              
              {Object.entries(content.visibility).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    {value ? (
                      <Eye className="w-5 h-5 text-primary" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-muted-foreground" />
                    )}
                    <span className="capitalize">{key} Section</span>
                  </div>
                  <button
                    onClick={() => updateContent("visibility", key, !value)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      value ? "bg-primary" : "bg-muted"
                    }`}
                  >
                    <motion.div
                      animate={{ x: value ? 24 : 2 }}
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Save Message Toast */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: showSaveMessage ? 1 : 0, y: showSaveMessage ? 0 : 50 }}
        className="fixed bottom-6 right-6 bg-primary text-primary-foreground px-6 py-3 rounded-xl shadow-lg flex items-center gap-3"
      >
        <CheckCircle className="w-5 h-5" />
        <span>Your changes have been saved successfully.</span>
      </motion.div>
    </div>
  )
}
