const app_version = "1.0.20";

const savedVersion = localStorage.getItem("appversion");
if (savedVersion !== app_version) {
  localStorage.clear();
  localStorage.setItem("appversion", app_version);
  console.log("Data updated to version", app_version);
}

// =========== admin =====================
if (!localStorage.getItem("admin")) {
  const admin = { username: "admin", password: "admin" };
  localStorage.setItem("admin", JSON.stringify(admin));
}

// ================= USERS =================
if (!localStorage.getItem("users")) {
  const users = [
    {
      username: "user1",
      password: "123",
      locked: false,
      name: "Luan Vo",
      email: "luanvo@gmail.com",
      phoneNumber: "099912322",
      gender: "male",
      date: "2006-03-19",
      address: "Saigon University, District 5",
    },
    {
      username: "user2",
      password: "123",
      locked: true,
      name: "Vo Luan",
      email: "user2@gmail.com",
      phoneNumber: "0987654321",
      gender: "male",
      date: "2006-04-16",
      address: "Saigon University, Campus 2",
    },
  ];
  localStorage.setItem("users", JSON.stringify(users));
  console.log("User data created");
}

// ================= PRODUCT TYPES =================
if (!localStorage.getItem("productTypes")) {
  const productTypes = [
    { code: "T001", name: "Women", desc: "Casual and sport cotton shirts" },
    { code: "T002", name: "Men", desc: "Denim pants for men and women" },
    { code: "T003", name: "Accessories", desc: "Caps, belts, socks, bags..." },
    { code: "T004", name: "collection", desc: "New fashion collection" },
  ];
  localStorage.setItem("productTypes", JSON.stringify(productTypes));
}

if (!localStorage.getItem("category")) {
  const category = [
    { type: "Women", cate: "Dresses" },
    { type: "Women", cate: "Tops-Blouses" },
    { type: "Women", cate: "Bottoms" },
    { type: "Women", cate: "Outerwear" },
    { type: "Women", cate: "Activewear" },
    { type: "Women", cate: "Knitwear" },
    { type: "Men", cate: "T-shirts-polos" },
    { type: "Men", cate: "Shirts" },
    { type: "Men", cate: "Pants-Trousers" },
    { type: "Men", cate: "Shorts" },
    { type: "Men", cate: "Outerwear" },
    { type: "Men", cate: "Sweaters " },
    { type: "Men", cate: "Activewear " },
    { type: "Men", cate: "Outerwear" },
    { type: "Accessories", cate: "Accessories" },
    { type: "Accessories", cate: "Bags-Purses" },
    { type: "Accessories", cate: "Jewelry " },
    { type: "Accessories", cate: "Scarves-Shawls " },
    { type: "Accessories", cate: "Hair Accessories " },
    { type: "Accessories", cate: "Watches " },
    { type: "Accessories", cate: "Hats-Caps  " },
    { type: "Accessories", cate: "Belts" },
    { type: "Collection", cate: "Summer-Autumn" },
    { type: "Collection", cate: "Spring-Winter" },
  ];
  localStorage.setItem("category", JSON.stringify(category));
}

