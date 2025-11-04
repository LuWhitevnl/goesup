// ======================== SIDEBAR & NAVIGATION ========================
const sidebarItems = document.querySelectorAll(".sidebar-item");
const contentSections = document.querySelectorAll(".content-section");

sidebarItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();

    // ---- Logout ----
    if (item.classList.contains("logout")) {
      localStorage.removeItem("currentUser");
      localStorage.setItem("logined", false);
      window.location.href = "index.html";
      return;
    }

    // ---- Active tab ----
    sidebarItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");

    const target = item.dataset.section;
    contentSections.forEach((sec) => (sec.style.display = "none"));
    document.getElementById(target).style.display = "block";

    // ---- Render orders ----
    if (target === "ordercheck") renderOrders("All", "#ordercheck-list");
    if (target === "orderhistory") renderOrders("All", "#orderhistory-list");
  });
});

// ======================== UTILITIES ========================
function getOrders() {
  return JSON.parse(localStorage.getItem("orders")) || [];
}
function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser")) || null;
}
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

// ======================== LOAD ACCOUNT INFO ========================
function loadAccountInfo() {
  const user = getCurrentUser();
  if (!user) return;

  // Gán thông tin vào form
  document.getElementById("username").textContent = user.username;
  document.getElementById("fullname-acc").value = user.name || "";
  document.getElementById("email-acc").value = user.email || "";
  document.getElementById("phone-acc").value = user.phoneNumber || "";
  document.getElementById("address-acc").value = user.address || "";
  document
    .querySelector(`input[name="gender"][value="${user.gender}"]`)
    ?.setAttribute("checked", true);
  document.querySelector('input[type="date"]').value = user.date || "";

  // Gán vào sidebar
  document.getElementById("sidebar-username").textContent =
    user.name || user.username;
  document.getElementById("sidebar-email").textContent = user.email || "";
}

// ======================== EDIT / SAVE / CANCEL ========================
const editBtn = document.getElementById("editBtn");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const formInputs = document.querySelectorAll("#accountForm input");

editBtn.addEventListener("click", () => {
  formInputs.forEach((i) => i.removeAttribute("readonly"));
  document
    .querySelectorAll('input[name="gender"]')
    .forEach((r) => (r.disabled = false));
  editBtn.style.display = "none";
  saveBtn.style.display = "inline-block";
  cancelBtn.style.display = "inline-block";
});

cancelBtn.addEventListener("click", () => {
  loadAccountInfo();
  formInputs.forEach((i) => i.setAttribute("readonly", true));
  document
    .querySelectorAll('input[name="gender"]')
    .forEach((r) => (r.disabled = true));
  editBtn.style.display = "inline-block";
  saveBtn.style.display = "none";
  cancelBtn.style.display = "none";
});

// ---- SAVE PROFILE ----
document.getElementById("accountForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const user = getCurrentUser();
  if (!user) return;

  // Cập nhật dữ liệu trong currentUser
  user.name = document.getElementById("fullname-acc").value.trim();
  user.email = document.getElementById("email-acc").value.trim();
  user.phoneNumber = document.getElementById("phone-acc").value.trim();
  user.address = document.getElementById("address-acc").value.trim();
  user.gender =
    document.querySelector('input[name="gender"]:checked')?.value || "";
  user.date = document.querySelector('input[type="date"]').value;

  // ---- Cập nhật users trong localStorage ----
  const users = getUsers();
  const idx = users.findIndex((u) => u.username === user.username);
  if (idx !== -1) {
    users[idx] = user; // thay thế thông tin người dùng
    saveUsers(users);
  }

  // ---- Cập nhật currentUser ----
  localStorage.setItem("currentUser", JSON.stringify(user));

  // ---- Reload form & trạng thái ----
  loadAccountInfo();
  formInputs.forEach((i) => i.setAttribute("readonly", true));
  document
    .querySelectorAll('input[name="gender"]')
    .forEach((r) => (r.disabled = true));

  editBtn.style.display = "inline-block";
  saveBtn.style.display = "none";
  cancelBtn.style.display = "none";

  message("Your information has been updated successfully!");
});

