// ===== CONFIGURAÇÕES GLOBAIS =====
const CONFIG = {
    // Configurações de animação
    animationDuration: 300,
    scrollOffset: 100,
    
    // Configurações de partículas
    particleCount: 50,
    particleSpeed: 0.5,
    
    // Configurações de scroll
    scrollThreshold: 200
};

// ===== UTILITÁRIOS =====
const Utils = {
    // Debounce para otimizar performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle para eventos de scroll
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    },
    
    // Verificar se elemento está visível na viewport
    isElementInViewport: (el) => {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // Animação suave para scroll
    smoothScrollTo: (target, duration = 800) => {
        const targetElement = typeof target === 'string' ? document.querySelector(target) : target;
        if (!targetElement) return;
        
        const targetPosition = targetElement.offsetTop - CONFIG.scrollOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    }
};

// ===== SISTEMA DE PARTÍCULAS =====
class ParticleSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
        this.init();
    }
    
    init() {
        // Criar canvas para partículas
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'particles';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        this.canvas.style.opacity = '0.6';
        
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.resize();
        this.createParticles();
        this.animate();
        
        // Redimensionar canvas quando a janela mudar
        window.addEventListener('resize', Utils.debounce(() => this.resize(), 250));
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < CONFIG.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * CONFIG.particleSpeed,
                vy: (Math.random() - 0.5) * CONFIG.particleSpeed,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Atualizar e desenhar partículas
        this.particles.forEach((particle, index) => {
            // Mover partícula
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Verificar bordas
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Desenhar partícula
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(79, 70, 229, ${particle.opacity})`;
            this.ctx.fill();
            
            // Conectar partículas próximas
            for (let j = index + 1; j < this.particles.length; j++) {
                const dx = this.particles[j].x - particle.x;
                const dy = this.particles[j].y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `rgba(79, 70, 229, ${0.1 * (1 - distance / 100)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.stroke();
                }
            }
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// ===== NAVEGAÇÃO ATIVA =====
class ActiveNavigation {
    constructor() {
        this.sections = document.querySelectorAll('.section');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }
    
    init() {
        // Adicionar event listeners para links de navegação
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    Utils.smoothScrollTo(href);
                }
            });
        });
        
        // Monitorar scroll para destacar seção ativa
        window.addEventListener('scroll', Utils.throttle(() => this.updateActiveSection(), 100));
        this.updateActiveSection();
    }
    
    updateActiveSection() {
        let currentSection = '';
        const scrollPos = window.pageYOffset + CONFIG.scrollOffset;
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Atualizar classes ativas
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
}

// ===== ANIMAÇÕES DE ENTRADA =====
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.education-card, .timeline-item, .skills-category, .cert-category, .leadership-card');
        this.init();
    }
    
    init() {
        // Adicionar classe inicial
        this.elements.forEach(el => {
            el.classList.add('fade-in');
        });
        
        // Observar elementos para animação
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        this.elements.forEach(el => {
            this.observer.observe(el);
        });
    }
}

// ===== BARRAS DE PROGRESSO ANIMADAS =====
class SkillProgressBars {
    constructor() {
        this.progressBars = document.querySelectorAll('.skill-progress');
        this.init();
    }
    
    init() {
        // Observar barras de progresso
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateProgressBar(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });
        
        this.progressBars.forEach(bar => {
            this.observer.observe(bar);
        });
    }
    
    animateProgressBar(progressBar) {
        const progress = progressBar.getAttribute('data-progress');
        if (progress) {
            // Adicionar animação CSS
            progressBar.style.setProperty('--progress-width', `${progress}%`);
            progressBar.classList.add('animated');
            
            // Animar contador (opcional)
            this.animateCounter(progressBar, progress);
        }
    }
    
    animateCounter(progressBar, targetValue) {
        // Criar elemento de contador se não existir
        let counter = progressBar.querySelector('.progress-counter');
        if (!counter) {
            counter = document.createElement('span');
            counter.className = 'progress-counter';
            counter.style.cssText = `
                position: absolute;
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 0.75rem;
                font-weight: 600;
                color: white;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
            `;
            progressBar.style.position = 'relative';
            progressBar.appendChild(counter);
        }
        
        // Animar contador de 0 até o valor final
        let currentValue = 0;
        const increment = targetValue / 60; // 60 frames para 1 segundo
        
        const updateCounter = () => {
            currentValue += increment;
            if (currentValue >= targetValue) {
                currentValue = targetValue;
                counter.textContent = `${Math.round(currentValue)}%`;
                return;
            }
            counter.textContent = `${Math.round(currentValue)}%`;
            requestAnimationFrame(updateCounter);
        };
        
        updateCounter();
    }
}

// ===== BOTÃO VOLTAR AO TOPO =====
class ScrollToTop {
    constructor() {
        this.button = document.getElementById('scrollTop');
        this.init();
    }
    
    init() {
        if (!this.button) return;
        
        // Mostrar/ocultar botão baseado no scroll
        window.addEventListener('scroll', Utils.throttle(() => {
            if (window.pageYOffset > CONFIG.scrollThreshold) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        }, 100));
        
        // Adicionar funcionalidade de clique
        this.button.addEventListener('click', () => {
            Utils.smoothScrollTo(document.body);
        });
    }
}

// ===== EFEITOS HOVER AVANÇADOS =====
class HoverEffects {
    constructor() {
        this.init();
    }
    
    init() {
        // Efeito de inclinação para cards
        this.addTiltEffect();
        
        // Efeito de brilho para botões
        this.addShineEffect();
        
        // Efeito de paralaxe suave
        this.addParallaxEffect();
    }
    
