// =============================================
// auth.js - Xử lý đăng nhập / đăng xuất / phân quyền
// =============================================

// Lấy user đang đăng nhập
function getCurrentUser() {
  return JSON.parse(sessionStorage.getItem("currentUser")) || null;
}

// Lưu user vào session
function setCurrentUser(user) {
  sessionStorage.setItem("currentUser", JSON.stringify(user));
}

// Xóa session (logout)
function logout() {
  sessionStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

// Kiểm tra đã đăng nhập chưa
function requireLogin() {
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "login.html";
    return null;
  }
  return user;
}

// Chỉ admin mới được vào
function requireAdmin() {
  const user = requireLogin();
  if (user && user.role !== "admin") {
    alert("Bạn không có quyền truy cập trang này!");
    window.location.href = "index.html";
    return null;
  }
  return user;
}

// =============================================
// Xử lý form đăng nhập (login.html)
// =============================================
function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();
  const errEl = document.getElementById("login-error");

  // Validate
  if (!email || !password) {
    showError(errEl, "Vui lòng nhập đầy đủ thông tin.");
    return;
  }
  if (!isValidEmail(email)) {
    showError(errEl, "Email không đúng định dạng.");
    return;
  }
  if (password.length < 6) {
    showError(errEl, "Mật khẩu phải có ít nhất 6 ký tự.");
    return;
  }

  // Kiểm tra tài khoản
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    showError(errEl, "Email hoặc mật khẩu không đúng.");
    return;
  }

  setCurrentUser(user);

  // Phân quyền điều hướng
  if (user.role === "admin") {
    window.location.href = "admin.html";
  } else {
    window.location.href = "index.html";
  }
}

// =============================================
// Xử lý form đăng ký (register.html)
// =============================================
function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value.trim();
  const confirm = document.getElementById("reg-confirm").value.trim();
  const errEl = document.getElementById("reg-error");

  if (!name || !email || !password || !confirm) {
    showError(errEl, "Vui lòng nhập đầy đủ thông tin.");
    return;
  }
  if (!isValidEmail(email)) {
    showError(errEl, "Email không đúng định dạng.");
    return;
  }
  if (password.length < 6) {
    showError(errEl, "Mật khẩu phải có ít nhất 6 ký tự.");
    return;
  }
  if (password !== confirm) {
    showError(errEl, "Xác nhận mật khẩu không khớp.");
    return;
  }

  const users = getUsers();
  if (users.find((u) => u.email === email)) {
    showError(errEl, "Email này đã được sử dụng.");
    return;
  }

  const newUser = { id: genId(users), name, email, password, role: "user" };
  users.push(newUser);
  saveUsers(users);

  alert("Đăng ký thành công! Vui lòng đăng nhập.");
  window.location.href = "login.html";
}

// =============================================
// Đổi mật khẩu
// =============================================
function handleChangePassword(e) {
  e.preventDefault();
  const user = getCurrentUser();
  const oldPw = document.getElementById("old-password").value.trim();
  const newPw = document.getElementById("new-password").value.trim();
  const confirm = document.getElementById("confirm-password").value.trim();
  const errEl = document.getElementById("pw-error");
  const okEl = document.getElementById("pw-success");

  okEl && (okEl.style.display = "none");

  if (!oldPw || !newPw || !confirm) {
    showError(errEl, "Vui lòng nhập đầy đủ thông tin.");
    return;
  }
  if (user.password !== oldPw) {
    showError(errEl, "Mật khẩu cũ không đúng.");
    return;
  }
  if (newPw.length < 6) {
    showError(errEl, "Mật khẩu mới phải có ít nhất 6 ký tự.");
    return;
  }
  if (newPw !== confirm) {
    showError(errEl, "Xác nhận mật khẩu không khớp.");
    return;
  }

  const users = getUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  users[idx].password = newPw;
  saveUsers(users);

  const updated = { ...user, password: newPw };
  setCurrentUser(updated);

  errEl && (errEl.style.display = "none");
  if (okEl) {
    okEl.textContent = "Đổi mật khẩu thành công!";
    okEl.style.display = "block";
  }
  e.target.reset();
}

// =============================================
// Helpers
// =============================================
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(el, msg) {
  if (!el) return;
  el.textContent = msg;
  el.style.display = "block";
}

// Hiển thị tên user + nút logout trên navbar
function renderAuthNav() {
  const user = getCurrentUser();
  const navUser = document.getElementById("nav-user");
  if (!navUser) return;

  if (user) {
    navUser.innerHTML = `
      <span class="nav-username">👤 ${user.name}</span>
      ${user.role === "admin" ? '<a href="admin.html" class="nav-link">Admin</a>' : ""}
      <button onclick="logout()" class="btn-logout">Đăng xuất</button>
    `;
  } else {
    navUser.innerHTML = `<a href="login.html" class="btn-login">Đăng nhập</a>`;
  }
}
