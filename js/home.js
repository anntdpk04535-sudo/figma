// =============================================
// home.js - Slider + Hiển thị sản phẩm trang chủ
// =============================================

// ===== SLIDER =====
let slideIndex = 0;
let sliderTimer = null;

function initSlider() {
  const slides = document.querySelectorAll(".slide");
  const dots   = document.querySelectorAll(".dot");
  if (!slides.length) return;

  function goTo(n) {
    slides.forEach((s, i) => s.classList.toggle("active", i === n));
    dots.forEach((d, i)   => d.classList.toggle("active", i === n));
    slideIndex = n;
  }

  function next() { goTo((slideIndex + 1) % slides.length); }
  function prev() { goTo((slideIndex - 1 + slides.length) % slides.length); }

  // Gán sự kiện nút
  const btnNext = document.getElementById("slider-next");
  const btnPrev = document.getElementById("slider-prev");
  if (btnNext) btnNext.addEventListener("click", () => { next(); resetTimer(); });
  if (btnPrev) btnPrev.addEventListener("click", () => { prev(); resetTimer(); });

  // Gán sự kiện dot
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => { goTo(i); resetTimer(); });
  });

  function resetTimer() {
    clearInterval(sliderTimer);
    sliderTimer = setInterval(next, 5000);
  }

  goTo(0);
  resetTimer();
}

// ===== HIỂN THỊ SẢN PHẨM =====
function renderProducts(list) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  if (!list || list.length === 0) {
    grid.innerHTML = `<p class="no-data">Không có sản phẩm nào.</p>`;
    return;
  }

  const categories = getCategories();

  grid.innerHTML = list.map(p => {
    const cat = categories.find(c => c.id === p.categoryId);
    return `
      <div class="product-card" onclick="goDetail(${p.id})">
        <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy" onerror="this.src='https://via.placeholder.com/400x250?text=No+Image'"/>
        <div class="product-body">
          <span class="product-cat">${cat ? cat.name : "Khác"}</span>
          <h3 class="product-name">${p.name}</h3>
          <p class="product-desc">${p.description}</p>
          <div class="product-footer">
            <span class="product-price">${formatPrice(p.price)}</span>
            <button class="btn-detail">Xem chi tiết</button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

// ===== LỌC SẢN PHẨM THEO DANH MỤC =====
function initCategoryFilter() {
  const filterBar = document.getElementById("category-filter");
  if (!filterBar) return;

  const categories = getCategories();
  const products   = getProducts();

  // Render nút lọc
  filterBar.innerHTML = `
    <button class="filter-btn active" data-id="all">Tất cả</button>
    ${categories.map(c => `<button class="filter-btn" data-id="${c.id}">${c.name}</button>`).join("")}
  `;

  // Sự kiện click
  filterBar.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      filterBar.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      this.classList.add("active");

      const id = this.dataset.id;
      if (id === "all") {
        renderProducts(products);
      } else {
        renderProducts(products.filter(p => p.categoryId === parseInt(id)));
      }
    });
  });

  // Render lần đầu
  renderProducts(products);
}

// ===== TÌM KIẾM SẢN PHẨM =====
function initSearch() {
  const input = document.getElementById("search-input");
  if (!input) return;

  input.addEventListener("input", function () {
    const keyword  = this.value.trim().toLowerCase();
    const products = getProducts();
    const filtered = keyword
      ? products.filter(p => p.name.toLowerCase().includes(keyword) || p.description.toLowerCase().includes(keyword))
      : products;
    renderProducts(filtered);
  });
}

// ===== CHUYỂN SANG TRANG CHI TIẾT =====
function goDetail(id) {
  window.location.href = `product-detail.html?id=${id}`;
}

// ===== KHỞI CHẠY TRANG CHỦ =====
document.addEventListener("DOMContentLoaded", function () {
  renderAuthNav();
  initSlider();
  initCategoryFilter();
  initSearch();
});
