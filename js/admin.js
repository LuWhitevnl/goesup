// ==================== LOGIN FORM ====================
const username = document.querySelector("#username");
const passwordInput = document.querySelector("#loginPass");
const loginOverlay = document.querySelector(".formWapper");
const popup = document.querySelector(".popupBox");
const loginForm = document.querySelector("#loginForm");
const adminPage = document.querySelector(".admin-body");

const Admin = JSON.parse(localStorage.getItem("admin")) || null;
function toggleForm(showAdmin) {
  if (showAdmin) {
    loginOverlay.classList.remove("active");
    popup.classList.remove("active");
    adminPage.classList.add("active");
  } else {
    username.focus();
    loginOverlay.classList.add("active");
    popup.classList.add("active");
    adminPage.classList.remove("active");
  }
}
if (localStorage.getItem("loggedInAdmin") === "true") {
  toggleForm(true);
}
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (
    username.value === Admin.username &&
    passwordInput.value === Admin.password
  ) {
    localStorage.setItem("loggedInAdmin", "true");
    toggleForm(true);
  } else {
    loginForm.reset();
    username.focus();
    username.placeholder = "sai mat khau hoac tai khoan";
    passwordInput.placeholder = "sai mat khau hoac tai khoan";
    username.classList.add("error");
    passwordInput.classList.add("error");
    setTimeout(() => {
      username.placeholder = "username";
      passwordInput.placeholder = "password";
      username.classList.remove("error");
      passwordInput.classList.remove("error");
    }, 1500);
  }
});
document.querySelector(".log-out").addEventListener("click", () => {
  localStorage.removeItem("loggedInAdmin");
  toggleForm(false);
});
// ========================================================================

// ==================== SIDEBAR ====================
const sidebar = document.querySelector(".sidebar");
const toggle = document.querySelector(".toggle");

toggle.addEventListener("click", () => {
  const collapsed = sidebar.classList.toggle("collapsed");
  if (collapsed) closeAllSubmenus();
});

// open page
function showPage(pageId, btn) {
  document.querySelectorAll(".page").forEach((p) => (p.style.display = "none"));
  document.getElementById(pageId).style.display = "block";
  document
    .querySelectorAll(".menu li")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  // close_repo();
  document.querySelector(".sidebar").classList.toggle("open");
}

document.querySelectorAll(".logo-box").forEach((b) => {
  b.addEventListener("click", () => {
    showPage("dashboard", document.querySelector(".dashboard-btn"));
    close_repo();
  });
});

// =========== get set ================
// type
const getTypes = () => JSON.parse(localStorage.getItem("productTypes")) || [];
const saveTypes = (data) =>
  localStorage.setItem("productTypes", JSON.stringify(data));
const getCates = () => JSON.parse(localStorage.getItem("category")) || [];
const saveCates = (data) =>
  localStorage.setItem("category", JSON.stringify(data));

// products
const getProducts = () => JSON.parse(localStorage.getItem("products")) || [];
const saveProducts = (data) =>
  localStorage.setItem("products", JSON.stringify(data));

// order
const getOrders = () => JSON.parse(localStorage.getItem("orders")) || [];
const saveOrders = (data) =>
  localStorage.setItem("orders", JSON.stringify(data));

// imports
const getData = (key) => JSON.parse(localStorage.getItem(key)) || [];
const setData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

const getUsers = (key) => JSON.parse(localStorage.getItem("users")) || [];

const saveUsers = (list) => localStorage.setItem("users", JSON.stringify(list));

// kho
function getKho() {
  return JSON.parse(localStorage.getItem("imports")) || [];
}

function saveKho(imports) {
  localStorage.setItem("imports", JSON.stringify(imports));
}

// =========================== Dashboard ===========================
const cardrevenue = document.querySelector(".revenue p");
const CardnewOrder = document.querySelector(".newOrder p");
const client = document.querySelector(".client p");
const Cardinven = document.querySelector(".invento p");

function renderDashboard() {
  // Tính doanh thu tháng này
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const orders = getOrders();
  const products = getProducts();
  const customer = getUsers();
  // console.log(customer);
  const monthlyRevenue = orders
    .filter(
      (o) =>
        o.status === "Completed" &&
        new Date(o.date).getMonth() === currentMonth &&
        new Date(o.date).getFullYear() === currentYear
    )
    .reduce((sum, o) => sum + (o.total || 0), 0);

  // so khach hang moi
  const clientCount = customer.filter((c) => !c.locked).length;

  // Đếm đơn hàng mới (chưa giao)
  const newOrder = orders.filter((o) => o.status === "New").length;
  // console.log(newOrder);
  //  Tổng số sản phẩm tồn
  const totalStock = products.reduce((sum, p) => sum + (p.quantity || 0), 0);

  //  Cập nhật vào giao diện
  cardrevenue.textContent = `${monthlyRevenue.toLocaleString("vi-VN")}₫`;
  CardnewOrder.textContent = newOrder;
  client.textContent = clientCount;
  Cardinven.textContent = totalStock;
  document.querySelector(".newOrder").addEventListener("click", () => {
    showPage("orders", document.querySelector(".order-btn"));
    close_repo();
  });
  document.querySelector(".invento").addEventListener("click", () => {
    showPage("warehouse", document.querySelector(".warehouse-btn"));
    close_repo();
  });
  document.querySelector(".client").addEventListener("click", () => {
    showPage("user", document.querySelector(".user-btn"));
    close_repo();
  });
}

// ==================== QUẢN LÝ LOẠI SẢN PHẨM ====================
const typeModal = document.getElementById("typeModal");
const typeForm = document.getElementById("typeForm");
const typeTable = document.querySelector("#typeTable tbody");
const btnAdd = document.getElementById("openAddType");
const btnCancel = document.getElementById("typeCancel");
const modalTitle = document.getElementById("typeModalTitle");
const searchBox = document.getElementById("searchType");

