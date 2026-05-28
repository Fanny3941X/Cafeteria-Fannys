const cart = [];
const GOOGLE_LANGUAGE_KEY = 'googleTranslateLanguage';

function setGoogleTranslateCookie(language) {
  if (!language || language === 'es') {
    document.cookie = 'googtrans=; Max-Age=0; path=/';
    return;
  }

  document.cookie = `googtrans=/es/${language}; path=/`;

  if (location.hostname) {
    document.cookie = `googtrans=/es/${language}; domain=${location.hostname}; path=/`;
  }
}

setGoogleTranslateCookie(localStorage.getItem(GOOGLE_LANGUAGE_KEY));

window.googleTranslateElementInit = function googleTranslateElementInit() {
  if (!window.google?.translate || !document.getElementById('google_translate_element')) return;

  new window.google.translate.TranslateElement({
    pageLanguage: 'es',
    includedLanguages: 'en,fr,it,pt,de',
    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
  }, 'google_translate_element');

  bindGoogleLanguageMemory();
};

function bindGoogleLanguageMemory(attempt = 0) {
  const combo = document.querySelector('.goog-te-combo');

  if (!combo && attempt < 20) {
    setTimeout(() => bindGoogleLanguageMemory(attempt + 1), 250);
    return;
  }

  if (!combo) return;

  const savedLanguage = localStorage.getItem(GOOGLE_LANGUAGE_KEY);
  if (savedLanguage && combo.value !== savedLanguage) {
    combo.value = savedLanguage;
    combo.dispatchEvent(new Event('change'));
  }

  combo.addEventListener('change', () => {
    const language = combo.value || 'es';
    localStorage.setItem(GOOGLE_LANGUAGE_KEY, language);
    setGoogleTranslateCookie(language);
  });
}

function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }

  if (!themeToggle) return;

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
  });
}

function initReveal() {
  const revealItems = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  revealItems.forEach((item) => observer.observe(item));
}

function renderCart() {
  const items = document.getElementById('cartItems');
  const total = document.getElementById('cartTotal');
  const count = document.getElementById('cartCount');
  if (!items || !total || !count) return;

  items.innerHTML = '';
  count.textContent = cart.length;

  if (!cart.length) {
    const empty = document.createElement('p');
    empty.className = 'cart-empty';
    empty.textContent = 'Tu carrito está vacío.';
    items.appendChild(empty);
    total.textContent = '$0';
    return;
  }

  cart.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `<span>${item.name}</span><strong>$${item.price}</strong>`;
    items.appendChild(row);
  });

  const sum = cart.reduce((acc, item) => acc + item.price, 0);
  total.textContent = `$${sum}`;
}

function initCart() {
  document.querySelectorAll('[data-cart-item]').forEach((button) => {
    button.addEventListener('click', () => {
      cart.push({
        name: button.dataset.cartItem,
        price: Number(button.dataset.cartPrice)
      });

      button.classList.add('is-added');
      setTimeout(() => button.classList.remove('is-added'), 650);
      renderCart();
    });
  });

  const clearCart = document.getElementById('clearCart');
  if (clearCart) {
    clearCart.addEventListener('click', () => {
      cart.length = 0;
      renderCart();
    });
  }

  renderCart();
}

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initReveal();
  initCart();
});

