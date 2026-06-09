// =============================================
// data.js - Dữ liệu mẫu toàn ứng dụng
// =============================================

// --- Tài khoản mẫu ---
const DEFAULT_USERS = [
  { id: 1, name: "Admin", email: "admin@gym.vn", password: "123456", role: "admin" },
  { id: 2, name: "Nguyễn Văn A", email: "user@gym.vn", password: "123456", role: "user" }
];

// --- Danh mục mẫu ---
const DEFAULT_CATEGORIES = [
  { id: 1, name: "Gói tập cá nhân" },
  { id: 2, name: "Gói tập nhóm" },
  { id: 3, name: "Dụng cụ thể thao" },
  { id: 4, name: "Dinh dưỡng & Supplement" }
];

// --- Sản phẩm mẫu ---
const DEFAULT_PRODUCTS = [
  {
    id: 1, categoryId: 1,
    name: "Gói Cơ Bản 1 Tháng",
    price: 600000,
    image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=600&q=80",
    description: "Tiếp cận toàn bộ khu cardio và khu tạ tự do. Phù hợp người mới bắt đầu.",
    features: ["Vào cửa 7 ngày/tuần", "Khu cardio & tạ tự do", "1 buổi PT miễn phí", "Tủ đồ cá nhân"]
  },
  {
    id: 2, categoryId: 1,
    name: "Gói Nâng Cao 1 Tháng",
    price: 1200000,
    image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=600&q=80",
    description: "Dành cho người tập có kinh nghiệm muốn đẩy mạnh kết quả với PT chuyên sâu.",
    features: ["Toàn bộ quyền lợi Cơ Bản", "4 buổi PT/tháng", "Hồ bơi & phòng sauna", "Tư vấn dinh dưỡng"]
  },
  {
    id: 3, categoryId: 1,
    name: "Gói VIP Premium",
    price: 2500000,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80",
    description: "Trải nghiệm đẳng cấp nhất với dịch vụ cá nhân hóa hoàn toàn.",
    features: ["PT không giới hạn", "Phòng VIP riêng", "Thực đơn dinh dưỡng cá nhân", "Massage & phục hồi"]
  },
  {
    id: 4, categoryId: 2,
    name: "Lớp Yoga Buổi Sáng",
    price: 800000,
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
    description: "Lớp yoga nhóm nhỏ tối đa 15 người, buổi sáng từ 6:00 - 7:30.",
    features: ["12 buổi/tháng", "HLV chứng chỉ quốc tế", "Thảm yoga miễn phí", "Không gian yên tĩnh"]
  },
  {
    id: 5, categoryId: 2,
    name: "Lớp Zumba Năng Động",
    price: 700000,
    image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&q=80",
    description: "Lớp nhảy Zumba sôi động, đốt cháy calories hiệu quả.",
    features: ["16 buổi/tháng", "Nhóm tối đa 20 người", "Phòng tập rộng thoáng", "Có thể thay thế buổi vắng"]
  },
  {
    id: 6, categoryId: 3,
    name: "Bộ Tạ Tay 10kg",
    price: 450000,
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80",
    description: "Bộ tạ tay cao su chất lượng cao, bề mặt chống trơn trượt.",
    features: ["Chất liệu cao su đúc", "Bề mặt nhám chống trơn", "Bảo hành 12 tháng", "Giao hàng tận nơi"]
  },
  {
    id: 7, categoryId: 4,
    name: "Whey Protein 2kg",
    price: 950000,
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&q=80",
    description: "Whey protein tinh khiết, hỗ trợ phục hồi và tăng cơ hiệu quả.",
    features: ["25g protein/serving", "Ít đường & chất béo", "60 lần dùng/hộp", "Nhiều hương vị"]
  },
  {
    id: 8, categoryId: 4,
    name: "BCAA Amino Acid",
    price: 650000,
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80",
    description: "BCAA 2:1:1 hỗ trợ giảm mệt mỏi và bảo vệ cơ bắp khi tập.",
    features: ["Tỷ lệ BCAA 2:1:1", "Hương trái cây tự nhiên", "30 lần dùng/hộp", "Không caffeine"]
  }
];

// =============================================
// Khởi tạo localStorage nếu chưa có
// =============================================
function initData() {
  if (!localStorage.getItem("users")) {
    localStorage.setItem("users", JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem("categories")) {
    localStorage.setItem("categories", JSON.stringify(DEFAULT_CATEGORIES));
  }
  if (!localStorage.getItem("products")) {
    localStorage.setItem("products", JSON.stringify(DEFAULT_PRODUCTS));
  }
}

// =============================================
// Helpers đọc / ghi dữ liệu
// =============================================
function getUsers()      { return JSON.parse(localStorage.getItem("users"))      || []; }
function getCategories() { return JSON.parse(localStorage.getItem("categories")) || []; }
function getProducts()   { return JSON.parse(localStorage.getItem("products"))   || []; }

function saveUsers(data)      { localStorage.setItem("users",      JSON.stringify(data)); }
function saveCategories(data) { localStorage.setItem("categories", JSON.stringify(data)); }
function saveProducts(data)   { localStorage.setItem("products",   JSON.stringify(data)); }

function genId(arr) { return arr.length > 0 ? Math.max(...arr.map(x => x.id)) + 1 : 1; }

function formatPrice(n) {
  return Number(n).toLocaleString("vi-VN") + " đ";
}

// Chạy khởi tạo ngay khi load
initData();
