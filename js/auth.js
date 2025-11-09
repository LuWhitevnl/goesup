document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("loginPass");
  const error = document.querySelector(".error-msg");
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  const found = users.find(
    (u) => u.username === username && u.password === password
  );
  if (found && found.locked) {
    message("account your locked! khen admin dep trai de mo khoa");
    return;
  }
  if (!found) {
    message("sai ten dang nhap hoac mk");
    passwordInput.classList.add("error");
    usernameInput.classList.add("error");
    usernameInput.value = "";
    passwordInput.value = "";
    error.style.display = "block";
    error.textContent = "sai tai khoan hoac mat khau";
    setTimeout(() => {
      error.style.display = "none";
      usernameInput.classList.remove("error");
      passwordInput.classList.remove("error");
      error.textContent = "";
    }, 3000);
    usernameInput.focus();
    return;
  }
  // console.log("da dang nhap");
  message("logined! hú hú");
  localStorage.setItem("logined", true);
  localStorage.setItem("currentUser", JSON.stringify(found));
  setTimeout(() => {
    window.location.href = "index.html"; // hoặc "index.html"
  }, 1000);
});

// --- Lấy danh sách người dùng ---
function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function saveCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
  localStorage.setItem("logined", true);
}

const hoInput = document.getElementById("Ho");
const tenInput = document.getElementById("ten");
const emailInput = document.getElementById("Email");
const passwordInput = document.getElementById("res-pass");

document
  .getElementById("registerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const ho = hoInput.value.trim();
    const ten = tenInput.value.trim();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value.trim();

    if (!ho || !ten || !email || !password) {
      message("Please fill out all required fields!");
      // console.log({ password });
      return;
    }

    const hoTenRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
    const emailRegex = /^[\w.-]+@[\w.-]+\.\w+$/;
    if (!hoTenRegex.test(ho) || !hoTenRegex.test(ten)) {
      validate(tenInput, "Name contains invalid characters!");
      validate(hoInput, "Name contains invalid characters!");
      return;
    }
    if (!emailRegex.test(email)) {
      validate(emailInput, "Email is not valid!");
      return;
    }

    // Lấy danh sách users từ localStorage
    const users = getUsers();

    // Kiểm tra trùng email
    const exists = users.some((u) => u.email === email);
    if (exists) {
      validate(emailInput, "Email is already registered!");
      valid = false;
    }

    // Tạo user mới
    const newUser = {
      username: email.split("@")[0], // có thể thay bằng random id
      name: `${ho} ${ten}`,
      email,
      locked: false,
      password,
      phoneNumber: "",
      address: "",
      gender: "",
      date: "",
    };

    // Lưu vào localStorage
    users.push(newUser);
    saveUsers(users);
    saveCurrentUser(newUser);
    console.log(1);
    message("Account created successfully!");
    // registerForm.reset();

    // (Tuỳ chọn) Chuyển hướng sang trang chính hoặc account
    setTimeout(() => {
      window.location.href = "index.html"; // hoặc "index.html"
    }, 1000);
  });

function validate(input, errorMsg) {
  message(errorMsg);
  input.value = "";
  input.classList.add("error");
  setTimeout(() => {
    input.classList.remove("error");
  }, 3000);
  input.focus();
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
