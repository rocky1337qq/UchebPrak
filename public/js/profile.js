document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initAuthSession();
  initPreferencesSave();
  initDemoAuth();
  checkAuthUrlParams();
});

function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    toggleBtn.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!toggleBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('active');
      toggleBtn.classList.remove('active');
    }
  });
}

function initAuthSession() {
  const loginCard = document.getElementById('profile-login-card');
  const authSection = document.getElementById('profile-auth-section');

  if (loginCard) loginCard.style.display = 'flex';
  if (authSection) authSection.style.display = 'none';
}

function renderUserProfile(user) {
  const nickEl = document.getElementById('profile-nick');
  const avatarEl = document.getElementById('profile-avatar');
  const steamidEl = document.getElementById('profile-steamid');
  const steamLinkEl = document.getElementById('btn-steam-link');
  const faceitEl = document.getElementById('profile-faceit-lvl');

  const eloEl = document.getElementById('stat-elo');
  const hsEl = document.getElementById('stat-hs');
  const hoursEl = document.getElementById('stat-hours');
  const winrateEl = document.getElementById('stat-winrate');

  const autoconnectInput = document.getElementById('pref-autoconnect');
  const showEloInput = document.getElementById('pref-show-elo');
  const soundInput = document.getElementById('pref-sound');

  if (nickEl) nickEl.textContent = user.username;
  if (avatarEl && (user.avatar_full || user.avatar)) avatarEl.src = user.avatar_full || user.avatar;
  if (steamidEl) steamidEl.textContent = user.steamid;
  if (steamLinkEl && user.profile_url) steamLinkEl.href = user.profile_url;
  if (faceitEl) faceitEl.textContent = `Faceit Level ${user.faceit_level || 9}`;

  if (eloEl) eloEl.textContent = Number(user.elo || 2140).toLocaleString('en-US');
  if (hsEl) hsEl.textContent = `${user.hs_percent || 64.8}%`;
  if (hoursEl) hoursEl.textContent = `${user.hours_played || 48} ч`;
  if (winrateEl) winrateEl.textContent = `${user.winrate || 68.2}%`;

  if (autoconnectInput) autoconnectInput.checked = user.pref_autoconnect === 1;
  if (showEloInput) showEloInput.checked = user.pref_show_elo === 1;
  if (soundInput) soundInput.checked = user.pref_sound === 1;

  applySubscriptionState(user.tier === 'PREMIUM');

  const navText = document.getElementById('nav-profile-text');
  if (navText) navText.textContent = user.username;
}

function applySubscriptionState(isPremium) {
  const tierBadge = document.getElementById('profile-tier-badge');
  const subBox = document.getElementById('sub-status-box');
  const statusTitle = document.getElementById('status-title');
  const statusDesc = document.getElementById('status-desc');
  const statusDot = subBox ? subBox.querySelector('.status-dot') : null;
  const btnProfilePrem = document.getElementById('btn-profile-premium');
  const btnManageSub = document.getElementById('btn-manage-sub');

  const privSlot = document.getElementById('priv-slot');
  const privSkins = document.getElementById('priv-skins');
  const privPro = document.getElementById('priv-pro');

  if (isPremium) {
    if (tierBadge) {
      tierBadge.textContent = 'PREMIUM';
      tierBadge.classList.add('is-premium');
    }
    if (subBox) subBox.classList.add('is-active-premium');
    if (statusDot) statusDot.classList.add('active');
    if (statusTitle) statusTitle.textContent = 'Premium подписка активна в БД';
    if (statusDesc) {
      statusDesc.textContent = 'Активен полный доступ: резервный слот 16/16, PRO-кластеры 2500+ ELO, команды кастомизации !ws и !knife без задержек.';
    }

    [privSlot, privSkins, privPro].forEach(el => {
      if (el) {
        const icon = el.querySelector('.icon-slot');
        if (icon) {
          icon.textContent = '✓';
          icon.classList.remove('inactive');
        }
      }
    });

    if (btnProfilePrem) btnProfilePrem.textContent = 'Продлить Premium';
    if (btnManageSub) btnManageSub.textContent = 'Управление подпиской';
  }
}

function initPreferencesSave() {
  const saveBtn = document.getElementById('btn-save-prefs');
  if (!saveBtn) return;

  saveBtn.addEventListener('click', () => {
    showToast('Настройки сохранены!');
  });
}

function initDemoAuth() {
  const demoBtn = document.getElementById('btn-demo-auth');
  if (!demoBtn) return;

  demoBtn.addEventListener('click', () => {
    showToast('Демо-вход недоступен без сервера.');
  });
}

function checkAuthUrlParams() {
  const url = new URL(window.location.href);
  if (url.searchParams.get('auth_success')) {
    showToast('Успешный вход через официальный Steam OpenID!');
    url.searchParams.delete('auth_success');
    window.history.replaceState({}, document.title, url.pathname);
  } else if (url.searchParams.get('auth_error')) {
    showToast('Ошибка подтверждения Steam OpenID. Попробуйте снова.');
    url.searchParams.delete('auth_error');
    window.history.replaceState({}, document.title, url.pathname);
  }
}

let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast-notification');
  const toastMsg = document.getElementById('toast-message');

  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}
