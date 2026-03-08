/**
 * Arpit Portfolio — shared.js
 * Injects nav + footer on every page, handles all interactions.
 */

'use strict';

/* ── HELPERS ──────────────────────────────────────────────────── */
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];

/* ── THEME MANAGER (Dark / Light) ───────────────────────────── */
const ThemeManager = {
  KEY: 'arpit-theme',

  init() {
    const saved      = localStorage.getItem(this.KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme      = saved || (prefersDark ? 'dark' : 'light');
    this.apply(theme, false);

    // React to OS-level changes when user hasn't manually chosen
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem(this.KEY)) this.apply(e.matches ? 'dark' : 'light', false);
    });
  },

  apply(theme, save = true) {
    document.documentElement.setAttribute('data-theme', theme);
    if (save) localStorage.setItem(this.KEY, theme);
    this.syncButton(theme);
  },

  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    this.apply(current === 'dark' ? 'light' : 'dark');
  },

  syncButton(theme) {
    const btn     = document.getElementById('theme-toggle');
    if (!btn) return;
    const moon    = btn.querySelector('.icon-moon');
    const sun     = btn.querySelector('.icon-sun');
    if (moon) moon.style.display = theme === 'dark'  ? 'block' : 'none';
    if (sun)  sun.style.display  = theme === 'light' ? 'block' : 'none';
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  },
};

/* ── ACTIVE PAGE DETECTION ───────────────────────────────────── */
function getActivePage() {
  const p = window.location.pathname;
  if (p === '/' || p.endsWith('index.html')) return 'home';
  if (p.includes('projects')) return 'projects';
  if (p.includes('embedded')) return 'embedded';
  if (p.includes('vlsi')) return 'vlsi';
  if (p.includes('mern')) return 'mern';
  if (p.includes('ai-ml') || p.includes('ai_ml')) return 'ai-ml';
  if (p.includes('about')) return 'about';
  if (p.includes('contact')) return 'contact';
  return '';
}

/* ── NAV INJECTION ───────────────────────────────────────────── */
function injectNav() {
  const active = getActivePage();
  const links = [
    { href: 'index.html',    label: 'Home',      key: 'home' },
    { href: 'pages/embedded.html', label: 'Embedded', key: 'embedded' },
    { href: 'pages/vlsi.html',     label: 'VLSI',     key: 'vlsi' },
    { href: 'pages/mern.html',     label: 'MERN',     key: 'mern' },
    { href: 'pages/ai-ml.html',    label: 'AI/ML',    key: 'ai-ml' },
    { href: 'pages/projects.html', label: 'Projects', key: 'projects' },
    { href: 'pages/about.html',    label: 'About',    key: 'about' },
  ];

  // Adjust hrefs if we're inside /pages/
  const inPages = window.location.pathname.includes('/pages/');
  const prefix  = inPages ? '../' : '';

  const navHTML = `
  <nav class="nav" id="site-nav" role="navigation" aria-label="Primary navigation">
    <div class="wrap nav-inner">
      <a href="${prefix}index.html" class="nav-logo" aria-label="Arpit Portfolio Home">
        Arpit Tyagi<span>.</span><span class="dot"></span>
      </a>
      <div class="nav-links" role="menubar">
        ${links.map(l => `
          <a href="${prefix}${l.href}"
             class="${active === l.key ? 'active' : ''}"
             role="menuitem"
             ${active === l.key ? 'aria-current="page"' : ''}>
            ${l.label}
          </a>
        `).join('')}
      </div>
      <div style="display:flex;align-items:center;gap:var(--s3);">
        <button class="theme-toggle" id="theme-toggle" aria-label="Toggle dark mode">
          <svg class="icon-moon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          <svg class="icon-sun" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="display:none;"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        </button>
        <a href="${prefix}pages/contact.html" class="nav-cta">Hire Me →</a>
        <button class="nav-hamburger" id="nav-ham" aria-label="Open menu" aria-expanded="false" aria-controls="nav-mobile">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </nav>
  <div class="nav-mobile" id="nav-mobile" role="dialog" aria-label="Mobile navigation">
    ${links.map(l => `<a href="${prefix}${l.href}">${l.label}</a>`).join('')}
    <a href="${prefix}pages/contact.html" style="color:var(--amber);">Contact ↗</a>
  </div>`;

  const placeholder = document.getElementById('nav-placeholder');
  if (placeholder) {
    placeholder.outerHTML = navHTML;
  } else {
    document.body.insertAdjacentHTML('afterbegin', navHTML);
  }

  initNav();
}

