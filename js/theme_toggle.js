// ===== SISTEMA DE ALTERNÂNCIA DE TEMA =====
// Arquivo criado durante o aprendizado de JavaScript - 1º período ADS
// Sistema de tema claro/escuro - implementação própria

console.log('🎨 Sistema de tema carregado');

// Classe para gerenciar temas
class ThemeManager {
    constructor() {
        // Configurações de tema
        this.themes = {
            dark: {
                name: 'Escuro',
                icon: '🌙',
                class: 'dark-mode'
            },
            light: {
                name: 'Claro',
                icon: '☀️',
                class: 'light-mode'
            }
        };
        
        // Estado atual
        this.currentTheme = 'dark'; // Tema padrão
        this.isTransitioning = false;
        
        // Elementos do DOM
        this.toggleButton = document.getElementById('toggle-theme');
        this.body = document.body;
        
        // Inicializar sistema de tema
        this.init();
    }
    
    // Método de inicialização
    init() {
        console.log('🎨 Inicializando sistema de tema...');
        
        if (!this.toggleButton) {
            console.warn('⚠️ Botão de tema não encontrado');
            return;
        }
        
        // Carregar tema salvo
        this.loadSavedTheme();
        
        // Configurar eventos
        this.setupEventListeners();
        
        // Detectar preferência do sistema
        this.detectSystemPreference();
        
        // Atualizar interface
        this.updateUI();
        
        console.log('✅ Sistema de tema inicializado!');
    }
    
    // Configurar eventos
    setupEventListeners() {
        // Evento de clique no botão
        this.toggleButton.addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Atalho de teclado (Ctrl + Shift + T)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
        
        // Detectar mudança na preferência do sistema
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', () => {
                this.handleSystemPreferenceChange();
            });
        }
    }
    
    // Alternar tema
    toggleTheme() {
        if (this.isTransitioning) return;
        
        // Determinar próximo tema
        const nextTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        
        // Aplicar tema com animação
        this.applyTheme(nextTheme, true);
        
        // Mostrar notificação
        this.showNotification(`🎨 Tema alterado para: ${this.themes[nextTheme].name}`, 'info');
        
        console.log(`🎨 Tema alterado: ${this.currentTheme} → ${nextTheme}`);
    }
    
    // Aplicar tema
    applyTheme(themeName, withAnimation = false) {
        if (this.isTransitioning) return;
        
        const theme = this.themes[themeName];
        if (!theme) {
            console.error(`❌ Tema não encontrado: ${themeName}`);
            return;
        }
        
        // Iniciar transição
        if (withAnimation) {
            this.startThemeTransition();
        }
        
        // Remover classes de tema anteriores
        Object.values(this.themes).forEach(t => {
            this.body.classList.remove(t.class);
        });
        
        // Aplicar novo tema
        if (themeName !== 'light') { // light é o tema padrão (sem classe)
            this.body.classList.add(theme.class);
        }
        
        // Atualizar estado
        this.currentTheme = themeName;
        
        // Salvar preferência
        this.saveThemePreference();
        
        // Atualizar interface
        this.updateUI();
        
        // Finalizar transição
        if (withAnimation) {
            setTimeout(() => {
                this.endThemeTransition();
            }, 300);
        }
    }
    
    // Iniciar transição de tema
    startThemeTransition() {
        this.isTransitioning = true;
        this.body.classList.add('theme-transitioning');
        
        // Adicionar overlay de transição
        const overlay = document.createElement('div');
        overlay.className = 'theme-transition-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(0,255,255,0.1) 0%, transparent 70%);
            pointer-events: none;
            z-index: 9999;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(overlay);
        
        // Animar overlay
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
        
        // Remover overlay
        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        }, 150);
    }
    
    // Finalizar transição de tema
    endThemeTransition() {
        this.isTransitioning = false;
        this.body.classList.remove('theme-transitioning');
    }
    
    // Atualizar interface do usuário
    updateUI() {
        const theme = this.themes[this.currentTheme];
        
        if (this.toggleButton) {
            // Atualizar texto do botão
            this.toggleButton.innerHTML = `${theme.icon} Modo ${theme.name}`;
            
            // Adicionar efeito visual
            this.toggleButton.style.transform = 'scale(1.05)';
            setTimeout(() => {
                this.toggleButton.style.transform = '';
            }, 200);
        }
        
        // Atualizar meta theme-color
        this.updateMetaThemeColor();
        
        // Disparar evento customizado
        this.dispatchThemeChangeEvent();
    }
    
    // Atualizar meta theme-color
    updateMetaThemeColor() {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        // Definir cor baseada no tema
        const color = this.currentTheme === 'dark' ? '#0f0f23' : '#ffffff';
        metaThemeColor.content = color;
    }
    
    // Disparar evento de mudança de tema
    dispatchThemeChangeEvent() {
        const event = new CustomEvent('themeChanged', {
            detail: {
                theme: this.currentTheme,
                themeName: this.themes[this.currentTheme].name
            }
        });
        
        document.dispatchEvent(event);
    }
    
    // Carregar tema salvo
    loadSavedTheme() {
        try {
            const savedTheme = localStorage.getItem('portfolio_theme');
            
            if (savedTheme && this.themes[savedTheme]) {
                this.applyTheme(savedTheme, false);
                console.log(`🎨 Tema carregado: ${savedTheme}`);
            } else {
                // Usar preferência do sistema se não houver tema salvo
                this.useSystemPreference();
            }
        } catch (error) {
            console.error('❌ Erro ao carregar tema:', error);
            this.applyTheme('dark', false); // Fallback para tema escuro
        }
    }
    
    // Salvar preferência de tema
    saveThemePreference() {
        try {
            localStorage.setItem('portfolio_theme', this.currentTheme);
            localStorage.setItem('portfolio_theme_timestamp', Date.now().toString());
        } catch (error) {
            console.error('❌ Erro ao salvar tema:', error);
        }
    }
    
    // Detectar preferência do sistema
    detectSystemPreference() {
        if (!window.matchMedia) return;
        
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.systemPreference = prefersDark ? 'dark' : 'light';
        
        console.log(`🎨 Preferência do sistema: ${this.systemPreference}`);
    }
    
    // Usar preferência do sistema
    useSystemPreference() {
        this.detectSystemPreference();
        
        if (this.systemPreference) {
            this.applyTheme(this.systemPreference, false);
            console.log(`🎨 Usando preferência do sistema: ${this.systemPreference}`);
        }
    }
    
    // Lidar com mudança na preferência do sistema
    handleSystemPreferenceChange() {
        const oldPreference = this.systemPreference;
        this.detectSystemPreference();
        
        // Se não há tema salvo manualmente, seguir a preferência do sistema
        const hasManualTheme = localStorage.getItem('portfolio_theme');
        
        if (!hasManualTheme && this.systemPreference !== oldPreference) {
            this.applyTheme(this.systemPreference, true);
            this.showNotification(`🎨 Tema ajustado automaticamente: ${this.themes[this.systemPreference].name}`, 'info');
        }
    }
    
    // Obter tema atual
    getCurrentTheme() {
        return {
            name: this.currentTheme,
            displayName: this.themes[this.currentTheme].name,
            icon: this.themes[this.currentTheme].icon
        };
    }
    
    // Definir tema específico (para uso externo)
    setTheme(themeName) {
        if (this.themes[themeName]) {
            this.applyTheme(themeName, true);
            return true;
        }
        return false;
    }
    
    // Resetar para tema padrão
    resetToDefault() {
        this.applyTheme('dark', true);
        this.showNotification('🎨 Tema resetado para padrão', 'info');
    }
    
    // Mostrar notificação
    showNotification(message, type = 'info', duration = 3000) {
        if (window.showNotification) {
            window.showNotification(message, type, duration);
        } else {
            console.log(`📢 ${message}`);
        }
    }
}

