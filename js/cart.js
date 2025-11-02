// import { renderProductDetail } from "./product";
const cartContainer = document.querySelector(".cart-items");
const subtotalEl = document.getElementById("subtotal");
const totalEl = document.getElementById("total");

const getCart = () => JSON.parse(localStorage.getItem("cart")) || [];
const saveCart = (data) => localStorage.setItem("cart", JSON.stringify(data));

const getUser = () => JSON.parse(localStorage.getItem("currentUser")) || null;

document.addEventListener("DOMContentLoaded", () => {
  const cartpage = document.getElementById("cart-page");
  const accountPage = document.getElementById("account-page");
  const view = localStorage.getItem("cartView");

  if (view === "cart") {
    cartpage.classList.add("active");
    accountPage.classList.remove("active");
  } else {
    cartpage.classList.remove("active");
    accountPage.classList.add("active");
  }
});

const getProducts = () => JSON.parse(localStorage.getItem("products")) || [];

function renderCart() {
  const carts = getCart();
  const products = getProducts();
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const cart = carts.filter((e) => e.user === user.username);
  console.log(cart);
  cartContainer.innerHTML = "";

  // --- Nếu giỏ trống ---
  if (cart.length === 0) {
    cartContainer.innerHTML = `<p style="text-align:center;color:#555;">Your bag is empty.</p>`;
    subtotalEl.textContent = "0₫";
    totalEl.textContent = "0₫";
    return;
  }

  let subtotal = 0;

  cart.forEach((item) => {
    subtotal += item.price * item.quantity;
    const product = products.find((p) => p.id === item.id);
    if (!product) return;

    // ==== Sinh danh sách size ====
    const sizeOptions = (product.sizes || [])
      .map(
        (s) =>
          `<option value="${s}" ${
            s === item.size ? "selected" : ""
          }>${s}</option>`
      )
      .join("");

    // ==== Sinh danh sách màu ====
    const colorOptions = (product.color || [])
      .map(
        (c) =>
          `<option value="${c}" ${
            c === item.color ? "selected" : ""
          }>${c}</option>`
      )
      .join("");

    // ==== Render item ====
    const div = document.createElement("div");
    div.className = "cart-item";
    div.setAttribute("data-id", item.id);
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h3>${item.name}</h3>
        <p>${item.type}</p>

        <p>
          Color:
          <select class="color-select" 
                  data-id="${item.id}" 
                  data-size="${item.size}" 
                  data-color="${item.color}">
            ${colorOptions}
          </select>
        </p>

        <p>
          Size:
          <select class="size-select" 
                  data-id="${item.id}" 
                  data-size="${item.size}" 
                  data-color="${item.color}">
            ${sizeOptions}
          </select>
        </p>

        <p><b>${item.price.toLocaleString("vi-VN")}₫</b></p>
      </div>

      <div class="cart-item-actions">
        <button class="remove-btn" 
                data-id="${item.id}" 
                data-size="${item.size}" 
                data-color="${item.color}" 
                title="Remove">
          <span class="material-symbols-outlined">delete</span>
        </button>
        <div class="quantity-control">
          <button class="decrease" 
                  data-id="${item.id}" 
                  data-size="${item.size}" 
                  data-color="${item.color}">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="increase" 
                  data-id="${item.id}" 
                  data-size="${item.size}" 
                  data-color="${item.color}">+</button>
        </div>
      </div>
    `;
    cartContainer.appendChild(div);
  });

  // ==== Tổng tiền ====
  subtotalEl.textContent = subtotal.toLocaleString("vi-VN") + "₫";
  totalEl.textContent = subtotal.toLocaleString("vi-VN") + "₫";

  // ==== Đổi size ====
  document.querySelectorAll(".size-select").forEach((select) => {
    select.addEventListener("change", (e) => {
      const { id, color, size: oldSize } = e.target.dataset;
      const newSize = e.target.value;

      const cart = getCart();
      const item = cart.find(
        (p) => p.id === id && p.color === color && p.size === oldSize
      );
      if (!item) return;

      // Nếu tồn tại cùng ID + color + newSize => gộp quantity
      const existing = cart.find(
        (p) => p.id === id && p.color === color && p.size === newSize
      );
      if (existing && existing !== item) {
        existing.quantity += item.quantity;
        const index = cart.indexOf(item);
        cart.splice(index, 1);
      } else {
        item.size = newSize;
      }

      saveCart(cart);
      renderCart();
    });
  });

  // ==== Đổi color ====
  document.querySelectorAll(".color-select").forEach((select) => {
    select.addEventListener("change", (e) => {
      const { id, color: oldColor, size } = e.target.dataset;
      const newColor = e.target.value;

      const cart = getCart();
      const item = cart.find(
        (p) => p.id === id && p.color === oldColor && p.size === size
      );
      if (!item) return;

      // Nếu tồn tại cùng ID + size + newColor => gộp quantity
      const existing = cart.find(
        (p) => p.id === id && p.size === size && p.color === newColor
      );
      if (existing && existing !== item) {
        existing.quantity += item.quantity;
        const index = cart.indexOf(item);
        cart.splice(index, 1);
      } else {
        item.color = newColor;
      }

      saveCart(cart);
      renderCart();
    });
  });

  // ==== Tăng / giảm số lượng ====
  document.querySelectorAll(".increase, .decrease").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const { id, size, color } = e.target.dataset;
      changeQuantity(
        id,
        size,
        color,
        btn.classList.contains("increase") ? 1 : -1
      );
    });
  });

  // ==== Xóa sản phẩm ====
  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const { id, size, color } = e.currentTarget.dataset;
      removeFromCart(id, size, color);
    });
  });
}

function changeQuantity(id, size, color, delta) {
  const cart = getCart();
  const item = cart.find(
    (p) => p.id === id && p.size === size && p.color === color
  );
  if (!item) return;
  item.quantity = Math.max(1, item.quantity + delta);
  saveCart(cart);
  renderCart();
}

function removeFromCart(id, size, color) {
  let cart = getCart();
  cart = cart.filter(
    (p) => !(p.id === id && p.size === size && p.color === color)
  );
  saveCart(cart);
  renderCart();
}

document.getElementById("checkout-btn").addEventListener("click", () => {
  const cart = getCart();
  if (cart.length === 0) {
    message("Your bag is empty!");
    return;
  }

  // Có thể mở popup ở đây
  document.getElementById("paymentPopup")?.classList.add("active");
});

renderCart();

// thanh toan
const paymentPopup = document.getElementById("paymentPopup");
const closePopupBtn = document.getElementById("closePopup");
const paymentForm = document.getElementById("paymentForm");
const checkoutBtn = document.getElementById("checkout-btn");

// Mở popup
checkoutBtn.addEventListener("click", () => {
  const cart = getCart();
  if (cart.length === 0) {
    message("Your bag is empty!");
    return;
  }
  const user = getUser();
  paymentPopup.classList.add("active");
  document.getElementById("fullname-pay").value = user.name;
  document.getElementById("email-pay").value = user.email;
  document.getElementById("phone-pay").value = user.phoneNumber;
  document.getElementById("address-pay").value = user.address || "";
});

// Đóng popup
closePopupBtn.addEventListener("click", () => {
  paymentPopup.classList.remove("active");
});

// Gửi form thanh toán
document.getElementById("paymentForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("fullname-pay").value.trim();
  const email = document.getElementById("email-pay").value.trim();
  const phone = document.getElementById("phone-pay").value.trim();
  const address = document.getElementById("address-pay").value.trim();
  const method = document.querySelector('input[name="method"]:checked').value;
  const carts = getCart();
  const user = getUser();
  const cart = carts.filter((e) => e.user === user.username);

  if (!name || !email || !phone || !address) {
    message("Please fill out all fields!");
    return;
  }

  if (cart.length === 0) {
    message("Your cart is empty!");
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  const newId = "O" + String(orders.length + 1).padStart(3, "0");
  function getCurrentUser() {
    return JSON.parse(localStorage.getItem("currentUser")) || null;
  }
  const currentUser = getCurrentUser();

  const newOrder = {
    id: newId,
    customer: name,
    username: currentUser.username, // có thể thay bằng tài khoản đăng nhập nếu có
    customerPhone: phone,
    customerAddress: address,
    date: new Date().toISOString().split("T")[0],
    items: cart.map((item) => ({
      productId: item.id,
      name: item.name,
      type: item.type,
      gender: item.gender,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
      image: item.image,
      price: item.price,
    })),
    total,
    paymentMethod: method,
    status: "New",
  };
  console.log("check");

  orders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(orders));

  localStorage.setItem("cart", JSON.stringify(""));
  renderCart();
  paymentPopup.style.display = "none";
});
