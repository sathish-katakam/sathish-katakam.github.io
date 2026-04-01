/* =============================================
   PORTFOLIO SITE - Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Page Navigation ----
  const navLinks = document.querySelectorAll('[data-page]');
  const pages = document.querySelectorAll('.content-page');

  function navigateTo(pageId) {
    // Deactivate all pages
    pages.forEach(p => p.classList.remove('active'));
    navLinks.forEach(l => l.classList.remove('active'));

    // Activate target
    const targetPage = document.getElementById('page-' + pageId);
    if (targetPage) {
      targetPage.classList.add('active');
      // Trigger skill bar animations
      if (pageId === 'resume') initSkillBars();
    }

    // Activate nav links
    document.querySelectorAll(`[data-page="${pageId}"]`).forEach(l => l.classList.add('active'));

    // Scroll to top of content
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.getAttribute('data-page');
      navigateTo(page);
    });
  });

  // ---- Portfolio Filter ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = '';
          item.style.animation = 'fadeInUp 0.4s ease-out both';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // ---- Skill Bars ----
  function initSkillBars() {
    const fills = document.querySelectorAll('.skill-fill');
    fills.forEach(fill => {
      const width = fill.style.width;
      fill.style.width = '0';
      setTimeout(() => {
        fill.style.transition = 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
        fill.style.width = width;
      }, 100);
    });
  }

  // ---- Contact Form ----
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('.submit-btn');
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;

      setTimeout(() => {
        contactForm.style.display = 'none';
        formSuccess.style.display = 'block';
      }, 1800);
    });
  }

  // ---- Typing Animation ----
  const typingEl = document.getElementById('typing-text');
  if (typingEl) {
    const texts = ['DevOps Engineer', 'SRE Specialist', 'Cloud Architect', 'Infrastructure Guru'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const current = texts[textIndex];
      if (isDeleting) {
        typingEl.textContent = current.substring(0, charIndex - 1);
        charIndex--;
      } else {
        typingEl.textContent = current.substring(0, charIndex + 1);
        charIndex++;
      }

      if (!isDeleting && charIndex === current.length) {
        setTimeout(() => { isDeleting = true; type(); }, 1800);
        return;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
      }

      setTimeout(type, isDeleting ? 50 : 100);
    }

    type();
  }

  // ---- Particle / Ambient Dot Effect ----
  const canvas = document.getElementById('dot-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let dots = [];
    const NUM_DOTS = 40;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function createDots() {
      dots = [];
      for (let i = 0; i < NUM_DOTS; i++) {
        dots.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 2 + 1,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          alpha: Math.random() * 0.4 + 0.1,
        });
      }
    }

    function animateDots() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(d => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59,130,246,${d.alpha})`;
        ctx.fill();
      });
      // Draw connecting lines
      dots.forEach((d1, i) => {
        dots.slice(i + 1).forEach(d2 => {
          const dist = Math.hypot(d1.x - d2.x, d1.y - d2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(d1.x, d1.y);
            ctx.lineTo(d2.x, d2.y);
            ctx.strokeStyle = `rgba(59,130,246,${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      requestAnimationFrame(animateDots);
    }

    resizeCanvas();
    createDots();
    animateDots();
    window.addEventListener('resize', () => { resizeCanvas(); createDots(); });
  }

  // ---- Intersection Observer for timeline items ----
  const timelineItems = document.querySelectorAll('.timeline-item');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateX(0)';
      }
    });
  }, { threshold: 0.1 });

  timelineItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-12px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(item);
  });

  // ---- Initialize first page ----
  navigateTo('about');
});

/* =============================================
   PROJECT TOGGLE (global — called via onclick)
   ============================================= */
function toggleProject(headerEl) {
  const details = headerEl.nextElementSibling;
  const isOpen = headerEl.classList.contains('open');

  if (isOpen) {
    headerEl.classList.remove('open');
    details.classList.remove('open');
  } else {
    headerEl.classList.add('open');
    details.classList.add('open');
    // Smooth scroll so the card is in view
    setTimeout(() => {
      headerEl.closest('.portfolio-item').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  }
}

function openCertModal(el){
  const modal = document.getElementById("certModal");
  const modalImg = document.getElementById("certModalImg");

  modal.style.display = "flex";
  modalImg.src = el.querySelector("img").src;
}

function closeCertModal(){
  document.getElementById("certModal").style.display = "none";
}

function toggleBlog(el){
  const targetId = el.getAttribute("data-target") + "-content";
  const content = document.getElementById(targetId);

  const isOpen = el.classList.contains("open");

  // Close all
  document.querySelectorAll(".blog-item").forEach(b => b.classList.remove("open"));
  document.querySelectorAll(".blog-full").forEach(c => c.classList.remove("open"));

  if(!isOpen){
    el.classList.add("open");
    content.classList.add("open");

    setTimeout(() => {
      content.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }
}


// ================== CONTACT FORM (EMAILJS) ==================
document.getElementById("contactForm").addEventListener("submit", function(e){
  e.preventDefault();

  const btn = this.querySelector("button");
  btn.innerText = "Sending...";
  btn.disabled = true;

  emailjs.sendForm(
    "service_crymj4t",
    "template_3k9woi7",
    this
  ).then(()=>{

    document.getElementById("statusMsg").innerText = "✅ Message sent!";
    this.reset();

    btn.innerText = "Send Message";
    btn.disabled = false;

  }, (error)=>{

    console.error("EMAIL ERROR:", error);  // 🔥 shows real issue
    document.getElementById("statusMsg").innerText = "❌ Failed to send";

    btn.innerText = "Send Message";
    btn.disabled = false;
  });

});
