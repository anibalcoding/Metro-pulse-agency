  // CURSOR
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  function animCursor() {
    if(cursor) { cursor.style.left = mx+'px'; cursor.style.top = my+'px'; }
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    if(ring) { ring.style.left = rx+'px'; ring.style.top = ry+'px'; }
    requestAnimationFrame(animCursor);
  }
  animCursor();

  // NAV SCROLL
  const navbar = document.getElementById('navbar');
  const hero = document.querySelector('.hero');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('nav-visible', window.scrollY > 500);
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // MOBILE MENU
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuClose = document.getElementById('mobileMenuClose');

  function openMobile() {
    mobileMenu.classList.add('open');
    navbar.classList.add('menu-open');
  }
  function closeMobile() {
    mobileMenu.classList.remove('open');
    navbar.classList.remove('menu-open');
  }

  hamburger.addEventListener('click', openMobile);
  mobileMenuClose.addEventListener('click', closeMobile);
  document.querySelectorAll('.mobile-menu-link').forEach(link => {
    link.addEventListener('click', closeMobile);
  });

  // SCROLL PROGRESS BAR
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  // INJECT SECTION BACKGROUND SHAPES
  const shapeDefs = [
    { sel: '.about',
      html: `<div class="ss-orb ss-orb-br"></div>
             <div class="ss-ring ss-ring-tl"></div>
             <div class="ss-dot" style="top:18%;right:6%"></div>
             <div class="ss-dot ss-dot-sm" style="bottom:28%;left:14%"></div>
             <div class="ss-dot ss-dot-sm" style="top:42%;right:18%"></div>` },
    { sel: '.full-picture',
      html: `<div class="ss-orb ss-orb-tl"></div>
             <div class="ss-ring ss-ring-br"></div>
             <div class="ss-ring ss-ring-sm" style="top:35%;right:4%"></div>
             <div class="ss-dot" style="top:55%;right:8%"></div>
             <div class="ss-grid"></div>` },
    { sel: '.industries',
      html: `<div class="ss-grid"></div>
             <div class="ss-orb ss-orb-tr"></div>
             <div class="ss-ring ss-ring-sm" style="bottom:8%;left:4%"></div>
             <div class="ss-dot" style="top:20%;left:8%"></div>
             <div class="ss-dot ss-dot-sm" style="bottom:22%;right:10%"></div>` },
    { sel: '.process',
      html: `<div class="ss-ring ss-ring-lg ss-ring-left"></div>
             <div class="ss-orb ss-orb-tr"></div>
             <div class="ss-dot" style="top:12%;right:8%"></div>
             <div class="ss-dot ss-dot-sm" style="top:58%;right:22%"></div>
             <div class="ss-dot ss-dot-sm" style="bottom:18%;left:18%"></div>` },
    { sel: '.pricing',
      html: `<div class="ss-ring ss-ring-tr"></div>
             <div class="ss-orb ss-orb-bl"></div>
             <div class="ss-dot" style="top:25%;right:6%"></div>` },
    { sel: '.booking',
      html: `<div class="ss-orb ss-orb-tr"></div>
             <div class="ss-ring ss-ring-bl"></div>
             <div class="ss-dot" style="top:30%;left:6%"></div>
             <div class="ss-dot ss-dot-sm" style="bottom:25%;right:6%"></div>` },
  ];
  shapeDefs.forEach(({ sel, html }) => {
    const section = document.querySelector(sel);
    if (!section) return;
    const container = document.createElement('div');
    container.className = 'ss';
    container.setAttribute('aria-hidden', 'true');
    container.innerHTML = html;
    section.prepend(container);
  });

  // SCROLL-DRIVEN PARALLAX + RING DRIFT
  function onScroll() {
    const sy = window.scrollY;
    const maxH = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.transform = `scaleX(${sy / maxH})`;

    document.querySelectorAll('.ss-orb').forEach(el => {
      const section = el.closest('section');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > window.innerHeight + 100) return;
      const mid = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = `translateY(${mid * 0.06}px)`;
    });
    document.querySelectorAll('.ss-ring').forEach((el, i) => {
      const section = el.closest('section');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > window.innerHeight + 100) return;
      const dir = i % 2 === 0 ? 1 : -1;
      const mid = rect.top + rect.height / 2 - window.innerHeight / 2;
      el.style.transform = `translateY(${mid * 0.03}px) rotate(${sy * 0.015 * dir}deg)`;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // INTERSECTION OBSERVER — handles all reveal variants + stagger
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('visible');
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale, .gallery-item, .pricing-card, .pricing-card-custom'
  ).forEach(el => observer.observe(el));

  // STAGGER OBSERVER — for process steps, fp-steps, industry cards
  const staggerObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const children = entry.target.querySelectorAll(
        '.process-step, .fp-step, .industry-card, .fp-item'
      );
      children.forEach((child, i) => {
        child.style.transitionDelay = `${i * 0.1}s`;
        setTimeout(() => child.classList.add('visible'), i * 100);
      });
      staggerObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.process-steps, .fp-steps, .industries-grid, .fp-package-right').forEach(c => {
    staggerObserver.observe(c);
  });

  // SERVICE ROWS ACCORDION
  document.querySelectorAll('.service-row').forEach(row => {
    row.addEventListener('click', () => {
      const isOpen = row.classList.contains('open');
      document.querySelectorAll('.service-row.open').forEach(r => r.classList.remove('open'));
      if (!isOpen) row.classList.add('open');
    });
  });

  // FILTER
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      document.querySelectorAll('.gallery-item').forEach(item => {
        const cat = item.dataset.cat;
        const show = f === 'all' || cat === f;
        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        if(show) {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
          item.style.display = 'block';
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          setTimeout(() => {
            if(btn.dataset.filter !== 'all' && item.dataset.cat !== btn.dataset.filter)
              item.style.display = 'none';
          }, 400);
        }
      });
    });
  });

  // LIGHTBOX
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  const lbVideo = document.getElementById('lightboxVideo');
  const lbTitle = document.getElementById('lightboxTitle');
  const lbCat = document.getElementById('lightboxCat');
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const video = item.querySelector('video');

      if (img) {
        lbImg.src = img.src;
        lbImg.alt = img.alt;
        lbImg.hidden = false;
        lbVideo.hidden = true;
        lbVideo.pause();
        lbVideo.removeAttribute('src');
        lbVideo.load();
      } else if (video) {
        const lightboxSrc = item.dataset.lightboxVideo;
        const source = video.querySelector('source');
        lbVideo.src = lightboxSrc || (source ? source.src : video.currentSrc);
        lbVideo.hidden = false;
        lbImg.hidden = true;
        lbImg.removeAttribute('src');
        lbImg.alt = '';
        lbVideo.currentTime = 0;
        lbVideo.play().catch(() => {});
      }

      lbTitle.textContent = item.dataset.title;
      lbCat.textContent = item.dataset.tag;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if(e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeLightbox(); });
  function closeLightbox() {
    lightbox.classList.remove('open');
    lbVideo.pause();
    document.body.style.overflow = '';
  }

  // ADD-ON SELECTION
  function updateAddonsTotal() {
    const selected = document.querySelectorAll('.addon-card.selected');
    const total = document.getElementById('addonsTotal');
    const itemsEl = document.getElementById('addonsTotalItems');
    const priceEl = document.getElementById('addonsTotalPrice');
    if (selected.length === 0) {
      total.classList.remove('visible');
      return;
    }
    let sum = 0;
    const names = [];
    selected.forEach(card => {
      sum += parseInt(card.dataset.price);
      names.push(card.querySelector('.addon-name').textContent);
    });
    itemsEl.textContent = names.join(', ');
    priceEl.textContent = '+$' + sum;
    total.classList.add('visible');
  }
  document.querySelectorAll('.addon-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('selected');
      updateAddonsTotal();
    });
  });

  // FORM SUBMIT
  document.getElementById('theForm').addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.target;
    const btn  = form.querySelector('.btn-submit');
    const orig = btn.textContent;

    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      const res  = await fetch('contact.php', {
        method: 'POST',
        body: new FormData(form)
      });
      const data = await res.json();

      if (data.success) {
        document.getElementById('bookingForm').style.display = 'none';
        document.getElementById('successMsg').classList.add('show');
      } else {
        alert(data.message || 'Something went wrong. Please try again.');
        btn.textContent = orig;
        btn.disabled = false;
      }
    } catch {
      alert('Could not send your request. Please try again.');
      btn.textContent = orig;
      btn.disabled = false;
    }
  });

  // HERO ENTRANCE
  window.addEventListener('load', () => {
    document.querySelectorAll('.hero .hero-eyebrow, .hero .hero-headline, .hero .hero-sub, .hero .hero-actions').forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 0.8s ease ${i * 0.15}s, transform 0.8s ease ${i * 0.15}s`;
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 100);
    });
  });
