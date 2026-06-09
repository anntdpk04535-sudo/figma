// =============================================
// admin.js - CRUD Sản phẩm & Danh mục
// =============================================

let editingProductId = null;
let editingCategoryId = null;
let currentTab = "products";

// =============================================
// KHỞI CHẠY TRANG ADMIN
// =============================================
document.addEventListener("DOMContentLoaded", function () {
  requireAdmin();
  renderAuthNav();
  renderAdminStats();
  switchTab("products");

  // Gán form submit
  const pForm = document.getElementById("product-form");
  if (pForm) pForm.addEventListener("submit", handleSaveProduct);

  const cForm = document.getElementById("category-form");
  if (cForm) cForm.addEventListener("submit", handleSaveCategory);
});

// =============================================
// THỐNG KÊ DASHBOARD
// =============================================
function renderAdminStats() {
  const products = getProducts();
  const categories = getCategories();
  const users = getUsers();

  setEl("stat-products", products.length);
  setEl("stat-categories", categories.length);
  setEl("stat-users", users.length);
}

// =============================================
// CHUYỂN TAB
// =============================================
function switchTab(tab) {
  currentTab = tab;
  document
    .querySelectorAll(".tab-btn")
    .forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
  document
    .querySelectorAll(".tab-panel")
    .forEach((p) => p.classList.toggle("active", p.id === "tab-" + tab));

  if (tab === "products") renderProductTable();
  if (tab === "categories") renderCategoryTable();
}

// =============================================
// CRUD SẢN PHẨM
// =============================================
function renderProductTable(list) {
  const products = list || getProducts();
  const categories = getCategories();
  const tbody = document.getElementById("product-tbody");
  if (!tbody) return;

  if (products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="no-data">Chưa có sản phẩm nào.</td></tr>`;
    return;
  }

  tbody.innerHTML = products
    .map((p, i) => {
      const cat = categories.find((c) => c.id === p.categoryId);
      return `
      <tr>
        <td>${i + 1}</td>
        <td><img src="${p.image}" alt="${p.name}" class="tbl-img" onerror="this.src='https://via.placeholder.com/60x40'"/></td>
        <td>${p.name}</td>
        <td>${cat ? cat.name : "—"}</td>
        <td>${formatPrice(p.price)}</td>
        <td>
          <button class="btn-edit"   onclick="openEditProduct(${p.id})">Sửa</button>
          <button class="btn-delete" onclick="deleteProduct(${p.id})">Xóa</button>
        </td>
      </tr>
    `;
    })
    .join("");
}

// Mở modal thêm sản phẩm
function openAddProduct() {
  editingProductId = null;
  document.getElementById("product-form").reset();
  document.getElementById("product-modal-title").textContent = "Thêm sản phẩm";
  fillCategoryOptions("product-categoryId");
  showModal("product-modal");
}

// Mở modal sửa sản phẩm
function openEditProduct(id) {
  const products = getProducts();
  const p = products.find((x) => x.id === id);
  if (!p) return;

  editingProductId = id;
  document.getElementById("product-modal-title").textContent = "Sửa sản phẩm";
  fillCategoryOptions("product-categoryId", p.categoryId);

  document.getElementById("product-name").value = p.name;
  document.getElementById("product-price").value = p.price;
  document.getElementById("product-image").value = p.image;
  document.getElementById("product-description").value = p.description;
  document.getElementById("product-features").value = (p.features || []).join(
    "\n",
  );

  showModal("product-modal");
}

// Lưu (thêm hoặc sửa) sản phẩm
function handleSaveProduct(e) {
  e.preventDefault();
  const errEl = document.getElementById("product-error");

  const name = document.getElementById("product-name").value.trim();
  const price = parseFloat(document.getElementById("product-price").value);
  const image = document.getElementById("product-image").value.trim();
  const categoryId = parseInt(
    document.getElementById("product-categoryId").value,
  );
  const description = document
    .getElementById("product-description")
    .value.trim();
  const features = document
    .getElementById("product-features")
    .value.split("\n")
    .map((f) => f.trim())
    .filter(Boolean);

  if (!name || !price || !categoryId || !description) {
    showError(errEl, "Vui lòng nhập đầy đủ thông tin bắt buộc.");
    return;
  }
  if (isNaN(price) || price <= 0) {
    showError(errEl, "Giá phải là số dương.");
    return;
  }

  const products = getProducts();

  if (editingProductId) {
    // Cập nhật
    const idx = products.findIndex((p) => p.id === editingProductId);
    products[idx] = {
      ...products[idx],
      name,
      price,
      image,
      categoryId,
      description,
      features,
    };
  } else {
    // Thêm mới
    products.push({
      id: genId(products),
      name,
      price,
      image,
      categoryId,
      description,
      features,
    });
  }

  saveProducts(products);
  closeModal("product-modal");
  renderProductTable();
  renderAdminStats();
  showToast(
    editingProductId
      ? "Cập nhật sản phẩm thành công!"
      : "Thêm sản phẩm thành công!",
  );
  errEl && (errEl.style.display = "none");
}

// Xóa sản phẩm
function deleteProduct(id) {
  if (!confirm("Bạn có chắc muốn xóa sản phẩm này không?")) return;
  const products = getProducts().filter((p) => p.id !== id);
  saveProducts(products);
  renderProductTable();
  renderAdminStats();
  showToast("Đã xóa sản phẩm!");
}

// Tìm kiếm sản phẩm trong admin
function searchProduct() {
  const kw = document
    .getElementById("admin-search-product")
    .value.trim()
    .toLowerCase();
  const products = getProducts();
  renderProductTable(
    kw ? products.filter((p) => p.name.toLowerCase().includes(kw)) : products,
  );
}

// =============================================
// CRUD DANH MỤC
// =============================================
function renderCategoryTable() {
  const categories = getCategories();
  const products = getProducts();
  const tbody = document.getElementById("category-tbody");
  if (!tbody) return;

  if (categories.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="no-data">Chưa có danh mục nào.</td></tr>`;
    return;
  }

  tbody.innerHTML = categories
    .map((c, i) => {
      const count = products.filter((p) => p.categoryId === c.id).length;
      return `
      <tr>
        <td>${i + 1}</td>
        <td>${c.name}</td>
        <td>${count} sản phẩm</td>
        <td>
          <button class="btn-edit"   onclick="openEditCategory(${c.id})">Sửa</button>
          <button class="btn-delete" onclick="deleteCategory(${c.id})">Xóa</button>
        </td>
      </tr>
    `;
    })
    .join("");
}

