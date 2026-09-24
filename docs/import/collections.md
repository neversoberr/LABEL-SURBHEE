# Collections setup — Label Surbhee

Create these as **automated collections** in Shopify admin → Products →
Collections. The product CSV already tags every product, so each collection
fills itself the moment it is created.

> Handles matter: the theme's homepage (`templates/index.json`) links to
> these exact handles. If Shopify generates a different handle, edit it
> under "Search engine listing" → URL handle.

## Category collections

| Title      | Handle     | Condition (product tag IS …) |
|------------|------------|------------------------------|
| Clothing   | `clothing` | `clothing`                   |
| Lehengas   | `lehengas` | `lehengas`                   |
| Jewellery  | `jewellery`| `jewellery`                  |

Collection image (optional, used on `/collections`): upload the matching
photo to Content → Files first — `dress1.jpg`, `lehenga1.jpg`, `jewel1.jpg`.

For each category collection, also set its **Theme template** (bottom of the
collection editor) so the sub-category tabs appear:

| Collection | Theme template            |
|------------|---------------------------|
| clothing   | `collection.clothing`     |
| lehengas   | `collection.lehengas`     |
| jewellery  | `collection.jewellery`    |

(The alternate templates ship with the theme — see
`templates/collection.clothing.json` etc.)

## Editorial collections (the 8 edits)

| Title            | Handle            | Condition (product tag IS …) |
|------------------|-------------------|------------------------------|
| New Collection   | `new-collection`  | `coll-new`                   |
| Rozana           | `rozana`          | `coll-rozana`                |
| Festive Edit     | `festive-edit`    | `coll-festive`               |
| Wedding Edit     | `wedding-edit`    | `coll-wedding`               |
| Boho / Gypsy     | `boho-gypsy`      | `coll-boho`                  |
| Party Edit       | `party-edit`      | `coll-party`                 |
| Beach / Resort   | `beach-resort`    | `coll-beach`                 |
| Limited Edition  | `limited-edition` | `coll-limited`               |

Suggested descriptions (shown under the collection title):

- **New Collection** — "This season's first looks — maroon silk, gold thread, fresh air."
- **Rozana** — "Rozana means “everyday”. Polished pieces for days that don't ask for ceremony."
- **Festive Edit** — "Diwali light, wedding light — everything that catches the glow."
- **Wedding Edit** — "Bridal lehengas and heirloom jewellery, made for the moment you wait a lifetime for."
- **Boho / Gypsy** — "Layered, loose, a little wild — embroidery that remembers the desert."
- **Party Edit** — "After-dark silhouettes. Cut to move, finished to stop the room."
- **Beach / Resort** — "Sea salt and silk. Lightweight drapes for sunlit balconies and slow mornings."
- **Limited Edition** — "Small numbers, large intention. When a piece sells out, it's gone."

## Utility collections

| Title        | Handle         | Condition |
|--------------|----------------|-----------|
| New Arrivals | `new-arrivals` | Product tag IS `new` |
| Sale         | `sale`         | Compare-at price IS GREATER THAN `0` |

> If the "Compare-at price" condition is unavailable in your admin, create
> `sale` as a **manual** collection and add the on-sale products by hand.

## Sub-category filtering (no extra collections needed)

Every product is also tagged with its sub-category slug (`bridal-lehengas`,
`sarees`, …). The mega-menu links straight at tag-filtered URLs:

```
/collections/lehengas/bridal-lehengas
/collections/clothing/sarees
/collections/jewellery/new        ← "New Arrivals" under Jewellery
```

Two special cases from the original storefront:

- `Clothing → Festive Wear` links to `/collections/festive-edit`
  (there is no `festive-wear` product tag).
- Empty results (e.g. `Bottoms`, which has no products yet) render the
  theme's "This edit is still being pressed." empty state — safe to keep.
