const app_version = "1.0.1";

const savedVersion = localStorage.getItem("appversion");
if (savedVersion !== app_version) {
  localStorage.clear();
  localStorage.setItem("appversion", app_version);
  console.log("Data updated to version", app_version);
}

// ================= USERS =================
if (!localStorage.getItem("users")) {
  const users = [
    {
      username: "user1",
      password: "123",
      locked: true,
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
    { code: "T001", name: "T-shirt", desc: "Casual and sport cotton shirts" },
    { code: "T002", name: "Jeans", desc: "Denim pants for men and women" },
    { code: "T003", name: "Accessories", desc: "Caps, belts, socks, bags..." },
  ];
  localStorage.setItem("productTypes", JSON.stringify(productTypes));
}

// ================= PRODUCTS =================
if (!localStorage.getItem("products")) {
  const products = [
    {
      id: "P001",
      name: "Blue Cotton T-shirt",
      type: "T-shirt",
      costPrice: 200000,
      profitPercent: 25,
      price: 250000,
      color: "blue",
      gender: "men",
      size: "L",
      productDesc:
        "Soft cotton T-shirt suitable for daily wear or light workouts.",
      quantity: 10,
      image: "./assets/20240827_99qstqYiE1.png",
    },
    {
      id: "P002",
      name: "White Cotton T-shirt",
      type: "T-shirt",
      costPrice: 180000,
      profitPercent: 30,
      price: 234000,
      color: "white",
      gender: "women",
      size: "XL",
      productDesc: "Comfortable white T-shirt made from premium cotton fabric.",
      quantity: 5,
      image: "./assets/blank-image.png",
    },
    {
      id: "P003",
      name: "Blue Denim Jeans",
      type: "Jeans",
      costPrice: 280000,
      profitPercent: 25,
      price: 350000,
      color: "blue",
      gender: "men",
      size: "L",
      productDesc: "Durable and stylish blue jeans for everyday use.",
      quantity: 8,
      image: "./assets/ao1.avif",
    },
    {
      id: "P004",
      name: "Men’s Baseball Cap",
      type: "Accessories",
      costPrice: 100000,
      profitPercent: 50,
      price: 150000,
      color: "black",
      gender: "unisex",
      size: "M",
      productDesc: "Classic black baseball cap suitable for casual outfits.",
      quantity: 20,
      image: "./assets/blank-image.png",
    },
  ];
  localStorage.setItem("products", JSON.stringify(products));
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
      id: "O001",
      customer: "Luan Vo",
      username: "user1",
      customerPhone: "092841242",
      customerAddress: "Saigon University, District 5",
      date: "2025-10-23",
      items: [
        {
          productId: "P001",
          name: "Blue Cotton T-shirt",
          quantity: 2,
          price: 250000,
        },
        {
          productId: "P004",
          name: "Men’s Baseball Cap",
          quantity: 1,
          price: 150000,
        },
      ],
      total: 650000,
      status: "New",
    },
    {
      id: "O002",
      customer: "Vo Luan",
      username: "user2",
      customerPhone: "0193749823",
      customerAddress: "Saigon University, District 5",
      date: "2025-10-22",
      items: [
        {
          productId: "P003",
          name: "Blue Denim Jeans",
          quantity: 1,
          price: 350000,
        },
      ],
      total: 350000,
      status: "Shipping",
    },
    {
      id: "O003",
      customer: "Luan Vo",
      username: "user1",
      customerPhone: "09849274",
      customerAddress: "Saigon University, District 3",
      date: "2025-10-21",
      items: [
        {
          productId: "P002",
          name: "White Cotton T-shirt",
          quantity: 3,
          price: 234000,
        },
        {
          productId: "P003",
          name: "Blue Denim Jeans",
          quantity: 2,
          price: 350000,
        },
      ],
      total: 1412000,
      status: "Completed",
    },
    {
      id: "O004",
      customer: "Vo Luan",
      username: "user2",
      customerPhone: "018747279",
      customerAddress: "Saigon University, Campus 1",
      date: "2025-10-20",
      items: [
        {
          productId: "P004",
          name: "Men’s Baseball Cap",
          quantity: 5,
          price: 150000,
        },
      ],
      total: 750000,
      status: "Cancelled",
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
      name: "Blue Denim Jeans",
      type: "Jeans",
      price: 350000,
      productDesc: "Durable and stylish blue jeans for everyday use.",
      quantity: 1,
      color: "blue",
      gender: "men",
      image: "./assets/ao1.avif",
    },
  ];
  localStorage.setItem("cart", JSON.stringify(sampleCart));
  console.log("Sample cart created");
}
