// menu.js
const MENU_ITEMS = [
  { id: 'macaroons', name: 'Macaroons', price: 4.00, img: 'macron2.jpg', desc: 'Light, colorful, and irresistibly sweet.' },
  { id: 'fullcake',  name: 'Full Chocolate Cake', price: 35.00, img: 'fullcake.jpg', desc: 'Classic, moist, and layered with love.' },
  { id: 'cupcake',   name: 'Cupcake (single)', price: 3.50, img: 'cupcake2.jpg', desc: 'Mini treats with big flavor and style.' },
  
  { id: 'brownie',   name: 'Fudgy Brownie', price: 2.75, img: 'brownie.jpeg', desc: 'Rich chocolatey square.' },
  { id: 'cheesecake',name: 'Cheesecake Slice', price: 5.50, img: 'cheesecake.jpeg', desc: 'Creamy slice with buttery crust.' },
  { id: 'cookies',name: 'Chocolate Chip Cookies', price: 7.50, img: 'cookies.jpg', desc: 'Soft, chewy, and freshly baked — your perfect cookie craving fix.' },

  { id: 'smores', name: 'Choco Mallow Delight', price: 8.00, img: 'smores.jpg', desc: 'Gooey marshmallow, chocolate, and crunchy graham layers.' },
  { id: 'donuts',  name: 'Gourmet Donuts', price: 15.00, img: 'donuts.webp', desc: 'Topped with chocolate, sprinkles, or glaze.' },
  { id: 'eclairs',   name: 'Cream Éclairs', price: 6.50, img: 'eclairs.avif', desc: 'Rich chocolate-topped pastry with smooth cream.' },
];

// Utility: read/write cart to localStorage
const CART_KEY = 'sweetbliss_cart_v1';

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateNavCount();
}

function updateNavCount() {
  const cart = loadCart();
  const count = cart.reduce((s,i)=> s + (i.qty||0), 0);
  const el = document.getElementById('cart-count');
  if (el) el.textContent = count;
}

// add item to cart (1 qty) or increment if exists
function addToCart(item) {
  const cart = loadCart();
  const idx = cart.findIndex(i => i.id === item.id);
  if (idx > -1) {
    cart[idx].qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  saveCart(cart);
  // small visual feedback: temporarily change button text
  const btn = document.querySelector(`[data-id="${item.id}"]`);
  if (btn) {
    const original = btn.textContent;
    btn.textContent = 'Added ✓';
    btn.disabled = true;
    setTimeout(()=>{ btn.textContent = original; btn.disabled = false; }, 900);
  }
}

// render menu grid
function renderMenu() {
  const grid = document.getElementById('menuGrid');
  if (!grid) return;
  grid.innerHTML = '';
  MENU_ITEMS.forEach(mi => {
    const col = document.createElement('div');
    col.className = 'col-sm-6 col-md-4';
    col.innerHTML = `
      <div class="card menu-card h-100">
        <img src="${mi.img}" alt="${mi.name}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${mi.name}</h5>
          <p class="card-text mb-3 small">${mi.desc}</p>
          <div class="mt-auto d-flex justify-content-between align-items-center">
            <strong class="price">$${mi.price.toFixed(2)}</strong>
            <button class="btn btn-pink add-to-cart" data-id="${mi.id}" data-name="${mi.name}" data-price="${mi.price.toFixed(2)}" data-img="${mi.img}">
              Add to cart
            </button>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(col);
  });

  // attach click listeners
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const b = e.currentTarget;
      const item = {
        id: b.dataset.id,
        name: b.dataset.name,
        price: parseFloat(b.dataset.price),
        img: b.dataset.img
      };
      addToCart(item);
    });
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  renderMenu();
  updateNavCount();
});
