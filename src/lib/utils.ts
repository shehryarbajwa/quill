import { type ClassValue, clsx } from "clsx"
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

