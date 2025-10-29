// Ẩn/hiện từng dropdown
document.querySelectorAll(".filter-group").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    // console.log(1);
    toggle.classList.toggle("active");
  });
});

document.querySelector(".hide-filter-btn").addEventListener("click", () => {
  document.querySelector(".filter-sidebar").classList.toggle("hide");
  document.querySelector(".product-list-item").classList.toggle("hide");
});

// render product
const productsList = document.querySelector(".product-list-item");
const item = document.querySelector(".count-item");
const pagination = document.querySelector(".pagination");

// products
const getProducts = () => JSON.parse(localStorage.getItem("products")) || [];
const saveProducts = (data) =>
  localStorage.setItem("products", JSON.stringify(data));

const getCart = () => JSON.parse(localStorage.getItem("cart")) || [];
const saveCart = (data) => localStorage.setItem("cart", JSON.stringify(data));

let filteredProducts = getProducts();
let currentPage = 1;
const itemPerPage = 2;

function renderProducts(list = filteredProducts, page = 1) {
  const start = (page - 1) * itemPerPage;
  const end = start + itemPerPage;
  const pageProducts = list.slice(start, end);

  item.innerHTML = `(${filteredProducts.length})`;
  productsList.innerHTML = "";
  pageProducts.forEach((p) => {
    const card = document.createElement("div");
    card.classList.add("item");
    card.innerHTML = `
              <div class="item-img">
                <img src="${p.image}" alt="${p.name}" />
              </div>
              <div class="detail">
                <p><b>${p.name}</b></p>
                <p style="color: grey">${p.type}</p>
                <p><b>${p.price.toLocaleString("vi-VN")} đ</b></p>
              </div>
              <button class="add-cart-btn" data-id="${
                p.id
              }">add to cart</button>
    `;
    productsList.appendChild(card);
  });
  document.querySelectorAll(".add-cart-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      addToCart(id);
    });
  });
  renderPagination(list);
  loadCartHeader();
}

function renderPagination(list) {
  pagination.innerHTML = "";
  const totalPages = Math.ceil(list.length / itemPerPage);
  if (totalPages <= 1) return;
  const prev = document.createElement("button");
  prev.textContent = "<<";
  prev.disabled = currentPage === 1;
  prev.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      renderProducts(filteredProducts, currentPage);
    }
  };
  pagination.appendChild(prev);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.classList.toggle("active", i === currentPage);
    btn.onclick = () => {
      currentPage = i;
      renderProducts(filteredProducts, currentPage);
    };
    pagination.appendChild(btn);
  }

  const next = document.createElement("button");
  next.textContent = ">>";
  next.disabled = currentPage === totalPages;
  next.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderProducts(filteredProducts, currentPage);
    }
  };
  pagination.appendChild(next);
}

function filterProducts() {
  const priceRange = document.querySelector(
    `input[name="price"]:checked`
  )?.value;
  // console.log(priceRange);
  const color = Array.from(
    document.querySelectorAll(`.colors input[type="checkbox"]:checked`)
  ).map((c) => c.value);
  const gender = Array.from(
    document.querySelectorAll(`.gender input[type="checkbox"]:checked`)
  ).map((c) => c.value);
  console.log(color);
  filteredProducts = getProducts().filter((p) => {
    let matchPrice = true;
    let matchColor = true;
    let matchGender = true;
    let price = parseFloat(p.price);
    if (priceRange === "0-500") matchPrice = price < 500000;
    else if (priceRange === "500-1000")
      matchPrice = price >= 500000 && price <= 1000000;
    else if (priceRange === "1000-2000")
      matchPrice = price >= 1000000 && price <= 2000000;
    else if (priceRange === "2000+") matchPrice = price > 2000000;

    if (gender.length > 0)
      matchGender = gender.includes(p.gender?.toLowerCase());
    if (color.length > 0) matchColor = color.includes(p.color?.toLowerCase());
    return matchPrice && matchColor && matchGender;
  });
  console.log(filteredProducts);
  currentPage = 1;
  renderProducts(filteredProducts, currentPage);
}

document.querySelectorAll(`input[name="price"]`).forEach((i) => {
  i.addEventListener("change", () => {
    filterProducts();
  });
});
document.querySelectorAll(`.colors input[type= "checkbox"]`).forEach((i) => {
  i.addEventListener("change", filterProducts);
});
const urlPara = new URLSearchParams(window.location.search);
const genderPara = urlPara.get("gender");
if (genderPara) {
  const genderInput = document.querySelector(
    `input[name="gender"][value="${genderPara}"]`
  );
  if (genderInput) genderInput.checked = true;
  filterProducts();
}
document.querySelectorAll(`.gender input[name="gender"]`).forEach((i) => {
  i.addEventListener("change", filterProducts);
});

document.querySelector("#sort-products").addEventListener("change", (e) => {
  const sortValue = e.target.value;
  sortProducts(sortValue);
});

function sortProducts(option) {
  if (option === "price-High-Low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (option === "price-Low-High") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (option === "name-az") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (option === "name-za") {
    filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
  }
  currentPage = 1;
  renderProducts(filteredProducts, currentPage);
}

// Reset filter
document.querySelector(".reset-filter").addEventListener("click", () => {
  document.querySelectorAll(".filter-options input").forEach((el) => {
    el.checked = false;
  });
  filteredProducts = getProducts();
  currentPage = 1;
  renderProducts(filteredProducts, currentPage);
});

function addToCart(id) {
  const products = getProducts();
  const cart = getCart();
  const product = products.find((p) => p.id === id);
  if (!product) return;
  const existing = cart.find((c) => c.id === id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      type: product.type,
      gender: product.gender,
      color: product.color,
      price: product.price,
      desc: product.productDesc,
      quantity: 1,
      image: product.image,
    });
  }
  // alert("da them vao gio hang");
  saveCart(cart);
  loadCartHeader();
}

function loadCartHeader() {
  const cart = getCart();
  console.log(cart.length);
  if (cart.length !== 0) {
    document.querySelector(".product-cart").classList.add("empty");
    document.querySelector(".product-cart").textContent = cart.length;
  } else {
    document.querySelector(".product-cart").classList.remove("empty");
  }
}

renderProducts();
