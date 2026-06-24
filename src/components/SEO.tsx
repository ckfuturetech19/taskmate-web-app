import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface FAQItem {
  question: string;
  answer: string;
}

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  includeSoftwareSchema?: boolean;
  includeOrgSchema?: boolean;
  faqList?: FAQItem[];
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords = 'task manager, productivity planner, daily planner, todo app, smart todo, task reminder, taskmate',
  canonicalUrl,
  ogImage = 'https://taskmateapp.site/logo.png',
  ogType = 'website',
  includeSoftwareSchema = false,
  includeOrgSchema = false,
  faqList = [],
}) => {
  const location = useLocation();
  const currentUrl = canonicalUrl || `https://taskmateapp.site${location.pathname}`;

  useEffect(() => {
    // 1. Title
    document.title = title;

    // Helper to update or create meta tags
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to update or create link tags
    const setLinkTag = (rel: string, href: string) => {
      let element = document.head.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 2. Standard Meta Tags
    setMetaTag('description', description);
    setMetaTag('keywords', keywords);
    setMetaTag('author', 'TaskMate AI');

    // 3. Canonical Link
    setLinkTag('canonical', currentUrl);

    // 4. Open Graph Tags
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:url', currentUrl, true);
    setMetaTag('og:image', ogImage, true);
    setMetaTag('og:type', ogType, true);
    setMetaTag('og:site_name', 'TaskMate AI', true);

    // 5. Twitter Meta Tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', ogImage);
    setMetaTag('twitter:site', '@TaskMateAI');

    // 6. Structured Data (JSON-LD Schemas)
    const schemas: any[] = [];

    // Organization Schema
    if (includeOrgSchema) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': 'https://taskmateapp.site/#organization',
        'name': 'TaskMate AI',
        'url': 'https://taskmateapp.site',
        'logo': 'https://taskmateapp.site/logo.png',
        'sameAs': [
          'https://twitter.com/TaskMateAI',
          'https://play.google.com/store/apps/details?id=com.ckfuturetech.taskmate'
        ],
        'description': 'TaskMate is an AI-powered smart productivity platform and task manager assisting modern professionals, developers, and teams in achieving daily alignment.'
      });
    }

    // Software Application Schema
    if (includeSoftwareSchema) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        '@id': 'https://taskmateapp.site/#software',
        'name': 'TaskMate AI',
        'applicationCategory': 'BusinessApplication',
        'operatingSystem': 'Android, Web, iOS',
        'downloadUrl': 'https://play.google.com/store/apps/details?id=com.ckfuturetech.taskmate',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD'
        },
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': '4.8',
          'ratingCount': '2450'
        },
        'description': 'TaskMate AI is a smart daily planner and voice-enabled task reminder app designed to optimize productivity, real-time collaboration, and note-taking.'
      });
    }

    // FAQ Schema
    if (faqList && faqList.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faqList.map((faq) => ({
          '@type': 'Question',
          'name': faq.question,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.answer
          }
        }))
      });
    }

    // Inject/update JSON-LD script
    let scriptElement = document.getElementById('taskmate-jsonld-seo') as HTMLScriptElement;
    if (scriptElement) {
      scriptElement.textContent = JSON.stringify(schemas);
    } else {
      scriptElement = document.createElement('script');
      scriptElement.id = 'taskmate-jsonld-seo';
      scriptElement.type = 'application/ld+json';
      scriptElement.textContent = JSON.stringify(schemas);
      document.head.appendChild(scriptElement);
    }

    // Cleanup logic if needed (optional)
    return () => {
      // Keep static SEO tags but could clean up script if page changes
    };
  }, [title, description, keywords, currentUrl, ogImage, ogType, includeSoftwareSchema, includeOrgSchema, faqList]);

  return null;
};

export default SEO;
