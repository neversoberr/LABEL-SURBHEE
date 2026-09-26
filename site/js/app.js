/* ============================================================
   LABEL SURBHEE — Storefront Engine
   Bohemian Soul, Indian Heart.
   Swiss Modernism 2.0 + UI UX Pro Max
   ============================================================ */
'use strict';

// Storage Keys
const KEY_STATE = 'label_surbhee_organized_v1';
const KEY_CART  = 'label_surbhee_cart_v1';
const KEY_WISH  = 'label_surbhee_wish_v1';

// Helpers
const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => [...parent.querySelectorAll(sel)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
const inr = n => '₹' + Number(n || 0).toLocaleString('en-IN');

// Initial State Manager
function loadInitialState() {
  try {
    const saved = localStorage.getItem(KEY_STATE);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Failed to load state from localStorage:', e);
  }
  return {
    products: INITIAL_PRODUCTS,
    orders: INITIAL_ORDERS,
    discounts: PROMO_CODES,
    customers: INITIAL_CUSTOMERS,
    collections: COLLECTIONS,
    hero: {
      eyebrow: "NEW COLLECTION • ROZANA",
      headline: "Bohemian Soul, Indian Heart.",
      sub: "Where heritage meets modern femininity — Hand-blocked prints, slow embroidery, and 24k gold-plated jewellery crafted over 120 artisan hours in our Jaipur atelier, curated in Mumbai.",
      image: "img/saira-maxi-1.webp",
      floatingTitle: "Saira Boho Maxi",
      floatingPrice: 4850,
      floatingHours: "120h Craft"
    }
  };
}

let state = loadInitialState();
function saveState() {
  try {
    localStorage.setItem(KEY_STATE, JSON.stringify(state));
  } catch (e) {
    console.error('Save state failed:', e);
  }
}

// Cart & Wishlist persistence
let cart = [];
try { cart = JSON.parse(localStorage.getItem(KEY_CART) || '[]'); } catch(e) { cart = []; }
function saveCart() {
  localStorage.setItem(KEY_CART, JSON.stringify(cart));
  updateBadges();
  renderCartDrawer();
}

let wishlist = [];
try { wishlist = JSON.parse(localStorage.getItem(KEY_WISH) || '[]'); } catch(e) { wishlist = []; }
function saveWishlist() {
  localStorage.setItem(KEY_WISH, JSON.stringify(wishlist));
  updateBadges();
  renderWishlistDrawer();
}

// Runtime Filters
let currentTabFilter = 'all';
let currentSort = 'featured';
let activePromo = null;
let currentSearchQuery = '';

// Toasts
function showToast(msg, icon = '✦') {
  const container = $('#toast-container');
  if (!container) return;
  const t = document.createElement('div');
  t.className = 'toast-msg';
  t.innerHTML = `<span>${icon}</span> ${esc(msg)}`;
  container.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0';
    t.style.transform = 'translateY(10px)';
    t.style.transition = 'all 0.3s ease';
    setTimeout(() => t.remove(), 300);
  }, 3200);
}

// UI Badges Update
function updateBadges() {
  const cartTotalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartBadges = $$('.badge-cart-count');
  cartBadges.forEach(b => {
    b.textContent = cartTotalQty;
    b.style.display = cartTotalQty > 0 ? 'grid' : 'none';
  });

  const wishBadges = $$('.badge-wish-count');
  wishBadges.forEach(b => {
    b.textContent = wishlist.length;
    b.style.display = wishlist.length > 0 ? 'grid' : 'none';
  });
}

// ============================================================
// 08 PRODUCT GRID RENDERING
// ============================================================
function getFilteredProducts() {
  let list = [...state.products];

  // Search filter
  if (currentSearchQuery.trim()) {
    const q = currentSearchQuery.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.sub && p.sub.toLowerCase().includes(q)) ||
      (p.fabric && p.fabric.toLowerCase().includes(q)) ||
      (p.collection && p.collection.toLowerCase().includes(q))
    );
  }

  // Category Tab Filter
  if (currentTabFilter === 'dresses') {
    list = list.filter(p => p.sub === 'Dresses' || p.category === 'clothing');
  } else if (currentTabFilter === 'jewellery') {
    list = list.filter(p => p.category === 'jewellery');
  } else if (currentTabFilter === 'bestsellers') {
    list = list.filter(p => p.isBestseller);
  } else if (currentTabFilter === 'new') {
    list = list.filter(p => p.isNew);
  }

  // Sorting
  if (currentSort === 'low-high') {
    list.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'high-low') {
    list.sort((a, b) => b.price - a.price);
  } else if (currentSort === 'newest') {
    list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  } else if (currentSort === 'bestseller') {
    list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
  }

  return list;
}

