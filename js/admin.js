// ==================== SIDEBAR ====================
const sidebar = document.querySelector(".sidebar");
const toggle = document.querySelector(".toggle");
// const dropdownMenus = document.querySelectorAll(".menu-item.has-dropdown");

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

// ==================== QUẢN LÝ LOẠI SẢN PHẨM ====================

// ============== DOM Dashboard =================
const cardrevenue = document.querySelector(".revenue p");
const CardnewOrder = document.querySelector(".newOrder p");
const client = document.querySelector(".client p");
const Cardinven = document.querySelector(".invento p");

// ===================== DOM user ==================
const userTableBody = document.querySelector("#userTable tbody");
const searchUserInput = document.getElementById("searchUser");
const filteruser = document.getElementById("filterUser");

const confirmModal = document.getElementById("confirmModal");
const confirmTitle = document.getElementById("confirmTitle");
const confirmMessage = document.getElementById("confirmMessage");
const confirmCancel = document.getElementById("confirmCancel");
const confirmOk = document.getElementById("confirmOk");

const userModal = document.getElementById("userModal");
const userModalTitle = document.getElementById("userModalTitle");
const userForm = document.getElementById("userForm");
const userCancel = document.getElementById("userCancel");

// ============== DOM type products =================
const typeModal = document.getElementById("typeModal");
const typeForm = document.getElementById("typeForm");
const typeTable = document.querySelector("#typeTable tbody");
const btnAdd = document.getElementById("openAddType");
const btnCancel = document.getElementById("typeCancel");
const modalTitle = document.getElementById("typeModalTitle");
const searchBox = document.getElementById("searchType");

let editIndex = -1;

// =================== DOM Products ======================
const productTable = document.querySelector(".item-list");
const productModal = document.querySelector("#productModal");
const openAddBtn = document.querySelector("#openAddProduct");
const cancelModalBtn = document.querySelector("#cancelModal");
const productForm = document.querySelector("#productForm");
const picPreview = document.querySelector(".pic-preview");
const imageInput = document.querySelector("#productImage");
const typeSelect = document.querySelector("#productType");
const filterProductsType = document.getElementById("filterType");

let editingId = null;

// ======== DOM orders ========
const orderTable = document.querySelector("#orderTable tbody");
const orderModal = document.getElementById("orderModal");
const orderDetails = document.getElementById("order-details__box");
const orderStatusSelect = document.getElementById("orderStatus");
const closeModalBtn = document.getElementById("closeOrderModal");
const updateStatusBtn = document.getElementById("updateOrderStatus");

let editingOrderId = null;

// ============= DOM imports ================
const importTable = document.querySelector("#importTable tbody");
const importModal = document.getElementById("importModal");
const importForm = document.getElementById("importForm");
const importModalTitle = document.getElementById("importModalTitle");
const addImportProductBtn = document.getElementById("addImportProduct");
const productImportList = document.getElementById("productImportList");

let editingImportId = null;

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

// =========== get set ================
// type
const getTypes = () => JSON.parse(localStorage.getItem("productTypes")) || [];
const saveTypes = (data) =>
  localStorage.setItem("productTypes", JSON.stringify(data));

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

// ============== render ===============

// dashboard

// --- Hàm render toàn bộ số liệu ---
function renderDashboard() {
  // Tính doanh thu tháng này
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const orders = getOrders();
  const products = getProducts();
  const customer = getUsers();
  console.log(customer);
  const monthlyRevenue = orders
    .filter(
      (o) =>
        o.status === "Đã giao" &&
        new Date(o.date).getMonth() === currentMonth &&
        new Date(o.date).getFullYear() === currentYear
    )
    .reduce((sum, o) => sum + (o.total || 0), 0);

  // so khach hang moi
  const clientCount = customer.filter((c) => !c.locked).length;

  // Đếm đơn hàng mới (chưa giao)
  const newOrder = orders.filter((o) => o.status === "Mới đặt").length;
  console.log(newOrder);
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

// RENDER USERS
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
          <button class="btn-edit" data-username="${u.username}">Sửa</button>
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
        <button class="btn-edit" data-index="${i}">Sửa</button>
        <button class="btn-delete" data-index="${i}">Xóa</button>
          </div>
      </td>
    `;
    typeTable.appendChild(tr);
  });

  // Mở modal thêm
  btnAdd.onclick = () => {
    console.log(1);
    modalTitle.textContent = "Thêm loại sản phẩm";
    typeForm.reset();
    editIndex = -1;
    typeModal.style.display = "flex";
  };

  // Hủy
  btnCancel.onclick = () => {
    typeModal.style.display = "none";
  };

  // Lưu
  typeForm.onsubmit = (e) => {
    e.preventDefault();
    const code = document.getElementById("typeCode").value.trim();
    const name = document.getElementById("typeName").value.trim();
    const desc = document.getElementById("typeDesc").value.trim();

    if (!code || !name) return alert("Vui lòng nhập mã và tên loại!");

    let typeList = getTypes();
    const data = { code, name, desc };

    if (editIndex === -1) typeList.push(data);
    else typeList[editIndex] = data;

    saveTypes(typeList);
    renderTypeTable();
    typeModal.style.display = "none";
    loadTypeOptions();
  };

  // Sửa
  document.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.onclick = () => {
      console.log(1);
      const typeList = getTypes();
      editIndex = btn.dataset.index;
      const t = typeList[editIndex];
      document.getElementById("typeCode").value = t.code;
      document.getElementById("typeName").value = t.name;
      document.getElementById("typeDesc").value = t.desc;
      modalTitle.textContent = "Sửa loại sản phẩm";
      typeModal.style.display = "flex";
    };
  });

  // Xóa
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

function renderfilter() {
  const types = getTypes(); // Hàm getTypes() phải có dữ liệu
  filterProductsType.innerHTML =
    `<option value="all">All</option>` +
    types.map((t) => `<option value="${t.name}">${t.name}</option>`).join("");
}

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
        <button class="btn-view btn-cancel" data-id="${order.id}">Xem</button>
      </td>
    `;
    orderTable.appendChild(row);
  });
}

