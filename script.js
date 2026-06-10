/* ============================================
   PORTFOLIO — Interactive Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ——— Particle Canvas Background ———
    initParticles();

    // ——— Cursor Glow ———
    initCursorGlow();

    // ——— Navbar Scroll Effects ———
    initNavbar();

    // ——— Hero Animations ———
    initHeroAnimations();

    // ——— Typing Effect ———
    initTypingEffect();

    // ——— Scroll Animations ———
    initScrollAnimations();

    // ——— Counter Animations ———
    initCounters();

    // ——— Mobile Nav Toggle ———
    initMobileNav();

    // ——— Smooth Scroll ———
    initSmoothScroll();
});

/* ============================================
   PARTICLE SYSTEM
   ============================================ */
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;
    let w, h;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.4 + 0.1;
            this.hue = Math.random() > 0.5 ? 265 : 190; // violet or cyan
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > w) this.speedX *= -1;
            if (this.y < 0 || this.y > h) this.speedY *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Create particles (density depends on screen size)
    const count = Math.min(Math.floor((w * h) / 15000), 80);
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const opacity = (1 - dist / 150) * 0.08;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(124, 58, 237, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        animId = requestAnimationFrame(animate);
    }

    animate();
}

/* ============================================
   CURSOR GLOW
   ============================================ */
function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow) return;

    // Only on desktop
    if (window.innerWidth < 768) {
        glow.style.display = 'none';
        return;
    }

    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function updateGlow() {
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        requestAnimationFrame(updateGlow);
    }

    updateGlow();
}

/* ============================================
   NAVBAR
   ============================================ */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = scrollY;
    });

    // Active nav link tracking
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + entry.target.id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.3, rootMargin: '-80px 0px -40% 0px' });

    sections.forEach(section => observer.observe(section));
}

/* ============================================
   HERO ANIMATIONS
   ============================================ */
function initHeroAnimations() {
    const animItems = document.querySelectorAll('.hero .animate-in');
    animItems.forEach((el, i) => {
        setTimeout(() => {
            el.classList.add('visible');
        }, 200 + i * 200);
    });
}

/* ============================================
   TYPING EFFECT
   ============================================ */
function initTypingEffect() {
    const el = document.getElementById('typedText');
    if (!el) return;

    const strings = [
        'AI / ML Engineer',
        'LLM & RAG Specialist',
        'Multi-Agent System Builder',
        'Cloud AI Architect',
    ];

    let stringIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 80;

    function type() {
        const current = strings[stringIndex];

        if (isDeleting) {
            el.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 40;
        } else {
            el.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 80;
        }

        if (!isDeleting && charIndex === current.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            stringIndex = (stringIndex + 1) % strings.length;
            typeSpeed = 500; // Pause before next string
        }

        setTimeout(type, typeSpeed);
    }

    // Start typing after hero animation
    setTimeout(type, 1200);
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
    // Observe sections, cards, etc.
    const observeTargets = document.querySelectorAll(
        '.section-header, .skill-category, .project-card, .impact-card, .cert-card, .contact-card, .edu-card, .about-content, .about-visual, .experience-header-card, .highlight-card'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Add stagger for grid items
                const delay = entry.target.dataset.delay || 0;
                entry.target.style.transitionDelay = delay + 'ms';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    observeTargets.forEach(el => {
        el.classList.add('observe-in');
        observer.observe(el);
    });
}

/* ============================================
   COUNTER ANIMATIONS
   ============================================ */
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'));
                animateCounter(el, target);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el, target) {
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out quint
        const eased = 1 - Math.pow(1 - progress, 5);
        const current = Math.floor(eased * target);

        el.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target.toLocaleString();
        }
    }

    requestAnimationFrame(update);
}

/* ============================================
   MOBILE NAV
   ============================================ */
function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        links.classList.toggle('active');
        document.body.style.overflow = links.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    links.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            links.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}
