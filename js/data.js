const app_version = "1.0.5";

const savedVersion = localStorage.getItem("appversion");
if (savedVersion !== app_version) {
  localStorage.clear();
  localStorage.setItem("appversion", app_version);
  console.log("da cap nhat data");
}

if (!localStorage.getItem("users")) {
  const users = [
    {
      username: "user1",
      password: "123",
      locked: true,
      name: "Luan Vo",
      email: "nhutluanv@gmail.com",
      phoneNumber: "099912322",
      gender: "nam",
      date: "19/03/2006",
    },
    {
      username: "user2",
      password: "123",
      locked: true,
      name: "Vo Luan",
      email: "user1234@gmail.com",
      phoneNumber: "0987654321",
      gender: "nam",
      date: "16/04/2006",
    },
  ];

  localStorage.setItem("users", JSON.stringify(users));
  console.log("du lieu da dc tao");
} else {
  console.log("du lieu da ton tai");
}

// ====== KHỞI TẠO DỮ LIỆU MẪU ======

// Loại sản phẩm
if (!localStorage.getItem("productTypes")) {
  const sampleTypes = [
    {
      code: "L001",
      name: "Áo thun",
      desc: "Các loại áo thun cotton, thể thao...",
    },
    { code: "L002", name: "Quần jean", desc: "Jean nam nữ các loại..." },
    { code: "L003", name: "Phụ kiện", desc: "Mũ, dây lưng, tất, túi xách..." },
  ];
  localStorage.setItem("productTypes", JSON.stringify(sampleTypes));
}

// Sản phẩm
if (!localStorage.getItem("products")) {
  const sampleProducts = [
    {
      id: "P001",
      name: "Áo thun cotton xanh",
      type: "Áo thun",
      costPrice: 200000,
      profitPercent: 25,
      price: 250000,
      productDesc:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. At, adipisci.",
      quantity: 10,
      image: "../assets/20240827_99qstqYiE1.png",
    },
    {
      id: "P002",
      name: "Áo thun cotton trắng",
      type: "Áo thun",
      costPrice: 180000,
      profitPercent: 30,
      price: 234000,
      productDesc:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. At, adipisci.",
      quantity: 5,
      image: "../assets/blank-image.png",
    },
    {
      id: "P003",
      name: "Quần jean xanh",
      type: "Quần jean",
      costPrice: 280000,
      profitPercent: 25,
      price: 350000,
      productDesc:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. At, adipisci.",
      quantity: 8,
      image: "../assets/ao1.avif",
    },
    {
      id: "P004",
      name: "Mũ lưỡi trai nam",
      type: "Phụ kiện",
      costPrice: 100000,
      profitPercent: 50,
      price: 150000,
      productDesc:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. At, adipisci.",
      quantity: 20,
      image: "../assets/blank-image.png",
    },
  ];
  localStorage.setItem("products", JSON.stringify(sampleProducts));
}

// Phiếu nhập
if (!localStorage.getItem("imports")) {
  const sampleImports = [
    {
      id: "I001",
      productId: "P001",
      productName: "Áo thun cotton xanh",
      date: "2025-10-20",
      quantity: 10,
      price: 200000,
      total: 2000000,
      status: "Đã hoàn thành",
    },
    {
      id: "I002",
      productId: "P003",
      productName: "Quần jean xanh",
      date: "2025-10-21",
      quantity: 5,
      price: 280000,
      total: 1400000,
      status: "Chưa hoàn thành",
    },
    {
      id: "I003",
      productId: "P004",
      productName: "Mũ lưỡi trai nam",
      date: "2025-10-22",
      quantity: 15,
      price: 100000,
      total: 1500000,
      status: "Chưa hoàn thành",
    },
  ];
  localStorage.setItem("imports", JSON.stringify(sampleImports));
}

// Khởi tạo đơn đặt hàng nếu chưa có
if (!localStorage.getItem("orders")) {
  const sampleOrders = [
    {
      id: "O001",
      customer: "Luan Vo",
      username: "user1",
      customerPhone: "092841242",
      customerAddress: "dai hoc sai gon quan 5",
      date: "2025-10-23",
      items: [
        {
          productId: "P001",
          name: "Áo thun cotton xanh",
          quantity: 2,
          price: 250000,
        },
        {
          productId: "P004",
          name: "Mũ lưỡi trai nam",
          quantity: 1,
          price: 150000,
        },
      ],
      total: 650000,
      status: "Mới đặt",
    },
    {
      id: "O002",
      customer: "Vo Luan",
      username: "user2",
      customerPhone: "0193749823",
      customerAddress: "dai hoc sai gon quan 5",
      date: "2025-10-22",
      items: [
        {
          productId: "P003",
          name: "Quần jean xanh",
          quantity: 1,
          price: 350000,
        },
      ],
      total: 350000,
      status: "Đã xử lý",
    },
    {
      id: "O003",
      customer: "Luan Vo",
      username: "user1",
      customerPhone: "09849274",
      customerAddress: "dai hoc sai gon quan 3",
      date: "2025-10-21",
      items: [
        {
          productId: "P002",
          name: "Áo thun cotton trắng",
          quantity: 3,
          price: 234000,
        },
        {
          productId: "P003",
          name: "Quần jean xanh",
          quantity: 2,
          price: 350000,
        },
      ],
      total: 1412000,
      status: "Hủy",
    },
    {
      id: "O004",
      customer: "Vo Luan",
      username: "user2",
      customerPhone: "018747279",
      customerAddress: "dai hoc sai gon cs1",
      date: "2025-10-20",
      items: [
        {
          productId: "P004",
          name: "Mũ lưỡi trai nam",
          quantity: 5,
          price: 150000,
        },
      ],
      total: 750000,
      status: "Hủy",
    },
  ];

  localStorage.setItem("orders", JSON.stringify(sampleOrders));
  console.log("Dữ liệu đơn hàng đã được tạo");
} else {
  console.log("Dữ liệu đơn hàng đã tồn tại");
}

// localStorage.clear();