// HIỂN THỊ DANH SÁCH PHIẾU NHẬP
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
            imp.status === "Chưa hoàn thành"
              ? `<button class="btn-save" onclick="completeImport('${imp.id}')">Hoàn thành</button>
                 <button class="btn-cancel" onclick="deleteImport('${imp.id}')">Xóa</button>`
              : `<button class="btn-cancel" disabled>Hoàn tất</button>`
          }
        </td>
      </tr>`
    )
    .join("");
}

/*  RENDER KHO  */
function renderInventory() {
  const tbody = document.querySelector("#inventoryTable tbody");
  const products = getProducts();
  const imports = getKho();
  const orders = getOrders();

  tbody.innerHTML = "";

  if (products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;">Chưa có sản phẩm nào</td></tr>`;
    return;
  }

  products.forEach((prod) => {
    const importedQty = imports
      .filter((i) => i.productId === prod.id && i.status === "Đã hoàn thành")
      .reduce((sum, i) => sum + i.quantity, 0);

    const exportedQty = orders
      .filter((o) => o.status === "Đã giao")
      .flatMap((o) => o.items)
      .filter((item) => item.productId === prod.id)
      .reduce((sum, item) => sum + item.quantity, 0);

    const stock = prod.quantity ?? 0;

    let status = "Còn hàng",
      statusColor = "";
    if (stock === 0) {
      status = "Hết hàng";
      statusColor = "#ff5252";
    } else if (stock < 5) {
      status = "Sắp hết";
      statusColor = "#ff9340";
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${prod.name}</td>
      <td>${prod.type}</td>
      <td>${stock}</td>
      <td>${importedQty}</td>
      <td>${exportedQty}</td>
      <td>${prod.costPrice ? prod.costPrice.toLocaleString() + "₫" : "-"}</td>
      <td class="${
        status === "Hết hàng"
          ? "danger"
          : status === "Sắp hết"
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
  });

  attachAddMoreEvents();
}

// =============== open close popup =================
// Mở modal products
function openModal(editId = null) {
  editingId = editId;
  productModal.style.display = "flex";
  document.body.style.overflow = "hidden";

  if (editId) {
    const product = getProducts().find((p) => p.id === editId);
    document.querySelector("#modalTitle").textContent = "Sửa sản phẩm";
    document.querySelector("#productName").value = product.name;
    document.querySelector("#productProfit").value = product.profitPercent;
    document.querySelector("#productDesc").value = product.productDesc;
    document.querySelector("#productType").value = product.type;
    picPreview.src = product.image;
  } else {
    document.querySelector("#modalTitle").textContent = "Thêm sản phẩm";
    productForm.reset();
    picPreview.src = "../assets/blank-image.png";
  }
}

function closeModal() {
  productModal.style.display = "none";
  document.body.style.overflow = "auto";
  editingId = null;
}

// Mở popup products
openAddBtn.addEventListener("click", () => openModal());
cancelModalBtn.addEventListener("click", closeModal);

// mo popup order
function closeOrderDetail() {
  console.log(2);
  orderModal.style.display = "none";
  document.body.style.overflow = "auto";
  editingOrderId = null;
}
orderTable.addEventListener("click", (e) => {
  if (!e.target.classList.contains("btn-view")) return;

  const id = e.target.dataset.id;
  const order = getOrders().find((o) => o.id.toString() === id.toString());
  if (!order) return;

  // Không cho xem nếu đã giao (tuỳ mục đích bạn)
  if (order.status === "Đã giao") return;

  editingOrderId = id;

  // ✅ Render danh sách sản phẩm trong đơn
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

  // ✅ Tính các phần còn lại (ship, thuế, tổng)
  const ship = order.shipFee || 0;
  const tax = order.tax || 0;
  const total = order.total + ship + tax;

  // ✅ Render toàn bộ modal
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
  console.log(2);
  orderModal.style.display = "none";
  document.body.style.overflow = "auto";
  editingOrderId = null;
});

