// =============================================
// cart.js - Quản lý logic Giỏ hàng toàn cục
// =============================================

// Lấy giỏ hàng của user hiện tại
function getCart() {
  const user = getCurrentUser();
  if (!user) return [];
  const allCarts = JSON.parse(localStorage.getItem("gym_carts")) || {};
  return allCarts[user.id] || [];
}

// Lưu giỏ hàng của user hiện tại
function saveCart(cart) {
  const user = getCurrentUser();
  if (!user) return;
  const allCarts = JSON.parse(localStorage.getItem("gym_carts")) || {};
  allCarts[user.id] = cart;
  localStorage.setItem("gym_carts", JSON.stringify(allCarts));
}

// Thêm sản phẩm vào giỏ
function addToCart(productId, quantity = 1) {
  const user = getCurrentUser();
  if (!user) {
    if (confirm("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng. Chuyển đến trang đăng nhập?")) {
      window.location.href = "login.html";
    }
    return;
  }

  const products = getProducts();
  const product = products.find(p => p.id === productId);
  if (!product) return;

  let cart = getCart();
  const existingItem = cart.find(item => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity
    });
  }

  saveCart(cart);
  alert(`Đã thêm "${product.name}" vào giỏ hàng thành công!`);
}