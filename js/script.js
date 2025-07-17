// ===== SCRIPT PRINCIPAL DO PORTFÓLIO =====
// Arquivo criado durante o aprendizado de JavaScript - 1º período ADS
// Sistema principal com funcionalidades integradas - implementação própria

console.log('🚀 Sistema principal carregado');

// ===== CONFIGURAÇÕES GLOBAIS =====
const CONFIG = {
    // Configurações de animação
    animationDuration: 300,
    scrollOffset: 80,
    
    // Configurações de scroll
    scrollThreshold: 300,
    
    // Configurações de tema
    theme: {
        colors: {
            primary: '#00ffff',
            secondary: '#ff00ff',
            accent: '#00ff41',
            background: '#0f0f23'
        }
    }
};

// ===== CLASSE PRINCIPAL DO PORTFÓLIO =====
class PortfolioApp {
    constructor() {
        // Estado da aplicação
        this.isInitialized = false;
        this.currentTheme = 'dark';
        this.components = {};
        
        // Elementos do DOM
        this.navbar = document.getElementById('navbar');
        this.scrollTopBtn = document.getElementById('scrollTop');
        this.themeToggle = document.getElementById('toggle-theme');
        
        // Inicializar aplicação
        this.init();
    }
    
    // Método de inicialização principal
    init() {
        console.log('🚀 Inicializando aplicação do portfólio...');
        
        try {
            // Inicializar componentes em ordem
            this.initializeNavigation();
            this.initializeScrollEffects();
            this.initializeThemeToggle();
            this.initializeSkillBars();
            this.initializeScrollToTop();
            this.initializeAnimations();
            
            // Marcar como inicializado
            this.isInitialized = true;
            
            console.log('✅ Aplicação do portfólio inicializada com sucesso!');
            
            // Mostrar notificação de boas-vindas
            setTimeout(() => {
                this.showNotification('🚀 Portfólio carregado com sucesso!', 'success');
            }, 1500);
            
        } catch (error) {
            console.error('❌ Erro ao inicializar aplicação:', error);
            this.showNotification('❌ Erro ao carregar portfólio', 'error');
        }
    }
    
    // ===== SISTEMA DE NAVEGAÇÃO =====
    initializeNavigation() {
        console.log('🧭 Inicializando navegação...');
        
        // Configurar navegação suave
        this.setupSmoothScroll();
        
        // Configurar scroll spy
        this.setupScrollSpy();
        
        // Configurar comportamento da navbar
        this.setupNavbarBehavior();
    }
    