let editIndex = -1;
// type
function renderTypeTable(list = getTypes()) {
  typeTable.innerHTML = "";
  list.forEach((t, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${t.code}</td>
      <td>${t.name}</td>
      <td>${t.desc || ""}</td>
      <td>
          <div class="card-btn">
        <button class="btn-edit" data-index="${i}">Edit</button>
        <button class="btn-delete" data-index="${i}">Delete</button>
          </div>
      </td>
    `;
    typeTable.appendChild(tr);
  });

  // Mở modal thêm
  btnAdd.onclick = () => {
    // console.log(1);
    modalTitle.textContent = "Thêm loại sản phẩm";
    typeForm.reset();
    editIndex = -1;
    typeModal.style.display = "flex";
  };

  // Hủy
  btnCancel.onclick = () => {
    typeModal.style.display = "none";
  };

  // Save
  typeForm.onsubmit = (e) => {
    e.preventDefault();
    const code = document.getElementById("typeCode").value.trim();
    const name = document.getElementById("typeName").value.trim();
    const desc = document.getElementById("typeDesc").value.trim();

    if (!code || !name) return message("Vui lòng nhập mã và tên loại!");

    let typeList = getTypes();
    const data = { code, name, desc };

    if (editIndex === -1) typeList.push(data);
    else typeList[editIndex] = data;

    saveTypes(typeList);
    renderTypeTable();
    typeModal.style.display = "none";
    loadTypeOptions();
  };

  // Edit
  document.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.onclick = () => {
      // console.log(1);
      const typeList = getTypes();
      editIndex = btn.dataset.index;
      const t = typeList[editIndex];
      document.getElementById("typeCode").value = t.code;
      document.getElementById("typeName").value = t.name;
      document.getElementById("typeDesc").value = t.desc;
      modalTitle.textContent = "Edit loại sản phẩm";
      typeModal.style.display = "flex";
    };
  });

  // Delete
  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.onclick = () => {
      const i = btn.dataset.index;
      const typeList = getTypes();
      openConfirm(
        "Delete products type",
        `you wnat delete ${typeList[i].name}`,
        () => {
          let products = getProducts();
          products.forEach((p) => {
            if (p.type === typeList[i].name) {
              p.type = "";
            }
          });
          saveProducts(products);
          renderProducts();
          typeList.splice(i, 1);
          saveTypes(typeList);
          renderTypeTable();
          loadTypeOptions();
        }
      );
    };
  });
}

function renderfilter(filter) {
  const types = getCates(); // Hàm getCates() phải có dữ liệu
  filter.innerHTML =
    `<option value="all">All</option>` +
    types.map((t) => `<option value="${t.cate}">${t.cate}</option>`).join("");
}

// Tìm kiếm realtime
searchBox.addEventListener("input", () => {
  const keyword = searchBox.value.toLowerCase();
  const typeList = getTypes();
  const filtered = typeList.filter(
    (t) =>
      t.name.toLowerCase().includes(keyword) ||
      t.code.toLowerCase().includes(keyword)
  );
  renderTypeTable(filtered);
});

// ================================ User =================================
const userTableBody = document.querySelector("#userTable tbody");
const searchUserInput = document.getElementById("searchUser");
const filteruser = document.getElementById("filterUser");

const confirmModal = document.getElementById("confirmModal");
const confirmTitle = document.getElementById("confirmTitle");
const confirmMessage = document.getElementById("confirmMessage");
const confirmCancel = document.getElementById("confirmCancel");
const confirmOk = document.getElementById("confirmOk");

const userModal = document.getElementById("userModal");
const userForm = document.getElementById("userForm");
const userCancel = document.getElementById("userCancel");

function renderUsers(filter = "", select = "all") {
  const users = getUsers();
  const filtered = users.filter((u) => {
    const f = filter.toLowerCase();
    const searchtext =
      (u.username || "").toLowerCase().includes(f) ||
      (u.name || "").toLowerCase().includes(f) ||
      (u.email || "").toLowerCase().includes(f) ||
      (u.phoneNumber || "").toLowerCase().includes(f);
    const status =
      select === "all" ? true : select === "active" ? !u.locked : u.locked;
    return searchtext && status;
  });

  userTableBody.innerHTML = filtered
    .map((u) => {
      const statusHtml = u.locked
        ? `<span class="status-locked"style="color: red;">Đã khoá</span>`
        : `<span class="status-active" style="color: green;">Hoạt động</span>`;
      return `
      <tr data-username="${u.username}">
        <td>${u.username}</td>
        <td>${u.name || "-"}</td>
        <td>${u.email || "-"}</td>
        <td>${u.phoneNumber || "-"}</td>
        <td>${statusHtml}</td>
        <td class="btn-box">
          <button class="btn-edit" data-username="${u.username}">Edit</button>
          <div>
          <button class="btn-reset btn" data-username="${
            u.username
          }">Reset</button>
          <button class="btn-toggle-lock btn" data-username="${u.username}">${
        u.locked ? "Mở khoá" : "Khoá"
      }</button>
          </div>
        </td>
      </tr>
    `;
    })
    .join("");
}

function openUserModal(user = null) {
  userModal.style.display = "flex";
  if (user) {
    document.getElementById("u_username").value = user.username;
    document.getElementById("u_username").disabled = true; // không Edit username
    document.getElementById("u_name").value = user.name || "";
    document.getElementById("u_email").value = user.email || "";
    document.getElementById("u_phone").value = user.phoneNumber || "";
    document.getElementById("u_role").value = user.role || "user";
    editUsername = user.username;
  }
}
function closeUserModal() {
  userModal.style.display = "none";
  editUsername = null;
  userForm.reset();
}

// EVENT: search
if (searchUserInput && filteruser) {
  searchUserInput.addEventListener("input", () => {
    renderUsers(searchUserInput.value, filteruser.value);
  });
  filteruser.addEventListener("change", () => {
    renderUsers(searchUserInput.value, filteruser.value);
  });
}

userCancel.addEventListener("click", () => closeUserModal());

// EVENT: user form submit
userForm.addEventListener("submit", (ev) => {
  ev.preventDefault();
  const username = document.getElementById("u_username").value.trim();
  const name = document.getElementById("u_name").value.trim();
  const email = document.getElementById("u_email").value.trim();
  const phone = document.getElementById("u_phone").value.trim();
  const role = document.getElementById("u_role").value;

  const users = getUsers();

  if (editUsername) {
    // edit existing
    const idx = users.findIndex((u) => u.username === editUsername);
    if (idx === -1) {
      message("Người dùng không tồn tại");
      closeUserModal();
      return;
    }
    users[idx] = { ...users[idx], name, email, phoneNumber: phone, role };
    saveUsers(users);
    renderUsers(searchUserInput.value);
    closeUserModal();
    return;
  }

  // add new: kiểm tra trùng username
  if (users.some((u) => u.username === username)) {
    return message("Username đã tồn tại, chọn username khác.");
  }
  // password mặc định '123' (bạn có thể đặt khác)
  users.push({
    username,
    password: "123",
    role,
    name,
    email,
    phoneNumber: phone,
    locked: false,
  });
  saveUsers(users);
  renderUsers(searchUserInput.value);
  closeUserModal();
});

// Delegation: xử lý các nút trong bảng user
userTableBody.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const username = btn.dataset.username;
  if (!username) return;

  const users = getUsers();
  const idx = users.findIndex((u) => u.username === username);
  if (idx === -1) {
    message("Người dùng không tồn tại");
    return;
  }

  if (btn.classList.contains("btn-reset")) {
    openConfirm(
      "Reset mật khẩu",
      `Đặt lại mật khẩu của ${username} về '123'?`,
      () => {
        users[idx].password = "123";
        saveUsers(users);
        message(`Đã reset mật khẩu ${username} -> 123`);
        renderUsers(searchUserInput.value);
      }
    );
  } else if (btn.classList.contains("btn-toggle-lock")) {
    const locking = !users[idx].locked;
    openConfirm(
      locking ? "Khoá tài khoản" : "Mở khoá tài khoản",
      `${locking ? "Khoá" : "Mở khoá"} tài khoản ${username}?`,
      () => {
        users[idx].locked = locking;
        saveUsers(users);
        renderUsers(searchUserInput.value);
      }
    );
  } else if (btn.classList.contains("btn-edit")) {
    openUserModal(users[idx]);
  } else if (btn.classList.contains("btn-delUser")) {
    openConfirm(
      "Delete người dùng",
      `Bạn có chắc muốn Delete ${username}?`,
      () => {
        users.splice(idx, 1);
        saveUsers(users);
        renderUsers(searchUserInput.value);
      }
    );
  }
});

// ==================== QUẢN LÝ SẢN PHẨM ====================
const productTable = document.querySelector(".item-list");
const productModal = document.querySelector("#productModal");
const openAddBtn = document.querySelector("#openAddProduct");
const cancelModalBtn = document.querySelector("#cancelModal");
const productForm = document.querySelector("#productForm");
const picPreview = document.querySelector("#previewContainer");
const imageInput = document.querySelector("#productImage");
const typeSelect = document.querySelector("#productType");
const cateSelect = document.querySelector("#cate");
const filterProductsType = document.getElementById("filterType");

let editingId = null;

// ==================== QUẢN LÝ ĐƠN HÀNG ====================
const orderTable = document.querySelector("#orderTable tbody");
const orderModal = document.getElementById("orderModal");
const orderDetails = document.getElementById("order-details__box");
const orderStatusSelect = document.getElementById("orderStatus");
const closeModalBtn = document.getElementById("closeOrderModal");
const updateStatusBtn = document.getElementById("updateOrderStatus");

let editingOrderId = null;

function renderOrders(list = getOrders()) {
  orderTable.innerHTML = "";
  list.forEach((order) => {
    const productsText = order.items.map((i) => i.name).join(", ");
    const quantityText = order.items.map((i) => i.quantity).join(", ");
    const total = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${order.id}</td>
      <td>${order.date}</td>
      <td>${order.customer}</td>
      <td>${productsText}</td>
      <td>${quantityText}</td>
      <td>${total.toLocaleString()} đ</td>
      <td>${order.status}</td>
      <td>
        <button class="btn-view btn-cancel" data-id="${order.id}">View</button>
      </td>
    `;
    orderTable.appendChild(row);
  });
}

