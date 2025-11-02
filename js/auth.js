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
  if (found.locked) {
    message("account your locked! khen admin dep trai de mo khoa");
    return;
  }
  if (!found) {
    console.log("sai ten dang nhap hoac mk");
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
  console.log("da dang nhap");
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

document
  .getElementById("registerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const ho = document.getElementById("Ho").value.trim();
    const ten = document.getElementById("ten").value.trim();
    const email = document.getElementById("Email").value.trim().toLowerCase();
    const password = document.getElementById("res-pass").value.trim();

    if (!ho || !ten || !email || !password) {
      message("Please fill out all required fields!");
      console.log({ password });
      return;
    }

    // Lấy danh sách users từ localStorage
    const users = getUsers();

    // Kiểm tra trùng email
    const exists = users.some((u) => u.email === email);
    if (exists) {
      message("This email is already registered!");
      document.getElementById("Email").focus();
      return;
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

function message(text) {
  const msg = document.createElement("div");
  msg.textContent = text;
  msg.classList.add("toast");
  msg.style.cssText =
    "position:fixed;top:100px;right:20px;background:#000;color:#fff;padding:8px 16px;border-radius:8px;opacity:0.9;z-index:9999;";
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 1500);
}
