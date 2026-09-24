/* ============================================================
   LABEL SURBHEE — application
   Pure client-side: hash router, cart, wishlist, checkout,
   account, admin panel, tracking, reviews, promo engine.
   ============================================================ */

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const wa = (msg) => 'https://wa.me/' + BRAND.whatsapp + '?text=' + encodeURIComponent(msg);

/* ---------------- state ---------------- */
const KEY = 'labelsurbhee_v1';
const defState = () => ({
  cart: [], wishlist: [], orders: [], profile: null, addresses: [],
  userReviews: {}, prodEdits: null, discounts: null, banner: null, orderStatus: {}
});
let state = load();
function load() {
  try { return Object.assign(defState(), JSON.parse(localStorage.getItem(KEY) || '{}')); }
  catch (e) { return defState(); }
}
function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
const products = () => state.prodEdits || PRODUCTS;
const discounts = () => state.discounts || DISCOUNTS_SEED;
const banner = () => state.banner || LS_BASE;
const getProd = id => products().find(p => p.id === id);

/* ---------------- icons ---------------- */
const I = {
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M6 8h12l1 13H5L6 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
  heart: '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.6-9.3-9C1 7.5 3 4.5 6.2 4.5c2 0 3.4 1.1 4.2 2.4l1.6 2.4 1.6-2.4c.8-1.3 2.2-2.4 4.2-2.4C21 4.5 23 7.5 21.3 11 19 15.4 12 20 12 20z"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 6h18M3 12h18M3 18h12"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M1 5h14v11H1zM15 9h4l3 3v4h-7z"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/></svg>',
  swap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 8h13l-3-3M20 16H7l3 3"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 2 4 5v6c0 5 3.4 8.8 8 11 4.6-2.2 8-6 8-11V5l-8-3z"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>',
  cash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M5 9h.01M19 15h.01"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
  wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm5.4 14.1c-.2.6-1.3 1.2-1.8 1.3-.5 0-1 .2-3.4-.7-2.9-1.1-4.7-4-4.9-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.9 2.2c.1.2.1.4 0 .6l-.4.6-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.4 1.8 2.3 1.3 1.2 2.3 1.5 2.6 1.6.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2.1 1c.3.2.5.3.6.4.1.2.1.8-.1 1.3z"/></svg>'
};

function stars(r) {
  const full = Math.round(r);
  return '<span class="stars">' + '★'.repeat(full) + '<span class="off">' + '★'.repeat(5 - full) + '</span></span>';
}
function soldout(p) { return p.stock <= 0; }
function onSale(p) { return p.mrp > p.price; }

