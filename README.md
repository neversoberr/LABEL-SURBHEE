# LABEL SURBHEE

> House of Maroon & Gold — a luxury Indian fashion storefront.

Deep maroon · antique gold · ivory. Bridal lehengas, festive couture, sarees and heirloom jewellery.

**This repository is a Shopify Online Store 2.0 theme.** The theme root is the
repo root, so it can be installed by connecting the repository URL or by
running `shopify theme dev` here — see
[`docs/SHOPIFY-GUIDE.md`](docs/SHOPIFY-GUIDE.md).

## Structure

```
layout/theme.liquid        ← global shell (header, footer, cart drawer, search)
templates/                 ← 21 JSON templates (home, product, collections, cart, account…)
sections/                  ← 32 sections (hero, tiles, grids, product, cart, account…)
snippets/                  ← product-card, price, stars, breadcrumbs, icons
assets/                    ← theme.css (design system) + theme.js (storefront engine) + imagery
config/                    ← settings_schema.json / settings_data.json
locales/en.default.json
docs/SHOPIFY-GUIDE.md      ← install + store-setup guide
docs/import/               ← products.csv, page HTML, collections/menus/discounts docs
preview/                   ← the original static demo (not part of the theme)
.theme-validate.mjs        ← structural check for the theme
```

## Run the static demo

The pre-Shopify demo still lives in `preview/`:

```bash
cd LABEL-SURBHEE/preview
python3 -m http.server 8080
# open http://localhost:8080
```

No build step, no dependencies — pure HTML/CSS/JS. All state (cart, wishlist,
orders, admin edits) persists in the browser via `localStorage`.

## Check the theme

```bash
node .theme-validate.mjs   # sections/snippets/assets/settings references + JSON validity
shopify theme check        # official Liquid / performance lint
```

## Features (client-side demo, no backend)

- **Shop** — Home, New Arrivals, Clothing / Lehengas / Jewellery with full mega-menu sub-filters, Collections (8 editorial edits), Sale, live search, sorting
- **Product pages** — gallery, sizes, colours, quantity, PIN delivery estimator, fabric/shipping/returns accordions, star reviews + “verified” badges, write-a-review, related pieces
- **Commerce** — cart drawer, promo engine (`WELCOME10`, `FESTIVE20`, `FLAT500`, `BUY2`, `FREESHIP` + admin-created), free shipping over ₹1,999, guest checkout (UPI / Card / COD), order success with notification timeline
- **Tracking** — `#/track` with a live status timeline (received → delivered); admin can cancel/refund
- **Account** — My Orders, Order Status, Wishlist, Saved Addresses, Previous Purchases; guest-friendly
- **Wishlist** — ❤ on every product, persisted
- **WhatsApp** — floating “Need help? Chat with us” + CTAs on product, size guide, checkout, contact
- **Instagram** — “Follow the Label” feed on homepage, linked throughout
- **Admin panel** — `#/admin` (PIN `2580`, demo OTP `482913`, 2-step): add/edit/delete products (price, photo, stock, sizes, colours), create collections, create discounts (flat / % / first-order / festival / buy-2 / free-shipping), manage orders & customers, change the homepage banner, manage New Arrivals, mark sold out (stock = 0)
- **Pages** — About (brand story), Contact (with form), Shipping & Delivery, Returns & Exchange (custom policy), FAQ, Privacy / Terms / Refund, Size Guide modal
- **SEO** — per-route titles & meta descriptions, semantic HTML, image alt text, JSON-LD, `sitemap.xml`, `robots.txt`; placeholders for GSC / GA4 / Meta Pixel in `index.html`
- **Mobile-first** — full-screen mobile menu, responsive grids, lazy-loaded imagery

> Note: this is a frontend demonstration. Production would need a backend for
> payments, real inventory, email/SMS/WhatsApp notifications and the analytics
> integrations flagged in the code.
