document.addEventListener('DOMContentLoaded', () => {
  initHeroVideo();
  initMobileMenu();
  initStatCounters();
  initInteractiveCS2Card();
  initMarqueeSlowdown();
});

function initHeroVideo() {
  const video = document.querySelector('.video-background');
  if (!video) return;

  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {

      const playOnInteract = () => {
        video.play();
        window.removeEventListener('click', playOnInteract);
        window.removeEventListener('keydown', playOnInteract);
        window.removeEventListener('touchstart', playOnInteract);
      };
      window.addEventListener('click', playOnInteract, { once: true });
      window.addEventListener('keydown', playOnInteract, { once: true });
      window.addEventListener('touchstart', playOnInteract, { once: true });
    });
  }
}

function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!toggleBtn || !mobileMenu) return;

  toggleBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
  });

  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
    });
  });
}

function initStatCounters() {
  const statSection = document.getElementById('stats');
  if (!statSection) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        animateNumber('stat-players', 0, 750000, 1600, '+', true);
        animateNumber('stat-matches', 0, 8, 1200, ' миллионов +', false);
        animateNumber('stat-ratings', 0, 40000, 1600, '+', true);
      }
    });
  }, { threshold: 0.25 });

  observer.observe(statSection);
}

function animateNumber(elementId, start, end, duration, suffix = '', formatted = true) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeOutQuad = 1 - (1 - progress) * (1 - progress);
    const currentVal = Math.floor(start + (end - start) * easeOutQuad);

    if (formatted) {
      el.textContent = currentVal.toLocaleString('en-US') + suffix;
    } else {
      el.textContent = currentVal + suffix;
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function initInteractiveCS2Card() {
  const cs2Card = document.getElementById('cs2-interactive-card');
  if (!cs2Card) return;

  cs2Card.addEventListener('click', () => {

    cs2Card.style.transform = 'scale(0.97)';
    setTimeout(() => {
      cs2Card.style.transform = '';
      const hero = document.getElementById('hero');
      if (hero) {
        hero.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  });

  cs2Card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      cs2Card.click();
    }
  });
}

function initMarqueeSlowdown() {
  const container = document.querySelector('.pro-marquee-container');
  const track = document.getElementById('pro-marquee-track');
  if (!container || !track) return;

  const getRunningAnimation = () => {
    if (typeof track.getAnimations === 'function') {
      const anims = track.getAnimations();
      return anims.length > 0 ? anims[0] : null;
    }
    return null;
  };

  container.addEventListener('mouseenter', () => {
    const anim = getRunningAnimation();
    if (anim) {
      anim.playbackRate = 0.25; 
    }
  });

  container.addEventListener('mouseleave', () => {
    const anim = getRunningAnimation();
    if (anim) {
      anim.playbackRate = 1.0; 
    }
  });
}
