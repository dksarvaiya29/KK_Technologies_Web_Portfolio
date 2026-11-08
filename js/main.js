/**
 * KK TECHNOLOGIES - CLIENT PORTFOLIO & AGENCY INTERACTIVE JAVASCRIPT
 * Features:
 * 1. Interactive Hero Particle Canvas (Auto-scaled for mobile performance)
 * 2. Custom Glowing Mouse Follower (Disabled on touch)
 * 3. 3D Tilt Cards (Desktop only)
 * 4. Portfolio Filter System (All, E-Commerce, Web Apps, AI & Automation, Growth)
 * 5. Full Case Study Modal Drawer with Rich Data
 * 6. Interactive Scope & Proposal Estimator (Client Closing Engine)
 * 7. Dual Accent Glow Switcher (Electric Violet & Signature Orange - Desktop + Mobile)
 * 8. Form Validation & WhatsApp Lead Integration
 */

document.addEventListener('DOMContentLoaded', () => {

  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.innerWidth <= 1024;

  /* ==========================================================================
     1. THEME ACCENT GLOW TOGGLE (VIOLET <-> FLAME ORANGE)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const mobileThemeToggleBtn = document.getElementById('mobile-theme-toggle-btn');
  const currentTheme = localStorage.getItem('kk_theme_mode');

  if (currentTheme === 'flame') {
    document.body.classList.add('flame-mode');
    updateThemeIcon(true);
  }

  function toggleThemeMode() {
    document.body.classList.toggle('flame-mode');
    const isFlame = document.body.classList.contains('flame-mode');
    localStorage.setItem('kk_theme_mode', isFlame ? 'flame' : 'violet');
    updateThemeIcon(isFlame);
    showToast(isFlame ? '🔥 Switched to KK Signature Orange Accent' : '⚡ Switched to Electric Violet Accent');
  }

  if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleThemeMode);
  if (mobileThemeToggleBtn) mobileThemeToggleBtn.addEventListener('click', toggleThemeMode);

  function updateThemeIcon(isFlame) {
    const iconHtml = isFlame 
      ? '<i class="fa-solid fa-fire" title="KK Signature Orange Mode"></i>' 
      : '<i class="fa-solid fa-bolt" title="Electric Violet Mode"></i>';
    if (themeToggleBtn) themeToggleBtn.innerHTML = iconHtml;
    if (mobileThemeToggleBtn) mobileThemeToggleBtn.innerHTML = iconHtml;
  }

  /* ==========================================================================
     2. CUSTOM GLOWING MOUSE FOLLOWER (DESKTOP ONLY)
     ========================================================================== */
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorGlow = document.querySelector('.cursor-glow');

  if (!isTouchDevice && cursorDot && cursorGlow) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let glowX = mouseX;
    let glowY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function animateGlow() {
      glowX += (mouseX - glowX) * 0.12;
      glowY += (mouseY - glowY) * 0.12;
      cursorGlow.style.left = `${glowX}px`;
      cursorGlow.style.top = `${glowY}px`;
      requestAnimationFrame(animateGlow);
    }
    animateGlow();

    const hoverTargets = document.querySelectorAll('a, button, .project-card, .scope-option-card, .pillar-card');
    hoverTargets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorGlow.style.transform = 'translate(-50%, -50%) scale(1.4)';
      });
      el.addEventListener('mouseleave', () => {
        cursorGlow.style.transform = 'translate(-50%, -50%) scale(1)';
      });
    });
  }

  /* ==========================================================================
     3. INTERACTIVE HERO PARTICLE CANVAS
     ========================================================================== */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let mouse = { x: -1000, y: -1000 };

    function resizeCanvas() {
      canvas.width = canvas.parentElement ? canvas.parentElement.offsetWidth : window.innerWidth;
      canvas.height = canvas.parentElement ? canvas.parentElement.offsetHeight : window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    if (!isTouchDevice) {
      window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });
    }

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.7;
        this.speedY = (Math.random() - 0.5) * 0.7;
        this.baseColor = Math.random() > 0.4 ? '124, 58, 237' : '255, 90, 31';
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > canvas.height) this.speedY = -this.speedY;

        if (!isTouchDevice) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const force = (130 - dist) / 130;
            this.x -= (dx / dist) * force * 1.5;
            this.y -= (dy / dist) * force * 1.5;
          }
        }
      }
      draw() {
        ctx.fillStyle = `rgba(${this.baseColor}, 0.55)`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function initParticles() {
      particlesArray = [];
      // Adjust density for mobile vs desktop
      const divisor = isTouchDevice ? 32000 : 18000;
      const count = Math.min(Math.floor((canvas.width * canvas.height) / divisor), isTouchDevice ? 25 : 55);
      for (let i = 0; i < count; i++) {
        particlesArray.push(new Particle());
      }
    }
    initParticles();
    window.addEventListener('resize', initParticles);

    function connectParticles() {
      const maxDist = isTouchDevice ? 90 : 120;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.2;
            ctx.strokeStyle = `rgba(147, 95, 247, ${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesArray.forEach(p => {
        p.update();
        p.draw();
      });
      connectParticles();
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* ==========================================================================
     4. STICKY NAVBAR & ACTIVE SECTION OBSERVER
     ========================================================================== */
  const siteNav = document.querySelector('.site-nav');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      siteNav.classList.add('scrolled');
    } else {
      siteNav.classList.remove('scrolled');
    }

    let currentSection = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  /* ==========================================================================
     5. MOBILE NAVIGATION TOGGLE
     ========================================================================== */
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileBackdrop = document.querySelector('.mobile-menu-backdrop');
  const mobileCloseBtn = document.querySelector('.mobile-close-btn');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    mobileMenu.classList.add('active');
    mobileBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    mobileBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);
  if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobileMenu);
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileMenu);
  mobileNavLinks.forEach(l => l.addEventListener('click', closeMobileMenu));

  /* ==========================================================================
     6. 3D PERSPECTIVE TILT (DESKTOP ONLY)
     ========================================================================== */
  const tiltCard = document.querySelector('.hero-glass-card');
  if (tiltCard && !isTouchDevice) {
    tiltCard.addEventListener('mousemove', (e) => {
      const rect = tiltCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      tiltCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    tiltCard.addEventListener('mouseleave', () => {
      tiltCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  /* ==========================================================================
     7. PORTFOLIO FILTER SYSTEM
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterCategory === 'all' || cardCategory.includes(filterCategory)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 280);
        }
      });
    });
  });

  /* ==========================================================================
     8. CASE STUDY MODAL DRAWER
     ========================================================================== */
  const caseStudiesData = {
    vaishaliben: {
      title: "Vaishaliben Foods — E-Commerce Architecture & Growth",
      category: "E-Commerce / Packaged Food Brand",
      timeline: "3 Weeks Build & Launch",
      location: "Rajkot, Gujarat (All-India Shipping)",
      stack: "WordPress • WooCommerce • Custom PHP • Elementor • Meta Ads Funnel",
      bannerSvg: "assets/projects/vaishaliben.svg",
      challenge: "Vaishaliben Foods needed to transition from offline word-of-mouth sales of authentic winter delicacies (Adadiya, Methi Pak, etc.) into an automated direct-to-consumer digital storefront capable of handling nationwide orders without friction.",
      solution: "Engineered a high-speed WooCommerce storefront with customized product templates, an optimized single-page checkout flow, dynamic inventory alerts, and structured Meta Ads conversion funnels aligned with healthy food positioning.",
      metrics: [
        { label: "Mobile Speed", val: "0.78s Load Time" },
        { label: "Checkout Uplift", val: "+240% Order Completion" },
        { label: "Lead Funnel", val: "100% Automated Order Routing" }
      ],
      placeholderNote: "Ready to replace with real production screenshots once approved."
    },
    labhikrupa: {
      title: "Labhikrupa Farm Kitchen — Digital Presence & Booking",
      category: "Restaurant & Desi Dining",
      timeline: "2 Weeks Turnaround",
      location: "Rajkot Highway, Gujarat",
      stack: "Modern Mobile UI/UX • Instant QR Menu • WhatsApp API Booking • Google SEO",
      bannerSvg: "assets/projects/labhikrupa.svg",
      challenge: "The restaurant required a credible, high-end yet homely digital presence to attract highway travelers and city families, with zero table reservation bottlenecks and an instantly accessible mobile food menu.",
      solution: "Designed a mobile-first rustic luxury experience featuring instant QR-code digital menus (<0.5s load), a 1-tap WhatsApp table reservation engine, and local Google Map discovery optimization.",
      metrics: [
        { label: "QR Menu Speed", val: "Instant (Zero App Needed)" },
        { label: "Google Rating", val: "4.9 ★ Local Search Footprint" },
        { label: "Booking Velocity", val: "3x More Weekend Inquiries" }
      ],
      placeholderNote: "Client demo mockup ready for production photo integration."
    },
    apex: {
      title: "Apex Logistics & Fleet Cloud — Automation Portal",
      category: "Supply Chain & B2B Web App",
      timeline: "4 Weeks Delivery",
      location: "National Fleet Operations",
      stack: "Python • Fast API • SQL Database • Real-Time GPS Webhooks • Responsive Dashboard",
      bannerSvg: "assets/projects/apex_logistics.svg",
      challenge: "Manual dispatch scheduling, disconnected driver logs, and slow customer quotation turnarounds were eating up over 60 administrative hours per week.",
      solution: "Built a centralized web portal with automated dispatch routing, live GPS tracking webhooks, automated PDF consignment note generation, and an instant B2B rate quotation tool.",
      metrics: [
        { label: "Admin Workload", val: "-65% Manual Administrative Hours" },
        { label: "Fleet Sync", val: "1,400+ Units Tracked Realtime" },
        { label: "System Uptime", val: "99.8% Reliability SLA" }
      ],
      placeholderNote: "Internal architecture template ready for client brand deployment."
    },
    aura: {
      title: "Aura AI Conversational Support & Lead Qualifier",
      category: "AI & Automation / SaaS",
      timeline: "10 Days Integration",
      location: "Cloud Deployment (Global)",
      stack: "Gemini Pro / Claude API • WhatsApp Cloud API • Node.js • CRM Webhooks",
      bannerSvg: "assets/projects/aura_ai.svg",
      challenge: "Inbound sales inquiries arriving outside office hours were going unanswered for 12+ hours, resulting in over 40% lead drop-off to competitors.",
      solution: "Developed an autonomous 24/7 AI conversational agent trained on the client's proprietary knowledge base, capable of answering technical questions, booking strategy calls, and qualifying leads directly into CRM.",
      metrics: [
        { label: "Response Time", val: "< 3 Seconds (24/7/365)" },
        { label: "Query Accuracy", val: "99.2% Resolved Without Human" },
        { label: "Lead Capture", val: "+180% After-Hours Bookings" }
      ],
      placeholderNote: "Ready to deploy to your WhatsApp or website within 48 hours."
    },
    zenith: {
      title: "Zenith Luxury Estates — Cinematic Showcase",
      category: "Real Estate & Architecture",
      timeline: "3 Weeks Design & Build",
      location: "Luxury Property Developments",
      stack: "Interactive 3D UI • High-Res Floorplans • VIP Tour Concierge • Custom CSS",
      bannerSvg: "assets/projects/zenith_living.svg",
      challenge: "High-net-worth real estate buyers demanded an elite, immersive presentation that felt bespoke, sophisticated, and trustworthy before scheduling private property tours.",
      solution: "Crafted a cinematic dark-gold web showcase with interactive 360° floorplans, restrained motion animations, and an exclusive VIP private viewing concierge booking flow.",
      metrics: [
        { label: "Pipeline Value", val: "₹35+ Cr Inquiries Generated" },
        { label: "VIP Tour Ratio", val: "68% Completed Tour Bookings" },
        { label: "Average Session", val: "4.2 Minutes Deep Engagement" }
      ],
      placeholderNote: "Architecture showcase template ready for new villa projects."
    },
    pulsefit: {
      title: "PulseFit Nutrition — D2C E-Commerce Funnel",
      category: "D2C Health & Wellness",
      timeline: "2 Weeks Implementation",
      location: "Direct-to-Consumer (D2C)",
      stack: "High-Velocity Checkout • Sticky Buy Flow • Dynamic Upsells • Meta Pixel CAPI",
      bannerSvg: "assets/projects/pulsefit.svg",
      challenge: "High cart abandonment on mobile devices and low average order value (AOV) were restricting paid advertising profitability.",
      solution: "Engineered a high-velocity mobile sales funnel featuring 1-click bundle upsells, sticky add-to-cart controls, dynamic free-gift progress bars, and optimized Meta Pixel Conversion API tracking.",
      metrics: [
        { label: "Store Revenue", val: "+310% Online Sales Growth" },
        { label: "Paid ROAS", val: "4.2x Return On Ad Spend" },
        { label: "Cart Uplift", val: "+38% Average Order Value" }
      ],
      placeholderNote: "D2C growth framework ready for your e-commerce products."
    }
  };

  const modalBackdrop = document.querySelector('.modal-backdrop');
  const modalCloseBtn = document.querySelector('.modal-close-btn');
  const modalTitle = document.querySelector('.modal-title');
  const modalBannerImg = document.querySelector('.modal-hero-banner img');
  const modalCategoryVal = document.querySelector('.modal-cat-val');
  const modalTimelineVal = document.querySelector('.modal-time-val');
  const modalLocationVal = document.querySelector('.modal-loc-val');
  const modalStackVal = document.querySelector('.modal-stack-val');
  const modalChallengeText = document.querySelector('.modal-challenge-text');
  const modalSolutionText = document.querySelector('.modal-solution-text');
  const modalMetricsWrap = document.querySelector('.modal-metrics-container');
  const modalBookSimilarBtn = document.querySelector('.modal-book-similar-btn');

  function openCaseStudyModal(projectId) {
    const data = caseStudiesData[projectId];
    if (!data) return;

    modalTitle.textContent = data.title;
    modalBannerImg.src = data.bannerSvg;
    modalBannerImg.alt = data.title;
    modalCategoryVal.textContent = data.category;
    modalTimelineVal.textContent = data.timeline;
    modalLocationVal.textContent = data.location;
    modalStackVal.textContent = data.stack;
    modalChallengeText.textContent = data.challenge;
    modalSolutionText.textContent = data.solution;

    modalMetricsWrap.innerHTML = data.metrics.map(m => `
      <div class="metric-pill" style="padding: 12px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid var(--border-glass);">
        <div style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; color: #10B981;">${m.val}</div>
        <div style="font-size: 0.78rem; color: var(--text-muted);">${m.label}</div>
      </div>
    `).join('');

    if (modalBookSimilarBtn) {
      modalBookSimilarBtn.setAttribute('data-prefill', data.title);
    }

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCaseStudyModal() {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.open-case-study').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = el.getAttribute('data-project');
      if (projectId) openCaseStudyModal(projectId);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeCaseStudyModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeCaseStudyModal();
    });
  }

  if (modalBookSimilarBtn) {
    modalBookSimilarBtn.addEventListener('click', () => {
      const title = modalBookSimilarBtn.getAttribute('data-prefill');
      closeCaseStudyModal();
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        const msgField = document.getElementById('project-message');
        if (msgField) {
          msgField.value = `Hi KK Technologies team, I was impressed by your case study on "${title}". I would like to discuss building a similar digital solution for my business.`;
          msgField.focus();
        }
      }
    });
  }

  /* ==========================================================================
     9. INTERACTIVE SCOPE & PROPOSAL ESTIMATOR (THE CLIENT CLOSER)
     ========================================================================== */
  const serviceOptions = document.querySelectorAll('.service-opt');
  const featureOptions = document.querySelectorAll('.feature-opt');
  const timelineOptions = document.querySelectorAll('.timeline-opt');

  const summaryServiceEl = document.getElementById('calc-service-name');
  const summaryTimelineEl = document.getElementById('calc-timeline-val');
  const summaryStackEl = document.getElementById('calc-stack-val');
  const summaryFeaturesContainer = document.getElementById('calc-features-tags');
  const estimatorCtaBtn = document.getElementById('estimator-cta-btn');

  let currentEstimate = {
    service: "E-Commerce & Storefront Architecture",
    stack: "WooCommerce / Custom PHP / Next-gen Funnel",
    timeline: "3 to 4 Weeks",
    features: ["Payment Gateways", "WhatsApp Order Alerts", "Sub-1s Mobile Speed"]
  };

  serviceOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      serviceOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      currentEstimate.service = opt.getAttribute('data-name');
      currentEstimate.stack = opt.getAttribute('data-stack');
      updateEstimatorDisplay();
    });
  });

  featureOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      opt.classList.toggle('selected');
      const featureName = opt.getAttribute('data-feature');
      if (opt.classList.contains('selected')) {
        if (!currentEstimate.features.includes(featureName)) {
          currentEstimate.features.push(featureName);
        }
      } else {
        currentEstimate.features = currentEstimate.features.filter(f => f !== featureName);
      }
      updateEstimatorDisplay();
    });
  });

  timelineOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      timelineOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      currentEstimate.timeline = opt.getAttribute('data-timeline');
      updateEstimatorDisplay();
    });
  });

  function updateEstimatorDisplay() {
    if (summaryServiceEl) summaryServiceEl.textContent = currentEstimate.service;
    if (summaryTimelineEl) summaryTimelineEl.textContent = currentEstimate.timeline;
    if (summaryStackEl) summaryStackEl.textContent = currentEstimate.stack;

    if (summaryFeaturesContainer) {
      if (currentEstimate.features.length === 0) {
        summaryFeaturesContainer.innerHTML = '<span class="feature-tag" style="background: rgba(255,255,255,0.05); color: var(--text-muted); border-color: var(--border-glass);">Core Architecture Included</span>';
      } else {
        summaryFeaturesContainer.innerHTML = currentEstimate.features.map(f => 
          `<span class="feature-tag">${f}</span>`
        ).join('');
      }
    }
  }

  if (estimatorCtaBtn) {
    estimatorCtaBtn.addEventListener('click', () => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        const serviceSelect = document.getElementById('contact-service-select');
        const msgField = document.getElementById('project-message');

        if (serviceSelect) {
          if (currentEstimate.service.includes('E-Commerce')) serviceSelect.value = 'ecommerce';
          else if (currentEstimate.service.includes('Web')) serviceSelect.value = 'web';
          else if (currentEstimate.service.includes('AI')) serviceSelect.value = 'ai';
          else if (currentEstimate.service.includes('Growth')) serviceSelect.value = 'growth';
        }

        if (msgField) {
          msgField.value = `Hi KK Technologies, I calculated a project scope using your online estimator:\n- Service: ${currentEstimate.service}\n- Features: ${currentEstimate.features.join(', ') || 'Standard Core'}\n- Desired Delivery: ${currentEstimate.timeline}\n\nPlease share a formal proposal and schedule a discovery discussion.`;
          msgField.focus();
        }
      }
    });
  }

  /* ==========================================================================
     10. CONTACT FORM SUBMISSION & WHATSAPP INTEGRATION
     ========================================================================== */
  const contactForm = document.getElementById('agency-contact-form');
  const formSubmitBtn = document.getElementById('form-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('client-name').value.trim();
      const phone = document.getElementById('client-phone').value.trim();
      const email = document.getElementById('client-email').value.trim();
      const message = document.getElementById('project-message').value.trim();

      if (!name || !phone) {
        showToast('⚠️ Please enter your Name and WhatsApp/Phone number.');
        return;
      }

      const origText = formSubmitBtn.innerHTML;
      formSubmitBtn.disabled = true;
      formSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Submitting Proposal Request...';

      setTimeout(() => {
        formSubmitBtn.disabled = false;
        formSubmitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Request Received!';
        formSubmitBtn.style.background = '#10B981';

        showToast('🎉 Thank you! KK Technologies has received your project details. We will contact you within 24 hours.');

        setTimeout(() => {
          const confirmWhatsapp = confirm('Would you also like to open WhatsApp directly to connect immediately with KK Technologies?');
          if (confirmWhatsapp) {
            const waText = encodeURIComponent(`Hi KK Technologies team, my name is ${name}. I just submitted an inquiry regarding:\n${message || 'A digital project'}\nMy Contact: ${phone} / ${email}`);
            window.open(`https://wa.me/919999999999?text=${waText}`, '_blank');
          }
          contactForm.reset();
          formSubmitBtn.innerHTML = origText;
          formSubmitBtn.style.background = '';
        }, 1200);

      }, 900);
    });
  }

  /* ==========================================================================
     11. TOAST NOTIFICATION HELPER
     ========================================================================== */
  function showToast(message) {
    let toast = document.querySelector('.toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<i class="fa-solid fa-circle-check toast-icon"></i> <span>${message}</span>`;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 4500);
  }

});
