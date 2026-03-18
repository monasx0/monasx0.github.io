/* ================================================================
   CYBERSEC PORTFOLIO — script.js
   ================================================================ */

"use strict";

/* ----------------------------------------------------------------
   1. CONFIGURATION — edit these values to personalise the site
   ---------------------------------------------------------------- */
const CONFIG = {
  // Greeting text that types out in the terminal prompt
  greeting: "whoami",

  // Roles that cycle under your name — add / remove freely
  roles: [
    "Cybersecurity Specialist",
    "Ethical Hacker",
    "Penetration Tester",
    "CTF Player",
    "Security Researcher",
    "Red Team Operator",
  ],

  // Particle settings
  particles: {
    count: 60,            // number of particles
    speed: 0.4,           // movement speed
    maxDist: 120,         // line draw distance
    color: "#00ff9f",     // match --accent in CSS
  },
};


/* ================================================================
   2. PARTICLE CANVAS
   ================================================================ */
(function initParticles() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let W, H, particles = [];
  let mouseX = -9999, mouseY = -9999;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * CONFIG.particles.speed,
      vy: (Math.random() - 0.5) * CONFIG.particles.speed,
      r: Math.random() * 1.5 + 0.5,
    };
  }

  function initParticleList() {
    particles = [];
    for (let i = 0; i < CONFIG.particles.count; i++) {
      particles.push(createParticle());
    }
  }

  function hexToRgb(hex) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `${r},${g},${b}`;
  }
  const rgb = hexToRgb(CONFIG.particles.color);

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update + draw dots
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb},0.6)`;
      ctx.fill();

      // Draw lines to nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.particles.maxDist) {
          const alpha = (1 - dist / CONFIG.particles.maxDist) * 0.25;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${rgb},${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      // React to mouse proximity
      const mdx = p.x - mouseX;
      const mdy = p.y - mouseY;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 100) {
        const force = (100 - mdist) / 100;
        p.vx += (mdx / mdist) * force * 0.3;
        p.vy += (mdy / mdist) * force * 0.3;
        // Dampen so they don't fly off
        p.vx *= 0.95;
        p.vy *= 0.95;
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", () => { resize(); initParticleList(); });
  window.addEventListener("mousemove", e => { mouseX = e.clientX; mouseY = e.clientY; });

  resize();
  initParticleList();
  draw();
})();


/* ================================================================
   3. CUSTOM CURSOR
   ================================================================ */
(function initCursor() {
  const dot  = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  if (!dot || !ring) return;

  let ringX = 0, ringY = 0;
  let dotX  = 0, dotY  = 0;

  window.addEventListener("mousemove", e => {
    dotX = e.clientX;
    dotY = e.clientY;
    dot.style.left = dotX + "px";
    dot.style.top  = dotY + "px";
  });

  // Ring lags slightly behind for trailing effect
  (function animateRing() {
    ringX += (dotX - ringX) * 0.12;
    ringY += (dotY - ringY) * 0.12;
    ring.style.left = ringX + "px";
    ring.style.top  = ringY + "px";
    requestAnimationFrame(animateRing);
  })();

  // Grow ring on hoverable elements
  const hoverTargets = "a, button, .project-card, .cert-card, .skill-item";
  document.addEventListener("mouseover", e => {
    if (e.target.closest(hoverTargets)) ring.classList.add("hovered");
  });
  document.addEventListener("mouseout", e => {
    if (e.target.closest(hoverTargets)) ring.classList.remove("hovered");
  });
})();


/* ================================================================
   4. NAVBAR — scroll state + active link
   ================================================================ */
(function initNavbar() {
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section");
  const hamburger = document.getElementById("hamburger");
  const navLinksUl = document.querySelector(".nav-links");

  // Scroll state
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
    updateActiveLink();
  });

  // Highlight active section in nav
  function updateActiveLink() {
    let current = "";
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - window.innerHeight / 2) {
        current = sec.id;
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === "#" + current);
    });
  }

  // Smooth-scroll on click
  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) target.scrollIntoView({ behavior: "smooth" });
      navLinksUl.classList.remove("open");
      hamburger.classList.remove("open");
    });
  });

  // Hamburger toggle
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    navLinksUl.classList.toggle("open");
  });
})();


/* ================================================================
   5. TYPING EFFECTS
   ================================================================ */
(function initTyping() {

  /* ── Terminal greeting (types once) ── */
  const greetingEl = document.getElementById("typedGreeting");
  if (greetingEl) {
    let i = 0;
    const text = CONFIG.greeting;
    const speed = 90;
    function typeGreeting() {
      if (i < text.length) {
        greetingEl.textContent += text[i++];
        setTimeout(typeGreeting, speed);
      }
    }
    setTimeout(typeGreeting, 800);
  }

  /* ── Role cycler ── */
  const rolesEl = document.getElementById("rolesText");
  if (!rolesEl) return;

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;
  const typeDelay   = 75;
  const deleteDelay = 35;
  const pauseDelay  = 1800;

  function typeRole() {
    const current = CONFIG.roles[roleIndex];

    if (deleting) {
      rolesEl.textContent = current.substring(0, charIndex--);
      if (charIndex < 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % CONFIG.roles.length;
        setTimeout(typeRole, 400);
        return;
      }
      setTimeout(typeRole, deleteDelay);
    } else {
      rolesEl.textContent = current.substring(0, charIndex++);
      if (charIndex > current.length) {
        deleting = true;
        setTimeout(typeRole, pauseDelay);
        return;
      }
      setTimeout(typeRole, typeDelay);
    }
  }

  setTimeout(typeRole, 1400);
})();


/* ================================================================
   6. COUNTER ANIMATION (stat numbers)
   ================================================================ */
(function initCounters() {
  const counters = document.querySelectorAll(".stat-num");
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target;
      const duration = 1400;
      const step = 20;
      const increment = Math.ceil(target / (duration / step));
      let current = 0;

      const interval = setInterval(() => {
        current = Math.min(current + increment, target);
        el.textContent = current;
        if (current >= target) clearInterval(interval);
      }, step);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();


/* ================================================================
   7. AOS (Animate On Scroll) init
   ================================================================ */
document.addEventListener("DOMContentLoaded", () => {
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
    });
  }
});


/* ================================================================
   8. CONTACT FORM — client-side validation + fake send
   ================================================================ */
(function initContactForm() {
  const form       = document.getElementById("contactForm");
  if (!form) return;

  const nameEl    = document.getElementById("nameInput");
  const emailEl   = document.getElementById("emailInput");
  const msgEl     = document.getElementById("messageInput");
  const nameErr   = document.getElementById("nameError");
  const emailErr  = document.getElementById("emailError");
  const msgErr    = document.getElementById("messageError");
  const success   = document.getElementById("formSuccess");
  const btnText   = document.getElementById("btnText");

  function setError(inputEl, errEl, msg) {
    errEl.textContent = msg;
    inputEl.classList.add("invalid");
  }
  function clearError(inputEl, errEl) {
    errEl.textContent = "";
    inputEl.classList.remove("invalid");
  }

  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    let valid = true;

    // Name
    if (!nameEl.value.trim()) {
      setError(nameEl, nameErr, "Name is required.");
      valid = false;
    } else {
      clearError(nameEl, nameErr);
    }

    // Email
    if (!emailEl.value.trim()) {
      setError(emailEl, emailErr, "Email is required.");
      valid = false;
    } else if (!validateEmail(emailEl.value.trim())) {
      setError(emailEl, emailErr, "Enter a valid email address.");
      valid = false;
    } else {
      clearError(emailEl, emailErr);
    }

    // Message
    if (!msgEl.value.trim()) {
      setError(msgEl, msgErr, "Message cannot be empty.");
      valid = false;
    } else {
      clearError(msgEl, msgErr);
    }

    if (!valid) return;

    // ── Simulate sending ─────────────────────────────────────
    // To wire up a real backend, replace the setTimeout block
    // below with a fetch() to your API endpoint or a service
    // like Formspree (https://formspree.io/).
    // ---------------------------------------------------------
    btnText.textContent = "Sending...";
    const btn = form.querySelector("button[type='submit']");
    btn.disabled = true;

    setTimeout(() => {
      form.reset();
      btnText.textContent = "Send Message";
      btn.disabled = false;
      success.classList.add("visible");
      setTimeout(() => success.classList.remove("visible"), 5000);
    }, 1200);
  });

  // Clear errors on input
  [nameEl, emailEl, msgEl].forEach(el => {
    el.addEventListener("input", () => {
      el.classList.remove("invalid");
    });
  });
})();


/* ================================================================
   9. COPY PGP KEY
   ================================================================ */
(function initCopyPGP() {
  const btn = document.getElementById("copyPGP");
  const text = document.getElementById("pgpText");
  if (!btn || !text) return;

  btn.addEventListener("click", () => {
    navigator.clipboard.writeText(text.textContent.trim()).then(() => {
      btn.textContent = "✓";
      btn.style.color = "var(--accent)";
      setTimeout(() => {
        btn.textContent = "⧉";
        btn.style.color = "";
      }, 1500);
    }).catch(() => {
      /* clipboard not available — silently ignore */
    });
  });
})();


/* ================================================================
   10. FOOTER YEAR
   ================================================================ */
(function setYear() {
  const el = document.getElementById("footerYear");
  if (el) el.textContent = new Date().getFullYear();
})();


/* ================================================================
   11. SCROLL-SNAP: keep nav active on manual scroll
   ================================================================ */
(function initScrollSpy() {
  const sections = document.querySelectorAll(".section");
  const navLinks = document.querySelectorAll(".nav-link");

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === "#" + entry.target.id
          );
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(sec => observer.observe(sec));
})();


/* ================================================================
   12. PROFILE IMAGE — add subtle parallax tilt on hover
   ================================================================ */
(function initProfileTilt() {
  const wrap = document.querySelector(".profile-wrap");
  if (!wrap) return;

  wrap.addEventListener("mousemove", e => {
    const rect = wrap.getBoundingClientRect();
    const cx   = rect.left + rect.width / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / (rect.width  / 2);
    const dy   = (e.clientY - cy) / (rect.height / 2);
    wrap.style.transform = `perspective(600px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg)`;
  });

  wrap.addEventListener("mouseleave", () => {
    wrap.style.transform = "";
    wrap.style.transition = "transform 0.6s ease";
    setTimeout(() => wrap.style.transition = "", 600);
  });
})();


/* ================================================================
   13. RANDOM HEX MATRIX RAIN (canvas overlay — very subtle)
       Runs only on the home section, fades out after 6 s
   ================================================================ */
(function initMatrixRain() {
  const homeSection = document.getElementById("home");
  if (!homeSection) return;

  const canvas = document.createElement("canvas");
  canvas.style.cssText = `
    position:absolute;inset:0;z-index:1;
    pointer-events:none;opacity:0;
    transition:opacity 1.2s ease;
  `;
  homeSection.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const chars = "01アイウエオカキクケコサシスセソタチ";
  let cols, drops;
  const fontSize = 13;

  function resize() {
    canvas.width  = homeSection.offsetWidth;
    canvas.height = homeSection.offsetHeight;
    cols  = Math.floor(canvas.width / fontSize);
    drops = new Array(cols).fill(1);
  }

  function draw() {
    ctx.fillStyle = "rgba(0,0,0,0.06)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,255,159,0.18)";
    ctx.font = fontSize + "px Share Tech Mono, monospace";

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  resize();
  window.addEventListener("resize", resize);

  // Fade in, then out
  let raf;
  setTimeout(() => {
    canvas.style.opacity = "1";
    raf = setInterval(draw, 50);
    setTimeout(() => {
      canvas.style.opacity = "0";
      setTimeout(() => clearInterval(raf), 1200);
    }, 4000);
  }, 300);
})();
