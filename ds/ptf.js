/*
 * PowerToFly AI — Shared Design System JS
 * ds/ptf.js
 *
 * Usage: <script src="../ds/ptf.js"></script>
 * Then call PTF.initNav() and PTF.initMarquee() in your page script.
 */

window.PTF = (function () {

  /**
   * initNav()
   * Wires up the hamburger/drawer toggle and scroll-based nav transparency.
   * Requires: #hamburger, #mobileDrawer elements in the page.
   */
  function initNav() {
    // Hamburger toggle
    const btn    = document.getElementById('hamburger');
    const drawer = document.getElementById('mobileDrawer');
    if (btn && drawer) {
      btn.addEventListener('click', function () {
        const open = drawer.classList.toggle('open');
        btn.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', open);
        drawer.setAttribute('aria-hidden', !open);
      });
      document.addEventListener('click', function (e) {
        if (!btn.contains(e.target) && !drawer.contains(e.target)) {
          drawer.classList.remove('open');
          btn.classList.remove('open');
          btn.setAttribute('aria-expanded', false);
          drawer.setAttribute('aria-hidden', true);
        }
      });
    }

    // Scroll-based nav transparency (.nav.scrolled)
    const nav = document.querySelector('.nav');
    if (nav) {
      const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  }

  /**
   * LOGOS — the canonical client-logo list (single source of truth).
   * Add or remove a client HERE and every page's logo band updates.
   * Each entry maps to logos/<name>.png at the site root.
   */
  // Interleaved on purpose: big recognizable name, then a smaller one, repeating —
  // so the band reads varied. The newer/smaller logos are spread evenly through the
  // loop (~every 3rd slot), never grouped together. Keep this rhythm when adding more.
  var LOGOS = [
    'google', 'avery-dennison', 'plaid', 'visa', 'shure', 'lattice',
    'expedia', 'sp-global', 'karat', 'nestle', 'veracode', 'justworks',
    'zillow', 'stryker', 'reddit', 'zapier'
  ];

  /**
   * initMarquee(trackEl, items)
   * Fills a marquee track element with items duplicated for a seamless loop.
   * Called with NO items, it builds the default band from the canonical LOGOS
   * list above (img tags pointing at ../logos/<name>.png — pages live one level
   * deep). Pass items only to customise (e.g. a different img class).
   *
   * @param {HTMLElement|string} trackEl  - The track element or its ID
   * @param {string[]}          [items]   - Optional HTML strings; defaults to LOGOS
   */
  function initMarquee(trackEl, items) {
    if (typeof trackEl === 'string') trackEl = document.getElementById(trackEl);
    if (!trackEl) return;
    if (!items || !items.length) {
      items = LOGOS.map(function (n) {
        return '<img src="../logos/' + n + '.png" alt="' + n + '" loading="lazy">';
      });
    }
    if (!items.length) return;
    const html = items.join('');
    trackEl.innerHTML = html + html; // duplicate for seamless loop
  }

  /**
   * initMegaNav()
   * Wires up the mega-flyout nav (hover + click + Escape + overlay).
   * Requires: any [data-fly] trigger (a .nav-btn text trigger OR a real .btn pill),
   * matching .nav-fly#<id> panels. Optional: #navOverlay dimmer element.
   */
  function initMegaNav() {
    const btns = document.querySelectorAll('[data-fly]');
    if (!btns.length) return;
    const overlay = document.getElementById('navOverlay');
    let timer;
    function closeAll() {
      document.querySelectorAll('.nav-fly').forEach(f => f.classList.remove('open'));
      btns.forEach(b => b.classList.remove('open'));
      if (overlay) overlay.classList.remove('on');
    }
    function scheduleClose() { timer = setTimeout(closeAll, 220); }
    function cancelClose() { clearTimeout(timer); }
    btns.forEach(function (btn) {
      const drop = btn.closest('.nav-drop');
      const fly  = document.getElementById(btn.dataset.fly);
      if (!drop || !fly) return;
      if (btn.dataset.flyWired) return;   // idempotent: never wire a trigger twice
      btn.dataset.flyWired = '1';
      drop.addEventListener('mouseenter', function () { cancelClose(); closeAll(); fly.classList.add('open'); btn.classList.add('open'); if (overlay) overlay.classList.add('on'); });
      drop.addEventListener('mouseleave', scheduleClose);
      fly.addEventListener('mouseenter', cancelClose);
      fly.addEventListener('mouseleave', scheduleClose);
      btn.addEventListener('click', function (e) { e.stopPropagation(); const isOpen = fly.classList.contains('open'); closeAll(); if (!isOpen) { fly.classList.add('open'); btn.classList.add('open'); if (overlay) overlay.classList.add('on'); } });
    });
    if (overlay) overlay.addEventListener('click', closeAll);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });
  }

  /**
   * initHeader()
   * For pages using the fixed .site-header (top-alert + nav). Keeps body
   * padding equal to the header height and positions the drawer flush below it.
   * Requires: #siteHeader. Optional: #mobileDrawer, #hamburger.
   */
  function initHeader() {
    const header = document.getElementById('siteHeader');
    if (!header) return;
    const drawer = document.getElementById('mobileDrawer');
    const burger = document.getElementById('hamburger');
    function syncOffset() { document.body.style.paddingTop = header.offsetHeight + 'px'; }
    function positionDrawer() {
      if (!drawer) return;
      const bottom = header.getBoundingClientRect().bottom;
      drawer.style.top = bottom + 'px';
      drawer.style.height = (window.innerHeight - bottom) + 'px';
    }
    if (burger) burger.addEventListener('click', positionDrawer);
    window.addEventListener('resize', function () { syncOffset(); positionDrawer(); });
    // Re-sync if the alert bar is dismissed
    const alert = document.getElementById('topAlert') || document.querySelector('.top-alert');
    if (alert) alert.addEventListener('click', function (e) { if (e.target.closest('.top-alert-close')) { e.target.closest('.top-alert').classList.add('hidden'); syncOffset(); positionDrawer(); } });
    syncOffset();
  }

  /**
   * initIllustrations()  — the declarative cursor driver for interactive illustrations.
   * For each `.sci` scene: animate the `.sci-cursor` to each `[data-sci-step]` target
   * in ascending step order, "click" it (toggling `.is-on` on the target), hold, then
   * loop. No per-card keyframes or magic pixel numbers — the path is computed from each
   * target's live position. Style each target's `.is-on` state to react (fill, ring, etc).
   *   Scene opts (data-attrs on .sci): data-sci-hold (ms per step, default 1300),
   *   data-sci-glide (ms travel, default 520 — keep in sync with the CSS transition).
   * Honors prefers-reduced-motion (shows the final state, no motion). Starts on scroll-in.
   */
  function initIllustrations(root) {
    var scenes = (root || document).querySelectorAll('.sci');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    scenes.forEach(function (scene) {
      var cursor = scene.querySelector('.sci-cursor');
      // Group targets by step number — all targets sharing a step light on the same click.
      var map = {};
      Array.prototype.slice.call(scene.querySelectorAll('[data-sci-step]')).forEach(function (el) {
        var n = +el.dataset.sciStep; (map[n] = map[n] || []).push(el);
      });
      var order = Object.keys(map).map(Number).sort(function (a, b) { return a - b; });
      function setOn(n, on) { map[n].forEach(function (e) { e.classList.toggle('is-on', on); }); }
      if (!order.length) return;
      if (reduce || !cursor) { order.forEach(function (n) { setOn(n, true); }); return; }

      var hold = +scene.dataset.sciHold || 1300;
      var glide = +scene.dataset.sciGlide || 520;
      var i = -1, running = false;

      function park() {
        cursor.style.transform = 'translate(' + (scene.clientWidth * 0.5) + 'px,' + (scene.clientHeight - 16) + 'px)';
      }
      function moveTo(el) {
        var s = scene.getBoundingClientRect(), r = el.getBoundingClientRect();
        cursor.style.transform = 'translate(' + (r.left - s.left + r.width / 2) + 'px,' + (r.top - s.top + r.height / 2) + 'px)';
      }
      function step() {
        i++;
        if (i >= order.length) { // end of cycle: reset, park, loop
          setTimeout(function () {
            order.forEach(function (n) { setOn(n, false); });
            park();
            i = -1;
            setTimeout(step, 700);
          }, hold);
          return;
        }
        moveTo(map[order[i]][0]);                       // glide to the step's primary target
        setTimeout(function () {                         // arrived → click
          cursor.classList.add('is-click');
          setOn(order[i], true);                         // light all targets in this step
          setTimeout(function () { cursor.classList.remove('is-click'); }, 190);
          setTimeout(step, hold);
        }, glide);
      }
      function start() { if (running) return; running = true; park(); setTimeout(step, 700); }

      if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); start(); } });
        }, { threshold: 0.3 });
        io.observe(scene);
      } else { start(); }
    });
  }

  /* ────────────────────────────────────────────────────────────────
   * renderNav(mount) — SINGLE SOURCE OF TRUTH for the unified nav.
   * Put <div data-ptf-nav [data-theme="dark"] [data-active="employers"]></div>
   * on a page and this injects the nav + mobile drawer in its place.
   * Edit the markup here once → every page updates.
   * ──────────────────────────────────────────────────────────────── */
  var NAV_HTML = '\
<nav class="nav" id="mainNav">\
  <div class="nav-inner">\
    <a class="brand" href="../talents/" aria-label="PowerToFly AI — home">\
      <svg width="160" height="22" viewBox="0 0 160 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="PowerToFly"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.7617 10.928C15.7617 2.86221 21.426 0 26.2767 0C28.9615 0 31.3838 0.986191 33.0976 2.77713C34.9591 4.72298 35.9433 7.53213 35.9433 10.9005C35.9433 18.9575 30.5117 21.8282 25.4283 21.8282C22.7435 21.8282 20.3209 20.842 18.6074 19.0511C16.7459 17.1053 15.7617 14.2964 15.7617 10.928ZM26.4544 19.2225C29.7189 19.2225 31.7468 16.4109 31.7468 11.8849C31.7468 6.32669 29.1355 2.59233 25.2498 2.59233C21.9855 2.59233 19.9576 5.40392 19.9576 9.92991C19.9576 15.4881 22.5686 19.2225 26.4544 19.2225Z" fill="black"/><path d="M60.3487 0.682238L60.388 0.42334H64.0336L57.5637 21.4038H53.1831L49.515 6.05079L45.2528 21.4038H40.6598L35.6982 0.42334H39.7348L43.6016 17.256L47.9597 0.42334H52.024L55.958 17.3081L58.4575 8.50437L58.4691 8.51565C59.9813 3.03757 60.3445 0.708726 60.3487 0.682238Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M94.664 6.88663L94.7092 6.90919V6.41579C94.7092 0.978936 90.0786 0.24585 85.549 0.24585C84.3163 0.24585 83.0046 0.252558 82.0012 0.263231C80.6684 0.276649 80.002 0.3908 80.002 0.605684V21.3907H83.8285V12.6763L85.2266 12.8303L92.1919 21.3907H96.9639L89.0199 12.5641C90.8851 11.9548 94.3838 10.6094 94.664 6.88663ZM90.8143 6.52557C90.8142 8.0607 90.2706 10.6359 86.6306 10.6359C86.2535 10.6359 85.4803 10.6234 85.4092 10.6222L83.8428 10.5417V2.72962C84.1799 2.68602 84.8148 2.61954 85.5218 2.61954C88.2708 2.61954 90.8143 3.09281 90.8143 6.52557Z" fill="black"/><path d="M155.887 0.623079L155.96 0.42334H160L152.907 12.1195V21.3898H149.08V12.3994L141.196 0.42334H145.571L151.337 9.52014L152.047 8.22443C154.993 3.00663 155.87 0.667379 155.887 0.623079Z" fill="black"/><path d="M106.876 3.66406H97.958V5.88711H101.366V13.4064H103.674V5.88711H106.876V3.66406Z" fill="black"/><path fill-rule="evenodd" clip-rule="evenodd" d="M106.103 12.4732C106.103 9.61036 108.264 7.45166 111.129 7.45166C114.042 7.45166 116.157 9.5634 116.157 12.4732C116.157 15.3671 114.042 17.4676 111.129 17.4676C108.217 17.4676 106.103 15.3671 106.103 12.4732ZM111.129 15.2171C112.765 15.2171 113.78 14.1604 113.78 12.4595C113.78 10.8103 112.715 9.70215 111.129 9.70215C109.552 9.70215 108.492 10.8103 108.492 12.4595C108.492 14.1345 109.527 15.2171 111.129 15.2171Z" fill="black"/><path d="M69.3816 11.738H77.3604V9.2277H69.3816V2.91962H77.6205V0.42334H65.541V21.3901H78.1544V18.8935H69.3816V11.738Z" fill="black"/><path d="M123.464 21.3901H119.638V0.42334H131.717V2.91962H123.464V9.50093H131.416V12.1344H123.464V21.3901Z" fill="black"/><path d="M137.447 0.42334H133.62V21.3901H145.74V18.8935H137.447V0.42334Z" fill="black"/><path d="M0.299774 0.300435C0.330911 0.299825 3.43396 0.24585 5.57451 0.24585C8.59025 0.24585 11.6246 0.489195 13.3897 2.25726C14.3592 3.22821 14.8486 4.5907 14.844 6.30723C14.844 11.6026 10.3309 12.9465 8.39061 13.2783C7.54532 13.428 6.37461 13.5289 5.47865 13.5289C5.06654 13.5289 4.2823 13.4317 3.82684 13.3701V21.3904H0V9.09717L0.463397 9.37742C2.31088 10.4953 3.74473 11.101 6.026 11.101C9.29237 11.101 10.9488 9.63052 10.9488 6.73019C10.9488 3.11751 8.34604 2.61954 5.53329 2.61954C4.82202 2.61954 4.17119 2.68693 3.82684 2.73054V9.01819L3.43671 8.90567C3.3494 8.88036 1.28549 8.27199 0.0741802 6.86803L0 6.78203V0.305924L0.299774 0.300435Z" fill="black"/></svg>\
      <span class="brand-ai">AI</span>\
    </a>\
    <div class="nav-items">\
      <a class="nav-btn" data-nav="jobs" href="https://powertofly.com/jobs/">Jobs</a>\
      <a class="nav-btn" data-nav="events" href="https://powertofly.com/browse-events">Events</a>\
      <a class="nav-btn" data-nav="resources" href="https://powertofly.com/up">Resources</a>\
      <div class="nav-drop">\
        <button class="nav-btn" data-nav="employers" data-fly="fly-employers">For employers <svg class="nav-chev" viewBox="0 0 13 13"><polyline points="2,4.5 6.5,9 11,4.5"></polyline></svg></button>\
        <div class="nav-fly" id="fly-employers">\
          <div class="mega-inner emp-mega">\
            <div class="emp-body">\
              <a class="emp-home" href="../employers/"><span class="emp-home-tx"><span class="fly-eyebrow">Home</span><span class="fly-title">PowerToFly for employers</span><span class="fly-desc">The home for teams hiring and deploying AI talent.</span></span></a>\
              <hr class="fly-rule">\
              <div class="fly-eyebrow">Solutions</div>\
              <div class="emp-svc">\
                <a class="emp-svc-item" href="../hire/"><span class="emp-svc-tx"><span class="fly-title">Hire AI experts</span><span class="fly-desc">Qualified experts, ready from day one — full-time, contract,<br>or project.</span></span></a>\
                <a class="emp-svc-item" href="../train/"><span class="emp-svc-tx"><span class="fly-title">Improve AI performance</span><span class="fly-desc">Model training, evaluation, red teaming, and QA.</span></span></a>\
              </div>\
              <hr class="fly-rule">\
              <div class="fly-eyebrow">Resources &amp; events</div>\
              <div class="emp-re">\
                <a class="fly-item" href="#"><span class="emp-re-ic"><svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7z"></path></svg></span><div class="fly-title">Insights &amp; case studies</div></a>\
                <a class="fly-item" href="#"><span class="emp-re-ic"><svg viewBox="0 0 24 24"><path d="M15 8v8H5V8h10m1-2H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4V7c0-.55-.45-1-1-1z"></path></svg></span><div class="fly-title">Webinars &amp; summits</div></a>\
              </div>\
            </div>\
            <div class="emp-side">\
              <div class="emp-side-head"><div class="fly-eyebrow">Get started</div><div class="emp-foot-title">Tell us what you\'re building</div></div>\
              <p class="emp-foot-body">We\'ll match you with the right AI experts, across every industry.</p>\
              <div class="ind-chips"><span class="sc-title-chip">Healthcare</span><span class="sc-title-chip">Financial Services</span><span class="sc-title-chip">Legal</span><span class="sc-title-chip">Business Services</span><span class="sc-title-chip">Industrial &amp; Mfg</span><span class="sc-title-chip">Retail &amp; Ecommerce</span></div>\
              <div class="emp-side-foot"><a href="../book/" class="fly-cta">Book a discovery call →</a></div>\
            </div>\
          </div>\
        </div>\
      </div>\
      <a class="nav-btn" data-nav="about" href="https://powertofly.com/about">About</a>\
    </div>\
    <div class="nav-cta">\
      <div class="nav-drop login-drop">\
        <button class="btn btn-sm" data-fly="fly-login">Log in <svg class="nav-chev" viewBox="0 0 13 13"><polyline points="2,4.5 6.5,9 11,4.5"></polyline></svg></button>\
        <div class="nav-fly login-fly" id="fly-login">\
          <div class="mega-inner"><div class="mega-left">\
            <a class="fly-item" href="#"><span class="login-tx"><span class="fly-title">For employers</span><span class="fly-desc">Manage hires and projects</span></span><span class="login-arrow">→</span></a>\
            <hr class="fly-rule">\
            <a class="fly-item" href="#"><span class="login-tx"><span class="fly-title">For professionals</span><span class="fly-desc">Browse jobs and opportunities</span></span><span class="login-arrow">→</span></a>\
            <hr class="fly-rule">\
            <p class="login-signup">No account? Sign up as an <a href="#">employer</a> or an <a href="#">expert</a>.</p>\
          </div></div>\
        </div>\
      </div>\
      <a href="https://powertofly.com/talent" class="btn btn-primary btn-sm">Get matched</a>\
    </div>\
    <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>\
  </div>\
</nav>\
<div class="mobile-drawer" id="mobileDrawer" aria-hidden="true">\
  <a href="https://powertofly.com/jobs/">Jobs</a>\
  <a href="https://powertofly.com/browse-events">Events</a>\
  <a href="https://powertofly.com/up">Resources</a>\
  <a href="../employers/">For employers</a>\
  <a href="https://powertofly.com/about">About</a>\
  <div class="drawer-cta"><a href="#" class="btn btn-sm">Log in</a><a href="https://powertofly.com/talent" class="btn btn-primary btn-sm">Get matched</a></div>\
</div>';

  function renderNav(mount) {
    if (!mount) return;
    var theme  = mount.getAttribute('data-theme');
    var active = mount.getAttribute('data-active');
    mount.insertAdjacentHTML('beforebegin', NAV_HTML);
    var nav = mount.previousElementSibling;
    while (nav && !(nav.classList && nav.classList.contains('nav'))) nav = nav.previousElementSibling;
    if (nav) {
      if (theme === 'dark') nav.classList.add('nav-dark');
      if (active) { var a = nav.querySelector('.nav-btn[data-nav="' + active + '"]'); if (a) a.classList.add('is-active'); }
    }
    mount.parentNode.removeChild(mount);
  }

  return { initNav, initMarquee, initMegaNav, initHeader, initIllustrations, renderNav, LOGOS };
})();

// Auto-init the base nav (hamburger + scroll) on every page.
// Mega-flyout nav and the fixed site-header are opt-in — call
// PTF.initMegaNav() and/or PTF.initHeader() from the page if it uses them.
// (Existing pages wire these inline; new pages should use the shared ones.)
document.addEventListener('DOMContentLoaded', function () {
  // Inject the shared nav into any <div data-ptf-nav> placeholder, then wire it.
  var navMounts = document.querySelectorAll('[data-ptf-nav]');
  navMounts.forEach(PTF.renderNav);
  PTF.initNav();
  if (navMounts.length) PTF.initMegaNav();  // only shared-nav pages; inline-nav pages still wire their own
  PTF.initIllustrations();  // no-ops unless the page has .sci illustration scenes
});
