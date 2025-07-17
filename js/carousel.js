// ===== CARROSSEL DE TECNOLOGIAS MELHORADO =====
// Arquivo criado durante o aprendizado de JavaScript - 1º período ADS
// Carrossel com efeitos visuais aprimorados - implementação própria

console.log('🎠 Sistema de carrossel carregado');

// Classe para gerenciar o carrossel
class TechCarousel {
    constructor() {
        // Dados das tecnologias - array de objetos aprendido
        this.technologies = [
            {
                name: 'HTML5',
                image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
                description: 'Linguagem de marcação para estruturar páginas web'
            },
            {
                name: 'CSS3',
                image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg',
                description: 'Linguagem de estilo para design de páginas web'
            },
            {
                name: 'JavaScript',
                image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
                description: 'Linguagem de programação para interatividade web'
            },
            {
                name: 'Python',
                image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
                description: 'Linguagem de programação versátil e poderosa'
            },
            {
                name: 'MySQL',
                image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
                description: 'Sistema de gerenciamento de banco de dados'
            },
            {
                name: 'Git',
                image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
                description: 'Sistema de controle de versão distribuído'
            },
            {
                name: 'VS Code',
                image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
                description: 'Editor de código fonte da Microsoft'
            },
            {
                name: 'Linux',
                image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
                description: 'Sistema operacional open source'
            },
            {
                name: 'Windows',
                image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg',
                description: 'Sistema operacional da Microsoft'
            },
            {
                name: 'Bootstrap',
                image: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg',
                description: 'Framework CSS para desenvolvimento responsivo'
            }
        ];
        
        // Elementos do DOM
        this.track = document.getElementById('carouselTrack');
        this.prevBtn = document.getElementById('carouselPrev');
        this.nextBtn = document.getElementById('carouselNext');
        this.dotsContainer = document.getElementById('carouselDots');
        
        // Estado do carrossel
        this.currentIndex = 0;
        this.itemsPerView = 4; // Quantos itens mostrar por vez
        this.totalPages = Math.ceil(this.technologies.length / this.itemsPerView);
        this.isAnimating = false;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000; // 5 segundos
        
        // Inicializar carrossel
        this.init();
    }
    
    // Método de inicialização
    init() {
        console.log('🎠 Inicializando carrossel de tecnologias...');
        
        if (!this.track) {
            console.error('❌ Container do carrossel não encontrado!');
            return;
        }
        
        // Criar itens do carrossel
        this.createCarouselItems();
        
        // Criar indicadores (dots)
        this.createDots();
        
        // Configurar eventos
        this.setupEventListeners();
        
        // Configurar responsividade
        this.setupResponsive();
        
        // Iniciar autoplay
        this.startAutoPlay();
        
        // Atualizar interface
        this.updateCarousel();
        
        console.log('✅ Carrossel de tecnologias inicializado!');
    }
    
    // Criar itens do carrossel
    createCarouselItems() {
        this.track.innerHTML = ''; // Limpar conteúdo existente
        
        this.technologies.forEach((tech, index) => {
            const item = document.createElement('div');
            item.className = 'carousel-item';
            item.setAttribute('data-index', index);
            
            // Criar conteúdo do item
            item.innerHTML = `
                <img src="${tech.image}" alt="${tech.name}" loading="lazy" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAiIGhlaWdodD0iNzAiIHZpZXdCb3g9IjAgMCA3MCA3MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjcwIiBoZWlnaHQ9IjcwIiBmaWxsPSIjMUExQTJFIi8+Cjx0ZXh0IHg9IjM1IiB5PSI0MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjMDBGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4ke3RlY2gubmFtZX08L3RleHQ+Cjwvc3ZnPg=='">
                <span>${tech.name}</span>
            `;
            
            // Adicionar eventos de hover melhorados
            this.setupItemHoverEffects(item, tech);
            
            this.track.appendChild(item);
        });
    }
    
    // Configurar efeitos de hover nos itens
    setupItemHoverEffects(item, tech) {
        let hoverTimeout;
        
        // Evento de mouse enter
        item.addEventListener('mouseenter', () => {
            // Limpar timeout anterior
            clearTimeout(hoverTimeout);
            
            // Pausar autoplay durante hover
            this.pauseAutoPlay();
            
            // Adicionar efeito de destaque
            this.highlightItem(item);
            
            // Mostrar tooltip com descrição
            this.showTooltip(item, tech);
            
            console.log(`🎠 Hover em: ${tech.name}`);
        });
        
        // Evento de mouse leave
        item.addEventListener('mouseleave', () => {
            // Remover destaque após um delay
            hoverTimeout = setTimeout(() => {
                this.removeHighlight(item);
                this.hideTooltip();
                
                // Retomar autoplay
                this.startAutoPlay();
            }, 200);
        });
        
        // Evento de clique
        item.addEventListener('click', () => {
            this.showNotification(`📚 Tecnologia: ${tech.name} - ${tech.description}`, 'info', 4000);
        });
    }
    
