// bien search
const openBtn = document.querySelector(".search-bar");
const closeBtn = document.getElementById("close-search");
const search_container = document.getElementById("search-ex");
const searchBox = document.getElementById("searchBox");
const overlay = document.querySelector(".overlay");

// bien popup dang nhap
const userBtn = document.querySelector(".user");
const formWrapper = document.querySelector(".formWapper");
const popupBox = document.querySelector(".popupBox");
const closeFormBtn = document.querySelector(".close-form");
// bien nut dang nhap va form
const loginBtn = document.querySelector("#loginBtn");
const registerBtn = document.querySelector("#registerBtn");
const switchBg = document.querySelector(".switch-bg");
const loginForm = document.querySelector("#loginForm");
const registerForm = document.querySelector("#registerForm");

/**
 *ham tien ich tai su dung
 *togleActive dung toggle() 2 tham so them xoa class
 *disableScroll() tat mo viec cuon trang, thuong dung khi mo popup
 *focusInput tu dong focus vao input khi mo form
 */
const toggleActive = (element, state) => {
  if (!element) return;
  element.classList.toggle("active", state);
};

const disableScroll = (disable) => {
  document.body.style.overflow = disable ? "hidden" : "auto";
};

const focusInput = (id) => {
  const input = document.getElementById(id);
  if (input) input.focus();
};

/*
 *dung toggle them class active dong mo search
 *kiem tra click vao overlay (nen ben duoi popup) de dong
 */
openBtn?.addEventListener("click", () => {
  toggleActive(search_container, true);
  toggleActive(searchBox, true);
  toggleActive(closeBtn, true);
  toggleActive(overlay, true);
  renderSearchExtend();
  setTimeout(() => focusInput("search-input"), 100);
});

closeBtn?.addEventListener("click", () => {
  toggleActive(search_container, false);
  toggleActive(searchBox, false);
  toggleActive(closeBtn, false);
  toggleActive(overlay, false);
});

overlay?.addEventListener("click", (e) => {
  if (e.target === overlay || e.target === search_container) {
    toggleActive(search_container, false);
    toggleActive(searchBox, false);
    toggleActive(closeBtn, false);
    toggleActive(overlay, false);
  }
});

/**
 *dong mo popup dang nhap dang ky khi click bien tuong user
 */
function openLogForm() {
  if (JSON.parse(localStorage.getItem("logined"))) {
    return;
  }
  toggleActive(formWrapper, true);
  toggleActive(popupBox, true);
  toggleActive(loginForm, true);
  toggleActive(registerForm, false);
  switchBg.style.left = "2px";
  disableScroll(true);
  setTimeout(() => focusInput("username"), 100);
}
userBtn?.addEventListener("click", () => {
  openLogForm();
});

closeFormBtn?.addEventListener("click", () => {
  toggleActive(formWrapper, false);
  toggleActive(popupBox, false);
  disableScroll(false);
});

// click nen de dong popup
formWrapper?.addEventListener("click", (e) => {
  if (e.target === formWrapper) {
    toggleActive(formWrapper, false);
    toggleActive(popupBox, false);
    disableScroll(false);
  }
});

/**
 *nut chuyen form
 */
loginBtn?.addEventListener("click", () => {
  loginBtn.classList.add("active");
  registerBtn.classList.remove("active");
  toggleActive(loginForm, true);
  toggleActive(registerForm, false);
  switchBg.style.left = "2px";
  setTimeout(() => focusInput("username"), 100);
});

registerBtn?.addEventListener("click", () => {
  registerBtn.classList.add("active");
  loginBtn.classList.remove("active");
  toggleActive(loginForm, false);
  toggleActive(registerForm, true);
  switchBg.style.left = "calc(50% + 2px)";
  setTimeout(() => focusInput("Ho"), 100);
});

// bien nut gio hang
const cart = document.querySelector(".cart");
const user = document.querySelector(".user");
// cart
cart.addEventListener("click", () => {
  const currentUser = JSON.parse(localStorage.getItem("logined"));
  if (currentUser) {
    localStorage.setItem("cartView", "cart");
    window.location.href = "cart.html";
  } else {
    openLogForm();
  }
});
user.addEventListener("click", () => {
  const currentUser = JSON.parse(localStorage.getItem("logined"));
  if (currentUser) {
    localStorage.setItem("cartView", "account");
    window.location.href = "cart.html";
  } else {
    openLogForm();
  }
});

function loadCartHeader() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const carts = cart.filter((c) => c.user === user.username);
  if (carts.length !== 0) {
    document.querySelector(".product-cart").classList.add("empty");
    document.querySelector(".product-cart").textContent = carts.length;
  } else {
    document.querySelector(".product-cart").classList.remove("empty");
  }
}

loadCartHeader();

