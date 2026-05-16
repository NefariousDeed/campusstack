const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.animate-up').forEach((el) => observer.observe(el));

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    const el = entry.target;
    const target = parseInt(el.dataset.target, 10);
    if (Number.isNaN(target)) {
      el.classList.add('visible');
      statObserver.unobserve(el);
      return;
    }

    let startTime = null;
    const duration = 1200;

    const step = (timestamp) => {
      if (!startTime) {
        startTime = timestamp;
      }
      const progress = Math.min((timestamp - startTime) / duration, 1);
      el.textContent = `${Math.floor(progress * target)}${el.dataset.suffix || ''}`;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = `${target}${el.dataset.suffix || ''}`;
      }
    };

    requestAnimationFrame(step);
    statObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number[data-target]').forEach((el) => statObserver.observe(el));

window.addEventListener('scroll', () => {
  document.querySelector('nav')?.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-links a[href^="#"]');

if (sections.length && navLinkEls.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinkEls.forEach((a) => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) {
          active.classList.add('active');
        }
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach((section) => sectionObserver.observe(section));
}

const hamburger = document.getElementById('nav-hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger?.addEventListener('click', () => {
  navLinks?.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', navLinks?.classList.contains('open') ? 'true' : 'false');
});

navLinks?.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
  });
});
