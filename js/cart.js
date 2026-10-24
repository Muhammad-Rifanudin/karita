/**
 * KARITA ARTISAN DRY BAKERY - SHOPPING CART MANAGER
 * LocalStorage state, reactive badge counters, and order calculation
 */

const CartManager = {
  STORAGE_KEY: "karita_dry_bakery_cart",
  listeners: [],

  /**
   * Mengambil semua item dalam keranjang
   */
  getItems() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Gagal membaca keranjang dari storage:", e);
      return [];
    }
  },

  /**
   * Menyimpan item ke localStorage dan memicu update subscriber
   */
  saveItems(items) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
      this.notifyListeners();
    } catch (e) {
      console.error("Gagal menyimpan keranjang ke storage:", e);
    }
  },

  /**
   * Menambahkan item ke keranjang
   */
  addItem(product, quantity = 1) {
    const items = this.getItems();
    const existingIndex = items.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
      items[existingIndex].quantity += Number(quantity);
    } else {
      items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        weight: product.weight,
        image: product.image,
        categoryLabel: product.categoryLabel,
        quantity: Number(quantity)
      });
    }

    this.saveItems(items);
  },

  /**
   * Memperbarui kuantitas produk tertentu
   */
  updateQuantity(productId, newQty) {
    let items = this.getItems();
    const qty = Number(newQty);

    if (qty <= 0) {
      items = items.filter(item => item.id !== productId);
    } else {
      const item = items.find(i => i.id === productId);
      if (item) {
        item.quantity = qty;
      }
    }

    this.saveItems(items);
  },

  /**
   * Menghapus 1 jenis produk dari keranjang
   */
  removeItem(productId) {
    const items = this.getItems().filter(item => item.id !== productId);
    this.saveItems(items);
  },

  /**
   * Mengosongkan keranjang
   */
  clearCart() {
    this.saveItems([]);
  },

  /**
   * Menghitung total jumlah toples
   */
  getTotalCount() {
    return this.getItems().reduce((acc, item) => acc + item.quantity, 0);
  },

  /**
   * Menghitung total nominal belanja
   */
  getTotalPrice() {
    return this.getItems().reduce((acc, item) => acc + (item.price * item.quantity), 0);
  },

  /**
   * Subscribe perubahan keranjang
   */
  subscribe(callback) {
    if (typeof callback === "function") {
      this.listeners.push(callback);
    }
  },

  /**
   * Trigger update ke semua komponen
   */
  notifyListeners() {
    const items = this.getItems();
    const count = this.getTotalCount();
    const total = this.getTotalPrice();

    this.listeners.forEach(cb => {
      try {
        cb({ items, count, total });
      } catch (err) {
        console.error("Cart listener error:", err);
      }
    });
  }
};