function openAddCategory() {
  editingCategoryId = null;
  document.getElementById("category-form").reset();
  document.getElementById("category-modal-title").textContent = "Thêm danh mục";
  showModal("category-modal");
}

function openEditCategory(id) {
  const cat = getCategories().find((c) => c.id === id);
  if (!cat) return;
  editingCategoryId = id;
  document.getElementById("category-modal-title").textContent = "Sửa danh mục";
  document.getElementById("category-name").value = cat.name;
  showModal("category-modal");
}

function handleSaveCategory(e) {
  e.preventDefault();
  const errEl = document.getElementById("category-error");
  const name = document.getElementById("category-name").value.trim();

  if (!name) {
    showError(errEl, "Vui lòng nhập tên danh mục.");
    return;
  }

  const categories = getCategories();

  if (editingCategoryId) {
    const idx = categories.findIndex((c) => c.id === editingCategoryId);
    categories[idx].name = name;
  } else {
    categories.push({ id: genId(categories), name });
  }

  saveCategories(categories);
  closeModal("category-modal");
  renderCategoryTable();
  renderAdminStats();
  showToast(
    editingCategoryId
      ? "Cập nhật danh mục thành công!"
      : "Thêm danh mục thành công!",
  );
  errEl && (errEl.style.display = "none");
}

function deleteCategory(id) {
  const products = getProducts();
  if (products.some((p) => p.categoryId === id)) {
    alert("Không thể xóa danh mục đang có sản phẩm!");
    return;
  }
  if (!confirm("Bạn có chắc muốn xóa danh mục này không?")) return;
  saveCategories(getCategories().filter((c) => c.id !== id));
  renderCategoryTable();
  renderAdminStats();
  showToast("Đã xóa danh mục!");
}

// =============================================
// HELPERS
// =============================================
function fillCategoryOptions(selectId, selectedId) {
  const sel = document.getElementById(selectId);
  const categories = getCategories();
  sel.innerHTML =
    `<option value="">-- Chọn danh mục --</option>` +
    categories
      .map(
        (c) =>
          `<option value="${c.id}" ${c.id === selectedId ? "selected" : ""}>${c.name}</option>`,
      )
      .join("");
}

function showModal(id) {
  const m = document.getElementById(id);
  if (m) {
    m.style.display = "flex";
    document.body.style.overflow = "hidden";
  }
}

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) {
    m.style.display = "none";
    document.body.style.overflow = "";
  }
}

// Đóng modal khi click overlay
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("modal-overlay")) {
    e.target.style.display = "none";
    document.body.style.overflow = "";
  }
});

function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

let toastTimer;
function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 3000);
}