/* ---------------- toast ---------------- */
function toast(msg, ic = '✦') {
  const box = $('#toasts');
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<span class="ic">${ic}</span><span>${esc(msg)}</span>`;
  box.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 450); }, 3400);
}

/* ---------------- SEO ---------------- */
function setSEO(t, d) {
  document.title = t;
  const m = $('meta[name="description"]');
  if (d && m) m.setAttribute('content', d);
}

/* ============================================================
   HEADER / MEGA / SEARCH / CART DRAWER
   ============================================================ */

function megaFor(catKey) {
  const cat = CATEGORIES[catKey];
  const isColl = catKey === 'collections';
  const all = isColl ? '#/collections' : '#/shop/' + catKey;
  const half = Math.ceil(cat.subs.length / 2);
  const col = (subs) => subs.map(s =>
    `<li><a href="${isColl ? '#/coll/' + slugify(s) : '#/sub/' + slugify(s) + '/' + catKey}">${esc(s)}</a></li>`).join('');
  const feats = {
    clothing: ['img/dress1.jpg', 'The Festive Edit', 'Co-ords, kurtas & the glow', '#/coll/festive'],
    lehengas: ['img/lehenga1.jpg', 'The Bridal Edit', 'Zardozi, made by hand', '#/shop/lehengas'],
    jewellery: ['img/jewel1.jpg', 'Heirloom Jewellery', 'Kundan, chooda & jhumkas', '#/shop/jewellery'],
    collections: ['img/about.jpg', 'Editorial', 'Eight ways to wear the house', '#/collections']
  }[catKey];
  return `
    <div class="mega-col"><h4>${cat.name} <a href="${all}">View all →</a></h4><ul>${col(cat.subs.slice(0, half))}</ul></div>
    <div class="mega-col" style="padding-left:0"><ul style="margin-top:2px">${col(cat.subs.slice(half))}</ul></div>
    <div class="mega-feat">
      <img src="${feats[0]}" alt="${esc(feats[1])} — Label Surbhee">
      <a href="${feats[3]}"><span class="kf">${feats[1]}</span><h5>${feats[2]}</h5><span>Explore →</span></a>
    </div>`;
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function openCart() { renderCart(); $('#drawer').classList.add('open'); }
function closeCart() { $('#drawer').classList.remove('open'); }

function cartCount() { return state.cart.reduce((a, c) => a + c.qty, 0); }
function updateCounts() {
  const cc = $('#cart-count');
  cc.textContent = cartCount();
  cc.style.display = cartCount() ? 'grid' : 'none';
  const wc = $('#wish-count');
  wc.textContent = state.wishlist.length;
  wc.style.display = state.wishlist.length ? 'grid' : 'none';
}

/* cart math */
function cartLines() {
  return state.cart.map(c => {
    const p = getProd(c.id);
    return p ? { ...c, p, line: p.price * c.qty } : null;
  }).filter(Boolean);
}
function cartSubtotal() { return cartLines().reduce((a, l) => a + l.line, 0); }

function applyPromo(code) {
  code = (code || '').trim().toUpperCase();
  if (!code) return { ok: false, msg: 'Enter a code.' };
  const d = discounts().find(x => x.code === code && x.active !== false);
  if (!d) return { ok: false, msg: '“' + code + '” is not a valid code.' };
  const lines = cartLines();
  const sub = cartSubtotal();
  if (!lines.length) return { ok: false, msg: 'Your bag is empty.' };
  if (d.min && sub < d.min) return { ok: false, msg: d.desc + ' — add ' + INR(d.min - sub) + ' more.' };
  let off = 0, note = d.desc;
  if (d.type === 'flat') off = d.value;
  else if (d.type === 'percent' || d.type === 'festival') off = Math.round(sub * d.value / 100);
  else if (d.type === 'first') {
    if (state.orders.length > 0) return { ok: false, msg: 'WELCOME10 is for first-time orders only.' };
    off = Math.min(500, Math.round(sub * d.value / 100));
    note = '10% off your first order (capped ₹500)';
  }
  else if (d.type === 'buy2') {
    if (lines.length < 2) return { ok: false, msg: 'Add at least 2 items to use BUY2.' };
    const cheapest = Math.min(...lines.map(l => l.p.price));
    off = Math.round(cheapest * d.value / 100);
    note = d.value + '% off the 2nd item';
  }
  else if (d.type === 'freeship') { off = 0; note = 'Free shipping applied'; }
  if (off <= 0 && d.type !== 'freeship') return { ok: false, msg: 'This code does not apply to your bag.' };
  return { ok: true, code, type: d.type, off, note, freeship: d.type === 'freeship' };
}

function shipCost(mode, sub, promo) {
  if (promo && promo.freeship) return 0;
  if (mode === 'express') return BRAND.shipExpress;
  if (sub >= BRAND.freeShipOver) return 0;
  return BRAND.shipStandard;
}

let activePromo = null; // {code,type,off,note,freeship}
let shipMode = 'standard';

function cartTotals() {
  const sub = cartSubtotal();
  const disc = activePromo ? activePromo.off : 0;
  const ship = state.cart.length ? shipCost(shipMode, sub, activePromo) : 0;
  return { sub, disc, ship, total: sub - disc + ship };
}

function renderCart() {
  const body = $('#dr-body');
  const lines = cartLines();
  if (!lines.length) {
    body.innerHTML = `<div class="dr-empty"><span class="orn">❖</span><p class="lead" style="font-size:17px">Your bag is empty.</p>
      <a class="btn btn-sm" href="#/new" data-action="close-drawer">Shop new arrivals</a></div>`;
  } else {
    body.innerHTML = lines.map((l, i) => `
      <div class="ci">
        <img src="${l.p.img}" alt="${esc(l.p.name)}">
        <div>
          <h5>${esc(l.p.name)}</h5>
          <div class="meta">${esc(l.p.sub)}${l.size && l.size !== 'One Size' ? ' · ' + esc(l.size) : ''}${l.color ? ' · ' + esc(l.color) : ''}</div>
          <div class="qty">
            <button data-action="dec" data-i="${i}" aria-label="Decrease">−</button>
            <span>${l.qty}</span>
            <button data-action="inc" data-i="${i}" aria-label="Increase">+</button>
          </div>
        </div>
        <div>
          <div class="pr">${INR(l.p.price * l.qty)}</div>
          <button class="rm" data-action="rm" data-i="${i}">Remove</button>
        </div>
      </div>`).join('');
  }
  const t = cartTotals();
  const free = BRAND.freeShipOver - t.sub;
  $('#dr-foot').innerHTML = `
    <div class="promo">
      <input id="promo-in" placeholder="Have a code? (try WELCOME10)" value="${activePromo ? activePromo.code : ''}">
      <button data-action="promo">Apply</button>
    </div>
    <div class="trow"><span>Subtotal</span><span>${INR(t.sub)}</span></div>
    ${t.disc ? `<div class="trow"><span>Discount (${esc(activePromo.note)})</span><span class="gold">− ${INR(t.disc)}</span></div>` : ''}
    <div class="trow"><span>Shipping</span><span>${t.ship === 0 ? '<span class="gold">Free</span>' : INR(t.ship)}</span></div>
    <div class="trow total"><span>Total</span><span class="gold">${INR(t.total)}</span></div>
    ${t.ship > 0 ? `<p class="ship-note">Add ${INR(Math.max(0, free))} more for free shipping.</p>` : ''}
    ${lines.length ? `<button class="btn btn-solid" style="width:100%;margin-top:16px" data-action="goto-checkout"><span>Checkout · ${INR(t.total)}</span></button>` : ''}
    <p class="ship-note" style="margin-top:12px">Secure checkout · COD available · 7-day returns</p>`;
  updateCounts();
}

/* ============================================================
   VIEW TEMPLATES
   ============================================================ */

function productCard(p, i = 0) {
  const wish = state.wishlist.includes(p.id);
  const out = soldout(p);
  const badges =
    (out ? '<span class="badge b-out">Sold Out</span>' : '') +
    (onSale(p) ? '<span class="badge b-sale" style="top:12px;left:auto;right:56px">Sale</span>' : '') +
    (!out && p.tag === 'new' ? '<span class="badge b-new">New</span>' : '') +
    (!out && p.tag === 'bestseller' ? '<span class="badge b-new" style="top:46px">Bestseller</span>' : '');
  const quick = out ? '' : (p.sizes.length > 1 && p.cat !== 'jewellery'
    ? `<div class="quickadd">${p.sizes.map(s => `<button class="qsize" data-action="qadd" data-id="${p.id}" data-size="${s}">${s}</button>`).join('')}</div>`
    : `<div class="quickadd"><button class="qadd" data-action="qadd" data-id="${p.id}">Add to bag</button></div>`);
  return `
  <a class="pcard rv" style="transition-delay:${(i % 4) * 70}ms" href="#/product/${p.id}">
    <div class="pcard-img">
      <img src="${p.img}" alt="${esc(p.name)} — Label Surbhee" loading="lazy" width="600" height="750">
      ${badges}
      <button class="heart ${wish ? 'on' : ''}" data-action="wish" data-id="${p.id}" aria-label="Save ${esc(p.name)} to wishlist">${I.heart}</button>
      ${quick}
    </div>
    <div class="pcard-info">
      <h3>${esc(p.name)}</h3>
      <div class="cat">${esc(p.sub)}</div>
      <div class="prow"><span class="price">${INR(p.price)}</span>${onSale(p) ? `<s>${INR(p.mrp)}</s><span class="off">${Math.round((1 - p.price / p.mrp) * 100)}% off</span>` : ''}</div>
      <div class="rate">${stars(p.rating)}<span>${p.rating} · ${p.rc} reviews</span></div>
    </div>
  </a>`;
}

function heroHTML() {
  const b = banner();
  return `
  <section class="hero">
    <div class="hero-txt">
      <p class="kicker" style="animation:fadeUp .8s .15s both">${esc(b.kicker)}</p>
      <h1>
        <span class="l"><i>${esc(b.title)}</i></span>
        <span class="l"><i>${esc(b.titleAccent)}</i></span>
      </h1>
      <p class="sub">${esc(b.sub)}</p>
      <div class="ctas">
        <a class="btn btn-solid" href="${b.cta1href}"><span>${esc(b.cta1)}</span></a>
        <a class="btn" href="${b.cta2href}"><span>${esc(b.cta2)}</span></a>
      </div>
    </div>
    <div class="hero-img">
      <img src="${b.img}" alt="${esc(b.title)} — Label Surbhee">
      <div class="hero-seal"><div><b>LS</b>Est. 2026<br>Mumbai</div></div>
    </div>
  </section>
  <div class="marquee" aria-hidden="true"><div class="mq-track">
    New Season <em>❖</em> Bridal <em>❖</em> Festive Edit <em>❖</em> Rozana <em>❖</em> Boho Gypsy <em>❖</em> Party Edit <em>❖</em> Limited Edition <em>❖</em>
    New Season <em>❖</em> Bridal <em>❖</em> Festive Edit <em>❖</em> Rozana <em>❖</em> Boho Gypsy <em>❖</em> Party Edit <em>❖</em> Limited Edition <em>❖</em>
  </div></div>`;
}

function viewHome() {
  const news = products().filter(p => p.tag === 'new').slice(0, 8);
  const sale = products().filter(onSale).slice(0, 4);
  const cols = COLLECTIONS.slice();
  const tiles = [
    ['clothing', 'Clothing', 'Dresses to dupattas'],
    ['lehengas', 'Lehengas', 'Bridal to party'],
    ['jewellery', 'Jewellery', 'Kundan & chooda'],
    ['festive', 'Festive Edit', 'The glow edit']
  ].map(([k, n, d]) => {
    const img = k === 'festive' ? 'img/saree1.jpg' : CATEGORIES[k].img;
    const href = k === 'festive' ? '#/coll/festive' : '#/shop/' + k;
    return `<a class="ctile rv" href="${href}"><img src="${img}" alt="${n} — Label Surbhee" loading="lazy"><div class="in"><div><h3>${n}</h3><p>${d}</p></div><span class="go">↗</span></div></a>`;
  }).join('');
  const colItems = cols.map((c, i) => {
    const cls = i === 0 ? 'tall' : i === 2 ? 'wide' : '';
    return `<a class="citem ${cls} rv" href="#/coll/${c.slug}" style="transition-delay:${(i % 4) * 60}ms">
      <img src="${c.img}" alt="${esc(c.name)} collection" loading="lazy">
      <span class="arr">↗</span>
      <div class="in"><span class="k">Collection</span><h3>${esc(c.name)}</h3><p>${esc(c.blurb)}</p></div></a>`;
  }).join('');
  const ig = INSTAGRAM.map(t => `
    <a class="ig-tile" href="${BRAND.instagram}" target="_blank" rel="noopener" aria-label="Follow Label Surbhee on Instagram">
      <img src="${t.img}" alt="Label Surbhee on Instagram" loading="lazy">
      <span class="ov">♥ <b>${t.likes}</b></span></a>`).join('');

  return `
  ${heroHTML()}

  <section class="sec wrap">
    <div class="sec-head rv"><div><p class="kicker">The House</p><h2 class="h-lg" style="margin-top:12px">Shop by <span class="gold" style="font-family:var(--accent);font-style:italic">mood</span></h2></div>
    <a class="btn btn-sm" href="#/collections"><span>All collections</span></a></div>
    <div class="cattiles">${tiles}</div>
  </section>

  <section class="sec wrap" style="padding-top:2vh">
    <div class="sec-head rv"><div><p class="kicker">Just Landed</p><h2 class="h-lg" style="margin-top:12px">New Arrivals</h2></div>
    <a class="btn btn-sm" href="#/new"><span>View all</span></a></div>
    <div class="pgrid">${news.map((p, i) => productCard(p, i)).join('') || '<p class="muted">New arrivals coming soon.</p>'}</div>
  </section>

  <section class="wrap"><div class="split rv">
    <div class="split-img"><img src="img/about.jpg" alt="The Label Surbhee atelier" loading="lazy"></div>
    <div class="split-txt">
      <p class="kicker">The World of Label Surbhee</p>
      <p class="lead">“We don’t design for trends. We design for the woman who will still be wearing it in ten years — and remember how it felt the first time.”</p>
      <p class="muted" style="font-size:14.5px">A Mumbai atelier working in deep maroon and antique gold — bridal lehengas, festive couture and heirloom jewellery, cut and embroidered by hand.</p>
      <div><a class="btn" href="#/about"><span>Read our story</span></a></div>
    </div>
  </div></section>

  <section class="sec wrap">
    <div class="sec-head rv"><div><p class="kicker">Editorial</p><h2 class="h-lg" style="margin-top:12px">Collections</h2></div></div>
    <div class="collgrid">${colItems}</div>
  </section>

  <div class="saleband rv">
    <p class="kicker center" style="justify-content:center">Festive Sale</p>
    <p class="big">Up to <em>30% off</em> the festive edit</p>
    <a class="code" href="#/sale">Shop the sale — code FESTIVE20</a>
  </div>

  <section class="sec wrap">
    <div class="sec-head rv"><div><p class="kicker">On Sale Now</p><h2 class="h-lg" style="margin-top:12px">The Sale Edit</h2></div>
    <a class="btn btn-sm" href="#/sale"><span>View all</span></a></div>
    <div class="pgrid">${sale.map((p, i) => productCard(p, i)).join('')}</div>
  </section>

  <section class="sec wrap" style="padding-top:2vh">
    <div class="sec-head rv"><div><p class="kicker">Follow the Label</p><h2 class="h-lg" style="margin-top:12px">@labelsurbhee</h2></div>
    <a class="btn btn-sm" href="${BRAND.instagram}" target="_blank" rel="noopener"><span>Follow on Instagram</span></a></div>
    <div class="ig-grid rv">${ig}</div>
  </section>

  <section class="wrap" style="padding-bottom:8vh">
    <div class="trust rv">
      <div>${I.truck}<div><h5>Free Shipping</h5><p>On all orders above ${INR(BRAND.freeShipOver)}</p></div></div>
      <div>${I.swap}<div><h5>7-Day Returns</h5><p>Easy exchange across India</p></div></div>
      <div>${I.shield}<div><h5>Secure Checkout</h5><p>256-bit SSL protected</p></div></div>
      <div>${I.cash}<div><h5>COD Available</h5><p>Cash on delivery across India</p></div></div>
    </div>
  </section>

  <section class="wrap" style="padding-bottom:10vh">
    <div class="news rv">
      <p class="kicker center">The Inner Circle</p>
      <h2>Join the list</h2>
      <p class="lead">Early access to drops, bridal previews and festival sales — plus <span class="gold">10% off</span> your first order.</p>
      <form data-form="news">
        <input type="email" required placeholder="Your email address" aria-label="Email">
        <button type="submit">Subscribe</button>
      </form>
    </div>
  </section>`;
}

/* ---------------- shop / sub / collection ---------------- */

function shopView(opts) {
  let list = products();
  const { cat = 'clothing', sub = null, sale = false, onlyNew = false, title, note } = opts;
  if (cat && CATEGORIES[cat]) list = list.filter(p => p.cat === cat);
  if (sub) {
    const s = slugify(sub);
    const lower = sub.toLowerCase();
    if (lower === 'new arrivals') list = list.filter(p => p.tag === 'new');
    else if (lower === 'festive wear') list = list.filter(p => p.tag === 'new' || p.coll.includes('festive') || p.coll.includes('party'));
    else list = list.filter(p => slugify(p.sub) === s);
  }
  if (sale) list = list.filter(onSale);
  if (onlyNew) list = list.filter(p => p.tag === 'new');
  const cats = Object.keys(CATEGORIES);
  const catTabs = `<div class="subs">` + cats.map(c =>
    `<a class="sub ${c === cat && !sale && !onlyNew ? 'on' : ''}" href="#/shop/${c}">${CATEGORIES[c].name}</a>`).join('') +
    `<a class="sub ${onlyNew ? 'on' : ''}" href="#/new">New</a><a class="sub ${sale ? 'on' : ''}" href="#/sale">Sale</a></div>`;
  const subTabs = cat && CATEGORIES[cat] && !sale && !onlyNew
    ? CATEGORIES[cat].subs.map(s =>
      `<a class="sub ${sub && slugify(s) === slugify(sub) ? 'on' : ''}" href="#/sub/${slugify(s)}/${cat}">${esc(s)}</a>`).join('') : '';
  return `
  <div class="wrap">
    <div class="page-hero" style="padding-bottom:4vh">
      <p class="kicker center">${esc(CATEGORIES[cat] ? CATEGORIES[cat].name : 'Shop')}</p>
      <h1>${esc(title || (sub || (CATEGORIES[cat] ? CATEGORIES[cat].name : 'Shop')))}</h1>
      ${note ? `<p class="lead">${esc(note)}</p>` : ''}
    </div>
    <p class="crumbs"><a href="#">Home</a><span>/</span><a href="#/shop/${cat}">${esc(CATEGORIES[cat] ? CATEGORIES[cat].name : 'Shop')}</a>${sub ? `<span>/</span>${esc(sub)}` : ''}</p>
    <div class="toolbar">
      ${catTabs}
      <div class="right">
        <span class="count">${list.length} piece${list.length === 1 ? '' : 's'}</span>
        <select id="sort" data-sort>
          <option value="feat">Sort · Featured</option>
          <option value="new">Newest</option>
          <option value="lo">Price · Low to High</option>
          <option value="hi">Price · High to Low</option>
          <option value="rate">Top Rated</option>
        </select>
      </div>
    </div>
    ${subTabs ? `<div class="subs" style="margin-top:14px">${subTabs}</div>` : ''}
    <div style="padding:36px 0 6vh">
      <div class="pgrid wide" id="shop-grid">${list.length ? list.map((p, i) => productCard(p, i)).join('') :
        `<div class="empty" style="grid-column:1/-1"><span class="orn">✦</span><p>This edit is still being pressed.</p><a class="btn btn-sm" href="#/shop/${cat}"><span>Back to ${esc(CATEGORIES[cat] ? CATEGORIES[cat].name : 'shop')}</span></a></div>`}
      </div>
    </div>
  </div>`;
}

function collView(slug) {
  const c = COLLECTIONS.find(x => x.slug === slug);
  if (!c) return notFound();
  const list = products().filter(p => p.coll.includes(slug));
  return `
  <div class="wrap">
    <div class="page-hero" style="padding-bottom:4vh">
      <p class="kicker center">Collection</p>
      <h1>${esc(c.name)}</h1>
      <p class="lead">${esc(c.blurb)}</p>
    </div>
    <p class="crumbs"><a href="#">Home</a><span>/</span><a href="#/collections">Collections</a><span>/</span>${esc(c.name)}</p>
    <div style="padding:36px 0 6vh">
      <div class="pgrid wide">${list.length ? list.map((p, i) => productCard(p, i)).join('') :
        `<div class="empty" style="grid-column:1/-1"><span class="orn">✦</span><p>Pieces from this edit are on their way.</p><a class="btn btn-sm" href="#/collections"><span>All collections</span></a></div>`}</div>
    </div>
  </div>`;
}

function collectionsIndex() {
  const items = COLLECTIONS.map((c, i) => `
    <a class="citem ${i === 0 ? 'tall' : ''} ${i === 3 ? 'wide' : ''} rv" href="#/coll/${c.slug}" style="transition-delay:${(i % 4) * 60}ms">
      <img src="${c.img}" alt="${esc(c.name)}" loading="lazy"><span class="arr">↗</span>
      <div class="in"><span class="k">Collection</span><h3>${esc(c.name)}</h3><p>${esc(c.blurb)}</p></div></a>`).join('');
  return `
  <div class="wrap">
    <div class="page-hero">
      <p class="kicker center">Editorial</p>
      <h1>Collections</h1>
      <p class="lead">Eight ways to wear the house.</p>
    </div>
    <div style="padding:5vh 0 8vh"><div class="collgrid">${items}</div></div>
  </div>`;
}

/* ---------------- product ---------------- */

function reviewsFor(p) {
  const base = REVIEW_POOL.slice();
  const h = p.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const picked = [base[h % 8], base[(h + 3) % 8], base[(h + 5) % 8]];
  const user = (state.userReviews[p.id] || []).slice().reverse();
  return user.concat(picked.slice(0, 3));
}

function productView(id) {
  const p = getProd(id);
  if (!p) return notFound();
  const out = soldout(p);
  const wish = state.wishlist.includes(p.id);
  const revs = reviewsFor(p);
  const rel = products().filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4);
  const waMsg = `Hi Label Surbhee! I'm looking at the ${p.name} (${INR(p.price)}). ${p.cat === 'lehengas' ? 'I would love help with size and bridal customisation.' : 'Could you help me with sizing?'}`;
  return `
  <div class="wrap">
    <p class="crumbs"><a href="#">Home</a><span>/</span><a href="#/shop/${p.cat}">${esc(CATEGORIES[p.cat].name)}</a><span>/</span>${esc(p.name)}</p>
    <div class="prod">
      <div class="prod-gallery rv in">
        <div class="main"><img id="gal-main" src="${p.imgs[0]}" alt="${esc(p.name)} — Label Surbhee"></div>
        <div class="prod-thumbs">
          ${p.imgs.map((im, i) => `<button class="${i === 0 ? 'on' : ''}" data-action="thumb" data-src="${im}" data-i="${i}"><img src="${im}" alt="${esc(p.name)} view ${i + 1}" loading="lazy"></button>`).join('')}
        </div>
      </div>
      <div class="prod-info">
        <p class="kicker">${esc(p.sub)}</p>
        <h1>${esc(p.name)}</h1>
        <div class="rate">${stars(p.rating)}<span>${p.rating} · ${p.rc + (state.userReviews[id] ? state.userReviews[id].length : 0)} reviews</span></div>
        <div class="prod-price">
          <span class="now">${INR(p.price)}</span>
          ${onSale(p) ? `<s>${INR(p.mrp)}</s><span class="off">${Math.round((1 - p.price / p.mrp) * 100)}% off</span>` : ''}
          <span class="muted" style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;margin-left:auto">Inclusive of taxes</span>
        </div>

        <div class="opt-label"><span>Size</span><a data-action="sizeguide">Size guide</a></div>
        <div class="sizes">
          ${p.sizes.map(s => `<button class="szb" data-action="size" data-size="${esc(s)}">${esc(s)}</button>`).join('')}
        </div>
        <div class="opt-label"><span>Colour</span><span class="muted" id="color-name" style="letter-spacing:.06em;text-transform:none;font-size:12px">${esc(p.colors[0].n)}</span></div>
        <div class="swatches">
          ${p.colors.map((c, i) => `<button class="sw ${i === 0 ? 'on' : ''}" data-action="color" data-i="${i}" style="background:${c.h}" aria-label="${esc(c.n)}" title="${esc(c.n)}"></button>`).join('')}
        </div>

        <div class="buyrow">
          <div class="qty"><button data-action="pdec">−</button><span id="pqty">1</span><button data-action="pinc">+</button></div>
          <button class="btn btn-solid" data-action="add" ${out ? 'disabled' : ''}><span>${out ? 'Sold Out' : 'Add to bag'}</span></button>
        </div>
        <div class="wishline">
          <button data-action="wish" data-id="${p.id}">${I.heart} ${wish ? 'Saved to wishlist' : 'Save to wishlist'}</button>
          <span style="opacity:.4">·</span>
          <a href="${wa(waMsg)}" target="_blank" rel="noopener" style="display:inline-flex;gap:8px;align-items:center">${I.wa} Need help? Chat with us</a>
        </div>

        <div class="deliv">
          <div class="row">
            <input id="pin" maxlength="6" inputmode="numeric" placeholder="Enter your PIN code" aria-label="PIN code">
            <button data-action="pin">Check delivery</button>
          </div>
          <div class="res" id="pin-res"></div>
        </div>

        <div class="acc open"><button data-action="acc"><span>Fabric &amp; care</span><span class="pm">+</span></button>
          <div class="body"><div class="body-in"><b>${esc(p.fabric)}.</b> ${p.cat === 'jewellery' ? 'Keep away from perfume and water; store in the pouch provided. Gently wipe with a soft dry cloth.' : 'Dry clean only. Store hung with a padded hanger; do not iron directly on embroidery.'}</div></div></div>
        <div class="acc"><button data-action="acc"><span>Shipping</span><span class="pm">+</span></button>
          <div class="body"><div class="body-in">Free shipping across India on orders above ${INR(BRAND.freeShipOver)}. Metro delivery in 2–4 days, rest of India in 3–7 days. Tracked by email and WhatsApp at every step. <a href="#/shipping" style="color:var(--gold)">Full shipping policy →</a></div></div></div>
        <div class="acc"><button data-action="acc"><span>Returns &amp; exchange</span><span class="pm">+</span></button>
          <div class="body"><div class="body-in">${BRAND.returnDays}-day returns and free exchange on unworn items with tags. ${p.cat === 'jewellery' ? 'Jewellery is non-returnable unless damaged in transit.' : p.cat === 'lehengas' ? 'Lehengas may be exchanged within 7 days, unwashed, with tags.' : ''} <a href="#/returns" style="color:var(--gold)">Full policy →</a></div></div></div>
      </div>
    </div>

    <div class="rev">
      <div class="sec-head rv in">
        <div><p class="kicker">Reviews</p><h2 class="h-md" style="margin-top:10px">What they’re saying</h2></div>
        <div class="rev-sum"><span class="n">${p.rating}</span><div>${stars(p.rating)}<p class="muted" style="font-size:12px;margin-top:6px">${p.rc} verified reviews</p></div></div>
      </div>
      <div class="rev-list">
        ${revs.slice(0, 4).map(r => `
          <div class="rev-card rv in">
            <div class="top"><div class="who"><b style="font-weight:400">${esc(r.n)}</b><small>${esc(r.c)} · ${esc(r.d)}</small></div>${r.v ? '<span class="verif">✓ Verified</span>' : ''}</div>
            ${stars(r.r)}
            <p style="margin-top:10px">“${esc(r.t)}”</p>
          </div>`).join('')}
      </div>
      <form class="rev-form" data-form="review" data-id="${p.id}">
        <h4>Write a review</h4>
        <div class="starpick" id="starpick" aria-label="Rating">
          ${[1, 2, 3, 4, 5].map(n => `<button type="button" data-star="${n}">★</button>`).join('')}
        </div>
        <div class="frow">
          <div class="field"><label>Name</label><input required name="rn" maxlength="40"></div>
          <div class="field"><label>City</label><input required name="rc" maxlength="30"></div>
        </div>
        <div class="field" style="margin-bottom:16px"><label>Your review</label><textarea name="rt" rows="3" required></textarea></div>
        <button class="btn btn-sm btn-solid" type="submit"><span>Submit review</span></button>
      </form>
    </div>

    <div class="related">
      <div class="sec-head"><div><p class="kicker">Keep looking</p><h2 class="h-md" style="margin-top:10px">You may also love</h2></div></div>
      <div class="pgrid">${rel.map((x, i) => productCard(x, i)).join('')}</div>
    </div>
  </div>`;
}