orderModal.addEventListener("click", (e) => {
  if (e.target === orderModal) {
    closeOrderDetail();
  }
});

// mo popup import
function openAddImport(productId = null) {
  console.log(4);
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
    <input type="number" placeholder="Giá nhập" class="import-price" min="0" value="${costPrice}"/>
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
  console.log(3);
  openAddImport();
});

//  HỦY
document.getElementById("cancelImport").addEventListener("click", () => {
  importModal.style.display = "none";
});

// ================= luu sua xoa ==================
// Lưu sản phẩm
productForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.querySelector("#productName").value.trim();
  const type = document.querySelector("#productType").value;
  let costPrice = 0;
  const profitPercent = +document.querySelector("#productProfit").value;
  let price = 0;
  let productDesc = document.querySelector("#productDesc").value.trim();
  let quantity = 0;
  let image = picPreview.src;
  let file = imageInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => (image = reader.result);
    reader.readAsDataURL(file);
  } else {
    image = "../assets/blank-image.png";
  }

  let products = getProducts();

  if (editingId) {
    const idx = products.findIndex((p) => p.id === editingId);
    price = products[idx].costPrice * (1 + profitPercent / 100);
    costPrice = products[idx].costPrice;
    quantity = products[idx].quantity;
    const id = products[idx].id;
    const data = {
      id,
      name,
      type,
      costPrice,
      profitPercent,
      price,
      productDesc,
      quantity,
      image,
    };
    products[idx] = data;
  } else {
    const id = crypto.randomUUID();
    const data = {
      id,
      name,
      type,
      costPrice,
      profitPercent,
      price,
      productDesc,
      quantity,
      image,
    };
    products.push(data);
  }

  saveProducts(products);
  renderProducts();
  closeModal();
});

// Event delegation cho nút sửa/xóa
productTable.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const id = btn.dataset.id;
  console.log(id);
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