function renderProductCard(p) {
  const isWish = wishlist.includes(p.id);
  const discountPct = p.original > p.price ? Math.round(((p.original - p.price) / p.original) * 100) : 0;
  
  // Badge logic (Only show "ONLY X LEFT" if stock <= 2 is actually true!)
  let badgeHtml = '';
  if (p.stock <= 0) {
    badgeHtml = `<span class="prod-badge badge-new" style="background:#555">SOLD OUT</span>`;
  } else if (p.stock <= 2) {
    badgeHtml = `<span class="prod-badge badge-lowstock">ONLY ${p.stock} LEFT</span>`;
  } else if (p.badge) {
    const cls = p.badge === 'BESTSELLER' ? 'badge-bestseller' : 'badge-new';
    badgeHtml = `<span class="prod-badge ${cls}">${esc(p.badge)}</span>`;
  }

  const hoverImgHtml = p.image2 && p.image2 !== p.image
    ? `<img class="img-hover" src="${p.image2}" alt="${esc(p.name)} alternate angle" loading="lazy">`
    : '';

  const colorDots = (p.coloursHex || ['#4A121F']).map(hex => `<span class="color-dot" style="background:${hex}"></span>`).join('');

  return `
    <article class="prod-card" data-id="${p.id}">
      <div class="prod-media">
        ${badgeHtml}
        <button class="btn-wish-card ${isWish ? 'active' : ''}" data-action="toggle-wish" data-id="${p.id}" aria-label="Save to Wishlist">
          <svg viewBox="0 0 24 24" fill="${isWish ? '#E24A4A' : 'none'}"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>
        <img src="${p.image}" alt="${esc(p.name)} 120 Hours Hand-blocked Jaipur Craft" loading="lazy">
        ${hoverImgHtml}
        <button class="btn-quick-add" data-action="quick-add" data-id="${p.id}" ${p.stock <= 0 ? 'disabled' : ''}>
          ${p.stock <= 0 ? 'Sold Out' : '+ Quick Add to Bag'}
        </button>
      </div>
      <div class="prod-info">
        <span class="prod-category">${esc(p.category)} · ${esc(p.sub || 'Couture')}</span>
        <h3 class="prod-title" data-action="open-product" data-id="${p.id}">${esc(p.name)}</h3>
        <p class="prod-artisan-note">
          <span>✧ ${p.hours || 120} Hours Handcraft</span> · <span>${esc(p.fabric || 'Pure Mulmul')}</span>
        </p>
        <div class="prod-price-row">
          <span class="price-current">${inr(p.price)}</span>
          ${p.original > p.price ? `<span class="price-original">${inr(p.original)}</span><span class="price-discount">−${discountPct}%</span>` : ''}
        </div>
        <div class="prod-rating-stars">
          <span class="stars-gold">★★★★★</span>
          <span>${p.rating || 4.8} (${p.reviews || 42}) VERIFIED</span>
        </div>
        <div class="prod-colors-row">${colorDots}</div>
      </div>
    </article>
  `;
}

