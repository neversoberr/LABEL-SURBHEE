/* ============================================================
   LABEL SURBHEE — catalogue, collections & content data
   ============================================================ */

const INR = n => '₹' + Math.round(n).toLocaleString('en-IN');

const BRAND = {
  name: 'LABEL SURBHEE',
  tagline: 'Draped in Maroon. Finished in Gold.',
  phone: '+91 98200 12345',
  whatsapp: '919820012345',
  email: 'hello@labelsurbhee.com',
  instagram: 'https://instagram.com/labelsurbhee',
  facebook: 'https://facebook.com/labelsurbhee',
  address: 'Atelier 7, Linking Road, Bandra West, Mumbai 400050',
  hours: 'Mon – Sat · 11 am – 7 pm',
  freeShipOver: 1999,
  shipStandard: 99,
  shipRemote: 149,
  shipExpress: 199,
  returnDays: 7
};

const CATEGORIES = {
  clothing: {
    name: 'Clothing',
    img: 'img/dress1.jpg',
    subs: ['Dresses', 'Indo-Western', 'Ethnic Wear', 'Jackets', 'Tops', 'Bottoms', 'Co-ords', 'Festive Wear', 'Sarees', 'Blouses']
  },
  lehengas: {
    name: 'Lehengas',
    img: 'img/lehenga1.jpg',
    subs: ['Indo-Western Lehengas', 'Festive Lehengas', 'Bridal Lehengas', 'Designer Lehengas', 'Lehenga Sets', 'Skirt & Top Sets', 'Dupattas']
  },
  jewellery: {
    name: 'Jewellery',
    img: 'img/jewel1.jpg',
    subs: ['Earrings', 'Necklaces', 'Rings', 'Bracelets', 'Bangles', 'Statement Jewellery', 'Bridal Jewellery', 'Festive Jewellery', 'New Arrivals']
  },
  collections: {
    name: 'Collections',
    img: 'img/about.jpg',
    subs: ['New Collection', 'Rozana', 'Festive Edit', 'Wedding Edit', 'Boho / Gypsy', 'Party Edit', 'Beach / Resort', 'Limited Edition']
  }
};

const COLLECTIONS = [
  { slug: 'new',       name: 'New Collection',  blurb: 'This season’s first looks — maroon silk, gold thread, fresh air.',        img: 'img/lehenga2.jpg' },
  { slug: 'rozana',    name: 'Rozana',          blurb: 'Rozana means “everyday”. Polished pieces for days that don’t ask for ceremony.', img: 'img/top1.jpg' },
  { slug: 'festive',   name: 'Festive Edit',    blurb: 'Diwali light, wedding light — everything that catches the glow.',        img: 'img/saree1.jpg' },
  { slug: 'wedding',   name: 'Wedding Edit',    blurb: 'Bridal lehengas and heirloom jewellery, made for the moment you wait a lifetime for.', img: 'img/lehenga1.jpg' },
  { slug: 'boho',      name: 'Boho / Gypsy',    blurb: 'Layered, loose, a little wild — embroidery that remembers the desert.',   img: 'img/about.jpg' },
  { slug: 'party',     name: 'Party Edit',      blurb: 'After-dark silhouettes. Cut to move, finished to stop the room.',          img: 'img/dress1.jpg' },
  { slug: 'beach',     name: 'Beach / Resort',  blurb: 'Sea salt and silk. Lightweight drapes for sunlit balconies and slow mornings.', img: 'img/saree1.jpg' },
  { slug: 'limited',   name: 'Limited Edition', blurb: 'Small numbers, large intention. When a piece sells out, it’s gone.',       img: 'img/jewel2.jpg' }
];

/* ---------- products ----------
   tag: 'new' | 'bestseller' | ''  ·  sale is derived (mrp > price)  ·  stock 0 = sold out */

