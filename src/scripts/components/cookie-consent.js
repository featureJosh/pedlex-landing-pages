/* Law 25 consent: shows the banner until the visitor chooses, stores the choice, and updates
   Google Consent Mode (defaults to denied in partials/tracking-head.njk). The footer
   "cookie preferences" button reopens it. */
(function () {
  const KEY = "pedlex-consent";
  const read = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  const write = (v) => { try { localStorage.setItem(KEY, v); } catch (e) {} };

  Pedlex.ready(() => {
    const banner = document.querySelector("[data-cookie-banner]");
    if (!banner) return;
    const show = () => { banner.hidden = false; };
    const hide = () => { banner.hidden = true; };

    if (!read()) show();

    banner.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-cookie-choice]");
      if (!btn) return;
      const choice = btn.dataset.cookieChoice;
      write(choice);
      if (typeof window.gtag === "function") {
        const v = choice === "granted" ? "granted" : "denied";
        window.gtag("consent", "update", { ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v });
      }
      Pedlex.push("consent_update", { consent: choice });
      hide();
    });

    Pedlex.$$("[data-cookie-open]").forEach((b) => b.addEventListener("click", () => {
      show();
      banner.querySelector("[data-cookie-choice]")?.focus();
    }));
  });
})();