function renderProductGrid() {
  const grid = $('#products-grid');
  if (!grid) return;
  const prods = getFilteredProducts();
  if (prods.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted); font-size: 16px;">
      <p class="sub-serif" style="font-size: 22px; color: var(--maroon);">No artisanal pieces found matching your filter.</p>
      <button class="btn btn-outline-gold" style="margin-top: 16px;" onclick="resetFilters()">Reset All Filters</button>
    </div>`;
    return;
  }
  grid.innerHTML = prods.map(renderProductCard).join('');
}

// Bestsellers Carousel / Grid
function renderBestsellers() {
  const container = $('#bestsellers-grid');
  if (!container) return;
  const best = state.products.filter(p => p.isBestseller).slice(0, 3);
  container.innerHTML = best.map(renderProductCard).join('');
}

// Reset filters
window.resetFilters = function() {
  currentTabFilter = 'all';
  currentSearchQuery = '';
  $$('.filter-tab').forEach(b => b.classList.toggle('active', b.dataset.filter === 'all'));
  const srch = $('#header-search-input');
  if (srch) srch.value = '';
  renderProductGrid();
};

// ============================================================
// CART SYSTEM & PROGRESS BAR (₹5,000 Free Shipping)
// ============================================================
function addToCart(productId, size = null, colour = null, qty = 1) {
  const p = state.products.find(item => item.id === productId);
  if (!p) return;

  if (p.stock <= 0) {
    showToast(`${p.name} is currently sold out.`, '✕');
    return;
  }

  const chosenSize = size || (p.sizes && p.sizes[0]) || 'One Size';
  const chosenColor = colour || (p.colours && p.colours[0]) || 'Standard';

  const existingIndex = cart.findIndex(item => item.id === p.id && item.size === chosenSize && item.colour === chosenColor);

  if (existingIndex > -1) {
    cart[existingIndex].qty += qty;
  } else {
    cart.push({
      id: p.id,
      name: p.name,
      price: p.price,
      original: p.original,
      image: p.image,
      size: chosenSize,
      colour: chosenColor,
      qty: qty,
      hours: p.hours || 120,
      fabric: p.fabric || 'Pure Cotton Mulmul'
    });
  }

  saveCart();
  showToast(`Added ${p.name} to your Shopping Bag.`, '✓');
  openDrawer('cart-drawer');
}

function updateCartQty(index, delta) {
  if (!cart[index]) return;
  cart[index].qty += delta;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  saveCart();
}

function removeCartItem(index) {
  if (!cart[index]) return;
  const name = cart[index].name;
  cart.splice(index, 1);
  saveCart();
  showToast(`Removed ${name} from bag.`, '•');
}

function applyPromoCode(codeStr) {
  const cleaned = (codeStr || '').trim().toUpperCase();
  const found = state.discounts.find(d => d.code === cleaned);

  if (!found) {
    showToast('Invalid promotional code.', '✕');
    return;
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  if (found.min && subtotal < found.min) {
    showToast(`Code ${found.code} requires a minimum order of ${inr(found.min)}.`, '✕');
    return;
  }

  activePromo = found;
  showToast(`Privilege code ${found.code} applied!`, '✦');
  renderCartDrawer();
}

function renderCartDrawer() {
  const itemsContainer = $('#cart-items-container');
  const countSpan = $('#cart-drawer-count');
  const subtotalSpan = $('#cart-subtotal');
  const shippingSpan = $('#cart-shipping');
  const discountRow = $('#cart-discount-row');
  const discountSpan = $('#cart-discount-val');
  const totalSpan = $('#cart-grand-total');
  const progressFill = $('#cart-progress-fill');
  const progressText = $('#cart-progress-text');

  if (!itemsContainer) return;

  const totalItemsCount = cart.reduce((sum, i) => sum + i.qty, 0);
  if (countSpan) countSpan.textContent = totalItemsCount;

  if (cart.length === 0) {
    itemsContainer.innerHTML = `
      <div style="text-align:center; padding: 60px 20px; color: var(--text-muted);">
        <p style="font-size: 32px; color: var(--gold);">✧</p>
        <p class="sub-serif" style="font-size: 20px; color: var(--maroon); margin: 8px 0;">Your Shopping Bag is empty.</p>
        <p style="font-size: 13px;">Explore our handcrafted Rozana and festive edits.</p>
        <button class="btn btn-outline-gold" style="margin-top: 20px;" onclick="closeAllDrawers(); location.hash='#products-sec'">Explore New Drop</button>
      </div>
    `;
    if (subtotalSpan) subtotalSpan.textContent = inr(0);
    if (shippingSpan) shippingSpan.textContent = inr(0);
    if (totalSpan) totalSpan.textContent = inr(0);
    if (discountRow) discountRow.style.display = 'none';
    if (progressFill) progressFill.style.width = '0%';
    if (progressText) progressText.innerHTML = `Add ₹5,000 to unlock <strong>Complimentary Insured Shipping</strong>`;
    return;
  }

  itemsContainer.innerHTML = cart.map((item, idx) => `
    <div class="cart-item-row">
      <img src="${item.image}" alt="${esc(item.name)}">
      <div class="cart-item-info">
        <h4>${esc(item.name)}</h4>
        <p class="cart-item-meta">Size: ${esc(item.size)} · ${esc(item.colour)}<br>
        <span style="color:var(--gold);">✧ ${item.hours}h Handcraft</span> · Complimentary Alterations</p>
        <div class="cart-item-price">${inr(item.price)}</div>
        <button class="btn-remove-item" onclick="removeCartItem(${idx})">Remove</button>
      </div>
      <div class="qty-stepper">
        <button onclick="updateCartQty(${idx}, -1)" aria-label="Decrease quantity">−</button>
        <span>${item.qty}</span>
        <button onclick="updateCartQty(${idx}, 1)" aria-label="Increase quantity">+</button>
      </div>
    </div>
  `).join('');

  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const freeThreshold = BRAND.freeShipOver || 5000;
  const pct = Math.min(100, Math.round((subtotal / freeThreshold) * 100));

  if (progressFill) progressFill.style.width = `${pct}%`;
  if (progressText) {
    if (subtotal >= freeThreshold) {
      progressText.innerHTML = `<strong>You have unlocked Complimentary Express Shipping!</strong> ✦`;
    } else {
      const needed = freeThreshold - subtotal;
      progressText.innerHTML = `Add <strong>${inr(needed)}</strong> more to unlock <strong>Complimentary Insured Shipping</strong>`;
    }
  }

  // Calculate discounts
  let discountAmount = 0;
  if (activePromo) {
    if (activePromo.type === 'percent') {
      discountAmount = Math.round((subtotal * activePromo.value) / 100);
    } else if (activePromo.type === 'flat') {
      discountAmount = activePromo.value;
    }
  }

  const shipping = (subtotal >= freeThreshold || (activePromo && activePromo.type === 'free_shipping')) ? 0 : BRAND.standardShip;
  const grandTotal = Math.max(0, subtotal - discountAmount + shipping);

  if (subtotalSpan) subtotalSpan.textContent = inr(subtotal);
  if (shippingSpan) shippingSpan.textContent = shipping === 0 ? 'FREE' : inr(shipping);

  if (discountRow) {
    if (discountAmount > 0) {
      discountRow.style.display = 'flex';
      if (discountSpan) discountSpan.textContent = `− ${inr(discountAmount)}`;
    } else {
      discountRow.style.display = 'none';
    }
  }

  if (totalSpan) totalSpan.textContent = inr(grandTotal);
}

// Checkout Trigger (Frictionless Simulated Timeline)
function runCheckout() {
  if (cart.length === 0) {
    showToast('Your bag is empty.', '✕');
    return;
  }

  const subtotal = cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
  const newOrderId = `SB-${Math.floor(1000 + Math.random() * 9000)}`;

  const orderObj = {
    id: newOrderId,
    customer: "Guest Client",
    email: "client@labelsurbhee.com",
    phone: "+91 98765 43210",
    date: new Date().toISOString().split('T')[0],
    amount: subtotal,
    status: "Confirmed",
    payment: "UPI (Express Verified)",
    items: [...cart],
    timeline: [
      { step: "Order Received", done: true, time: "Just now" },
      { step: "Payment Successful", done: true, time: "Verified via UPI" },
      { step: "Confirmed & Inspected", done: true, time: "Jaipur Atelier" },
      { step: "Dispatched via Blue Dart", done: false, time: "Est. Tomorrow" },
      { step: "Out for Delivery", done: false, time: "Pending" },
      { step: "Delivered", done: false, time: "Pending" }
    ]
  };

  state.orders.unshift(orderObj);
  saveState();

  cart = [];
  saveCart();
  closeAllDrawers();

  showToast(`Order #${newOrderId} placed successfully! Check your account timeline.`, '✓');
  openAccountDrawer('orders');
}

// ============================================================
// WISHLIST SYSTEM
// ============================================================
function toggleWishlist(productId) {
  const idx = wishlist.indexOf(productId);
  const p = state.products.find(i => i.id === productId);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    showToast(`Removed from Wishlist.`, '•');
  } else {
    wishlist.push(productId);
    showToast(`Saved ${p ? p.name : 'item'} to your Wishlist.`, '❤');
  }
  saveWishlist();
  renderProductGrid();
}

