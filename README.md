# LABEL SURBHEE

> House of Maroon & Gold — a luxury Indian fashion storefront.

Deep maroon · antique gold · ivory. Bridal lehengas, festive couture, sarees and heirloom jewellery.

## Run it

```bash
cd LABEL-SURBHEE
python3 -m http.server 8080
# open http://localhost:8080
```

No build step, no dependencies — pure HTML/CSS/JS. All state (cart, wishlist,
orders, admin edits) persists in the browser via `localStorage`.

## Structure

```
index.html                 ← storefront entry (hash-routed SPA)
css/style.css              ← design system (maroon/gold/ivory)
js/data.js                 ← catalogue, collections, FAQ, brand config
js/app.js                  ← router, cart, checkout, account, admin, tracking
img/                       ← brand photography
sitemap.xml · robots.txt   ← SEO
.claude/skills/frontend-design/SKILL.md  ← the design skill that governed this build
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
