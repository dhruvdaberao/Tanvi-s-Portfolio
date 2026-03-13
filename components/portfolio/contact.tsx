"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import { ArrowUpRight, Mail, MapPin, Send, CheckCircle, Twitter, Instagram, BookOpen, Linkedin } from "lucide-react"
import { useContent } from "./content-context"

const inquiryTypes = [
  { id: "speaking", label: "Speaking Engagement" },
  { id: "collaboration", label: "Collaboration" },
  { id: "media", label: "Media Inquiry" },
  { id: "general", label: "General" },
]

export function Contact() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { content } = useContent()
  
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    inquiryType: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log(`Sending to ${content.contact.receiverEmail}`, formState)
    setIsSubmitting(false)
    setSubmitted(true)
    setFormState({ name: "", email: "", inquiryType: "", message: "" })
  }

  return (
    <section id="contact" className="py-32 px-6 relative overflow-hidden" ref={ref}>
      <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/30 -skew-x-12 translate-x-1/4 hidden lg:block" />
      
      <div className="max-w-7xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-sm tracking-[0.25em] uppercase text-primary mb-4 font-medium">
            Get in Touch
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6">
            Let{"'"}s Connect
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            For speaking engagements, collaborations, or simply to say hello—I{"'"}d love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 space-y-6"
          >
            {content.contact.email && (
               <div className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow duration-300">
                 <div className="flex items-start gap-4">
                   <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                     <Mail className="w-5 h-5 text-primary" />
                   </div>
                   <div>
                     <p className="text-sm text-muted-foreground mb-1">Email</p>
                     <a
                       href={`mailto:${content.contact.email}`}
                       className="text-lg font-medium text-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                     >
                       {content.contact.email}
                       <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                     </a>
                     <p className="text-sm text-muted-foreground mt-2">I typically respond within 2-3 days</p>
                   </div>
                 </div>
               </div>
            )}

            {content.contact.location && (
               <div className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow duration-300">
                 <div className="flex items-start gap-4">
                   <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                     <MapPin className="w-5 h-5 text-primary" />
                   </div>
                   <div>
                     <p className="text-sm text-muted-foreground mb-1">Based in</p>
                     <p className="text-lg font-medium text-foreground">{content.contact.location}</p>
                     <p className="text-sm text-muted-foreground mt-2">Available for virtual and in-person events</p>
                   </div>
                 </div>
               </div>
            )}

            {(content.contact.agentName || content.contact.agentOrg) && (
               <div className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow duration-300">
                 <div className="flex items-start gap-4">
                   <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                     <BookOpen className="w-5 h-5 text-primary" />
                   </div>
                   <div>
                     <p className="text-sm text-muted-foreground mb-1">Literary Agent</p>
                     <p className="text-lg font-medium text-foreground">{content.contact.agentName}</p>
                     <p className="text-sm text-muted-foreground mt-1">{content.contact.agentOrg}</p>
                   </div>
                 </div>
               </div>
            )}

            <div className="pt-6">
              <p className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-4">
                Follow Along
              </p>
              <div className="flex gap-3">
                 {content.social.twitter && (
                    <a href={content.social.twitter} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors cursor-pointer"><Twitter className="w-5 h-5" /></a>
                 )}
                 {content.social.instagram && (
                    <a href={content.social.instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors cursor-pointer"><Instagram className="w-5 h-5" /></a>
                 )}
                 {content.social.linkedin && (
                    <a href={content.social.linkedin} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors cursor-pointer"><Linkedin className="w-5 h-5" /></a>
                 )}
                 {content.social.medium && (
                    <a href={content.social.medium} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors cursor-pointer"><BookOpen className="w-5 h-5" /></a>
                 )}
                 {content.social.custom && content.social.custom.map(link => (
                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="px-4 h-12 rounded-full border border-border flex items-center justify-center text-sm font-medium text-muted-foreground hover:text-primary hover:border-primary transition-colors cursor-pointer">{link.label}</a>
                 ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="bg-card rounded-2xl border border-border p-8 md:p-10">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-serif text-2xl mb-3">Message Sent</h3>
                  <p className="text-muted-foreground max-w-sm mx-auto">
                    Thank you for reaching out. I{"'"}ll get back to you within a few days.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                      <input type="text" id="name" required value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })} className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/50" placeholder="Your name" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                      <input type="email" id="email" required value={formState.email} onChange={(e) => setFormState({ ...formState, email: e.target.value })} className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/50" placeholder="your@email.com" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Inquiry Type</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {inquiryTypes.map((type) => (
                        <button key={type.id} type="button" onClick={() => setFormState({ ...formState, inquiryType: type.id })} className={`px-4 py-2.5 text-sm rounded-lg border transition-all ${formState.inquiryType === type.id ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:border-primary/50"}`}>
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                    <textarea id="message" required rows={5} value={formState.message} onChange={(e) => setFormState({ ...formState, message: e.target.value })} className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none placeholder:text-muted-foreground/50" placeholder="Tell me about your project or inquiry..." />
                  </div>

                  <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full px-8 py-4 bg-primary text-primary-foreground rounded-lg font-medium text-sm tracking-wide hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
