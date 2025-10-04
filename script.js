const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
const mobileMenuClose = document.getElementById("mobileMenuClose");
const body = document.body;

function openMobileMenu() {
  hamburger.classList.add("active");
  mobileMenu.style.display = "block";
  mobileMenuOverlay.style.display = "block";
  body.classList.add("menu-open");
  hamburger.style.display = "none";

  mobileMenu.offsetHeight;
  mobileMenu.classList.add("active");
}

function closeMobileMenu() {
  hamburger.classList.remove("active");
  mobileMenu.classList.remove("active");
  body.classList.remove("menu-open");
  hamburger.style.removeProperty("display");

  setTimeout(() => {
    mobileMenu.style.display = "none";
    mobileMenuOverlay.style.display = "none";
  }, 300);
}

if (hamburger) {
  hamburger.addEventListener("click", openMobileMenu);
}
if (mobileMenuClose) {
  mobileMenuClose.addEventListener("click", closeMobileMenu);
}
if (mobileMenuOverlay) {
  mobileMenuOverlay.addEventListener("click", closeMobileMenu);
}

document.querySelectorAll('.shopping-cart').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'cart.html';
  });
});

document.querySelectorAll('.fav').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'favorites.html';
  });
});

let allProducts = [];

function addToStorage(key, id) {
  let items = JSON.parse(localStorage.getItem(key)) || [];
  if (!items.includes(id)) {
    items.push(id);
    localStorage.setItem(key, JSON.stringify(items));
  }
  return items;
}

function applySelectedStyles() {
  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  document.querySelectorAll(".card").forEach((card) => {
    const id = card.dataset.id;

    const heartIcon = card.querySelector(".heart-icon");
    const cartIcon = card.querySelector(".cart-icon");

    if (wishlist.includes(id)) {
      heartIcon.classList.add("selected");
    }

    if (cart.includes(id)) {
      cartIcon.classList.add("selected");
    }
  });
}

function attachCardEvents() {
  document.querySelectorAll(".heart-icon").forEach((icon) => {
    icon.addEventListener("click", (e) => {
      const card = e.target.closest(".card");
      const id = card.dataset.id;
      addToStorage("wishlist", id);
      icon.classList.add("selected");
    });
  });

  document.querySelectorAll(".cart-icon").forEach((icon) => {
    icon.addEventListener("click", (e) => {
      const card = e.target.closest(".card");
      const id = card.dataset.id;
      addToStorage("cart", id);
      icon.classList.add("selected");
    });
  });
}

function renderProducts(list) {
  const container = document.getElementById("products");
  if (!container) return;
  container.innerHTML = list
    .map(
      (x) => `
      <div class="card" data-id="${x.id}">
        <div class="card-image">
          <img src="${x.url}" alt="${x.title}">
          <div class="card-icons">
            <img class="cart-icon" src="https://dfcdn.defacto.com.tr/AssetsV2/dist/img/quick-add-to-cart.svg" alt="Add to Cart">
            <svg class="heart-icon" width="32" height="32" viewBox="0 0 20 18" fill="#777" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.197 0a5.06 5.06 0 0 0-3.69 1.6c-2.009 2.13-2.007 5.497 0 7.629l8.101 8.606a.53.53 0 0 0 .388.165.53.53 0 0 0 .388-.165l8.109-8.599c2.009-2.13 2.009-5.498 0-7.629a5.06 5.06 0 0 0-7.381 0L10 2.785 8.887 1.6A5.06 5.06 0 0 0 5.197 0m0 .911c1.047 0 2.096.436 2.922 1.311l1.497 1.592a.53.53 0 0 0 .388.165.53.53 0 0 0 .388-.165l1.489-1.585c1.651-1.751 4.185-1.75 5.836 0s1.651 4.635 0 6.385L10 16.798 2.283 8.606a4.74 4.74 0 0 1 0-6.385C3.108 1.347 4.15.911 5.196.911z"/>
            </svg>
          </div>
        </div>
        <h3>${x.title}</h3>
        <div class="category">${x.category}</div>
        <p>$${x.price} EGP</p>
      </div>
    `
    )
    .join("");
  attachCardEvents();
  applySelectedStyles();
}

function populateCategories(list) {
  const select = document.getElementById("categorySelect");
  if (!select) return;
  const cats = Array.from(new Set(list.map(p => p.category))).sort();
  select.innerHTML = `<option value="all">All</option>` + cats.map(c => `<option value="${c}">${c}</option>`).join("");
}

function applyFilters() {
  const select = document.getElementById("categorySelect");
  const searchInput = document.querySelector(".search");
  const category = select ? select.value : 'all';
  const q = (searchInput ? searchInput.value : '').toLowerCase().trim();
  const filtered = allProducts.filter(p => {
    const okCat = category === 'all' || p.category === category;
    const okQ = !q || p.title.toLowerCase().includes(q);
    return okCat && okQ;
  });
  renderProducts(filtered);
}

async function loadProducts() {
  try {
    const res = await fetch("https://dummyjson.com/products?limit=100");
    const data = await res.json();
    allProducts = data.products.map(p => ({
      id: String(p.id),
      title: p.title,
      price: p.price,
      url: p.thumbnail || (p.images && p.images[0]) || '',
      category: p.category
    }));

    populateCategories(allProducts);
    renderProducts(allProducts);

    // Hook filters
    const select = document.getElementById("categorySelect");
    if (select) select.addEventListener('change', applyFilters);
    const searchInput = document.querySelector(".search");
    if (searchInput) searchInput.addEventListener('input', applyFilters);
  } catch (err) {
    console.error("Failed to load products", err);
  }
}

loadProducts();
