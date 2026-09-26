# Label Surbhee — Shopify Guide

A complete **Online Store 2.0 theme** ported from the static `LABEL-SURBHEE`
storefront: same maroon & gold design system, mega-menu, cart drawer,
product pages, collections, search, wishlist, WhatsApp chat and all content
pages — now running on real Shopify products, cart, checkout and accounts.

**The theme lives at the root of this repository** — that is what makes it a
theme. Shopify reads `layout/`, `sections/`, `templates/` … from the repo root,
so a theme nested in a subfolder is not recognised as one.

```
LABEL-SURBHEE/                 ← repo root == theme root
├── layout/theme.liquid        ← global shell (header/footer/drawer/search/size-guide/WhatsApp)
├── templates/                 ← 21 JSON templates (home, product, collection ×4, cart,
│   └── customers/               pages, blog, search, 404, all 7 account pages)
├── sections/                  ← 32 sections (hero, tiles, grids, product, cart, account…)
├── snippets/                  ← product-card, price, stars, breadcrumbs, icons
├── assets/theme.css + theme.js← design system + storefront engine
├── config/                    ← theme settings (brand, colours, WhatsApp, size guide…)
├── locales/en.default.json
├── docs/import/               ← products.csv + pages + collections/menus/discounts docs
└── preview/                   ← the original static demo (not part of the theme)
```

`docs/` and `preview/` are not theme directories — Shopify ignores them when
you connect or push the repo, and they are excluded from the zip in section A.

Theme-only concepts from the demo (hash router, `localStorage` cart/orders,
`#/admin` panel, simulated checkout) are **replaced by real Shopify
features** — see "What changed" at the bottom.

---

## A · Install the theme (no code tools needed)

1. Zip the theme — from the **repo root**, excluding the non-theme folders:
   ```bash
   cd LABEL-SURBHEE
   zip -r label-surbhee-theme.zip \
     assets config layout locales sections snippets templates \
     -x '*.DS_Store'
   ```
   (Only the seven theme directories belong in the zip. `docs/`, `preview/`
   and the README are documentation, not theme files.)
2. Shopify admin → **Online Store → Themes → Add theme → Upload zip file**,
   choose `label-surbhee-theme.zip`. It appears under "Theme library" as an
   unpublished theme.
3. Click **Customize** to preview. Don't publish yet — fill the store first
   (section C), then **Publish**.

## B · Install with Shopify CLI (developers)

```bash
git clone https://github.com/neversoberr/LABEL-SURBHEE.git
cd LABEL-SURBHEE                 # ← the theme root, not a subfolder
npm install -g @shopify/cli @shopify/theme

shopify theme dev --store YOUR-STORE.myshopify.com   # live preview + editor sync
# …when happy:
shopify theme push --store YOUR-STORE.myshopify.com  # uploads as unpublished theme
```

To keep the theme connected to this repository (so `git pull` updates it):

```bash
shopify theme init --clone-url https://github.com/neversoberr/LABEL-SURBHEE.git label-surbhee
```

Useful checks:

```bash
shopify theme check     # Liquid / JSON / performance lint
shopify theme language-server  # editor integration (optional)
node .theme-validate.mjs      # structural check: refs to sections/snippets/assets/settings
```

## C · Fill the store (in this order)

### 1 · Products — `import/products.csv`

Products → **Import** → upload `products.csv`. You get **18 products /
71 variants** (Size × Colour matrix, real compare-at prices, per-variant
stock, SEO titles). Images download automatically from this repo's public
`img/` folder during import.

> Importing from a branch instead of `main`? Find-replace `/main/img/` in
> the CSV with `/<branch>/img/` first.

### 2 · Collections — `import/collections.md`

Create the 13 automated collections exactly as documented
(`clothing`, `lehengas`, `jewellery`, the 8 edits, `new-arrivals`, `sale`).
They self-populate from product tags. Assign the three alternate collection
templates (`collection.clothing` …) for sub-category tabs.

### 3 · Pages — `import/pages/*.html`

Content → Pages → Add page, once per file:

| Title | Handle | Template | Body |
|---|---|---|---|
| About | `about` | Default `page` | paste `about.html` (upload `about.jpg` to Files, replace `ABOUT_IMAGE_URL`) |
| Shipping & Delivery | `shipping` | Default `page` | paste `shipping.html` |
| Returns & Exchange | `returns-exchange` | Default `page` | paste `returns-exchange.html` |
| Privacy Policy | `privacy` | Default `page` | paste `privacy.html` |
| Terms & Conditions | `terms` | Default `page` | paste `terms.html` |
| Refund Policy | `refund` | Default `page` | paste `refund.html` |
| Track Order | `track-order` | Default `page` | paste `track-order.html` |
| Contact | `contact` | `page.contact` | **leave blank** (template renders form) |
| FAQ | `faq` | `page.faq` | **leave blank** (template renders questions) |
| My Wishlist | `wishlist` | `page.wishlist` | **leave blank** (JS renders grid) |
| Admin (staff only) | `admin` | `page.admin` | **leave blank** (server-side `admin` customer tag + PIN/OTP gate) |