const PRODUCTS = [
  /* Lehengas */
  { id: 'lh-01', name: 'Ayesha Bridal Lehenga', cat: 'lehengas', sub: 'Bridal Lehengas',
    price: 42999, mrp: 59999, img: 'img/lehenga1.jpg', imgs: ['img/lehenga1.jpg', 'img/about.jpg'],
    sizes: ['S', 'M', 'L', 'XL'], colors: [{ n: 'Maroon', h: '#4a1220' }, { n: 'Antique Gold', h: '#c9a24b' }],
    stock: 6, tag: 'bestseller', rating: 4.9, rc: 182, coll: ['wedding', 'new', 'limited'],
    fabric: 'Raw silk · Zardozi & aari work',
    desc: 'A hand-embroidered bridal lehenga in deep maroon raw silk, finished with antique gold zardozi and a scalloped dupatta. Cut for grace, made for the moment.' },
  { id: 'lh-02', name: 'Maira Festive Lehenga', cat: 'lehengas', sub: 'Festive Lehengas',
    price: 18999, mrp: 24999, img: 'img/lehenga2.jpg', imgs: ['img/lehenga2.jpg', 'img/about.jpg'],
    sizes: ['S', 'M', 'L'], colors: [{ n: 'Ivory', h: '#efe6d4' }, { n: 'Gold', h: '#c9a24b' }],
    stock: 12, tag: 'new', rating: 4.8, rc: 96, coll: ['festive', 'party', 'new'],
    fabric: 'Georgette · Gota patti border',
    desc: 'Champagne ivory georgette with a gota patti border — festive enough for Diwali, light enough for the dance floor.' },
  { id: 'lh-03', name: 'Zara Indo-Western Lehenga', cat: 'lehengas', sub: 'Indo-Western Lehengas',
    price: 12999, mrp: 16999, img: 'img/dress1.jpg', imgs: ['img/dress1.jpg', 'img/about.jpg'],
    sizes: ['S', 'M', 'L', 'XL'], colors: [{ n: 'Ivory', h: '#efe6d4' }],
    stock: 9, tag: 'new', rating: 4.6, rc: 58, coll: ['party', 'rozana'],
    fabric: 'Satin · Thread embroidery',
    desc: 'A skirt-and-gown hybrid that dresses up without dressing down. Wear it with the choli or as a gown.' },
  { id: 'lh-04', name: 'Rania Designer Lehenga', cat: 'lehengas', sub: 'Designer Lehengas',
    price: 27999, mrp: 27999, img: 'img/lehenga1.jpg', imgs: ['img/lehenga1.jpg', 'img/about.jpg'],
    sizes: ['M', 'L', 'XL'], colors: [{ n: 'Maroon', h: '#4a1220' }],
    stock: 4, tag: 'bestseller', rating: 4.7, rc: 141, coll: ['party', 'new'],
    fabric: 'Chikankari-raw silk · Mirror detail',
    desc: 'The silhouette our designers get asked about every single week. Structured flare, mirror-dot yoke, zero compromise.' },
  { id: 'lh-05', name: 'Simran Lehenga Set', cat: 'lehengas', sub: 'Lehenga Sets',
    price: 9999, mrp: 14999, img: 'img/lehenga2.jpg', imgs: ['img/lehenga2.jpg', 'img/about.jpg'],
    sizes: ['S', 'M', 'L'], colors: [{ n: 'Ivory', h: '#efe6d4' }, { n: 'Maroon', h: '#4a1220' }],
    stock: 15, tag: '', rating: 4.5, rc: 73, coll: ['festive', 'rozana'],
    fabric: 'Chiffon · Zari trim',
    desc: 'Lehenga, choli and dupatta as a set — the festive look, without the three-way hunt. Machine-friendly, hand-finished.' },
  { id: 'lh-06', name: 'Ishita Bridal', cat: 'lehengas', sub: 'Bridal Lehengas',
    price: 54999, mrp: 69999, img: 'img/lehenga1.jpg', imgs: ['img/lehenga1.jpg', 'img/about.jpg'],
    sizes: ['S', 'M', 'L'], colors: [{ n: 'Maroon', h: '#4a1220' }],
    stock: 0, tag: 'bestseller', rating: 5.0, rc: 203, coll: ['wedding', 'limited'],
    fabric: 'Dabka raw silk · Full zardozi',
    desc: 'Our most requested bridal piece — full dabka zardozi, two dupattas, one very patient embroidery team. Back for the wedding season.' },

  /* Clothing */
  { id: 'cl-01', name: 'Anaya Zari Saree', cat: 'clothing', sub: 'Sarees',
    price: 8499, mrp: 10999, img: 'img/saree1.jpg', imgs: ['img/saree1.jpg', 'img/about.jpg'],
    sizes: ['Free Size'], colors: [{ n: 'Maroon', h: '#4a1220' }, { n: 'Gold', h: '#c9a24b' }],
    stock: 10, tag: 'bestseller', rating: 4.8, rc: 154, coll: ['festive', 'wedding'],
    fabric: 'Raw silk · Woven zari border',
    desc: 'A deep maroon raw silk saree with a woven zari border that photographs like jewellery. Drapes in five minutes, holds all night.' },
  { id: 'cl-02', name: 'Meher Silk Gown', cat: 'clothing', sub: 'Dresses',
    price: 11999, mrp: 14999, img: 'img/dress1.jpg', imgs: ['img/dress1.jpg', 'img/about.jpg'],
    sizes: ['S', 'M', 'L', 'XL'], colors: [{ n: 'Ivory', h: '#efe6d4' }],
    stock: 8, tag: 'new', rating: 4.7, rc: 88, coll: ['party', 'new'],
    fabric: 'Silk blend · Gold thread panel',
    desc: 'An ivory silk Indo-Western gown with a gold-thread panel down the bodice. The “I’m late but I’m dressed” answer.' },
  { id: 'cl-03', name: 'Tara Festive Co-ords', cat: 'clothing', sub: 'Co-ords',
    price: 6999, mrp: 9499, img: 'img/coords1.jpg', imgs: ['img/coords1.jpg', 'img/about.jpg'],
    sizes: ['S', 'M', 'L', 'XL'], colors: [{ n: 'Maroon', h: '#4a1220' }],
    stock: 14, tag: 'new', rating: 4.6, rc: 64, coll: ['festive', 'party', 'new'],
    fabric: 'Cotton-silk · Antique gold buttons',
    desc: 'Jacket and wide-leg trousers in festive maroon with antique gold buttons. Co-ords that behave like a suit.' },
  { id: 'cl-04', name: 'Ira Embellished Kurta', cat: 'clothing', sub: 'Tops',
    price: 3999, mrp: 5499, img: 'img/top1.jpg', imgs: ['img/top1.jpg', 'img/about.jpg'],
    sizes: ['S', 'M', 'L', 'XL'], colors: [{ n: 'Maroon', h: '#4a1220' }],
    stock: 20, tag: 'bestseller', rating: 4.5, rc: 210, coll: ['rozana'],
    fabric: 'Cotton · Gold embroidery',
    desc: 'The kurta that earns its name — gold embroidery over maroon, soft enough for work, sharp enough for dinner after.' },
  { id: 'cl-05', name: 'Nadia Party Gown', cat: 'clothing', sub: 'Dresses',
    price: 7999, mrp: 7999, img: 'img/dress1.jpg', imgs: ['img/dress1.jpg', 'img/about.jpg'],
    sizes: ['S', 'M', 'L'], colors: [{ n: 'Ivory', h: '#efe6d4' }, { n: 'Maroon', h: '#4a1220' }],
    stock: 7, tag: 'bestseller', rating: 4.6, rc: 45, coll: ['party'],
    fabric: 'Satin · Bias cut',
    desc: 'Bias-cut satin that follows, not leads. Built for the second hour of a party, when the dancing gets serious.' },
  { id: 'cl-06', name: 'Aarohi Velvet Jacket', cat: 'clothing', sub: 'Jackets',
    price: 5999, mrp: 7999, img: 'img/coords1.jpg', imgs: ['img/coords1.jpg', 'img/about.jpg'],
    sizes: ['S', 'M', 'L'], colors: [{ n: 'Maroon', h: '#4a1220' }],
    stock: 6, tag: 'new', rating: 4.4, rc: 38, coll: ['rozana', 'new'],
    fabric: 'Silk velvet · Structured shoulder',
    desc: 'A cropped velvet jacket in maroon. Thrown over everything — the saree, the co-ord, the good dress.' },
  { id: 'cl-07', name: 'Riva Silk Blouse', cat: 'clothing', sub: 'Blouses',
    price: 2499, mrp: 2999, img: 'img/top1.jpg', imgs: ['img/top1.jpg', 'img/about.jpg'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'], colors: [{ n: 'Maroon', h: '#4a1220' }, { n: 'Ivory', h: '#efe6d4' }],
    stock: 25, tag: 'bestseller', rating: 4.7, rc: 176, coll: ['wedding'],
    fabric: 'Raw silk · Puff sleeve',
    desc: 'A structured raw silk blouse in two colours — the missing half of every saree you already own.' },

  /* Jewellery */
  { id: 'jw-01', name: 'Noor Jhumkas', cat: 'jewellery', sub: 'Earrings',
    price: 3499, mrp: 4499, img: 'img/jewel1.jpg', imgs: ['img/jewel1.jpg', 'img/jewel2.jpg'],
    sizes: ['One Size'], colors: [{ n: 'Antique Gold', h: '#c9a24b' }],
    stock: 18, tag: 'new', rating: 4.8, rc: 129, coll: ['festive', 'party', 'new'],
    fabric: 'Alpaca metal · Pearl drop',
    desc: 'Antique gold jhumkas with a single pearl drop — light on the ear, heavy in the room.' },
  { id: 'jw-02', name: 'Sana Kundan Set', cat: 'jewellery', sub: 'Necklaces',
    price: 5999, mrp: 7999, img: 'img/jewel2.jpg', imgs: ['img/jewel2.jpg', 'img/jewel1.jpg'],
    sizes: ['One Size'], colors: [{ n: 'Gold', h: '#c9a24b' }],
    stock: 11, tag: 'bestseller', rating: 4.9, rc: 264, coll: ['wedding', 'festive'],
    fabric: 'Kundan · Gold plating',
    desc: 'A kundan necklace with matching bangles. The piece our bridal clients point to first — and the one we almost never restock.' },
  { id: 'jw-03', name: 'Mira Bridal Necklace', cat: 'jewellery', sub: 'Bridal Jewellery',
    price: 8999, mrp: 12999, img: 'img/jewel2.jpg', imgs: ['img/jewel2.jpg', 'img/jewel1.jpg'],
    sizes: ['One Size'], colors: [{ n: 'Gold', h: '#c9a24b' }],
    stock: 5, tag: 'bestseller', rating: 4.9, rc: 118, coll: ['wedding', 'limited'],
    fabric: 'Kundan · Meenakari detail',
    desc: 'Statement bridal necklace with meenakari detail, made in small numbers. Pairs with the Ayesha and the Ishita.' },
  { id: 'jw-04', name: 'Kiara Chooda Bangles', cat: 'jewellery', sub: 'Bangles',
    price: 1999, mrp: 2999, img: 'img/jewel1.jpg', imgs: ['img/jewel1.jpg', 'img/jewel2.jpg'],
    sizes: ['One Size'], colors: [{ n: 'Gold', h: '#c9a24b' }],
    stock: 22, tag: 'bestseller', rating: 4.6, rc: 92, coll: ['festive', 'rozana'],
    fabric: 'Gold-plated · Engraved',
    desc: 'A stack of engraved bangles that chime just slightly — the sound your wrists were missing.' },
  { id: 'jw-05', name: 'Zoya Statement Ring', cat: 'jewellery', sub: 'Rings',
    price: 1499, mrp: 1499, img: 'img/jewel1.jpg', imgs: ['img/jewel1.jpg', 'img/jewel2.jpg'],
    sizes: ['6', '7', '8', '9'], colors: [{ n: 'Antique Gold', h: '#c9a24b' }],
    stock: 16, tag: 'new', rating: 4.5, rc: 41, coll: ['party', 'new'],
    fabric: 'Alpaca metal · Marble stone',
    desc: 'A wide antique gold ring with a dark marble face. One statement, no clutter.' }
];

/* ---------- discounts (admin can create more) ---------- */

const DISCOUNTS_SEED = [
  { code: 'WELCOME10', type: 'first',    value: 10,  min: 0,    active: true, desc: '10% off your first order (up to ₹500)' },
  { code: 'FESTIVE20', type: 'festival', value: 20,  min: 0,    active: true, desc: '20% off — Festive Edit' },
  { code: 'FLAT500',   type: 'flat',     value: 500, min: 4999, active: true, desc: '₹500 off orders above ₹4,999' },
  { code: 'BUY2',      type: 'buy2',     value: 40,  min: 0,    active: true, desc: 'Buy 2, get 40% off the 2nd item' },
  { code: 'FREESHIP',  type: 'freeship', value: 0,   min: 0,    active: true, desc: 'Free shipping on this order' }
];

/* ---------- reviews pool ---------- */

const REVIEW_POOL = [
  { n: 'Ananya M.', c: 'Mumbai',    r: 5, d: '2 weeks ago',  v: true,  t: 'The zardozi is even more beautiful in person. Wore it to my sister’s sangeet and got endless compliments — the fabric falls exactly like the pictures promise.' },
  { n: 'Priya S.',  c: 'Delhi',     r: 5, d: '1 month ago',  v: true,  t: 'Ordered a size up on WhatsApp advice and it fit perfectly. Embroidery is clean, no loose threads, packaging felt like unwrapping a gift.' },
  { n: 'Fatima K.', c: 'Hyderabad', r: 4, d: '3 weeks ago',  v: true,  t: 'Beautiful piece and true to the photos. Slightly heavier than I expected but the drape makes up for it. Delivery took 4 days to Hyderabad.' },
  { n: 'Ritika D.', c: 'Bengaluru', r: 5, d: '5 days ago',   v: false, t: 'The gold work catches light beautifully. I wore it to my cousin’s reception and three people asked where it was from. Worth every rupee.' },
  { n: 'Sneha P.',  c: 'Pune',      r: 5, d: '2 months ago', v: true,  t: 'Second purchase from Label Surbhee and they keep raising the bar. The blouse fits like it was made for me. Staff on WhatsApp are patient and kind.' },
  { n: 'Aisha R.',  c: 'Jaipur',    r: 4, d: '1 week ago',   v: true,  t: 'Lovely craftsmanship. I would have loved a little more stretch, but the fit guide was accurate and the exchange (for the dupatta) was painless.' },
  { n: 'Divya N.',  c: 'Kolkata',   r: 5, d: '3 days ago',   v: true,  t: 'Bought the jhumkas with the festive lehenga — the set photographs unbelievably well. Feels premium from the box to the wear.' },
  { n: 'Meher J.',  c: 'Ahmedabad', r: 5, d: '1 month ago',  v: true,  t: 'The maroon is the exact deep shade from the site, no disappointment. Delivery was 2 days to Ahmedabad with tracking on WhatsApp the whole way.' }
];

/* ---------- FAQ ---------- */

const FAQ = [
  { q: 'How do I choose my size?', a: 'Every clothing and lehenga page has a size guide with bust, waist and hip measurements. If you’re between sizes, chat with us on WhatsApp and tell us your measurements — we’ll tell you which to order, and exchanges within 7 days are free.' },
  { q: 'How long does delivery take?', a: 'Metro cities: 2–4 days. Rest of India: 3–7 days. Express delivery (1–2 days) is available at checkout for ₹199. You’ll get tracking by email and WhatsApp at every step.' },
  { q: 'Is shipping free?', a: 'Yes — shipping is free on all orders above ₹1,999. Below that, standard shipping is ₹99 (₹149 to remote areas).' },
  { q: 'Can I return or exchange?', a: 'Returns and exchanges are accepted within 7 days of delivery on unworn items with tags attached. See our Returns & Exchange page for the full policy — including what applies to jewellery, lehengas and sale items.' },
  { q: 'Do you offer cash on delivery?', a: 'Yes, COD is available across India on orders under ₹25,000. UPI, debit/credit cards and net banking are available at checkout.' },
  { q: 'Can I customise a lehenga for my wedding?', a: 'Yes — our bridal lehengas can be customised in size, colour and embroidery placement. WhatsApp us from the product page with your date and measurements; we confirm timelines within 24 hours. Customised pieces are final sale.' },
  { q: 'How do I track my order?', a: 'Use “Track Order” in the top bar with your order number (e.g. LS-84920). You’ll also receive WhatsApp and email notifications: order received, payment confirmed, shipped, out for delivery, delivered.' },
  { q: 'Are your products suitable for sensitive skin?', a: 'Our jewellery is gold-plated alpaca with skin-safe coatings, and all fabrics are skin-tested before listing. If you have a known metal allergy, message us before ordering and we’ll suggest the safest pieces.' }
];

/* ---------- Instagram feed ---------- */

const INSTAGRAM = [
  { img: 'img/hero.jpg',     likes: '12.4k' },
  { img: 'img/lehenga2.jpg', likes: '9.1k' },
  { img: 'img/jewel1.jpg',   likes: '15.8k' },
  { img: 'img/saree1.jpg',   likes: '7.6k' },
  { img: 'img/coords1.jpg',  likes: '6.2k' },
  { img: 'img/about.jpg',    likes: '4.9k' }
];

/* ---------- size guide ---------- */

const SIZE_GUIDE = [
  ['S', '32–34', '26–28', '34–36'],
  ['M', '34–36', '28–30', '36–38'],
  ['L', '36–38', '30–32', '38–40'],
  ['XL', '38–40', '32–34', '40–42'],
  ['XXL', '40–42', '34–36', '42–44']
];

/* ---------- SEO ---------- */

const SEO = {
  home: { t: 'Label Surbhee | Luxury Indian Fashion, Lehengas & Jewellery', d: 'Bridal lehengas, festive couture, sarees and heirloom jewellery by Label Surbhee — a Mumbai atelier. Deep maroon, antique gold, made to be remembered. Free shipping over ₹1,999.' },
  shop: { t: (n) => n + ' | Shop Label Surbhee', d: 'Shop Label Surbhee — lehengas, dresses, co-ords, sarees and jewellery. Every piece cut and finished in our Mumbai atelier.' },
  product: { t: (n) => n + ' | Label Surbhee', d: 'Shop ' },
  about: { t: 'About Label Surbhee | The World of Label Surbhee', d: 'The story, philosophy and design inspiration of Label Surbhee — an Indian luxury fashion house working in deep maroon and antique gold.' },
  contact: { t: 'Contact | Label Surbhee', d: 'Get in touch with Label Surbhee — phone, WhatsApp, email and our Bandra West atelier in Mumbai.' },
  shipping: { t: 'Shipping & Delivery | Label Surbhee', d: 'India-wide shipping by Label Surbhee: delivery times, charges, free shipping over ₹1,999 and live order tracking.' },
  returns: { t: 'Returns & Exchange | Label Surbhee', d: 'Label Surbhee return and exchange policy: 7-day window, eligible products, sale items, jewellery, lehengas, damaged goods and refunds.' },
  faq: { t: 'FAQ | Label Surbhee', d: 'Frequently asked questions about sizing, shipping, returns, COD and bridal customisation at Label Surbhee.' },
  account: { t: 'My Account | Label Surbhee', d: 'Manage your orders, wishlist, saved addresses and previous purchases with Label Surbhee.' },
  track: { t: 'Track Your Order | Label Surbhee', d: 'Track your Label Surbhee order in real time — from confirmed to delivered.' },
  wishlist: { t: 'My Wishlist | Label Surbhee', d: 'Your saved Label Surbhee pieces, in one place.' },
  legal: { t: (n) => n + ' | Label Surbhee', d: '' }
};
