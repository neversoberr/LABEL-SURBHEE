/* Build script: reads ../../js/data.js and generates products.csv.
   Run: node build-products.js
   (The generated CSV is committed — re-run only if the catalogue changes.) */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const candidatePaths = [
  path.join(__dirname, '..', '..', 'site', 'js', 'data.js'),
  path.join(__dirname, '..', '..', 'preview', 'js', 'data.js'),
  path.join(__dirname, '..', '..', 'js', 'data.js')
];
const dataPath = candidatePaths.find(p => fs.existsSync(p));
if (!dataPath) {
  console.error('Could not find data.js in site/js, preview/js, or js/');
  process.exit(1);
}
const src = fs.readFileSync(dataPath, 'utf8');
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(src.replace(/const /g, 'var ') + '\nthis.__out = { PRODUCTS, BRAND };', sandbox);
const { PRODUCTS, BRAND } = sandbox.__out;

const IMG_BASE = 'https://raw.githubusercontent.com/neversoberr/LABEL-SURBHEE/main/img/';

const slug = (s) =>
  String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const cell = (v) => {
  if (v === null || v === undefined || v === '') return '';
  const s = String(v);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
};

const HEADER = [
  'Handle', 'Title', 'Body (HTML)', 'Vendor', 'Product Category', 'Type', 'Tags',
  'Published', 'Option1 Name', 'Option1 Value', 'Option2 Name', 'Option2 Value',
  'Option3 Name', 'Option3 Value', 'Variant SKU', 'Variant Grams',
  'Variant Inventory Tracker', 'Variant Inventory Qty', 'Variant Inventory Policy',
  'Variant Fulfillment Service', 'Variant Price', 'Variant Compare At Price',
  'Variant Requires Shipping', 'Variant Taxable', 'Variant Barcode',
  'Image Src', 'Image Position', 'Image Alt Text', 'Gift Card',
  'SEO Title', 'SEO Description', 'Status'
];

const rows = [HEADER];

PRODUCTS.forEach((p) => {
  const handle = slug(p.name);
  const tags = [
    p.tag || '',
    p.cat,
    slug(p.sub),
    ...p.coll.map((c) => 'coll-' + c)
  ].filter(Boolean).join(', ');

  const body = `<p>${p.desc}</p>\n<ul>\n<li><strong>Fabric:</strong> ${p.fabric}</li>\n<li><strong>Category:</strong> ${p.sub}</li>\n</ul>\n<p>Cut and embroidered by hand in our Bandra West atelier. Free shipping across India on orders over ${'₹'}${BRAND.freeShipOver.toLocaleString('en-IN')} · 7-day returns · COD available.</p>`;

  const sizes = p.sizes && p.sizes.length ? p.sizes : ['One Size'];
  const colors = p.colors && p.colors.length ? p.colors : [{ n: 'As shown' }];
  const useColour = colors.length > 1;

  // Build variant matrix: Size × Colour (or Size only)
  const combos = [];
  sizes.forEach((s) => {
    if (useColour) colors.forEach((c) => combos.push([s, c.n]));
    else combos.push([s, colors[0].n]);
  });

  const perVariantQty = p.stock <= 0 ? 0 : Math.max(1, Math.round(p.stock / combos.length));
  const imgs = p.imgs && p.imgs.length ? p.imgs : [p.img];

  combos.forEach(([size, colour], i) => {
    const first = i === 0;
    const sku = `${p.id}-${slug(size)}${useColour ? '-' + slug(colour) : ''}`.toUpperCase();
    const imgFile = imgs[i % imgs.length].replace(/^img\//, '');
    rows.push([
      first ? handle : '',                                            // Handle
      first ? p.name : '',                                             // Title
      first ? body : '',                                               // Body
      first ? 'Label Surbhee' : '',                                    // Vendor
      '',                                                              // Product Category
      first ? p.sub : '',                                              // Type
      first ? tags : '',                                               // Tags
      first ? 'TRUE' : '',                                             // Published
      'Size',                                                          // Option1 Name
      size,                                                            // Option1 Value
      useColour ? 'Colour' : '',                                       // Option2 Name
      useColour ? colour : '',                                         // Option2 Value
      '', '',                                                          // Option3
      sku,                                                             // SKU
      '500',                                                           // Grams
      'shopify',                                                       // Tracker
      String(perVariantQty),                                           // Qty
      'deny',                                                          // Policy
      'manual',                                                        // Fulfillment
      String(p.price),                                                 // Price
      p.mrp > p.price ? String(p.mrp) : '',                            // Compare at
      'TRUE',                                                          // Requires shipping
      'TRUE',                                                          // Taxable
      '',                                                              // Barcode
      first || i < imgs.length ? IMG_BASE + imgFile : '',              // Image Src
      first || i < imgs.length ? String((i % imgs.length) + 1) : '',   // Image Position
      first || i < imgs.length ? `${p.name} — Label Surbhee` : '',     // Alt
      '',                                                              // Gift card
      first ? `${p.name} | Label Surbhee` : '',                        // SEO title
      first ? `${p.desc} Free shipping over ₹${BRAND.freeShipOver.toLocaleString('en-IN')}.` : '', // SEO desc
      first ? 'active' : ''                                            // Status
    ]);
  });
});

const csv = rows.map((r) => r.map(cell).join(',')).join('\n') + '\n';
fs.writeFileSync(path.join(__dirname, 'products.csv'), csv);
console.log(`Wrote products.csv — ${PRODUCTS.length} products, ${rows.length - 1} variant rows.`);
