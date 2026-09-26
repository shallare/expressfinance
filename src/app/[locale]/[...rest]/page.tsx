import { notFound } from 'next/navigation';

/** Toute route inconnue dans une langue déclenche la page 404 localisée. */
export default function CatchAll() {
  notFound();
}
