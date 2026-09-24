# Discounts setup — Label Surbhee

Shopify has no discount-code import, so create these five codes by hand in
admin → Discounts → Create discount → Discount code. They mirror the promo
engine from the original storefront.

## 1 · WELCOME10 — 10% off, first order

- Type: **Amount off order** → Percentage `10%`
- Maximum discount: tick "Set a maximum discount amount" → `₹500`
- Minimum purchase: none
- Customer eligibility: **Specific customer segments** → target new /
  first-time customers if you use segments; otherwise "All customers" with
  **Limit to one use per customer** ticked
- Usage limits: tick "Limit to one use per customer"
- Active dates: from today, no end date

> Shopify cannot natively enforce "first order only" on a code. One-use-per-
> customer is the closest built-in behaviour.

## 2 · FESTIVE20 — 20% off the Festive Edit

- Type: **Amount off products** → Percentage `20%`
- Applies to: **Specific collections** → `Festive Edit`
- Minimum purchase: none
- Customer eligibility: All customers
- Active dates: set your festival window (e.g. Diwali week), or leave open

## 3 · FLAT500 — ₹500 off orders above ₹4,999

- Type: **Amount off order** → Fixed `₹500`
- Minimum purchase: tick "Minimum purchase amount" → `₹4,999`
- Customer eligibility: All customers

## 4 · BUY2 — buy 2, 40% off the 2nd item

- Type: **Buy X, get Y**
- Customer buys: Minimum quantity `2`, Any products
- Customer gets: Quantity `1`, Any products, **At a discounted value** →
  Percentage `40%`
- Tick "Set a maximum number of uses per order" → `1`
- Customer eligibility: All customers

## 5 · FREESHIP — free shipping

- Type: **Free shipping**
- Minimum purchase: none (or match your policy)
- Customer eligibility: All customers
- Note: exclude nothing; works alongside the automatic free-shipping rate
  below.

## Automatic free shipping over ₹1,999 (no code)

This is a **shipping rate**, not a discount:

1. Settings → Shipping and delivery → your shipping profile → Add rate.
2. Zone: India. Name: `Free Shipping`. Condition: order price ≥ `₹1,999`.
   Price: `₹0`.
3. Keep your standard `₹99` / remote `₹149` / express `₹199` rates below it.

The theme's `free_shipping_threshold` setting (default `1999`) must match —
it drives the "Add ₹X more for free shipping" message in the cart drawer.
