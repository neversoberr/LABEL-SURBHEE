/* ============================================================
   LABEL SURBHEE — Shopify theme engine
   Cart drawer · variants · search · wishlist · modals · reveals
   ============================================================ */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- config ---------- */
  var CFG = {};
  try {
    CFG = JSON.parse($('#LSThemeConfig').textContent || '{}');
  } catch (e) { CFG = {}; }
  CFG.routes = CFG.routes || {};
  var R = {
    add: CFG.routes.cart_add || '/cart/add.js',
    change: CFG.routes.cart_change || '/cart/change.js',
    cart: CFG.routes.cart_url || '/cart',
    search: CFG.routes.search_url || '/search',
    predictive: CFG.routes.predictive_search_url || '/search/suggest'
  };

  /* ---------- money ---------- */
  function money(cents) {
    var n = Math.round(cents / 100).toLocaleString('en-IN');
    return '₹' + n;
  }

  /* ---------- toast ---------- */
  function toast(msg, ic) {
    var box = $('#toasts');
    if (!box) return;
    var t = document.createElement('div');
    t.className = 'toast';
    var a = document.createElement('span');
    a.className = 'ic';
    a.textContent = ic || '✦';
    var b = document.createElement('span');
    b.textContent = msg;
    t.appendChild(a);
    t.appendChild(b);
    box.appendChild(t);
    setTimeout(function () {
      t.classList.add('out');
      setTimeout(function () { t.remove(); }, 450);
    }, 3200);
  }

  /* ---------- drawer / overlays / modals ---------- */
  function openCart() {
    var d = $('#drawer');
    if (d) d.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeCart() {
    var d = $('#drawer');
    if (d) d.classList.remove('open');
    document.body.style.overflow = '';
  }
  function openSearch() {
    var ov = $('#search-ov');
    if (!ov) return;
    ov.classList.add('open');
    setTimeout(function () { var i = $('#srch-in'); if (i) i.focus(); }, 60);
  }
  function closeSearch() {
    var ov = $('#search-ov');
    if (ov) ov.classList.remove('open');
  }
  function openModal() {
    var m = $('#modal');
    if (m) m.classList.add('open');
  }
  function closeModal() {
    var m = $('#modal');
    if (m) m.classList.remove('open');
  }
  function openMenu() {
    var m = $('#mmenu');
    if (m) m.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    var m = $('#mmenu');
    if (m) m.classList.remove('open');
    if (!($('#drawer') && $('#drawer').classList.contains('open'))) document.body.style.overflow = '';
  }

  /* ---------- cart ---------- */
  function updateCartCount(count) {
    var cc = $('#cart-count');
    if (!cc) return;
    cc.textContent = count;
    cc.style.display = count > 0 ? 'grid' : 'none';
  }

  function refreshCartDrawer(openAfter) {
    return fetch('/?section_id=cart-drawer', { headers: { Accept: 'text/html' } })
      .then(function (res) { return res.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var fresh = doc.querySelector('[data-cart-drawer]');
        var current = $('[data-cart-drawer]');
        if (fresh && current) current.replaceWith(fresh);
        return fetch('/cart.js').then(function (r) { return r.json(); });
      })
      .then(function (cart) {
        updateCartCount(cart.item_count);
        if (openAfter) openCart();
        return cart;
      })
      .catch(function () {
        if (openAfter) openCart();
      });
  }

  function addToCart(variantId, qty) {
    qty = qty || 1;
    return fetch(R.add, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ id: variantId, quantity: qty })
    })
      .then(function (res) {
        if (!res.ok) return res.json().then(function (j) { throw new Error(j.description || 'Could not add to bag.'); });
        return res.json();
      })
      .then(function () {
        toast('Added to bag', '✦');
        return refreshCartDrawer(true);
      })
      .catch(function (err) {
        toast(err.message || 'Could not add to bag.', '⚠');
      });
  }

  function changeLine(line, qty) {
    return fetch(R.change, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ line: line, quantity: qty })
    })
      .then(function (res) { return res.json(); })
      .then(function (cart) {
        updateCartCount(cart.item_count);
        return refreshCartDrawer(false).then(function () {
          // keep drawer open after qty change
          var d = $('#drawer');
          if (d && !d.classList.contains('open')) d.classList.add('open');
        });
      })
      .catch(function () { toast('Could not update bag.', '⚠'); });
  }

  /* ---------- wishlist (localStorage, guest-friendly) ---------- */
  var WKEY = 'labelsurbhee_wishlist_v1';
  function getWish() {
    try { return JSON.parse(localStorage.getItem(WKEY) || '[]'); }
    catch (e) { return []; }
  }
  function setWish(list) {
    localStorage.setItem(WKEY, JSON.stringify(list));
    paintWish();
  }
  function paintWish() {
    var list = getWish();
    var wc = $('#wish-count');
    if (wc) {
      wc.textContent = list.length;
      wc.style.display = list.length ? 'grid' : 'none';
    }
    $$('[data-wish]').forEach(function (btn) {
      var h = btn.getAttribute('data-wish');
      var on = list.indexOf(h) !== -1;
      btn.classList.toggle('on', on);
      if (btn.classList.contains('heart')) {
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      }
      var label = btn.querySelector('[data-wish-label]');
      if (label) label.textContent = on ? 'Saved to wishlist' : 'Save to wishlist';
    });
  }
  function toggleWish(handle, btn) {
    if (!handle) return;
    var list = getWish();
    var i = list.indexOf(handle);
    if (i === -1) {
      list.push(handle);
      toast('Saved to wishlist', '♥');
    } else {
      list.splice(i, 1);
      toast('Removed from wishlist', '✦');
    }
    setWish(list);
    if (btn && btn.closest('#wishlist-grid')) renderWishlistGrid();
  }

  function wishCardHTML(p) {
    var img = (p.images && p.images[0]) || (p.featured_image || '');
    var price = money(p.price_min || p.price || 0);
    var compare = p.compare_at_price_min || p.compare_at_price || 0;
    var off = '';
    if (compare > (p.price_min || p.price || 0)) {
      var pc = Math.round((1 - (p.price_min || p.price) / compare) * 100);
      off = '<s>' + money(compare) + '</s><span class="off">' + pc + '% off</span>';
    }
    var avail = p.available !== false;
    return (
      '<div class="pcard rv in">' +
        '<div class="pcard-img">' +
          '<a href="' + p.url + '" aria-label="' + escapeHTML(p.title) + '">' +
            (img ? '<img src="' + img + '" alt="' + escapeHTML(p.title) + '" loading="lazy" width="600" height="750">' : '') +
          '</a>' +
          (avail ? '' : '<span class="badge b-out">Sold Out</span>') +
          '<button class="heart on" data-wish="' + p.handle + '" aria-label="Remove from wishlist" type="button">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 20s-7-4.6-9.3-9C1 7.5 3 4.5 6.2 4.5c2 0 3.4 1.1 4.2 2.4l1.6 2.4 1.6-2.4c.8-1.3 2.2-2.4 4.2-2.4C21 4.5 23 7.5 21.3 11 19 15.4 12 20 12 20z"/></svg>' +
          '</button>' +
        '</div>' +
        '<div class="pcard-info">' +
          '<h3><a href="' + p.url + '">' + escapeHTML(p.title) + '</a></h3>' +
          '<div class="cat">' + escapeHTML(p.type || ' ') + '</div>' +
          '<div class="prow"><span class="price">' + price + '</span>' + off + '</div>' +
        '</div>' +
      '</div>'
    );
  }
  function escapeHTML(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function renderWishlistGrid() {
    var grid = $('#wishlist-grid');
    if (!grid) return;
    var list = getWish();
    if (!list.length) {
      grid.innerHTML = '<div class="empty wish-empty" style="grid-column:1/-1"><span class="orn">♥</span><p>Your wishlist is empty — for now.</p><a class="btn btn-sm" href="/collections/all"><span>Discover pieces</span></a></div>';
      return;
    }
    grid.innerHTML = '<div class="empty wish-empty" style="grid-column:1/-1"><span class="orn">✦</span><p>Gathering your saved pieces…</p></div>';
    Promise.all(list.map(function (h) {
      return fetch('/products/' + h + '.js').then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
    })).then(function (products) {
      products = products.filter(Boolean);
      if (!products.length) {
        grid.innerHTML = '<div class="empty wish-empty" style="grid-column:1/-1"><span class="orn">✦</span><p>Those pieces are no longer available.</p></div>';
        return;
      }
      grid.innerHTML = products.map(wishCardHTML).join('');
      paintWish();
      observeReveals(grid);
    });
  }

  /* ---------- predictive search ---------- */
  var searchTimer = null;
  function doPredictive(q) {
    var out = $('#srch-res');
    if (!out) return;
    q = (q || '').trim();
    if (q.length < 2) {
      out.innerHTML = '<p class="srch-empty">Try “bridal”, “jhumka”, “saree”…</p>';
      return;
    }
    clearTimeout(searchTimer);
    searchTimer = setTimeout(function () {
      fetch(R.predictive + '?q=' + encodeURIComponent(q) + '&resources[type]=product&resources[limit]=8', { headers: { Accept: 'application/json' } })
        .then(function (res) { return res.json(); })
        .then(function (json) {
          var products = (json.resources && json.resources.results && json.resources.results.products) || [];
          if (!products.length) {
            out.innerHTML = '<p class="srch-empty">Nothing for “' + escapeHTML(q) + '” — try WhatsApp and we’ll hunt it down.</p>';
            return;
          }
          out.innerHTML = products.map(function (p) {
            return '<a href="' + p.url + '"><img src="' + (p.image || '') + '" alt="" loading="lazy"><div><h5>' + escapeHTML(p.title) + '</h5><p>' + escapeHTML(p.type || '') + ' · ' + money(p.price_min || p.price || 0) + '</p></div></a>';
          }).join('');
        })
        .catch(function () {
          out.innerHTML = '<p class="srch-empty">Search is unavailable right now — press Enter to try the full search.</p>';
        });
    }, 220);
  }

  /* ---------- product page: variants ---------- */
  function initProduct() {
    var root = $('[data-product-root]');
    if (!root) return;
    var dataEl = $('[data-product-variants]');
    var variants = [];
    try { variants = JSON.parse(dataEl ? dataEl.textContent : '[]'); } catch (e) { variants = []; }
    if (!variants.length) return;

    var form = root.querySelector('form.product-form');
    var variantInput = root.querySelector('[data-variant-input]');
    var qtyInput = root.querySelector('[data-quantity-input]');
    var qtyDisplay = root.querySelector('[data-qty-display]');
    var addBtn = root.querySelector('[data-add-button]');
    var addLabel = root.querySelector('[data-add-label]');
    var priceEl = root.querySelector('[data-price]');
    var priceRoot = root.querySelector('[data-price-root]');
    var qty = 1;

    function selectedOptions() {
      return $$('[data-option-group]', root).map(function (group) {
        var on = group.querySelector('[data-option-value].on');
        return on ? on.getAttribute('data-option-value') : null;
      });
    }
    function findVariant() {
      var opts = selectedOptions();
      return variants.filter(function (v) {
        return v.options.every(function (val, i) { return opts[i] === null || opts[i] === val; });
      })[0] || null;
    }
    function paintVariant(v) {
      if (!v) return;
      if (variantInput) variantInput.value = v.id;
      // availability of each option value
      $$('[data-option-group]', root).forEach(function (group, gi) {
        $$('[data-option-value]', group).forEach(function (btn) {
          var val = btn.getAttribute('data-option-value');
          var possible = variants.some(function (cand) {
            if (cand.options[gi] !== val) return false;
            return selectedOptions().every(function (sel, si) {
              return si === gi || sel === null || cand.options[si] === sel;
            });
          });
          var buyable = variants.some(function (cand) {
            if (!cand.available || cand.options[gi] !== val) return false;
            return selectedOptions().every(function (sel, si) {
              return si === gi || sel === null || cand.options[si] === sel;
            });
          });
          btn.classList.toggle('disabled', possible && !buyable);
          if (btn.disabled !== undefined) btn.disabled = possible && !buyable ? true : false;
        });
      });
      // price
      if (priceEl) priceEl.textContent = money(v.price);
      var s = priceRoot ? priceRoot.querySelector('[data-compare-price]') : null;
      var off = priceRoot ? priceRoot.querySelector('[data-price-off]') : null;
      if (v.compare_at_price > v.price) {
        var pct = Math.round((1 - v.price / v.compare_at_price) * 100) + '% off';
        if (s) s.textContent = money(v.compare_at_price);
        else if (priceRoot && priceEl) {
          s = document.createElement('s');
          s.setAttribute('data-compare-price', '');
          s.textContent = money(v.compare_at_price);
          priceEl.after(s);
        }
        if (off) off.textContent = pct;
        else if (priceRoot && priceEl) {
          off = document.createElement('span');
          off.className = 'off';
          off.setAttribute('data-price-off', '');
          off.textContent = pct;
          (s || priceEl).after(off);
        }
      } else {
        if (s) s.remove();
        if (off) off.remove();
      }
      // button
      if (addBtn) {
        addBtn.disabled = !v.available;
        if (addLabel) addLabel.textContent = v.available ? 'Add to bag' : 'Sold Out';
      }
      // url
      try {
        var url = new URL(window.location.href);
        url.searchParams.set('variant', v.id);
        window.history.replaceState({}, '', url.toString());
      } catch (e) { /* noop */ }
    }

    $$('[data-option-group]', root).forEach(function (group, gi) {
      group.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-option-value]');
        if (!btn || btn.disabled) return;
        $$('[data-option-value]', group).forEach(function (b) { b.classList.remove('on'); });
        btn.classList.add('on');
        var label = root.querySelector('[data-option-label="' + gi + '"]');
        if (label) label.textContent = btn.getAttribute('data-option-value');
        var sel = root.querySelector('[data-option-select="' + gi + '"]');
        if (sel) sel.value = btn.getAttribute('data-option-value');
        paintVariant(findVariant());
      });
    });

    // qty stepper
    root.addEventListener('click', function (e) {
      if (e.target.closest('[data-action="pinc"]')) {
        qty = Math.min(99, qty + 1);
      } else if (e.target.closest('[data-action="pdec"]')) {
        qty = Math.max(1, qty - 1);
      } else return;
      if (qtyDisplay) qtyDisplay.textContent = qty;
      if (qtyInput) qtyInput.value = qty;
    });

    // gallery
    $$('[data-thumb-src]', root).forEach(function (btn) {
      btn.addEventListener('click', function () {
        $$('[data-thumb-src]', root).forEach(function (b) { b.classList.remove('on'); });
        btn.classList.add('on');
        var main = $('#gal-main');
        if (main) {
          main.style.opacity = '0';
          setTimeout(function () {
            main.src = btn.getAttribute('data-thumb-src');
            main.alt = btn.getAttribute('data-thumb-alt') || main.alt;
            main.onload = function () { main.style.opacity = '1'; };
            setTimeout(function () { main.style.opacity = '1'; }, 350);
          }, 120);
        }
      });
    });

    // submit -> ajax add
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var id = variantInput ? parseInt(variantInput.value, 10) : null;
        if (!id) return;
        if (addBtn) addBtn.disabled = true;
        if (addLabel) addLabel.textContent = 'Adding…';
        addToCart(id, qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1).then(function () {
          var v = variants.filter(function (x) { return x.id === id; })[0];
          if (v && addBtn) {
            addBtn.disabled = !v.available;
            if (addLabel) addLabel.textContent = v.available ? 'Add to bag' : 'Sold Out';
          }
        });
      });
    }

    paintVariant(findVariant() || variants[0]);
  }

  /* ---------- PIN estimator ---------- */
  function checkPin() {
    var input = $('[data-pin-input]');
    var res = $('[data-pin-result]');
    if (!input || !res) return;
    var pin = (input.value || '').replace(/\D/g, '');
    if (!/^[1-9][0-9]{5}$/.test(pin)) {
      res.textContent = 'Please enter a valid 6-digit PIN code.';
      return;
    }
    var metro = ['110', '400', '560', '500', '600', '700'];
    var isMetro = metro.indexOf(pin.slice(0, 3)) !== -1;
    var freeOver = CFG.freeShippingLabel || '₹1,999';
    res.innerHTML = '✦ Delivering to <b>' + pin + '</b> — ' +
      (isMetro ? '2–4 days (metro express available).' : '3–7 days.') +
      ' Free shipping over ' + freeOver + '. COD available.';
  }

  /* ---------- reveals ---------- */
  var revealIO = null;
  function observeReveals(scope) {
    var els = $$('.rv:not(.in)', scope || document);
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    if (!revealIO) {
      revealIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add('in');
            revealIO.unobserve(en.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    }
    els.forEach(function (el) { revealIO.observe(el); });
  }

  /* ---------- global click delegation ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target;

    // wishlist buttons (stop card navigation)
    var wish = t.closest('[data-wish]');
    if (wish) {
      e.preventDefault();
      e.stopPropagation();
      toggleWish(wish.getAttribute('data-wish'), wish);
      return;
    }

    // quick add
    var qa = t.closest('[data-add-to-cart]');
    if (qa) {
      e.preventDefault();
      e.stopPropagation();
      var vid = parseInt(qa.getAttribute('data-variant-id'), 10);
      if (vid) {
        qa.disabled = true;
        addToCart(vid, 1).then(function () { qa.disabled = false; });
      }
      return;
    }

    // quick view -> go to product
    var qv = t.closest('[data-quick-view]');
    if (qv) {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = qv.getAttribute('data-quick-view');
      return;
    }

    // cart drawer qty
    var cq = t.closest('[data-cart-qty]');
    if (cq) {
      e.preventDefault();
      var line = parseInt(cq.getAttribute('data-line'), 10);
      var qty = parseInt(cq.getAttribute('data-qty'), 10);
      changeLine(line, qty);
      return;
    }

    var act = t.closest('[data-action]');
    if (!act) {
      // overlay click-outside
      if (t.id === 'search-ov') closeSearch();
      if (t.id === 'modal') closeModal();
      // mobile submenu toggle
      var mmBtn = t.closest('.mm-item > button');
      if (mmBtn) mmBtn.parentElement.classList.toggle('open');
      return;
    }
    var action = act.getAttribute('data-action');

    switch (action) {
      case 'mm-open': openMenu(); break;
      case 'mm-close': closeMenu(); break;
      case 'search': openSearch(); break;
      case 'close-search': closeSearch(); break;
      case 'cart': openCart(); break;
      case 'close-drawer':
        if (act.tagName === 'A') { /* let navigation happen */ closeCart(); break; }
        e.preventDefault();
        closeCart();
        break;
      case 'close-modal': closeModal(); break;
      case 'pin': checkPin(); break;
      case 'acc': {
        var acc = act.closest('.acc');
        if (acc) acc.classList.toggle('open');
        break;
      }
      case 'faq': {
        var item = act.closest('.faq-item');
        if (item) {
          var wasOpen = item.classList.contains('open');
          $$('.faq-item.open').forEach(function (f) { f.classList.remove('open'); });
          if (!wasOpen) item.classList.add('open');
        }
        break;
      }
    }
  });

  // size guide links
  document.addEventListener('click', function (e) {
    var sg = e.target.closest('[data-size-guide]');
    if (sg) {
      e.preventDefault();
      openModal();
    }
  });

  // PIN input: enter key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeCart(); closeSearch(); closeModal(); closeMenu();
    }
    if (e.key === 'Enter' && e.target && e.target.matches('[data-pin-input]')) {
      e.preventDefault();
      checkPin();
    }
  });

  // search input
  document.addEventListener('input', function (e) {
    if (e.target && e.target.id === 'srch-in') doPredictive(e.target.value);
  });

  // sort dropdown
  document.addEventListener('change', function (e) {
    if (e.target && e.target.matches('[data-sort-by]')) {
      var url = new URL(window.location.href);
      url.searchParams.set('sort_by', e.target.value);
      window.location.href = url.toString();
    }
  });

  // addresses page
  document.addEventListener('click', function (e) {
    var edit = e.target.closest('[data-address-edit]');
    if (edit) {
      e.preventDefault();
      var card = edit.closest('.addr-card');
      var f = card ? card.querySelector('.addr-edit-form') : null;
      if (f) f.style.display = f.style.display === 'none' ? '' : 'none';
      return;
    }
    var del = e.target.closest('[data-address-delete]');
    if (del) {
      e.preventDefault();
      if (!window.confirm('Delete this address?')) return;
      var id = del.getAttribute('data-address-delete');
      var form = document.querySelector('[data-address-delete-form="' + id + '"]');
      if (form) form.submit();
    }
    var rec = e.target.closest('[data-recover-link]');
    if (rec) {
      e.preventDefault();
      var target = $('#recover');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
  });

  /* ---------- admin console (sections/admin.liquid) ----------
     Read-only team page behind the server-side "admin" customer tag.
     PIN + OTP are a second, client-side step (obfuscated, NOT real security). */
  function LSAdmin() {
    var root = $('[data-admin-root]');
    if (!root) return;

    // obfuscated secrets — kept out of readable form; real console lives in Shopify admin
    var _P = [48, 56, 53, 50].map(function (c) { return String.fromCharCode(c); }).reverse().join('');
    var _O = [52, 56, 50, 57, 49, 51].map(function (c) { return String.fromCharCode(c); }).join('');

    var gate = $('[data-admin-gate]');
    var dash = $('[data-admin-dash]');
    var errEl = $('[data-admin-err]');
    var panel = $('[data-admin-panel]');
    var tabs = $$('[data-admin-tab]');
    var step = 0;

    if (sessionStorage.getItem('ls_theme_admin') === '1') unlock();

    root.addEventListener('submit', function (e) {
      var f = e.target && e.target.getAttribute && e.target.getAttribute('data-admin-form');
      if (!f) return;
      e.preventDefault();
      var input = e.target.querySelector('input');
      var val = (input ? input.value : '').trim();

      if (f === 'pin') {
        if (val === _P) { step = 2; paintOtp(); return; }
        errEl.textContent = 'Incorrect PIN.';
        return;
      }
      if (f === 'otp') {
        if (val === _O) { sessionStorage.setItem('ls_theme_admin', '1'); toast('Welcome back, Surbhee.', '✦'); unlock(); return; }
        errEl.textContent = 'Incorrect OTP.';
      }
    });

    root.addEventListener('click', function (e) {
      var t = e.target.closest('[data-admin-tab]');
      if (t) { tabs.forEach(function (b) { b.classList.toggle('on', b === t); }); render(t.getAttribute('data-admin-tab')); return; }
      if (e.target.closest('[data-admin-logout]')) {
        sessionStorage.removeItem('ls_theme_admin');
        step = 0;
        dash.hidden = true;
        gate.hidden = false;
        gate.querySelector('input').value = '';
        errEl.textContent = '';
        paintPin();
      }
    });

    function paintPin() {
      errEl.textContent = '';
      gate.style.display = '';
      var f = gate.querySelector('form');
      f.setAttribute('data-admin-form', 'pin');
      f.innerHTML =
        '<input type="password" name="pin" maxlength="4" inputmode="numeric" placeholder="••••" aria-label="Admin PIN" autocomplete="off" required>' +
        '<button class="btn btn-solid" type="submit" style="width:100%"><span>Verify PIN</span></button>';
    }
    function paintOtp() {
      errEl.textContent = '';
      var f = gate.querySelector('form');
      f.setAttribute('data-admin-form', 'otp');
      f.innerHTML =
        '<p style="font-size:12px;color:var(--ivory-faint);margin-bottom:16px;letter-spacing:.06em">Step 2 of 2 — OTP sent to your registered mobile.</p>' +
        '<input type="password" name="otp" maxlength="6" inputmode="numeric" placeholder="••••••" aria-label="Admin OTP" autocomplete="off" autofocus required>' +
        '<button class="btn btn-solid" type="submit" style="width:100%"><span>Verify &amp; enter</span></button>';
    }

    function unlock() {
      gate.hidden = true;
      dash.hidden = false;
      tabs.forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-admin-tab') === 'overview'); });
      render('overview');
    }

    // Read-only shortcuts into the real Shopify admin — the theme never
    // exposes a product/order write path (Shopify admin does that safely).
    var ADMIN_URL = (window.Shopify && Shopify.routes && Shopify.routes.admin_url_prefix) ? Shopify.routes.admin_url_prefix : '/admin';
    var GO = {
      products: ADMIN_URL + '/products',
      collections: ADMIN_URL + '/collections',
      discounts: ADMIN_URL + '/discounts',
      orders: ADMIN_URL + '/orders',
      customers: ADMIN_URL + '/customers'
    };
    function openAdmin(path) { window.open(ADMIN_URL + path, '_blank', 'noopener'); }

    function card(title, body, href) {
      return '<div class="adm-card"><h4>' + title + '</h4><p>' + body + '</p>' +
        '<a class="btn btn-ghost btn-sm" href="' + href + '" target="_blank" rel="noopener"><span>Open in Shopify admin →</span></a></div>';
    }

    function render(tab) {
      var html = '';
      if (tab === 'overview') {
        html =
          '<h3>Overview</h3><p class="sub">Read-only console — the theme does not write to your data.</p>' +
          '<div class="adm-grid">' +
          card('Products', 'Add, edit and archive the catalogue — prices, compare-at, inventory, variants and media.', GO.products) +
          card('Collections', 'Automated collections self-fill from tags; manage the 8 edits and category collections here.', GO.collections) +
          card('Discounts', 'WELCOME10, FESTIVE20, FLAT500, BUY2, FREESHIP — create and schedule codes.', GO.discounts) +
          card('Orders', 'Fulfil, refund and track every order from checkout onward.', GO.orders) +
          card('Customers', 'Customer records, tags and the “admin” access tag live here.', GO.customers) +
          '</div><p class="adm-note">Everything product/order related is managed in the Shopify admin, not on the storefront. This page proves your staff-role access and shortcuts the heavy lifting.</p>';
      } else if (tab === 'products' || tab === 'collections' || tab === 'discounts' || tab === 'orders' || tab === 'customers') {
        var label = tab.charAt(0).toUpperCase() + tab.slice(1);
        html =
          '<h3>' + label + '</h3><p class="sub">Opens in the Shopify admin for ' + label.toLowerCase() + '.</p>' +
          '<div class="adm-card"><h4>' + label + '</h4><p>Adding a product &amp; running a sale: set Price + Compare-at price (higher), tag it (' +
          'clothing / lehengas / jewellery + coll-* + new), and it appears across the store and under Sale automatically.</p>' +
          '<a class="btn btn-solid btn-sm" href="' + GO[tab] + '" target="_blank" rel="noopener"><span>Open ' + label + ' →</span></a></div>';
      } else {
        html = '<h3>Overview</h3><p class="sub">Pick a tab.</p>';
      }
      panel.innerHTML = html;
    }
  }
  LSAdmin();

  /* ---------- init ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    paintWish();
    initProduct();
    renderWishlistGrid();
    observeReveals(document);
    // hide edit forms until requested
    $$('.addr-edit-form').forEach(function (f) { f.style.display = 'none'; });
  });
  // re-observe after section re-renders (theme editor)
  document.addEventListener('shopify:section:load', function () {
    paintWish();
    initProduct();
    observeReveals(document);
  });
})();
