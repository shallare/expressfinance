'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import type { Testimonial } from '@/data/testimonials';
import { formatFullDate } from '@/lib/finance/format';
import { t } from '@/i18n/format';
import { useLocale } from '@/i18n/provider';
import { cn } from '@/lib/utils';

const AUTOPLAY_MS = 7000;

export function TestimonialsCarousel({ items }: { items: Testimonial[] }) {
  const { locale, dict } = useLocale();
  const s = dict.testimonials;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const timer = useRef<number | null>(null);

  const go = useCallback(
    (delta: number) => {
      setDirection(delta);
      setIndex((i) => (i + delta + items.length) % items.length);
    },
    [items.length],
  );

  useEffect(() => {
    if (paused || reduce || items.length <= 1) return;
    timer.current = window.setInterval(() => go(1), AUTOPLAY_MS);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [paused, reduce, items.length, go]);

  if (items.length === 0) return null;
  const current = items[index];

  return (
    <div
      className="mx-auto max-w-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="relative" role="region" aria-roledescription="carousel" aria-label={s.region}>
        <div className="card-surface relative overflow-hidden p-7 sm:p-10">
          <Quote className="absolute right-6 top-6 h-12 w-12 text-brand-100" aria-hidden="true" />
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.figure
              key={current.id}
              custom={direction}
              initial={reduce ? { opacity: 1 } : { opacity: 0, x: 40 * direction }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? { opacity: 1 } : { opacity: 0, x: -40 * direction }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              aria-live="polite"
            >
              <div className="flex items-center gap-1" aria-label={t(s.rating, { n: current.rating })}>
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className={cn('h-4 w-4', i < current.rating ? 'fill-sage-400 text-sage-400' : 'text-line')} aria-hidden="true" />
                ))}
              </div>
              <blockquote className="mt-4 text-lg leading-relaxed text-navy-900 sm:text-xl">« {current.content} »</blockquote>
              <figcaption className="mt-6 flex items-center gap-4">
                {current.imageUrl ? (
                  <Image src={current.imageUrl} alt="" width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-navy-950 font-display text-sm font-bold text-sage-300" aria-hidden="true">
                    {current.name.slice(0, 1).toUpperCase()}
                  </span>
                )}
                <div>
                  <p className="font-semibold text-navy-900">{current.name}</p>
                  <p className="text-xs text-ink-subtle">
                    {current.loanType}
                    {current.location ? ` · ${current.location}` : ''} · {formatFullDate(current.date, locale)}
                  </p>
                </div>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        {items.length > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-2" role="tablist" aria-label={s.select}>
              {items.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={t(s.item, { i: i + 1, n: items.length })}
                  onClick={() => {
                    setDirection(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  className={cn('h-2.5 rounded-full transition-all', i === index ? 'w-8 bg-brand-600' : 'w-2.5 bg-navy-200 hover:bg-navy-300')}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => go(-1)} aria-label={s.prev} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-navy-900 hover:bg-navy-50">
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => go(1)} aria-label={s.next} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-navy-900 hover:bg-navy-50">
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