/* ---------------- wishlist ---------------- */

function wishlistView() {
  const list = products().filter(p => state.wishlist.includes(p.id));
  return `
  <div class="wrap">
    <div class="page-hero"><p class="kicker center">Saved by you</p><h1>My Wishlist</h1></div>
    <div style="padding:5vh 0 8vh">
      ${list.length ? `<div class="pgrid wide">${list.map((p, i) => productCard(p, i)).join('')}</div>` :
      `<div class="empty"><span class="orn">❖</span><p>Nothing saved yet. Tap the heart on any piece to keep it here.</p><a class="btn" href="#/new"><span>Shop new arrivals</span></a></div>`}
    </div>
  </div>`;
}

/* ---------------- checkout ---------------- */

function checkoutView() {
  const lines = cartLines();
  if (!lines.length) return `<div class="wrap"><div class="empty" style="padding:14vh 0"><span class="orn">✦</span><p>Your bag is empty.</p><a class="btn" href="#/new"><span>Shop now</span></a></div></div>`;
  const t = cartTotals();
  const p = state.profile || {};
  const a = (state.addresses[0] || {});
  return `
  <div class="wrap">
    <p class="crumbs"><a href="#">Home</a><span>/</span>Checkout</p>
    <div class="checkout">
      <div>
        <div class="co-sec">
          <h3><span class="num">1</span>Contact</h3>
          <div class="frow">
            <div class="field"><label>Full name *</label><input name="name" required value="${esc(p.name || '')}" autocomplete="name"></div>
            <div class="field"><label>Phone (WhatsApp) *</label><input name="phone" required inputmode="numeric" maxlength="10" placeholder="10-digit mobile" value="${esc(p.phone || '')}" autocomplete="tel"></div>
          </div>
          <div class="frow one"><div class="field"><label>Email *</label><input name="email" type="email" required value="${esc(p.email || '')}" autocomplete="email"></div></div>
          <p class="muted" style="font-size:12px;margin-top:-4px">Guest checkout — no account needed. We’ll also send updates by WhatsApp.</p>
        </div>
        <div class="co-sec">
          <h3><span class="num">2</span>Delivery address</h3>
          <div class="frow">
            <div class="field"><label>Flat / house no. *</label><input name="flat" required value="${esc(a.flat || '')}"></div>
            <div class="field"><label>Area / street *</label><input name="area" required value="${esc(a.area || '')}"></div>
          </div>
          <div class="frow">
            <div class="field"><label>City *</label><input name="city" required value="${esc(a.city || '')}"></div>
            <div class="field"><label>State *</label><input name="state" required value="${esc(a.state || '')}"></div>
          </div>
          <div class="frow one"><div class="field"><label>PIN code *</label><input name="pin" required inputmode="numeric" maxlength="6" value="${esc(a.pin || '')}"></div></div>
        </div>
        <div class="co-sec">
          <h3><span class="num">3</span>Shipping</h3>
          <div class="ship-opt">
            <label><input type="radio" name="ship" value="standard" checked><span>Standard<span class="p">${t.ship === 0 ? 'Free' : INR(shipCost('standard', t.sub, activePromo))} · 3–5 days</span></span></label>
            <label><input type="radio" name="ship" value="express"><span>Express<span class="p">${INR(BRAND.shipExpress)} · 1–2 days</span></span></label>
            <label style="opacity:.45"><span>International<span class="p">Coming soon</span></span></label>
          </div>
        </div>
        <div class="co-sec">
          <h3><span class="num">4</span>Payment</h3>
          <label class="pay-opt on"><input type="radio" name="pay" value="UPI" checked><span class="t">UPI<small>GPay · PhonePe · Paytm — instant</small></span></label>
          <label class="pay-opt"><input type="radio" name="pay" value="Card"><span class="t">Credit / Debit card<small>Visa · Mastercard · RuPay</small></span></label>
          <label class="pay-opt"><input type="radio" name="pay" value="COD"><span class="t">Cash on delivery<small>Available on orders under ₹25,000</small></span></label>
          <div class="secure">${I.lock} 256-bit SSL secure checkout</div>
        </div>
      </div>
      <div class="co-side">
        <div class="co-items">
          <h4>Your bag</h4>
          ${lines.map(l => `
            <div class="ci">
              <img src="${l.p.img}" alt="${esc(l.p.name)}">
              <div><h5>${esc(l.p.name)}</h5><div class="meta">${esc(l.p.sub)}${l.size && l.size !== 'One Size' ? ' · ' + esc(l.size) : ''} · Qty ${l.qty}</div></div>
              <div class="pr">${INR(l.p.price * l.qty)}</div>
            </div>`).join('')}
          <div style="margin-top:18px">
            <div class="trow"><span>Subtotal</span><span>${INR(t.sub)}</span></div>
            ${t.disc ? `<div class="trow"><span>Discount · ${esc(activePromo.code)}</span><span class="gold">− ${INR(t.disc)}</span></div>` : ''}
            <div class="trow"><span>Shipping</span><span>${t.ship === 0 ? '<span class="gold">Free</span>' : INR(t.ship)}</span></div>
            <div class="trow total"><span>Total</span><span class="gold">${INR(t.total)}</span></div>
          </div>
          <form data-form="place" style="margin-top:20px">
            <button class="btn btn-solid" style="width:100%" type="submit"><span>Place order · ${INR(t.total)}</span></button>
          </form>
          <a class="ship-note" href="${wa('Hi Label Surbhee! I need help with my checkout.')}" target="_blank" rel="noopener" style="display:flex;gap:8px;align-items:center;margin-top:14px">${I.wa} Need help? Chat with us</a>
        </div>
      </div>
    </div>
  </div>`;
}

function successView(oid) {
  const o = state.orders.find(x => x.id === oid) || state.orders[0];
  if (!o) return notFound();
  return `
  <div class="wrap">
    <div class="success">
      <div class="seal"><span>✦</span></div>
      <p class="kicker center" style="justify-content:center">Thank you</p>
      <h1 style="margin-top:14px">Order placed</h1>
      <p class="lead">Your order is confirmed and being wrapped in our atelier.</p>
      <div class="oid">Order ${o.id}</div>
      <p class="muted" style="font-size:14px">Total paid via ${esc(o.payment)} · ${INR(o.total)}<br>A confirmation has been sent to ${esc(o.email)}${o.phone ? ' and WhatsApp ' + esc(o.phone) : ''}.</p>
      <div style="display:flex;gap:14px;justify-content:center;margin-top:34px;flex-wrap:wrap">
        <a class="btn" href="#/track"><span>Track your order</span></a>
        <a class="btn btn-ghost" href="#/new"><span>Continue shopping</span></a>
      </div>
      <div class="notif-tl">
        <p class="kicker" style="margin-bottom:14px">You’ll be notified as your order moves</p>
        ${['Order received', 'Payment successful', 'Order confirmed', 'Packed &amp; quality-checked', 'Shipped', 'Out for delivery', 'Delivered'].map((s, i) => `
          <div class="nt ${i > 1 ? 'pending' : ''}"><span class="st">${i < 2 ? '✓' : '·'}</span><span>${s}</span></div>`).join('')}
      </div>
    </div>
  </div>`;
}