// luu import
importForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const imports = getData("imports");
  const products = getData("products");

  const date = document.getElementById("importDate").value;
  const rows = Array.from(document.querySelectorAll(".import-product-item"));

  if (rows.length === 0) {
    alert("Vui lòng thêm ít nhất 1 sản phẩm.");
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
      status: "Chưa hoàn thành",
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
  if (!imp || imp.status === "Đã hoàn thành") return;

  const prod = products.find((p) => p.id === imp.productId);
  if (prod) {
    prod.quantity = (prod.quantity || 0) + imp.quantity;

    prod.costPrice = imp.price;
    prod.price = imp.price * (1 + prod.profitPercent / 100);
  }

  imp.status = "Đã hoàn thành";
  setData("imports", imports);
  setData("products", products);
  renderImports();
  renderInventory();
  renderProducts();
  renderTypeTable();
  updateSummary();
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

// ==================== QUẢN LÝ SẢN PHẨM ====================
let currentPage = 1;
const itemsPerPage = 3;
let filteredProducts = getProducts();

// ====== 1 HIỂN THỊ SẢN PHẨM ======
function renderProducts(products = filteredProducts, page = 1) {
  const productTable = document.querySelector(".item-list");
  productTable.innerHTML = "";

  // Giới hạn sản phẩm theo trang
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = products.slice(start, end);

  if (pageItems.length === 0) {
    productTable.innerHTML = `<p class="no-data">Không có sản phẩm nào.</p>`;
    return;
  }

  pageItems.forEach((p) => {
    const statusClass =
      p.quantity === 0 ? "danger" : p.quantity < 5 ? "low" : "ok";
    const statusText =
      p.quantity === 0 ? "Hết hàng" : p.quantity < 5 ? "Sắp hết" : "Còn hàng";

    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
      <div class="img-box">
        <img src="${p.image || "./assets/default.webp"}" alt="${p.name}" />
      </div>
      <div class="content-card">
        <div class="card-title">
          <h3 class="name">${p.name}</h3>
          <span class="type">${p.type || "Không có"}</span>
        </div>
        <div class="card-price">
          <div class="price">${p.price.toLocaleString("vi-VN")}đ</div>
          <div class="status ${statusClass}">${statusText}</div>
        </div>
        <div class="card-desc card-more_info">
          <span>Mô tả: ${p.productDesc || "Không có mô tả"}</span>
        </div>
        <div class="card-more_info">
          <div>
            <span>Giá vốn</span>
            <div class="cost-price">${p.costPrice.toLocaleString(
              "vi-VN"
            )}đ</div>
          </div>
          <div>
            <span>Lợi nhuận</span>
            <div class="profit-precent">${p.profitPercent}%</div>
          </div>
        </div>
        <div class="card-btn-box">
          <span>Stock: ${p.quantity}</span>
          <div class="card-btn">
            <button class="btn-edit" data-id="${p.id}">Sửa</button>
            <button class="btn-delete" data-id="${p.id}">Xóa</button>
          </div>
        </div>
      </div>
    `;
    productTable.appendChild(card);
  });

  renderPagination(products);
}

// ====== 2 PHÂN TRANG ======
function renderPagination(products = filteredProducts) {
  const pagination = document.getElementById("pagination");
  if (!pagination) return;

  pagination.innerHTML = "";
  const totalPages = Math.ceil(products.length / itemsPerPage);
  if (totalPages <= 1) return;

  const createBtn = (text, disabled, onClick) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.disabled = disabled;
    if (!disabled) btn.onclick = onClick;
    return btn;
  };

  pagination.appendChild(
    createBtn("«", currentPage === 1, () => {
      currentPage--;
      renderProducts(products, currentPage);
    })
  );

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.classList.toggle("active", i === currentPage);
    btn.onclick = () => {
      currentPage = i;
      renderProducts(products, currentPage);
    };
    pagination.appendChild(btn);
  }

  pagination.appendChild(
    createBtn("»", currentPage === totalPages, () => {
      currentPage++;
      renderProducts(products, currentPage);
    })
  );
}

// ====== 3 LỌC & TÌM KIẾM ======
function filterProducts() {
  const keyword = document.querySelector("#searchProduct").value.toLowerCase();
  const type = document.querySelector("#filterType").value;

  let products = getProducts();

  if (keyword) {
    products = products.filter((p) => p.name.toLowerCase().includes(keyword));
  }

  if (type && type !== "all") {
    products = products.filter((p) => p.type === type);
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
  const types = getTypes(); // Hàm getTypes() phải có dữ liệu
  typeSelect.innerHTML =
    `<option value="">-- Chọn loại --</option>` +
    types.map((t) => `<option value="${t.name}">${t.name}</option>`).join("");
}
// Ảnh preview
imageInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => (picPreview.src = reader.result);
    reader.readAsDataURL(file);
    picPreview.style.opacity = 1;
  }
});

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

// ======== Cập nhật trạng thái đơn ========
updateStatusBtn.addEventListener("click", () => {
  if (!editingOrderId) return;

  const newStatus = orderStatusSelect.value;
  const orders = getOrders();
  const order = orders.find(
    (o) => o.id.toString() === editingOrderId.toString()
  );
  if (!order) return;
  // Nếu chuyển sang "Đã giao" và chưa trừ kho
  if (order.status !== "Đã giao" && newStatus === "Đã giao") {
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

// ====== TÌM KIẾM REALTIME ======
document.getElementById("searchImport").addEventListener("input", () => {
  const keyword = document.getElementById("searchImport").value.toLowerCase();
  const filtered = getData("imports").filter((i) =>
    i.productName.toLowerCase().includes(keyword)
  );
  renderImports(filtered);
});

/* ====== SỰ KIỆN NHẬP THÊM ====== */
function attachAddMoreEvents() {
  document.querySelectorAll(".btn-addmore").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productId = btn.dataset.id;
      const products = getProducts();
      const product = products.find((p) => p.id === productId);
      if (!product) return alert("Không tìm thấy sản phẩm");

      openAddImport(productId);
      renderInventory();
    });
  });
}

// USERS MANAGEMENT JS

function openUserModal(user = null) {
  userModalTitle.textContent = "edit user";
  userModal.style.display = "flex";
  if (user) {
    document.getElementById("u_username").value = user.username;
    document.getElementById("u_username").disabled = true; // không sửa username
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
      alert("Người dùng không tồn tại");
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
    return alert("Username đã tồn tại, chọn username khác.");
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
    alert("Người dùng không tồn tại");
    return;
  }

  if (btn.classList.contains("btn-reset")) {
    openConfirm(
      "Reset mật khẩu",
      `Đặt lại mật khẩu của ${username} về '123'?`,
      () => {
        users[idx].password = "123";
        saveUsers(users);
        alert(`Đã reset mật khẩu ${username} -> 123`);
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
    openConfirm("Xóa người dùng", `Bạn có chắc muốn xóa ${username}?`, () => {
      users.splice(idx, 1);
      saveUsers(users);
      renderUsers(searchUserInput.value);
    });
  }
});

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

// init render
renderDashboard();
renderUsers();
renderTypeTable();
loadTypeOptions();
renderProducts();
renderfilter();
renderOrders();
renderImports();
renderInventory();
updateSummary();