    addTiltEffect() {
        const cards = document.querySelectorAll('.education-card, .cert-category, .leadership-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
        });
    }
    
    addShineEffect() {
        const buttons = document.querySelectorAll('.submit-btn, .nav-link, .social-link');
        
        buttons.forEach(button => {
            button.classList.add('shine-effect');
        });
    }
    
    addParallaxEffect() {
        const header = document.querySelector('.header');
        if (!header) return;
        
        window.addEventListener('scroll', Utils.throttle(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            header.style.transform = `translateY(${rate}px)`;
        }, 16));
    }
}

// ===== SISTEMA DE NOTIFICAÇÕES =====
class NotificationSystem {
    constructor() {
        this.container = null;
        this.init();
    }
    
    init() {
        // Criar container de notificações
        this.container = document.createElement('div');
        this.container.className = 'notification-container';
        this.container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        `;
        document.body.appendChild(this.container);
    }
    
    show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: ${this.getBackgroundColor(type)};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            margin-bottom: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            pointer-events: auto;
            max-width: 300px;
            word-wrap: break-word;
        `;
        notification.textContent = message;
        
        this.container.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remover após duração especificada
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }
    
    getBackgroundColor(type) {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#4f46e5'
        };
        return colors[type] || colors.info;
    }
}

// ===== MODO ESCURO (OPCIONAL) =====
class DarkModeToggle {
    constructor() {
        this.isDark = false;
        this.init();
    }
    
    init() {
        // Verificar preferência do sistema
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.isDark = true;
            document.body.classList.add('dark-mode');
        }
        
        // Criar botão de toggle (opcional)
        this.createToggleButton();
    }
    
    createToggleButton() {
        const button = document.createElement('button');
        button.className = 'dark-mode-toggle';
        button.innerHTML = '<i class="fas fa-moon"></i>';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            background: var(--gradient-primary);
            color: white;
            cursor: pointer;
            z-index: 1000;
            transition: transform 0.3s ease;
            display: none; /* Oculto por padrão */
        `;
        
        button.addEventListener('click', () => this.toggle());
        document.body.appendChild(button);
    }
    
    toggle() {
        this.isDark = !this.isDark;
        document.body.classList.toggle('dark-mode', this.isDark);
        
        const button = document.querySelector('.dark-mode-toggle i');
        if (button) {
            button.className = this.isDark ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

// ===== PERFORMANCE E OTIMIZAÇÃO =====
class PerformanceOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        // Lazy loading para imagens
        this.setupLazyLoading();
        
        // Preload de recursos críticos
        this.preloadCriticalResources();
        
        // Otimizar animações baseado na preferência do usuário
        this.respectMotionPreferences();
    }
    
    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }
    
    preloadCriticalResources() {
        // Preload de fontes críticas
        const fontLink = document.createElement('link');
        fontLink.rel = 'preload';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
        fontLink.as = 'style';
        document.head.appendChild(fontLink);
    }
    
    respectMotionPreferences() {
        // Reduzir animações se o usuário preferir
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.documentElement.style.setProperty('--transition-fast', '0s');
            document.documentElement.style.setProperty('--transition-medium', '0s');
            document.documentElement.style.setProperty('--transition-slow', '0s');
        }
    }
}

// ===== INICIALIZAÇÃO =====
class App {
    constructor() {
        this.components = {};
        this.init();
    }
    
    init() {
        // Aguardar DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }
    
    initializeComponents() {
        try {
            // Inicializar sistemas principais
            this.components.particleSystem = new ParticleSystem();
            this.components.navigation = new ActiveNavigation();
            this.components.scrollAnimations = new ScrollAnimations();
            this.components.skillBars = new SkillProgressBars();
            this.components.scrollToTop = new ScrollToTop();
            this.components.hoverEffects = new HoverEffects();
            this.components.notifications = new NotificationSystem();
            this.components.darkMode = new DarkModeToggle();
            this.components.performance = new PerformanceOptimizer();
            
            // Mostrar notificação de boas-vindas
            setTimeout(() => {
                this.components.notifications.show('Bem-vindo ao meu portfólio! 🚀', 'success');
            }, 1000);
            
            console.log('✅ Aplicação inicializada com sucesso!');
        } catch (error) {
            console.error('❌ Erro ao inicializar aplicação:', error);
        }
    }
    
    // Método para limpar recursos quando necessário
    destroy() {
        Object.values(this.components).forEach(component => {
            if (component && typeof component.destroy === 'function') {
                component.destroy();
            }
        });
    }
}

// ===== UTILITÁRIOS GLOBAIS =====
window.AppUtils = {
    // Função para mostrar notificação (pode ser usada externamente)
    showNotification: (message, type, duration) => {
        if (window.app && window.app.components.notifications) {
            window.app.components.notifications.show(message, type, duration);
        }
    },
    
    // Função para scroll suave (pode ser usada externamente)
    scrollTo: (target, duration) => {
        Utils.smoothScrollTo(target, duration);
    },
    
    // Função para toggle do modo escuro
    toggleDarkMode: () => {
        if (window.app && window.app.components.darkMode) {
            window.app.components.darkMode.toggle();
        }
    }
};

// ===== INICIALIZAR APLICAÇÃO =====
window.app = new App();

// ===== TRATAMENTO DE ERROS GLOBAIS =====
window.addEventListener('error', (event) => {
    console.error('Erro JavaScript:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rejeitada:', event.reason);
});

// ===== LIMPEZA AO SAIR DA PÁGINA =====
window.addEventListener('beforeunload', () => {
    if (window.app) {
        window.app.destroy();
    }
});

