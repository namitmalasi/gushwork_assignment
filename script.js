/**
 * Mangalam HDPE Pipes - Product Page JavaScript
 * Features: Sticky Header, Image Carousel with Zoom, FAQ Accordion,
 *           Tabs Navigation, Mobile Menu, Touch Swipe
 */

document.addEventListener("DOMContentLoaded", () => {
  // Mobile Menu
  const mobileToggle = document.getElementById("mobileMenuToggle");
  const navLinks = document.getElementById("navLinks");

  if (mobileToggle) {
    mobileToggle.addEventListener("click", () => {
      mobileToggle.classList.toggle("active");
      navLinks.classList.toggle("mobile-open");
    });
  }

  //  Header
  const stickyHeader = document.getElementById("stickyHeader");
  const productHero = document.getElementById("productHero");
  let lastScrollY = 0;
  let ticking = false;

  function handleStickyHeader() {
    const currentScrollY = window.scrollY;
    const heroBottom = productHero
      ? productHero.offsetTop + productHero.offsetHeight
      : 600;

    if (currentScrollY > heroBottom) {
      stickyHeader.classList.add("visible");
    } else {
      stickyHeader.classList.remove("visible");
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(handleStickyHeader);
      ticking = true;
    }
  });

  //   Carousel
  const carouselTrack = document.getElementById("carouselTrack");
  const arrowLeft = document.getElementById("arrowLeft");
  const arrowRight = document.getElementById("arrowRight");
  const thumbnails = document.querySelectorAll(".thumb");
  const slides = document.querySelectorAll(".carousel-slide");
  const zoomPreview = document.getElementById("zoomPreview");
  const carouselMain = document.getElementById("carouselMain");

  let currentSlide = 0;
  const totalSlides = slides.length;

  function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentSlide = index;
    carouselTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle("active", i === currentSlide);
    });
  }

  if (arrowLeft) {
    arrowLeft.addEventListener("click", () => goToSlide(currentSlide - 1));
  }
  if (arrowRight) {
    arrowRight.addEventListener("click", () => goToSlide(currentSlide + 1));
  }

  thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const index = parseInt(thumb.dataset.index, 10);
      goToSlide(index);
    });
  });

  //  Zoom
  if (carouselMain && zoomPreview) {
    carouselMain.addEventListener("mouseenter", () => {
      // Get current slide's background image
      const activeSlide = slides[currentSlide];
      const bg = activeSlide.style.background;
      // Extract the URL from the background style
      const urlMatch = bg.match(/url\(['"]?(.*?)['"]?\)/);
      if (urlMatch && urlMatch[1]) {
        // Use a higher-res version for zoom
        const imageUrl = urlMatch[1]
          .replace("w=600", "w=1200")
          .replace("h=400", "h=800");
        zoomPreview.style.backgroundImage = `url('${imageUrl}')`;
        zoomPreview.style.backgroundSize = "200%";
        zoomPreview.classList.add("active");
      }
    });

    carouselMain.addEventListener("mousemove", (e) => {
      if (!zoomPreview.classList.contains("active")) return;
      const rect = carouselMain.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      zoomPreview.style.backgroundPosition = `${x}% ${y}%`;
    });

    carouselMain.addEventListener("mouseleave", () => {
      zoomPreview.classList.remove("active");
    });
  }

  let touchStartX = 0;
  let touchEndX = 0;
  const SWIPE_THRESHOLD = 50;

  if (carouselMain) {
    carouselMain.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true },
    );

    carouselMain.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > SWIPE_THRESHOLD) {
          if (diff > 0) {
            goToSlide(currentSlide + 1);
          } else {
            goToSlide(currentSlide - 1);
          }
        }
      },
      { passive: true },
    );
  }

  //  Faq
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      faqItems.forEach((other) => other.classList.remove("active"));

      if (!isActive) {
        item.classList.add("active");
        question.setAttribute("aria-expanded", "true");
      } else {
        question.setAttribute("aria-expanded", "false");
      }
    });
  });

  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.dataset.tab;

      tabBtns.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));

      btn.classList.add("active");
      const targetContent = document.getElementById(`tab-${tabId}`);
      if (targetContent) {
        targetContent.classList.add("active");
      }
    });
  });

  //   Contact Form
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert(
        "Thank you! Your quote request has been submitted. We will contact you shortly.",
      );
      contactForm.reset();
    });
  }

  const animateEls = document.querySelectorAll(
    ".feature-card, .testimonial-card, .section-title-serif, .section-title-bold, .section-title-mixed, .contact-card, .process-tabs",
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
  );

  animateEls.forEach((el, i) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = `opacity 0.5s ease ${i * 0.03}s, transform 0.5s ease ${i * 0.03}s`;
    observer.observe(el);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goToSlide(currentSlide - 1);
    if (e.key === "ArrowRight") goToSlide(currentSlide + 1);
  });
});
