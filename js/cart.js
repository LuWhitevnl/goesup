const cartContainer = document.querySelector(".cart-items");
const subtotalEl = document.getElementById("subtotal");
const totalEl = document.getElementById("total");

const getCart = () => JSON.parse(localStorage.getItem("cart")) || [];
const saveCart = (data) => localStorage.setItem("cart", JSON.stringify(data));

function renderCart() {
  const cart = getCart();
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = `<p style="text-align:center;color:#555;">Your bag is empty.</p>`;
    subtotalEl.textContent = "0₫";
    totalEl.textContent = "0₫";
    return;
  }

  let subtotal = 0;

  cart.forEach((item) => {
    subtotal += item.price * item.quantity;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h3>${item.name}</h3>
        <p>${item.type}</p>
        <p>Color: ${item.color}</p>
        <p>Size: ${item.size}</p>
        <p><b>${item.price.toLocaleString("vi-VN")}₫</b></p>
      </div>
      <div class="cart-item-actions">
        <button class="remove-btn" data-id="${item.id}" title="Remove">
          <span class="material-symbols-outlined"> delete </span>
        </button>
        <div class="quantity-control">
          <button class="decrease" data-id="${item.id}">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="increase" data-id="${item.id}">+</button>
        </div>
      </div>
    `;
    cartContainer.appendChild(div);
  });

  // Cập nhật tổng tiền
  subtotalEl.textContent = subtotal.toLocaleString("vi-VN") + "₫";
  totalEl.textContent = subtotal.toLocaleString("vi-VN") + "₫";

  // === Thêm sự kiện ===
  document.querySelectorAll(".increase").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      changeQuantity(id, 1);
    });
  });

  document.querySelectorAll(".decrease").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      changeQuantity(id, -1);
    });
  });

  document.querySelectorAll(".remove-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;
      removeFromCart(id);
    });
  });
}

function changeQuantity(id, delta) {
  const cart = getCart();
  const item = cart.find((p) => p.id === id);
  if (!item) return;

  item.quantity = Math.max(1, item.quantity + delta); // không nhỏ hơn 1
  saveCart(cart);
  renderCart();
}

function removeFromCart(id) {
  let cart = getCart();
  cart = cart.filter((p) => p.id !== id);
  saveCart(cart);
  renderCart();
}

document.getElementById("checkout-btn").addEventListener("click", () => {
  const cart = getCart();
  if (cart.length === 0) {
    alert("Your bag is empty!");
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
    alert("Your bag is empty!");
    return;
  }
  paymentPopup.classList.add("active");
});

// Đóng popup
closePopupBtn.addEventListener("click", () => {
  paymentPopup.classList.remove("active");
});

// Gửi form thanh toán
document.getElementById("paymentForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const method = document.querySelector('input[name="method"]:checked').value;
  const cart = getCart();

  if (!name || !email || !phone || !address) {
    alert("Please fill out all fields!");
    return;
  }

  if (cart.length === 0) {
    alert("Your cart is empty!");
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
      quantity: item.quantity,
      price: item.price,
    })),
    total,
    paymentMethod: method,
    status: "New",
  };

  orders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(orders));

  localStorage.setItem("cart", JSON.stringify(""));
  renderCart();
  paymentPopup.style.display = "none";
});
