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
      <a class="nav-btn" data-nav="about" href="../about/">About</a>\
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
  <a href="../about/">About</a>\
  <div class="drawer-cta"><a href="#" class="btn btn-sm">Log in</a><a href="https://powertofly.com/talent" class="btn btn-primary btn-sm">Get matched</a></div>\
</div>';

  /* Logged-in nav CTA — replaces "Log in" + "Get matched" when data-auth="in".
     {{INI}} {{NAME}} {{FULL}} are filled from data-initials / data-user / data-user-full
     (defaults below). Reuses the .login-fly flyout + .fly-item rows + the .avatar chip. */
  var NAV_CTA_IN = '\
<div class="nav-drop login-drop">\
  <button class="btn btn-sm" data-fly="fly-account">{{NAME}} <svg class="nav-chev" viewBox="0 0 13 13"><polyline points="2,4.5 6.5,9 11,4.5"></polyline></svg></button>\
  <div class="nav-fly login-fly" id="fly-account">\
    <div class="mega-inner"><div class="mega-left">\
      <a class="fly-item" href="#"><span class="login-tx"><span class="fly-title">{{FULL}}</span><span class="fly-desc">View profile</span></span><span class="login-arrow">→</span></a>\
      <hr class="fly-rule">\
      <a class="fly-item" href="#"><span class="login-tx"><span class="fly-title">Dashboard</span></span></a>\
      <hr class="fly-rule">\
      <a class="fly-item" href="#"><span class="login-tx"><span class="fly-title">My applications</span></span></a>\
      <hr class="fly-rule">\
      <a class="fly-item" href="#"><span class="login-tx"><span class="fly-title">Saved jobs</span></span></a>\
      <hr class="fly-rule">\
      <a class="fly-item" href="#"><span class="login-tx"><span class="fly-title">Account settings</span></span></a>\
      <hr class="fly-rule">\
      <a class="fly-item" href="#"><span class="login-tx"><span class="fly-title">Log out</span></span></a>\
    </div></div>\
  </div>\
</div>';
  // Mobile drawer CTA when logged in (replaces Log in / Get matched).
  var DRAWER_CTA_IN = '<a href="#" class="btn btn-primary btn-sm">Dashboard</a><a href="#" class="btn btn-sm">Log out</a>';

  function renderNav(mount) {
    if (!mount) return;
    var theme  = mount.getAttribute('data-theme');
    var active = mount.getAttribute('data-active');
    var auth   = mount.getAttribute('data-auth');
    mount.insertAdjacentHTML('beforebegin', NAV_HTML);
    var nav = mount.previousElementSibling;
    while (nav && !(nav.classList && nav.classList.contains('nav'))) nav = nav.previousElementSibling;
    if (nav) {
      if (theme === 'dark') nav.classList.add('nav-dark');
      if (active) { var a = nav.querySelector('.nav-btn[data-nav="' + active + '"]'); if (a) a.classList.add('is-active'); }
      if (auth === 'in') {
        var name = mount.getAttribute('data-user')       || 'Amara';
        var full = mount.getAttribute('data-user-full')  || 'Amara Okafor';
        var ctaHTML = NAV_CTA_IN.replace(/{{NAME}}/g, name).replace(/{{FULL}}/g, full);
        var cta = nav.querySelector('.nav-cta');
        if (cta) cta.innerHTML = ctaHTML;
        var drawerCta = mount.parentNode.querySelector('.mobile-drawer .drawer-cta');
        if (drawerCta) drawerCta.innerHTML = DRAWER_CTA_IN;
      }
    }
    mount.parentNode.removeChild(mount);
  }

  /* ────────────────────────────────────────────────────────────────
   * renderFooter(mount) — SINGLE SOURCE OF TRUTH for the unified footer.
   * Put <div data-ptf-footer></div> on a page and this injects the footer
   * in its place. Columns + links mirror the Option 2 nav exactly:
   *   For employers   → the "For employers" mega (employers / hire / train / book)
   *   For professionals → Jobs + Get matched + the "For professionals" portal
   *   Resources & events → the dropdown's Insights/Webinars + Events/Resources nav
   *   Company         → About
   * Edit the markup here once → every page updates.
   * ──────────────────────────────────────────────────────────────── */
  var FOOTER_HTML = '\
<footer class="footer">\
  <div class="footer-inner">\
    <div class="footer-cols">\
      <div>\
        <div class="footer-brand"><svg width="160" height="22" viewBox="0 0 160 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="PowerToFly"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.7617 10.928C15.7617 2.86221 21.426 0 26.2767 0C28.9615 0 31.3838 0.986191 33.0976 2.77713C34.9591 4.72298 35.9433 7.53213 35.9433 10.9005C35.9433 18.9575 30.5117 21.8282 25.4283 21.8282C22.7435 21.8282 20.3209 20.842 18.6074 19.0511C16.7459 17.1053 15.7617 14.2964 15.7617 10.928ZM26.4544 19.2225C29.7189 19.2225 31.7468 16.4109 31.7468 11.8849C31.7468 6.32669 29.1355 2.59233 25.2498 2.59233C21.9855 2.59233 19.9576 5.40392 19.9576 9.92991C19.9576 15.4881 22.5686 19.2225 26.4544 19.2225Z" fill="white"/><path d="M60.3487 0.682238L60.388 0.42334H64.0336L57.5637 21.4038H53.1831L49.515 6.05079L45.2528 21.4038H40.6598L35.6982 0.42334H39.7348L43.6016 17.256L47.9597 0.42334H52.024L55.958 17.3081L58.4575 8.50437L58.4691 8.51565C59.9813 3.03757 60.3445 0.708726 60.3487 0.682238Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M94.664 6.88663L94.7092 6.90919V6.41579C94.7092 0.978936 90.0786 0.24585 85.549 0.24585C84.3163 0.24585 83.0046 0.252558 82.0012 0.263231C80.6684 0.276649 80.002 0.3908 80.002 0.605684V21.3907H83.8285V12.6763L85.2266 12.8303L92.1919 21.3907H96.9639L89.0199 12.5641C90.8851 11.9548 94.3838 10.6094 94.664 6.88663ZM90.8143 6.52557C90.8142 8.0607 90.2706 10.6359 86.6306 10.6359C86.2535 10.6359 85.4803 10.6234 85.4092 10.6222L83.8428 10.5417V2.72962C84.1799 2.68602 84.8148 2.61954 85.5218 2.61954C88.2708 2.61954 90.8143 3.09281 90.8143 6.52557Z" fill="white"/><path d="M155.887 0.623079L155.96 0.42334H160L152.907 12.1195V21.3898H149.08V12.3994L141.196 0.42334H145.571L151.337 9.52014L152.047 8.22443C154.993 3.00663 155.87 0.667379 155.887 0.623079Z" fill="white"/><path d="M106.876 3.66406H97.958V5.88711H101.366V13.4064H103.674V5.88711H106.876V3.66406Z" fill="white"/><path fill-rule="evenodd" clip-rule="evenodd" d="M106.103 12.4732C106.103 9.61036 108.264 7.45166 111.129 7.45166C114.042 7.45166 116.157 9.5634 116.157 12.4732C116.157 15.3671 114.042 17.4676 111.129 17.4676C108.217 17.4676 106.103 15.3671 106.103 12.4732ZM111.129 15.2171C112.765 15.2171 113.78 14.1604 113.78 12.4595C113.78 10.8103 112.715 9.70215 111.129 9.70215C109.552 9.70215 108.492 10.8103 108.492 12.4595C108.492 14.1345 109.527 15.2171 111.129 15.2171Z" fill="white"/><path d="M69.3816 11.738H77.3604V9.2277H69.3816V2.91962H77.6205V0.42334H65.541V21.3901H78.1544V18.8935H69.3816V11.738Z" fill="white"/><path d="M123.464 21.3901H119.638V0.42334H131.717V2.91962H123.464V9.50093H131.416V12.1344H123.464V21.3901Z" fill="white"/><path d="M137.447 0.42334H133.62V21.3901H145.74V18.8935H137.447V0.42334Z" fill="white"/><path d="M0.299774 0.300435C0.330911 0.299825 3.43396 0.24585 5.57451 0.24585C8.59025 0.24585 11.6246 0.489195 13.3897 2.25726C14.3592 3.22821 14.8486 4.5907 14.844 6.30723C14.844 11.6026 10.3309 12.9465 8.39061 13.2783C7.54532 13.428 6.37461 13.5289 5.47865 13.5289C5.06654 13.5289 4.2823 13.4317 3.82684 13.3701V21.3904H0V9.09717L0.463397 9.37742C2.31088 10.4953 3.74473 11.101 6.026 11.101C9.29237 11.101 10.9488 9.63052 10.9488 6.73019C10.9488 3.11751 8.34604 2.61954 5.53329 2.61954C4.82202 2.61954 4.17119 2.68693 3.82684 2.73054V9.01819L3.43671 8.90567C3.3494 8.88036 1.28549 8.27199 0.0741802 6.86803L0 6.78203V0.305924L0.299774 0.300435Z" fill="white"/></svg><span class="brand-ai">AI</span></div>\
        <p class="footer-bio">The human layer behind better AI.</p>\
        <div class="footer-social">\
          <a href="https://www.facebook.com/powertofly" target="_blank" rel="noopener" aria-label="Facebook"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>\
          <a href="https://www.linkedin.com/company/powertofly/" target="_blank" rel="noopener" aria-label="LinkedIn"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>\
          <a href="https://www.youtube.com/channel/UCctuKkuo6wcKmwBQyHs2I7w" target="_blank" rel="noopener" aria-label="YouTube"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>\
          <a href="https://instagram.com/powertofly" target="_blank" rel="noopener" aria-label="Instagram"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg></a>\
          <a href="https://www.threads.net/@powertofly" target="_blank" rel="noopener" aria-label="Threads"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.028-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.357 3.616 8.74 3.594 12c.022 3.262.713 5.645 2.051 7.161 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.642-2.045 1.47-1.63 1.937-4.017 1.398-7.136-.308-1.815-1.045-3.143-2.802-3.919-1.287 4.572-4.434 6.214-8.427 5.54-.99-.163-1.856-.525-2.573-1.075-1.495-1.135-2.023-2.893-1.476-4.716.536-1.79 1.968-2.983 3.959-3.349 1.918-.35 3.77.001 5.186.97.247.166.478.351.69.554a5.88 5.88 0 0 0-.247-1.11c-.52-1.74-1.847-2.73-3.727-2.79-1.232-.04-2.308.378-2.911 1.13l-1.63-1.254c.94-1.222 2.498-1.954 4.46-1.954h.107c3.266.103 5.245 2.017 5.748 5.39.064.858.149 1.781.149 2.706 0 4.058-2.176 6.262-5.717 6.286zm-.056-11.02c-.11 0-.219.004-.328.012-1.198.084-2.065.573-2.308 1.295-.236.702.057 1.439.768 1.961.454.33 1.038.533 1.737.657 2.96.516 5.12-.455 5.835-3.783-.52-.254-1.068-.427-1.623-.504a7.56 7.56 0 0 0-1.03-.073c-.836 0-1.726.17-2.418.435z"/></svg></a>\
        </div>\
      </div>\
      <div class="footer-col">\
        <h5>For talent</h5>\
        <a href="https://powertofly.com/entry/signup-as-individual" target="_blank" rel="noopener">Sign up</a>\
        <a href="https://powertofly.com/jobs/" target="_blank" rel="noopener">Jobs</a>\
        <a href="https://powertofly.com/browse-events" target="_blank" rel="noopener">Events</a>\
        <a href="https://powertofly.com/up" target="_blank" rel="noopener">Blog</a>\
        <a href="https://powertofly.com/companies/all" target="_blank" rel="noopener">Companies</a>\
      </div>\
      <div class="footer-col">\
        <h5>For employers</h5>\
        <a href="https://powertofly.com/solutions/hire-ai-experts/" target="_blank" rel="noopener">Hire AI experts</a>\
        <a href="https://powertofly.com/employers/improve-ai-performance" target="_blank" rel="noopener">Improve AI performance</a>\
        <a href="https://powertofly.com/employers/events" target="_blank" rel="noopener">Webinars</a>\
        <a href="https://powertofly.com/up/employers" target="_blank" rel="noopener">Resources</a>\
      </div>\
      <div class="footer-col">\
        <h5>Our company</h5>\
        <a href="https://powertofly.com/about" target="_blank" rel="noopener">About us</a>\
        <a href="https://powertofly.com/about/contact-us" target="_blank" rel="noopener">Contact us</a>\
        <a href="https://powertofly.com/employers#request-demo" target="_blank" rel="noopener">Schedule a call</a>\
      </div>\
    </div>\
    <div class="footer-bottom">\
      <span>&copy; 2026 PowerToFly.</span>\
      <span class="links"><a href="https://powertofly.com/about/legal" target="_blank" rel="noopener">Legal and privacy</a></span>\
    </div>\
  </div>\
</footer>';

  function renderFooter(mount) {
    if (!mount) return;
    mount.insertAdjacentHTML('beforebegin', FOOTER_HTML);
    mount.parentNode.removeChild(mount);
  }

  /**
   * initEventList() — date-sorted event list(s) with a category filter, optional text
   * search, pagination, and an empty state. Runs for EVERY [data-ev-list] on the page
   * (e.g. an "Upcoming events" list + a "Past events" archive).
   * Per container: .ev-filter-btn[data-filter], .ev-row[data-type], optional
   * [data-ev-search] input, optional [data-ev-empty] element, and a .ev-pager
   * (.ev-pager-status + [data-ev-prev]/[data-ev-next]). data-ev-per = page size.
   */
  function initEventList(root) {
    [].slice.call((root || document).querySelectorAll('[data-ev-list]')).forEach(setupEventList);
  }
  function setupEventList(wrap) {
    var rows   = [].slice.call(wrap.querySelectorAll('.ev-row'));
    var btns   = [].slice.call(wrap.querySelectorAll('.ev-filter-btn'));
    var search = wrap.querySelector('[data-ev-search]');
    var empty  = wrap.querySelector('[data-ev-empty]');
    var pager  = wrap.querySelector('.ev-pager');
    var per    = parseInt(wrap.getAttribute('data-ev-per'), 10) || 6;
    var filter = 'all', term = '', page = 1;
    function matches(r) {
      if (filter !== 'all' && r.getAttribute('data-type') !== filter) return false;
      return !term || r.textContent.toLowerCase().indexOf(term) !== -1;
    }
    function render() {
      var visible = rows.filter(matches);
      var pages = Math.max(1, Math.ceil(visible.length / per));
      if (page > pages) page = pages;
      rows.forEach(function (r) { r.classList.add('is-hidden'); });
      visible.forEach(function (r, i) { if (i >= (page - 1) * per && i < page * per) r.classList.remove('is-hidden'); });
      if (empty) empty.hidden = visible.length > 0;
      if (pager) {
        if (pages > 1) {
          var html = '';
          for (var i = 1; i <= pages; i++) html += '<button class="ev-page' + (i === page ? ' is-active' : '') + '" data-ev-page="' + i + '">' + i + '</button>';
          pager.innerHTML = html;
          pager.style.display = 'flex';
        } else {
          pager.innerHTML = '';
          pager.style.display = 'none';
        }
      }
      btns.forEach(function (b) { b.classList.toggle('is-active', b.getAttribute('data-filter') === filter); });
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { filter = b.getAttribute('data-filter'); page = 1; render(); }); });
    if (search) search.addEventListener('input', function () { term = search.value.trim().toLowerCase(); page = 1; render(); });
    if (pager) pager.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ev-page]');
      if (b) { page = parseInt(b.getAttribute('data-ev-page'), 10); render(); }
    });
    render();
  }

  /**
   * initFaq()
   * Wires every .faq-list on the page: click a .faq-q to expand its .faq-a,
   * accordion-style (opening one closes the others). Idempotent + auto-run on
   * DOMContentLoaded, so a page only needs the markup — no per-page script.
   */
  function initFaq() {
    document.querySelectorAll('.faq-list').forEach(function (list) {
      if (list.dataset.faqWired) return;   // never wire the same list twice
      list.dataset.faqWired = '1';
      list.addEventListener('click', function (e) {
        var btn = e.target.closest('.faq-q');
        if (!btn || !list.contains(btn)) return;
        var item = btn.closest('.faq-item');
        var isOpen = item.classList.contains('open');
        list.querySelectorAll('.faq-item.open').forEach(function (i) {
          i.classList.remove('open');
          var q = i.querySelector('.faq-q'); if (q) q.setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) { item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
      });
    });
  }

  return { initNav, initMarquee, initMegaNav, initHeader, initIllustrations, initEventList, initFaq, renderNav, renderFooter, LOGOS };
})();

