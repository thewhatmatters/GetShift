import Script from "next/script";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://getshift.io";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Shift",
  alternateName: "GetShift",
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  description:
    "AI-powered career matching platform that helps professionals discover careers they're already qualified for.",
  sameAs: [
    "https://twitter.com/getshiftio",
    "https://linkedin.com/company/getshift",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "support@getshift.io",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Shift",
  url: siteUrl,
  description:
    "Discover careers you're already qualified for with AI-powered matching.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is Shift?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Shift is an AI-powered career matching platform that analyzes your experience and shows you exactly what careers you're already qualified for — plus a 90-day plan to land one.",
      },
    },
    {
      "@type": "Question",
      name: "Who is Shift built for?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Shift is built for professionals who feel stuck, undervalued, or unsure about their next career move. Whether you're looking to pivot industries, level up, or discover hidden opportunities, Shift is for you.",
      },
    },
    {
      "@type": "Question",
      name: "How does Shift work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Simply upload your resume or connect your LinkedIn profile. Our AI analyzes your experience, skills, and background to identify career paths you're already qualified for, then creates a personalized 90-day roadmap to help you get there.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a free trial available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, we offer a 14-day free trial so you can explore all features before committing to a plan.",
      },
    },
    {
      "@type": "Question",
      name: "What kind of support do you provide?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We provide customer support through email and comprehensive documentation to help you get the most out of Shift. Premium plans include priority support and personalized guidance.",
      },
    },
  ],
};

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Shift",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "AI-powered career matching platform that analyzes your experience and shows you careers you're qualified for.",
  offers: {
    "@type": "AggregateOffer",
    lowPrice: "29",
    highPrice: "49",
    priceCurrency: "USD",
    offerCount: "2",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "150",
    bestRating: "5",
    worstRating: "1",
  },
};

export function StructuredData() {
  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <Script
        id="software-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema),
        }}
      />
    </>
  );
}
