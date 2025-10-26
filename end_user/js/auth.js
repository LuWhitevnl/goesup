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
  localStorage.setItem("logined", true);
  localStorage.setItem("currentUser", JSON.stringify(found));
  window.location.href = "index.html";
});