updateStatusBtn.addEventListener("click", () => {
  if (!editingOrderId) return;

  const newStatus = orderStatusSelect.value;
  const orders = getOrders();
  const order = orders.find(
    (o) => o.id.toString() === editingOrderId.toString()
  );
  if (!order) return;
  // Nếu chuyển sang "Completed" và chưa trừ kho
  if (order.status !== "Completed" && newStatus === "Completed") {
    const products = getProducts();
    const ware = getKho();
    order.items.forEach((item) => {
      const prod = products.find((p) => p.productId === item.id);
      // console.log(prod);
      if (prod) {
        prod.quantity -= item.quantity;
        if (prod.quantity < 0) prod.quantity = 0;
      }
    });

    saveProducts(products);
    renderProducts(); // Cập nhật bảng sản phẩm
    renderImports();
    renderInventory();
  }

  order.status = newStatus;
  saveOrders(orders);
  renderOrders();

  orderModal.style.display = "none";
  document.body.style.overflow = "auto";
  editingOrderId = null;
});

// ======== Lọc và tìm kiếm ========
function filterOrders() {
  const from = document.getElementById("fromDate").value;
  const to = document.getElementById("toDate").value;
  const status = document.getElementById("statusFilter").value;
  const keyword = document.getElementById("searchOrder").value.toLowerCase();

  const filtered = getOrders().filter((order) => {
    const matchDate =
      (!from || order.date >= from) && (!to || order.date <= to);
    const matchStatus = status ? order.status === status : true;
    const matchKeyword =
      order.customer.toLowerCase().includes(keyword) ||
      order.items.some((i) => i.name.toLowerCase().includes(keyword));
    return matchDate && matchStatus && matchKeyword;
  });

  renderOrders(filtered);
}

document.getElementById("fromDate").addEventListener("change", filterOrders);
document.getElementById("toDate").addEventListener("change", filterOrders);
document
  .getElementById("statusFilter")
  .addEventListener("change", filterOrders);
document.getElementById("searchOrder").addEventListener("input", filterOrders);

document.querySelector(".resetorder").addEventListener("click", () => {
  document.getElementById("fromDate").value = "";
  document.getElementById("toDate").value = "";
  document.getElementById("statusFilter").value = "";
  document.getElementById("searchOrder").value = "";

  renderOrders(getOrders());
});

