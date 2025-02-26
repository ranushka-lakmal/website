// Particle Animation with Automatic Movement
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
const mouse = { x: null, y: null, radius: 150 };

// Initialize Canvas
function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
initCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.velocityX = (Math.random() - 0.4) * 0.8; // Increased speed
        this.velocityY = (Math.random() - 0.4) * 0.8; // Increased speed
        this.density = Math.random() * 10 + 5;
    }

    draw() {
        ctx.fillStyle = getComputedStyle(document.documentElement)
            .getPropertyValue('--primary');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

    update() {
        // Continuous automatic movement
        this.x += this.velocityX;
        this.y += this.velocityY;

        // Boundary bounce with momentum preservation
        if (this.x < 0 || this.x > canvas.width) {
            this.velocityX *= -0.5; // Bounce with slight energy loss
            this.x = this.x < 0 ? 0 : canvas.width;
        }
        if (this.y < 0 || this.y > canvas.height) {
            this.velocityY *= -0.5; // Bounce with slight energy loss
            this.y = this.y < 0 ? 0 : canvas.height;
        }

        // Mouse interaction
        if (mouse.x && mouse.y) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                const force = (mouse.radius - distance) / mouse.radius;
                this.velocityX -= (dx / distance) * force * 0.5;
                this.velocityY -= (dy / distance) * force * 0.5;
            }
        }
    }
}

// Initialize particles
function init() {
    particles = [];
    for (let i = 0; i < 100; i++) { // Increased particle count
        particles.push(new Particle());
    }
}
init();

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    requestAnimationFrame(animate);
}
animate();

// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    themeToggle.querySelector('i').classList.toggle('fa-moon');
    themeToggle.querySelector('i').classList.toggle('fa-sun');
});

// Mobile Menu
const navbarToggler = document.querySelector('.navbar-toggler');
const navLinks = document.querySelector('.nav-links');

navbarToggler.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navbarToggler.innerHTML = navLinks.classList.contains('active') ? 
        '<i class="fas fa-times"></i>' : 
        '<i class="fas fa-bars"></i>';
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        window.scrollTo({
            behavior: 'smooth',
            top: target.offsetTop - 70
        });
        navLinks.classList.remove('active');
        navbarToggler.innerHTML = '<i class="fas fa-bars"></i>';
    });
});

// Skill card interactions
document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.background = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.1)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.background = 'rgba(255, 255, 255, 0.1)';
    });
});

// Intersection Observer for scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
});

document.querySelectorAll('.skill-category').forEach(el => observer.observe(el));

// Mouse Tracking
window.addEventListener('mousemove', e => {
    mouse.x = e.x;
    mouse.y = e.y;
});

// Window Resize
window.addEventListener('resize', () => {
    initCanvas();
    init();
});

