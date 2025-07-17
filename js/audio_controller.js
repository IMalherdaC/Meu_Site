// ===== CONTROLADOR DE ÁUDIO =====
// criado JavaScript - 1º período ADS
// Sistema de música com múltiplas faixas - implementação teste (06/07/25)

console.log('🎵 Sistema de áudio carregado');

// Classe para gerenciar o player de música
class MusicPlayer {
    constructor() {
        // Array com as músicas disponíveis - conceito de arrays aprendido
        this.tracks = [
            {
                name: 'Música 1',
                element: document.getElementById('backgroundMusic1'),
                file: './audio/music1.mp3'
            },
            {
                name: 'Música 2', 
                element: document.getElementById('backgroundMusic2'),
                file: './audio/music2.mp3'
            },
            {
                name: 'Música 3',
                element: document.getElementById('backgroundMusic3'), 
                file: './audio/music3.mp3'
            }
        ];
        
        // Variáveis de controle - conceitos básicos de JavaScript
        this.currentTrackIndex = 0;
        this.isPlaying = false;
        this.volume = 0.5;
        this.isPlayerVisible = false;
        
        // Elementos do DOM - aprendido sobre manipulação do DOM
        this.toggleBtn = document.getElementById('togglePlayer');
        this.playerContent = document.getElementById('playerContent');
        this.playPauseBtn = document.getElementById('playPause');
        this.prevBtn = document.getElementById('prevTrack');
        this.nextBtn = document.getElementById('nextTrack');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.trackSelect = document.getElementById('trackSelect');
        this.trackNameDisplay = document.getElementById('trackName');
        
        // Inicializar o player
        this.init();
    }
    
    // Método de inicialização - conceito de métodos aprendido
    init() {
        console.log('🎵 Inicializando player de música...');
        
        // Configurar eventos - aprendido sobre addEventListener
        this.setupEventListeners();
        
        // Configurar áudios
        this.setupAudioElements();
        
        // Atualizar interface
        this.updateUI();
        
        console.log('✅ Player de música inicializado com sucesso!');
    }
    
    // Configurar eventos dos botões
    setupEventListeners() {
        // Botão para mostrar/esconder player
        this.toggleBtn.addEventListener('click', () => {
            this.togglePlayerVisibility();
        });
        
        // Botão play/pause
        this.playPauseBtn.addEventListener('click', () => {
            this.togglePlayPause();
        });
        
        // Botão música anterior
        this.prevBtn.addEventListener('click', () => {
            this.previousTrack();
        });
        
        // Botão próxima música
        this.nextBtn.addEventListener('click', () => {
            this.nextTrack();
        });
        
        // Controle de volume
        this.volumeSlider.addEventListener('input', (e) => {
            this.setVolume(e.target.value / 100);
        });
        
        // Seletor de música
        this.trackSelect.addEventListener('change', (e) => {
            this.selectTrack(parseInt(e.target.value));
        });
    }
    
    // Configurar elementos de áudio
    setupAudioElements() {
        this.tracks.forEach((track, index) => {
            if (track.element) {
                // Configurar volume inicial
                track.element.volume = this.volume;
                
                // Evento quando a música termina
                track.element.addEventListener('ended', () => {
                    this.nextTrack();
                });
                
                // Evento de erro
                track.element.addEventListener('error', (e) => {
                    console.error(`❌ Erro ao carregar ${track.name}:`, e);
                    this.showNotification(`Erro ao carregar ${track.name}`, 'error');
                });
                
                // Evento quando carrega
                track.element.addEventListener('loadeddata', () => {
                    console.log(`✅ ${track.name} carregada com sucesso`);
                });
            }
        });
    }
    
    // Mostrar/esconder player
    togglePlayerVisibility() {
        this.isPlayerVisible = !this.isPlayerVisible;
        
        if (this.isPlayerVisible) {
            this.playerContent.classList.add('show');
            this.showNotification('Player de música aberto', 'info');
        } else {
            this.playerContent.classList.remove('show');
            this.showNotification('Player de música fechado', 'info');
        }
    }
    
