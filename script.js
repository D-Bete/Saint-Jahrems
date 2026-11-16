// Update the order preview when a customer changes an option.
document.querySelectorAll(".coffin-popup form").forEach((form) => {
  const model = form.elements.namedItem("coffin");
  const size = form.elements.namedItem("size");
  const extra = form.elements.namedItem("extra");
  const price = form.closest(".product")?.querySelector(".product-copy > strong");
  const submit = form.querySelector('button[type="submit"]');

  if (!model || !size || !extra || !submit) return;

  const preview = document.createElement("p");
  preview.className = "order-preview";
  preview.setAttribute("aria-live", "polite");
  submit.before(preview);

  function updatePreview() {
    const details = [model.value, size.value, extra.value];

    if (price) details.push(price.textContent.trim());

    preview.textContent = details.join(" · ");
  }

  size.addEventListener("change", updatePreview);
  extra.addEventListener("change", updatePreview);
  window.addEventListener("pageshow", updatePreview);
  updatePreview();
});

// Reveal section headings letter by letter as they scroll into view.
if (
  "IntersectionObserver" in window &&
  window.matchMedia("(prefers-reduced-motion: no-preference)").matches
) {
  const sections = document.querySelectorAll(
    "#designs, #pricing .inquiry-inner, #contacts .inquiry-inner"
  );

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;

      const section = entry.target;
      const heading = section.querySelector("h2");

      if (heading) {
        const title = heading.textContent.trim();
        const letters = document.createDocumentFragment();
        let index = 0;

        // Preserve the full heading for screen readers.
        heading.setAttribute("aria-label", title);

        for (const part of title.split(/(\s+)/u)) {
          if (/^\s+$/u.test(part)) {
            letters.append(part);
            continue;
          }

          const word = document.createElement("span");
          word.className = "reveal-word";
          word.setAttribute("aria-hidden", "true");

          for (const character of part) {
            const letter = document.createElement("span");
            letter.className = "reveal-letter";
            letter.textContent = character;
            letter.style.setProperty("--letter-delay", `${index * 34}ms`);
            word.append(letter);
            index += 1;
          }

          letters.append(word);
        }

        heading.replaceChildren(letters);
      }

      section.classList.add("section-enter");
      observer.unobserve(section);
    }
  }, { rootMargin: "0px 0px -48px 0px" });

  sections.forEach((section) => observer.observe(section));
}