/* ---------------- track ---------------- */

const STAGES = [
  ['received', 'Order received', 'We’ve got your order — thank you.'],
  ['confirmed', 'Payment confirmed', 'Payment verified. Your pieces are being reserved.'],
  ['packed', 'Packed & quality-checked', 'Wrapped, checked, and ready for dispatch.'],
  ['shipped', 'Shipped', 'On the road with our courier partner. Tracking live.'],
  ['out', 'Out for delivery', 'With the delivery partner in your area.'],
  ['delivered', 'Delivered', 'A celebration, we hope. We hope it fits beautifully.']
];

function stageOf(o) {
  if (o.status && ['cancelled', 'refunded'].includes(o.status)) return o.status;
  if (o.status) return o.status;
  const mins = (Date.now() - (o.created || Date.now())) / 60000;
  const idx = mins < 1 ? 0 : mins < 3 ? 1 : mins < 8 ? 2 : mins < 20 ? 3 : mins < 45 ? 4 : 5;
  return STAGES[idx][0];
}

function trackView() {
  return `
  <div class="wrap">
    <div class="page-hero"><p class="kicker center">Where’s my order</p><h1>Track Order</h1></div>
    <div class="track-box">
      <form data-form="track">
        <input name="oid" required placeholder="ORDER NO. e.g. LS-84920" aria-label="Order number">
        <button type="submit">Track</button>
      </form>
      <div id="track-out"></div>
    </div>
  </div>`;
}

function renderTrack(oid) {
  const o = state.orders.find(x => x.id.toLowerCase() === oid.toLowerCase());
  const out = $('#track-out');
  if (!o) { out.innerHTML = '<p class="lead" style="margin-top:26px;font-size:17px">We couldn’t find that order. Double-check the number, or WhatsApp us.</p>'; return; }
  const stage = stageOf(o);
  if (stage === 'cancelled' || stage === 'refunded') {
    out.innerHTML = `<div style="margin-top:26px"><span class="pill red" style="font-size:11px">${stage === 'cancelled' ? 'Cancelled' : 'Refunded'}</span><p class="muted" style="margin-top:12px;font-size:14px">This order was ${stage}. ${stage === 'refunded' ? 'Your refund is on its way to the original payment method (5–7 working days).' : 'If this is a mistake, chat with us on WhatsApp.'}</p></div>`;
    return;
  }
  const idx = STAGES.findIndex(s => s[0] === stage);
  out.innerHTML = `
    <div style="margin-top:30px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
      <div><span class="gold" style="font-family:var(--disp);letter-spacing:.1em">${o.id}</span>
      <p class="muted" style="font-size:12.5px;margin-top:4px">${o.items.length} item${o.items.length > 1 ? 's' : ''} · ${INR(o.total)} · ${esc(o.address.city || '')}</p></div>
      <a class="btn btn-sm" href="${wa('Hi! I would like an update on my order ' + o.id + '.')}">${I.wa} WhatsApp us</a>
    </div>
    <div class="tl">
      ${STAGES.map((s, i) => `
        <div class="step ${i < idx ? 'done' : ''} ${i === idx ? 'cur' : ''}">
          <span class="dot">${i < idx ? '✓' : i + 1}</span>
          <h5>${s[1]}</h5><p>${s[2]}</p>
        </div>`).join('')}
    </div>
    <p class="adm-note">Demo timeline moves quickly — live tracking runs on email &amp; WhatsApp.</p>`;
}

/* ---------------- account ---------------- */

function accountView(tab = 'orders') {
  const p = state.profile;
  const orders = state.orders.slice().reverse();
  const tabs = [
    ['orders', 'My Orders'], ['status', 'Order Status'], ['wishlist', 'Wishlist'],
    ['addresses', 'Saved Addresses'], ['past', 'Previous Purchases']
  ];
  let body = '';
  if (tab === 'orders' || tab === 'past') {
    body = orders.length ? orders.map(o => `
      <div class="ord">
        <div class="oh"><b>${o.id}</b><span class="muted">${new Date(o.created).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          <span>${o.status && (o.status === 'cancelled' || o.status === 'refunded') ? `<span class="pill red">${o.status}</span>` : `<span class="pill ${['delivered', 'out'].includes(stageOf(o)) ? 'green' : ''}">${stageLabel(stageOf(o))}</span>`}</span>
          <span class="gold" style="letter-spacing:.06em">${INR(o.total)}</span></div>
        <div class="ob"><span>${esc(o.items.map(i => i.name + (i.size && i.size !== 'One Size' ? ' (' + i.size + ')' : '') + ' ×' + i.qty).join(' · '))}</span>
          <span>${esc(o.payment)}</span>
          <a href="#/track" style="color:var(--gold);letter-spacing:.14em;font-size:11px;text-transform:uppercase">Track →</a></div>
      </div>`).join('')
      : `<div class="empty"><span class="orn">✦</span><p>${tab === 'past' ? 'No previous purchases yet.' : 'No orders yet — your first look is waiting.'}</p><a class="btn btn-sm" href="#/new"><span>Shop now</span></a></div>`;
  } else if (tab === 'status') {
    const last = orders[0];
    body = last ? `<div class="track-box" style="margin:0"><div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:8px">
      <div><span class="gold" style="font-family:var(--disp);letter-spacing:.1em">${last.id}</span></div>
      <span class="pill">${stageLabel(stageOf(last))}</span></div>
      <div class="tl" style="padding-left:30px">${(() => { const idx = STAGES.findIndex(s => s[0] === stageOf(last));
        return STAGES.map((s, i) => `<div class="step ${i < idx ? 'done' : ''} ${i === idx ? 'cur' : ''}"><span class="dot">${i < idx ? '✓' : i + 1}</span><h5>${s[1]}</h5></div>`).join(''); })()}</div>
      </div>`
      : `<div class="empty"><span class="orn">✦</span><p>No active orders to track.</p></div>`;
  } else if (tab === 'wishlist') {
    const wl = products().filter(x => state.wishlist.includes(x.id));
    body = wl.length ? `<div class="pgrid wide">${wl.map((x, i) => productCard(x, i)).join('')}</div>`
      : `<div class="empty"><span class="orn">❖</span><p>Your wishlist is empty.</p><a class="btn btn-sm" href="#/wishlist"><span>Browse the shop</span></a></div>`;
  } else if (tab === 'addresses') {
    body = state.addresses.length ? state.addresses.map((a, i) => `
      <div class="ord"><div class="oh"><b>Address ${i + 1}</b><button class="a-btn danger" data-action="addr-del" data-i="${i}">Remove</button></div>
      <div class="ob" style="align-items:flex-start"><span>${esc(a.flat)}, ${esc(a.area)}, ${esc(a.city)}, ${esc(a.state)} — ${esc(a.pin)}</span></div></div>`).join('')
      : `<div class="empty"><span class="orn">✦</span><p>No saved addresses. Addresses you checkout with are saved here for next time.</p></div>`;
  }
  return `
  <div class="wrap">
    <div class="page-hero" style="padding-bottom:4vh"><p class="kicker center">My Account</p><h1>${p ? esc(p.name.split(' ')[0]) : 'Guest'}</h1></div>
    <div class="acct">
      <div class="acct-head">
        <div>
          ${p
            ? `<p class="muted" style="font-size:13.5px">${esc(p.email)}${p.phone ? ' · ' + esc(p.phone) : ''}</p>`
            : `<p class="muted" style="font-size:13.5px">You’re shopping as a guest — that’s perfectly fine. Save your details to speed through checkout.</p>
               <form data-form="profile" style="display:flex;gap:0;margin-top:14px;max-width:460px">
                 <input name="name" required placeholder="Name" style="flex:1;background:none;border:1px solid var(--line-gold-soft);border-right:none;padding:11px 14px;font-size:13px;color:var(--ivory)" aria-label="Name">
                 <input name="email" type="email" required placeholder="Email" style="flex:1;background:none;border:1px solid var(--line-gold-soft);border-right:none;padding:11px 14px;font-size:13px;color:var(--ivory)" aria-label="Email">
                 <input name="phone" inputmode="numeric" maxlength="10" placeholder="Phone" style="flex:1;background:none;border:1px solid var(--line-gold-soft);border-right:none;padding:11px 14px;font-size:13px;color:var(--ivory)" aria-label="Phone">
                 <button class="btn btn-sm btn-solid" type="submit" style="border:none"><span>Save</span></button>
               </form>`}
        </div>
      </div>
      <div class="tabs" role="tablist">
        ${tabs.map(([k, l]) => `<button class="tab ${k === tab ? 'on' : ''}" data-action="acct-tab" data-tab="${k}">${l}</button>`).join('')}
      </div>
      ${body}
    </div>
  </div>`;
}
function stageLabel(k) {
  const f = STAGES.find(s => s[0] === k);
  return f ? f[1] : k;
}

/* ---------------- admin ---------------- */

const ADMIN = { pin: '2580', otp: '482913' };

