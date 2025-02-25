// Particle Animation
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

// Particle Class
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
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
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const maxDistance = mouse.radius;
        const force = (maxDistance - distance) / maxDistance;
        const directionX = forceDirectionX * force * this.density;
        const directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
        } else {
            if (this.x !== this.baseX) {
                this.x -= (this.x - this.baseX) / 10;
            }
            if (this.y !== this.baseY) {
                this.y -= (this.y - this.baseY) / 10;
            }
        }
    }
}

// Create Particles
function init() {
    particles = [];
    for (let i = 0; i < 80; i++) {
        particles.push(new Particle());
    }
}
init();

// Animation Loop
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