    // Destacar item específico
    highlightItem(item) {
        // Remover destaque de outros itens
        this.track.querySelectorAll('.carousel-item').forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.style.opacity = '0.3';
                otherItem.style.transform = 'scale(0.85)';
            }
        });
        
        // Destacar item atual
        item.style.opacity = '1';
        item.style.transform = 'scale(1.15)';
        item.style.zIndex = '10';
        item.style.background = 'rgba(0, 255, 255, 0.2)';
        item.style.border = '2px solid var(--neon-cyan)';
        item.style.boxShadow = '0 0 30px rgba(0, 255, 255, 0.6)';
    }
    
    // Remover destaque
    removeHighlight(item) {
        // Restaurar todos os itens
        this.track.querySelectorAll('.carousel-item').forEach(carouselItem => {
            carouselItem.style.opacity = '';
            carouselItem.style.transform = '';
            carouselItem.style.zIndex = '';
            carouselItem.style.background = '';
            carouselItem.style.border = '';
            carouselItem.style.boxShadow = '';
        });
    }
    
    // Mostrar tooltip
    showTooltip(item, tech) {
        // Remover tooltip existente
        this.hideTooltip();
        
        const tooltip = document.createElement('div');
        tooltip.className = 'carousel-tooltip';
        tooltip.innerHTML = `
            <strong>${tech.name}</strong>
            <p>${tech.description}</p>
        `;
        
        // Estilos do tooltip
        tooltip.style.cssText = `
            position: absolute;
            background: var(--color-surface);
            border: 1px solid var(--neon-cyan);
            border-radius: var(--border-radius-md);
            padding: var(--spacing-sm);
            font-family: var(--font-mono);
            font-size: var(--font-size-xs);
            color: var(--color-text);
            box-shadow: 0 0 15px rgba(0, 255, 255, 0.3);
            z-index: 1000;
            max-width: 200px;
            pointer-events: none;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
        `;
        
        // Posicionar tooltip
        const rect = item.getBoundingClientRect();
        tooltip.style.top = (rect.bottom + 10) + 'px';
        tooltip.style.left = (rect.left + rect.width / 2) + 'px';
        tooltip.style.transform = 'translateX(-50%) translateY(10px)';
        
        document.body.appendChild(tooltip);
        
        // Animar entrada
        setTimeout(() => {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateX(-50%) translateY(0)';
        }, 10);
        
        this.currentTooltip = tooltip;
    }
    
    // Esconder tooltip
    hideTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.style.opacity = '0';
            this.currentTooltip.style.transform = 'translateX(-50%) translateY(10px)';
            
            setTimeout(() => {
                if (this.currentTooltip && this.currentTooltip.parentNode) {
                    this.currentTooltip.parentNode.removeChild(this.currentTooltip);
                }
                this.currentTooltip = null;
            }, 300);
        }
    }
    
    // Criar indicadores (dots)
    createDots() {
        if (!this.dotsContainer) return;
        
        this.dotsContainer.innerHTML = '';
        
        for (let i = 0; i < this.totalPages; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            dot.setAttribute('data-page', i);
            
            dot.addEventListener('click', () => {
                this.goToPage(i);
            });
            
            this.dotsContainer.appendChild(dot);
        }
    }
    
    // Configurar eventos
    setupEventListeners() {
        // Botões de navegação
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.previousPage();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextPage();
            });
        }
        
        // Navegação por teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.previousPage();
            } else if (e.key === 'ArrowRight') {
                this.nextPage();
            }
        });
        
        // Pausar autoplay quando o usuário interage
        this.track.addEventListener('mouseenter', () => {
            this.pauseAutoPlay();
        });
        
        this.track.addEventListener('mouseleave', () => {
            this.startAutoPlay();
        });
    }
    
    // Configurar responsividade
    setupResponsive() {
        const updateItemsPerView = () => {
            const width = window.innerWidth;
            
            if (width <= 480) {
                this.itemsPerView = 1;
            } else if (width <= 767) {
                this.itemsPerView = 2;
            } else if (width <= 1023) {
                this.itemsPerView = 3;
            } else {
                this.itemsPerView = 4;
            }
            
            this.totalPages = Math.ceil(this.technologies.length / this.itemsPerView);
            this.currentIndex = Math.min(this.currentIndex, this.totalPages - 1);
            
            this.createDots();
            this.updateCarousel();
        };
        
        // Debounce para otimizar performance
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(updateItemsPerView, 250);
        });
        
        // Inicializar
        updateItemsPerView();
    }
    
    // Ir para página anterior
    previousPage() {
        if (this.isAnimating) return;
        
        this.currentIndex = (this.currentIndex - 1 + this.totalPages) % this.totalPages;
        this.updateCarousel();
        this.resetAutoPlay();
    }
    
    // Ir para próxima página
    nextPage() {
        if (this.isAnimating) return;
        
        this.currentIndex = (this.currentIndex + 1) % this.totalPages;
        this.updateCarousel();
        this.resetAutoPlay();
    }
    
    // Ir para página específica
    goToPage(pageIndex) {
        if (this.isAnimating || pageIndex === this.currentIndex) return;
        
        this.currentIndex = pageIndex;
        this.updateCarousel();
        this.resetAutoPlay();
    }
    
    // Atualizar carrossel
    updateCarousel() {
        if (!this.track) return;
        
        this.isAnimating = true;
        
        // Calcular deslocamento
        const offset = -this.currentIndex * (100 / this.totalPages);
        this.track.style.transform = `translateX(${offset}%)`;
        
        // Atualizar itens ativos
        this.updateActiveItems();
        
        // Atualizar dots
        this.updateDots();
        
        // Atualizar botões
        this.updateButtons();
        
        // Finalizar animação
        setTimeout(() => {
            this.isAnimating = false;
        }, 500);
        
        console.log(`🎠 Carrossel atualizado - Página ${this.currentIndex + 1}/${this.totalPages}`);
    }
    
    // Atualizar itens ativos
    updateActiveItems() {
        const items = this.track.querySelectorAll('.carousel-item');
        const startIndex = this.currentIndex * this.itemsPerView;
        const endIndex = startIndex + this.itemsPerView;
        
        items.forEach((item, index) => {
            if (index >= startIndex && index < endIndex) {
                item.classList.add('active-item');
            } else {
                item.classList.remove('active-item');
            }
        });
    }
    
    // Atualizar dots
    updateDots() {
        if (!this.dotsContainer) return;
        
        const dots = this.dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (index === this.currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Atualizar botões
    updateButtons() {
        if (this.prevBtn) {
            this.prevBtn.style.opacity = this.totalPages > 1 ? '1' : '0.5';
        }
        
        if (this.nextBtn) {
            this.nextBtn.style.opacity = this.totalPages > 1 ? '1' : '0.5';
        }
    }
    
    // Iniciar autoplay
    startAutoPlay() {
        if (this.totalPages <= 1) return;
        
        this.pauseAutoPlay(); // Limpar interval anterior
        
        this.autoPlayInterval = setInterval(() => {
            this.nextPage();
        }, this.autoPlayDelay);
    }
    
    // Pausar autoplay
    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    // Resetar autoplay
    resetAutoPlay() {
        this.pauseAutoPlay();
        setTimeout(() => {
            this.startAutoPlay();
        }, 2000); // Aguardar 2 segundos antes de retomar
    }
    
    // Mostrar notificação
    showNotification(message, type = 'info', duration = 3000) {
        if (window.showNotification) {
            window.showNotification(message, type, duration);
        } else {
            console.log(`📢 ${message}`);
        }
    }
    
    // Destruir carrossel (limpeza)
    destroy() {
        this.pauseAutoPlay();
        this.hideTooltip();
        
        // Remover event listeners
        window.removeEventListener('resize', this.setupResponsive);
        
        console.log('🎠 Carrossel destruído');
    }
}

// ===== FUNCIONALIDADES EXTRAS =====

// Função para adicionar nova tecnologia (para futuras expansões)
function addTechnology(name, imageUrl, description) {
    if (window.techCarousel) {
        window.techCarousel.technologies.push({
            name,
            image: imageUrl,
            description
        });
        
        window.techCarousel.createCarouselItems();
        window.techCarousel.updateCarousel();
        
        console.log(`🎠 Nova tecnologia adicionada: ${name}`);
    }
}

// Função para filtrar tecnologias (para futuras expansões)
function filterTechnologies(category) {
    // Implementação futura para filtrar por categoria
    console.log(`🎠 Filtrar por categoria: ${category}`);
}

// ===== INICIALIZAÇÃO =====
let techCarousel;

// Inicializar quando o DOM estiver pronto
function initCarousel() {
    try {
        techCarousel = new TechCarousel();
        
        // Tornar disponível globalmente
        window.techCarousel = techCarousel;
        window.addTechnology = addTechnology;
        window.filterTechnologies = filterTechnologies;
        
        console.log('🎠 Sistema de carrossel inicializado!');
        
    } catch (error) {
        console.error('❌ Erro ao inicializar carrossel:', error);
    }
}

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
} else {
    initCarousel();
}

console.log('🎠 Carrossel carregado com sucesso!');