// Auto-init the base nav (hamburger + scroll) on every page.
// Mega-flyout nav and the fixed site-header are opt-in — call
// PTF.initMegaNav() and/or PTF.initHeader() from the page if it uses them.
// (Existing pages wire these inline; new pages should use the shared ones.)
// Inject the shared nav SYNCHRONOUSLY the moment ptf.js runs (it loads before a
// page's own inline <script>), so the nav already exists when that script measures
// the header height or references nav elements (e.g. #hamburger). Doing this later,
// on DOMContentLoaded, made those references throw and killed the rest of the page JS.
var _ptfNavRendered = false;
(function () {
  var mounts = document.querySelectorAll('[data-ptf-nav]');
  if (mounts.length) { mounts.forEach(PTF.renderNav); _ptfNavRendered = true; }
  // Same single-source treatment for the footer.
  document.querySelectorAll('[data-ptf-footer]').forEach(PTF.renderFooter);
})();

document.addEventListener('DOMContentLoaded', function () {
  PTF.initNav();
  if (_ptfNavRendered) PTF.initMegaNav();  // only shared-nav pages; inline-nav pages wire their own
  PTF.initIllustrations();  // no-ops unless the page has .sci illustration scenes
  PTF.initEventList();  // no-ops unless the page has a [data-ev-list] container
  PTF.initFaq();  // no-ops unless the page has a .faq-list container
});
