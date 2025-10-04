function getIds(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
}

async function loadCatalog() {
  const res = await fetch('https://dummyjson.com/products?limit=100');
  const data = await res.json();
  return data.products.map(p => ({
    id: String(p.id),
    title: p.title,
    price: p.price,
    url: p.thumbnail || (p.images && p.images[0]) || ''
  }));
}

function addToCart(id) {
  const ids = getIds('cart');
  if (!ids.includes(id)) ids.push(id);
  localStorage.setItem('cart', JSON.stringify(ids));
  const qty = JSON.parse(localStorage.getItem('cart_qty') || '{}');
  if (!qty[id]) { qty[id] = 1; localStorage.setItem('cart_qty', JSON.stringify(qty)); }
}

function removeFromFavorites(id) {
  const ids = getIds('wishlist').filter(x => String(x) !== String(id));
  localStorage.setItem('wishlist', JSON.stringify(ids));
}

async function renderFavorites() {
  const container = document.getElementById('favoritesContainer');
  const favIds = getIds('wishlist');
  if (favIds.length === 0) {
    container.innerHTML = '<p>No favorites yet. <a href="index.html">Browse products</a></p>';
    return;
  }
  const catalog = await loadCatalog();
  const byId = new Map(catalog.map(p => [String(p.id), p]));
  const cartIds = new Set(getIds('cart').map(String));
  container.innerHTML = favIds.map(idRaw => {
    const id = String(idRaw);
    const p = byId.get(id);
    if (!p) return '';
    const inCart = cartIds.has(id);
    return `
      <div class="fav-card" data-id="${id}">
        <img src="${p.url}" alt="${p.title}">
        <div class="info">
          <div class="title">${p.title}</div>
          <div class="price">EGP ${Number(p.price || 0).toFixed(2)}</div>
          <div class="actions">
            <button class="remove">Remove</button>
            <button class="add-cart" ${inCart ? 'disabled' : ''}>${inCart ? 'In Cart' : 'Add to Cart'}</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.shopping-cart').forEach((el) => {
    el.addEventListener('click', (e) => { e.preventDefault(); window.location.href = 'cart.html'; });
  });
  document.querySelectorAll('.fav').forEach((el) => {
    el.addEventListener('click', (e) => { e.preventDefault(); });
  });

  renderFavorites();

  const container = document.getElementById('favoritesContainer');
  container.addEventListener('click', (e) => {
    const card = e.target.closest('.fav-card');
    if (!card) return;
    const id = card.dataset.id;
    if (e.target.classList.contains('remove')) {
      removeFromFavorites(id);
      renderFavorites();
    } else if (e.target.classList.contains('add-cart')) {
      addToCart(id);
      
      const btn = e.target;
      btn.textContent = 'Added ✓';
      btn.disabled = true;
      
      (function showToast(message){
        let toast = document.getElementById('toast-feedback');
        if (!toast) {
          toast = document.createElement('div');
          toast.id = 'toast-feedback';
          toast.style.position = 'fixed';
          toast.style.left = '50%';
          toast.style.bottom = '24px';
          toast.style.transform = 'translateX(-50%)';
          toast.style.background = '#111';
          toast.style.color = '#fff';
          toast.style.padding = '10px 14px';
          toast.style.borderRadius = '8px';
          toast.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
          toast.style.zIndex = '9999';
          document.body.appendChild(toast);
        }
        toast.textContent = message;
        toast.style.opacity = '1';
        setTimeout(() => { if (toast) toast.style.opacity = '0'; }, 1200);
      })('Added to cart');
    }
  });
});