function closeOrderDetail() {
  // console.log(2);
  orderModal.style.display = "none";
  document.body.style.overflow = "auto";
  editingOrderId = null;
}
orderTable.addEventListener("click", (e) => {
  if (!e.target.classList.contains("btn-view")) return;

  const id = e.target.dataset.id;
  const order = getOrders().find((o) => o.id.toString() === id.toString());
  if (!order) return;

  // Không cho xem nếu Completed (tuỳ mục đích bạn)
  if (order.status === "Completed") return;

  editingOrderId = id;

  let itemsHTML = "";

  order.items.forEach((item) => {
    const total = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    itemsHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td>${item.price.toLocaleString("vi-VN")} ₫</td>
        <td>${total.toLocaleString("vi-VN")} ₫</td>
      </tr>
    `;
  });

  const ship = order.shipFee || 0;
  const tax = order.tax || 0;
  const total = order.total + ship + tax;

  orderDetails.innerHTML = `
              <div class="order-detail__title">
                <div>
                  <h2>Order Details</h2>
                  <p>${order.id}</p>
                </div>
                <button  onclick="closeOrderDetail()">X</button>
              </div>

    <div class="order-status">
      <div>
        <h2>Trạng thái</h2>
        <span>${order.status}</span>
      </div>
      <div class="order-s__date">
        <h2>Ngày đặt</h2>
        <span>${order.date}</span>
      </div>
    </div>

    <div class="customer-info">
      <h3>Thông tin khách hàng</h3>
      <div class="info-box">
        <div class="info-box_content">
          <p>Tên</p>
          <span>${order.customer}</span>
        </div>
        <div class="info-box_content">
          <p>SĐT</p>
          <span>${order.customerPhone}</span>
        </div>
        <div class="info-box_content">
          <p>Địa chỉ giao</p>
          <span>${order.customerAddress}</span>
        </div>
      </div>
    </div>

    <div class="order-items">
      <h3>Sản phẩm trong đơn</h3>
      <table class="order-item_table">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Số lượng</th>
            <th>Giá</th>
            <th>Tổng</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>
    </div>

    <div class="order-total__price">
      <div class="total-box info-box_content">
        <p>Tạm tính</p>
        <span>${order.total.toLocaleString("vi-VN")} ₫</span>
      </div>
      <div class="total-box info-box_content">
        <p>Phí ship</p>
        <span>${ship.toLocaleString("vi-VN")} ₫</span>
      </div>
      <div class="total-box info-box_content">
        <p>Thuế</p>
        <span>${tax.toLocaleString("vi-VN")} ₫</span>
      </div>
      <div class="total-box info-box_content total">
        <p>Tổng cộng</p>
        <span>${total.toLocaleString("vi-VN")} ₫</span>
      </div>
    </div>
  `;

  orderStatusSelect.value = order.status;

  orderModal.style.display = "flex";
  document.body.style.overflow = "hidden";
});

//  Đóng popup
closeModalBtn.addEventListener("click", () => {
  // console.log(2);
  orderModal.style.display = "none";
  document.body.style.overflow = "auto";
  editingOrderId = null;
});

orderModal.addEventListener("click", (e) => {
  if (e.target === orderModal) {
    closeOrderDetail();
  }
});

// ==================== QUẢN LÝ NHẬP KHO ====================
const importTable = document.querySelector("#importTable tbody");
const importModal = document.getElementById("importModal");
const importForm = document.getElementById("importForm");
const importModalTitle = document.getElementById("importModalTitle");
const addImportProductBtn = document.getElementById("addImportProduct");
const productImportList = document.getElementById("productImportList");

let editingImportId = null;

function renderImports(list = getData("imports")) {
  importTable.innerHTML = list
    .map(
      (imp) => `
      <tr>
        <td>${imp.productName}</td>
        <td>${imp.date}</td>
        <td>${imp.price.toLocaleString()} đ</td>
        <td>${imp.quantity}</td>
        <td>${(imp.total || 0).toLocaleString()} đ</td>
        <td>${imp.status}</td>
        <td>
          ${
            imp.status === "Pending"
              ? `<button class="btn-save" onclick="completeImport('${imp.id}')">Hoàn thành</button>
                 <button class="btn-cancel" onclick="deleteImport('${imp.id}')">Delete</button>`
              : `<button class="btn-cancel" disabled>Hoàn tất</button>`
          }
        </td>
      </tr>`
    )
    .join("");
}

// mo popup import
function openAddImport(productId = null) {
  // console.log(4);
  editingImportId = null;
  importForm.reset();
  productImportList.innerHTML = "";

  const products = getData("products");
  const product = products.find((i) => i.id === productId);
  const selectOptions = products
    .map(
      (p) =>
        `<option value="${p.id}" ${p.id == productId ? "selected" : ""}>${
          p.name
        } (${p.type})</option>`
    )
    .join("");
  const costPrice = product ? product.costPrice : 0;

  const row = document.createElement("div");
  row.classList.add("import-product-item");
  row.innerHTML = `
    <select class="import-product">${selectOptions}</select>
    <input type="number" placeholder="Số lượng" class="import-quantity" min="1" value="1"/>
    <input type="number" placeholder="Giá nhập" class="import-price" min="1" value="${costPrice}"/>
    <button type="button" class="btn-remove">X</button>
  `;
  row
    .querySelector(".btn-remove")
    .addEventListener("click", () => row.remove());
  productImportList.appendChild(row);

  document.getElementById("importDate").value = new Date()
    .toISOString()
    .split("T")[0];

  importModalTitle.textContent = "Thêm phiếu nhập";
  importModal.style.display = "flex";
}

document.getElementById("openAddImport").addEventListener("click", () => {
  // console.log(3);
  openAddImport();
});

//  HỦY
document.getElementById("cancelImport").addEventListener("click", () => {
  importModal.style.display = "none";
});

function filterImports() {
  const from = document.getElementById("importFromDate").value;
  const to = document.getElementById("importToDate").value;
  const status = document.getElementById("importStatusFilter").value;
  const keyword = document.getElementById("searchImport").value.toLowerCase();
  const filtered = getData("imports").filter((imp) => {
    const matchDate = (!from || imp.date >= from) && (!to || imp.date <= to);
    const matchStatus = status === "all" ? true : imp.status === status;
    const matchKeyword = imp.productName.toLowerCase().includes(keyword);
    return matchDate && matchStatus && matchKeyword;
  });
  renderImports(filtered);
}

// Add event listeners for filtering inputs
document
  .getElementById("importFromDate")
  .addEventListener("change", filterImports);
document
  .getElementById("importToDate")
  .addEventListener("change", filterImports);
document
  .getElementById("importStatusFilter")
  .addEventListener("change", filterImports);
document
  .getElementById("searchImport")
  .addEventListener("input", filterImports);
document.querySelector(".resetImport").addEventListener("click", () => {
  document.getElementById("importFromDate").value = "";
  document.getElementById("importToDate").value = "";
  document.getElementById("importStatusFilter").value = "all";
  document.getElementById("searchImport").value = "";
  filterImports();
});

/* ====== SỰ KIỆN NHẬP THÊM ====== */
function attachAddMoreEvents() {
  document.querySelectorAll(".btn-addmore").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.dataset.id;
      const products = getProducts();
      const product = products.find((p) => p.id === productId);
      if (!product) return message("Không tìm thấy sản phẩm");

      openAddImport(productId);
      renderInventory();
    });
  });
}

let currentPageInventory = 1;
const itemsPerPageInventory = 6;
function renderInventory(products = getProducts(), page = 1) {
  const tbody = document.querySelector("#inventoryTable tbody");
  const imports = getKho();
  const orders = getOrders();

  tbody.innerHTML = "";

  if (products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;">Chưa có sản phẩm nào</td></tr>`;
    document.getElementById("paginationInventory").innerHTML = "";
    return;
  }

  const start = (page - 1) * itemsPerPageInventory;
  const end = start + itemsPerPageInventory;
  for (let i = start; i < end && i < products.length; i++) {
    const prod = products[i];
    const importedQty = imports
      .filter((i) => i.productId === prod.id && i.status === "Completed")
      .reduce((sum, i) => sum + i.quantity, 0);

    const exportedQty = orders
      .filter((o) => o.status === "Completed")
      .flatMap((o) => o.items)
      .filter((item) => item.productId === prod.id)
      .reduce((sum, item) => sum + item.quantity, 0);

    const stock = prod.quantity ?? 0;

    let status = "in stock";
    let statusColor = "";
    if (stock === 0) {
      status = "out stock";
      statusColor = "#ff5252";
    } else if (stock < 5) {
      status = "low stock";
      statusColor = "#ff9340";
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${prod.name}</td>
      <td>${prod.cate}</td>
      <td>${stock}</td>
      <td>${importedQty}</td>
      <td>${exportedQty}</td>
      <td>${prod.costPrice ? prod.costPrice.toLocaleString() + "₫" : "-"}</td>
      <td class="${
        status === "out stock"
          ? "danger"
          : status === "low stock"
          ? "warning"
          : "success"
      }">${status}</td>
      <td>
        <button class="btn-addmore btn-cancel" data-id="${
          prod.id
        }" style="color: ${statusColor};">+ Nhập thêm</button>
      </td>
    `;
    tbody.appendChild(tr);
  }

  // ==== Gắn sự kiện nhập thêm ====
  attachAddMoreEvents();

  // ==== Render phân trang ====
  renderPaginationInventory(products);
}

// ==== HÀM PHÂN TRANG ====
function renderPaginationInventory(products) {
  const pagination = document.getElementById("paginationInventory");
  pagination.innerHTML = "";

  const totalPages = Math.ceil(products.length / itemsPerPageInventory);
  if (totalPages <= 1) return;

  const maxButtons = 5; // 🔹 Số nút trang hiển thị tối đa
  let startPage = Math.max(
    1,
    currentPageInventory - Math.floor(maxButtons / 2)
  );
  let endPage = startPage + maxButtons - 1;

  // Giới hạn cuối danh sách
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxButtons + 1);
  }

  // === Hàm tạo nút ===
  const createBtn = (text, disabled, onClick, active = false) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.disabled = disabled;
    if (active) btn.classList.add("active");
    if (!disabled) btn.addEventListener("click", onClick);
    return btn;
  };

  // === Nút về đầu «
  pagination.appendChild(
    createBtn("«", currentPageInventory === 1, () => {
      currentPageInventory = 1;
      renderInventory(getProducts(), currentPageInventory);
    })
  );

  // === Nút trước <
  pagination.appendChild(
    createBtn("<", currentPageInventory === 1, () => {
      currentPageInventory--;
      renderInventory(getProducts(), currentPageInventory);
    })
  );

  // === Các nút trang chính ===
  for (let i = startPage; i <= endPage; i++) {
    pagination.appendChild(
      createBtn(
        i,
        false,
        () => {
          currentPageInventory = i;
          renderInventory(getProducts(), currentPageInventory);
        },
        i === currentPageInventory
      )
    );
  }

  // === Nút sau >
  pagination.appendChild(
    createBtn(">", currentPageInventory === totalPages, () => {
      currentPageInventory++;
      renderInventory(getProducts(), currentPageInventory);
    })
  );

  // === Nút cuối »
  pagination.appendChild(
    createBtn("»", currentPageInventory === totalPages, () => {
      currentPageInventory = totalPages;
      renderInventory(getProducts(), currentPageInventory);
    })
  );
}

// Biến lưu trạng thái bộ lọc hiện tại
const filters = {
  type: "all",
  keyword: "",
  status: "all",
};

function applyInventoryFilters() {
  let products = getProducts();

  // 1. Lọc theo loại
  if (filters.type !== "all") {
    products = products.filter(
      (p) => p.cate.toUpperCase() === filters.type.toUpperCase()
    );
  }

  // 2. Lọc theo từ khóa
  if (filters.keyword.trim() !== "") {
    const kw = filters.keyword.toLowerCase();
    products = products.filter((p) => p.name.toLowerCase().includes(kw));
  }

  // 3. Lọc theo trạng thái tồn kho
  if (filters.status !== "all") {
    products = products.filter((p) => {
      const stock = p.quantity ?? 0;
      if (filters.status === "in-stock") return stock > 5;
      if (filters.status === "low-stock") return stock > 0 && stock <= 5;
      if (filters.status === "out-stock") return stock === 0;
      return true;
    });
  }

  // 4. Render kết quả
  renderInventory(products, currentPageInventory);
}

// --- Các event chỉ thay đổi filters và gọi lại applyInventoryFilters ---
document.querySelector("#filterType-inven").addEventListener("change", (e) => {
  filters.type = e.target.value;
  applyInventoryFilters();
});

document.querySelector("#searchInven").addEventListener("input", (e) => {
  filters.keyword = e.target.value;
  applyInventoryFilters();
});

document
  .querySelector("#filterStatus-inven")
  .addEventListener("change", (e) => {
    filters.status = e.target.value;
    applyInventoryFilters();
  });

document.querySelector(".resetInventory").addEventListener("click", () => {
  filters.type = "all";
  filters.keyword = "";
  filters.status = "all";

  document.querySelector("#filterType-inven").value = "all";
  document.querySelector("#searchInven").value = "";
  document.querySelector("#filterStatus-inven").value = "all";

  applyInventoryFilters();
});

// luu import
importForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const imports = getData("imports");
  const products = getData("products");

  const date = document.getElementById("importDate").value;
  const rows = Array.from(document.querySelectorAll(".import-product-item"));

  if (rows.length === 0) {
    message("Vui lòng thêm ít nhất 1 sản phẩm.");
    return;
  }

  rows.forEach((row) => {
    const productId = row.querySelector(".import-product").value;
    const quantity = Number(row.querySelector(".import-quantity").value);
    const price = Number(row.querySelector(".import-price").value);
    const product = products.find((p) => p.id === productId);
    const productName = product ? product.name : "Không rõ";
    const total = quantity * price;

    const newImport = {
      id: "I" + Date.now() + Math.floor(Math.random() * 100),
      productId,
      productName,
      date,
      quantity,
      price,
      total,
      status: "Pending",
    };
    imports.push(newImport);
  });

  setData("imports", imports);
  importModal.style.display = "none";
  renderImports();
  renderInventory();
});

//  XOÁ PHIẾU NHẬP
function deleteImport(id) {
  let imports = getData("imports").filter((i) => i.id === id);
  openConfirm("Delete import", `you want delete ${imports.productName}`, () => {
    let imports = getData("imports").filter((i) => i.id !== id);
    setData("imports", imports);
    renderImports();
  });
}

//  HOÀN THÀNH PHIẾU NHẬP
function completeImport(id) {
  const imports = getData("imports");
  const products = getData("products");

  const imp = imports.find((i) => i.id === id);
  if (!imp || imp.status === "Completed") return;

  const prod = products.find((p) => p.id === imp.productId);
  if (prod) {
    prod.quantity = (prod.quantity || 0) + imp.quantity;

    prod.costPrice = imp.price;
    prod.price = imp.price * (1 + prod.profitPercent / 100);
  }

  imp.status = "Completed";
  setData("imports", imports);
  setData("products", products);
  renderImports();
  renderInventory();
  renderProducts();
  renderTypeTable();
  updateSummary();
}

// ================ CONFIRM MODAL =================
// state for confirm action
let confirmCallback = null;
let editUsername = null;

// Helpers: open/close modals
function openConfirm(title, message, onOk) {
  confirmTitle.textContent = title;
  confirmMessage.textContent = message;
  confirmModal.style.display = "flex";
  confirmCallback = onOk;
}
function closeConfirm() {
  confirmModal.style.display = "none";
  confirmCallback = null;
}

// EVENTS: confirm modal
confirmCancel.addEventListener("click", closeConfirm);
confirmOk.addEventListener("click", () => {
  if (typeof confirmCallback === "function") confirmCallback();
  closeConfirm();
});

// ==== KHỞI TẠO ====
renderInventory(getProducts(), currentPageInventory);

// ==================== QUẢN LÝ SẢN PHẨM ====================
let currentPage = 1;
const itemsPerPage = 10;
let filteredProducts = getProducts();

// ====== 1 HIỂN THỊ SẢN PHẨM ======
function renderProducts(products = filteredProducts, page = 1) {
  const productTable = document.querySelector(".item-list");
  productTable.innerHTML = "";

  // Giới hạn sản phẩm theo trang
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  // const pageItems = products.slice(start, end);

  if (products.length === 0) {
    productTable.innerHTML = `<p class="no-data">Không có sản phẩm nào.</p>`;
    return;
  }

  for (let i = start; i < end && i < products.length; i++) {
    const p = products[i];
    const siezhtml = p.sizes.map((s) => `<li>${s}`).join("");
    const colorhtml = (p.color || [])
      .map((c) => `<span class="color-dot" style="background: ${c}"></span>`)
      .join("");
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
              <div class="img-box">
                <img src="${p.images[0]}" alt="${p.name}" />
              </div>
              <div class="content-card">
                <h3>${p.name}</h3>
                <p class="desc">${p.collection}</p>
                <p><b>type:</b>${p.type}</p>
                <p><b>category:</b>${p.cate}</p>
                <div class="stock-info">
                  <p><b>sizes:</b></p>
                  <ul>${siezhtml}</ul>
                </div>
                <div class="color-info">
                  <p><b>Color:</b></p>
                  <div class="color-dots">${colorhtml}
                  </div>
                </div>
              </div>
              <div class="card-btn">
                <button class="btn-edit" data-id="${p.id}">Edit</button>
                <button class="btn-delete" data-id="${p.id}">Delete</button>
              </div>
    `;
    productTable.appendChild(card);
  }

  renderPagination(products);
}

// ====== 2 PHÂN TRANG ======
function renderPagination(products = filteredProducts) {
  const pagination = document.getElementById("pagination");
  if (!pagination) return;

  pagination.innerHTML = "";
  const totalPages = Math.ceil(products.length / itemsPerPage);
  if (totalPages <= 1) return;

  let MaxButtons = 5;
  let startPage = Math.max(1, currentPage - Math.floor(MaxButtons / 2));
  let endPage = startPage + MaxButtons - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - MaxButtons + 1);
  }
  const createBtn = (text, disabled, onClick, active = false) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.disabled = disabled;
    if (active) btn.classList.add("active");
    if (!disabled) btn.addEventListener("click", onClick);
    return btn;
  };
  pagination.appendChild(
    createBtn("«", currentPage === 1, () => {
      currentPage = 1;
      renderProducts(filteredProducts, currentPage);
    })
  );
  pagination.appendChild(
    createBtn("<", currentPage === 1, () => {
      currentPage--;
      renderProducts(filteredProducts, currentPage);
    })
  );
  for (let i = startPage; i <= endPage; i++) {
    pagination.appendChild(
      createBtn(i, false, () => {
        currentPage = i;
        renderProducts(filteredProducts, currentPage);
      })
    );
  }
  pagination.appendChild(
    createBtn(">", currentPage === totalPages, () => {
      currentPage++;
      renderProducts(filteredProducts, currentPage);
    })
  );
  pagination.appendChild(
    createBtn("»", currentPage === totalPages, () => {
      currentPage = totalPages;
      renderProducts(filteredProducts, currentPage);
    })
  );
}

