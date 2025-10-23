# Mini Mart — Frontend Demo

A small storefront demo (products listing, favorites, cart, checkout) built with plain HTML, CSS and JavaScript.

## Features
- Product listing and category filter (DOM root: `#products`, category select: `#categorySelect`)
- Responsive navbar with mobile menu
- Favorites, Cart and Checkout pages (static templates)
- Simple client-side interactivity in [script.js](script.js)

## Project files
- [index.html](index.html) — Main products page and app shell
- [script.js](script.js) — Main JavaScript for product rendering, filters and UI interactions
- [products.css](products.css) — Styles for the product grid and product cards
- [navbar.css](navbar.css) — Header / navigation styles
- [footer.css](footer.css) — Footer styles
- Cart / Favorites / Checkout pages:
  - [cart.html](cart.html)
  - [cart.css](cart.css)
  - [cart.js](cart.js)
  - [favorites.html](favorites.html)
  - [favorites.css](favorites.css)
  - [favorites.js](favorites.js)
  - [checkout.html](checkout.html)
  - [checkout.css](checkout.css)
  - [checkout.js](checkout.js)


## Development notes
- Primary app entry: [index.html](http://_vscodecontentref_/0) + [script.js](http://_vscodecontentref_/1).
- Product container element: `<div id="products" class="products"></div>` in [index.html](http://_vscodecontentref_/2).
- Category filter element: `<select id="categorySelect">` in [index.html](http://_vscodecontentref_/3). Update [script.js](http://_vscodecontentref_/4) to change filter behavior.
- Mobile menu is controlled via `#hamburger`, `#mobileMenu`, `#mobileMenuOverlay` in [index.html](http://_vscodecontentref_/5).

## Extending
- Add new pages by copying the existing templates (cart / favorites / checkout).
- Move products data into a JSON file and fetch it in [script.js](http://_vscodecontentref_/6) to separate data from code.
- Add unit tests or a build step if the project grows.

## Contribution
Open issues or send pull requests. Keep changes small and focused.

## License
MIT
