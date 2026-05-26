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
   * initMarquee(trackEl, items)
   * Fills a marquee track element with items (strings of HTML) duplicated for seamless loop.
   *
   * @param {HTMLElement|string} trackEl  - The track element or its ID
   * @param {string[]}           items    - Array of HTML strings (e.g. '<img src="..." alt="...">')
   */
  function initMarquee(trackEl, items) {
    if (typeof trackEl === 'string') trackEl = document.getElementById(trackEl);
    if (!trackEl || !items || !items.length) return;
    const html = items.join('');
    trackEl.innerHTML = html + html; // duplicate for seamless loop
  }

  return { initNav, initMarquee };
})();

// Auto-init nav on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function () {
  PTF.initNav();
});
