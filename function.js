// Menunggu hingga seluruh konten HTML dimuat sebelum menjalankan skrip
document.addEventListener('DOMContentLoaded', () => {

    // 1. STRUKTUR DATA & INISIALISASI
    const produk = [
        { id: 1, nama: "Suntik Sosmed (Follower/Like)", harga: 145 },
        { id: 2, nama: "Script Assain v2", harga: 25000 },
        { id: 3, nama: "Reseller Script Assain", harga: 35000 }
    ];

    // Coba ambil data keranjang dari localStorage, jika tidak ada, buat array kosong
    let keranjang = JSON.parse(localStorage.getItem('keranjangLanaVyn')) || [];

    const keranjangContainer = document.getElementById('keranjang-items');
    const totalHargaEl = document.getElementById('total-harga');
    const tambahButtons = document.querySelectorAll('.tambah-btn');
    const checkoutButton = document.getElementById('checkout-btn');
    const whatsappNomor = '6285971105030';

    // 2. FUNGSI-FUNGSI UTAMA

    /**
     * Mengupdate tampilan keranjang di HTML dan menghitung ulang total harga.
     */
    const updateTampilanKeranjang = () => {
        // Kosongkan kontainer keranjang
        keranjangContainer.innerHTML = '';
        let totalHarga = 0;

        if (keranjang.length === 0) {
            keranjangContainer.innerHTML = '<p class="text-gray-400">Keranjang masih kosong.</p>';
        } else {
            keranjang.forEach(item => {
                const produkInfo = produk.find(p => p.id === item.id);
                const subtotal = item.jumlah * produkInfo.harga;
                totalHarga += subtotal;

                // Buat elemen HTML untuk setiap item di keranjang
                const itemElement = document.createElement('div');
                itemElement.className = 'flex justify-between items-center bg-gray-700 p-3 rounded-md';
                itemElement.innerHTML = `
                    <div>
                        <p class="font-semibold text-white">${produkInfo.nama}</p>
                        <p class="text-sm text-gray-300">Jumlah: ${item.jumlah.toLocaleString('id-ID')}</p>
                    </div>
                    <p class="font-semibold text-red-400">Rp${subtotal.toLocaleString('id-ID')}</p>
                `;
                keranjangContainer.appendChild(itemElement);
            });
        }

        // Tampilkan total harga dengan format Rupiah
        totalHargaEl.textContent = `Rp${totalHarga.toLocaleString('id-ID')}`;
        
        // Simpan state keranjang ke localStorage
        localStorage.setItem('keranjangLanaVyn', JSON.stringify(keranjang));
    };

    /**
     * Menambahkan produk ke dalam array keranjang.
     * @param {number} produkId - ID produk yang akan ditambahkan.
     * @param {number} jumlah - Jumlah produk yang akan ditambahkan.
     */
    const tambahKeKeranjang = (produkId, jumlah) => {
        // Validasi input
        if (!jumlah || jumlah <= 0) {
            alert("Harap masukkan jumlah yang valid (lebih dari 0).");
            return;
        }

        const itemDiKeranjang = keranjang.find(item => item.id === produkId);

        if (itemDiKeranjang) {
            // Jika produk sudah ada, tambahkan jumlahnya
            itemDiKeranjang.jumlah += jumlah;
        } else {
            // Jika produk baru, tambahkan ke keranjang
            keranjang.push({ id: produkId, jumlah: jumlah });
        }

        // Reset input field setelah ditambahkan
        document.getElementById(`jumlah-${produkId}`).value = '';
        
        console.log("Keranjang saat ini:", keranjang); // Untuk debugging
        updateTampilanKeranjang();
    };

    /**
     * Membuat pesan WhatsApp dan mengarahkan pengguna.
     */
    const checkoutViaWhatsApp = () => {
        if (keranjang.length === 0) {
            alert("Keranjang Anda kosong! Silakan tambahkan produk terlebih dahulu.");
            return;
        }

        let pesan = "Halo *LanaVyn Official*,\nSaya tertarik untuk memesan produk berikut:\n\n";
        let totalHarga = 0;

        keranjang.forEach(item => {
            const produkInfo = produk.find(p => p.id === item.id);
            const subtotal = item.jumlah * produkInfo.harga;
            totalHarga += subtotal;
            pesan += `*Produk*: ${produkInfo.nama}\n`;
            pesan += `*Jumlah*: ${item.jumlah.toLocaleString('id-ID')}\n`;
            pesan += `*Subtotal*: Rp${subtotal.toLocaleString('id-ID')}\n\n`;
        });

        pesan += `--------------------------\n`;
        pesan += `*Total Harga: Rp${totalHarga.toLocaleString('id-ID')}*\n\n`;
        pesan += `Mohon informasinya untuk langkah selanjutnya. Terima kasih!`;

        const encodedPesan = encodeURIComponent(pesan);
        const urlWhatsApp = `https://wa.me/${whatsappNomor}?text=${encodedPesan}`;

        // Buka tab baru untuk WhatsApp
        window.open(urlWhatsApp, '_blank');
    };

    // 3. EVENT LISTENERS

    // Tambahkan event listener untuk setiap tombol "Tambah ke Keranjang"
    tambahButtons.forEach(button => {
        button.addEventListener('click', () => {
            const produkId = parseInt(button.getAttribute('data-id'));
            const inputJumlahEl = document.getElementById(`jumlah-${produkId}`);
            const jumlah = parseInt(inputJumlahEl.value);
            
            tambahKeKeranjang(produkId, jumlah);
        });
    });

    // Tambahkan event listener untuk tombol checkout
    checkoutButton.addEventListener('click', checkoutViaWhatsApp);

    // 4. PEMANGGILAN AWAL
    // Update tampilan keranjang saat halaman pertama kali dimuat (untuk memuat data dari localStorage)
    updateTampilanKeranjang();

});