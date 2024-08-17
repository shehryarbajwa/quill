import { type ClassValue, clsx } from "clsx"
import { Metadata } from "next";
import { twMerge } from "tailwind-merge"

{/* This function allows to merge an incoming CSS className with another CSSclassName */ }
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

{/*This absoluteUrl function is designed to generate an absolute URL based on the provided path. If Vercel is set, construct using Vercel path, otherwise localHost */ }
export function absoluteUrl(path: string) {
  if (typeof window !== 'undefined') return path;

  // Check if running in development environment
  if (process.env.NODE_ENV === 'development') {
    return `http://localhost:${process.env.PORT ?? 4000}${path}`;
  }

  // Check if running on Vercel
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}${path}`;
  }

  // Default fallback
  const defaultPort = 5000; // specify your default fallback port here
  return `http://localhost:${defaultPort}${path}`;
}

export function constructMetadata({
  title = "Quill - The AI-powered platform for modern knowledge management",
  description = "Quill is an AI-powered platform that makes it easy to manage your knowledge, so you can focus on what's important. It's like having your own personal library, but with the power of AI.",
  image = "/thumbnail.png",
  icons = "/icons.png",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{
        url: image,
      }],
    },
    icons,
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@sbajwa12",
    },
    metadataBase: new URL('https://quill-five-ashen.vercel.app/'),
    themeColor: "#FFF",
    ...(noIndex && { robots: { index: false, follow: false } }),
  }
}