function initNav() {
  const nav    = $('#site-nav');
  const ham    = $('#nav-ham');
  const mobile = $('#nav-mobile');

  // Scroll effect
  const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Theme toggle
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    ThemeManager.toggle();
  });

  // Hamburger
  ham?.addEventListener('click', () => {
    const open = mobile.classList.toggle('open');
    ham.classList.toggle('open', open);
    ham.setAttribute('aria-expanded', open.toString());
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close mobile on link click
  $$('#nav-mobile a').forEach(a => {
    a.addEventListener('click', () => {
      mobile?.classList.remove('open');
      ham?.classList.remove('open');
      ham?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Esc key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobile?.classList.contains('open')) {
      mobile.classList.remove('open');
      ham?.classList.remove('open');
      ham?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      ham?.focus();
    }
  });
}

/* ── FOOTER INJECTION ───────────────────────────────────────── */
function injectFooter() {
  const inPages = window.location.pathname.includes('/pages/');
  const p = inPages ? '../' : '';

  const footerHTML = `
  <footer role="contentinfo">
    <div class="wrap">
      <div class="footer-inner">
        <div>
          <a href="${p}index.html" class="footer-brand-logo">Arpit<span>.</span></a>
          <p class="footer-desc">
            Multi-domain ECE engineer — bridging the gap between silicon design and intelligent software systems. Building at the intersection of hardware and AI.
          </p>
        </div>
        <div>
          <p class="footer-col-title">Domains</p>
          <div class="footer-links">
            <a href="${p}pages/embedded.html">Embedded Systems</a>
            <a href="${p}pages/vlsi.html">VLSI Design</a>
            <a href="${p}pages/mern.html">MERN Stack</a>
            <a href="${p}pages/ai-ml.html">AI / ML</a>
          </div>
        </div>
        <div>
          <p class="footer-col-title">Site</p>
          <div class="footer-links">
            <a href="${p}pages/projects.html">All Projects</a>
            <a href="${p}pages/about.html">About Me</a>
            <a href="${p}pages/contact.html">Contact</a>
            <a href="${p}index.html">Home</a>
          </div>
        </div>
        <div>
          <p class="footer-col-title">Connect</p>
          <div class="footer-links">
            <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            <a href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer">Twitter / X ↗</a>
            <a href="mailto:arpit@example.com">Email Me</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-copy">© ${new Date().getFullYear()} Arpit. All rights reserved.</p>
        <div class="footer-socials">
          <a href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.44 9.8 8.21 11.39.6.11.79-.26.79-.58v-2.23c-3.34.73-4.03-1.42-4.03-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4 1.02 0 2.04.13 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.19.69.8.58C20.56 21.8 24 17.31 24 12c0-6.63-5.37-12-12-12z"/></svg>
          </a>
          <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43c-1.14 0-2.06-.93-2.06-2.07 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.92 2.06 2.06 0 1.14-.92 2.07-2.06 2.07zM6.78 20.45H3.89V9h2.89v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>
          </a>
        </div>
      </div>
    </div>
  </footer>`;

  const placeholder = document.getElementById('footer-placeholder');
  if (placeholder) {
    placeholder.outerHTML = footerHTML;
  } else {
    document.body.insertAdjacentHTML('beforeend', footerHTML);
  }
}

/* ── SCROLL REVEAL ───────────────────────────────────────────── */
function initReveal() {
  if (!window.IntersectionObserver) {
    $$('.reveal').forEach(el => el.classList.add('revealed'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  $$('.reveal').forEach(el => io.observe(el));
}

/* ── BACK TO TOP ─────────────────────────────────────────────── */
function initBtt() {
  const btn = document.createElement('button');
  btn.id = 'btt';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '↑';
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── CONTACT FORM ────────────────────────────────────────────── */
function initContactForm() {
  const form   = document.getElementById('contact-form');
  if (!form) return;

  const status = document.getElementById('form-status');
  const submit = form.querySelector('.form-submit');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Simple client validation
    const name  = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const msg   = form.querySelector('[name="message"]').value.trim();
    const re    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || name.length < 2) {
      showStatus('err', '✗ Please enter your full name.'); return;
    }
    if (!email || !re.test(email)) {
      showStatus('err', '✗ Please enter a valid email address.'); return;
    }
    if (!msg || msg.length < 10) {
      showStatus('err', '✗ Message must be at least 10 characters.'); return;
    }

    // Since this is a static site, we'll use Formspree (free tier).
    // Replace YOUR_FORM_ID with your Formspree form ID.
    submit.disabled = true;
    submit.textContent = 'Sending...';
    hideStatus();

    const formData = new FormData(form);
    formData.append('_subject', `Portfolio Contact from ${name}`);

    try {
      const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });

      if (res.ok) {
        showStatus('ok', `✓ Message sent! I'll reply to ${email} soon.`);
        form.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch {
      // Fallback: open mailto
      const mailBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`);
      window.location.href = `mailto:arpit@example.com?subject=Portfolio Contact&body=${mailBody}`;
      showStatus('ok', '✓ Opening your email client...');
    } finally {
      submit.disabled = false;
      submit.textContent = 'Send Message →';
    }
  });

  function showStatus(type, msg) {
    if (!status) return;
    status.className = `form-status ${type}`;
    status.textContent = msg;
    status.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function hideStatus() {
    if (status) status.className = 'form-status';
  }

  // Real-time validation highlight
  $$('.form-input, .form-textarea', form).forEach(el => {
    el.addEventListener('blur', () => {
      el.style.borderColor = el.value.trim() ? '' : 'rgba(255,107,53,0.5)';
    });
    el.addEventListener('input', () => { el.style.borderColor = ''; });
  });
}

/* ── PROJECT FILTER ──────────────────────────────────────────── */
function initProjectFilter() {
  const btns  = $$('.filter-btn');
  const cards = $$('.pcard[data-domain]');
  if (!btns.length || !cards.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      btns.forEach(b => b.classList.toggle('active', b === btn));

      cards.forEach(card => {
        const show = f === 'all' || card.dataset.domain === f;
        card.style.transition = 'opacity 0.3s, transform 0.3s';
        card.style.opacity    = show ? '1' : '0.15';
        card.style.transform  = show ? '' : 'scale(0.97)';
        card.style.pointerEvents = show ? '' : 'none';
      });
    });
  });
}

/* ── SMOOTH SCROLL FOR ANCHOR LINKS ─────────────────────────── */
function initAnchorScroll() {
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id  = a.getAttribute('href').slice(1);
      const el  = document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      const offset = ($('#site-nav')?.offsetHeight || 80) + 16;
      window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - offset, behavior: 'smooth' });
    });
  });
}

/* ── ANIMATED COUNTER ────────────────────────────────────────── */
function initCounters() {
  const counters = $$('[data-count]');
  if (!counters.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      const end  = parseInt(target.dataset.count);
      const dur  = 1400;
      const step = 16;
      const inc  = end / (dur / step);
      let cur    = 0;
      const timer = setInterval(() => {
        cur = Math.min(cur + inc, end);
        target.textContent = target.dataset.suffix
          ? Math.round(cur) + target.dataset.suffix
          : Math.round(cur) + (end > 10 ? '+' : '');
        if (cur >= end) clearInterval(timer);
      }, step);
      io.unobserve(target);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => io.observe(c));
}

/* ── INIT ALL ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  injectNav();
  injectFooter();
  initReveal();
  initBtt();
  initContactForm();
  initProjectFilter();
  initAnchorScroll();
  initCounters();
});
