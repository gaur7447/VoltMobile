/* ==========================================================================
   VoltMobile Storefront — Application Logic (app.js)
   ========================================================================== */

class PhoneCatalogService {
  constructor(fallbackPhones = []) {
    this.fallbackPhones = fallbackPhones;
  }

  /**
   * Simulates an async REST API fetch with AbortController support
   * and falls back to the local catalog in data.js.
   */
  async fetchPhones(delayMs = 150) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);

    try {
      await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(resolve, delayMs);
        controller.signal.addEventListener("abort", () => {
          clearTimeout(timeoutId);
          reject(new Error("Request timed out"));
        });
      });

      return this.fallbackPhones;
    } catch (error) {
      console.warn("Using local phone catalog:", error.message);
      return this.fallbackPhones;
    } finally {
      clearTimeout(timer);
    }
  }
}

class VoltMobileStore {
  constructor(phones) {
    this.phones = phones;
    this.storageKey = "voltmobile_state_v1";

    const saved = this.loadState();

    // Per-card selected color & variant index
    this.selections = {};
    this.phones.forEach((phone) => {
      this.selections[phone.id] = {
        colorIndex: 0,
        variantIndex: 0,
      };
    });

    // Filters & UI state
    this.filters = {
      search: "",
      brand: "ALL",
      category: "ALL",
      ram: "ALL",
      storage: "ALL",
      maxPrice: 200000,
      sortBy: "featured",
      emiMode: false,
    };

    this.cart = saved.cart || [];
    this.wishlist = saved.wishlist || [];
    this.compareIds = saved.compareIds || [];
    this.promoCode = saved.promoCode || "";
    this.exchangeCredit = saved.exchangeCredit || 0;
  }

  loadState() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  saveState() {
    try {
      localStorage.setItem(
        this.storageKey,
        JSON.stringify({
          cart: this.cart,
          wishlist: this.wishlist,
          compareIds: this.compareIds,
          promoCode: this.promoCode,
          exchangeCredit: this.exchangeCredit,
        })
      );
    } catch (err) {
      console.warn("Could not persist state:", err);
    }
  }

