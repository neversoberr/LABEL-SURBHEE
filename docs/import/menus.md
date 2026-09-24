# Menus setup — Label Surbhee

Create these in Shopify admin → Content → Menus. Nested items (one level)
automatically become the theme's **mega-menu** columns and the mobile menu
accordions.

## 1 · Main menu — handle `main-menu`

| Item          | Link                          |
|---------------|-------------------------------|
| Home          | `/`                           |
| New Arrivals  | `/collections/new-arrivals`   |
| Clothing      | `/collections/clothing`       |
| ↳ Dresses     | `/collections/clothing/dresses` |
| ↳ Indo-Western| `/collections/clothing/indo-western` |
| ↳ Ethnic Wear | `/collections/clothing/ethnic-wear` |
| ↳ Jackets     | `/collections/clothing/jackets` |
| ↳ Tops        | `/collections/clothing/tops` |
| ↳ Bottoms     | `/collections/clothing/bottoms` |
| ↳ Co-ords     | `/collections/clothing/co-ords` |
| ↳ Festive Wear| `/collections/festive-edit` |
| ↳ Sarees      | `/collections/clothing/sarees` |
| ↳ Blouses     | `/collections/clothing/blouses` |
| Lehengas      | `/collections/lehengas`       |
| ↳ Indo-Western Lehengas | `/collections/lehengas/indo-western-lehengas` |
| ↳ Festive Lehengas      | `/collections/lehengas/festive-lehengas` |
| ↳ Bridal Lehengas       | `/collections/lehengas/bridal-lehengas` |
| ↳ Designer Lehengas     | `/collections/lehengas/designer-lehengas` |
| ↳ Lehenga Sets          | `/collections/lehengas/lehenga-sets` |
| ↳ Skirt & Top Sets      | `/collections/lehengas/skirt-top-sets` |
| ↳ Dupattas              | `/collections/lehengas/dupattas` |
| Jewellery     | `/collections/jewellery`      |
| ↳ Earrings    | `/collections/jewellery/earrings` |
| ↳ Necklaces   | `/collections/jewellery/necklaces` |
| ↳ Rings       | `/collections/jewellery/rings` |
| ↳ Bracelets   | `/collections/jewellery/bracelets` |
| ↳ Bangles     | `/collections/jewellery/bangles` |
| ↳ Statement Jewellery | `/collections/jewellery/statement-jewellery` |
| ↳ Bridal Jewellery    | `/collections/jewellery/bridal-jewellery` |
| ↳ Festive Jewellery   | `/collections/jewellery/festive-jewellery` |
| ↳ New Arrivals        | `/collections/jewellery/new` |
| Collections   | `/collections`                |
| ↳ New Collection  | `/collections/new-collection` |
| ↳ Rozana          | `/collections/rozana` |
| ↳ Festive Edit    | `/collections/festive-edit` |
| ↳ Wedding Edit    | `/collections/wedding-edit` |
| ↳ Boho / Gypsy    | `/collections/boho-gypsy` |
| ↳ Party Edit      | `/collections/party-edit` |
| ↳ Beach / Resort  | `/collections/beach-resort` |
| ↳ Limited Edition | `/collections/limited-edition` |
| Sale          | `/collections/sale`           |

Then in the theme editor → **Header** section, add up to 6 "Mega-menu
feature" blocks. The **handle** field must match the parent menu item's
handle (`clothing`, `lehengas`, `jewellery`, `collections`):

| Handle        | Kicker             | Heading                    | Image     | Link |
|---------------|--------------------|----------------------------|-----------|------|
| `clothing`    | The Festive Edit   | Co-ords, kurtas & the glow | dress1    | `/collections/festive-edit` |
| `lehengas`    | The Bridal Edit    | Zardozi, made by hand      | lehenga1  | `/collections/lehengas` |
| `jewellery`   | Heirloom Jewellery | Kundan, chooda & jhumkas   | jewel1    | `/collections/jewellery` |
| `collections` | Editorial          | Eight ways to wear the house | about   | `/collections` |

(Upload the matching photos to Files, or pick any image in the editor.)

## 2 · Top bar menu — handle `top-menu`

Assign in Header section → "Top bar menu".

| Item              | Link                   |
|-------------------|------------------------|
| Shipping          | `/pages/shipping`      |
| Returns & Exchange| `/pages/returns-exchange` |
| FAQ               | `/pages/faq`           |
| My Account        | `/account`             |

## 3 · Category tabs — handle `category-tabs`

Assign in the collection template → "Category tabs".

| Item      | Link                        |
|-----------|-----------------------------|
| Clothing  | `/collections/clothing`     |
| Lehengas  | `/collections/lehengas`     |
| Jewellery | `/collections/jewellery`    |
| New       | `/collections/new-arrivals` |
| Sale      | `/collections/sale`         |

## 4 · Sub-category tabs (one menu per category)

Assigned automatically by the alternate collection templates
(`collection.clothing` → `submenu-clothing`, etc.).

**`submenu-clothing`** — same 10 links as Clothing's mega children above.
**`submenu-lehengas`** — same 7 links as Lehengas' mega children above.
**`submenu-jewellery`** — same 9 links as Jewellery's mega children above.

## 5 · Footer menus

Assign in the theme editor → **Footer** section.

**Column 1 `footer` (Shop)**

| Item           | Link                        |
|----------------|-----------------------------|
| New Arrivals   | `/collections/new-arrivals` |
| Clothing       | `/collections/clothing`     |
| Lehengas       | `/collections/lehengas`     |
| Jewellery      | `/collections/jewellery`    |
| Collections    | `/collections`              |
| Sale           | `/collections/sale`         |

**Column 2 `footer-help` (Help)**

| Item              | Link                   |
|-------------------|------------------------|
| Contact           | `/pages/contact`       |
| FAQ               | `/pages/faq`           |
| Shipping          | `/pages/shipping`      |
| Returns & Exchange| `/pages/returns-exchange` |
| Track Order       | `/pages/track-order`   |

**Column 3 `footer-about` (About)**

| Item                | Link            |
|---------------------|-----------------|
| About Label Surbhee | `/pages/about`  |

**Column 4 `footer-follow` (Follow Us)** — external links:

| Item      | Link                              |
|-----------|-----------------------------------|
| Instagram | `https://instagram.com/labelsurbhee` |
| Facebook  | `https://facebook.com/labelsurbhee`  |
| WhatsApp  | `https://wa.me/919820012345`      |

**Legal `footer-legal`** — shown in the bottom bar:

| Item              | Link               |
|-------------------|--------------------|
| Privacy Policy    | `/pages/privacy`   |
| Terms & Conditions| `/pages/terms`     |
| Refund Policy     | `/pages/refund`    |
