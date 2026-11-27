document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initAccordion();
  initFaqSearch();
  initCategoryFilters();
  initCopyCodeButtons();
  initSupportForm();
});

function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
  });
}

function initAccordion() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      items.forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

let activeCategory = 'all';
let searchQuery = '';

function initCategoryFilters() {
  const pills = document.querySelectorAll('.faq-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-category');
      applyFaqFilters();
    });
  });
}

function initFaqSearch() {
  const input = document.getElementById('faq-search-input');
  const clearBtn = document.getElementById('faq-search-clear');
  if (!input) return;

  input.addEventListener('input', (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    if (clearBtn) {
      clearBtn.style.display = searchQuery ? 'flex' : 'none';
    }
    applyFaqFilters();
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      searchQuery = '';
      clearBtn.style.display = 'none';
      applyFaqFilters();
      input.focus();
    });
  }
}

function applyFaqFilters() {
  const items = document.querySelectorAll('.faq-item');
  const emptyState = document.getElementById('faq-empty-state');
  let visibleCount = 0;

  items.forEach(item => {
    const category = item.getAttribute('data-category');
    const text = item.textContent.toLowerCase();

    const matchesCategory = (activeCategory === 'all' || category === activeCategory);
    const matchesSearch = (!searchQuery || text.includes(searchQuery));

    if (matchesCategory && matchesSearch) {
      item.style.display = 'block';
      visibleCount++;
    } else {
      item.style.display = 'none';
    }
  });

  if (emptyState) {
    emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
  }
}

function initCopyCodeButtons() {
  document.querySelectorAll('.btn-copy-code').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const text = btn.getAttribute('data-copy');
      if (text) {
        copyText(text);
      }
    });
  });
}

function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`Скопировано: ${text}`);
    }).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    document.execCommand('copy');
    showToast(`Скопировано: ${text}`);
  } catch (err) {
    console.error('Copy error', err);
  }
  document.body.removeChild(ta);
}

function initSupportForm() {
  const form = document.getElementById('support-form');
  const submitBtn = document.getElementById('btn-submit-ticket');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.reset();
    if (submitBtn) {
      submitBtn.textContent = 'Отправить вопрос в поддержку';
      submitBtn.disabled = false;
    }
    showToast('Сообщение отправлено!');
  });
}

let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toast-notification');
  const msgEl = document.getElementById('toast-message');
  if (!toast || !msgEl) return;

  msgEl.textContent = message;
  toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
