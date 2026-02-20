import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// ── shadcn/ui utility (jangan hapus ini) ──
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ── LyricVenture custom utilities ──
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}