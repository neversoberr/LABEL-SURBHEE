# Import pack — Label Surbhee

Everything needed to fill a fresh Shopify store with the Label Surbhee
catalogue and content. Import in this order:

| Step | File / doc                  | Where                                    |
|------|-----------------------------|------------------------------------------|
| 1    | `products.csv`              | Products → Import (18 products, 71 variants, images hot-linked from GitHub) |
| 2    | `collections.md`            | Products → Collections (13 automated collections — handles must match!) |
| 3    | `pages/*.html`              | Content → Pages (7 content pages + 3 empty section-driven pages, see below) |
| 4    | `menus.md`                  | Content → Menus (main menu, top bar, tabs, footer) |
| 5    | `discounts.md`              | Discounts + Settings → Shipping (5 codes + free-shipping rate) |
| 6    | `metafields-reference.csv`  | Optional: product ratings, review counts, fabric (Settings → Custom data first) |

## The 3 section-driven pages (empty body)

These pages get all their content from their theme template — create them
with a **blank body** and pick the template in the page editor:

| Title       | Handle      | Theme template   |
|-------------|-------------|------------------|
| Contact     | `contact`   | `page.contact`   |
| FAQ         | `faq`       | `page.faq`       |
| My Wishlist | `wishlist`  | `page.wishlist`  |

## Product images

`products.csv` hot-links images from this public repo:

```
https://raw.githubusercontent.com/neversoberr/LABEL-SURBHEE/main/img/
```

Shopify downloads them into your store's Files during import, so the store
keeps working even if the repo moves. For production, replace them with
real product photography (Products → pick a product → Media).

> If you import from a branch instead of `main`, find-replace `/main/preview/img/`
> in the CSV with `/<branch>/preview/img/` first.

## Rebuilding the CSV

If the catalogue in `preview/js/data.js` changes, regenerate:

```bash
cd docs/import
node build-products.js
```
