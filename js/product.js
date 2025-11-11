// Ẩn/hiện từng dropdown
document.querySelectorAll(".filter-toggle").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    toggle.closest(".filter-group").classList.toggle("active");
  });
});

const filterBtn = document.querySelector(".hide-filter-btn");
document.querySelector(".hide-filter-btn").addEventListener("click", () => {
  document.querySelector(".filter-sidebar").classList.toggle("hide");
  filterBtn.innerHTML = `${
    filterBtn.textContent.includes("Show")
      ? `Hide Filters <span class="material-symbols-outlined"> page_info </span>`
      : `Show Filters <span class="material-symbols-outlined"> page_info </span>`
  }`;
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

const store = getProducts().filter((e) => !e.hidden);
let filteredProducts = store;
let currentPage = 1;
const itemPerPage = 9;

function renderProducts(list = filteredProducts, page = 1) {
  const start = (page - 1) * itemPerPage;
  const end = start + itemPerPage;
  // const pageProducts = list.slice(start, end);

  item.innerHTML = `(${filteredProducts.length})`;
  productsList.innerHTML = "";
  for (let i = start; i < end && i < list.length; i++) {
    const p = list[i];
    const card = document.createElement("div");
    const image = p.images[0];
    card.classList.add("item");
    card.setAttribute("data-id", p.id);
    card.innerHTML = `
              <div class="item-img">
                <img src="${image}" alt="${p.name}" />
              </div>
              <div class="detail">
                <p><b>${p.name}</b></p>
                <p style="color: grey">${p.cate}</p>
                <p><b>${p.price.toLocaleString("vi-VN")} đ</b></p>
              </div>
              <button class="add-cart-btn" data-id="${
                p.id
              }">add to cart</button>
    `;
    productsList.appendChild(card);
  }
  productsList.onclick = (e) => {
    const addBtn = e.target.closest(".add-cart-btn");
    if (addBtn) {
      e.stopPropagation();
      addToCart(addBtn.dataset.id);
      return;
    }

    const item = e.target.closest(".item");
    if (item) {
      openProductDetail(item.dataset.id);
    }
  };
  renderPagination(list);
  // sortProducts();
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
  const sizeSelected = Array.from(
    document.querySelectorAll(`.filter-size input[type="checkbox"]:checked`)
  ).map((i) => i.value);
  const minPriceInput = document.getElementById("min-price");
  const maxPriceInput = document.getElementById("max-price");
  const minPrice = parseFloat(minPriceInput.value) || 0;
  const maxPrice = parseFloat(maxPriceInput.value) || Infinity;

  // console.log(sizeSelected);
  let result = filteredProducts.filter((p) => {
    let matchPrice = true;
    let matchSize = true;

    if (sizeSelected.length > 0) {
      matchSize = p.sizes?.some((s) => sizeSelected.includes(s));
    }

    let price = parseFloat(p.price);
    if (priceRange === "0-1000") matchPrice = price < 1000000;
    else if (priceRange === "1000-5000")
      matchPrice = price >= 1000000 && price <= 5000000;
    else if (priceRange === "5000-10000")
      matchPrice = price >= 5000000 && price <= 10000000;
    else if (priceRange === "10000+") matchPrice = price > 10000000;

    if (minPrice || maxPrice !== Infinity) {
      matchPrice = matchPrice && price >= minPrice && price <= maxPrice;
    }

    return matchPrice && matchSize;
  });
  currentPage = 1;
  // console.log(filteredProducts);
  renderProducts(result, currentPage);
}

document.querySelectorAll(`input[name="price"]`).forEach((i) => {
  i.addEventListener("change", () => {
    filterProducts();
  });
});
document
  .querySelectorAll(`.filter-size input[type="checkbox"]`)
  .forEach((i) => {
    i.addEventListener("change", () => {
      filterProducts();
    });
  });

document.getElementById("apply-price").addEventListener("click", () => {
  const minPrice = document.getElementById("min-price").value;
  const maxPrice = document.getElementById("max-price").value;
  if (minPrice && maxPrice && parseFloat(minPrice) > parseFloat(maxPrice)) {
    message("Minimum price cannot be greater than maximum price.");
    document.getElementById("min-price").focus();
    return;
  }
  if (minPrice < 0 || maxPrice < 0) {
    message("Price cannot be negative.");
    document.getElementById("min-price").focus();
    return;
  }
  filterProducts();
});

const urlPara = new URLSearchParams(window.location.search);
const genderPara = urlPara.get("cate");
const subPara = urlPara.get("sub");
const productId = urlPara.get("id");
const searchKey = urlPara.get("search");

// neu co searchKey thi loc san pham theo ten
if (searchKey) {
  filteredProducts = store.filter(
    (p) =>
      p.name.toLowerCase().includes(searchKey.toLowerCase()) ||
      p.cate.toLowerCase().includes(searchKey.toLowerCase()) ||
      p.type.toLowerCase().includes(searchKey.toLowerCase()) ||
      p.collection?.toLowerCase().includes(searchKey.toLowerCase())
  );
  const titleProduct = document.querySelector(".title-product");
  if (titleProduct) {
    titleProduct.innerHTML = `
          <span class="title-product"
            >Search results for "<strong>${searchKey}</strong>" <strong class="count-item">(${filteredProducts.length})</strong
          ></span>`;
  }
}

// neu co productId thi mo trang chi tiet sp
if (productId) {
  openProductDetail(productId);
} else if (genderPara) {
  filteredProducts = store.filter((p) => {
    const type = (p.type || "").toLowerCase();
    const cate = (p.cate || "").toLowerCase();
    const collection = (p.collection || "").toLowerCase();

    // genderPara neu la collection thi lay san pham co collection khac none va theo subPara
    // lay theo type so voi genderPara va cate so voi subPara
    if (genderPara.toLowerCase() === "collection") {
      if (subPara) {
        return (
          collection !== "none" &&
          collection.toLowerCase() === subPara.toLowerCase()
        );
      } else {
        return collection !== "none";
      }
    } else if (genderPara) {
      if (subPara) {
        return (
          type === genderPara.toLowerCase() &&
          cate.toLowerCase() === subPara.toLowerCase()
        );
      } else {
        return type === genderPara.toLowerCase();
      }
    }
  });
  currentPage = 1;
  renderProducts(filteredProducts, currentPage);
  const titleProduct = document.querySelector(".title-product");
  if (titleProduct) {
    titleProduct.innerHTML = `
          <span class="title-product"
            >${subPara ? subPara : genderPara} <strong class="count-item">(${
      filteredProducts.length
    })</strong
          ></span>`;
  }
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
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (option === "price-Low-High") {
    filteredProducts.sort((a, b) => a.price - b.price);
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
    el.value = "";
  });
  // filteredProducts = store;
  currentPage = 1;
  // sortProducts();
  renderProducts(filteredProducts, currentPage);
});

