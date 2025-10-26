// bien search
const openBtn = document.getElementById("search-btn");
const closeBtn = document.getElementById("close-search");
const search_container = document.getElementById("search-ex");
const searchBox = document.getElementById("searchBox");
const overlay = document.querySelector(".overlay");
// bien nut chuyen slide
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
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

// bien nut gio hang
const cart = document.querySelector(".cart");

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
 * kiem tra click nut next hoac prev de them item vao slider
 */
const moveSlider = (direction) => {
  // tao bien trong ham de moi lan chay ham se goi list slider moi
  const slider = document.querySelector(".slider");
  const items = document.querySelectorAll(".slider .item");
  if (items.length === 0 || !slider) return;

  if (direction === "next") {
    slider.appendChild(items[0]);
  } else if (direction === "prev") {
    slider.prepend(items[items.length - 1]);
  }
};

nextBtn?.addEventListener("click", () => moveSlider("next"));
prevBtn?.addEventListener("click", () => moveSlider("prev"));

// slider di chuyen theo thoi gian
let autoSilder = setInterval(() => moveSlider("next"), 5000);

/**
 *dong mo popup dang nhap dang ky khi click bien tuong user
 */
function openLogForm() {
  if (JSON.parse(localStorage.getItem("logined"))) {
    window.location.href = "account.html";
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

// cart
cart.addEventListener("click", () => {
  openLogForm();
});
