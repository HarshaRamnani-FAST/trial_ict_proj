// cart.js
const CART_KEY = 'sweetbliss_cart_v1';

function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch(e){ return []; }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateNavCount();
}

function updateNavCount() {
  const cart = loadCart();
  const count = cart.reduce((s,i)=> s + (i.qty||0), 0);
  const el = document.querySelector('#cart-count');
  if (el) el.textContent = count;
}

/* Render cart area */
function renderCart() {
  const cart = loadCart();
  const area = document.getElementById('cartArea');
  const totalEl = document.getElementById('cartTotal');
  area.innerHTML = '';

  if (!cart.length) {
    area.innerHTML = `<div class="text-center py-5">Your cart is empty.   <a href="menu.html" class="text-pink">Browse menu</a></div>`;
    totalEl.textContent = '$0.00';
    return;
  }

  let total = 0;

  cart.forEach(item => {
    const itemTotal = (item.price * item.qty);
    total += itemTotal;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div>
        <div class="item-name">${item.name}</div>
        <div class="small item-price">$${item.price.toFixed(2)} each</div>
      </div>
      <div class="text-end">
        <div class="qty-controls">
          <button class="btn-decrease" data-id="${item.id}">−</button>
          <input type="text" class="qty-input" data-id="${item.id}" value="${item.qty}" readonly />
          <button class="btn-increase" data-id="${item.id}">+</button>
        </div>
        <div class="mt-2">
          <div class="small">Subtotal: $${itemTotal.toFixed(2)}</div>
          <button class="remove-btn" data-id="${item.id}">Remove</button>
        </div>
      </div>
    `;
    area.appendChild(div);
  });

  totalEl.textContent = `$${total.toFixed(2)}`;

  // attach listeners (delegation approach: attach to document)
  document.querySelectorAll('.btn-increase').forEach(b => b.onclick = increaseQty);
  document.querySelectorAll('.btn-decrease').forEach(b => b.onclick = decreaseQty);
  document.querySelectorAll('.remove-btn').forEach(b => b.onclick = removeItem);
}

/* quantity change handlers */
function increaseQty(e) {
  const id = e.currentTarget.dataset.id;
  const cart = loadCart();
  const idx = cart.findIndex(i => i.id === id);
  if (idx > -1) {
    cart[idx].qty += 1;
    saveCart(cart);
    renderCart();
  }
}
function decreaseQty(e) {
  const id = e.currentTarget.dataset.id;
  const cart = loadCart();
  const idx = cart.findIndex(i => i.id === id);
  if (idx > -1) {
    if (cart[idx].qty > 1) {
      cart[idx].qty -= 1;
    } else {
      // if qty would go to zero, remove item (mirror video behavior)
      cart.splice(idx, 1);
    }
    saveCart(cart);
    renderCart();
  }
}
function removeItem(e) {
  const id = e.currentTarget.dataset.id;
  let cart = loadCart();
  cart = cart.filter(i => i.id !== id);
  saveCart(cart);
  renderCart();
}

/* Clear cart button */
document.addEventListener('DOMContentLoaded', () => {
  updateNavCount();
  renderCart();

  const clearBtn = document.getElementById('clearCartBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Clear the cart?')) {
        saveCart([]);
        renderCart();
      }
    });
  }

  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      alert('Checkout demo: This is a demo checkout.'); // replicate video (demo)
    });
  }
});