function renderWishlistDrawer() {
  const container = $('#wishlist-items-container');
  if (!container) return;

  if (wishlist.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 60px 20px; color: var(--text-muted);">
        <p style="font-size: 32px; color: var(--gold);">❤</p>
        <p class="sub-serif" style="font-size: 20px; color: var(--maroon); margin: 8px 0;">Your Wishlist is empty.</p>
        <p style="font-size: 13px;">Save your favorite silhouettes to revisit anytime.</p>
      </div>
    `;
    return;
  }

  const items = state.products.filter(p => wishlist.includes(p.id));
  container.innerHTML = items.map(p => `
    <div class="cart-item-row">
      <img src="${p.image}" alt="${esc(p.name)}">
      <div class="cart-item-info">
        <h4>${esc(p.name)}</h4>
        <p class="cart-item-meta">${esc(p.category)} · ${inr(p.price)}</p>
        <button class="btn btn-outline-gold" style="padding: 6px 12px; font-size: 9px; min-height: 32px;" onclick="addToCart('${p.id}'); toggleWishlist('${p.id}');">Move to Bag →</button>
        <button class="btn-remove-item" onclick="toggleWishlist('${p.id}')">Remove</button>
      </div>
    </div>
  `).join('');
}

// ============================================================
// PRODUCT MODAL (2-Col, Gallery, Tabs, WhatsApp)
// ============================================================
let activeModalProduct = null;
let activeModalSize = null;
let activeModalColor = null;

function openProductModal(productId) {
  const p = state.products.find(item => item.id === productId);
  if (!p) return;
  activeModalProduct = p;
  activeModalSize = (p.sizes && p.sizes[0]) || 'One Size';
  activeModalColor = (p.colours && p.colours[0]) || 'Standard';

  const modal = $('#product-modal');
  if (!modal) return;

  // Main Image
  const mainImg = $('#pmodal-img-main');
  if (mainImg) mainImg.src = p.image;

  // Thumbs
  const thumbsContainer = $('#pmodal-thumbs');
  const allImages = p.images && p.images.length ? p.images : [p.image, p.image2 || p.image];
  if (thumbsContainer) {
    thumbsContainer.innerHTML = allImages.map((src, i) => `
      <div class="pmodal-thumb ${i === 0 ? 'active' : ''}" onclick="changeModalMainImage('${src}', this)">
        <img src="${src}" alt="Thumb ${i+1}">
      </div>
    `).join('');
  }

  // Info
  $('#pmodal-category').textContent = `${p.category.toUpperCase()} · ${p.sub || 'COUTURE'}`;
  $('#pmodal-title').textContent = p.name;
  $('#pmodal-price').textContent = inr(p.price);
  const origEl = $('#pmodal-orig-price');
  if (origEl) {
    if (p.original > p.price) {
      origEl.style.display = 'inline';
      origEl.textContent = inr(p.original);
    } else {
      origEl.style.display = 'none';
    }
  }

  // Stock note
  const stockEl = $('#pmodal-stock-alert');
  if (stockEl) {
    if (p.stock <= 2 && p.stock > 0) {
      stockEl.style.display = 'block';
      stockEl.textContent = `✦ Hurry! Only ${p.stock} piece${p.stock === 1 ? '' : 's'} remaining in Jaipur atelier.`;
    } else {
      stockEl.style.display = 'none';
    }
  }

  // Description
  $('#pmodal-desc').textContent = p.desc;

  // Size pills
  const sizePillsContainer = $('#pmodal-sizes');
  if (sizePillsContainer) {
    sizePillsContainer.innerHTML = (p.sizes || ['One Size']).map((s, idx) => `
      <button class="size-pill-btn ${idx === 0 ? 'active' : ''}" onclick="selectModalSize('${s}', this)">${s}</button>
    `).join('');
  }

  // WhatsApp concierge pre-filled link
  const waBtn = $('#pmodal-wa-link');
  if (waBtn) {
    const msg = `Hi Label Surbhee, I am interested in the ${p.name} (SKU: ${p.sku || p.id}). Could I arrange a consultation?`;
    waBtn.href = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(msg)}`;
  }

  // Tabs content
  $('#pmodal-pane-details').textContent = p.details || 'Hand-blocked print · 120 artisan hours · Complimentary alterations at Vile Parle atelier.';
  $('#pmodal-pane-care').textContent = p.care || 'Dry clean only · Store in muslin garment bag provided.';
  $('#pmodal-pane-shipping').textContent = p.shipping || 'Complimentary shipping across India on orders over ₹5,000 · 7-day unworn returns.';

  modal.classList.add('open');
  $('#modal-backdrop').classList.add('open');
  document.body.classList.add('noscroll');
}

window.changeModalMainImage = function(src, thumbEl) {
  const main = $('#pmodal-img-main');
  if (main) main.src = src;
  $$('.pmodal-thumb').forEach(t => t.classList.remove('active'));
  if (thumbEl) thumbEl.classList.add('active');
};

window.selectModalSize = function(size, btnEl) {
  activeModalSize = size;
  $$('.size-pill-btn').forEach(b => b.classList.remove('active'));
  if (btnEl) btnEl.classList.add('active');
};

window.setModalTab = function(tabName, linkEl) {
  $$('.pmodal-tab-link').forEach(l => l.classList.remove('active'));
  if (linkEl) linkEl.classList.add('active');
  $$('.pmodal-tab-pane').forEach(p => p.style.display = 'none');
  const target = $(`#pmodal-pane-${tabName}`);
  if (target) target.style.display = 'block';
};

