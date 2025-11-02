document.addEventListener("DOMContentLoaded", function () {
  // =========================================================================== Tùy chỉnh Content Left ===========================================================================
  // Lấy các phần tử cần thiết
  const bigImg = document.querySelector(".Big_img img");
  const smallImgsContainer = document.querySelector(".Small_imgs");
  const smallImgs = document.querySelectorAll(".imgs_form_list");
  const prevButton = document.querySelector(".prev_button");
  const nextButton = document.querySelector(".next_button");

  // Kích thước bước cuộn ngang
  // Giả sử ảnh nhỏ là 80px và gap là 10px
  const scrollStep = 90; // 80px + 10px gap

  //Hàm cập nhật ảnh lớn và highlight ảnh nhỏ
  function updateImages(targetImg) {
    if (!targetImg) return;
    // Cập nhật ảnh lớn
    bigImg.src = targetImg.src;

    // Xóa highlight cũ và thêm highlight mới
    smallImgs.forEach((img) => img.classList.remove("active"));
    targetImg.classList.add("active");

    //Chuyển động mượt hơn
    targetImg.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }

  // Target vào ảnh đầu tiên
  if (smallImgs.length > 0) {
    updateImages(smallImgs[0]);
  }

  // Khi HOVER vào ảnh nhỏ
  smallImgs.forEach((img) => {
    img.addEventListener("click", function () {
      updateImages(this);
    });
  });

  // Xử lý sự kiện nút NEXT (ảnh sẽ tiến tới)
  nextButton.addEventListener("click", function () {
    const nextActive = document.querySelector(".imgs_form_list.active");
    if (nextActive) {
      // Di chuyển đển ảnh tiếp theo
      let nextImg = nextActive.nextElementSibling;

      // Nếu không có ảnh kế tiếp thì quay lại ảnh đầu tiên
      if (!nextImg && smallImgs.length > 0) nextImg = smallImgs[0];

      // Cuộn container để ảnh mới nằm trong tầm nhìn
      if (nextImg) updateImages(nextImg);
    }
  });

  // Xử lý sự kiện nút PREV (ảnh sẽ lùi lại)
  prevButton.addEventListener("click", function () {
    const prevActive = document.querySelector(".imgs_form_list.active");
    if (prevActive) {
      // Di chuyển lùi về ảnh tiếp theo
      let prevImg = prevActive.previousElementSibling;

      // Nếu không có ảnh kế tiếp thì quay lại ảnh cuối
      if (!prevImg && smallImgs.length > 0)
        prevImg = smallImgs[smallImgs.length - 1];

      // Cuộn container để ảnh mới nằm trong tầm nhìn
      if (prevImg) updateImages(prevImg);
    }
  });

  // =========================================================================== Tùy chỉnh Content Right ===========================================================================
  const colorOptions = document.querySelectorAll(".choose_color li");

  function updateImages_listColor(targetImg) {
    if (!targetImg) return;
    // Cập nhật ảnh từ COLOR lên ảnh lớn
    bigImg.src = targetImg.querySelector("img").src;

    //Xóa thuộc tính 'active' ra khỏi tất cả các tùy chọn của li
    colorOptions.forEach((option) => option.classList.remove("active"));
  }
  colorOptions.forEach((img) => {
    img.addEventListener("click", function () {
      updateImages_listColor(this);
    });
  });
  //------------------------------- Khi bấm vào các ô chọn COLOR sẽ hiện dấu tích -------------------------------------
  colorOptions.forEach((option) => {
    option.addEventListener("click", function () {
      //Xóa class 'selected' khỏi TẤT CẢ các lựa chọn color khác
      colorOptions.forEach((item) => {
        item.classList.remove("selected");
      });

      //Thêm class 'selected' cho lựa chọn hiện tại
      this.classList.add("selected");

      console.log("Color selected: ", this.textContent.trim());
    });
  });

  //------------------------------- Khi bấm vào các ô chọn SIZE sẽ hiện dấu tích -------------------------------------
  const sizeOptions = document.querySelectorAll(".choose_size li");
  sizeOptions.forEach((option) => {
    option.addEventListener("click", function () {
      //Xóa class 'selected' khỏi TẤT CẢ các lựa chọn size khác
      sizeOptions.forEach((item) => {
        item.classList.remove("selected");
      });

      //Thêm class 'selected' cho lựa chọn hiện tại
      this.classList.add("selected");

      console.log("Size selected: ", this.textContent.trim());
    });
  });
});

// --------------------------------------------- Tăng/Giảm số lượng ---------------------------------------------
function quantity_plus() {
  const inputPlus = document.getElementById("quantity_number");
  let currentValue = parseInt(inputPlus.value);

  currentValue += 1;
  inputPlus.value = currentValue;
}

function quantity_minus(buttonElement) {
  const inputMinus = document.getElementById("quantity_number");
  let currentValue = parseInt(inputMinus.value);

  if (!isNaN(currentValue) && currentValue > 1) {
    currentValue -= 1;
    inputMinus.value = currentValue;
  }
  if (currentValue === 1) buttonElement.disabled = true;
}

function select() {
  this.selected();
}

// --------- Kiểm tra xem COLOR và SIZE đã được chọn hay chưa để có thể bấm được ADD TO BAG ---------
function addToBag() {
  // Lấy phần tử đã được selected
  const selectorColor = document.querySelector(".choose_color li.selected");
  const selectorSize = document.querySelector(".choose_size li.selected");
  const quantityInput = document.getElementById("quantity_number").value;
  const productName = document
    .querySelector("#Name_product h3")
    .textContent.trim();
  const quantity = parseInt(quantityInput);

  // Trả về true nếu đã được chọn
  let isValid = true;

  // Nếu COLOR chưa được chọn
  if (!selectorColor) {
    // Highlight lên
    document.getElementById("color").style.border = "solid 1px red";
    isValid = false;
  } else {
    document.getElementById("color").style.border = "none";
  }

  // Nếu SIZE chưa được chọn
  if (!selectorSize) {
    // Highlight lên
    document.getElementById("size").style.border = "solid 1px red";
    isValid = false;
  } else {
    document.getElementById("size").style.border = "none";
  }

  // Nếu mọi thứ hợp lệ, tiến hành thêm vào giỏ hàng
  if (isValid) {
    // Lấy thông tin chi tiết của sản phẩm
    const productDetail = {
      name: productName, //Lấy tên
      colorSrc: selectorColor.querySelector("img").src, // Màu sắc
      size: selectorSize.textContent.trim(), // Kích cỡ
      quantity: quantity, // Số lượng
    };
    window.currentSelectProduct = productDetail;

    console.log(window.currentSelectedProduct);

    alert(
      `Added ${quantity} product '${productName}' (Color, Size: ${productDetail.size})`
    );
  }
}
