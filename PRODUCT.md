# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) + React + TypeScript + Tailwind CSS v4 + GSAP/ScrollTrigger. Three.js / React Three Fiber only for the hero's ember particles on capable desktops.

## Users

Diners in the restaurant's area deciding what to eat tonight, mostly on their phones, often already hungry. They want to see the carta with prices and send an order fast.

## Product Purpose

Official site of **Los Tres Cerditos Restaurante**: show the full carta with exact prices and turn a craving into a WhatsApp order (or a phone call to the delivery lines).

## Positioning

A neighbourhood fast-food restaurant with a costeño carta (hamburguesas de carne artesanal, chuzos desgranados, salchipapas, perros calientes, chuzopanes, picadas, asados al carbón). The site is the printed carta brought to life, not a generic burger template.

## Capabilities and Constraints

- Ordering: client-side cart (localStorage) that sends a formatted message to WhatsApp `WHATSAPP_NUMBER` in `lib/content.ts` (302 448 3159, confirmed by the user). No backend, no payments.
- The hero keeps the existing scroll-driven video `public/video/burgervideo.mp4` (user-approved). It is an illustrative burger, not a specific carta item; its layers are named generically.
- `lib/menu.ts` is the single source of truth for products and prices, transcribed from the printed carta.

## Brand Commitments

- Official logo `public/brand/logo-los-tres-cerditos.png`, never redrawn, cropped or stretched. Its file carries its own navy ground (#100A5C), so it always sits on `navy`.
- Palette from the logo: navy, pig pink, white, near-black navy.
- Slogan from the carta: "Sabemos lo que es comer bien, siempre querrás más, volverás por más."
- Specialties from the carta header: Hamburguesa, Desgranado, Salchipapa, Perro Caliente.

## Evidence on Hand

- The carta (products, prices, delivery phones 302 448 3159 / 323 231 2013 / 321 843 0124, hours 5 p. m.–11 p. m., address Calle 18 #2b-72 frente al Colegio Pinillos, Cerdo a la Llanera only Saturdays and Sundays).
- No food photography of their own yet: Unsplash stand-ins, tagged "Foto de referencia" in the UI automatically.
- Not provided, never to be invented: city, opening days, social networks, story, awards, years, reviews, best-seller claims.

## Product Principles

1. The carta is the product: complete, exact, fast to scan on a phone.
2. Every craving is one tap from an order.
3. Only the restaurant's own facts; label anything illustrative.
4. Smooth on mid-range phones beats spectacle.

## Accessibility & Inclusion

WCAG AA contrast, full keyboard navigation (ARIA tablist with arrow keys, native modal dialog for the order), visible pink focus ring, Spanish (`lang="es"`), and prefers-reduced-motion honoured (static hero, no reveals).
