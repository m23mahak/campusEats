// ===== LOGIN LOGIC =====
const loginForm = document.getElementById('loginForm');

if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const role = document.getElementById('role').value;

    // Send user to the right page based on role
    if (role === 'customer') window.location.href = 'home.html';
    else if (role === 'vendor') window.location.href = 'vendor.html';
    else if (role === 'agent') window.location.href = 'agent.html';
    else if (role === 'admin') window.location.href = 'home.html';
  });
}

// ===== CART (saved in browser memory) =====
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(name, price, emoji) {
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, emoji, qty: 1 });
  }
  saveCart();
  showToast(`${emoji} ${name} added to cart!`);
  updateCartCount();
}

function updateCartCount() {
  const countEl = document.getElementById('cartCount');
  if (countEl) {
    const total = cart.reduce((sum, item) => sum + item.qty, 0);
    countEl.textContent = `🛒 Cart (${total})`;
  }
}

// ===== TOAST NOTIFICATION =====
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===== CATEGORY FILTER =====
const chips = document.querySelectorAll('.category-chip');
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
  });
});

// Run on page load
updateCartCount();