// Save sản phẩm
productForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.querySelector("#productName").value.trim();
  const type = document.querySelector("#productType").value;
  const cate = document.querySelector("#cate").value;
  const collection = document.querySelector("#collection").value;
  const productDesc = document.querySelector("#productDesc").value.trim();
  const color = document
    .querySelector("#productColors")
    .value.split(",")
    .map((c) => c.trim())
    .filter((c) => c);
  const sizes = document
    .querySelector("#sizeList")
    .value.split(",")
    .map((c) => c.trim())
    .filter((c) => c);
  // console.log(sizes);

  let images = selectedImages.length
    ? [...selectedImages]
    : ["./assets/blank-image.png"];

  let products = getProducts();

  if (editingId) {
    const idx = products.findIndex((p) => p.id === editingId);
    products[idx] = {
      ...products[idx],
      name,
      type,
      cate,
      collection,
      productDesc,
      color,
      sizes,
      images,
    };
  } else {
    const id = crypto.randomUUID();
    const data = {
      id,
      name,
      type,
      cate: cate,
      collection: collection,
      productDesc,
      color,
      sizes,
      quantity: 0,
      costPrice: 0,
      profitPercent: 0,
      price: 0,
      gender: "",
      images,
      hidden: true,
    };
    products.push(data);
  }

  saveProducts(products);
  filteredProducts = getProducts();
  renderProducts(filteredProducts, currentPage);
  closeModal();
});