// ===== FUNCIONALIDADES EXTRAS =====

// Função para adicionar estilos de transição de tema
function addThemeTransitionStyles() {
    const styles = `
        /* Transições de tema */
        .theme-transitioning * {
            transition: background-color 0.3s ease, 
                       color 0.3s ease, 
                       border-color 0.3s ease, 
                       box-shadow 0.3s ease !important;
        }
        
        /* Tema claro */
        .light-mode {
            --color-background: #ffffff;
            --color-surface: #f8f9fa;
            --color-surface-light: #e9ecef;
            --color-text: #212529;
            --color-text-secondary: #495057;
            --color-text-muted: #6c757d;
        }
        
        .light-mode .navbar {
            background: rgba(248, 249, 250, 0.95);
            border-bottom-color: rgba(0, 255, 255, 0.3);
        }
        
        .light-mode .header {
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        }
        
        .light-mode .footer {
            background: #e9ecef;
        }
        
        /* Ajustes para melhor contraste no tema claro */
        .light-mode .section-title,
        .light-mode .nav-link:hover,
        .light-mode .nav-link.active {
            color: #0066cc;
            text-shadow: none;
        }
        
        .light-mode .neon-cyan {
            color: #0066cc;
        }
        
        /* Transição suave entre temas */
        body {
            transition: background-color 0.3s ease;
        }
    `;
    
    if (!document.getElementById('theme-transition-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'theme-transition-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// Função para configurar atalhos de teclado adicionais
function setupThemeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl + Alt + D = Tema escuro
        if (e.ctrlKey && e.altKey && e.key === 'd') {
            e.preventDefault();
            if (window.themeManager) {
                window.themeManager.setTheme('dark');
            }
        }
        
        // Ctrl + Alt + L = Tema claro
        if (e.ctrlKey && e.altKey && e.key === 'l') {
            e.preventDefault();
            if (window.themeManager) {
                window.themeManager.setTheme('light');
            }
        }
        
        // Ctrl + Alt + R = Resetar tema
        if (e.ctrlKey && e.altKey && e.key === 'r') {
            e.preventDefault();
            if (window.themeManager) {
                window.themeManager.resetToDefault();
            }
        }
    });
}

// ===== INICIALIZAÇÃO =====
let themeManager;

// Função de inicialização
function initThemeSystem() {
    try {
        // Adicionar estilos de transição
        addThemeTransitionStyles();
        
        // Inicializar gerenciador de tema
        themeManager = new ThemeManager();
        
        // Configurar atalhos de teclado
        setupThemeKeyboardShortcuts();
        
        // Tornar disponível globalmente
        window.themeManager = themeManager;
        
        // Funções auxiliares globais
        window.toggleTheme = () => themeManager.toggleTheme();
        window.setTheme = (theme) => themeManager.setTheme(theme);
        window.getCurrentTheme = () => themeManager.getCurrentTheme();
        
        console.log('🎨 Sistema de tema inicializado com sucesso!');
        
        // Escutar eventos de mudança de tema
        document.addEventListener('themeChanged', (e) => {
            console.log(`🎨 Tema alterado para: ${e.detail.themeName}`);
        });
        
    } catch (error) {
        console.error('❌ Erro ao inicializar sistema de tema:', error);
    }
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeSystem);
} else {
    initThemeSystem();
}

console.log('🎨 Sistema de tema carregado com sucesso!');

