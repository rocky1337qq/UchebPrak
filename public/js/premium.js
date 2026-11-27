document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initBillingToggle();
  initPaymentModal();
});

function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
  });
}

let isAnnual = false;
function initBillingToggle() {
  const btnMonthly = document.getElementById('billing-btn-monthly');
  const btnAnnual = document.getElementById('billing-btn-annual');
  if (!btnMonthly || !btnAnnual) return;

  btnMonthly.addEventListener('click', () => {
    isAnnual = false;
    btnMonthly.classList.add('active');
    btnAnnual.classList.remove('active');
    updatePrices(false);
  });

  btnAnnual.addEventListener('click', () => {
    isAnnual = true;
    btnAnnual.classList.add('active');
    btnMonthly.classList.remove('active');
    updatePrices(true);
  });
}

function updatePrices(annual) {
  document.querySelectorAll('.price-amount').forEach(el => {
    const val = annual ? el.getAttribute('data-annual') : el.getAttribute('data-monthly');
    if (val) el.textContent = val;
  });
}

let currentSelectedPlan = {
  name: '3 Месяца Premium',
  basePrice: 699,
  discount: 0
};

function initPaymentModal() {
  const modal = document.getElementById('payment-modal');
  const closeBtn = document.getElementById('payment-modal-close');
  const planBtns = document.querySelectorAll('.btn-plan');

  const modalPlanLabel = document.getElementById('modal-plan-label');
  const origPriceEl = document.getElementById('summary-original-price');
  const totalPriceEl = document.getElementById('summary-total-price');
  const discountRow = document.getElementById('summary-discount-row');
  const discountValEl = document.getElementById('summary-discount-val');
  const promoInput = document.getElementById('promo-input');
  const promoStatus = document.getElementById('promo-status-msg');
  const applyPromoBtn = document.getElementById('btn-apply-promo');
  const submitPayBtn = document.getElementById('btn-submit-payment');

  if (!modal) return;

  planBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const planName = btn.getAttribute('data-name');
      const price = parseInt(btn.getAttribute('data-price')) || 699;

      currentSelectedPlan.name = planName;
      currentSelectedPlan.basePrice = price;
      currentSelectedPlan.discount = 0;

      if (promoInput) promoInput.value = '';
      if (promoStatus) {
        promoStatus.textContent = '';
        promoStatus.className = 'promo-status';
      }
      if (discountRow) discountRow.style.display = 'none';

      modalPlanLabel.textContent = `Тариф: ${planName}`;
      origPriceEl.textContent = `${price} ₽`;
      totalPriceEl.textContent = `${price} ₽`;

      modal.style.display = 'flex';
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });

  const methodCards = document.querySelectorAll('.payment-method-card');
  methodCards.forEach(card => {
    card.addEventListener('click', () => {
      methodCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
  });

  if (applyPromoBtn && promoInput) {
    applyPromoBtn.addEventListener('click', () => {
      const code = promoInput.value.trim().toUpperCase();
      if (!code) return;

      if (code === 'AIM2026' || code === 'PRO10' || code === 'AIMCORE') {
        currentSelectedPlan.discount = 0.10; 
        const finalPrice = Math.round(currentSelectedPlan.basePrice * 0.9);

        discountRow.style.display = 'flex';
        discountValEl.textContent = '-10%';
        totalPriceEl.textContent = `${finalPrice} ₽`;

        promoStatus.textContent = 'Промокод успешно применен: скидка 10%';
        promoStatus.className = 'promo-status success';
      } else {
        promoStatus.textContent = 'Недействительный промокод';
        promoStatus.className = 'promo-status error';
      }
    });
  }

  if (submitPayBtn) {
    submitPayBtn.addEventListener('click', () => {
      submitPayBtn.textContent = 'Обработка платежа...';
      submitPayBtn.disabled = true;

      setTimeout(() => {
        submitPayBtn.textContent = 'Оплатить подписку';
        submitPayBtn.disabled = false;
        modal.style.display = 'none';

        localStorage.setItem('aimcore_premium', 'true');
        localStorage.setItem('aimcore_premium_plan', currentSelectedPlan.name);
        localStorage.setItem('aimcore_premium_date', new Date().toLocaleDateString('ru-RU'));

        showToast(`Подписка ${currentSelectedPlan.name} успешно активирована!`);
      }, 1200);
    });
  }
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