const previewContainer = document.getElementById("previewContainer");
let selectedImages = [];
// Mở modal products
function openModal(editId = null) {
  editingId = editId;
  const modal = document.getElementById("productModal");
  const form = document.getElementById("productForm");
  const sizeList = document.getElementById("sizeList");
  const placeholder = document.querySelector(".placeholder-text");

  modal.style.display = "flex";
  document.body.style.overflow = "hidden";

  imageInput.value = "";
  selectedImages = [];
  // Reset ảnh preview
  previewContainer.innerHTML =
    '<span class="placeholder-text">+ Add Images</span>';

  // Reset size list
  sizeList.innerHTML = "";

  if (editId) {
    const product = getProducts().find((p) => p.id === editId);
    if (!product) return;

    document.querySelector("#modalTitle").textContent = "Edit Product";
    document.querySelector("#productName").value = product.name;
    document.querySelector("#productDesc").value = product.productDesc;
    document.querySelector("#productType").value = product.type;

    const cates = getCates().filter((c) => c.type === typeSelect.value);
    cateSelect.innerHTML =
      `<option value="">-- Chọn loại --</option>` +
      cates.map((t) => `<option value="${t.cate}">${t.cate}</option>`).join("");

    document.querySelector("#cate").value = product.cate;
    if (product.collection) {
      document.querySelector("#collection").value = product.collection;
    } else {
      document.querySelector("#collection").value = "none";
    }

    document.querySelector("#productColors").value = (product.color || []).join(
      ", "
    );
    document.querySelector("#sizeList").value = (product.sizes || []).join(
      ", "
    );

    // === Hiển thị ảnh ===
    if (product.images && product.images.length > 0) {
      selectedImages = [...product.images];
      renderPreview();
    } else {
      placeholder.style.display = "block";
    }
  } else {
    // document.querySelector("#modalTitle").textContent = "Add Product";
    form.reset();
    placeholder.style.display = "block";
  }
}

function closeModal() {
  productModal.style.display = "none";
  document.body.style.overflow = "auto";
  editingId = null;
}
// Event delegation cho nút Edit/Delete
productTable.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const id = btn.dataset.id;
  // console.log(id);
  if (btn.classList.contains("btn-edit")) {
    openModal(id);
  } else if (btn.classList.contains("btn-delete")) {
    const products = getProducts().filter((p) => p.id === id);
    openConfirm("Delete product", `you want delete ${products.name}`, () => {
      const products = getProducts().filter((p) => p.id !== id);
      saveProducts(products);
      renderProducts();
    });
  }
});

// Mở popup products
openAddBtn.addEventListener("click", () => openModal());
cancelModalBtn.addEventListener("click", closeModal);

function renderPreview() {
  previewContainer.innerHTML = "";
  selectedImages.forEach((s, i) => {
    const img = document.createElement("img");
    img.src = s;
    img.dataset.index = i;
    img.addEventListener("click", () => {
      selectedImages.splice(i, 1);
      renderPreview();
    });
    previewContainer.appendChild(img);
  });
  if (selectedImages.length === 0) {
    previewContainer.innerHTML = `
    '<span class="placeholder-text">+ Add Images</span>';`;
  }
}
// Ảnh preview
imageInput.addEventListener("change", (e) => {
  const files = Array.from(e.target.files);

  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      selectedImages.push(reader.result); //
      const img = document.createElement("img");
      img.src = reader.result;
      previewContainer.appendChild(img); //
    };
    reader.readAsDataURL(file);
  });

  // Ẩn placeholder nếu có
  const placeholder = previewContainer.querySelector(".placeholder-text");
  if (placeholder) placeholder.style.display = "none";
});

