/**
 * KARITA ARTISAN DRY BAKERY - WHATSAPP ORDER INTEGRATION
 * Target WhatsApp: 08771188500 (Format Internasional: 628771188500)
 */

const WhatsAppService = {
  phoneRaw: "08771188500",
  phoneFormatted: "628771188500",

  /**
   * Helper format angka Rupiah
   */
  formatRupiah(amount) {
    return "Rp " + Number(amount).toLocaleString("id-ID");
  },

  /**
   * Pemesanan Instan 1 Produk (Langsung dari Card / Modal)
   */
  orderSingleProduct(product, quantity = 1, notes = "") {
    const total = product.price * quantity;
    let message = `Halo Admin Karita Bakery,\n`;
    message += `Saya tertarik untuk memesan roti kering berikut dari e-katalog:\n\n`;
    message += `📌 *PESANAN SINGKAT*\n`;
    message += `• *Produk:* ${product.name}\n`;
    message += `• *Kategori:* ${product.categoryLabel}\n`;
    message += `• *Jumlah:* ${quantity} toples (${product.weight}/toples)\n`;
    message += `• *Harga Satuan:* ${this.formatRupiah(product.price)}\n`;
    message += `• *Total Estimasi:* *${this.formatRupiah(total)}*\n\n`;

    if (notes && notes.trim() !== "") {
      message += `📝 *Catatan Khusus:*\n${notes.trim()}\n\n`;
    }

    message += `Mohon info ketersediaan stok dan perkiraan ongkir ke alamat saya ya min. Terima kasih! 🙏`;

    this.sendToWhatsApp(message);
  },

  /**
   * Pemesanan Keranjang Belanja Lengkap (Multi-Item)
   */
  checkoutCart(cartItems, customer = {}) {
    if (!cartItems || cartItems.length === 0) {
      alert("Keranjang belanja Anda masih kosong. Silakan pilih roti kering favorit Anda terlebih dahulu.");
      return;
    }

    let totalItems = 0;
    let totalPrice = 0;

    let message = `Halo Admin Karita Bakery,\n`;
    message += `Saya ingin melakukan pemesanan roti kering melalui web e-katalog Karita:\n\n`;
    message += `🛒 *DETAIL DAFTAR PESANAN*\n`;
    message += `═══════════════════════════\n`;

    cartItems.forEach((item, index) => {
      const subtotal = item.price * item.quantity;
      totalItems += item.quantity;
      totalPrice += subtotal;

      message += `${index + 1}. *${item.name}*\n`;
      message += `   ${item.quantity} x ${this.formatRupiah(item.price)} (${item.weight}) = *${this.formatRupiah(subtotal)}*\n`;
    });

    message += `═══════════════════════════\n`;
    message += `📦 *Total Item:* ${totalItems} toples\n`;
    message += `💰 *Subtotal Pesanan:* *${this.formatRupiah(totalPrice)}*\n`;
    message += `✨ *Packing:* Box Kardus + Double Bubble Wrap (Gratis)\n\n`;

    message += `📋 *DATA PENERIMA & PENGIRIMAN*\n`;
    message += `• *Nama Pemesan:* ${customer.name && customer.name.trim() ? customer.name.trim() : "(Belum diisi)"}\n`;
    message += `• *Nomor Kontak:* ${customer.phone && customer.phone.trim() ? customer.phone.trim() : "(Sesuai no WhatsApp ini)"}\n`;
    message += `• *Alamat Pengiriman:* ${customer.address && customer.address.trim() ? customer.address.trim() : "(Akan dikirimkan via chat ini)"}\n`;
    
    if (customer.notes && customer.notes.trim()) {
      message += `• *Catatan Tambahan:* ${customer.notes.trim()}\n`;
    }

    message += `\nMohon bantu konfirmasi total biaya pengiriman serta nomor rekening pembayarannya ya min. Terima kasih! 😊🥖`;

    this.sendToWhatsApp(message);
  },

  /**
   * Tombol Tanya CS / Bantuan Cepat
   */
  sendGeneralInquiry(customTopic = "") {
    let message = `Halo Admin Karita Bakery,\n`;
    if (customTopic) {
      message += `Saya ingin konsultasi mengenai: *${customTopic}*.\n`;
    } else {
      message += `Saya ingin bertanya seputar rekomendasi roti kering, ketersediaan hampers, dan pengiriman ke kota saya.\n`;
    }
    message += `Boleh minta informasinya? Terima kasih.`;

    this.sendToWhatsApp(message);
  },

  /**
   * Eksekusi redirect ke URL WhatsApp
   */
  sendToWhatsApp(text) {
    const encodedText = encodeURIComponent(text);
    const waUrl = `https://wa.me/${this.phoneFormatted}?text=${encodedText}`;
    
    // Buka di tab baru dengan aman
    window.open(waUrl, "_blank", "noopener,noreferrer");
  }
};
