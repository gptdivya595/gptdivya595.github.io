const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealItems = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("is-visible"));
}

document.querySelectorAll("[data-carousel-prev], [data-carousel-next]").forEach(button => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.carouselPrev || button.dataset.carouselNext;
    const track = document.getElementById(targetId);
    if (!track) return;

    const direction = button.dataset.carouselNext ? 1 : -1;
    track.scrollBy({
      left: direction * Math.min(track.clientWidth * 0.85, 520),
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  });
});

document.querySelectorAll("[data-wheel-carousel]").forEach(track => {
  let activeTimer;

  track.addEventListener(
    "wheel",
    event => {
      const horizontalIntent = Math.abs(event.deltaX) > Math.abs(event.deltaY);
      const wheelAmount = horizontalIntent ? event.deltaX : event.deltaY;
      const maxScroll = track.scrollWidth - track.clientWidth;
      const canScroll = maxScroll > 0;

      if (!canScroll || Math.abs(wheelAmount) < 2) return;

      const nextLeft = Math.max(0, Math.min(maxScroll, track.scrollLeft + wheelAmount));
      if (nextLeft === track.scrollLeft) return;

      event.preventDefault();
      track.classList.add("is-wheel-active");
      track.scrollLeft = nextLeft;

      window.clearTimeout(activeTimer);
      activeTimer = window.setTimeout(() => {
        track.classList.remove("is-wheel-active");
      }, 320);
    },
    { passive: false }
  );
});

const marquee = document.querySelector(".responsibility-marquee div");
if (marquee) {
  marquee.innerHTML += marquee.innerHTML;
}
