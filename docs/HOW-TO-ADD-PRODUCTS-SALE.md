# How to add products, run a sale, and manage everything

This covers all three surfaces of this repo:

| Surface | What it is | What to edit |
|---|---|---|
| **A · Shopify theme (real store)** | `sections/`, `templates/`, `config/` — the production store | Shopify admin (no code) |
| **B · Bulk / CSV import** | `docs/import/products.csv` + builder | `preview/js/data.js` → regenerate CSV |
| **C · Static demo** | `preview/` — the frontend-only demo | `#/admin` panel **or** `preview/js/data.js` |

---

## Quick reference: what drives what

Everything auto-organises from **tags** and **prices**. Get these right and the
site updates itself — no template edits needed.

| You want… | Set this |
|---|---|
| Product shows in **Clothing / Lehengas / Jewellery** | Tag: `clothing`, `lehengas`, or `jewellery` |
| Product shows under a sub-category (mega-menu) | Tag = sub-category slug, e.g. `sarees`, `bridal-lehengas`, `earrings` |
| Product in an **editorial collection** (8 edits) | Tag: `coll-new`, `coll-rozana`, `coll-festive`, `coll-wedding`, `coll-boho`, `coll-party`, `coll-beach`, `coll-limited` |
| Product in **New Arrivals** | Tag: `new` |
| "Bestseller" badge (demo only) | Tag: `bestseller` |
| Product **ON SALE** | **Compare-at price > Price** (theme shows strikethrough + % off badge automatically) |
| Product **SOLD OUT** | Inventory quantity = `0` |
| Product appears on the **Sale page** | On sale (compare-at > price) → auto-listed in the `sale` collection |

---

## A · Add products in the real Shopify theme

### Manual (best for a few products)

1. Shopify admin → **Products → Add product**.
2. Fill **Title**, **Description** (use the `<>` HTML button for rich text).
3. **Media** → upload real photos (drop into Content → Files first if
   reuse anywhere).
4. **Pricing**: `Price` = selling price, **Compare-at price** = old price
   (higher) → this *is* what makes it a sale item.
5. **Inventory**: set quantity (0 = sold out).
6. **Variants**: add **Size** and **Colour** options (matches the
   Size × Colour matrix used across the store).
7. **Product category** (GMC tax category) + **Type** (e.g. `Lehenga`,
   `Saree`, `Jhumka`).
8. **Tags** — this is the important part. Add the tags from the table
   above. Example for a wedding lehenga on sale:

   ```
   lehengas, bridal-lehengas, coll-wedding, coll-new, new
   ```
9. **Search engine listing** → set SEO title + description.
10. **Status** → Active. Save.

### Optional metafields (ratings, fabric)

Settings → Custom data → Products → add (see `import/metafields-reference.csv`):

| Name | Namespace/key | Type |
|---|---|---|
| Rating | `custom.rating` | Decimal |
| Review count | `custom.review_count` | Integer |
| Fabric | `custom.fabric` | Single line text |

The product page displays these automatically (`reviews.*` metafields from
Judge.me / Loox / Yotpo are also read).

---

## B · Bulk add via CSV

The committed `docs/import/products.csv` already has **18 products /
71 variants**. Two ways to add more:

### B1 — Edit/extend the CSV by hand

Copy the existing rows, keep the same columns (`Handle, Title, Body (HTML),
… Image Src, …`), and file a new `products.csv` via
Products → **Import**. Key columns:

- `Handle` — URL slug, unique.
- `Tags` — comma-separated (see table above). This drives all collections.
- `Option1 Name/Value` = Size, `Option2 Name/Value` = Colour.
- `Variant Price` / `Variant Compare At Price` — sale = compare-at > price.
- `Variant Inventory Qty` — 0 = sold out.
- `Image Src` — full URL (Shopify downloads it during import).

### B2 — Regenerate from the source of truth

`preview/js/data.js` is the master catalogue. The generator is
`docs/import/build-products.js`:

```bash
cd docs/import
node build-products.js
```

> ⚠️ **Two bugs to fix first** (they exist in this repo right now):
> 1. `build-products.js` reads `../../js/data.js` — but the file is at
>    `../../preview/js/data.js`.
> 2. Its `IMG_BASE` points at `.../main/img/` — but the images live under
>    `.../main/preview/img/` (the committed CSV already has the correct URL,
>    so only the generator is wrong).
>
> Fix both lines, regenerate, and re-upload. If you import from a branch,
> replace `/main/` with `/<branch>/` in the CSV first.

---

## C · Running a sale

### C1 — Put products on sale (this is all you *need*)

A product is "on sale" the moment **Compare-at price > Price**. The theme's
`product-card` snippet and `main-product` section then show the strikethrough
price and a "% off" badge automatically — no code.

- Sale page `/collections/sale` is an **automated collection**: condition
  `Compare-at price > 0`. Every discounted product appears there on its own.
- The homepage **"The Sale Edit"** block pulls from the `sale` collection.
  If you renamed handles, update the picker in the theme editor.

### C2 — Sale banner (homepage)

Homepage → edit the **Sale band** section (from `templates/index.json`):

| Setting | Current | Change to |
|---|---|---|
| Kicker | `Festive Sale` | your campaign |
| Text | `Up to <em>30% off</em> the festive edit` | e.g. `Sitewide <em>20% off</em>` |
| Code | `Shop the sale — code FESTIVE20` | `Use code DIWALI25` |
| Link | `/collections/sale` | keep |

