import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Fusionne des classes Tailwind en résolvant les conflits. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Arrondi monétaire à 2 décimales, insensible aux erreurs de flottant. */
export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/** Contraint une valeur dans un intervalle. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Aligne une valeur sur un pas donné (utilisé par les sliders). */
export function snapToStep(value: number, step: number, min: number): number {
  return min + Math.round((value - min) / step) * step;
}

/** `slugify` minimal, sans dépendance, pour les ancres et identifiants. */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