function adminView(tab = 'overview') {
  if (!sessionStorage.getItem('ls_admin')) return adminGate();
  const prods = products();
  const orders = state.orders.slice().reverse();
  const customers = {};
  state.orders.forEach(o => {
    const k = o.email || 'guest';
    customers[k] = customers[k] || { name: o.name, email: o.email, orders: 0, spent: 0 };
    customers[k].orders++; customers[k].spent += o.total;
  });
  const customersArr = Object.values(customers);
  const revenue = state.orders.reduce((a, o) => a + o.total, 0);
  const side = [
    ['overview', 'Overview'], ['products', 'Products'], ['collections', 'Collections'],
    ['discounts', 'Discounts'], ['orders', 'Orders'], ['customers', 'Customers'],
    ['homepage', 'Homepage'], ['arrivals', 'New Arrivals']
  ].map(([k, l]) => `<button class="${k === tab ? 'on' : ''}" data-action="adm-tab" data-tab="${k}">${l}</button>`).join('');
  let panel = '';

  if (tab === 'overview') {
    panel = `
    <div class="stat-grid">
      <div class="stat"><div class="n">${prods.length}</div><div class="l">Products</div></div>
      <div class="stat"><div class="n">${orders.length}</div><div class="l">Orders</div></div>
      <div class="stat"><div class="n">${INR(revenue)}</div><div class="l">Revenue</div></div>
      <div class="stat"><div class="n">${customersArr.length}</div><div class="l">Customers</div></div>
    </div>
    <h3>Latest orders</h3>
    <p class="sub">Live from this session’s checkout.</p>
    ${orders.length ? `<table class="a"><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr>
      ${orders.slice(0, 5).map(o => `<tr><td><b style="font-weight:400;color:var(--gold-l)">${o.id}</b></td><td>${esc(o.name)}</td><td>${INR(o.total)}</td>
      <td><span class="pill ${['delivered', 'out'].includes(stageOf(o)) ? 'green' : ''}">${o.status && (o.status === 'cancelled' || o.status === 'refunded') ? o.status : stageLabel(stageOf(o))}</span></td></tr>`).join('')}</table>`
      : '<p class="muted">No orders yet.</p>'}
    <div class="adm-note">Tip: every change you make here (prices, stock, banners, discounts) updates the storefront instantly and persists in this browser.</div>`;
  }

  if (tab === 'products') {
    const editing = state._editProd || null;
    const e = editing ? (getProd(editing) || {}) : {};
    panel = `
    <h3>${editing ? 'Edit product' : 'Add product'}</h3>
    <p class="sub">Change prices, photographs, stock, sizes and colours — no developer required.</p>
    <form data-form="product" data-id="${editing || ''}">
      <div class="adm-form">
        <div><label>Name *</label><input name="name" required value="${esc(e.name || '')}"></div>
        <div><label>Category</label><select name="cat">
          ${Object.keys(CATEGORIES).map(c => `<option value="${c}" ${e.cat === c ? 'selected' : ''}>${CATEGORIES[c].name}</option>`).join('')}</select></div>
        <div><label>Sub-category</label><select name="sub" id="sub-sel">
          ${CATEGORIES[e.cat || 'clothing'].subs.map(s => `<option ${e.sub === s ? 'selected' : ''}>${esc(s)}</option>`).join('')}</select></div>
        <div><label>Image URL</label><input name="img" value="${esc(e.img || 'img/lehenga1.jpg')}"></div>
        <div><label>Price (₹) *</label><input name="price" type="number" min="0" required value="${e.price ?? ''}"></div>
        <div><label>MRP (₹) — set above price for sale</label><input name="mrp" type="number" min="0" value="${e.mrp ?? ''}"></div>
        <div><label>Stock</label><input name="stock" type="number" min="0" value="${e.stock ?? 10}"></div>
        <div><label>Tag</label><select name="tag">
          <option value="" ${!e.tag ? 'selected' : ''}>None</option>
          <option value="new" ${e.tag === 'new' ? 'selected' : ''}>New arrival</option>
          <option value="bestseller" ${e.tag === 'bestseller' ? 'selected' : ''}>Bestseller</option></select></div>
        <div><label>Sizes (comma separated)</label><input name="sizes" value="${esc((e.sizes || []).join(', ')) || 'One Size'}"></div>
        <div><label>Colours (comma separated)</label><input name="colors" value="${esc((e.colors || []).map(c => c.n).join(', ')) || 'Maroon'}"></div>
        <div class="one"><label>Short description</label><input name="desc" value="${esc(e.desc || '')}"></div>
        <div class="one"><label>Fabric</label><input name="fabric" value="${esc(e.fabric || '')}"></div>
      </div>
      <div style="display:flex;gap:10px;margin-top:20px">
        <button class="a-btn solid" type="submit">${editing ? 'Save changes' : 'Add product'}</button>
        ${editing ? '<button class="a-btn" type="button" data-action="prod-cancel">Cancel</button>' : ''}
      </div>
    </form>
    <h3 style="margin-top:36px">Catalogue</h3>
    <p class="sub">${prods.length} products · sale = MRP above price · stock 0 = sold out</p>
    <table class="a"><tr><th></th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Tag</th><th></th></tr>
      ${prods.map(p => `<tr>
        <td><img src="${p.img}" alt=""></td>
        <td><b style="font-weight:400;color:var(--ivory)">${esc(p.name)}</b><br><small class="muted">${esc(p.sub)}</small></td>
        <td>${CATEGORIES[p.cat].name}</td>
        <td>${INR(p.price)}${onSale(p) ? ` <s class="muted" style="font-size:11px">${INR(p.mrp)}</s>` : ''}</td>
        <td>${p.stock <= 0 ? '<span class="pill red">Sold out</span>' : p.stock}</td>
        <td>${p.tag || '—'}</td>
        <td style="white-space:nowrap"><button class="a-btn" data-action="prod-edit" data-id="${p.id}">Edit</button>
        <button class="a-btn danger" data-action="prod-del" data-id="${p.id}">Delete</button></td>
      </tr>`).join('')}</table>`;
  }

  if (tab === 'collections') {
    panel = `
    <h3>Create collection</h3>
    <p class="sub">Collections are editorial groupings you can filter the shop by.</p>
    <form data-form="collection" style="display:flex;gap:10px;flex-wrap:wrap;max-width:640px">
      <input name="c-name" required placeholder="Name (e.g. Summer Edit)" style="flex:1;min-width:160px;background:var(--m950);border:1px solid var(--line-gold-soft);padding:12px 14px;font-size:13px;color:var(--ivory)">
      <input name="c-img" placeholder="Image URL" value="img/about.jpg" style="flex:1;min-width:160px;background:var(--m950);border:1px solid var(--line-gold-soft);padding:12px 14px;font-size:13px;color:var(--ivory)">
      <button class="a-btn solid" type="submit">Add</button>
    </form>
    <div class="checkrow" style="margin-top:22px">${COLLECTIONS.map(c => `
      <div class="checkrow"><img src="${c.img}" alt=""> ${esc(c.name)} <span class="pr">${products().filter(p => p.coll.includes(c.slug)).length} pieces</span>
      ${(state._userColl || []).includes(c.slug) ? `<button class="a-btn danger" data-action="coll-del" data-slug="${c.slug}">Remove</button>` : ''}</div>`).join('')}</div>`;
  }

  if (tab === 'discounts') {
    panel = `
    <h3>Create discount</h3>
    <p class="sub">Flat, percentage, first-order, buy-more and free-shipping — live at checkout immediately.</p>
    <form data-form="discount" style="display:flex;gap:10px;flex-wrap:wrap;max-width:720px">
      <input name="d-code" required placeholder="CODE (e.g. DIWALI25)" style="flex:1;min-width:140px;background:var(--m950);border:1px solid var(--line-gold-soft);padding:12px 14px;font-size:13px;letter-spacing:.14em;text-transform:uppercase;color:var(--ivory)">
      <select name="d-type" style="background:var(--m950);border:1px solid var(--line-gold-soft);padding:12px 14px;font-size:13px;color:var(--ivory)">
        <option value="flat">₹ Flat off</option><option value="percent">% off</option>
        <option value="first">First order %</option><option value="festival">Festival %</option>
        <option value="buy2">Buy 2 — % off 2nd</option><option value="freeship">Free shipping</option></select>
      <input name="d-value" type="number" min="0" placeholder="Value" style="width:110px;background:var(--m950);border:1px solid var(--line-gold-soft);padding:12px 14px;font-size:13px;color:var(--ivory)">
      <input name="d-min" type="number" min="0" placeholder="Min ₹ (opt.)" style="width:120px;background:var(--m950);border:1px solid var(--line-gold-soft);padding:12px 14px;font-size:13px;color:var(--ivory)">
      <button class="a-btn solid" type="submit">Create</button>
    </form>
    <table class="a" style="margin-top:26px"><tr><th>Code</th><th>Type</th><th>Value</th><th>Min</th><th>Status</th><th></th></tr>
      ${discounts().map(d => `<tr><td style="color:var(--gold-l);letter-spacing:.12em">${esc(d.code)}</td><td>${esc(d.desc || d.type)}</td>
      <td>${d.type === 'freeship' ? '—' : (d.type === 'flat' ? INR(d.value) : d.value + '%')}</td><td>${d.min ? INR(d.min) : '—'}</td>
      <td><span class="pill ${d.active === false ? 'red' : 'green'}">${d.active === false ? 'Off' : 'Active'}</span></td>
      <td style="white-space:nowrap"><button class="a-btn" data-action="disc-toggle" data-code="${esc(d.code)}">${d.active === false ? 'Activate' : 'Pause'}</button>
      ${(d.type !== 'first') ? `<button class="a-btn danger" data-action="disc-del" data-code="${esc(d.code)}">Delete</button>` : ''}</td></tr>`).join('')}</table>`;
  }

  if (tab === 'orders') {
    panel = `
    <h3>Manage orders</h3>
    <p class="sub">Update status, cancel or refund — customers see changes in Track Order.</p>
    ${orders.length ? `<table class="a"><tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th></th></tr>
      ${orders.map(o => `<tr><td><b style="font-weight:400;color:var(--gold-l)">${o.id}</b><br><small class="muted">${new Date(o.created).toLocaleDateString('en-IN')}</small></td>
      <td>${esc(o.name)}<br><small class="muted">${esc(o.email)}</small></td>
      <td>${o.items.reduce((a, i) => a + i.qty, 0)}</td><td>${INR(o.total)}</td>
      <td><select data-action="order-status" data-id="${o.id}" style="background:var(--m950);border:1px solid var(--line-gold-soft);color:var(--ivory);padding:8px 10px;font-size:12px">
        ${['auto', ...STAGES.map(s => s[0]), 'cancelled', 'refunded'].map(s => `<option value="${s}" ${((o.status || 'auto') === s) ? 'selected' : ''}>${s === 'auto' ? 'Auto (live)' : s}</option>`).join('')}</select></td>
      <td><a class="a-btn" href="#/track?o=${o.id}">View</a></td></tr>`).join('')}</table>`
      : '<p class="muted">No orders yet — place one through checkout to see it here.</p>'}`;
  }

  if (tab === 'customers') {
    panel = `
    <h3>Customers</h3>
    <p class="sub">Everyone who has checked out in this browser.</p>
    ${customersArr.length ? `<table class="a"><tr><th>Name</th><th>Email</th><th>Orders</th><th>Spent</th></tr>
      ${customersArr.map(c => `<tr><td>${esc(c.name || '—')}</td><td>${esc(c.email)}</td><td>${c.orders}</td><td class="gold">${INR(c.spent)}</td></tr>`).join('')}</table>`
      : '<p class="muted">No customers yet.</p>'}`;
  }

  if (tab === 'homepage') {
    const b = banner();
    panel = `
    <h3>Update homepage</h3>
    <p class="sub">Change the hero banner — text, buttons and image.</p>
    <form data-form="banner">
      <div class="adm-form">
        <div><label>Kicker</label><input name="b-kicker" value="${esc(b.kicker)}"></div>
        <div><label>Image URL</label><input name="b-img" value="${esc(b.img)}"></div>
        <div><label>Line 1</label><input name="b-title" value="${esc(b.title)}"></div>
        <div><label>Line 2 (gold italic)</label><input name="b-titleAccent" value="${esc(b.titleAccent)}"></div>
        <div class="one"><label>Sub-text</label><input name="b-sub" value="${esc(b.sub)}"></div>
        <div><label>Button 1</label><input name="b-cta1" value="${esc(b.cta1)}"></div>
        <div><label>Button 1 link</label><input name="b-cta1href" value="${esc(b.cta1href)}"></div>
        <div><label>Button 2</label><input name="b-cta2" value="${esc(b.cta2)}"></div>
        <div><label>Button 2 link</label><input name="b-cta2href" value="${esc(b.cta2href)}"></div>
      </div>
      <div style="margin-top:18px"><button class="a-btn solid" type="submit">Publish banner</button>
      <button class="a-btn" type="button" data-action="banner-reset" style="margin-left:8px">Reset to default</button></div>
    </form>`;
  }

  if (tab === 'arrivals') {
    panel = `
    <h3>New Arrivals</h3>
    <p class="sub">Tick the pieces that appear in “New Arrivals” on the homepage and shop.</p>
    ${products().map(p => `
      <label class="checkrow"><input type="checkbox" data-action="newarr" data-id="${p.id}" ${p.tag === 'new' ? 'checked' : ''}>
      <img src="${p.img}" alt=""> ${esc(p.name)} <span class="pr">${INR(p.price)}</span></label>`).join('')}`;
  }

  return `
  <div class="wrap">
    <p class="crumbs"><a href="#">Home</a><span>/</span>Admin Panel</p>
    <div class="adm">
      <div class="adm-layout">
        <div class="adm-side">
          <div class="t">Admin ✦ Panel</div>
          ${side}
          <button data-action="adm-logout" style="color:#e08e82">Sign out</button>
        </div>
        <div class="adm-panel" id="adm-panel">${panel}</div>
      </div>
    </div>
  </div>`;
}

function adminGate() {
  return `
  <div class="wrap">
    <div class="adm-gate">
      <p class="kicker center" style="justify-content:center">Restricted</p>
      <h2 style="margin-top:12px">Admin Panel</h2>
      <p>Enter your PIN to manage products, orders, discounts and the homepage.</p>
      <form data-form="admin">
        <input name="pin" required maxlength="4" inputmode="numeric" placeholder="••••" aria-label="Admin PIN" autocomplete="off">
        <button class="btn btn-solid" type="submit" style="width:100%"><span>Verify PIN</span></button>
      </form>
      <div class="demo">Demo credentials — PIN <b class="gold">2580</b> · OTP <b class="gold">482913</b><br>(Two-factor authentication is enabled on production.)</div>
    </div>
  </div>`;
}
let adminStep = 0;

/* ---------------- text pages ---------------- */

function pageShell(title, kicker, inner, sub = true) {
  return `
  <div class="wrap">
    <div class="page-hero">${sub ? `<p class="kicker center">${kicker}</p>` : ''}<h1>${title}</h1></div>
    <div style="padding:6vh 0 9vh">${inner}</div>
  </div>`;
}

function aboutView() {
  return `
  <div class="wrap">
    <div class="page-hero">
      <p class="kicker center">The House</p>
      <h1>The World of<br>Label Surbhee</h1>
      <p class="lead" style="max-width:52ch;margin:18px auto 0">Maroon is a memory. Gold is a promise. Everything in between is us.</p>
    </div>
    <div class="split rv in" style="margin-bottom:6vh">
      <div class="split-img"><img src="img/about.jpg" alt="Hands embroidering at the Label Surbhee atelier"></div>
      <div class="split-txt">
        <p class="kicker">Our Story</p>
        <p class="lead">It started with one wedding dress that didn’t exist anywhere.</p>
        <p class="muted" style="font-size:14.5px">Surbhee’s mother needed a maroon lehenga for her sister’s wedding — deep, not bridal-red; gold, not flashy. Every shop in Mumbai had “maroon”, but not <em>that</em> maroon. So it was made, by hand, in a Bandra West atelier, and worn with a story that never stopped being told.</p>
        <p class="muted" style="font-size:14.5px">Label Surbhee is that story, scaled. We work in deep maroon, antique gold and ivory — and in the patience of zardozi, where a single border can take three weeks. Every piece is cut for a real body, not a mannequin’s idea of one.</p>
        <div><a class="btn" href="#/shop/lehengas"><span>Shop the house</span></a></div>
      </div>
    </div>
    <div class="prose" style="text-align:center">
      <p class="quote">We don’t design for trends. We design for the woman who will still be wearing it in ten years — and remember how it felt the first time.</p>
    </div>
    <div class="stat-grid" style="max-width:900px;margin:0 auto 6vh">
      <div class="stat" style="text-align:center"><div class="n">2026</div><div class="l">Atelier, Bandra West</div></div>
      <div class="stat" style="text-align:center"><div class="n">100%</div><div class="l">Cut & finished in-house</div></div>
      <div class="stat" style="text-align:center"><div class="n">3 wks</div><div class="l">For one bridal border</div></div>
      <div class="stat" style="text-align:center"><div class="n">2</div><div class="l">Colours. No more.</div></div>
    </div>
    <div class="prose">
      <h2>Philosophy</h2>
      <p><b>Restraint is the luxury.</b> Two signature colours — deep maroon and antique gold — with ivory where light is needed. Nothing else. When a palette doesn’t shout, the craft has to.</p>
      <p><b>Fabric before fashion.</b> Raw silk, gota, chikankari, real zardozi thread. If the fabric can’t be felt, the piece hasn’t earned its price.</p>
      <p><b>Made for the moment, kept for the decade.</b> Bridal pieces are final-sale heirlooms; festive pieces are built to be worn again and again. Nothing here is disposable.</p>
      <h2>What makes us different</h2>
      <ul>
        <li>Every lehenga is embroidered by hand — we publish the weeks it took.</li>
        <li>Bridal customisation in size, colour and embroidery, confirmed within 24 hours on WhatsApp.</li>
        <li>A single signature palette, so everything you own goes together.</li>
        <li>Jewellery finished with skin-safe coatings, tested before listing.</li>
        <li>7-day returns and free exchange — except where beauty makes final sense (customised &amp; bridal).</li>
      </ul>
    </div>
  </div>`;
}

