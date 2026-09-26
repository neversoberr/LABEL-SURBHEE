# Label Surbhee — Handcrafted Luxury Bridal Storefront

A bespoke luxury e-commerce storefront for **Label Surbhee** (Mumbai), generated in alignment with the installed **UIUX Pro Max** design system for high-end Indian bridal couture.

---

## ✦ Design System Architecture

- **Aesthetic**: *House of Maroon & Gold* — Indian Heritage High Luxury
- **Primary Color Palette**:
  - Deep Imperial Maroon: `#2b0811` (Hero canvas), `#1f050c` (Header/Footer), `#330b16` (Cards), `#3d1220` (Surface)
  - Antique Muted Gold: `#c9a24b` (Primary accents & borders), `#e2c27e` (Highlights & titles), `#f0dfb6` (Faint luxury text), `#a8813a` (Dark gold)
  - Heritage Ivory: `#f5edda` (Body text), `#c8bca1` (Muted), `#9d9078` (Subtle metadata)
- **Typography**:
  - Display / Headings: **Marcellus** (classical serif symmetry)
  - Editorial Accents / Quotes / Hero: **Cormorant Garamond** (romantic italic elegance)
  - Body / Navigation / Metadata: **Jost** (clean, modern geometric clarity)
- **Interactive Micro-Interactions**:
  - Gold button sweep hover transitions (`scaleX` slide fills)
  - Image crossfade gallery swapping on hover
  - Smooth slide-out cart drawer with free-shipping dynamic progress bar
  - Keyboard accessible modals (`Escape` key handling)
  - Hash-based Single Page App (SPA) architecture with instant client routing

---

## ✦ Directory Structure

```
site/
├── css/
│   └── style.css            # Complete luxury styling system (responsive, dark/gold)
├── img/                     # 14 high-resolution imagery assets (4 AI editorials + 10 catalogue)
│   ├── hero-editorial.jpg   # 1024x1536 bespoke editorial hero shot
│   ├── lehenga-editorial.jpg# 1024x1536 bridal lehenga category cover
│   ├── jewellery-editorial.jpg# 1024x1536 polki choker jewellery cover
│   ├── saree-editorial.jpg  # 1024x1536 handloom saree category cover
│   ├── about.jpg            # Santacruz atelier story photo
│   ├── coords1.jpg          # Bandhani co-ord set
│   ├── dress1.jpg           # Chanderi anarkali gown
│   ├── hero.jpg             # Bridal campaign image
│   ├── jewel1.jpg           # Heritage kundan necklace
│   ├── jewel2.jpg           # Jadau polki jhumkas
│   ├── lehenga1.jpg         # Zardozi bridal lehenga
│   ├── lehenga2.jpg         # Banarasi festive lehenga
│   ├── saree1.jpg           # Kanjeevaram silk saree
│   └── top1.jpg             # Hand-embroidered corset top
├── js/
│   ├── data.js              # Complete 18-piece catalogue, 8 collections, reviews, FAQs
│   └── app.js               # Reactive SPA engine, cart, wishlist, checkout, tracking, admin
├── favicon.svg              # Gold LS monogram icon
├── index.html               # Main storefront SPA shell with OpenGraph and JSON-LD
├── robots.txt               # SEO crawler rules
└── sitemap.xml              # Search engine XML index
```

---

## ✦ Storefront Feature Suite

1. **Homepage (`#/`)**:
   - Editorial hero with live rotating badge and CTA pairings
   - Moving luxury marquee band (*"Handcrafted in Mumbai · Heritage Silks · Bespoke Bridal"*)
   - Category navigation tiles with subtle hover zoom
   - Curated Editorial Collections interactive masonry grid
   - Bestseller & New Arrivals showcase
   - Split atelier heritage story (*"Crafted by Master Karigars"*)
   - VIP privilege sale band
   - Trust row with artisanal seals
   - Live client reviews showcase
   - Instagram atelier gallery feed & VIP bridal dispatch newsletter signup