    // Play/Pause da música
    togglePlayPause() {
        const currentTrack = this.tracks[this.currentTrackIndex];
        
        if (!currentTrack || !currentTrack.element) {
            this.showNotification('Erro: Música não encontrada', 'error');
            return;
        }
        
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    // Tocar música
    play() {
        const currentTrack = this.tracks[this.currentTrackIndex];
        
        // Parar todas as outras músicas primeiro
        this.stopAllTracks();
        
        // Tocar a música atual
        currentTrack.element.play()
            .then(() => {
                this.isPlaying = true;
                this.updateUI();
                this.showNotification(`🎵 Tocando: ${currentTrack.name}`, 'success');
                console.log(`🎵 Tocando: ${currentTrack.name}`);
            })
            .catch((error) => {
                console.error('❌ Erro ao tocar música:', error);
                this.showNotification('Erro ao tocar música', 'error');
            });
    }
    
    // Pausar música
    pause() {
        const currentTrack = this.tracks[this.currentTrackIndex];
        
        if (currentTrack && currentTrack.element) {
            currentTrack.element.pause();
            this.isPlaying = false;
            this.updateUI();
            this.showNotification('⏸️ Música pausada', 'info');
            console.log('⏸️ Música pausada');
        }
    }
    
    // Parar todas as músicas
    stopAllTracks() {
        this.tracks.forEach(track => {
            if (track.element) {
                track.element.pause();
                track.element.currentTime = 0;
            }
        });
    }
    
    // Música anterior
    previousTrack() {
        this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
        this.changeTrack();
    }
    
    // Próxima música
    nextTrack() {
        this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
        this.changeTrack();
    }
    
    // Selecionar música específica
    selectTrack(index) {
        if (index >= 0 && index < this.tracks.length) {
            this.currentTrackIndex = index;
            this.changeTrack();
        }
    }
    
    // Trocar de música
    changeTrack() {
        const wasPlaying = this.isPlaying;
        
        // Parar música atual
        this.stopAllTracks();
        this.isPlaying = false;
        
        // Atualizar interface
        this.updateUI();
        
        // Se estava tocando, tocar a nova música
        if (wasPlaying) {
            setTimeout(() => {
                this.play();
            }, 100);
        }
        
        const currentTrack = this.tracks[this.currentTrackIndex];
        this.showNotification(`🎵 Música selecionada: ${currentTrack.name}`, 'info');
    }
    
    // Definir volume
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        
        // Aplicar volume a todas as músicas
        this.tracks.forEach(track => {
            if (track.element) {
                track.element.volume = this.volume;
            }
        });
        
        // Atualizar slider se necessário
        if (this.volumeSlider.value != this.volume * 100) {
            this.volumeSlider.value = this.volume * 100;
        }
        
        console.log(`🔊 Volume definido para: ${Math.round(this.volume * 100)}%`);
    }
    
    // Atualizar interface do usuário
    updateUI() {
        const currentTrack = this.tracks[this.currentTrackIndex];
        
        // Atualizar nome da música
        if (this.trackNameDisplay) {
            this.trackNameDisplay.textContent = currentTrack.name;
        }
        
        // Atualizar botão play/pause
        if (this.playPauseBtn) {
            const icon = this.playPauseBtn.querySelector('i');
            if (this.isPlaying) {
                icon.className = 'fas fa-pause';
                this.playPauseBtn.classList.add('playing');
            } else {
                icon.className = 'fas fa-play';
                this.playPauseBtn.classList.remove('playing');
            }
        }
        
        // Atualizar seletor
        if (this.trackSelect) {
            this.trackSelect.value = this.currentTrackIndex;
        }
        
        // Atualizar slider de volume
        if (this.volumeSlider) {
            this.volumeSlider.value = this.volume * 100;
        }
    }
    
    // Mostrar notificação - função auxiliar
    showNotification(message, type = 'info') {
        // Usar o sistema de notificações global se disponível
        if (window.showNotification) {
            window.showNotification(message, type);
        } else {
            console.log(`📢 ${message}`);
        }
    }
}

// ===== SISTEMA DE EFEITOS SONOROS =====
// Classe para gerenciar efeitos sonoros do jogo e formulário
class SoundEffects {
    constructor() {
        // Elementos de áudio para efeitos
        this.sounds = {
            winner: document.getElementById('winnerSound'),
            defeat: document.getElementById('defeatSound')
        };
        
        this.enabled = true;
        this.volume = 0.7;
        
        this.init();
    }
    
    init() {
        console.log('🔊 Sistema de efeitos sonoros carregado');
        
        // Configurar volume dos efeitos
        Object.values(this.sounds).forEach(sound => {
            if (sound) {
                sound.volume = this.volume;
            }
        });
    }
    
    // Tocar som de vitória
    playWinner() {
        this.playSound('winner');
    }
    
    // Tocar som de derrota/erro
    playDefeat() {
        this.playSound('defeat');
    }
    
    // Tocar som específico
    playSound(soundName) {
        if (!this.enabled) return;
        
        const sound = this.sounds[soundName];
        if (sound) {
            sound.currentTime = 0; // Reiniciar do início
            sound.play()
                .then(() => {
                    console.log(`🔊 Efeito sonoro tocado: ${soundName}`);
                })
                .catch((error) => {
                    console.error(`❌ Erro ao tocar efeito ${soundName}:`, error);
                });
        }
    }
    
