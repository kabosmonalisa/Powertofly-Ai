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

  return { initNav, initMarquee, initMegaNav, initHeader, initIllustrations, LOGOS };
})();

// Auto-init the base nav (hamburger + scroll) on every page.
// Mega-flyout nav and the fixed site-header are opt-in — call
// PTF.initMegaNav() and/or PTF.initHeader() from the page if it uses them.
// (Existing pages wire these inline; new pages should use the shared ones.)
document.addEventListener('DOMContentLoaded', function () {
  PTF.initNav();
  PTF.initIllustrations();  // no-ops unless the page has .sci illustration scenes
});