> Text is HTML — `<em>` italicises/accents a phrase.

### C3 — Discount codes

Shopify has no code-import; create them in admin → Discounts
(full steps in `docs/import/discounts.md`):

| Code | What it does |
|---|---|
| `WELCOME10` | 10% off first order (max ₹500) |
| `FESTIVE20` | 20% off the Festive Edit collection |
| `FLAT500` | ₹500 off orders ≥ ₹4,999 |
| `BUY2` | Buy 2, 40% off the 2nd item |
| `FREESHIP` | Free shipping |

Also add the automatic **free shipping over ₹1,999** shipping rate
(Settings → Shipping) — it must match `free_shipping_threshold` in theme
settings (default `1999`).

### C4 — "New Arrivals"

Tag products `new` and the automated **New Arrivals** collection
(tag = `new`) fills itself. Homepage "New Arrivals" block and the hero
"Shop new arrivals" button both point there.

---

## D · Static demo (`preview/`)

Two ways:

### D1 — Built-in admin (no code)

Open the demo → **#/admin** → PIN `2580` → OTP `482913`. From there you can:

- **Add / edit / delete products** — name, price, photo, stock, sizes, colours
- **Mark sold out** — set stock = 0
- **Toggle New Arrival / Bestseller** (`new` / `bestseller` tag)
- **Create discounts** (flat / % / first-order / festival / buy-2 / free-shipping)
- **Create collections**
- **Manage orders & customers**
- **Change the homepage banner**

Everything persists in the browser (`localStorage`).

### D2 — Edit the source data

Edit `preview/js/data.js`. Each product looks like:

```js
{ id: 'lh-07', name: 'New Bridal Lehenga', cat: 'lehengas', sub: 'Bridal Lehengas',
  price: 44999, mrp: 59999, img: 'img/lehenga1.jpg', imgs: ['img/lehenga1.jpg'],
  sizes: ['S', 'M', 'L'], colors: [{ n: 'Maroon', h: '#4a1220' }],
  stock: 5, tag: 'new', rating: 4.9, rc: 40, coll: ['wedding', 'new'],
  fabric: 'Raw silk · Zardozi', desc: '…' },
```

Demo rules (different from Shopify):

- **Sale**: `mrp > price` → on sale (badge + appears under Sale).
- **Sold out**: `stock <= 0`.
- **New** / **Bestseller**: `tag`.
- **Collections**: `coll: ['wedding','new', …]` → slugs from the
  `COLLECTIONS` array (`new`, `rozana`, `festive`, `wedding`, `boho`,
  `party`, `beach`, `limited`).
- **Discounts**: `DISCOUNTS_SEED` array.
- **Banner**: `LS_BASE` object.

Add images under `preview/img/` and reference them as `img/yourfile.jpg`.

---

## E · TL;DR checklist (real store)

1. **Add product** → Admin → Products → Add product (or CSV import).
2. **Price** + **Compare-at price** (higher) = sale.
3. **Tags** → `clothing|lehengas|jewellery`, sub-cat slug, `coll-*`, `new`.
4. **Stock** → 0 for sold out.
5. Collections self-fill → verify `sale` and `new-arrivals` exist
   (`docs/import/collections.md`).
6. **Sale banner** → theme editor → Sale band section.
7. **Discount codes** → Admin → Discounts (`docs/import/discounts.md`).
8. **Free shipping ≥ ₹1,999** → Settings → Shipping → rate + matching theme
   setting.
9. **Publish** when done.

---

## F · Admin-only page (restricted)

There's a staff page at `/pages/admin` in the theme. It is **not visible to
regular users** — two layers:

1. **Server-side (real):** only a logged-in customer **tagged `admin`** is
   shown the page. Everyone else gets an "Access denied" screen Liquid
   evaluates before the browser even loads the JS.
2. **Client-side (defense in depth):** even an `admin`-tagged customer must
   pass the **PIN → OTP** gate (`Webmaster` settings: `admin_pin` `2580`,
   `admin_otp` `482913`) before the dashboard unlocks. This step is JS, so
   it is obfuscation rather than real security — keep the genuine
   product/order/customer controls inside the Shopify admin.

### Setup (one time)

1. `Settings → Customer accounts` — make sure accounts are enabled.
2. `Admin → Customers → Add customer` — create the staff record.
3. On the customer record, add the tag **`admin`**.
4. `Admin → Online Store → Pages → Add page`:
   - Title: `Admin`
   - Under **Theme template**, choose **`page.admin`**
   - Body: leave blank
5. Optional: change the gate codes in `Admin → Online Store → Themes →
   Customize → Theme settings → Webmaster`.

> Signing in as any customer **without** the tag, or as a guest, shows the
> access-denied screen — nothing else is visible.

### How the layers behave

| Who visits `/pages/admin` | Sees |
|---|---|
| Guest (not signed in) | Access denied + sign-in link |
| Signed-in customer, no `admin` tag | Access denied + note showing their email |
| Signed-in customer with `admin` tag | PIN → OTP gate → read-only console linking into Shopify admin |

### Why it's read-only

The theme intentionally links out to `Shopify → Admin` for products,
collections, discounts, orders and customers, rather than exposing a
storefront-facing write path. This is the safe design: the theme cannot
bypass Shopify's permissions, and product/order data stays behind Shopify's
own login. Do not add a write endpoint to the storefront — a checkout-level
token can't safely act as the owner.