    // Ativar/desativar efeitos
    toggle() {
        this.enabled = !this.enabled;
        console.log(`🔊 Efeitos sonoros ${this.enabled ? 'ativados' : 'desativados'}`);
        return this.enabled;
    }
    
    // Definir volume dos efeitos
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        Object.values(this.sounds).forEach(sound => {
            if (sound) {
                sound.volume = this.volume;
            }
        });
    }
}

// ===== SISTEMA DE NOTIFICAÇÕES MELHORADO =====
// Sistema próprio de notificações - implementação para estudante
class NotificationSystem {
    constructor() {
        this.container = document.getElementById('notificationContainer');
        this.notifications = [];
        this.maxNotifications = 3;
        
        // Criar container se não existir
        if (!this.container) {
            this.createContainer();
        }
        
        console.log('📢 Sistema de notificações carregado');
    }
    
    // Criar container de notificações
    createContainer() {
        this.container = document.createElement('div');
        this.container.id = 'notificationContainer';
        this.container.className = 'notification-container';
        document.body.appendChild(this.container);
    }
    
    // Mostrar notificação
    show(message, type = 'info', duration = 3000) {
        // Limitar número de notificações
        if (this.notifications.length >= this.maxNotifications) {
            this.removeOldest();
        }
        
        const notification = this.createNotification(message, type);
        this.container.appendChild(notification);
        this.notifications.push(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto-remover
        if (duration > 0) {
            setTimeout(() => {
                this.remove(notification);
            }, duration);
        }
        
        console.log(`📢 Notificação: ${message} (${type})`);
        return notification;
    }
    
    // Criar elemento de notificação
    createNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        // Ícone baseado no tipo
        const icon = this.getIcon(type);
        
        notification.innerHTML = `
            <i class="${icon}"></i>
            <span class="message">${message}</span>
            <button class="close-btn" onclick="this.parentElement.remove()">&times;</button>
        `;
        
        return notification;
    }
    
    // Obter ícone baseado no tipo
    getIcon(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-triangle',
            warning: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    }
    
    // Remover notificação
    remove(notification) {
        if (notification && notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                    const index = this.notifications.indexOf(notification);
                    if (index > -1) {
                        this.notifications.splice(index, 1);
                    }
                }
            }, 300);
        }
    }
    
    // Remover notificação mais antiga
    removeOldest() {
        if (this.notifications.length > 0) {
            this.remove(this.notifications[0]);
        }
    }
    
    // Limpar todas as notificações
    clear() {
        this.notifications.forEach(notification => {
            this.remove(notification);
        });
    }
}

// ===== INICIALIZAÇÃO =====
// Variáveis globais para acesso em outros arquivos
let musicPlayer;
let soundEffects;
let notificationSystem;

// Função de inicialização quando o DOM estiver pronto
function initAudioSystem() {
    try {
        // Inicializar sistemas de áudio
        musicPlayer = new MusicPlayer();
        soundEffects = new SoundEffects();
        notificationSystem = new NotificationSystem();
        
        // Tornar funções disponíveis globalmente
        window.musicPlayer = musicPlayer;
        window.soundEffects = soundEffects;
        window.showNotification = (message, type, duration) => {
            return notificationSystem.show(message, type, duration);
        };
        
        console.log('🎵 Sistema de áudio inicializado com sucesso!');
        
        // Mostrar notificação de boas-vindas
        setTimeout(() => {
            notificationSystem.show('🎵 Sistema de áudio ativado!', 'success');
        }, 1000);
        
    } catch (error) {
        console.error('❌ Erro ao inicializar sistema de áudio:', error);
    }
}

// Inicializar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAudioSystem);
} else {
    initAudioSystem();
}

// ===== FUNÇÕES AUXILIARES GLOBAIS =====
// Funções que podem ser chamadas de outros arquivos

// Tocar som de sucesso (para formulário e jogo)
window.playSuccessSound = function() {
    if (soundEffects) {
        soundEffects.playWinner();
    }
};

// Tocar som de erro (para formulário e jogo)
window.playErrorSound = function() {
    if (soundEffects) {
        soundEffects.playDefeat();
    }
};

// Controlar música
window.toggleMusic = function() {
    if (musicPlayer) {
        musicPlayer.togglePlayPause();
    }
};

// Próxima música
window.nextMusic = function() {
    if (musicPlayer) {
        musicPlayer.nextTrack();
    }
};

// Música anterior
window.prevMusic = function() {
    if (musicPlayer) {
        musicPlayer.previousTrack();
    }
};

console.log('🎵 Controlador de áudio carregado com sucesso!');

