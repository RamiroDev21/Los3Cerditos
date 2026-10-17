# Design — Los Tres Cerditos Restaurante

**World:** the printed carta, alive. Navy fields carry the page (the logo's own ground); the carta itself is a white paper sheet with navy ink, hand-lettered category titles flanked by ★★★, and dotted leaders running to each price. Pig pink is the only accent: actions, stars, emphasis. The hero is night: the burger video's grey slate is screened into deep blue so it belongs to the brand.

## Tokens (`app/globals.css` `@theme`)

| Token | Value | Role |
|---|---|---|
| `navy` | `#100a5c` | Page ground, header, sections. Sampled from the logo file so the logo sits seamlessly |
| `navy-raised` | `#1b1577` | Cards on navy (Destacados) |
| `navy-line` | `#2d2690` | Dividers on navy |
| `night` | `#100f43` | Hero and Contacto ground (video slate `#100f0e` screened with `#000038`) |
| `navy-deep` | `#08062e` | Image wells, dialog backdrop |
| `pink` | `#f28ca8` | Primary actions (navy text, 7.4:1), stars, emphasis words |
| `pink-soft` / `pink-deep` | `#fbd5df` / `#e56a8f` | Hover / active of pink; script lines on navy |
| `paper` / `paper-2` | `#ffffff` / `#f3f2fb` | Carta sheet, order dialog / chips, dialog footer |
| `lilac` / `lilac-dim` | `#c7c3ee` / `#9d98d6` | Secondary text on navy (10.4:1 / 6.5:1) |

## Type

- **Archivo** (variable width axis). `.font-display`: wdth 62, 800, uppercase — echoes the logo's banner lettering; headings, prices. `.font-item`: wdth 112, 800, uppercase — item names, as on the printed carta. Body at wdth 100.
- **Kalam 700** (`.font-script`): category titles, slogan, short flourishes — the carta's hand lettering. Never for body.
- `.label`: Archivo 700, 0.75rem, 0.14em tracking, uppercase — field labels (Domicilios, Horario).

## Components

- `ButtonLink` / `Button` (`components/ui/Button.tsx`): 48px pills. Variants `pink` (primary), `outline` (on navy), `navy` and `paper`.
- `AddToOrder`: round + (compact) or "Agregar al pedido" (full), which becomes a − n + stepper. Tones `paper` (navy controls) and `navy` (pink controls).
- `StarredTitle` / `Stars`: the carta's ★★★ heading. On phones the stars drop below the title.
- `.leader`: dotted leader between a name and its price. `.sheet-corners`: L brackets at the sheet's foot.
- `Photo`: 16px-radius food image. It tags Unsplash stand-ins "Foto de referencia" automatically.
- `Logo`: the official PNG with a 4% edge feather, always on `navy`.
- Order: `CartDrawer` (a native modal `<dialog>` sliding in from the right, on paper) and `OrderBar` (a pink bottom bar on phones, a toast from md up).

## Motion

- The hero is the one scrubbed sequence (scroll explodes the burger). Its layer legend and caption are in Spanish.
- Entrances use `useReveals` (masked line rises, fade-lift) on `expo.out`. Anchor scrolls use `power3.inOut`. Hovers run 300–500ms on `--ease-out-expo`; buttons press to scale 0.97.
- `pop` keyframe on quantity changes, `drawer-in` / `toast-in` for the order UI.
- With `prefers-reduced-motion`: static hero and no reveals.

## Layout

- Max width 1400px, gutters 16px (mobile) / 32px (md+).
- Header is fixed and solid navy, 72px / 84px tall. Anchors use `scroll-margin-top: 5.5rem`.
- Sections run Hero → Destacados (a snap carousel on phones, 2–3 columns from md) → La carta (one category at a time behind a sticky tab bar) → Nosotros → Contacto → Footer.
- Section rhythm: 96px top and bottom on mobile, 128px from md.