2. **Shop Catalogues**:
   - **All Clothing** (`#/shop/clothing`): Sarees, Anarkalis, Co-ords, Tops
   - **Bridal Lehengas** (`#/shop/lehengas`): Bridal, Festive, Mehendi lehengas
   - **Heirloom Jewellery** (`#/shop/jewellery`): Necklaces, Chokers, Earrings, Maangtikkas
   - **Curated Collections** (`#/collections`): Noor-e-Kashmir, Royal Banaras, Sabyasachi Tribute, Mughal Zardozi, etc.
   - **New Arrivals** (`#/new`) & **Privilege Sale** (`#/sale`)
   - Interactive sorting (Featured, Price: Low to High, Price: High to Low, Best Rating)
   - Dynamic category chips and filter tags

3. **Product Detail Pages (`#/product/:id`)**:
   - Multi-photo gallery sticky display with thumbnail selection
   - Real-time stock status, sale badges, and pricing calculations
   - Size selector with disabled sold-out indicators
   - Colour swatch picking
   - Interactive quantity adjuster
   - WhatsApp bridal concierge button (direct pre-filled WhatsApp link)
   - Pin code delivery estimator (instant transit speed check)
   - Accordions for Artisanal Details, Fabric & Care, Delivery & Returns, Size Guide modal
   - Client Reviews feed with interactive 5-star review submission form
   - Related products carousel

4. **Cart Drawer & Privilege Discounts**:
   - Slide-out bag accessible from any page
   - Free shipping calculation threshold (Complimentary over ₹5,000)
   - Promo code validation engine:
     - `SURBHEE10` (10% off any order)
     - `FIRST15` (15% off first order)
     - `BRIDAL20` (20% off orders over ₹25,000)
     - `FESTIVE500` (₹500 flat discount over ₹3,000)
     - `FREESHIP` (Free shipping privilege)
   - Subtotal, privilege savings, and grand total recalculations

5. **Wishlist (`#/wishlist`)**:
   - One-click heart save on any card or product detail
   - Badge counter in top navigation
   - Dedicated wishlist page with instant "Move to Bag" or "Remove"

6. **Full Checkout (`#/checkout`)**:
   - Two-column luxury checkout experience
   - Client information, delivery address, state selection, pincode validation
   - Shipping options (Complimentary Insured Delivery vs. Mumbai Atelier White-Glove VIP Courier)
   - Payment methods: UPI (Google Pay / PhonePe / Paytm), Credit / Debit Card, Net Banking, Cash on Delivery (COD)
   - Full order generation with unique ID (`LS-2026-XXXXX`), saved to client history

7. **Consignment Tracking (`#/track`)**:
   - Search by Order ID or AWB Tracking Number
   - Visual multi-step tracking progress timeline (Order Placed → Handcrafted & Inspected → Dispatched → In Transit → Delivered)

8. **Client Account Portal (`#/account`)**:
   - Client profile details
   - Order history ledger with live status indicators
   - Saved delivery address book
   - Direct shortcut to staff portal

9. **Staff Admin Portal (`#/admin`)**:
   - Protected security gate (PIN `2580` / OTP `482913`)
   - Overview KPI dashboard: Total Sales (₹), Active Orders, Catalogue Units, Customer Roster
   - Product Management: Toggle Stock availability, update prices, add/edit items
   - Discount Engine: Create fresh promo codes (percentage or flat discount)
   - Order Manager: Update fulfillment status (Processing, Handcrafted, Dispatched, Delivered)
   - Homepage Banner Editor: Live-edit hero headline, kicker, and imagery without touching code

10. **Information Pages**:
    - **Our Atelier Heritage** (`#/about`): Philosophy, Santacruz atelier story, master artisans
    - **Bespoke Appointment** (`#/contact`): Consultation booking form, boutique address, phone, WhatsApp
    - **Shipping & Transit** (`#/shipping`): Domestic transit, international rates, customs
    - **Returns & Alterations** (`#/returns`): 7-day complimentary alteration window
    - **FAQ** (`#/faq`): Interactive collapsible answers for bridal couture queries
