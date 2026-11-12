let currentIndex = 1;
let autoPlayInterval = null;

document.addEventListener('DOMContentLoaded', () => {
    // 1. Lenis Smooth Scroll
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
    }

    // 2. Inicializar y comprobar tamaño de ventana para el carrusel
    checkWindowSize();

    // Adaptación dinámica al cambiar de tamaño la pantalla
    window.addEventListener('resize', checkWindowSize);

    // 3. GSAP Fade Up & Load Animations
    if (typeof gsap !== 'undefined') {
        gsap.from('.Gsap-Text-Load', {
            duration: 1.2,
            y: 30,
            opacity: 0,
            stagger: 0.15,
            ease: 'power3.out'
        });

        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);

            gsap.utils.toArray('.fade-up').forEach((el) => {
                gsap.to(el, {
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power2.out'
                });
            });
        }
    } else {
        // Fallback en caso de que GSAP no esté presente
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    }
});

/* ==========================================
   LÓGICA DEL CARRUSEL (ADAPTATIVA MÓVIL/DESKTOP)
   ========================================== */

function checkWindowSize() {
    const track = document.getElementById('carouselTrack');
    
    if (window.innerWidth <= 480) {
        // En móviles <= 480px se detiene la lógica JS
        stopAutoPlay();
        if (track) {
            // Se elimina el transform inline para dar prioridad a la animación CSS (@keyframes)
            track.style.removeProperty('transform');
        }
    } else {
        // En escritorio y tablets funciona el carrusel interactivo por JS
        initCarousel();
    }
}

function initCarousel() {
    const track = document.getElementById('carouselTrack');
    const wrapper = document.getElementById('heroCarouselWrapper');
    if (!track || !wrapper) return;

    updateCarousel();
    startAutoPlay();
}

window.moveCarousel = function (direction) {
    if (window.innerWidth <= 480) return;
    const slides = document.querySelectorAll('.carousel-slide:not(.mobile-clone)');
    if (!slides.length) return;

    currentIndex += direction;

    if (currentIndex < 0) {
        currentIndex = slides.length - 1;
    } else if (currentIndex >= slides.length) {
        currentIndex = 0;
    }

    updateCarousel();
};

function updateCarousel() {
    if (window.innerWidth <= 480) return;
    const track = document.getElementById('carouselTrack');
    const slides = document.querySelectorAll('.carousel-slide:not(.mobile-clone)');
    if (!track || !slides.length) return;

    slides.forEach((slide, idx) => {
        if (idx === currentIndex) {
            slide.classList.add('active-slide');
        } else {
            slide.classList.remove('active-slide');
        }
    });

    const activeSlide = slides[currentIndex];
    const wrapper = document.getElementById('heroCarouselWrapper');
    const wrapperWidth = wrapper.offsetWidth;
    const slideOffsetLeft = activeSlide.offsetLeft;
    const slideWidth = activeSlide.offsetWidth;

    const targetPosition = slideOffsetLeft - (wrapperWidth / 2) + (slideWidth / 2);
    track.style.transform = `translateX(-${targetPosition}px)`;
}

function startAutoPlay() {
    if (window.innerWidth <= 480) return;
    stopAutoPlay();
    autoPlayInterval = setInterval(() => {
        window.moveCarousel(1);
    }, 4000);
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
}

/* ==========================================
   MENÚ MÓVIL (HAMBURGER)
   ========================================== */

window.toggleMobileMenu = function (event) {
    if (event) event.stopPropagation();

    const btn = document.getElementById('hamburgerBtn');
    const menu = document.getElementById('mobileMenu');

    if (!btn || !menu) return;

    const isOpen = menu.classList.contains('active');

    if (isOpen) {
        window.closeMobileMenu();
    } else {
        btn.classList.add('active');
        menu.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
};

window.closeMobileMenu = function () {
    const btn = document.getElementById('hamburgerBtn');
    const menu = document.getElementById('mobileMenu');

    if (btn) btn.classList.remove('active');
    if (menu) menu.classList.remove('active');
    document.body.style.overflow = '';
};

/* ==========================================
   LOADER
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.getElementById('preloader-overlay');

    if (preloader) {
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            preloader.classList.add('fade-out');
            document.body.style.overflow = ''; 

            setTimeout(() => {
                preloader.remove();
            }, 1000);
        }, 8000); 
    }
});