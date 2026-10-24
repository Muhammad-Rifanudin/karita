/**
 * KARITA ARTISAN DRY BAKERY - CORE APPLICATION LOGIC
 * Interactive Catalog, Filter, Search, Quick View Modal, Cart & Checkout
 */

document.addEventListener("DOMContentLoaded", () => {
  // Application State
  const state = {
    currentCategory: "all",
    searchQuery: "",
    sortBy: "recommended",
    activeModalProduct: null,
    modalQuantity: 1
  };

  // DOM Elements
  const productsGrid = document.getElementById("productsGrid");
  const searchInput = document.getElementById("searchInput");
  const searchClearBtn = document.getElementById("searchClearBtn");
  const sortSelect = document.getElementById("sortSelect");
  const categoryPills = document.querySelectorAll(".category-pill");
  const siteHeader = document.querySelector(".site-header");
  
  // Cart Drawer Elements
  const cartTriggerBtn = document.getElementById("cartTriggerBtn");
  const cartDrawerBackdrop = document.getElementById("cartDrawerBackdrop");
  const closeCartBtn = document.getElementById("closeCartBtn");
  const cartItemsContainer = document.getElementById("cartItemsContainer");
  const cartSubtotalEl = document.getElementById("cartSubtotal");
  const cartTotalEl = document.getElementById("cartTotal");
  const cartBadge = document.getElementById("cartBadge");
  const cartCountDrawer = document.getElementById("cartCountDrawer");
  const btnCheckoutWa = document.getElementById("btnCheckoutWa");
  const customerNameInput = document.getElementById("customerName");
  const customerPhoneInput = document.getElementById("customerPhone");
  const customerAddressInput = document.getElementById("customerAddress");
  const customerNotesInput = document.getElementById("customerNotes");

  // Quick View Modal Elements
  const quickViewModal = document.getElementById("quickViewModal");
  const closeModalBtn = document.getElementById("closeModalBtn");
  const modalImg = document.getElementById("modalImg");
  const modalCategory = document.getElementById("modalCategory");
  const modalTitle = document.getElementById("modalTitle");
  const modalCurrentPrice = document.getElementById("modalCurrentPrice");
  const modalOriginalPrice = document.getElementById("modalOriginalPrice");
  const modalDesc = document.getElementById("modalDesc");
  const modalIngredients = document.getElementById("modalIngredients");
  const modalWeight = document.getElementById("modalWeight");
  const modalShelfLife = document.getElementById("modalShelfLife");
  const modalQtyVal = document.getElementById("modalQtyVal");
  const btnModalQtyMinus = document.getElementById("btnModalQtyMinus");
  const btnModalQtyPlus = document.getElementById("btnModalQtyPlus");
  const btnModalAddToCart = document.getElementById("btnModalAddToCart");
  const btnModalWaDirect = document.getElementById("btnModalWaDirect");

  // Toast Container
  const toastContainer = document.getElementById("toastContainer");

  /* ==========================================================================
     1. INITIALIZATION & DATA RENDERING
     ========================================================================== */

  // Hitung jumlah produk per kategori di pill
  function updateCategoryCounts() {
    categoryPills.forEach(pill => {
      const cat = pill.dataset.category;
      let count = 0;
      if (cat === "all") {
        count = PRODUCTS_DATA.length;
      } else {
        count = PRODUCTS_DATA.filter(p => p.category === cat).length;
      }
      const countEl = pill.querySelector(".pill-count");
      if (countEl) countEl.textContent = count;
    });
  }

  // Filter & Urutkan Produk
  function getFilteredProducts() {
    let list = [...PRODUCTS_DATA];

    // Filter Kategori
    if (state.currentCategory !== "all") {
      list = list.filter(p => p.category === state.currentCategory);
    }

    // Filter Kata Kunci Pencarian
    if (state.searchQuery.trim() !== "") {
      const q = state.searchQuery.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        p.ingredients.some(ing => ing.toLowerCase().includes(q))
      );
    }

    // Sorting / Pengurutan
    switch (state.sortBy) {
      case "price-low":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        list.sort((a, b) => b.price - a.price);
        break;
      case "bestseller":
        list.sort((a, b) => b.soldCount - a.soldCount);
        break;
      case "recommended":
      default:
        // Featured products first, then highest rating
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.rating - a.rating);
        break;
    }

    return list;
  }

  // Render Card Produk ke Grid
  function renderProducts() {
    const products = getFilteredProducts();

    if (products.length === 0) {
      productsGrid.innerHTML = `
        <div class="no-results-box">
          <div class="no-results-icon">🍪</div>
          <h3 class="no-results-title">Roti Kering Tidak Ditemukan</h3>
          <p class="no-results-desc">Tidak ada produk yang cocok dengan pencarian "<strong>${escapeHtml(state.searchQuery)}</strong>". Silakan coba kata kunci lain.</p>
          <button class="btn-primary" id="btnResetSearch" style="padding: 10px 22px; font-size: 0.88rem;">
            Reset Pencarian
          </button>
        </div>
      `;

      const btnReset = document.getElementById("btnResetSearch");
      if (btnReset) {
        btnReset.addEventListener("click", () => {
          state.searchQuery = "";
          searchInput.value = "";
          searchClearBtn.classList.remove("active");
          state.currentCategory = "all";
          categoryPills.forEach(p => p.classList.toggle("active", p.dataset.category === "all"));
          renderProducts();
        });
      }
      return;
    }

    productsGrid.innerHTML = products.map(product => {
      const badgeHtml = product.badge ? `
        <div class="product-badge-corner badge-${product.badgeType || 'bestseller'}">
          ${product.badge}
        </div>
      ` : "";

      return `
        <article class="product-card" data-id="${product.id}">
          <div class="product-media-wrapper" onclick="window.KaritaApp.openQuickView('${product.id}')">
            ${badgeHtml}
            <img src="${product.image}" alt="${product.name}" class="product-card-img" loading="lazy" />
            <div class="product-quick-view-overlay">
              <span class="btn-quick-view">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                Lihat Detail
              </span>
            </div>
          </div>

          <div class="product-content">
            <div class="product-meta-row">
              <span class="product-category-tag">${product.categoryLabel}</span>
              <div class="product-rating">
                ★ <span>${product.rating.toFixed(1)}</span>
                <span class="review-count">(${product.reviews})</span>
              </div>
            </div>

            <h3 class="product-title" onclick="window.KaritaApp.openQuickView('${product.id}')">${product.name}</h3>
            <p class="product-desc">${product.shortDesc}</p>

            <div class="product-spec-chips">
              <span class="spec-chip">
                ⚖️ ${product.weight}
              </span>
              <span class="spec-chip">
                ⏳ Daya Simpan: ${product.shelfLife}
              </span>
              <span class="spec-chip">
                🧈 100% Wijsman
              </span>
            </div>

            <div class="product-price-row">
              <div class="price-container">
                <span class="original-price">${WhatsAppService.formatRupiah(product.originalPrice)}</span>
                <span class="current-price">${WhatsAppService.formatRupiah(product.price)}</span>
              </div>
              <span style="font-size: 0.74rem; background: #DCFCE7; color: #15803D; font-weight: 700; padding: 2px 8px; border-radius: 4px;">
                Hemat ${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </span>
            </div>

            <div class="product-card-actions">
              <button class="btn-add-cart" onclick="window.KaritaApp.addToCart('${product.id}')" title="Masukkan ke Keranjang">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                + Keranjang
              </button>
              
              <button class="btn-wa-direct" onclick="window.KaritaApp.orderNowWA('${product.id}')" title="Pesan Cepat via WhatsApp">
                <svg viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Pesan WA
              </button>
            </div>
          </div>
        </article>
      `;
    }).join("");
  }

  /* ==========================================================================
     2. EVENT LISTENERS: SEARCH, SORT & CATEGORIES
     ========================================================================== */

  // Search input live
  searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value;
    searchClearBtn.classList.toggle("active", state.searchQuery.length > 0);
    renderProducts();
  });

  searchClearBtn.addEventListener("click", () => {
    state.searchQuery = "";
    searchInput.value = "";
    searchClearBtn.classList.remove("active");
    renderProducts();
  });

  // Sort select
  sortSelect.addEventListener("change", (e) => {
    state.sortBy = e.target.value;
    renderProducts();
  });

  // Category filter pills
  categoryPills.forEach(pill => {
    pill.addEventListener("click", () => {
      categoryPills.forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      state.currentCategory = pill.dataset.category;
      renderProducts();
    });
  });

  /* ==========================================================================
     3. CART DRAWER & REACTIVE STATE
     ========================================================================== */

  function openCart() {
    cartDrawerBackdrop.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeCart() {
    cartDrawerBackdrop.classList.remove("open");
    document.body.style.overflow = "";
  }

  cartTriggerBtn.addEventListener("click", openCart);
  closeCartBtn.addEventListener("click", closeCart);

  cartDrawerBackdrop.addEventListener("click", (e) => {
    if (e.target === cartDrawerBackdrop) {
      closeCart();
    }
  });

  // Subscribe cart changes to update UI
  CartManager.subscribe(({ items, count, total }) => {
    // Update badge counter
    if (count > 0) {
      cartBadge.textContent = count;
      cartBadge.classList.add("has-items");
      cartCountDrawer.textContent = `${count} toples`;
    } else {
      cartBadge.textContent = "0";
      cartBadge.classList.remove("has-items");
      cartCountDrawer.textContent = "0 toples";
    }

    // Update totals
    const formattedTotal = WhatsAppService.formatRupiah(total);
    cartSubtotalEl.textContent = formattedTotal;
    cartTotalEl.textContent = formattedTotal;

    // Render cart items
    if (items.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="cart-empty-view">
          <div class="cart-empty-icon">🧺</div>
          <h4 class="cart-empty-title">Keranjang Belanja Kosong</h4>
          <p class="cart-empty-desc">Belum ada roti kering yang dipilih. Silakan pilih menu favorit Anda di katalog.</p>
          <button class="btn-primary" onclick="document.getElementById('closeCartBtn').click();" style="padding: 10px 24px; font-size: 0.88rem; margin: 0 auto;">
            Jelajahi Menu Sekarang
          </button>
        </div>
      `;
      btnCheckoutWa.disabled = true;
      btnCheckoutWa.style.opacity = "0.6";
      btnCheckoutWa.style.cursor = "not-allowed";
    } else {
      btnCheckoutWa.disabled = false;
      btnCheckoutWa.style.opacity = "1";
      btnCheckoutWa.style.cursor = "pointer";

      cartItemsContainer.innerHTML = items.map(item => `
        <div class="cart-item-row" data-id="${item.id}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-thumb" />
          <div class="cart-item-info">
            <h5 class="cart-item-name">${item.name}</h5>
            <div class="cart-item-meta">${item.categoryLabel} • ${item.weight}</div>
            <div class="cart-item-price">${WhatsAppService.formatRupiah(item.price)}</div>
          </div>
          <div class="cart-item-actions">
            <div class="qty-control-group">
              <button class="btn-qty" onclick="window.KaritaApp.changeItemQty('${item.id}', ${item.quantity - 1})">-</button>
              <span class="qty-value">${item.quantity}</span>
              <button class="btn-qty" onclick="window.KaritaApp.changeItemQty('${item.id}', ${item.quantity + 1})">+</button>
            </div>
            <button class="btn-remove-item" onclick="window.KaritaApp.removeItemFromCart('${item.id}')">
              Hapus
            </button>
          </div>
        </div>
      `).join("");
    }
  });

  // Checkout via WhatsApp Action
  btnCheckoutWa.addEventListener("click", () => {
    const items = CartManager.getItems();
    if (items.length === 0) {
      showToast("Keranjang Anda masih kosong. Silakan pilih roti terlebih dahulu.", "info");
      return;
    }

    const customerData = {
      name: customerNameInput ? customerNameInput.value : "",
      phone: customerPhoneInput ? customerPhoneInput.value : "",
      address: customerAddressInput ? customerAddressInput.value : "",
      notes: customerNotesInput ? customerNotesInput.value : ""
    };

    WhatsAppService.checkoutCart(items, customerData);
  });

  /* ==========================================================================
     4. QUICK VIEW MODAL
     ========================================================================== */

  function openQuickView(productId) {
    const product = PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    state.activeModalProduct = product;
    state.modalQuantity = 1;

    modalImg.src = product.image;
    modalImg.alt = product.name;
    modalCategory.textContent = product.categoryLabel;
    modalTitle.textContent = product.name;
    modalCurrentPrice.textContent = WhatsAppService.formatRupiah(product.price);
    modalOriginalPrice.textContent = WhatsAppService.formatRupiah(product.originalPrice);
    modalDesc.textContent = product.fullDesc;
    modalWeight.textContent = product.weight;
    modalShelfLife.textContent = product.shelfLife;
    modalQtyVal.textContent = state.modalQuantity;

    // Render ingredients pills
    modalIngredients.innerHTML = product.ingredients.map(ing => `
      <span class="modal-ing-pill">${ing}</span>
    `).join("");

    quickViewModal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeQuickView() {
    quickViewModal.classList.remove("open");
    document.body.style.overflow = "";
    state.activeModalProduct = null;
  }

  closeModalBtn.addEventListener("click", closeQuickView);
  quickViewModal.addEventListener("click", (e) => {
    if (e.target === quickViewModal) {
      closeQuickView();
    }
  });

  // Modal Qty Buttons
  btnModalQtyMinus.addEventListener("click", () => {
    if (state.modalQuantity > 1) {
      state.modalQuantity--;
      modalQtyVal.textContent = state.modalQuantity;
    }
  });

  btnModalQtyPlus.addEventListener("click", () => {
    state.modalQuantity++;
    modalQtyVal.textContent = state.modalQuantity;
  });

  // Modal Add To Cart
  btnModalAddToCart.addEventListener("click", () => {
    if (state.activeModalProduct) {
      CartManager.addItem(state.activeModalProduct, state.modalQuantity);
      showToast(`${state.modalQuantity}x "${state.activeModalProduct.name}" berhasil masuk ke keranjang!`, "success");
      closeQuickView();
    }
  });

  // Modal Direct WA
  btnModalWaDirect.addEventListener("click", () => {
    if (state.activeModalProduct) {
      WhatsAppService.orderSingleProduct(state.activeModalProduct, state.modalQuantity);
    }
  });

  // Escape key closes modals
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeQuickView();
      closeCart();
    }
  });

  /* ==========================================================================
     5. TOAST NOTIFICATION SYSTEM
     ========================================================================== */

  function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast-message ${type === "success" ? "toast-success" : ""}`;
    toast.innerHTML = `
      <span>${type === "success" ? "✓" : "ℹ"}</span>
      <span>${escapeHtml(message)}</span>
    `;

    toastContainer.appendChild(toast);

    // Trigger transition
    setTimeout(() => {
      toast.classList.add("show");
    }, 10);

    // Auto dismiss after 3.5s
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3500);
  }

  /* ==========================================================================
     6. FAQ ACCORDION
     ========================================================================== */

  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const btn = item.querySelector(".faq-question-btn");
    const pane = item.querySelector(".faq-answer-pane");

    btn.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Close all others
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove("active");
          const otherPane = other.querySelector(".faq-answer-pane");
          if (otherPane) otherPane.style.maxHeight = null;
        }
      });

      // Toggle current
      if (isActive) {
        item.classList.remove("active");
        pane.style.maxHeight = null;
      } else {
        item.classList.add("active");
        pane.style.maxHeight = pane.scrollHeight + "px";
      }
    });
  });

  /* ==========================================================================
     7. STICKY HEADER SCROLL EFFECT
     ========================================================================== */

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add("scrolled");
    } else {
      siteHeader.classList.remove("scrolled");
    }
  }, { passive: true });

  /* ==========================================================================
     8. GLOBAL EXPORTS FOR INLINE ONCLICK HANDLERS
     ========================================================================== */

  window.KaritaApp = {
    openQuickView,
    addToCart(productId) {
      const product = PRODUCTS_DATA.find(p => p.id === productId);
      if (product) {
        CartManager.addItem(product, 1);
        showToast(`"${product.name}" ditambahkan ke keranjang!`, "success");
      }
    },
    orderNowWA(productId) {
      const product = PRODUCTS_DATA.find(p => p.id === productId);
      if (product) {
        WhatsAppService.orderSingleProduct(product, 1);
      }
    },
    changeItemQty(productId, newQty) {
      CartManager.updateQuantity(productId, newQty);
    },
    removeItemFromCart(productId) {
      CartManager.removeItem(productId);
      showToast("Item berhasil dihapus dari keranjang.", "info");
    },
    showToast
  };

  // Helper Sanitasi HTML sederhana
  function escapeHtml(text) {
    if (!text) return "";
    return text.replace(/[&<>"']/g, function (m) {
      switch (m) {
        case '&': return '&amp;';
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#039;';
        default: return m;
      }
    });
  }

  // Trigger initial render & cart badge sync
  updateCategoryCounts();
  renderProducts();
  CartManager.notifyListeners();
});
