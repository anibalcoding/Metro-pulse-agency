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
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // MOBILE MENU
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  function closeMobile() { mobileMenu.classList.remove('open'); }
  document.querySelectorAll('.mobile-menu-link').forEach(link => {
    link.addEventListener('click', closeMobile);
  });

  // INTERSECTION OBSERVER
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting) {
        e.target.classList.add('visible');
        // stagger children for process steps
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal, .gallery-item, .process-step, .pricing-card, .pricing-card-custom').forEach(el => observer.observe(el));

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
        const source = video.querySelector('source');
        lbVideo.src = source ? source.src : video.currentSrc;
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