function contactView() {
  return `
  <div class="wrap">
    <div class="page-hero"><p class="kicker center">Say hello</p><h1>Contact</h1></div>
    <div class="contact-grid">
      <div>
        <div class="c-card">${I.wa}<div><h4>WhatsApp</h4><p><a href="${wa('Hi Label Surbhee! ')}" target="_blank" rel="noopener">${BRAND.phone}</a><br>Fastest way to reach us — sizing, bridal, orders.</p></div></div>
        <div class="c-card">${I.bag}<div><h4>Phone</h4><p><a href="tel:${BRAND.phone.replace(/\s/g, '')}">${BRAND.phone}</a><br>${esc(BRAND.hours)}</p></div></div>
        <div class="c-card">${I.shield}<div><h4>Email</h4><p><a href="mailto:${BRAND.email}">${BRAND.email}</a><br>Replies within one working day.</p></div></div>
        <div class="c-card">${I.heart}<div><h4>Instagram</h4><p><a href="${BRAND.instagram}" target="_blank" rel="noopener">@labelsurbhee</a><br>Drops, edits and behind the needle.</p></div></div>
        <div class="c-card">${I.user}<div><h4>Atelier</h4><p>${esc(BRAND.address)}<br>By appointment for bridal.</p></div></div>
      </div>
      <form class="co-sec" data-form="contact" style="margin:0">
        <h3><span class="num">✦</span>Write to us</h3>
        <div class="frow one"><div class="field"><label>Name *</label><input name="c-name" required></div></div>
        <div class="frow"><div class="field"><label>Email *</label><input name="c-email" type="email" required></div>
        <div class="field"><label>Phone (optional)</label><input name="c-phone" inputmode="numeric"></div></div>
        <div class="frow one"><div class="field"><label>How can we help? *</label><textarea name="c-msg" rows="5" required></textarea></div></div>
        <button class="btn btn-solid" type="submit" style="width:100%"><span>Send message</span></button>
        <p class="adm-note">Or skip the form — WhatsApp gets the fastest reply.</p>
      </form>
    </div>
  </div>`;
}

function shippingView() {
  return pageShell('Shipping & Delivery', 'Getting it to you', `
  <div class="prose">
    <p class="lead">India-wide delivery, tracked at every step — and free when your order crosses ${INR(BRAND.freeShipOver)}.</p>
    <h2>Delivery times & charges</h2>
    <table class="ship">
      <tr><th>Zone</th><th>Standard</th><th>Express</th><th>Charge</th></tr>
      <tr><td>Metro (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata)</td><td>2–4 days</td><td>1–2 days</td><td class="gold">Free over ${INR(BRAND.freeShipOver)}, else ${INR(BRAND.shipStandard)}</td></tr>
      <tr><td>Rest of India</td><td>3–5 days</td><td>2–3 days</td><td class="gold">Free over ${INR(BRAND.freeShipOver)}, else ${INR(BRAND.shipStandard)}</td></tr>
      <tr><td>Remote & NE / Hill areas</td><td>5–7 days</td><td>3–4 days</td><td class="gold">Free over ${INR(BRAND.freeShipOver)}, else ${INR(BRAND.shipRemote)}</td></tr>
      <tr><td>International</td><td colspan="3" class="muted">Coming soon — join the list and we’ll email you first.</td></tr>
    </table>
    <div class="callout"><span class="ic">✦</span><p><b>Free shipping</b> on all orders above <b>${INR(BRAND.freeShipOver)}</b> — no code needed. Below that, standard shipping is <b>${INR(BRAND.shipStandard)}</b>.</p></div>
    <h2>Order tracking</h2>
    <p>Use <b>Track Order</b> in the top bar with your order number (e.g. LS-84920). You can also ask for your status any time on WhatsApp — a human replies.</p>
    <h2>Notifications</h2>
    <p>Every milestone is pushed to <b>email and WhatsApp</b>: order received · payment successful · order confirmed · packed · shipped · out for delivery · delivered — plus cancel and refund alerts where relevant.</p>
    <h2>Shipping charges, in short</h2>
    <ul>
      <li>Free standard shipping over ${INR(BRAND.freeShipOver)}.</li>
      <li>Express shipping flat ${INR(BRAND.shipExpress)} (1–2 days in metros).</li>
      <li>Return pickup for eligible returns is free — we collect from your doorstep.</li>
      <li>Exchange shipping is free for the first exchange per order.</li>
      <li>COD available across India on orders under ₹25,000, no extra charge.</li>
    </ul>
    <p class="muted" style="font-size:13px">Rates reviewed periodically; the checkout always shows the exact amount before you pay.</p>
  </div>`);
}

function returnsView() {
  return pageShell('Returns & Exchange', 'No pressure', `
  <div class="prose">
    <p class="lead">${BRAND.returnDays} days, clear rules, free first exchange. Here’s exactly how it works.</p>
    <h2>The basics</h2>
    <ul>
      <li><b>Window:</b> ${BRAND.returnDays} days from delivery for returns and exchanges.</li>
      <li><b>Condition:</b> unworn, unwashed, tags and original packaging intact.</li>
      <li><b>Pickup:</b> free doorstep pickup anywhere in India — we schedule it on WhatsApp.</li>
    </ul>
    <h2>What’s eligible</h2>
    <div class="policy-card"><h4>Clothing & co-ords</h4><p>Eligible for return or exchange within ${BRAND.returnDays} days, unworn with tags. Try before you keep — a mirror doesn’t count as a wedding.</p></div>
    <div class="policy-card"><h4>Lehengas</h4><p>Exchange only within ${BRAND.returnDays} days, unwashed with all tags (lehenga, choli, dupatta). Size exchanges are free. Returns accepted if damaged in transit — photograph the parcel before opening where possible.</p></div>
    <div class="policy-card"><h4>Jewellery</h4><p>Non-returnable for hygiene reasons, <b>except</b> if damaged in transit or wrong item sent — in which case we replace or refund in full within ${BRAND.returnDays} days.</p></div>
    <div class="policy-card"><h4>Bridal & customised</h4><p>Bespoke and customised pieces (custom size, colour or embroidery) are <b>final sale</b> — they’re made for one person, and that person is you. We confirm this before production.</p></div>
    <div class="policy-card"><h4>Sale items</h4><p>Exchange only (for size/colour), within ${BRAND.returnDays} days. No refunds on sale pieces.</p></div>
    <div class="policy-card"><h4>Damaged products</h4><p>Photo/video on WhatsApp within 48 hours of delivery. We replace or refund in full — no pickup needed for small jewellery.</p></div>
    <h2>Exchange process</h2>
    <ul>
      <li>1 · WhatsApp or email us your order number and the size/colour you want.</li>
      <li>2 · We confirm availability and schedule a free pickup.</li>
      <li>3 · Your exchange ships within 48 hours of the return reaching us.</li>
    </ul>
    <h2>Refund process</h2>
    <ul>
      <li>Initiate within the ${BRAND.returnDays}-day window; pickup is free.</li>
      <li>Refunds go to the <b>original payment method</b> within 5–7 working days of the item reaching us (UPI/wallets are faster, cards slower).</li>
      <li>COD orders are refunded to your bank via NEFT/IMPS — we’ll collect details on WhatsApp.</li>
      <li>Shipping charges on the original order are non-refundable except where the fault was ours.</li>
    </ul>
    <div class="callout"><span class="ic">✦</span><p>Policy tailored to Label Surbhee and reviewed for Indian e-commerce practice — if anything here ever conflicts with your situation, <a href="${wa('Hi! I have a question about your return policy.')}" target="_blank" rel="noopener" style="color:var(--gold)">WhatsApp us</a> and we’ll resolve it fairly, fast.</p></div>
  </div>`);
}

function faqView() {
  return pageShell('FAQ', 'Questions, answered', `
  <div class="prose">
    ${FAQ.map(f => `
      <div class="faq-item"><button data-action="faq">${esc(f.q)}<span class="pm">+</span></button>
      <div class="body"><p>${f.a}</p></div></div>`).join('')}
    <div style="text-align:center;margin-top:5vh"><a class="btn" href="${wa('Hi Label Surbhee! I have a question.')}">Still stuck? Chat on WhatsApp</a></div>
  </div>`);
}

function legalView(kind) {
  const maps = {
    privacy: ['Privacy Policy', `
      <p>We collect only what an order needs: name, phone, email, address — and use it to fulfil, deliver and (if you opt in) update you. We never sell your data. Payment details are processed by PCI-DSS compliant gateways; we never see your card or UPI credentials.</p>
      <p>Browsing data: we use analytics (Google Analytics, Meta Pixel) in aggregate to improve the site. Disable tracking in your browser; nothing breaks.</p>
      <p>WhatsApp & email notifications: you can opt out any time by replying STOP or writing to ${BRAND.email}.</p>`],
    terms: ['Terms & Conditions', `
      <p>Prices are in INR, inclusive of taxes, and may change without notice — the price at checkout is the price you pay. Stock is live; if a sold-out item is charged, we refund in full and tell you why.</p>
      <p>Photographs are as accurate as screens allow; natural fabric variation in weave and shade is part of the character, not a defect. Customised and bridal pieces are final sale as described on the Returns page.</p>
      <p>By using this website you agree to these terms and to our Privacy Policy. For disputes, the courts of Mumbai have jurisdiction.</p>`],
    refund: ['Refund Policy', `
      <p>Refunds are issued to the original payment method within 5–7 working days of the return reaching our atelier (UPI and wallets are typically faster). COD orders are refunded via bank transfer after we collect your account details.</p>
      <p>Shipping charges are refunded only when the fault was ours (damaged or wrong item). Sale items are exchange-only, per the Returns & Exchange policy.</p>`]
  };
  const [t, body] = maps[kind] || ['Legal', '<p>—</p>'];
  return pageShell(t, 'The fine print', `<div class="prose"><p class="muted" style="font-size:12.5px;letter-spacing:.14em;text-transform:uppercase">Last updated · September 2026</p>${body}<p class="muted" style="margin-top:3vh;font-size:13px">Questions? <a href="mailto:${BRAND.email}" style="color:var(--gold)">${BRAND.email}</a></p></div>`);
}

function notFound() {
  return `<div class="wrap"><div class="empty" style="padding:16vh 0"><span class="orn">✦</span>
    <p style="font-size:26px;font-family:var(--disp);letter-spacing:.2em;color:var(--ivory)">404</p>
    <p>This page got lost in the drape.</p><a class="btn" href="#/"><span>Back home</span></a></div></div>`;
}

/* ============================================================
   ROUTER
   ============================================================ */

function renderAdminTab(tab) {
  const panel = $('#adm-panel');
  if (panel) {
    const html = adminView(tab).match(/<div class="adm-panel" id="adm-panel">([\s\S]*)<\/div>\s*<\/div>\s*<\/div>\s*$/);
    if (html) { panel.innerHTML = html[1]; bindSort(); }
    else location.hash = '#/admin/' + tab;
  }
}

