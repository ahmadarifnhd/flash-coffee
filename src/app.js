document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "Coffee Arabika Gayo", img: "arabika_gayo.jpg", price: 30000 },
      {
        id: 2,
        name: "Coffee Arabika Kerinci",
        img: "arabika_kerinci.jpg",
        price: 35000,
      },
      {
        id: 3,
        name: "Coffee Arabika Papua Wamena",
        img: "arabika_papua_wamena.jpg",
        price: 40500,
      },
      { id: 4, name: "Coffee Arabika Temanggung", img: "arabika_temanggung.jpg", price: 35000 },
      {
        id: 5,
        name: "Coffee Arabika Bali Kintamani",
        img: "arabika_bali_kintamani.jpg",
        price: 40000,
      },
      {
        id: 6,
        name: "Coffee Arabika Toraja",
        img: "arabika_toraja.jpg",
        price: 47000,
      },

      {
        id: 7,
        name: "Coffee Arabika Flores Bajawa",
        img: "arabika_flores_bajawa.jpg",
        price: 30000,
      },

      {
        id: 8,
        name: "Coffee Robusta Gayo ",
        img: "robusta gayo.jpg",
        price: 30000,
      },

      {
        id: 9,
        name: "Coffee Robusta Dampit",
        img: "robusta dampit.jpg",
        price: 40000,
      },

      {
        id: 10,
        name: "Coffee Robusta Sidikalang",
        img: "robusta sidikalang.jpg",
        price: 45000,
      },

      {
        id: 11,
        name: "Coffee Robusta Toraja",
        img: "robusta toraja.jpg",
        price: 30000,
      },

    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // cek apakah ada item di keranjang
      const cartItem = this.items.find((item) => item.id === newItem.id);

      // jika belum ada / kosong
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        // jika barang sudah ada, cek apakah barang beda atau sama dengan yang ada
        this.items = this.items.map((item) => {
          // jika barang berbeda
          if (item.id !== newItem.id) {
            return item;
          } else {
            // jika barang sudah ada, tambah quantiti dan total
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },

    remove(id) {
      // ambil item yang mau diremove berdasarkan id nya
      const cartItem = this.items.find((item) => item.id === id);

      // jika item lebih dari 1
      if (cartItem.quantity > 1) {
        // telusuri 1 1
        this.items = this.items.map((item) => {
          // jika bukan barang yang di klik
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        // jika barangnya sisa 1
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

// Form Validation
const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.disabled = true;

const form = document.querySelector("#checkoutForm");

form.addEventListener("keyup", function () {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value.length !== 0) {
      checkoutButton.classList.remove("disabled");
      checkoutButton.classList.add("disabled");
    } else {
      return false;
    }
  }
  checkoutButton.disabled = false;
  checkoutButton.classList.remove("disabled");
});

// Kirim data ketika tombol checkout diklik
checkoutButton.addEventListener("click", async function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  // const message = formatMessage(objData);
  // window.open('http://wa.me/623?text=' + encodeURIComponent(message));
  // harus nomer WA ASLI

  // minta transaction token menggunakan ajax / fecth
  try {
    // e.preventDefault;
    const response = await fetch("php/placeOrder.php", {
      method: "POST",
      body: data,
    });
    const token = await response.text();
    // console.log(token);
    window.snap.pay(token);
  } catch (err) {
    console.log(err.message);
  }
});

// format pesan whatsapp
const formatMessage = (obj) => {
  return `Data Customer
    Nama : ${obj.name}
    Email : ${obj.email}
    No HP : ${obj.phone}
    Data Pesanan
${JSON.parse(obj.items).map(
  (item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`
)}
TOTAL : ${rupiah(obj.total)}
Terima kasih.`;
};

// Conversi ke rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