// ====== 3 LỌC & TÌM KIẾM ======
function filterProducts() {
  const keyword = document.querySelector("#searchProduct").value.toLowerCase();
  const type = document.querySelector("#filterType").value;

  let products = getProducts();

  if (keyword) {
    products = products.filter((p) => p.name.toLowerCase().includes(keyword));
  }

  if (type && type !== "all") {
    products = products.filter(
      (p) => p.cate.toUpperCase() === type.toUpperCase()
    );
  }

  filteredProducts = products; // Cập nhật danh sách sau khi lọc
  currentPage = 1; // Quay về trang đầu
  renderProducts(filteredProducts, currentPage);
}

// ====== 4 SỰ KIỆN ======
document
  .querySelector("#searchProduct")
  .addEventListener("input", filterProducts);
document
  .querySelector("#filterType")
  .addEventListener("change", filterProducts);

// Nút reset filter
document.querySelector(".resetproduct").addEventListener("click", () => {
  document.querySelector("#searchProduct").value = "";
  document.querySelector("#filterType").value = "all";
  filteredProducts = getProducts();
  currentPage = 1;
  renderProducts(filteredProducts, currentPage);
});

// Load danh sách loại cho select
function loadTypeOptions() {
  const types = getTypes();
  typeSelect.innerHTML =
    `<option value="">-- Chọn loại --</option>` +
    types.map((t) => `<option value="${t.name}">${t.name}</option>`).join("");
  typeSelect.addEventListener("change", () => {
    const cates = getCates().filter((c) => c.type === typeSelect.value);
    cateSelect.innerHTML =
      `<option value="">-- Chọn loại --</option>` +
      cates.map((t) => `<option value="${t.cate}">${t.cate}</option>`).join("");
  });
}

// ====================== store ================
let currentPageStore = 1;
const itemsPerPageStore = 6; // số sản phẩm mỗi trang
let filteredStore = getProducts();