function route() {
  const raw = (location.hash || '#/').replace(/^#\/?/, '');
  const q = raw.includes('?') ? raw.split('?')[1] : null;
  const parts = raw.split('?')[0].split('/').filter(Boolean);
  const v = $('#view');
  let h;

  const map = {
    '': viewHome,
    'shop': () => shopView({ cat: parts[1] || 'clothing' }),
    'sub': () => shopView({ cat: parts[2] || 'clothing', sub: deSlug(parts[1]), title: deSlug(parts[1]) }),
    'coll': () => collView(parts[1]),
    'collections': collectionsIndex,
    'new': () => shopView({ cat: 'clothing', onlyNew: true, title: 'New Arrivals', note: 'Fresh from the atelier this week.' }),
    'sale': () => shopView({ cat: 'clothing', sale: true, title: 'Sale', note: 'Up to 30% off — use FESTIVE20 for an extra 20%.' }),
    'product': () => productView(parts[1]),
    'wishlist': wishlistView,
    'checkout': checkoutView,
    'success': () => successView(parts[1]),
    'track': trackView,
    'account': () => accountView(parts[1] || 'orders'),
    'admin': () => adminView(parts[1] || 'overview'),
    'about': aboutView,
    'contact': contactView,
    'shipping': shippingView,
    'returns': returnsView,
    'faq': faqView
  };
  const legal = { privacy: 'privacy', terms: 'terms', refund: 'refund' };
  if (legal[parts[0]]) { map[parts[0]] = () => legalView(parts[0]); }

  h = (map[parts[0]] || notFound)();
  v.innerHTML = h;
  window.scrollTo(0, 0);
  closeCart(); $('#mmenu').classList.remove('open'); $('#search-ov').classList.remove('open');
  if (parts[0] === 'track' && q && q.indexOf('o=') >= 0) renderTrack(decodeURIComponent(q.split('o=')[1]));

  /* SEO per route */
  const seoMap = {
    '': [SEO.home.t, SEO.home.d],
    'about': [SEO.about.t, SEO.about.d], 'contact': [SEO.contact.t, SEO.contact.d],
    'shipping': [SEO.shipping.t, SEO.shipping.d], 'returns': [SEO.returns.t, SEO.returns.d],
    'faq': [SEO.faq.t, SEO.faq.d], 'account': [SEO.account.t, SEO.account.d],
    'track': [SEO.track.t, SEO.track.d], 'wishlist': [SEO.wishlist.t, SEO.wishlist.d],
    'product': (() => { const p = getProd(parts[1]); return p ? [SEO.product.t(p.name), SEO.product.d + p.name + ' — ' + p.desc] : [SEO.home.t, SEO.home.d]; })()
  };
  if (seoMap[parts[0]]) setSEO(seoMap[parts[0]][0], seoMap[parts[0]][1]);
  else if (['shop', 'sub', 'new', 'sale'].includes(parts[0])) {
    const t = parts[0] === 'sub' ? deSlug(parts[1]) : parts[0] === 'sale' ? 'Sale' : parts[0] === 'new' ? 'New Arrivals' : (CATEGORIES[parts[1]] ? CATEGORIES[parts[1]].name : 'Shop');
    setSEO(SEO.shop.t(t), SEO.shop.d);
  }

  bindSort();
  observeReveals();
  updateCounts();
}

function deSlug(s) {
  return (s || '').split('-').map(w => w ? w[0].toUpperCase() + w.slice(1) : w).join(' ');
}

function bindSort() {
  const sel = $('#sort');
  if (!sel) return;
  const grid = $('#shop-grid');
  if (!grid) return;
  sel.addEventListener('change', () => {
    const cards = $$('.pcard', grid);
    const val = sel.value;
    if (val === 'feat') { cards.sort((a, b) => a.dataset.orig - b.dataset.orig); }
    else if (val === 'lo') { cards.sort((a, b) => priceOf(a) - priceOf(b)); }
    else if (val === 'hi') { cards.sort((a, b) => priceOf(b) - priceOf(a)); }
    else if (val === 'rate') { cards.sort((a, b) => rateOf(b) - rateOf(a)); }
    else if (val === 'new') { cards.sort((a, b) => b.querySelector('.b-new') - a.querySelector('.b-new')); }
    cards.forEach((c, i) => { c.style.order = i; grid.appendChild(c); });
  });
  $$('.pcard', grid).forEach((c, i) => { if (c.dataset.orig === undefined) c.dataset.orig = i; });
  function priceOf(c) { return parseInt((((c.querySelector('.prow .price') || {}).textContent) || '0').replace(/[^0-9]/g, ''), 10); }
  function rateOf(c) { return parseFloat(((c.querySelector('.rate span') || {}).textContent) || '0') || 0; }
}

function observeReveals() {
  const els = $$('.rv:not(.in)');
  if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  els.forEach(e => io.observe(e));
}

/* ============================================================
   EVENTS (delegated)
   ============================================================ */

document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const a = el.dataset.action;
  const id = el.dataset.id;

  if (a === 'wish') {
    e.preventDefault(); e.stopPropagation();
    const i = state.wishlist.indexOf(id);
    if (i >= 0) { state.wishlist.splice(i, 1); toast('Removed from wishlist', '♡'); }
    else { state.wishlist.push(id); toast('Saved to wishlist', '♥'); }
    save(); updateCounts();
    if (location.hash.startsWith('#/product/')) { el.classList.toggle('on'); el.innerHTML = I.heart + ' ' + (state.wishlist.includes(id) ? 'Saved to wishlist' : 'Save to wishlist'); }
    else if (location.hash === '#/wishlist' || location.hash.startsWith('#/account')) route();
    else $$('.heart[data-id="' + id + '"]').forEach(h => h.classList.toggle('on'));
    return;
  }

  if (a === 'qadd') {
    e.preventDefault(); e.stopPropagation();
    const p = getProd(id);
    if (soldout(p)) return toast('This piece is sold out.', '✦');
    const size = el.dataset.size || (p.sizes.length === 1 ? p.sizes[0] : null);
    if (p.sizes.length > 1 && !size) return toast('Pick a size — or open the product page.', '✦');
    addToCart(p.id, size, p.colors[0].n, 1);
    return;
  }

  if (a === 'inc' || a === 'dec' || a === 'rm') {
    const i = +el.dataset.i;
    if (a === 'inc') state.cart[i].qty++;
    if (a === 'dec') { state.cart[i].qty--; if (state.cart[i].qty <= 0) state.cart.splice(i, 1); }
    if (a === 'rm') state.cart.splice(i, 1);
    save(); renderCart(); return;
  }

  if (a === 'cart') { openCart(); return; }
  if (a === 'search') { openSearch(); return; }
  if (a === 'promo') {
    const code = $('#promo-in').value;
    const r = applyPromo(code);
    if (r.ok) { activePromo = r; toast('Code applied — ' + r.note, '✦'); renderCart(); }
    else toast(r.msg, '⚠');
    return;
  }

  if (a === 'close-drawer') { closeCart(); return; }
  if (a === 'goto-checkout') { closeCart(); activePromo = activePromo; location.hash = '#/checkout'; return; }

  if (a === 'sizeguide') { e.preventDefault(); openSizeGuide(); return; }
  if (a === 'size') { $$('.szb').forEach(b => b.classList.remove('on')); el.classList.add('on'); return; }
  if (a === 'color') {
    $$('.sw').forEach(b => b.classList.remove('on')); el.classList.add('on');
    const p = getProd(location.hash.split('/')[2]);
    if (p && p.colors[+el.dataset.i]) $('#color-name').textContent = p.colors[+el.dataset.i].n;
    return;
  }
  if (a === 'pinc' || a === 'pdec') {
    const q = $('#pqty'); let n = +q.textContent + (a === 'pinc' ? 1 : -1);
    q.textContent = Math.max(1, n); return;
  }
  if (a === 'add') {
    const id2 = location.hash.split('/')[2];
    const p = getProd(id2);
    const sz = $('.szb.on');
    if (p.sizes.length > 1 && !sz) return toast('Please choose a size.', '✦');
    const col = $('.sw.on');
    addToCart(p.id, sz ? sz.textContent.trim() : (p.sizes[0] === 'One Size' ? 'One Size' : null), col ? $('#color-name').textContent : p.colors[0].n, +$('#pqty').textContent);
    return;
  }
  if (a === 'thumb') {
    $$('.prod-thumbs button').forEach(b => b.classList.remove('on')); el.classList.add('on');
    $('#gal-main').src = el.dataset.src; return;
  }
  if (a === 'pin') {
    const pin = $('#pin').value.trim();
    const res = $('#pin-res');
    if (!/^[1-9][0-9]{5}$/.test(pin)) return res.innerHTML = 'Enter a valid 6-digit PIN.';
    const days = { '1': [2, 3], '2': [2, 4], '3': [3, 5], '4': [2, 4], '5': [3, 4], '6': [2, 3], '7': [2, 3], '8': [5, 7], '9': [4, 6] }[pin[0]] || [3, 5];
    const fmt = d => new Date(Date.now() + d * 86400000).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    res.innerHTML = `Arriving <span class="gold">${fmt(days[0])} – ${fmt(days[1])}</span>${pin[0] === '8' || pin[0] === '9' ? ' (remote area)' : ''} · free over ${INR(BRAND.freeShipOver)}`;
    return;
  }
  if (a === 'acc') { const item = el.closest('.acc'); item.classList.toggle('open');
    const b = item.querySelector('.body'); if (item.classList.contains('open')) b.style.maxHeight = b.scrollHeight + 'px'; else b.style.maxHeight = '0'; return; }
  if (a === 'faq') { el.closest('.faq-item').classList.toggle('open'); return; }

  if (a === 'acct-tab') { location.hash = '#/account/' + el.dataset.tab; return; }
  if (a === 'addr-del') { state.addresses.splice(+el.dataset.i, 1); save(); route(); toast('Address removed', '✦'); return; }

  /* admin */
  if (a === 'adm-tab') { location.hash = '#/admin/' + el.dataset.tab; return; }
  if (a === 'adm-logout') { sessionStorage.removeItem('ls_admin'); adminStep = 0; location.hash = '#/admin'; return; }
  if (a === 'prod-edit') { state._editProd = id; if (location.hash !== '#/admin/products') location.hash = '#/admin/products'; else route(); return; }
  if (a === 'prod-cancel') { state._editProd = null; if (location.hash !== '#/admin/products') location.hash = '#/admin/products'; else route(); return; }
  if (a === 'prod-del') {
    if (!confirm('Delete this product from the catalogue?')) return;
    state.prodEdits = products().map(p => ({ ...p })).filter(p => p.id !== id);
    state.wishlist = state.wishlist.filter(w => w !== id);
    save();
    if (location.hash !== '#/admin/products') location.hash = '#/admin/products'; else route();
    toast('Product deleted', '✦'); return;
  }
  if (a === 'disc-toggle') {
    const ds = discounts().map(d => ({ ...d })); const d = ds.find(x => x.code === el.dataset.code);
    if (d) { d.active = d.active === false; state.discounts = ds; save();
      if (location.hash !== '#/admin/discounts') location.hash = '#/admin/discounts'; else route();
      toast(d.active ? 'Discount paused' : 'Discount activated', '✦'); }
    return;
  }
  if (a === 'disc-del') {
    if (!confirm('Delete this discount code?')) return;
    state.discounts = discounts().filter(x => x.code !== el.dataset.code); save();
    if (location.hash !== '#/admin/discounts') location.hash = '#/admin/discounts'; else route();
    toast('Code deleted', '✦'); return;
  }
  if (a === 'coll-del') {
    state._userColl = (state._userColl || []).filter(s => s !== el.dataset.slug); save();
    if (location.hash !== '#/admin/collections') location.hash = '#/admin/collections'; else route();
    return;
  }
  if (a === 'banner-reset') { state.banner = null; save(); if (location.hash !== '#/admin/homepage') location.hash = '#/admin/homepage'; else route(); toast('Banner reset to default', '✦'); return; }
  if (a === 'close-search') { $('#search-ov').classList.remove('open'); return; }
});

document.addEventListener('change', e => {
  const el = e.target;
  if (el.dataset && el.dataset.action === 'order-status') {
    const o = state.orders.find(x => x.id === el.dataset.id);
    o.status = el.value === 'auto' ? null : el.value;
    state.orderStatus[o.id] = o.status;
    save();
    toast(o.status === 'cancelled' ? 'Order cancelled — refund initiated' : o.status === 'refunded' ? 'Refund issued' : 'Order status updated', '✦');
    return;
  }
  /* sub-category select refresh in admin product form */
  if (el.name === 'cat') {
    const sub = $('#sub-sel');
    if (sub) sub.innerHTML = CATEGORIES[el.value].subs.map(s => `<option>${esc(s)}</option>`).join('');
  }
  /* payment option styling */
  if (el.name === 'pay') { $$('.pay-opt').forEach(l => l.classList.toggle('on', l.contains(el))); }
  if (el.name === 'ship') { shipMode = el.value; }
  /* new arrivals toggle (checkbox) */
  if (el.dataset && el.dataset.action === 'newarr') {
    let list = (state.prodEdits || PRODUCTS).map(p => ({ ...p }));
    const p = list.find(x => x.id === el.dataset.id);
    if (p) {
      p.tag = el.checked ? 'new' : '';
      state.prodEdits = list; save();
      toast(el.checked ? 'Added to New Arrivals' : 'Removed from New Arrivals', '✦');
    }
  }
});