    // Configurar scroll suave
    setupSmoothScroll() {
        // Selecionar todos os links internos
        const internalLinks = document.querySelectorAll('a[href^="#"]');
        
        internalLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    this.smoothScrollTo(targetElement);
                    this.showNotification(`📍 Navegando para: ${targetId}`, 'info', 2000);
                }
            });
        });
    }
    
    // Função de scroll suave
    smoothScrollTo(target, duration = 800) {
        const targetPosition = target.offsetTop - CONFIG.scrollOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        function easeInOutCubic(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t * t + b;
            t -= 2;
            return c / 2 * (t * t * t + 2) + b;
        }
        
        requestAnimationFrame(animation);
    }
    
    // Configurar scroll spy
    setupScrollSpy() {
        const sections = document.querySelectorAll('.section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    this.updateActiveNavLink(sectionId, navLinks);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-80px 0px -80px 0px'
        });
        
        sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    // Atualizar link ativo na navegação
    updateActiveNavLink(sectionId, navLinks) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Configurar comportamento da navbar
    setupNavbarBehavior() {
        if (!this.navbar) return;
        
        let lastScrollY = window.scrollY;
        let ticking = false;
        
        const updateNavbar = () => {
            const currentScrollY = window.scrollY;
            
            // Adicionar classe quando rolar
            if (currentScrollY > 100) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
            
            // Auto-hide navbar ao rolar para baixo
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                this.navbar.classList.add('hidden');
            } else {
                this.navbar.classList.remove('hidden');
            }
            
            lastScrollY = currentScrollY;
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        });
    }
    
    // ===== SISTEMA DE EFEITOS DE SCROLL =====
    initializeScrollEffects() {
        console.log('📜 Inicializando efeitos de scroll...');
        
        // Configurar animações de entrada
        this.setupScrollAnimations();
        
        // Configurar parallax sutil
        this.setupParallaxEffects();
    }
    
    // Configurar animações de entrada
    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll(
            '.education-card, .timeline-item, .skills-category, .cert-category, .leadership-card, .about-content, .video-section'
        );
        
        // Adicionar classes de animação
        animatedElements.forEach((el, index) => {
            el.classList.add('animate-on-scroll');
            el.style.setProperty('--animation-delay', `${index * 0.1}s`);
        });
        
        // Observer para animações
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }
    
    // Configurar efeitos parallax sutis
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.header, .footer');
        
        let ticking = false;
        
        const updateParallax = () => {
            const scrollY = window.pageYOffset;
            
            parallaxElements.forEach(el => {
                const speed = 0.5;
                const yPos = -(scrollY * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }
    
    // ===== SISTEMA DE TEMA =====
    initializeThemeToggle() {
        console.log('🎨 Inicializando toggle de tema...');
        
        if (!this.themeToggle) return;
        
        // Carregar tema salvo
        this.loadSavedTheme();
        
        // Configurar evento do botão
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }
    
    // Alternar tema
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        
        // Aplicar tema
        document.body.classList.toggle('dark-mode', this.currentTheme === 'dark');
        
        // Atualizar botão
        this.themeToggle.textContent = this.currentTheme === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Escuro';
        
        // Salvar preferência
        localStorage.setItem('portfolio_theme', this.currentTheme);
        
        // Mostrar notificação
        this.showNotification(`🎨 Tema alterado para: ${this.currentTheme === 'dark' ? 'Escuro' : 'Claro'}`, 'info');
        
        console.log(`🎨 Tema alterado para: ${this.currentTheme}`);
    }
    
    // Carregar tema salvo
    loadSavedTheme() {
        const savedTheme = localStorage.getItem('portfolio_theme');
        
        if (savedTheme) {
            this.currentTheme = savedTheme;
            document.body.classList.toggle('dark-mode', this.currentTheme === 'dark');
            this.themeToggle.textContent = this.currentTheme === 'dark' ? '☀️ Modo Claro' : '🌙 Modo Escuro';
        }
    }
    
    // ===== SISTEMA DE BARRAS DE HABILIDADES =====
    initializeSkillBars() {
        console.log('📊 Inicializando barras de habilidades...');
        
        const progressBars = document.querySelectorAll('.skill-progress');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateProgressBar(entry.target);
                }
            });
        }, {
            threshold: 0.7
        });
        
        progressBars.forEach(bar => {
            observer.observe(bar);
        });
    }
    
    // Animar barra de progresso
    animateProgressBar(progressBar) {
        const progress = progressBar.getAttribute('data-progress');
        
        if (progress && !progressBar.classList.contains('animated')) {
            progressBar.classList.add('animated');
            
            // Animar contador
            this.animateCounter(progressBar, progress);
            
            // Efeito de brilho
            setTimeout(() => {
                progressBar.classList.add('glow-effect');
            }, 1000);
        }
    }
    
    // Animar contador de progresso
    animateCounter(progressBar, targetValue) {
        let counter = progressBar.querySelector('.progress-counter');
        
        if (!counter) {
            counter = document.createElement('span');
            counter.className = 'progress-counter';
            counter.style.cssText = `
                position: absolute;
                right: 8px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 0.7rem;
                font-weight: 600;
                color: var(--color-white);
                font-family: var(--font-mono);
                text-shadow: 0 0 5px currentColor;
                z-index: 2;
            `;
            progressBar.style.position = 'relative';
            progressBar.appendChild(counter);
        }
        
        let currentValue = 0;
        const duration = 1500;
        const startTime = performance.now();
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            currentValue = targetValue * this.easeOutCubic(progress);
            counter.textContent = `${Math.round(currentValue)}%`;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        };
        
        requestAnimationFrame(updateCounter);
    }
    
    // Função de easing
    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }
    
    // ===== BOTÃO VOLTAR AO TOPO =====
    initializeScrollToTop() {
        console.log('⬆️ Inicializando botão voltar ao topo...');
        
        if (!this.scrollTopBtn) return;
        
        // Configurar comportamento do scroll
        this.setupScrollToTopBehavior();
        
        // Configurar clique
        this.scrollTopBtn.addEventListener('click', () => {
            this.smoothScrollTo(document.body, 1000);
            this.showNotification('⬆️ Voltando ao topo', 'info', 2000);
        });
    }
    
    // Configurar comportamento do botão scroll to top
    setupScrollToTopBehavior() {
        let ticking = false;
        
        const updateButton = () => {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            
            if (window.scrollY > CONFIG.scrollThreshold) {
                this.scrollTopBtn.classList.add('visible');
                this.scrollTopBtn.style.setProperty('--scroll-progress', `${scrollPercent}%`);
            } else {
                this.scrollTopBtn.classList.remove('visible');
            }
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateButton);
                ticking = true;
            }
        });
    }
    
    // ===== SISTEMA DE ANIMAÇÕES =====
    initializeAnimations() {
        console.log('✨ Inicializando animações...');
        
        // Configurar animações de hover
        this.setupHoverAnimations();
        
        // Configurar animações de clique
        this.setupClickAnimations();
    }
    
    // Configurar animações de hover
    setupHoverAnimations() {
        // Cartões com efeito hover
        const hoverCards = document.querySelectorAll('.education-card, .cert-category, .leadership-card');
        
        hoverCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
        
        // Botões com efeito ripple
        const buttons = document.querySelectorAll('.submit-btn, .nav-link, .social-link');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRippleEffect(e, button);
            });
        });
    }
    
    // Configurar animações de clique
    setupClickAnimations() {
        // Efeito de clique em elementos interativos
        const clickableElements = document.querySelectorAll('button, .nav-link, .social-link');
        
        clickableElements.forEach(element => {
            element.addEventListener('click', () => {
                element.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    element.style.transform = '';
                }, 150);
            });
        });
    }
    
    // Criar efeito ripple
    createRippleEffect(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(0, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // ===== UTILITÁRIOS =====
    
    // Mostrar notificação
    showNotification(message, type = 'info', duration = 3000) {
        if (window.showNotification) {
            window.showNotification(message, type, duration);
        } else {
            console.log(`📢 ${message}`);
        }
    }
    
    // Debounce para otimizar performance
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Verificar se elemento está na viewport
    isElementInViewport(el, threshold = 0) {
        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        return (
            rect.top >= -threshold &&
            rect.left >= -threshold &&
            rect.bottom <= windowHeight + threshold &&
            rect.right <= windowWidth + threshold
        );
    }
    
    // Destruir aplicação (limpeza)
    destroy() {
        // Limpar event listeners e recursos
        console.log('🚀 Aplicação destruída');
    }
}

// ===== ESTILOS DINÂMICOS =====
// Adicionar estilos CSS via JavaScript
const dynamicStyles = `
/* Animações de entrada */
.animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    transition-delay: var(--animation-delay, 0s);
}

.animate-on-scroll.animate-visible {
    opacity: 1;
    transform: translateY(0);
}

/* Navbar escondida */
.navbar.hidden {
    transform: translateY(-100%);
}

.navbar.scrolled {
    background: rgba(26, 26, 46, 0.98);
    backdrop-filter: blur(20px);
}

/* Efeito ripple */
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

/* Barras de progresso aprimoradas */
.skill-progress.glow-effect::after {
    animation: progressGlow 2s ease-in-out infinite alternate;
}

@keyframes progressGlow {
    0% { box-shadow: 0 0 5px var(--neon-cyan); }
    100% { box-shadow: 0 0 15px var(--neon-cyan), 0 0 25px var(--neon-cyan); }
}

/* Estados de loading */
.loading {
    cursor: wait;
}

/* Melhorias de acessibilidade */
@media (prefers-reduced-motion: reduce) {
    .animate-on-scroll,
    .skill-progress,
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
`;

// Adicionar estilos dinâmicos ao documento
function addDynamicStyles() {
    if (!document.getElementById('dynamic-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'dynamic-styles';
        styleSheet.textContent = dynamicStyles;
        document.head.appendChild(styleSheet);
    }
}

// ===== INICIALIZAÇÃO =====
let portfolioApp;

// Função de inicialização principal
function initPortfolioApp() {
    try {
        // Adicionar estilos dinâmicos
        addDynamicStyles();
        
        // Inicializar aplicação principal
        portfolioApp = new PortfolioApp();
        
        // Tornar disponível globalmente
        window.portfolioApp = portfolioApp;
        
        console.log('🚀 Sistema principal inicializado com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro ao inicializar sistema principal:', error);
    }
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPortfolioApp);
} else {
    initPortfolioApp();
}

// ===== TRATAMENTO DE ERROS GLOBAIS =====
window.addEventListener('error', (event) => {
    console.error('🚨 Erro JavaScript:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('🚨 Promise rejeitada:', event.reason);
});

// ===== LIMPEZA AO SAIR DA PÁGINA =====
window.addEventListener('beforeunload', () => {
    if (portfolioApp) {
        portfolioApp.destroy();
    }
});

console.log('🚀 Script principal carregado com sucesso!');