// ================= PRODUCTS =================
if (!localStorage.getItem("products")) {
  const products = [
    {
      id: "P001",
      name: "Blue Cotton T-shirt",
      type: "Men",
      cate: "T-shirts-polos",
      collection: "none",
      costPrice: 200000,
      profitPercent: 25,
      price: 250000,
      color: ["blue", "black"],
      productDesc:
        "Soft cotton T-shirt suitable for daily wear or light workouts.",
      images: [
        "./assets/20240827_99qstqYiE1.png",
        "./assets/20240827_99qstqYiE2.png",
        "./assets/20240827_99qstqYiE3.png",
      ],
      sizes: ["M", "L", "XL"],
      quantity: 10,
      hidden: false,
    },
    {
      id: "P002",
      name: "White Cotton T-shirt",
      type: "Men",
      cate: "T-shirts-polos",
      costPrice: 180000,
      profitPercent: 30,
      price: 234000,
      color: ["white", "black"],
      productDesc: "Comfortable white T-shirt made from premium cotton fabric.",
      images: [
        "./assets/blank-image.png",
        "./assets/white-shirt-side.png",
        "./assets/white-shirt-back.png",
      ],
      sizes: ["M", "L", "XL"],
      quantity: 10,
      hidden: false,
    },
    {
      id: "P003",
      name: "Blue Denim Jeans",
      type: "Women",
      cate: "Dresses",
      costPrice: 280000,
      profitPercent: 25,
      price: 350000,
      color: ["blue", "white"],
      productDesc: "Durable and stylish blue jeans for everyday use.",
      images: [
        "./assets/ao1.avif",
        "./assets/jeans-back.avif",
        "./assets/jeans-detail.avif",
      ],
      sizes: ["M", "L", "XL"],
      quantity: 8,
      hidden: false,
    },
    {
      id: "P004",
      name: "Men’s Baseball Cap",
      type: "Accessories",
      cate: "Belts",
      costPrice: 100000,
      profitPercent: 50,
      price: 150000,
      color: ["blue"],
      productDesc: "Classic black baseball cap suitable for casual outfits.",
      images: [
        "./assets/blank-image.png",
        "./assets/cap-detail.png",
        "./assets/cap-top.png",
      ],
      sizes: ["M", "L"],
      quantity: 11,
      hidden: false,
    },
  ];

  localStorage.setItem("products", JSON.stringify(products));
  console.log(
    "Product data with multiple images and sizes has been initialized."
  );
}

// ================= IMPORT ORDERS =================
if (!localStorage.getItem("imports")) {
  const imports = [
    {
      id: "I001",
      productId: "P001",
      productName: "Blue Cotton T-shirt",
      date: "2025-10-20",
      quantity: 10,
      price: 200000,
      total: 2000000,
      status: "Completed",
    },
    {
      id: "I002",
      productId: "P003",
      productName: "Blue Denim Jeans",
      date: "2025-10-21",
      quantity: 5,
      price: 280000,
      total: 1400000,
      status: "Pending",
    },
    {
      id: "I003",
      productId: "P004",
      productName: "Men’s Baseball Cap",
      date: "2025-10-22",
      quantity: 15,
      price: 100000,
      total: 1500000,
      status: "Pending",
    },
  ];
  localStorage.setItem("imports", JSON.stringify(imports));
}

// ================= CUSTOMER ORDERS =================
if (!localStorage.getItem("orders")) {
  const orders = [
    {
      id: "O005",
      customer: "Võ Nhựt Luân",
      username: "user1",
      customerPhone: "0395166079",
      customerAddress: "dhsg quan 5",
      date: "2025-11-02",
      items: [
        {
          productId: "P001",
          name: "Blue Cotton T-shirt",
          type: "Men",
          color: "blue",
          size: "M",
          quantity: 1,
          image: "./assets/20240827_99qstqYiE1.png",
          price: 250000,
        },
      ],
      total: 250000,
      paymentMethod: "COD",
      status: "New",
    },
  ];
  localStorage.setItem("orders", JSON.stringify(orders));
  console.log("Sample orders created (English version)");
}

// ================= SAMPLE CART =================
if (!localStorage.getItem("cart")) {
  const sampleCart = [
    {
      id: "P003",
      user: user1,
      name: "Blue Denim Jeans",
      type: "Jeans",
      price: 350000,
      productDesc: "Durable and stylish blue jeans for everyday use.",
      quantity: 1,
      color: "blue",
      size: "M",
      gender: "men",
      image: "./assets/ao1.avif",
    },
  ];
  localStorage.setItem("cart", JSON.stringify(sampleCart));
  console.log("Sample cart created");
}
