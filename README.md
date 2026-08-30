# Mina & Diana Scotland + Amsterdam Trip Guide

A lightweight static travel companion website for Mina and Auntie Diana's upcoming Scotland and Amsterdam trip.

No GratuityPro or CountDown code is shared with this project.

## Purpose

The site is a mobile-first single-page guide for the trip: welcome notes, accommodation/home base details, chronological itinerary days, tappable map or website actions when factual links are available, and compact travel notes.

All current itinerary content is sample placeholder material. Do not add reservation IDs, passport details, personal contact information, flight confirmation codes, or other sensitive travel data to the public site.

## Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- Lucide React icons
- Vercel

There is no database, no Supabase, no authentication, and no backend.

## Local Development

```bash
npm install
npm run dev
```

The default local dev server is available at `http://127.0.0.1:5173`.

## Itinerary Data Structure

The itinerary is driven by structured TypeScript data in `src/data/itinerary.ts`.

Main types:

- `TripDay`: one chronological travel day.
- `DaySection`: a period within a day, such as `Morning`, `Afternoon`, `Evening`, or `Travel`.
- `ItineraryItem`: one stop, meal, transport note, reservation, or activity.

Trip-level details and accommodation placeholders live in `src/data/trip.ts`.

## How To Add Or Edit A Day

1. Open `src/data/itinerary.ts`.
2. Add or edit a `TripDay` object in the exported `itinerary` array.
3. Set `placeholder: false` only when the content is factual and confirmed.
4. Add `mapUrl` or `websiteUrl` only when the link is real.
5. Avoid public confirmation numbers or private booking details.

## How To Replace Images

The current hero image is an original generated placeholder stored at:

```text
public/images/scotland-amsterdam-hero.png
```

To replace it, add optimized image files under `public/images/`, then update the `heroImage` values in `src/data/itinerary.ts` or the hero image reference in `src/components/Hero.tsx`.

Use meaningful `alt` text for every image.

## Build

```bash
npm run build
```

The production output is generated in `dist/`.

## Deployment

This project is intended for Vercel.

```bash
vercel
vercel --prod
```

The Vercel project should be a new project named `mina-diana-trip`, linked only from this directory.

## Repository

Preferred GitHub repository:

```text
https://github.com/DezCam/mina-diana-trip
```

The default branch is `main`.