function message(text) {
  const msg = document.createElement("div");
  msg.textContent = text;
  msg.classList.add("toast");
  msg.style.cssText =
    "position:fixed;top:100px;right:20px;background:#000;color:#fff;padding:8px 16px;border-radius:8px;opacity:0.9;z-index:9999;";
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 1500);
}

// === Mở và đóng overlay tìm kiếm ===
const searchInput = document.getElementById("search-input");
const suggestList = document.getElementById("suggestList");
const recentList = document.getElementById("recentList");

// === Lấy lịch sử từ localStorage ===
function getRecentSearches() {
  return JSON.parse(localStorage.getItem("recentSearches")) || [];
}
function saveRecentSearch(keyword) {
  let history = getRecentSearches();
  if (keyword.trim() !== "") {
    // Không trùng
    history = [keyword, ...history.filter((x) => x !== keyword)];
    // Giới hạn 10 từ khóa
    if (history.length > 10) history = history.slice(0, 10);
    localStorage.setItem("recentSearches", JSON.stringify(history));
  }
}

// === Hiển thị lịch sử khi mở ===
function renderRecentSearches() {
  const history = getRecentSearches();
  recentList.innerHTML = history
    .map((h) => `<li class="recent-item">${h}</li>`)
    .join("");
}
renderRecentSearches();

// === Khi gõ từ khóa → gợi ý realtime ===
searchInput.addEventListener("input", (e) => {
  const keyword = e.target.value.trim().toLowerCase();
  const products = getProducts().filter((p) => !p.hidden);

  if (!keyword) {
    suggestList.innerHTML = "";
    return;
  }

  const matches = products.filter(
    (p) =>
      p.name.toLowerCase().includes(keyword) ||
      p.cate.toLowerCase().includes(keyword) ||
      p.type.toLowerCase().includes(keyword) ||
      p.collection?.toLowerCase().includes(keyword)
  );

  if (matches.length === 0) {
    suggestList.innerHTML = `<li>Không tìm thấy sản phẩm phù hợp</li>`;
  } else {
    suggestList.innerHTML = matches
      .slice(0, 6)
      .map(
        (p) => `
        <li class="suggest-item" data-id="${p.id}">
          <img src="${p.images[0]}" alt="${p.name}">
          <span class="suggest-item__info">
          <span>${p.name}</span>
          <span>${p.cate}</span>
            <span>${p.price.toLocaleString("vi-VN")}đ</span>
          </span>
        </li>`
      )
      .join("");
  }
});

// === Khi click gợi ý → sang product detail ===
suggestList.addEventListener("click", (e) => {
  const item = e.target.closest(".suggest-item");
  if (item) {
    const id = item.dataset.id;
    saveRecentSearch(item.querySelector("span").textContent);
    window.location.href = `./product.html?id=${id}`;
  }
});

// === Khi click lịch sử tìm kiếm → search lại ===
recentList.addEventListener("click", (e) => {
  const li = e.target.closest(".recent-item");
  if (li) {
    const keyword = li.textContent.trim();
    window.location.href = `./product.html?search=${encodeURIComponent(
      keyword
    )}`;
  }
});

// === Khi submit form tìm kiếm → chuyển sang trang products ===
document.getElementById("searchBox").addEventListener("submit", (e) => {
  e.preventDefault();
  const keyword = searchInput.value.trim();
  if (keyword) {
    saveRecentSearch(keyword);
    window.location.href = `./product.html?search=${encodeURIComponent(
      keyword
    )}`;
  }
});

// ================ repo =====================
const menuToggle = document.getElementById("menu-toggle");
const menuClose = document.getElementById("menuclose");
const repoMenu = document.getElementById("repo-menu");
const overlayRepo = document.getElementById("menu-overlay");

// 🔹 Mở menu
menuToggle.addEventListener("click", () => {
  repoMenu.classList.add("active");
  overlayRepo.classList.add("active");
});

// 🔹 Đóng menu
menuClose.addEventListener("click", closeMenu);
overlayRepo.addEventListener("click", closeMenu);

function closeMenu() {
  repoMenu.classList.remove("active");
  overlayRepo.classList.remove("active");
}

// 🔹 Toggle submenu
document.querySelectorAll(".submenu-toggle").forEach((btn) => {
  btn.addEventListener("click", () => {
    const submenu = btn.closest("li").querySelector(".listFashion1");

    // Đóng các menu khác
    document.querySelectorAll(".listFashion1.open").forEach((openSub) => {
      if (openSub !== submenu) {
        openSub.classList.remove("open");
        openSub.previousElementSibling
          ?.querySelector(".submenu-toggle")
          ?.classList.remove("rotate");
      }
    });

    submenu.classList.toggle("open");
    btn.classList.toggle("rotate");
  });
});