function addToCart(id, color = null, size = null, quantity = 1) {
  const products = store;
  const cart = getCart();
  const user = JSON.parse(localStorage.getItem("currentUser"));

  if (!user || !user.username) {
    message("Please log in before adding to cart!");
    return;
  }

  const product = products.find((p) => p.id === id);
  if (!product) return;

  const selectedColor =
    color || (product.color && product.color[0]) || product.color || "default";
  const selectedSize =
    size || (product.sizes && product.sizes[0]) || product.sizes || "none";
  const selectedImage = (product.images && product.images[0]) || product.image;

  const existing = cart.find(
    (c) => c.id === id && c.color === selectedColor && c.size === selectedSize
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      user: user.username,
      name: product.name,
      type: product.type,
      cate: product.cate,
      collection: product.collection,
      color: selectedColor,
      size: selectedSize,
      price: product.price,
      desc: product.productDesc,
      quantity: quantity,
      image: selectedImage,
      checked: true,
    });
  }

  saveCart(cart);
  loadCartHeader();
  message("Added to cart!");
}

renderProducts();

const productsPage = document.querySelector(".products-page");
const detailPage = document.querySelector(".product-detail-page");

document.querySelector(".product-list-item").addEventListener("click", (e) => {
  const item = e.target.closest(".item");
  if (item && !e.target.classList.contains("add-cart-btn")) {
    openProductDetail(item.dataset.id);
  }
});

