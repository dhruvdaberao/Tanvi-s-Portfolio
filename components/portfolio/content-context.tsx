"use client"

import * as React from "react"

export type SocialLink = { id: string; label: string; url: string }
export type Award = { id: string; title: string; year: string; org: string }
export type GalleryImage = { id: string; url: string; caption: string; year: string }
export type FeaturedWriting = { id: string; title: string; image: string; desc: string; category: string; readUrl: string }

export type ContentState = {
  admin: {
    pass: string;
  };
  navbar: {
    about: string;
    writings: string;
    blog: string;
    publications: string;
    awards: string;
    gallery: string;
    contact: string;
  };
  social: {
    twitter: string;
    instagram: string;
    linkedin: string;
    medium: string;
    custom: SocialLink[];
  };
  hero: {
    badge: string;
    subtitle: string;
    quote: string;
    name: string;
    profilePhoto: string;
  };
  about: {
    title: string;
    bio: string;
  };
  video: {
    url: string;
    caption: string;
    thumbnail: string;
    title: string;
  };
  writings: FeaturedWriting[];
  gallery: GalleryImage[];
  awards: {
    countNumber: number;
    list: Award[];
  };
  quote: {
    text: string;
  };
  contact: {
    email: string;
    location: string;
    agentName: string;
    agentOrg: string;
    receiverEmail: string;
  };
  music: {
    enabled: boolean;
    fileUrl: string;
    volume: number;
    loop: boolean;
  };
  visibility: {
    hero: boolean;
    about: boolean;
    writings: boolean;
    blog: boolean;
    publications: boolean;
    awards: boolean;
    gallery: boolean;
    quote: boolean;
    contact: boolean;
  };
};

const defaultContent: ContentState = {
  admin: {
    pass: "tanvi2002"
  },
  navbar: {
    about: "About",
    writings: "Writing",
    blog: "Blog",
    publications: "Publications",
    awards: "Awards",
    gallery: "Gallery",
    contact: "Contact"
  },
  social: {
    twitter: "",
    instagram: "",
    linkedin: "",
    medium: "",
    custom: [],
  },
  hero: {
    badge: "Award-Winning Author",
    subtitle: "Writer & Essayist",
    quote: "Words have the power to change the world.",
    name: "Tanvi Sirsat",
    profilePhoto: "",
  },
  about: {
    title: "Crafting stories that resonate",
    bio: "I am Tanvi Sirsat, a writer exploring the intersections of memory, identity, and the human condition.",
  },
  video: {
    url: "",
    caption: "Meet Tanvi",
    thumbnail: "",
    title: "An Introduction",
  },
  writings: [],
  gallery: [],
  awards: {
    countNumber: 12,
    list: []
  },
  quote: {
    text: "Every word we write is a bridge between what was and what could be.",
  },
  contact: {
    email: "hello@tanvisirsat.com",
    location: "Mumbai, India",
    agentName: "Literary Agent Name",
    agentOrg: "Literary Agency",
    receiverEmail: "hello@tanvisirsat.com"
  },
  music: {
    enabled: false,
    fileUrl: "",
    volume: 50,
    loop: true,
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
};

type ContentContextType = {
  content: ContentState;
  updateContent: (section: keyof ContentState, field: string | null, value: any) => void;
};

const ContentContext = React.createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = React.useState<ContentState>(defaultContent);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("portfolio-content-v2");
    if (stored) {
      try {
        setContent(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const updateContent = React.useCallback((section: keyof ContentState, field: string | null, value: any) => {
    setContent(prev => {
      let newState: ContentState;
      if (field === null) {
        newState = {
          ...prev,
          [section]: value
        };
      } else {
        newState = {
          ...prev,
          [section]: {
             // @ts-ignore
            ...prev[section],
            [field]: value,
          },
        };
      }
      localStorage.setItem("portfolio-content-v2", JSON.stringify(newState));
      return newState;
    });
  }, []);

  return (
    <ContentContext.Provider value={{ content, updateContent }}>
      <div style={{ visibility: mounted ? 'visible' : 'hidden', display: 'contents' }}>
        {children}
      </div>
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = React.useContext(ContentContext);
  if (context === undefined) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return context;
}
