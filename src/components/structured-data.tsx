import Script from "next/script"
import { education, profile, skillCategories } from "@/data/profile"

export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    description: profile.tagline,
    url: "https://anantkiyer.github.io",
    image: "https://anantkiyer.github.io/portrait.jpg",
    sameAs: [profile.links.github, profile.links.linkedin],
    knowsAbout: skillCategories.flatMap((category) => category.skills),
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: education.school,
    },
    worksFor: {
      "@type": "Organization",
      name: "Brahma AI",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bangalore",
      addressRegion: "KA",
      addressCountry: "IN",
    },
    email: profile.email,
    telephone: profile.phone,
  }

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  )
}
