export function toggleSection(section: Element, shouldMinimize: boolean) {
  if (!section) return;
  const button = section.querySelector('.minimize-btn');

  if (shouldMinimize) {
    section.classList.add('minimized');
    button?.classList.add('active');
  } else {
    section.classList.remove('minimized');
    button?.classList.remove('active');

    section.style.animation = 'none';
    section.offsetHeight;
    section.style.animation = null;

    const navbarHeight = document.querySelector('nav')?.offsetHeight || 0;
    const targetPosition = section.getBoundingClientRect().top + window.pageYOffset;

    window.scrollTo({
      top: targetPosition - navbarHeight - 20,
      behavior: 'smooth'
    });
  }
}

export function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        toggleSection(targetElement, false);
      }
    });
  });
}

export function initHashChange() {
  function handleHashChange() {
    const hash = window.location.hash;
    if (hash) {
      const targetSection = document.querySelector(hash);
      if (targetSection) {
        toggleSection(targetSection, false);
      }
    }
  }

  window.addEventListener('hashchange', handleHashChange);

  if (window.location.hash) {
    handleHashChange();
  }
}