document.addEventListener('submit', e => {
  const f = e.target;
  if (!f.dataset || !f.dataset.form) return;
  e.preventDefault();
  const form = f.dataset.form;
  const g = n => f.querySelector('[name="' + n + '"]');

  if (form === 'news') {
    f.reset(); toast('Welcome to the inner circle — your code: WELCOME10', '✦');
    return;
  }
  if (form === 'contact') {
    f.reset(); toast('Message sent — we reply within one working day.', '✉');
    return;
  }
  if (form === 'profile') {
    state.profile = { name: g('name').value.trim(), email: g('email').value.trim(), phone: g('phone').value.trim() };
    save(); route(); toast('Details saved — checkout will be faster now.', '✦');
    return;
  }
  if (form === 'review') {
    const pid = f.dataset.id;
    const star = (f.querySelector('#starpick button.on') || { dataset: { star: 5 } }).dataset.star;
    const userReviews = state.userReviews[pid] || (state.userReviews[pid] = []);
    userReviews.push({ n: g('rn').value.trim(), c: g('rc').value.trim(), r: +star, t: g('rt').value.trim(), v: false, d: 'just now' });
    save(); f.reset(); $$('#starpick button').forEach(b => b.classList.remove('on'));
    toast('Thank you — your review is live.', '★'); route();
    return;
  }
  if (form === 'track') {
    renderTrack(g('oid').value.trim().toUpperCase());
    return;
  }
  if (form === 'admin') {
    const pin = g('pin').value.trim();
    if (pin === ADMIN.pin) {
      f.outerHTML = `
      <form data-form="admin2">
        <p style="font-size:12px;color:var(--ivory-dim);margin-bottom:16px;letter-spacing:.06em">Step 2 of 2 — OTP sent to your registered mobile.<br>Demo OTP: <span class="gold">${ADMIN.otp}</span></p>
        <input name="otp" required maxlength="6" inputmode="numeric" placeholder="••••••" aria-label="OTP" autofocus>
        <button class="btn btn-solid" type="submit" style="width:100%"><span>Verify &amp; enter</span></button>
      </form>`;
      return;
    }
    toast('Incorrect PIN.', '⚠');
    return;
  }
  if (form === 'admin2') {
    if (g('otp').value.trim() === ADMIN.otp) {
      sessionStorage.setItem('ls_admin', '1'); adminStep = 0;
      toast('Welcome back, Surbhee.', '✦');
      if (location.hash !== '#/admin') location.hash = '#/admin'; else route();
    } else toast('Incorrect OTP.', '⚠');
    return;
  }
  if (form === 'product') {
    const edit = f.dataset.id;
    const list = products().map(p => ({ ...p }));
    const data = {
      name: g('name').value.trim(), cat: g('cat').value, sub: g('sub').value,
      img: g('img').value.trim() || 'img/lehenga1.jpg',
      price: +g('price').value, mrp: +g('mrp').value || +g('price').value,
      stock: +g('stock').value || 0, tag: g('tag').value,
      sizes: g('sizes').value.split(',').map(s => s.trim()).filter(Boolean),
      colors: g('colors').value.split(',').map(s => s.trim()).filter(Boolean).map(n => ({ n, h: colorHex(n) })),
      desc: g('desc').value.trim(), fabric: g('fabric').value.trim()
    };
    if (edit) {
      const i = list.findIndex(p => p.id === edit);
      list[i] = Object.assign({}, list[i], data);
    } else {
      const id = 'p-' + Date.now().toString(36);
      list.unshift(Object.assign({ id, rating: 5, rc: 0, coll: [], imgs: [data.img] }, data));
    }
    state.prodEdits = list; state._editProd = null; save();
    toast(edit ? 'Product updated' : 'Product added to catalogue', '✦');
    if (location.hash !== '#/admin/products') location.hash = '#/admin/products'; else route();
    return;
  }
  if (form === 'collection') {
    const name = g('c-name').value.trim();
    if (!name) return;
    const slug = slugify(name);
    if (!COLLECTIONS.find(c => c.slug === slug)) {
      state._userColl = state._userColl || [];
      COLLECTIONS.push({ slug, name, blurb: 'A new edit from the house.', img: g('c-img').value.trim() || 'img/about.jpg' });
      state._userColl.push(slug); save();
      toast('Collection created', '✦');
      if (location.hash !== '#/admin/collections') location.hash = '#/admin/collections'; else route();
    } else toast('A collection with that name exists.', '⚠');
    return;
  }
  if (form === 'discount') {
    const code = g('d-code').value.trim().toUpperCase();
    if (!code) return;
    const type = g('d-type').value;
    const value = +g('d-value').value || 0;
    const min = +g('d-min').value || 0;
    const ds = discounts().map(d => ({ ...d }));
    if (ds.find(d => d.code === code)) return toast('That code already exists.', '⚠');
    const descs = { flat: '₹' + value + ' off', percent: value + '% off', first: 'First order ' + value + '% off', festival: 'Festival ' + value + '% off', buy2: 'Buy 2, ' + value + '% off 2nd', freeship: 'Free shipping' };
    ds.push({ code, type, value, min, active: true, desc: descs[type] });
    state.discounts = ds; save();
    toast('Discount “' + code + '” is live at checkout', '✦');
    if (location.hash !== '#/admin/discounts') location.hash = '#/admin/discounts'; else route();
    return;
  }
  if (form === 'banner') {
    state.banner = {
      kicker: g('b-kicker').value, img: g('b-img').value, title: g('b-title').value,
      titleAccent: g('b-titleAccent').value, sub: g('b-sub').value,
      cta1: g('b-cta1').value, cta1href: g('b-cta1href').value,
      cta2: g('b-cta2').value, cta2href: g('b-cta2href').value
    };
    save(); toast('Homepage banner published', '✦');
    if (location.hash !== '#/admin/homepage') location.hash = '#/admin/homepage'; else route();
    return;
  }
  if (form === 'place') {
    placeOrder(f);
    return;
  }
});

function colorHex(n) {
  const map = { maroon: '#4a1220', gold: '#c9a24b', 'antique gold': '#c9a24b', ivory: '#efe6d4', 'free size': '#c9a24b' };
  return map[n.toLowerCase()] || '#c9a24b';
}

function addToCart(id, size, color, qty) {
  const key = id + '|' + (size || '') + '|' + (color || '');
  const ex = state.cart.find(c => (c.id + '|' + (c.size || '') + '|' + (c.color || '')) === key);
  if (ex) ex.qty += qty;
  else state.cart.push({ id, size, color, qty });
  save(); renderCart(); openCart();
  toast('Added to bag', '✦');
}

function placeOrder(f) {
  const g = n => f.querySelector('[name="' + n + '"]');
  const req = ['name', 'phone', 'email', 'flat', 'area', 'city', 'state', 'pin'];
  let ok = true;
  req.forEach(n => {
    const el = f.querySelector('[name="' + n + '"]');
    const bad = !el.value.trim() || (n === 'phone' && !/^[6-9][0-9]{9}$/.test(el.value.trim())) || (n === 'email' && !/^\S+@\S+\.\S+$/.test(el.value.trim()));
    el.classList.toggle('err', bad);
    if (bad) ok = false;
  });
  if (!ok) return toast('Please check the highlighted fields.', '⚠');

  const mode = (f.querySelector('input[name="ship"]:checked') || {}).value || 'standard';
  const pay = (f.querySelector('input[name="pay"]:checked') || {}).value || 'UPI';
  const t = cartTotals();
  const oid = 'LS-' + String(Math.floor(10000 + Math.random() * 89999));
  const order = {
    id: oid, created: Date.now(), status: null,
    name: g('name').value.trim(), phone: g('phone').value.trim(), email: g('email').value.trim(),
    address: { flat: g('flat').value.trim(), area: g('area').value.trim(), city: g('city').value.trim(), state: g('state').value.trim(), pin: g('pin').value.trim() },
    payment: pay, subtotal: t.sub, discount: t.disc, promo: activePromo ? activePromo.code : null,
    shipping: t.ship, total: t.total, shipMode: mode,
    items: cartLines().map(l => ({ id: l.p.id, name: l.p.name, price: l.p.price, qty: l.qty, size: l.size, color: l.color }))
  };
  state.orders.push(order);
  state.cart = [];
  activePromo = null;
  const p = state.profile || {};
  state.profile = { name: order.name, email: order.email, phone: order.phone };
  if (!state.addresses.some(a => a.pin === order.address.pin)) state.addresses.push(order.address);
  save();
  updateCounts();
  location.hash = '#/success/' + oid;
  ['Order received ✓', 'Payment successful ✓', 'Order confirmed — packing with care', 'We’ll WhatsApp you at every step'].forEach((m, i) =>
    setTimeout(() => toast(m, i < 2 ? '✓' : '✦'), 900 + i * 1100));
}

/* size guide modal */
function openSizeGuide() {
  const m = $('#modal');
  $('#modal-box').innerHTML = `
    <button class="x" data-action="close-modal">✕</button>
    <p class="kicker">Fit, right the first time</p>
    <h3 style="margin-top:12px">Size Guide</h3>
    <p class="sub">Measurements in inches, taken over light clothing.</p>
    <table class="sg"><tr><th>Size</th><th>Bust</th><th>Waist</th><th>Hip</th></tr>
      ${SIZE_GUIDE.map(r => `<tr><td class="gold">${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join('')}</table>
    <p class="muted" style="font-size:13px">Between sizes? Size up for lehengas and draped styles. Unsure? We reply within minutes:</p>
    <div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap">
      <a class="btn btn-sm btn-solid" href="${wa('Hi! I need help choosing my size.')}" target="_blank" rel="noopener"><span>WhatsApp us</span></a>
      <button class="btn btn-sm" data-action="close-modal"><span>Close</span></button>
    </div>`;
  m.classList.add('open');
}

document.addEventListener('click', e => {
  if (e.target.closest('[data-action="close-modal"]')) $('#modal').classList.remove('open');
  if (e.target.id === 'modal') $('#modal').classList.remove('open');
  if (e.target.closest('[data-action="close-drawer-overlay"]')) closeCart();
  if (e.target.id === 'search-ov') { $('#search-ov').classList.remove('open'); }
  /* star pick */
  const sb = e.target.closest('[data-star]');
  if (sb) {
    const n = +sb.dataset.star;
    $$('#starpick button').forEach(b => b.classList.toggle('on', +b.dataset.star <= n));
  }
  /* mobile menu */
  if (e.target.closest('[data-mm]')) {
    const it = e.target.closest('.mm-item');
    if (it && e.target.closest('button')) it.classList.toggle('open');
  }
  if (e.target.closest('[data-action="mm-close"]')) $('#mmenu').classList.remove('open');
  if (e.target.closest('[data-action="mm-open"]')) $('#mmenu').classList.add('open');
});

/* search overlay */
function openSearch() {
  const ov = $('#search-ov');
  ov.classList.add('open');
  setTimeout(() => $('#srch-in').focus(), 60);
}
function doSearch(q) {
  const out = $('#srch-res');
  q = (q || '').trim().toLowerCase();
  if (!q) { out.innerHTML = '<p class="srch-empty">Try “bridal”, “jhumka”, “saree”…</p>'; return; }
  const hits = products().filter(p => (p.name + ' ' + p.sub + ' ' + CATEGORIES[p.cat].name + ' ' + (p.desc || '')).toLowerCase().includes(q)).slice(0, 8);
  out.innerHTML = hits.length
    ? hits.map(p => `<a href="#/product/${p.id}"><img src="${p.img}" alt=""><div><h5>${esc(p.name)}</h5><p>${esc(p.sub)} · ${INR(p.price)}</p></div></a>`).join('')
    : '<p class="srch-empty">Nothing for “' + esc(q) + '” — try WhatsApp and we’ll hunt it down.</p>';
}

/* ============================================================
   INIT
   ============================================================ */
window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', () => {
  $$('.has-mega').forEach(h => { const m = h.querySelector('.mega'); if (m) m.innerHTML = megaFor(h.dataset.cat); });
  $('#srch-in').addEventListener('input', e => doSearch(e.target.value));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeCart(); $('#search-ov').classList.remove('open'); $('#modal').classList.remove('open'); $('#mmenu').classList.remove('open'); }
  });
  $('#mm-subs').innerHTML = ['clothing', 'lehengas', 'jewellery', 'collections'].map(c => `
    <div class="mm-item">
      <button>${CATEGORIES[c].name} <span class="chev">▾</span></button>
      <div class="mm-subs">${CATEGORIES[c].subs.map(s =>
        `<a href="${c === 'collections' ? '#/coll/' + slugify(s) : '#/sub/' + slugify(s) + '/' + c}">${esc(s)}</a>`).join('')}
        <a href="${c === 'collections' ? '#/collections' : '#/shop/' + c}" style="color:var(--gold)">View all →</a></div>
    </div>`).join('');
  route();
  updateCounts();
});