// ==== HÀM RENDER DANH SÁCH SẢN PHẨM TRONG STORE ====
function renderStore(products = getProducts(), page = 1) {
  const container = document.querySelector(".item-store-list");
  container.innerHTML = "";

  if (products.length === 0) {
    container.innerHTML = `<p style="text-align:center;color:#888">No products found.</p>`;
    document.getElementById("pagination").innerHTML = "";
    return;
  }

  // Tính phân trang
  const start = (page - 1) * itemsPerPageStore;
  const end = start + itemsPerPageStore;
  // const paginated = products.slice(start, end);

  // Render từng sản phẩm
  for (let i = start; i < end && i < products.length; i++) {
    const p = products[i];
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
      <div class="img-box">
        <img src="${p.images?.[0] || "./assets/blank-image.png"}" alt="${
      p.name
    }">
      </div>
      <div class="content-card">
        <div class="card-store">
          <h3>${p.name}</h3>
          <p class="cost-price"><b>Cost:</b> ${p.costPrice?.toLocaleString(
            "vi-VN"
          )}₫</p>
          <p class="profitPercent"><b>Profit:</b>
            <span id="profit-store">${p.profitPercent || 0}%</span>
          </p>
          <p class="price"><b>Price:</b> ${p.price?.toLocaleString(
            "vi-VN"
          )}₫</p>
          <p class="stock"><b>Stock:</b> ${p.quantity ?? 0}</p>
        </div>
      </div>
      <div class="card-btn card-btn-store">
        <button class="btn-hide" data-id="${p.id}">
          ${p.hidden ? "Show" : "Hide"}
        </button>
        <button class="btn-edit" data-id="${p.id}">Edit</button>
      </div>
    `;
    container.appendChild(card);
  }

  renderPaginationStore(products);
}

// ==== HÀM PHÂN TRANG ====
function renderPaginationStore(products) {
  const pagination = document.getElementById("pagination-store");
  pagination.innerHTML = "";

  const totalPages = Math.ceil(products.length / itemsPerPageStore);
  if (totalPages <= 1) return;

  let maxButtons = 5; // Số nút trang hiển thị tối đa
  let startPage = Math.max(1, currentPageStore - Math.floor(maxButtons / 2));
  let endPage = startPage + maxButtons - 1;

  // Giới hạn cuối danh sách
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxButtons + 1);
  }
  // Hàm tạo nút
  const createBtn = (text, disabled, onClick, active = false) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.disabled = disabled;
    if (active) btn.classList.add("active");
    if (!disabled) btn.addEventListener("click", onClick);
    return btn;
  };
  // Nút về đầu «
  pagination.appendChild(
    createBtn("«", currentPageStore === 1, () => {
      currentPageStore = 1;
      renderStore(filteredStore, currentPageStore);
    })
  );
  // Nút trước <
  pagination.appendChild(
    createBtn("<", currentPageStore === 1, () => {
      currentPageStore--;
      renderStore(filteredStore, currentPageStore);
    })
  );
  // Các nút trang chính
  for (let i = startPage; i <= endPage; i++) {
    pagination.appendChild(
      createBtn(i, currentPageStore === i, () => {
        currentPageStore = i;
        renderStore(filteredStore, currentPageStore);
      })
    );
  }
  // Nút sau >
  pagination.appendChild(
    createBtn(">", currentPageStore === totalPages, () => {
      currentPageStore++;
      renderStore(filteredStore, currentPageStore);
    })
  );

  pagination.appendChild(
    createBtn("»", currentPageStore === totalPages, () => {
      currentPageStore = totalPages;
      renderStore(filteredStore, currentPageStore);
    })
  );
}

// ==== BỘ LỌC ====

function applyFilter() {
  const filterType = document.getElementById("store-filterType").value;
  const filterPrice = document.getElementById("filterStore").value;
  const inputs = document.querySelectorAll(".input-store");
  const from = Number(inputs[0].value) || 0;
  const to = Number(inputs[1].value) || Infinity;

  let list = getProducts();

  // Lọc theo loại
  if (filterType !== "all") {
    list = list.filter(
      (p) => p.cate.toUpperCase() === filterType.toUpperCase()
    );
  }
  if (filterPrice === "cost") {
    list = list.filter((p) => p.costPrice >= from && p.costPrice <= to);
  } else if (filterPrice === "profit") {
    list = list.filter(
      (p) => (p.profitPercent ?? 0) >= from && (p.profitPercent ?? 0) <= to
    );
  } else if (filterPrice === "price") {
    list = list.filter((p) => p.price >= from && p.price <= to);
  }

  filteredStore = list;
  currentPageStore = 1;
  renderStore(filteredStore, currentPageStore);
}

document
  .getElementById("store-filterType")
  .addEventListener("change", applyFilter);

document.getElementById("filterStore").addEventListener("change", applyFilter);
document.querySelectorAll(".input-store").forEach((i) => {
  i.addEventListener("input", applyFilter);
});

// Nút reset
document.querySelector(".resetStore").addEventListener("click", () => {
  document.getElementById("store-filterType").value = "all";
  document.querySelectorAll(".input-store").forEach((i) => (i.value = ""));
  document.getElementById("filterStore").value = "all";
  filteredStore = getProducts();
  renderStore(filteredStore, 1);
});

// ==== XỬ LÝ NÚT ====
document.querySelector(".item-store-list").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const id = btn.dataset.id;
  const products = getProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return;

  // === Ẩn/hiện sản phẩm ===
  if (btn.classList.contains("btn-hide")) {
    products[idx].hidden = !products[idx].hidden;
    if (products[idx].hidden) {
      message("hidden product store");
    } else message("show product store");
    saveProducts(products);
    applyFilter();
    // filteredStore = getProducts();
    // renderStore(filteredStore, currentPageStore);
  }

  // === Edit lợi nhuận ===
  else if (btn.classList.contains("btn-edit")) {
    const card = btn.closest(".item-card");
    const profitEl = card.querySelector(".profitPercent");

    // Tạo input để chỉnh lợi nhuận
    profitEl.innerHTML = `
      <b>Profit:</b>
      <input id="profit-store-input" type="number" value="${products[idx].profitPercent}" min="0" max="100" style="width:60px;">
      <button id="saveProfitBtn" class="btn-small">ok</button>
      <button id="cancelProfitBtn" class="btn-small">X</button>
    `;

    // Gắn sự kiện Save
    const input = profitEl.querySelector("#profit-store-input");
    const saveBtn = profitEl.querySelector("#saveProfitBtn");
    const cancelBtn = profitEl.querySelector("#cancelProfitBtn");

    saveBtn.addEventListener("click", () => {
      if (isNaN(input.value) || input.value < 0) {
        message("Invalid profit percent");
        input.focus();
        input.value = products[idx].profitPercent || 0;
        return;
      }
      const newProfit = parseFloat(input.value) || 0;

      // Cập nhật giá bán = giá vốn * (1 + % lợi nhuận)
      products[idx].profitPercent = newProfit;
      products[idx].price = Math.round(
        products[idx].costPrice * (1 + newProfit / 100)
      );

      saveProducts(products);
      applyFilter();
      // filteredStore = getProducts();
      // renderStore(filteredStore, currentPageStore);
    });

    cancelBtn.addEventListener("click", () => {
      applyFilter();
      // filteredStore = getProducts();
      // renderStore(filteredStore, currentPageStore);
    });
  }
});
// Show category profit modal
document.querySelector(".category-profit").addEventListener("click", () => {
  // console.log("open category profit modal");
  document.getElementById("categoryProfitModal").classList.add("active");
});

// Close category profit modal
document.getElementById("closeCategoryProfit").addEventListener("click", () => {
  document.getElementById("categoryProfitModal").classList.remove("active");
});

// render category profit table
function renderCategoryProfitTable() {
  const tbody = document.querySelector(".category-profit-list tbody");
  tbody.innerHTML = "";
  const cates = getCates();
  // table
  cates.forEach((c) => {
    const tr = document.createElement("tr");
    tr.innerHTML += `
      <td>${c.cate}</td>
      <td>${c.profitPercent || 0}%</td>
      <td><button class="btn-edit-category" data-cate="${
        c.cate
      }">Edit</button></td>
    `;
    tbody.appendChild(tr);
  });
  // attach edit event
}

// chi cap nhat lai cac san pham co profit nho hon profit cua category
document
  .querySelector(".category-profit-list tbody")
  .addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const cate = btn.dataset.cate;
    if (!cate) return;

    if (btn.classList.contains("btn-edit-category")) {
      const row = btn.closest("tr");
      const profitCell = row?.children?.[1];
      const actionCell = row?.children?.[2];
      if (!profitCell || !actionCell || profitCell.querySelector("input"))
        return;

      const current = parseFloat(profitCell.textContent) || 0;
      profitCell.innerHTML = `
      <input type="number" class="category-profit-input" value="${current}" min="0" style="width:64px;">`;
      actionCell.innerHTML = `
      <button class="btn-small btn-save-category" data-cate="${cate}">ok</button>
      <button class="btn-small btn-cancel-category" data-cate="${cate}">X</button>
      `;
      return;
    }

    if (btn.classList.contains("btn-cancel-category")) {
      renderCategoryProfitTable();
      return;
    }
    const cates = getCates();
    const category = cates.find((c) => c.cate === cate);
    if (!category) return;

    if (btn.classList.contains("btn-save-category")) {
      const row = btn.closest("tr");
      const input = row?.querySelector(".category-profit-input");
      if (!input) return;

      const value = parseFloat(input.value);
      if (isNaN(value) || value < 0) {
        message("Invalid profit percent");
        input.focus();
        input.value = category.profitPercent || 0;
        return;
      }

      category.profitPercent = value;
      saveCates(cates);

      // Cập nhật lại tất cả sản phẩm thuộc category này
      const products = getProducts();
      products.forEach((p) => {
        if (
          p.cate.toUpperCase() === cate.toUpperCase() &&
          (p.profitPercent || 0) < value
        ) {
          p.profitPercent = value;
          p.price = Math.round(p.costPrice * (1 + value / 100));
        }
      });
      saveProducts(products);

      renderStore(filteredStore, currentPageStore);
      renderCategoryProfitTable();
      message(`Updated "${cate}" profit to ${value}%`);
    }
  });

renderCategoryProfitTable();

// ==== KHỞI TẠO ====
renderStore(filteredStore, currentPageStore);

// Cập nhật thống kê
function updateSummary() {
  const products = getProducts();
  const total = products.length;
  const totalStock = products.reduce((sum, p) => sum + (p.quantity || 0), 0);
  const low = products.filter((p) => p.quantity > 0 && p.quantity < 5).length;
  const out = products.filter((p) => p.quantity === 0).length;

  document.querySelector("#totalProduct").textContent = total;
  document.querySelector("#totalStock").textContent = totalStock;
  document.querySelector("#lowStock").textContent = `${low} sản phẩm`;
  document.querySelector("#outStock").textContent = `${out} sản phẩm`;
}

// ====== TÌM KIẾM REALTIME ======

function close_repo() {
  document.querySelector(".sidebar").classList.toggle("open");
  sidebar.classList.remove("collapsed");
}

document
  .querySelector(".repo-menu")
  .addEventListener("click", () => close_repo());

document.querySelector(".close-repo").addEventListener("click", () => {
  document.querySelector(".sidebar").classList.toggle("open");
});

// ============= toast ==============
function message(text) {
  const msg = document.createElement("div");
  msg.textContent = text;
  msg.classList.add("toast");
  msg.style.cssText =
    "position:fixed;top:100px;right:20px;background:#000;color:#fff;padding:8px 16px;border-radius:8px;opacity:0.9;z-index:9999;";
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 1500);
}

// init render
renderDashboard();
renderUsers();
renderTypeTable();
loadTypeOptions();
renderProducts();
renderfilter(filterProductsType);
renderfilter(document.getElementById("filterType-inven"));
renderfilter(document.getElementById("store-filterType"));
renderOrders();
renderImports();
renderInventory();
updateSummary();