// ======================== RENDER ORDERS ========================
function renderOrders(status, containerSelector) {
  const user = getCurrentUser();
  const container = document.querySelector(containerSelector);
  container.innerHTML = "";

  if (!user) {
    container.innerHTML =
      "<p style='text-align:center;color:#555;'>Please log in to view your orders.</p>";
    return;
  }

  const orders = getOrders().filter(
    (o) => o.username.toLowerCase() === user.username.toLowerCase()
  );

  // Nếu là "All" thì lấy toàn bộ
  console.log(status);
  const filtered =
    status === "All"
      ? orders
      : orders.filter((o) => o.status.toLowerCase() === status.toLowerCase());

  if (filtered.length === 0) {
    container.innerHTML = `<p style="text-align:center;color:#999;">No ${status.toLowerCase()} orders found.</p>`;
    return;
  }

  filtered.forEach((o) => {
    const div = document.createElement("div");
    div.className = "order-card";
    div.innerHTML = `
              <div class="status-card">
                <div class="status-left">
                    <div class="order-id">${o.id}</div>
                    <div>${o.date}</div>
                </div>
                <div class="order-status">${o.status}</div>
              </div>
              <div class="items">
              ${o.items
                .map(
                  (i) =>
                    `
              <div class="item">
                  <div class="item-info">
                    <div class="item-img">
                      <img src="${i.image}" alt="${i.name}" />
                    </div>
                    <div class="item-more">
                      <h2 class="title">${i.name}</h2>
                      <div class="info">
                        <div class="lable"><p>classify:</p></div>
                        <div class="type">${i.type}, ${i.color}, ${i.size}</div>
                      </div>
                      <div class="quantity">x${i.quantity}</div>
                    </div>
                  </div>
                  <div class="item-price">${i.price.toLocaleString(
                    "vi-VN"
                  )}₫</div>
                </div>
            `
                )
                .join("")}
                
              </div>
              <div class="total">
                ${
                  o.status === "New" || o.status === "Shipping"
                    ? `<button class="btn cancel-order-btn" data-order-id="${o.id}">Cancel Order</button>`
                    : ""
                }
                Total:
                <p>${o.total.toLocaleString("vi-VN")}₫</p>
              </div>
    `;
    container.appendChild(div);
    document
      .querySelector(".cancel-order-btn")
      ?.addEventListener("click", (e) => {
        const orderId = e.target.dataset.orderId;
        if (!orderId) return;

        const orders = getOrders();
        const idx = orders.findIndex((o) => o.id === orderId);
        if (idx === -1) return;
        orders[idx].status = "Cancelled";
        localStorage.setItem("orders", JSON.stringify(orders));
        renderOrders("All", "#ordercheck-list");
        message("Order has been cancelled.");
      });
  });
}

// ======================== ORDER STATUS TABS ========================
const statusTabs = document.querySelectorAll(".status-tab");

statusTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    statusTabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    const status = tab.dataset.status;
    renderOrders(status, "#ordercheck-list");
  });
});

// Khi mở trang, mặc định load tất cả đơn hàng
document.addEventListener("DOMContentLoaded", () => {
  loadAccountInfo();
  renderOrders("All", "#ordercheck-list");
});

// ======================== INIT ========================
document.addEventListener("DOMContentLoaded", () => {
  loadAccountInfo();
});

// === Sidebar toggle (mobile) ===
const sidebar = document.getElementById("accountSidebar");
const toggleSidebar = document.getElementById("toggleSidebar");

toggleSidebar.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

// Đóng sidebar khi chọn mục (mobile UX tốt hơn)
document.querySelectorAll(".sidebar-item[data-section]").forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    sidebar.classList.remove("active"); // đóng khi chọn
    document
      .querySelectorAll(".sidebar-item")
      .forEach((i) => i.classList.remove("active"));
    item.classList.add("active");

    const sectionId = item.getAttribute("data-section");
    document
      .querySelectorAll(".content-section")
      .forEach((sec) => (sec.style.display = "none"));
    document.getElementById(sectionId).style.display = "block";
    document.querySelector(".mobile-header h1").textContent =
      item.textContent.trim();
  });
});