window.addActiveModalToCart = function() {
  if (!activeModalProduct) return;
  addToCart(activeModalProduct.id, activeModalSize, activeModalColor, 1);
  closeProductModal();
};

window.buyActiveModalNow = function() {
  if (!activeModalProduct) return;
  addToCart(activeModalProduct.id, activeModalSize, activeModalColor, 1);
  closeProductModal();
  runCheckout();
};

function closeProductModal() {
  const modal = $('#product-modal');
  if (modal) modal.classList.remove('open');
  $('#modal-backdrop').classList.remove('open');
  document.body.classList.remove('noscroll');
}

// ============================================================
// ACCOUNT DRAWER & ORDER TRACKING
// ============================================================
function openAccountDrawer(defaultTab = 'overview') {
  openDrawer('account-drawer');
  switchAccountTab(defaultTab);
}

window.switchAccountTab = function(tabId) {
  $$('.account-tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === tabId));
  const body = $('#account-tab-body');
  if (!body) return;

  if (tabId === 'overview') {
    const latestOrder = state.orders[0];
    body.innerHTML = `
      <h3 style="font-size: 20px; color: var(--maroon); margin-bottom: 6px;">Namaste, Ananya</h3>
      <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 24px;">Atelier VIP Member · Santacruz & Vile Parle Client</p>
      <div style="background:var(--cream); border:1px solid var(--neutral-border); padding:20px; margin-bottom:20px;">
        <h4 style="font-size: 11px; letter-spacing:0.18em; text-transform:uppercase; color:var(--gold); margin-bottom:12px;">Active Consignment Tracking</h4>
        <p style="font-size: 15px; font-weight:600; color:var(--text-heading);">${latestOrder.id} · ${inr(latestOrder.amount)}</p>
        <p style="font-size: 12px; color:var(--text-muted); margin:4px 0 16px;">Status: <strong style="color:var(--maroon);">${latestOrder.status}</strong></p>
        <div style="display:flex; flex-direction:column; gap:10px; border-left: 2px solid var(--gold); padding-left:14px; margin-left:6px;">
          ${latestOrder.timeline.map(t => `
            <div>
              <p style="font-size:12.5px; font-weight:${t.done ? '600' : '400'}; color:${t.done ? 'var(--maroon)' : 'var(--text-muted)'};">${t.step}</p>
              <span style="font-size:10.5px; color:var(--text-muted);">${t.time}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (tabId === 'orders') {
    body.innerHTML = `
      <h3 style="font-size: 20px; color: var(--maroon); margin-bottom: 16px;">My Order History</h3>
      ${state.orders.map(o => `
        <div style="background:var(--cream); border:1px solid var(--neutral-border); padding:16px; margin-bottom:12px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
            <strong style="color:var(--maroon);">${o.id}</strong>
            <span style="font-size:11px; color:var(--gold); font-weight:600; text-transform:uppercase;">${o.status}</span>
          </div>
          <p style="font-size:12.5px; color:var(--text-muted);">${o.date} · ${o.payment}</p>
          <p style="font-size:14px; font-weight:600; margin-top:4px;">${inr(o.amount)} (${o.items.length} item${o.items.length > 1 ? 's' : ''})</p>
        </div>
      `).join('')}
    `;
  } else if (tabId === 'addresses') {
    body.innerHTML = `
      <h3 style="font-size: 20px; color: var(--maroon); margin-bottom: 16px;">Saved Addresses</h3>
      <div style="background:var(--cream); border:1px solid var(--neutral-border); padding:16px; margin-bottom:12px;">
        <span style="font-size:10px; letter-spacing:0.16em; text-transform:uppercase; color:var(--gold);">Primary Residence</span>
        <h4 style="margin:4px 0;">Ananya Deshmukh</h4>
        <p style="font-size:12.5px; color:var(--text-muted);">A-402, Sea Pearl Apartments, Juhu Tara Road, Mumbai 400049</p>
        <p style="font-size:12.5px; color:var(--text-muted); margin-top:2px;">Phone: +91 98201 54321</p>
      </div>
    `;
  } else {
    body.innerHTML = `
      <h3 style="font-size: 20px; color: var(--maroon); margin-bottom: 16px;">${esc(tabId.toUpperCase())}</h3>
      <p style="font-size:13px; color:var(--text-muted);">Manage your personal preferences and bespoke consultation records.</p>
    `;
  }
};

// ============================================================
// ADMIN PANEL (Full-Featured CRUD, Inventory & Orders)
// ============================================================
function openAdminPanel() {
  const modal = $('#admin-modal');
  if (!modal) return;
  modal.classList.add('open');
  $('#modal-backdrop').classList.add('open');
  document.body.classList.add('noscroll');
  renderAdminView('overview');
}

function closeAdminPanel() {
  const modal = $('#admin-modal');
  if (modal) modal.classList.remove('open');
  $('#modal-backdrop').classList.remove('open');
  document.body.classList.remove('noscroll');
}

window.renderAdminView = function(viewName) {
  $$('.admin-nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === viewName));
  const pane = $('#admin-content-pane');
  if (!pane) return;

  if (viewName === 'overview') {
    const totalRev = state.orders.reduce((sum, o) => sum + o.amount, 0);
    const lowStockCount = state.products.filter(p => p.stock <= 2).length;
    pane.innerHTML = `
      <h2 style="font-size:24px; color:var(--maroon); margin-bottom:4px;">Atelier Master Dashboard</h2>
      <p style="font-size:13px; color:var(--text-muted); margin-bottom:24px;">Live operations telemetry for Label Surbhee, Vile Parle West</p>
      
      <div class="kpi-cards-grid">
        <div class="kpi-card">
          <div class="label">Total Gross Revenue</div>
          <div class="value">${inr(totalRev)}</div>
        </div>
        <div class="kpi-card">
          <div class="label">Total Orders</div>
          <div class="value">${state.orders.length}</div>
        </div>
        <div class="kpi-card">
          <div class="label">Catalogue Pieces</div>
          <div class="value">${state.products.length}</div>
        </div>
        <div class="kpi-card">
          <div class="label">Low Stock Alerts</div>
          <div class="value" style="color:#B42318;">${lowStockCount}</div>
        </div>
      </div>

      <h3 style="font-size:16px; margin:24px 0 12px; color:var(--text-heading);">Recent Orders Overview</h3>
      <table class="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${state.orders.slice(0, 5).map(o => `
            <tr>
              <td><strong>${o.id}</strong></td>
              <td>${esc(o.customer)}</td>
              <td>${inr(o.amount)}</td>
              <td>${o.date}</td>
              <td><span class="status-badge-green">${o.status}</span></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } else if (viewName === 'products') {
    pane.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <div>
          <h2 style="font-size:24px; color:var(--maroon);">Product Catalogue Manager</h2>
          <p style="font-size:13px; color:var(--text-muted);">Add new luxury pieces or update prices, stock, and photos in real time.</p>
        </div>
        <button class="btn btn-gold" onclick="renderAdminView('add-product')">+ Add New Product</button>
      </div>

      <table class="admin-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${state.products.map(p => `
            <tr>
              <td><img src="${p.image}" style="width:48px; height:60px; object-fit:cover; border:1px solid #ccc;"></td>
              <td><strong>${esc(p.name)}</strong></td>
              <td><span style="font-size:11px; color:var(--text-muted);">${esc(p.sku || p.id)}</span></td>
              <td>${inr(p.price)}</td>
              <td>
                <span style="font-weight:600; color:${p.stock <= 2 ? '#B42318' : 'inherit'}">${p.stock}</span>
              </td>
              <td>${esc(p.category)}</td>
              <td>
                <button class="btn btn-outline-gold" style="padding:4px 8px; font-size:10px; min-height:28px;" onclick="duplicateProduct('${p.id}')">Copy</button>
                <button class="btn btn-maroon" style="padding:4px 8px; font-size:10px; min-height:28px;" onclick="deleteProduct('${p.id}')">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } else if (viewName === 'add-product') {
    pane.innerHTML = `
      <h2 style="font-size:24px; color:var(--maroon); margin-bottom:16px;">Add New Artisanal Piece</h2>
      <form id="admin-add-product-form" onsubmit="handleAdminAddProduct(event)" style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
        <div style="display:flex; flex-direction:column; gap:6px;">
          <label style="font-size:11px; text-transform:uppercase; font-weight:600;">Product Title *</label>
          <input type="text" name="name" required placeholder="e.g. Maya Zardozi Silk Anarkali" style="padding:10px; border:1px solid #ccc;">
        </div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          <label style="font-size:11px; text-transform:uppercase; font-weight:600;">SKU Code *</label>
          <input type="text" name="sku" required placeholder="LS-ETH-0115" style="padding:10px; border:1px solid #ccc;">
        </div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          <label style="font-size:11px; text-transform:uppercase; font-weight:600;">Selling Price (₹) *</label>
          <input type="number" name="price" required placeholder="5950" style="padding:10px; border:1px solid #ccc;">
        </div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          <label style="font-size:11px; text-transform:uppercase; font-weight:600;">Compare-at MRP (₹)</label>
          <input type="number" name="original" placeholder="7999" style="padding:10px; border:1px solid #ccc;">
        </div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          <label style="font-size:11px; text-transform:uppercase; font-weight:600;">Category *</label>
          <select name="category" style="padding:10px; border:1px solid #ccc;">
            <option value="clothing">Clothing</option>
            <option value="lehengas">Lehengas</option>
            <option value="jewellery">Jewellery</option>
          </select>
        </div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          <label style="font-size:11px; text-transform:uppercase; font-weight:600;">Sub-Category</label>
          <input type="text" name="sub" placeholder="e.g. Dresses, Sarees, Chokers" style="padding:10px; border:1px solid #ccc;">
        </div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          <label style="font-size:11px; text-transform:uppercase; font-weight:600;">Select Main Image</label>
          <select name="image" style="padding:10px; border:1px solid #ccc;">
            <option value="img/saira-maxi-1.webp">Saira Maxi 1 (Editorial)</option>
            <option value="img/saira-maxi-2.webp">Saira Maxi 2 (Back Angle)</option>
            <option value="img/noor-kurta.webp">Noor Kurta (Ethnic)</option>
            <option value="img/jhumka-gold.webp">24k Gold Jhumka (Jewellery)</option>
            <option value="img/boho-beach.webp">Boho Beach Edit (Resort)</option>
            <option value="img/saira-tag.webp">Handcraft Tag (Details)</option>
            <option value="img/lehenga-editorial.jpg">Bridal Lehenga (Royal)</option>
            <option value="img/saree-editorial.jpg">Kanjeevaram Saree</option>
          </select>
        </div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          <label style="font-size:11px; text-transform:uppercase; font-weight:600;">Stock Quantity *</label>
          <input type="number" name="stock" value="5" required style="padding:10px; border:1px solid #ccc;">
        </div>
        <div style="grid-column: 1/-1; display:flex; flex-direction:column; gap:6px;">
          <label style="font-size:11px; text-transform:uppercase; font-weight:600;">Editorial Description</label>
          <textarea name="desc" rows="3" placeholder="Crafted with pure mulmul and hand-block prints in our Jaipur atelier..." style="padding:10px; border:1px solid #ccc;"></textarea>
        </div>
        <div style="grid-column: 1/-1; display:flex; gap:12px; margin-top:12px;">
          <button type="submit" class="btn btn-gold">Save &amp; Publish Live</button>
          <button type="button" class="btn btn-outline-gold" onclick="renderAdminView('products')">Cancel</button>
        </div>
      </form>
    `;
  } else if (viewName === 'orders') {
    pane.innerHTML = `
      <h2 style="font-size:24px; color:var(--maroon); margin-bottom:16px;">Orders Dispatch &amp; Tracking</h2>
      <table class="admin-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Update Status</th>
          </tr>
        </thead>
        <tbody>
          ${state.orders.map(o => `
            <tr>
              <td><strong>${o.id}</strong></td>
              <td>${esc(o.customer)}<br><small style="color:var(--text-muted);">${o.email}</small></td>
              <td>${o.phone}</td>
              <td>${inr(o.amount)}</td>
              <td><span class="status-badge-green">${o.status}</span></td>
              <td>
                <select onchange="updateOrderStatus('${o.id}', this.value)" style="padding:6px 10px; font-size:11px;">
                  <option value="Confirmed" ${o.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
                  <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
                  <option value="Packed" ${o.status === 'Packed' ? 'selected' : ''}>Packed</option>
                  <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
                  <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                  <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } else if (viewName === 'discounts') {
    pane.innerHTML = `
      <h2 style="font-size:24px; color:var(--maroon); margin-bottom:16px;">Privilege Discount Codes</h2>
      <table class="admin-table" style="margin-bottom:24px;">
        <thead>
          <tr>
            <th>Code</th>
            <th>Type</th>
            <th>Value</th>
            <th>Min Order</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          ${state.discounts.map(d => `
            <tr>
              <td><strong>${d.code}</strong></td>
              <td>${d.type}</td>
              <td>${d.type === 'percent' ? `${d.value}%` : d.type === 'flat' ? inr(d.value) : 'Free Shipping'}</td>
              <td>${d.min ? inr(d.min) : 'None'}</td>
              <td>${esc(d.desc)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <h3 style="font-size:18px; color:var(--maroon); margin-bottom:12px;">Create New Privilege Code</h3>
      <form onsubmit="handleCreateDiscount(event)" style="display:grid; grid-template-columns:1fr 1fr; gap:14px; max-width:600px;">
        <input type="text" name="code" placeholder="PROMO CODE (e.g. DIWALI30)" required style="padding:10px; border:1px solid #ccc; text-transform:uppercase;">
        <select name="type" style="padding:10px; border:1px solid #ccc;">
          <option value="percent">Percentage Off (%)</option>
          <option value="flat">Flat Amount Off (₹)</option>
          <option value="free_shipping">Free Shipping</option>
        </select>
        <input type="number" name="value" placeholder="Value (e.g. 15 or 1000)" required style="padding:10px; border:1px solid #ccc;">
        <input type="number" name="min" placeholder="Minimum Order (e.g. 5000)" style="padding:10px; border:1px solid #ccc;">
        <button type="submit" class="btn btn-gold" style="grid-column:1/-1;">Publish Discount</button>
      </form>
    `;
  } else if (viewName === 'data') {
    pane.innerHTML = `
      <h2 style="font-size:24px; color:var(--maroon); margin-bottom:16px;">Data &amp; Backup Controls</h2>
      <p style="font-size:13px; color:var(--text-muted); margin-bottom:24px;">Export entire store database as JSON or reset to factory demo state.</p>
      <div style="display:flex; gap:16px; flex-wrap:wrap;">
        <button class="btn btn-gold" onclick="exportDataJSON()">Export Store JSON</button>
        <button class="btn btn-maroon" onclick="resetDemoData()">Reset to Factory State</button>
      </div>
    `;
  }
};

window.handleAdminAddProduct = function(e) {
  e.preventDefault();
  const form = e.target;
  const newProduct = {
    id: `sb-${Date.now().toString().slice(-4)}`,
    name: form.name.value,
    sku: form.sku.value,
    price: Number(form.price.value),
    original: Number(form.original.value || form.price.value),
    category: form.category.value,
    sub: form.sub.value || 'Couture',
    badge: 'NEW',
    isNew: true,
    isBestseller: false,
    isSold: false,
    stock: Number(form.stock.value || 5),
    hours: 120,
    fabric: 'Pure Cotton Mulmul',
    desc: form.desc.value || 'Handcrafted Jaipur artisan creation.',
    image: form.image.value,
    image2: 'img/saira-tag.webp',
    images: [form.image.value, 'img/saira-tag.webp'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colours: ['Maroon'],
    coloursHex: ['#4A121F'],
    collection: 'Rozana',
    rating: 5.0,
    reviews: 1
  };

  state.products.unshift(newProduct);
  saveState();
  showToast(`Added ${newProduct.name} to live store!`, '✓');
  renderProductGrid();
  renderAdminView('products');
};

window.duplicateProduct = function(id) {
  const p = state.products.find(item => item.id === id);
  if (!p) return;
  const copy = JSON.parse(JSON.stringify(p));
  copy.id = `sb-${Date.now().toString().slice(-4)}`;
  copy.name = `${copy.name} (Copy)`;
  state.products.unshift(copy);
  saveState();
  showToast(`Duplicated ${p.name}`, '✦');
  renderProductGrid();
  renderAdminView('products');
};

window.deleteProduct = function(id) {
  state.products = state.products.filter(p => p.id !== id);
  saveState();
  showToast('Product removed.', '•');
  renderProductGrid();
  renderAdminView('products');
};

window.updateOrderStatus = function(orderId, newStatus) {
  const o = state.orders.find(item => item.id === orderId);
  if (o) {
    o.status = newStatus;
    saveState();
    showToast(`Order ${orderId} updated to ${newStatus}`, '✓');
  }
};

window.handleCreateDiscount = function(e) {
  e.preventDefault();
  const form = e.target;
  const newDisc = {
    code: form.code.value.toUpperCase().trim(),
    type: form.type.value,
    value: Number(form.value.value),
    min: Number(form.min.value || 0),
    desc: `${form.value.value}${form.type.value === 'percent' ? '% off' : ' off'}`
  };
  state.discounts.unshift(newDisc);
  saveState();
  showToast(`Privilege code ${newDisc.code} created!`, '✦');
  renderAdminView('discounts');
};

window.exportDataJSON = function() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `label-surbhee-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  showToast('Store JSON exported successfully.', '✓');
};

window.resetDemoData = function() {
  if (confirm('Reset store data to factory defaults?')) {
    localStorage.removeItem(KEY_STATE);
    state = loadInitialState();
    saveState();
    renderProductGrid();
    renderBestsellers();
    showToast('Factory demo data restored.', '✦');
    renderAdminView('overview');
  }
};

// ============================================================
// DRAWER HELPERS
// ============================================================
function openDrawer(drawerId) {
  closeAllDrawers();
  const d = $(`#${drawerId}`);
  if (d) d.classList.add('open');
  $('#modal-backdrop').classList.add('open');
  document.body.classList.add('noscroll');
}

function closeAllDrawers() {
  $$('.slide-drawer').forEach(d => d.classList.remove('open'));
  closeProductModal();
  closeAdminPanel();
  const lookbookModal = $('#lookbook-modal');
  if (lookbookModal) lookbookModal.classList.remove('open');
  const sizeModal = $('#size-guide-modal');
  if (sizeModal) sizeModal.classList.remove('open');
  $('#modal-backdrop').classList.remove('open');
  document.body.classList.remove('noscroll');
}

// Global Event Listeners & Delegation
document.addEventListener('click', e => {
  const target = e.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;

  if (action === 'open-cart') {
    openDrawer('cart-drawer');
  } else if (action === 'close-drawer') {
    closeAllDrawers();
  } else if (action === 'open-wishlist') {
    openDrawer('wishlist-drawer');
  } else if (action === 'open-account') {
    openAccountDrawer();
  } else if (action === 'open-admin') {
    openAdminPanel();
  } else if (action === 'close-admin') {
    closeAdminPanel();
  } else if (action === 'quick-add') {
    const id = target.dataset.id;
    addToCart(id);
  } else if (action === 'toggle-wish') {
    const id = target.dataset.id;
    toggleWishlist(id);
  } else if (action === 'open-product') {
    const id = target.dataset.id;
    openProductModal(id);
  } else if (action === 'apply-promo') {
    const inp = $('#promo-code-input');
    if (inp) applyPromoCode(inp.value);
  } else if (action === 'checkout') {
    runCheckout();
  } else if (action === 'open-size-guide') {
    const m = $('#size-guide-modal');
    if (m) {
      m.classList.add('open');
      $('#modal-backdrop').classList.add('open');
    }
  } else if (action === 'close-size-guide') {
    const m = $('#size-guide-modal');
    if (m) m.classList.remove('open');
  } else if (action === 'open-lookbook') {
    const id = target.dataset.lookbookId;
    openLookbookModal(id);
  } else if (action === 'close-lookbook') {
    const m = $('#lookbook-modal');
    if (m) m.classList.remove('open');
  }
});

// Escape key to close drawers
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeAllDrawers();
});

// Lookbook Modal
function openLookbookModal(editId) {
  const edit = LOOKBOOK_EDITS.find(l => l.id === editId) || LOOKBOOK_EDITS[0];
  const modal = $('#lookbook-modal');
  if (!modal) return;
  $('#lookbook-modal-title').textContent = edit.title;
  $('#lookbook-modal-sub').textContent = edit.subtitle;
  const container = $('#lookbook-modal-items');
  if (container) {
    container.innerHTML = edit.items.map(it => `
      <div style="display:flex; align-items:center; gap:16px; border-bottom:1px solid #eee; padding-bottom:12px;">
        <img src="${it.img}" style="width:70px; height:90px; object-fit:cover; border:1px solid #ccc;">
        <div style="flex:1;">
          <span style="font-size:10px; color:var(--gold); text-transform:uppercase;">${it.tag}</span>
          <h4 style="font-size:15px; margin:2px 0;">${it.name}</h4>
          <strong style="color:var(--maroon);">${inr(it.price)}</strong>
        </div>
        <button class="btn btn-outline-gold" style="padding:6px 12px; font-size:10px;" onclick="showToast('Added ${it.name} to styling set.', '✦')">Add to Look</button>
      </div>
    `).join('');
  }
  modal.classList.add('open');
  $('#modal-backdrop').classList.add('open');
}

// Search input listener
document.addEventListener('DOMContentLoaded', () => {
  const srch = $('#header-search-input');
  if (srch) {
    srch.addEventListener('input', e => {
      currentSearchQuery = e.target.value;
      renderProductGrid();
    });
  }

  // Filter tabs
  $$('.filter-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.filter-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTabFilter = btn.dataset.filter;
      renderProductGrid();
    });
  });

  // Sort select
  const sortSel = $('#sort-select');
  if (sortSel) {
    sortSel.addEventListener('change', e => {
      currentSort = e.target.value;
      renderProductGrid();
    });
  }

  // Initial renders
  renderProductGrid();
  renderBestsellers();
  updateBadges();
  renderCartDrawer();
  renderWishlistDrawer();
});