  formatINR(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  formatEMI(amount, months = 24) {
    const monthly = Math.ceil(amount / months);
    return `${this.formatINR(monthly)}/mo`;
  }

  getActiveVariant(phoneId) {
    const phone = this.phones.find((p) => p.id === phoneId);
    if (!phone) return null;
    const sel = this.selections[phoneId] || { colorIndex: 0, variantIndex: 0 };
    const color = phone.colors[sel.colorIndex] || phone.colors[0];
    const variant = phone.variants[sel.variantIndex] || phone.variants[0];
    return { phone, color, variant, sel };
  }

  getFilteredPhones() {
    const { search, brand, category, ram, storage, maxPrice, sortBy } = this.filters;
    const q = search.trim().toLowerCase();

    let list = this.phones.filter((phone) => {
      const matchesQuery =
        !q ||
        phone.name.toLowerCase().includes(q) ||
        phone.brand.toLowerCase().includes(q) ||
        phone.processor.toLowerCase().includes(q) ||
        phone.camera.toLowerCase().includes(q);

      const matchesBrand = brand === "ALL" || phone.brand === brand;
      const matchesCategory = category === "ALL" || phone.category === category;

      const matchesRam =
        ram === "ALL" || phone.variants.some((v) => v.ram === ram);

      const matchesStorage =
        storage === "ALL" || phone.variants.some((v) => v.storage === storage);

      const minPrice = Math.min(...phone.variants.map((v) => v.price));
      const matchesBudget = minPrice <= maxPrice;

      return (
        matchesQuery &&
        matchesBrand &&
        matchesCategory &&
        matchesRam &&
        matchesStorage &&
        matchesBudget
      );
    });

    const getBasePrice = (p) => {
      const active = this.getActiveVariant(p.id);
      return active ? active.variant.price : p.variants[0].price;
    };

    if (sortBy === "price-asc") {
      list.sort((a, b) => getBasePrice(a) - getBasePrice(b));
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => getBasePrice(b) - getBasePrice(a));
    } else if (sortBy === "rating-desc") {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }

  addToCart(phoneId, customSelection = null) {
    const phone = this.phones.find((p) => p.id === phoneId);
    if (!phone) return;

    const sel = customSelection || this.selections[phoneId] || { colorIndex: 0, variantIndex: 0 };
    const color = phone.colors[sel.colorIndex] || phone.colors[0];
    const variant = phone.variants[sel.variantIndex] || phone.variants[0];

    const key = `${phone.id}::${color.name}::${variant.ram}::${variant.storage}`;
    const existing = this.cart.find((item) => item.key === key);

    if (existing) {
      existing.qty += 1;
    } else {
      this.cart.push({
        key,
        phoneId: phone.id,
        name: phone.name,
        brand: phone.brand,
        image: color.image || phone.image,
        colorName: color.name,
        colorHex: color.hex,
        ram: variant.ram,
        storage: variant.storage,
        unitPrice: variant.price,
        qty: 1,
      });
    }

    this.saveState();
    this.showToast(`Added ${phone.name} (${variant.ram}/${variant.storage}, ${color.name}) to bag`);
  }

  updateCartQty(key, delta) {
    const idx = this.cart.findIndex((item) => item.key === key);
    if (idx === -1) return;
    this.cart[idx].qty += delta;
    if (this.cart[idx].qty <= 0) {
      this.cart.splice(idx, 1);
    }
    this.saveState();
  }

  removeFromCart(key) {
    this.cart = this.cart.filter((item) => item.key !== key);
    this.saveState();
  }

  toggleWishlist(phoneId) {
    const phone = this.phones.find((p) => p.id === phoneId);
    if (!phone) return;
    const index = this.wishlist.indexOf(phoneId);
    if (index > -1) {
      this.wishlist.splice(index, 1);
      this.showToast(`Removed ${phone.name} from wishlist`);
    } else {
      this.wishlist.push(phoneId);
      this.showToast(`Saved ${phone.name} to wishlist`);
    }
    this.saveState();
  }

  toggleCompare(phoneId) {
    const phone = this.phones.find((p) => p.id === phoneId);
    if (!phone) return;
    const index = this.compareIds.indexOf(phoneId);
    if (index > -1) {
      this.compareIds.splice(index, 1);
      this.showToast(`Removed ${phone.name} from comparison`);
    } else {
      if (this.compareIds.length >= 3) {
        this.showToast("You can compare up to 3 phones at a time", "warn");
        return;
      }
      this.compareIds.push(phoneId);
      this.showToast(`Added ${phone.name} to comparison (${this.compareIds.length}/3)`);
    }
    this.saveState();
  }

  getCartTotals() {
    const subtotal = this.cart.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);

    let promoDiscount = 0;
    const code = this.promoCode.trim().toUpperCase();
    if (code === "VOLT5000" && subtotal >= 40000) {
      promoDiscount = 5000;
    } else if (code === "WELCOME10") {
      promoDiscount = Math.min(Math.round(subtotal * 0.1), 10000);
    }

    const tradeIn = Math.min(this.exchangeCredit, Math.max(0, subtotal - promoDiscount));
    const total = Math.max(0, subtotal - promoDiscount - tradeIn);

    return { subtotal, promoDiscount, tradeIn, total };
  }

