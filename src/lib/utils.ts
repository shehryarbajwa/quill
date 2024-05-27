import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

{/* This function allows to merge an incoming CSS className with another CSSclassName */ }
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

{/*This absoluteUrl function is designed to generate an absolute URL based on the provided path. If Vercel is set, construct using Vercel path, otherwise localHost */ }
export function absoluteUrl(path: string) {
  if (typeof window !== 'undefined') return path
  if (process.env.VERCEL_URL)
    return `https://${process.env.VERCEL_URL}${path}`
  return `http://localhost:${process.env.PORT ?? 3000
    }${path}`
}