function renderProductDetail(product) {
  if (!product) return;

  // Hiện trang chi tiết sản phẩm (ẩn trang danh sách)
  document.querySelector(".product-detail-page").style.display = "block";
  document.querySelector(".product-list-section")?.classList.add("hidden");

  // ==== ẢNH CHÍNH ====
  const bigImg = document.querySelector(".Big_img img");
  bigImg.src =
    product.images?.[0] || product.image || "./assets/blank-image.png";

  // ==== DANH SÁCH ẢNH NHỎ ====
  const smallImgsContainer = document.querySelector(".Small_imgs");
  smallImgsContainer.innerHTML = "";
  const imgList = product.images?.length ? product.images : [product.image];

  imgList.forEach((img, i) => {
    const imgEl = document.createElement("img");
    imgEl.src = img;
    imgEl.className = "imgs_form_list";
    if (i === 0) imgEl.classList.add("active");

    // 👉 Khi click vào ảnh nhỏ thì đổi ảnh lớn
    imgEl.addEventListener("click", () => {
      document
        .querySelectorAll(".imgs_form_list")
        .forEach((el) => el.classList.remove("active"));
      imgEl.classList.add("active");
      bigImg.src = img;
    });

    smallImgsContainer.appendChild(imgEl);
  });

  // ==== NÚT NEXT / PREV ====
  const nextBtn = document.querySelector(".next_button");
  const prevBtn = document.querySelector(".prev_button");
  let currentIndex = 0;

  nextBtn.onclick = () => {
    currentIndex = (currentIndex + 1) % imgList.length;
    bigImg.src = imgList[currentIndex];
    updateActiveImg(currentIndex);
  };

  prevBtn.onclick = () => {
    currentIndex = (currentIndex - 1 + imgList.length) % imgList.length;
    bigImg.src = imgList[currentIndex];
    updateActiveImg(currentIndex);
  };

  function updateActiveImg(index) {
    document
      .querySelectorAll(".imgs_form_list")
      .forEach((el, i) => el.classList.toggle("active", i === index));
  }

  // ==== TÊN, GIÁ, MÔ TẢ ====
  document.querySelector("#Name_product h3").textContent = product.name;
  document.querySelector("#price p").textContent =
    product.price.toLocaleString("vi-VN") + "₫";
  document.querySelector(".text_info_product").textContent =
    product.productDesc || "No description available.";

  // ==== COLOR ====
  const colorContainer = document.querySelector(".choose_color");
  colorContainer.innerHTML = "";
  const colors = product.color?.length
    ? product.color
    : [product.color || "gray"];

  colors.forEach((color, i) => {
    const li = document.createElement("li");
    li.innerHTML = `<img src="${
      product.images?.[i] || product.images?.[0] || product.image
    }" alt="${color}" />`;
    li.dataset.color = color;

    li.addEventListener("click", () => {
      document
        .querySelectorAll(".choose_color li")
        .forEach((i) => i.classList.remove("selected"));
      li.classList.add("selected");
      // Khi chọn màu => đổi ảnh lớn theo ảnh tương ứng (nếu có)
      if (product.images?.[i]) {
        bigImg.src = product.images[i];
        updateActiveImg(i);
      }
    });

    colorContainer.appendChild(li);
  });

  // ==== SIZE ====
  const sizeContainer = document.querySelector(".choose_size");
  sizeContainer.innerHTML = "";
  const sizes = product.sizes?.length ? product.sizes : [product.sizes || "M"];

  sizes.forEach((s) => {
    const li = document.createElement("li");
    li.textContent = s;
    li.dataset.size = s;
    li.addEventListener("click", () => {
      document
        .querySelectorAll(".choose_size li")
        .forEach((i) => i.classList.remove("selected"));
      li.classList.add("selected");
    });
    sizeContainer.appendChild(li);
  });

  // ==== QUANTITY ====
  const qtyInput = document.getElementById("quantity_number");
  qtyInput.value = 1;

  const plusBtn = document.querySelector(".quantity_plus");
  const minusBtn = document.querySelector(".quantity_minus");

  plusBtn.onclick = () => {
    qtyInput.value = parseInt(qtyInput.value) + 1;
  };

  minusBtn.onclick = () => {
    qtyInput.value = Math.max(1, parseInt(qtyInput.value) - 1);
  };

  // ==== ADD TO CART ====
  document.querySelector(".addBag").onclick = () => {
    const selectedColor = document.querySelector(".choose_color li.selected");
    const selectedSize = document.querySelector(".choose_size li.selected");
    const quantity = parseInt(qtyInput.value);

    if (!selectedColor || !selectedSize) {
      message("Please select color and size first!");
      return;
    }

    addToCart(
      product.id,
      selectedColor.dataset.color,
      selectedSize.dataset.size,
      quantity
    );

    message("Added to cart successfully!");
  };
}

function openProductDetail(productId) {
  const products = JSON.parse(localStorage.getItem("products")) || [];
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  document.querySelector(".products-page").style.display = "none";
  document.querySelector(".product-detail-page").style.display = "block";

  renderProductDetail(product);
}

function message(text) {
  const msg = document.createElement("div");
  msg.textContent = text;
  msg.classList.add("toast");
  msg.style.cssText =
    "position:fixed;top:100px;right:20px;background:#000;color:#fff;padding:8px 16px;border-radius:8px;opacity:0.9;z-index:9999;";
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 1500);
}
