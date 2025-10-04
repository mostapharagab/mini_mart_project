function setError(id, message) {
  const p = document.querySelector(`[data-error-for="${id}"]`);
  if (p) p.textContent = message || '';
}

function validate(form) {
  let valid = true;
  const get = (id) => form.querySelector(`#${id}`);

  const fullName = get('fullName').value.trim();
  if (fullName.length < 3) { setError('fullName', 'Enter your full name'); valid = false; } else setError('fullName');

  const email = get('email').value.trim();
  if (!/^\S+@\S+\.\S+$/.test(email)) { setError('email', 'Enter a valid email'); valid = false; } else setError('email');

  const address1 = get('address1').value.trim();
  if (!address1) { setError('address1', 'Required'); valid = false; } else setError('address1');

  return valid;
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.shopping-cart').forEach((el) => {
    el.addEventListener('click', (e) => { e.preventDefault(); window.location.href = 'cart.html'; });
  });

  const form = document.getElementById('checkoutForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validate(form)) {
      alert('Order placed successfully! (demo)');
      localStorage.removeItem('cart');
      localStorage.removeItem('cart_qty');
      window.location.href = 'index.html';
    }
  });

  
  // Render order summary from localStorage cart
  async function renderSummary() {
    const itemsEl = document.getElementById('summaryItems');
    const countEl = document.getElementById('summaryCount');
    const subEl = document.getElementById('summarySubtotal');
    const shipEl = document.getElementById('summaryShipping');
    const totalEl = document.getElementById('summaryTotal');
    if (!itemsEl) return;

    const ids = JSON.parse(localStorage.getItem('cart') || '[]');
    const qtyMap = JSON.parse(localStorage.getItem('cart_qty') || '{}');
    if (ids.length === 0) {
      itemsEl.innerHTML = '<p>Your cart is empty. <a href="cart.html">Go back to cart</a></p>';
      countEl.textContent = '0';
      subEl.textContent = 'EGP 0';
      shipEl.textContent = 'EGP 0';
      totalEl.textContent = 'EGP 0';
      return;
    }

    const res = await fetch('https://dummyjson.com/products?limit=100');
    const data = await res.json();
    const catalog = data.products.map(p => ({
      id: String(p.id),
      title: p.title,
      price: p.price,
      url: p.thumbnail || (p.images && p.images[0]) || ''
    }));
    const byId = new Map(catalog.map(p => [String(p.id), p]));

    let subtotal = 0;
    let count = 0;
    itemsEl.innerHTML = ids.map(idRaw => {
      const id = String(idRaw);
      const p = byId.get(id);
      if (!p) return '';
      const qty = Number(qtyMap[id] || 1);
      count += qty;
      const price = Number(p.price || 0);
      subtotal += qty * price;
      return `
        <div class="summary-item">
          <div class="title"><img src="${p.url}" alt="${p.title}"><span>${p.title}</span></div>
          <div>x${qty}</div>
          <div>EGP ${(price * qty).toFixed(2)}</div>
        </div>
      `;
    }).join('');

    const shipping = subtotal > 0 ? 0 : 0;
    const total = subtotal + shipping;
    countEl.textContent = String(count);
    subEl.textContent = `EGP ${subtotal.toFixed(2)}`;
    shipEl.textContent = `EGP ${shipping.toFixed(2)}`;
    totalEl.textContent = `EGP ${total.toFixed(2)}`;
  }

  renderSummary();
});