Use the `<>` (HTML) button in the content editor when pasting.

> The Admin page is shown **only** to signed-in customers tagged `admin`;
> everyone else sees an access-denied screen. See
> `docs/HOW-TO-ADD-PRODUCTS-SALE.md` §F for the one-time setup (customer tag
> + `page.admin` template + Webmaster PIN/OTP theme settings).

### 4 · Menus — `import/menus.md`

Content → Menus. Create `main-menu` (with nested mega-menu children),
`top-menu`, `category-tabs`, the three `submenu-*` menus, and the five
footer menus. Handles must match — the templates reference them by handle.

### 5 · Discounts + shipping — `import/discounts.md`

Create the 5 codes (`WELCOME10`, `FESTIVE20`, `FLAT500`, `BUY2`,
`FREESHIP`), then add the automatic **free-shipping-over-₹1,999** rate in
Settings → Shipping and delivery.

### 6 · Theme editor wiring

Online Store → Themes → **Customize** (on the Label Surbhee theme):

- **Theme settings** (gear icon): confirm brand phone/WhatsApp/email,
  colours, free-shipping threshold (`1999`), size guide rows, Instagram /
  Facebook URLs, favicon + social image.
- **Header** section: set Main menu → `main-menu`, Top bar menu →
  `top-menu`; add the 4 mega-menu feature blocks (handles `clothing`,
  `lehengas`, `jewellery`, `collections`) with images.
- **Footer** section: assign the 5 footer menus, payment list
  (`UPI, Visa, Mastercard, RuPay, COD`), blurb, credit line.
- **Home page**: the `index.json` defaults already assemble the full
  homepage — swap the collection pickers if you renamed any handles, and
  replace fallback images with your own photography.
- **Product template**: edit the review blocks with real reviews (or
  install a reviews app — see below).

### 7 · Store settings checklist

- **Payments**: activate a UPI/cards provider (Razorpay / Cashfree /
  PhonePe) + enable **Cash on Delivery** (manual payment method).
- **Taxes**: prices in the CSV are tax-inclusive; in Settings → Taxes,
  tick "Include sales tax in product prices".
- **Shipping**: standard ₹99 / remote ₹149 / express ₹199 + free over
  ₹1,999 (see `discounts.md`), matching the Shipping page copy.
- **Policies**: paste the privacy/refund/terms text into Settings →
  Policies too, so checkout links work.
- **Notifications**: customize the order/shipping email templates; connect
  a WhatsApp notifications app (Interakt / Wati / Gupshup) for the
  WhatsApp updates the copy promises.
- **Analytics**: add GA4 + Meta Pixel under Settings → Customer events
  (pixels), and verify Search Console.
- **Domains**: connect `labelsurbhee.com`; Shopify generates
  `sitemap.xml` + `robots.txt` automatically (the static ones are
  superseded).
- **Accounts**: Settings → Customer accounts → decide classic vs new
  accounts (the theme styles both login/register flows).

### 8 · Optional product metafields

Settings → Custom data → Products → add:

| Name | Namespace/key | Type |
|---|---|---|
| Rating | `custom.rating` | Decimal |
| Review count | `custom.review_count` | Integer |
| Fabric | `custom.fabric` | Single line text |

Then fill values from `import/metafields-reference.csv` (or install
Judge.me / Loox / Yotpo — the theme also reads the standard
`reviews.rating` / `reviews.rating_count` metafields those apps write).

---

## What changed vs the static demo

| Demo feature | Shopify reality |
|---|---|
| `#/admin` PIN panel | Deleted — Shopify admin does it all (products, discounts, orders, customers) |
| `localStorage` cart + simulated checkout | Real AJAX cart + cart drawer → Shopify checkout (UPI / cards / COD) |
| Simulated order tracking timeline | Real fulfilment: account → Orders + shipping emails + WhatsApp app |
| Client-side promo engine | Native discount codes (`import/discounts.md`) |
| Reviews stored in browser | Static review blocks (replace with a reviews app for real collection) |
| PIN estimator | Same UX, honest static logic (metro prefix → 2–4 days, else 3–7) — wire a courier API later if needed |
| Hash routes (`#/shop/…`) | Real URLs (`/collections/…`, `/products/…`, `/pages/…`) — better SEO |
| Wishlist in `localStorage` | Kept in `localStorage` (works for guests), rendered from the Product API on `/pages/wishlist` |

## File map (sections)

Home: `hero` · `marquee` · `category-tiles` · `featured-collection` ·
`split-story` · `collection-grid` · `sale-band` · `instagram-feed` ·
`trust-row` · `newsletter`. Shell: `header` · `footer` · `cart-drawer`.
Main templates: `main-product` · `main-collection-product-grid` ·
`main-cart-items` · `main-page` · `main-search` · `main-404` ·
`main-list-collections` · `main-blog` · `main-article` · `faq` ·
`contact-form` · `wishlist` · `main-account` · `main-addresses` ·
`main-login` · `main-register` · `main-order` · `main-activate-account` ·
`main-reset-password`.
