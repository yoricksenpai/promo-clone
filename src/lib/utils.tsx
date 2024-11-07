import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * A drop-in replacement for `clsx` that uses `tailwind-merge` underneath.
 * This allows us to take advantage of Tailwind's built-in optimizations and
 * automatically generate the correct class names for us.
 *
 * @param inputs - The class names to be merged.
 *
 * @returns The merged class names.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}