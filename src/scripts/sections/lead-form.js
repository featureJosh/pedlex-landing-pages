/* Lead form ([data-lead-form], sections/form.njk): accessible inline validation, UTM capture,
   honeypot, dataLayer conversion event and submit/redirect.
   - Without JS the browser's native validation runs and the form POSTs to its action.
   - Error strings come from the form's data-error-* attributes (content JSON), never from here.
   - The dataLayer event carries NO personal data: { landing, lang, form_id } only.
   - window.PEDLEX.formEndpoint set: POST FormData via fetch, then go to the thank-you page.
     Empty (preview): push the event and redirect to the thank-you page after a short delay. */
(function () {
  const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  const UTM_STORE = "pedlex-utm";
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // UTMs from the current URL win; otherwise reuse the ones captured earlier this session.
  function readUtms() {
    const params = new URLSearchParams(location.search);
    const fromUrl = {};
    UTM_KEYS.forEach((k) => { if (params.get(k)) fromUrl[k] = params.get(k).slice(0, 200); });
    try {
      if (Object.keys(fromUrl).length) sessionStorage.setItem(UTM_STORE, JSON.stringify(fromUrl));
      else return JSON.parse(sessionStorage.getItem(UTM_STORE) || "{}");
    } catch (e) { /* storage blocked: URL values only */ }
    return fromUrl;
  }

  function phoneOk(v) {
    const d = v.replace(/\D/g, "");
    return d.length === 10 || (d.length === 11 && d[0] === "1");
  }

  Pedlex.ready(() => {
    Pedlex.$$("[data-lead-form]").forEach((form) => {
      const msg = form.dataset;
      const cfg = Pedlex.config;
      const fields = Pedlex.$$("[data-field]", form).map((wrap) => ({
        wrap,
        input: wrap.querySelector("input, textarea"),
        error: wrap.querySelector("[data-field-error]"),
        text: wrap.querySelector("[data-field-error-text]"),
        touched: false,
      }));
      const alertBox = form.querySelector("[data-form-alert]");
      const alertTpl = form.querySelector("[data-form-alert-template]");
      const submit = form.querySelector("[data-submit]");
      const submitLabel = form.querySelector("[data-submit-label]");
      const idleLabel = submitLabel.textContent;
      const honeypot = form.querySelector("[data-honeypot]");
      let submitted = false;
      let sending = false;

      // JS takes over validation (inline messages instead of native bubbles).
      form.noValidate = true;

      // Context fields.
      const pageUrl = form.querySelector("[data-page-url]");
      if (pageUrl) pageUrl.value = location.href.split("#")[0];
      const utms = readUtms();
      Pedlex.$$("[data-utm]", form).forEach((el) => { el.value = utms[el.dataset.utm] || ""; });

      function check(f) {
        const v = f.input.value.trim();
        if (f.input.required && !v) return msg.errorRequired;
        if (!v) return "";
        if (f.input.type === "email" && !EMAIL.test(v)) return msg.errorEmail;
        if (f.input.type === "tel" && !phoneOk(v)) return msg.errorPhone;
        return "";
      }

      function show(f, error) {
        if (error) {
          f.text.textContent = error;
          f.error.hidden = false;
          f.input.setAttribute("aria-invalid", "true");
          f.input.setAttribute("aria-describedby", f.error.id);
        } else {
          f.error.hidden = true;
          f.text.textContent = "";
          f.input.removeAttribute("aria-invalid");
          f.input.removeAttribute("aria-describedby");
        }
        return !error;
      }

      function setAlert(text) {
        alertBox.replaceChildren();
        if (!text) return;
        const node = alertTpl.content.cloneNode(true);
        node.querySelector("[data-form-alert-text]").textContent = text;
        alertBox.append(node);
      }

      function setSending(on) {
        sending = on;
        submit.disabled = on;
        submit.setAttribute("aria-busy", on ? "true" : "false");
        submitLabel.textContent = on ? msg.sending : idleLabel;
      }

      // Validate on blur once the visitor has typed in the field (or after a submit attempt);
      // a field already flagged re-checks as they type so the message clears as soon as it's fixed.
      fields.forEach((f) => {
        f.input.addEventListener("input", () => {
          f.touched = true;
          if (f.input.getAttribute("aria-invalid") === "true") show(f, check(f));
          if (submitted && fields.every((x) => !check(x))) setAlert("");
        });
        f.input.addEventListener("blur", () => {
          if (f.touched || submitted) show(f, check(f));
        });
      });

      const goToThanks = () => { window.location.assign(cfg.thanksUrl); };

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (sending) return;
        submitted = true;

        const invalid = fields.filter((f) => !show(f, check(f)));
        if (invalid.length) {
          setAlert(msg.errorSummary);
          invalid[0].input.focus();
          return;
        }
        setAlert("");

        // Bots fill the honeypot: pretend it worked, record nothing.
        if (honeypot && honeypot.value) {
          setSending(true);
          setTimeout(goToThanks, 300);
          return;
        }

        setSending(true);
        Pedlex.push(cfg.leadEvent || "generate_lead", {
          landing: cfg.slug,
          lang: cfg.lang,
          form_id: form.closest("section[id]")?.id || "consultation",
        });

        if (!cfg.formEndpoint) {
          setTimeout(goToThanks, 300); // preview mode: let the dataLayer event flush, send nothing
          return;
        }
        try {
          const res = await fetch(cfg.formEndpoint, {
            method: "POST",
            body: new FormData(form),
            headers: { Accept: "application/json" },
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          goToThanks();
        } catch (err) {
          setSending(false);
          setAlert(msg.errorNetwork);
          submit.focus();
        }
      });
    });
  });
})();