  showToast(message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    const bgClass =
      type === "warn"
        ? "bg-amber-900 text-amber-50 border-amber-700"
        : "bg-slate-900 text-white border-slate-700";

    toast.className = `pointer-events-auto flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium shadow-xl transition-all duration-300 ${bgClass}`;
    toast.innerHTML = `
      <span class="inline-block h-2 w-2 rounded-full ${type === "warn" ? "bg-amber-400" : "bg-indigo-400"}"></span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("opacity-0", "translate-y-2");
      setTimeout(() => toast.remove(), 300);
    }, 2600);
  }
}

/* ==========================================================================
   DOM Rendering & Event Wiring
   ========================================================================== */

class VoltMobileUI {
  constructor(store) {
    this.store = store;
    this.activeModalPhoneId = null;
  }

  init() {
    this.populateBrandFilter();
    this.bindGlobalEvents();
    this.renderAll();
  }

  populateBrandFilter() {
    const brandSelect = document.getElementById("filter-brand");
    if (!brandSelect) return;

    const brands = [...new Set(this.store.phones.map((p) => p.brand))].sort();
    brands.forEach((brand) => {
      const opt = document.createElement("option");
      opt.value = brand;
      opt.textContent = brand;
      brandSelect.appendChild(opt);
    });
  }

  bindGlobalEvents() {
    // Search input
    document.getElementById("search-input")?.addEventListener("input", (e) => {
      this.store.filters.search = e.target.value;
      this.renderGrid();
    });

    // Brand, RAM, Storage, Sort selects
    document.getElementById("filter-brand")?.addEventListener("change", (e) => {
      this.store.filters.brand = e.target.value;
      this.renderGrid();
    });

    document.getElementById("filter-ram")?.addEventListener("change", (e) => {
      this.store.filters.ram = e.target.value;
      this.renderGrid();
    });

    document.getElementById("filter-storage")?.addEventListener("change", (e) => {
      this.store.filters.storage = e.target.value;
      this.renderGrid();
    });

    document.getElementById("sort-select")?.addEventListener("change", (e) => {
      this.store.filters.sortBy = e.target.value;
      this.renderGrid();
    });

    // Category chips
    document.querySelectorAll("[data-category-chip]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const cat = btn.getAttribute("data-category-chip");
        this.store.filters.category = cat;
        document.querySelectorAll("[data-category-chip]").forEach((el) => {
          const active = el.getAttribute("data-category-chip") === cat;
          el.classList.toggle("bg-slate-900", active);
          el.classList.toggle("text-white", active);
          el.classList.toggle("bg-white", !active);
          el.classList.toggle("text-slate-700", !active);
        });
        this.renderGrid();
      });
    });

    // Max price slider
    const priceRange = document.getElementById("filter-max-price");
    const priceLabel = document.getElementById("max-price-label");
    priceRange?.addEventListener("input", (e) => {
      const val = Number(e.target.value);
      this.store.filters.maxPrice = val;
      if (priceLabel) priceLabel.textContent = this.store.formatINR(val);
      this.renderGrid();
    });

    // EMI toggle
    document.getElementById("emi-toggle")?.addEventListener("change", (e) => {
      this.store.filters.emiMode = e.target.checked;
      this.renderGrid();
      this.renderCart();
    });

    // Reset filters
    document.getElementById("reset-filters-btn")?.addEventListener("click", () => {
      this.store.filters = {
        search: "",
        brand: "ALL",
        category: "ALL",
        ram: "ALL",
        storage: "ALL",
        maxPrice: 200000,
        sortBy: "featured",
        emiMode: this.store.filters.emiMode,
      };
      const searchEl = document.getElementById("search-input");
      if (searchEl) searchEl.value = "";
      ["filter-brand", "filter-ram", "filter-storage"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.value = "ALL";
      });
      const sortEl = document.getElementById("sort-select");
      if (sortEl) sortEl.value = "featured";
      if (priceRange) priceRange.value = 200000;
      if (priceLabel) priceLabel.textContent = this.store.formatINR(200000);

      document.querySelectorAll("[data-category-chip]").forEach((el) => {
        const active = el.getAttribute("data-category-chip") === "ALL";
        el.classList.toggle("bg-slate-900", active);
        el.classList.toggle("text-white", active);
        el.classList.toggle("bg-white", !active);
        el.classList.toggle("text-slate-700", !active);
      });

      this.renderGrid();
    });

    // Cart Drawer open/close
    document.getElementById("open-cart-btn")?.addEventListener("click", () => this.toggleCartDrawer(true));
    document.getElementById("close-cart-btn")?.addEventListener("click", () => this.toggleCartDrawer(false));
    document.getElementById("cart-backdrop")?.addEventListener("click", () => this.toggleCartDrawer(false));

    // Apply Promo Code
    document.getElementById("apply-promo-btn")?.addEventListener("click", () => {
      const input = document.getElementById("promo-input");
      const code = (input?.value || "").trim().toUpperCase();
      if (!code) {
        this.store.promoCode = "";
        this.store.saveState();
        this.renderCart();
        return;
      }
      if (code === "VOLT5000" || code === "WELCOME10") {
        this.store.promoCode = code;
        this.store.saveState();
        this.store.showToast(`Promo code ${code} applied`);
      } else {
        this.store.showToast("Try VOLT5000 or WELCOME10", "warn");
      }
      this.renderCart();
    });

    // Exchange / Trade-in estimator
    document.getElementById("exchange-phone-select")?.addEventListener("change", (e) => {
      this.store.exchangeCredit = Number(e.target.value) || 0;
      this.store.saveState();
      this.renderCart();
    });

    // Checkout form submit
    document.getElementById("checkout-form")?.addEventListener("submit", (e) => {
      e.preventDefault();
      if (this.store.cart.length === 0) {
        this.store.showToast("Your bag is empty", "warn");
        return;
      }
      const { total } = this.store.getCartTotals();
      this.store.showToast(`Order confirmed for ${this.store.formatINR(total)}! Thank you for shopping VoltMobile.`);
      this.store.cart = [];
      this.store.promoCode = "";
      this.store.exchangeCredit = 0;
      this.store.saveState();
      this.renderBadges();
      this.renderCart();
      this.toggleCartDrawer(false);
    });

    // Compare Modal
    document.getElementById("open-compare-btn")?.addEventListener("click", () => this.openCompareModal());
    document.getElementById("close-compare-btn")?.addEventListener("click", () => this.closeModal("compare-modal"));

    // Wishlist Modal
    document.getElementById("open-wishlist-btn")?.addEventListener("click", () => this.openWishlistModal());
    document.getElementById("close-wishlist-btn")?.addEventListener("click", () => this.closeModal("wishlist-modal"));

    // Quick-View Modal
    document.getElementById("close-quickview-btn")?.addEventListener("click", () => this.closeModal("quickview-modal"));
  }

  renderAll() {
    this.renderGrid();
    this.renderCart();
    this.renderBadges();
  }

  renderBadges() {
    const cartCount = this.store.cart.reduce((sum, i) => sum + i.qty, 0);
    const cartBadge = document.getElementById("cart-count-badge");
    if (cartBadge) cartBadge.textContent = cartCount;

    const wishBadge = document.getElementById("wishlist-count-badge");
    if (wishBadge) wishBadge.textContent = this.store.wishlist.length;

    const cmpBadge = document.getElementById("compare-count-badge");
    if (cmpBadge) cmpBadge.textContent = this.store.compareIds.length;
  }

  renderGrid() {
    const grid = document.getElementById("phone-grid");
    const countEl = document.getElementById("results-count");
    if (!grid) return;

    const phones = this.store.getFilteredPhones();
    if (countEl) {
      countEl.textContent = `Showing ${phones.length} of ${this.store.phones.length} smartphones`;
    }

    if (phones.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p class="text-lg font-semibold text-slate-900">No phones match your current filters</p>
          <p class="mt-1 text-sm text-slate-500">Try adjusting your budget slider, RAM/storage selection, or search term.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = phones
      .map((phone) => {
        const active = this.store.getActiveVariant(phone.id);
        const { color, variant, sel } = active;
        const isWished = this.store.wishlist.includes(phone.id);
        const isCompared = this.store.compareIds.includes(phone.id);

        const priceDisplay = this.store.filters.emiMode
          ? this.store.formatEMI(variant.price)
          : this.store.formatINR(variant.price);

        const mrpDisplay = this.store.filters.emiMode
          ? ""
          : this.store.formatINR(variant.mrp);

        const discountPct = Math.round(((variant.mrp - variant.price) / variant.mrp) * 100);

        return `
          <article class="phone-card flex flex-col justify-between p-5" data-phone-id="${phone.id}">
            <div>
              <!-- Top badges & actions -->
              <div class="mb-3 flex items-center justify-between gap-2">
                <span class="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                  ${phone.brand} · ${phone.badge || phone.category}
                </span>
                <div class="flex items-center gap-1.5">
                  <button
                    type="button"
                    data-action="compare"
                    data-id="${phone.id}"
                    title="Compare phone"
                    class="rounded-lg border px-2.5 py-1 text-xs font-medium transition ${
                      isCompared
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }"
                  >
                    ${isCompared ? "Comparing" : "Compare"}
                  </button>
                  <button
                    type="button"
                    data-action="wishlist"
                    data-id="${phone.id}"
                    title="Save to wishlist"
                    class="rounded-lg border p-1.5 transition ${
                      isWished
                        ? "border-rose-200 bg-rose-50 text-rose-600"
                        : "border-slate-200 bg-white text-slate-500 hover:text-rose-600"
                    }"
                  >
                    <svg class="h-4 w-4" fill="${isWished ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Image area -->
              <div
                class="phone-image-wrap mb-4 flex h-52 cursor-pointer items-center justify-center rounded-2xl p-4"
                style="--swatch-glow: ${color.hex}33;"
                data-action="quickview"
                data-id="${phone.id}"
              >
                <img
                  src="${color.image || phone.image}"
                  alt="${phone.name} in ${color.name}"
                  class="max-h-44 w-auto object-contain drop-shadow-md"
                  loading="lazy"
                />
              </div>

              <!-- Title & rating -->
              <div class="flex items-start justify-between gap-2">
                <h3
                  class="cursor-pointer text-base font-bold text-slate-900 hover:text-indigo-600"
                  data-action="quickview"
                  data-id="${phone.id}"
                >
                  ${phone.name}
                </h3>
                <span class="shrink-0 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
                  ★ ${phone.rating}
                </span>
              </div>
              <p class="mt-1 text-xs text-slate-500">${phone.processor} · ${phone.camera}</p>

              <!-- Color Swatches -->
              <div class="mt-4">
                <div class="mb-1.5 flex items-center justify-between text-xs">
                  <span class="font-medium text-slate-500">Color</span>
                  <span class="font-semibold text-slate-800">${color.name}</span>
                </div>
                <div class="flex items-center gap-2">
                  ${phone.colors
                    .map(
                      (c, idx) => `
                    <button
                      type="button"
                      class="color-swatch"
                      style="background-color: ${c.hex};"
                      aria-label="${c.name}"
                      aria-pressed="${idx === sel.colorIndex}"
                      data-action="select-color"
                      data-id="${phone.id}"
                      data-index="${idx}"
                    ></button>
                  `
                    )
                    .join("")}
                </div>
              </div>

              <!-- RAM & Storage Variants -->
              <div class="mt-4">
                <span class="mb-1.5 block text-xs font-medium text-slate-500">RAM & Storage</span>
                <div class="flex flex-wrap gap-1.5">
                  ${phone.variants
                    .map(
                      (v, idx) => `
                    <button
                      type="button"
                      class="variant-pill rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 ${
                        idx === sel.variantIndex ? "active" : "bg-slate-50 hover:border-slate-300"
                      }"
                      data-action="select-variant"
                      data-id="${phone.id}"
                      data-index="${idx}"
                    >
                      ${v.ram} / ${v.storage}
                    </button>
                  `
                    )
                    .join("")}
                </div>
              </div>
            </div>

            <!-- Price & Add to Bag -->
            <div class="mt-5 border-t border-slate-100 pt-4">
              <div class="mb-3 flex items-baseline justify-between">
                <div>
                  <span class="text-lg font-extrabold text-slate-900">${priceDisplay}</span>
                  ${
                    mrpDisplay
                      ? `<span class="ml-1.5 text-xs text-slate-400 line-through">${mrpDisplay}</span>`
                      : ""
                  }
                </div>
                ${
                  !this.store.filters.emiMode && discountPct > 0
                    ? `<span class="rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">${discountPct}% off</span>`
                    : `<span class="text-xs font-medium text-indigo-600">No-Cost EMI</span>`
                }
              </div>

              <div class="flex gap-2">
                <button
                  type="button"
                  data-action="add-to-cart"
                  data-id="${phone.id}"
                  class="flex-1 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600"
                >
                  Add to Bag
                </button>
                <button
                  type="button"
                  data-action="quickview"
                  data-id="${phone.id}"
                  class="rounded-xl border border-slate-200 px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Specs
                </button>
              </div>
            </div>
          </article>
        `;
      })
      .join("");

    // Bind card events via delegation
    grid.querySelectorAll("[data-action]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const action = el.getAttribute("data-action");
        const phoneId = el.getAttribute("data-id");
        const index = Number(el.getAttribute("data-index"));

        if (action === "select-color") {
          this.store.selections[phoneId].colorIndex = index;
          this.renderGrid();
        } else if (action === "select-variant") {
          this.store.selections[phoneId].variantIndex = index;
          this.renderGrid();
        } else if (action === "add-to-cart") {
          this.store.addToCart(phoneId);
          this.renderBadges();
          this.renderCart();
        } else if (action === "wishlist") {
          this.store.toggleWishlist(phoneId);
          this.renderBadges();
          this.renderGrid();
        } else if (action === "compare") {
          this.store.toggleCompare(phoneId);
          this.renderBadges();
          this.renderGrid();
        } else if (action === "quickview") {
          this.openQuickView(phoneId);
        }
      });
    });
  }

  renderCart() {
    const listEl = document.getElementById("cart-items-list");
    const subtotalEl = document.getElementById("cart-subtotal");
    const discountRowEl = document.getElementById("cart-discount-row");
    const discountEl = document.getElementById("cart-discount");
    const tradeInRowEl = document.getElementById("cart-tradein-row");
    const tradeInEl = document.getElementById("cart-tradein");
    const totalEl = document.getElementById("cart-total");

    if (!listEl) return;

    if (this.store.cart.length === 0) {
      listEl.innerHTML = `
        <div class="rounded-2xl border border-dashed border-slate-200 p-8 text-center">
          <p class="text-sm font-semibold text-slate-700">Your shopping bag is empty</p>
          <p class="mt-1 text-xs text-slate-500">Pick a smartphone, choose RAM/storage & finish, and add it here.</p>
        </div>
      `;
    } else {
      listEl.innerHTML = this.store.cart
        .map((item) => {
          const linePrice = this.store.filters.emiMode
            ? this.store.formatEMI(item.unitPrice * item.qty)
            : this.store.formatINR(item.unitPrice * item.qty);

          return `
            <div class="flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-3">
              <img src="${item.image}" alt="${item.name}" class="h-16 w-14 rounded-xl bg-slate-50 object-contain p-1" />
              <div class="min-w-0 flex-1">
                <h4 class="truncate text-sm font-bold text-slate-900">${item.name}</h4>
                <div class="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                  <span class="inline-block h-2.5 w-2.5 rounded-full border border-slate-300" style="background-color:${item.colorHex};"></span>
                  <span>${item.colorName}</span>
                  <span>·</span>
                  <span>${item.ram} / ${item.storage}</span>
                </div>
                <div class="mt-2 flex items-center justify-between">
                  <div class="inline-flex items-center rounded-lg border border-slate-200">
                    <button type="button" data-cart-qty="-1" data-key="${item.key}" class="px-2 py-0.5 text-xs font-bold text-slate-700 hover:bg-slate-100">-</button>
                    <span class="px-2.5 text-xs font-semibold">${item.qty}</span>
                    <button type="button" data-cart-qty="1" data-key="${item.key}" class="px-2 py-0.5 text-xs font-bold text-slate-700 hover:bg-slate-100">+</button>
                  </div>
                  <span class="text-sm font-bold text-slate-900">${linePrice}</span>
                </div>
              </div>
              <button
                type="button"
                data-cart-remove="${item.key}"
                class="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                title="Remove item"
              >
                ✕
              </button>
            </div>
          `;
        })
        .join("");
    }

    listEl.querySelectorAll("[data-cart-qty]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-key");
        const delta = Number(btn.getAttribute("data-cart-qty"));
        this.store.updateCartQty(key, delta);
        this.renderBadges();
        this.renderCart();
      });
    });

    listEl.querySelectorAll("[data-cart-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.getAttribute("data-cart-remove");
        this.store.removeFromCart(key);
        this.renderBadges();
        this.renderCart();
      });
    });

    const { subtotal, promoDiscount, tradeIn, total } = this.store.getCartTotals();
    if (subtotalEl) subtotalEl.textContent = this.store.formatINR(subtotal);
    if (discountRowEl) discountRowEl.classList.toggle("hidden", promoDiscount <= 0);
    if (discountEl) discountEl.textContent = `-${this.store.formatINR(promoDiscount)}`;
    if (tradeInRowEl) tradeInRowEl.classList.toggle("hidden", tradeIn <= 0);
    if (tradeInEl) tradeInEl.textContent = `-${this.store.formatINR(tradeIn)}`;
    if (totalEl) {
      totalEl.textContent = this.store.filters.emiMode
        ? this.store.formatEMI(total)
        : this.store.formatINR(total);
    }
  }

  toggleCartDrawer(open) {
    const drawer = document.getElementById("cart-drawer");
    const backdrop = document.getElementById("cart-backdrop");
    if (!drawer || !backdrop) return;
    drawer.classList.toggle("translate-x-full", !open);
    backdrop.classList.toggle("hidden", !open);
  }

  openQuickView(phoneId) {
    const phone = this.store.phones.find((p) => p.id === phoneId);
    const modal = document.getElementById("quickview-modal");
    const body = document.getElementById("quickview-body");
    if (!phone || !modal || !body) return;

    const active = this.store.getActiveVariant(phone.id);
    const { color, variant } = active;

    body.innerHTML = `
      <div class="grid gap-6 md:grid-cols-2">
        <div class="flex items-center justify-center rounded-2xl bg-slate-50 p-6">
          <img src="${color.image || phone.image}" alt="${phone.name}" class="max-h-72 object-contain" />
        </div>
        <div class="flex flex-col justify-between">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-indigo-600">${phone.brand} · ${phone.category}</span>
            <h2 class="mt-1 text-2xl font-extrabold text-slate-900">${phone.name}</h2>
            <p class="mt-2 text-sm text-slate-600">${phone.description || ""}</p>

            <dl class="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 text-xs">
              <div><dt class="text-slate-400">Display</dt><dd class="font-semibold text-slate-800">${phone.display}</dd></div>
              <div><dt class="text-slate-400">Processor</dt><dd class="font-semibold text-slate-800">${phone.processor}</dd></div>
              <div><dt class="text-slate-400">Camera</dt><dd class="font-semibold text-slate-800">${phone.camera}</dd></div>
              <div><dt class="text-slate-400">Battery</dt><dd class="font-semibold text-slate-800">${phone.battery}</dd></div>
            </dl>

            <div class="mt-4">
              <p class="text-xs font-semibold text-slate-700">Selected Finish: ${color.name}</p>
              <p class="mt-0.5 text-xs font-semibold text-slate-700">Selected Variant: ${variant.ram} RAM / ${variant.storage} Storage</p>
            </div>
          </div>

          <div class="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
            <div>
              <span class="text-2xl font-extrabold text-slate-900">${this.store.formatINR(variant.price)}</span>
              <span class="ml-2 text-sm text-slate-400 line-through">${this.store.formatINR(variant.mrp)}</span>
            </div>
            <button
              type="button"
              id="qv-add-btn"
              class="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Add to Bag
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.remove("hidden");
    modal.classList.add("flex");

    document.getElementById("qv-add-btn")?.addEventListener("click", () => {
      this.store.addToCart(phone.id);
      this.renderBadges();
      this.renderCart();
      this.closeModal("quickview-modal");
    });
  }

  openCompareModal() {
    const modal = document.getElementById("compare-modal");
    const container = document.getElementById("compare-table-wrap");
    if (!modal || !container) return;

    const phones = this.store.phones.filter((p) => this.store.compareIds.includes(p.id));
    if (phones.length === 0) {
      container.innerHTML = `<p class="py-8 text-center text-sm text-slate-500">Select up to 3 phones using the "Compare" button on cards to view specs side by side.</p>`;
    } else {
      const rows = [
        { label: "Starting Price", fn: (p) => this.store.formatINR(p.variants[0].price) },
        { label: "RAM Options", fn: (p) => [...new Set(p.variants.map((v) => v.ram))].join(", ") },
        { label: "Storage Options", fn: (p) => [...new Set(p.variants.map((v) => v.storage))].join(", ") },
        { label: "Display", fn: (p) => p.display },
        { label: "Processor", fn: (p) => p.processor },
        { label: "Camera", fn: (p) => p.camera },
        { label: "Battery", fn: (p) => p.battery },
        { label: "Rating", fn: (p) => `★ ${p.rating} / 5` },
      ];

      container.innerHTML = `
        <table class="w-full border-collapse text-left text-sm">
          <thead>
            <tr class="border-b border-slate-200">
              <th class="p-3 font-semibold text-slate-500">Specification</th>
              ${phones
                .map(
                  (p) => `
                <th class="p-3">
                  <div class="flex flex-col items-center text-center">
                    <img src="${p.image}" alt="${p.name}" class="mb-2 h-20 object-contain" />
                    <span class="font-bold text-slate-900">${p.name}</span>
                  </div>
                </th>
              `
                )
                .join("")}
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (r) => `
              <tr class="border-b border-slate-100">
                <td class="p-3 font-semibold text-slate-600">${r.label}</td>
                ${phones.map((p) => `<td class="p-3 text-center text-slate-800">${r.fn(p)}</td>`).join("")}
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      `;
    }

    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }

  openWishlistModal() {
    const modal = document.getElementById("wishlist-modal");
    const container = document.getElementById("wishlist-items-wrap");
    if (!modal || !container) return;

    const wishedPhones = this.store.phones.filter((p) => this.store.wishlist.includes(p.id));
    if (wishedPhones.length === 0) {
      container.innerHTML = `<p class="py-8 text-center text-sm text-slate-500">Your wishlist is empty. Click the heart icon on any phone to save it.</p>`;
    } else {
      container.innerHTML = wishedPhones
        .map(
          (p) => `
          <div class="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-3">
            <div class="flex items-center gap-3">
              <img src="${p.image}" alt="${p.name}" class="h-14 w-12 object-contain" />
              <div>
                <p class="text-sm font-bold text-slate-900">${p.name}</p>
                <p class="text-xs text-slate-500">From ${this.store.formatINR(p.variants[0].price)}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                type="button"
                data-wish-add="${p.id}"
                class="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-600"
              >
                Add to Bag
              </button>
              <button
                type="button"
                data-wish-remove="${p.id}"
                class="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-600"
              >
                Remove
              </button>
            </div>
          </div>
        `
        )
        .join("");

      container.querySelectorAll("[data-wish-add]").forEach((btn) => {
        btn.addEventListener("click", () => {
          this.store.addToCart(btn.getAttribute("data-wish-add"));
          this.renderBadges();
          this.renderCart();
        });
      });

      container.querySelectorAll("[data-wish-remove]").forEach((btn) => {
        btn.addEventListener("click", () => {
          this.store.toggleWishlist(btn.getAttribute("data-wish-remove"));
          this.renderBadges();
          this.renderGrid();
          this.openWishlistModal();
        });
      });
    }

    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
}

/* ==========================================================================
   Bootstrap Application
   ========================================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  const catalogData = typeof PHONES_DATA !== "undefined" ? PHONES_DATA : [];
  const service = new PhoneCatalogService(catalogData);
  const phones = await service.fetchPhones();
  const store = new VoltMobileStore(phones);
  const ui = new VoltMobileUI(store);
  ui.init();
});