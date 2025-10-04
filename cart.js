function getStoredIds(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (_) {
    return [];
  }
}

async function fetchCatalog() {
  const res = await fetch('https://dummyjson.com/products?limit=100');
  const data = await res.json();
  return data.products.map(p => ({
    id: String(p.id),
    title: p.title,
    price: p.price,
    url: p.thumbnail || (p.images && p.images[0]) || ''
  }));
}

function formatPrice(value) {
  return `EGP ${value.toFixed(2)}`;
}

function buildCartHeader(container) {
  const header = document.createElement("div");
  header.className = "cart-header";
  header.innerHTML = `
    <div>Item</div>
    <div>Price</div>
    <div>Quantity</div>
    <div>Remove</div>
  `;
  container.appendChild(header);
}

function writeSummary(count, total) {
  const itemCount = document.getElementById("itemCount");
  const totalPrice = document.getElementById("totalPrice");
  itemCount.textContent = String(count);
  totalPrice.textContent = formatPrice(total);
}

function loadCartQuantities(ids) {
  const qtyMap = JSON.parse(localStorage.getItem("cart_qty") || "{}");
  ids.forEach(id => { if (!qtyMap[id]) qtyMap[id] = 1; });
  localStorage.setItem("cart_qty", JSON.stringify(qtyMap));
  return qtyMap;
}

function saveCartQuantity(id, qty) {
  const qtyMap = JSON.parse(localStorage.getItem("cart_qty") || "{}");
  if (qty <= 0) {
    delete qtyMap[id];
  } else {
    qtyMap[id] = qty;
  }
  localStorage.setItem("cart_qty", JSON.stringify(qtyMap));
}

function removeFromCart(id) {
  const ids = getStoredIds("cart").filter(x => String(x) !== String(id));
  localStorage.setItem("cart", JSON.stringify(ids));
  const qtyMap = JSON.parse(localStorage.getItem("cart_qty") || "{}");
  delete qtyMap[id];
  localStorage.setItem("cart_qty", JSON.stringify(qtyMap));
}

async function renderCart() {
  const container = document.getElementById("cartContainer");
  container.innerHTML = "";

  const cartIds = getStoredIds("cart");
  if (cartIds.length === 0) {
    container.innerHTML = `<p>Your cart is empty. <a href="index.html">Continue shopping</a></p>`;
    writeSummary(0, 0);
    return;
  }

  const catalog = await fetchCatalog();
  const byId = new Map(catalog.map(p => [String(p.id), p]));

  buildCartHeader(container);

  const qtyMap = loadCartQuantities(cartIds);
  let total = 0;
  let count = 0;

  cartIds.forEach(idRaw => {
    const id = String(idRaw);
    const product = byId.get(id);
    if (!product) return;

    const qty = Number(qtyMap[id] || 1);
    count += qty;
    total += qty * Number(product.price || 0);

    const row = document.createElement("div");
    row.className = "cart-item";
    row.dataset.id = id;
    row.innerHTML = `
      <div class="item-info">
        <img src="${product.url}" alt="${product.title}">
        <div>
          <div>${product.title}</div>
        </div>
      </div>
      <div>${formatPrice(Number(product.price || 0))}</div>
      <div>
        <div class="qty-controls">
          <button class="dec" aria-label="Decrease">-</button>
          <span class="qty">${qty}</span>
          <button class="inc" aria-label="Increase">+</button>
        </div>
      </div>
      <div><button class="remove-btn">Remove</button></div>
    `;

    container.appendChild(row);
  });

  writeSummary(count, total);
}

document.addEventListener('DOMContentLoaded', () => {
  // Nav cart click to stay on this page
  const navCart = document.querySelector('.shopping-cart');
  if (navCart) {
    navCart.addEventListener('click', (e) => {
      e.preventDefault();
    });
  }

  // Attach a single delegated handler for cart interactions
  const container = document.getElementById('cartContainer');
  if (container) {
    container.addEventListener('click', (e) => {
      const target = e.target;
      const row = target.closest('.cart-item');
      if (!row) return;
      const id = row.dataset.id;
      const qtyEl = row.querySelector('.qty');
      let qty = Number(qtyEl ? qtyEl.textContent : 1);

      if (target.classList.contains('inc')) {
        qty += 1;
        saveCartQuantity(id, qty);
        renderCart();
      } else if (target.classList.contains('dec')) {
        if(qty == 1) {
          removeFromCart(id);
          renderCart();
          return;
        }
        qty = Math.max(1, qty - 1);
        saveCartQuantity(id, qty);
        renderCart();
      } else if (target.classList.contains('remove-btn')) {
        removeFromCart(id);
        renderCart();
      }
    });
  }
  renderCart();

  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const cartIds = getStoredIds('cart');
      if (cartIds.length > 0) {
        window.location.href = 'checkout.html';
      }
    });
  }
});


