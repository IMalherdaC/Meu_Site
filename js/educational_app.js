// ===== JOGO EDUCATIVO MELHORADO =====
// Arquivo criado durante o aprendizado de JavaScript - 1º período ADS
// Sistema de jogo de formação de palavras - implementação teste (06/07/25)

console.log('🎮 Sistema do jogo educativo carregado');

// ===== CLASSE PRINCIPAL DO JOGO =====
class EducationalGame {
    constructor() {
        // Configurações do jogo
        this.config = {
            maxLevel: 5,
            pointsPerSyllable: 10,
            pointsPerWord: 50,
            timePerLevel: 60, // segundos
            timerStartLevel: 3, // cronômetro inicia no nível 3
            shuffleStartLevel: 2, // embaralhamento inicia no nível 2
            hintsPerLevel: 2
        };
        
        // Estado do jogo
        this.gameState = {
            isPlaying: false,
            isPaused: false,
            currentLevel: 1,
            score: 0,
            wordsCompleted: 0,
            hintsUsed: 0,
            timeRemaining: 0,
            timerInterval: null
        };
        
        // Dados das palavras por nível - corrigido com sílaba "PON"
        this.gameData = {
            1: [
                { word: 'CASA', syllables: ['CA', 'SA'], image: '🏠' },
                { word: 'GATO', syllables: ['GA', 'TO'], image: '🐱' },
                { word: 'BOLA', syllables: ['BO', 'LA'], image: '⚽' }
            ],
            2: [
                { word: 'ESCOLA', syllables: ['ES', 'CO', 'LA'], image: '🏫' },
                { word: 'AMIGO', syllables: ['A', 'MI', 'GO'], image: '👫' },
                { word: 'LIVRO', syllables: ['LI', 'VRO'], image: '📚' },
                { word: 'FLOR', syllables: ['FLOR'], image: '🌸' }
            ],
            3: [
                { word: 'COMPUTADOR', syllables: ['COM', 'PU', 'TA', 'DOR'], image: '💻' },
                { word: 'TELEFONE', syllables: ['TE', 'LE', 'FO', 'NE'], image: '📱' },
                { word: 'BICICLETA', syllables: ['BI', 'CI', 'CLE', 'TA'], image: '🚲' },
                { word: 'APONTADOR', syllables: ['A', 'PON', 'TA', 'DOR'], image: '✏️' }
            ],
            4: [
                { word: 'PROGRAMAÇÃO', syllables: ['PRO', 'GRA', 'MA', 'ÇÃO'], image: '💻' },
                { word: 'DESENVOLVIMENTO', syllables: ['DE', 'SEN', 'VOL', 'VI', 'MEN', 'TO'], image: '🚀' },
                { word: 'TECNOLOGIA', syllables: ['TEC', 'NO', 'LO', 'GI', 'A'], image: '⚙️' },
                { word: 'ALGORITMO', syllables: ['AL', 'GO', 'RIT', 'MO'], image: '🧮' }
            ],
            5: [
                { word: 'INTELIGÊNCIA', syllables: ['IN', 'TE', 'LI', 'GÊN', 'CI', 'A'], image: '🧠' },
                { word: 'CRIATIVIDADE', syllables: ['CRI', 'A', 'TI', 'VI', 'DA', 'DE'], image: '🎨' },
                { word: 'RESPONSABILIDADE', syllables: ['RES', 'PON', 'SA', 'BI', 'LI', 'DA', 'DE'], image: '🎯' },
                { word: 'CONHECIMENTO', syllables: ['CO', 'NHE', 'CI', 'MEN', 'TO'], image: '📖' }
            ]
        };
        
        // Elementos do DOM
        this.elements = {
            // Informações do jogo
            currentLevel: document.getElementById('currentLevel'),
            currentScore: document.getElementById('currentScore'),
            wordsCompleted: document.getElementById('wordsCompleted'),
            gameTimer: document.getElementById('gameTimer'),
            timerContainer: document.getElementById('timerContainer'),
            
            // Containers principais
            wordsContainer: document.getElementById('wordsContainer'),
            syllablesContainer: document.getElementById('syllablesContainer'),
            
            // Controles
            startGameBtn: document.getElementById('startGameBtn'),
            resetGameBtn: document.getElementById('resetGameBtn'),
            nextLevelBtn: document.getElementById('nextLevelBtn'),
            hintBtn: document.getElementById('hintBtn'),
            
            // Feedback
            gameMessage: document.getElementById('gameMessage'),
            levelProgress: document.getElementById('levelProgress'),
            progressText: document.getElementById('progressText'),
            
            // Modal
            gameOverModal: document.getElementById('gameOverModal'),
            modalTitle: document.getElementById('modalTitle'),
            modalMessage: document.getElementById('modalMessage'),
            finalScore: document.getElementById('finalScore'),
            finalLevel: document.getElementById('finalLevel'),
            finalWords: document.getElementById('finalWords'),
            finalTime: document.getElementById('finalTime'),
            finalTimeContainer: document.getElementById('finalTimeContainer'),
            playAgainBtn: document.getElementById('playAgainBtn'),
            closeModalBtn: document.getElementById('closeModalBtn')
        };
        
        // Estado das palavras e sílabas
        this.currentWords = [];
        this.availableSyllables = [];
        this.usedSyllables = new Set();
        this.draggedElement = null;
        
        // Inicializar jogo
        this.init();
    }
    
    // ===== INICIALIZAÇÃO =====
    init() {
        console.log('🎮 Inicializando jogo educativo...');
        
        try {
            // Configurar eventos
            this.setupEventListeners();
            
            // Atualizar interface inicial
            this.updateUI();
            
            // Esconder o botão de próximo nível no início
            if (this.elements.nextLevelBtn) {
                this.elements.nextLevelBtn.style.display = 'none';
            }

            // Mostrar mensagem inicial
            this.showMessage('Clique em "Iniciar Jogo" para começar sua jornada de aprendizado!');
            
            console.log('✅ Jogo educativo inicializado com sucesso!');
            
        } catch (error) {
            console.error('❌ Erro ao inicializar jogo:', error);
            this.showNotification('❌ Erro ao carregar jogo', 'error');
        }
    }
    
    // ===== CONFIGURAÇÃO DE EVENTOS =====
    setupEventListeners() {
        // Botões de controle
        this.elements.startGameBtn?.addEventListener('click', () => this.startGame());
        this.elements.resetGameBtn?.addEventListener('click', () => this.resetGame());
        this.elements.nextLevelBtn?.addEventListener('click', () => this.nextLevel());
        this.elements.hintBtn?.addEventListener('click', () => this.showHint());
        
        // Modal
        this.elements.playAgainBtn?.addEventListener('click', () => this.playAgain());
        this.elements.closeModalBtn?.addEventListener('click', () => this.closeModal());
        
        // Fechar modal clicando fora
        this.elements.gameOverModal?.addEventListener('click', (e) => {
            if (e.target === this.elements.gameOverModal) {
                this.closeModal();
            }
        });
        
        // Atalhos de teclado
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }
    
    // ===== LÓGICA DO JOGO =====
    startGame() {
        console.log('🎮 Iniciando jogo...');
        
        // Resetar estado
        this.gameState = {
            isPlaying: true,
            isPaused: false,
            currentLevel: 1,
            score: 0,
            wordsCompleted: 0,
            hintsUsed: 0,
            timeRemaining: this.config.timePerLevel,
            timerInterval: null
        };
        
        // Limpar sílabas usadas
        this.usedSyllables.clear();
        
        // Configurar nível 1
        this.setupLevel(1);
        
        // Atualizar interface
        this.updateUI();
        this.updateButtons();
        
        // Mostrar mensagem
        this.showMessage('🎮 Jogo iniciado! Arraste as sílabas para formar as palavras.');
        
        // Tocar som de início (se disponível)
        this.playSuccessSound();
        
        console.log('✅ Jogo iniciado com sucesso!');
    }
    
    // Configurar nível
    setupLevel(level) {
        console.log(`🎯 Configurando nível ${level}...`);
        
        // Obter dados do nível
        const levelData = this.gameData[level];
        if (!levelData) {
            console.error(`❌ Dados para o nível ${level} não encontrados.`);
            this.completeGame(); // Se não há dados, assume que o jogo terminou
            return;
        }
        this.currentWords = [...levelData];
        
        // Resetar palavras completadas para o novo nível
        this.gameState.wordsCompleted = 0;

        // Configurar cronômetro se necessário
        if (level >= this.config.timerStartLevel) {
            this.gameState.timeRemaining = this.config.timePerLevel + (level * 10); // Mais tempo em níveis avançados
            this.startTimer();
            this.elements.timerContainer.style.display = 'flex';
        } else {
            this.elements.timerContainer.style.display = 'none';
            this.stopTimer(); // Garante que o timer esteja parado em níveis sem timer
        }
        
        // Gerar interface do nível
        this.generateWordsInterface();
        this.generateSyllablesInterface(level);
        
        // Atualizar progresso
        this.updateProgress();
        
        // Mostrar informações do nível
        this.showMessage(`🎯 Nível ${level} - Complete ${this.currentWords.length} palavras!`);
        
        // Garantir que o botão de próximo nível esteja desabilitado no início do nível
        this.elements.nextLevelBtn.disabled = true;
        this.elements.nextLevelBtn.classList.add('disabled');
        this.elements.nextLevelBtn.style.display = 'none'; // Esconder no início do nível
        
        console.log(`✅ Nível ${level} configurado com ${this.currentWords.length} palavras`);
    }
    
    // Gerar interface das palavras
    generateWordsInterface() {
        this.elements.wordsContainer.innerHTML = '';
        
        this.currentWords.forEach((wordData, wordIndex) => {
            const wordElement = document.createElement('div');
            wordElement.className = 'word-item';
            wordElement.dataset.wordIndex = wordIndex;
            
            wordElement.innerHTML = `
                <div class="word-display">
                    ${wordData.image} ${wordData.word}
                </div>
                <div class="syllable-slots">
                    ${wordData.syllables.map((syllable, slotIndex) => `
                        <div class="syllable-slot" 
                             data-word-index="${wordIndex}" 
                             data-slot-index="${slotIndex}"
                             data-expected-syllable="${syllable}">
                        </div>
                    `).join('')}
                </div>
            `;
            
            this.elements.wordsContainer.appendChild(wordElement);
        });
        
        // Configurar eventos de drop nos slots
        this.setupDropZones();
    }
    
    // Configurar zonas de drop
    setupDropZones() {
        const slots = document.querySelectorAll('.syllable-slot');
        
        slots.forEach(slot => {
            slot.addEventListener('dragover', (e) => {
                e.preventDefault();
                if (!slot.classList.contains('filled')) {
                    slot.classList.add('drag-over');
                }
            });
            
            slot.addEventListener('dragleave', (e) => {
                slot.classList.remove('drag-over');
            });
            
            slot.addEventListener('drop', (e) => {
                e.preventDefault();
                slot.classList.remove('drag-over');
                
                if (slot.classList.contains('filled')) {
                    this.showNotification('Este espaço já está preenchido!', 'warning');
                    return;
                }
                
                const syllableText = e.dataTransfer.getData('text/plain');
                const syllableId = e.dataTransfer.getData('syllable-id');
                
                this.placeSyllableInSlot(slot, syllableText, syllableId);
            });
        });
    }
    
    // Gerar interface das sílabas
    generateSyllablesInterface(level) {
        // Coletar todas as sílabas do nível
        let allSyllables = [];
        this.currentWords.forEach(wordData => {
            allSyllables.push(...wordData.syllables);
        });
        
        // Adicionar sílabas distratoras para aumentar dificuldade
        const distractorSyllables = this.getDistractorSyllables(level);
        allSyllables.push(...distractorSyllables);
        
        // Embaralhar sílabas se for nível 2 ou superior
        if (level >= this.config.shuffleStartLevel) {
            allSyllables = this.shuffleArray(allSyllables);
        }
        
        // Limpar container
        this.elements.syllablesContainer.innerHTML = '';
        
        // Criar elementos das sílabas
        allSyllables.forEach((syllable, index) => {
            const syllableElement = document.createElement('div');
            syllableElement.className = 'syllable-item';
            syllableElement.draggable = true;
            syllableElement.textContent = syllable;
            syllableElement.dataset.syllableId = `syllable-${level}-${index}`;
            
            // Configurar eventos de drag
            syllableElement.addEventListener('dragstart', (e) => {
                if (syllableElement.classList.contains('used')) {
                    e.preventDefault();
                    this.showNotification('Esta sílaba já foi usada!', 'warning');
                    return;
                }
                
                this.draggedElement = syllableElement;
                syllableElement.classList.add('dragging');
                e.dataTransfer.setData('text/plain', syllable);
                e.dataTransfer.setData('syllable-id', syllableElement.dataset.syllableId);
            });
            
            syllableElement.addEventListener('dragend', (e) => {
                syllableElement.classList.remove('dragging');
                this.draggedElement = null;
            });
            
            this.elements.syllablesContainer.appendChild(syllableElement);
        });
        
        console.log(`🎯 Geradas ${allSyllables.length} sílabas para o nível ${level}`);
    }
    
    // Obter sílabas distratoras
    getDistractorSyllables(level) {
        const distractors = {
            1: ['MA', 'TA', 'PA', 'NA'],
            2: ['RA', 'SO', 'TI', 'NO', 'DA'],
            3: ['MEN', 'TOR', 'CAR', 'VEL', 'SER'],
            4: ['ÇÃO', 'MENTE', 'DADE', 'ISMO'],
            5: ['NCIA', 'ÁVEL', 'ENTE', 'ANTE']
        };
        
        const levelDistractors = distractors[level] || []; // Retorna array vazio se o nível não tiver distratores
        const numDistractors = Math.min(level + 1, levelDistractors.length);
        
        return this.shuffleArray(levelDistractors).slice(0, numDistractors);
    }
    
    // Embaralhar array
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    // Colocar sílaba no slot
    placeSyllableInSlot(slot, syllableText, syllableId) {
        // Verificar se a sílaba está correta
        const expectedSyllable = slot.dataset.expectedSyllable;
        
        if (syllableText !== expectedSyllable) {
            this.showNotification(`❌ Sílaba incorreta!`, 'error'); // Remover o esperado para não dar a resposta
            return;
        }
        
        // Criar elemento da sílaba no slot
        const syllableElement = document.createElement('span');
        syllableElement.className = 'syllable-in-slot';
        syllableElement.textContent = syllableText;
        syllableElement.dataset.syllableId = syllableId;
        
        // Adicionar ao slot
        slot.appendChild(syllableElement);
        slot.classList.add('filled');
        
        // Marcar sílaba como usada
        this.markSyllableAsUsed(syllableId);
        
        // Adicionar pontos
        this.addScore(this.config.pointsPerSyllable);
        
        // Verificar se a palavra foi completada
        this.checkWordCompletion(slot);
        
        // Efeito visual
        slot.classList.add('animate-bounce');
        setTimeout(() => slot.classList.remove('animate-bounce'), 1000);
        
        console.log(`🎯 Sílaba "${syllableText}" colocada no slot`);
        this.showNotification(`✅ Sílaba "${syllableText}" adicionada!`, 'success', 2000);
    }
    
    // Marcar sílaba como usada
    markSyllableAsUsed(syllableId) {
        const syllableElement = document.querySelector(`[data-syllable-id="${syllableId}"]`);
        if (syllableElement && syllableElement.classList.contains('syllable-item')) {
            syllableElement.classList.add('used');
            syllableElement.draggable = false;
            this.usedSyllables.add(syllableId);
        }
    }
    
    // Verificar conclusão da palavra
    checkWordCompletion(slot) {
        const wordIndex = parseInt(slot.dataset.wordIndex);
        const wordElement = slot.closest('.word-item');
        const slots = wordElement.querySelectorAll('.syllable-slot');
        
        // Verificar se todos os slots estão preenchidos
        const allFilled = Array.from(slots).every(s => s.classList.contains('filled'));
        
        if (allFilled) {
            this.completeWord(wordElement, wordIndex);
        }
    }
    
    // Completar palavra
    completeWord(wordElement, wordIndex) {
        const wordData = this.currentWords[wordIndex];
        
        // Marcar como completada
        wordElement.classList.add('completed');
        
        // Adicionar pontos
        this.addScore(this.config.pointsPerWord);
        
        // Incrementar contador
        this.gameState.wordsCompleted++;
        
        // Efeitos visuais
        wordElement.classList.add('animate-bounce');
        setTimeout(() => wordElement.classList.remove('animate-bounce'), 1000);
        
        // Tocar som de sucesso
        this.playSuccessSound();
        
        // Mostrar notificação
        this.showNotification(`🎉 Palavra "${wordData.word}" completada! +${this.config.pointsPerWord} pontos`, 'success', 3000);
        
        // Verificar se o nível foi completado
        this.checkLevelCompletion();
        
        console.log(`✅ Palavra "${wordData.word}" completada`);
    }
    
    // Verificar conclusão do nível
    checkLevelCompletion() {
        const completedWords = document.querySelectorAll('.word-item.completed').length;
        const totalWords = this.currentWords.length;

        // Atualizar progresso
        this.updateProgress();

        if (completedWords === totalWords) {
            // Habilita botão de próximo nível
            if (this.elements.nextLevelBtn) {
                this.elements.nextLevelBtn.disabled = false;
                this.elements.nextLevelBtn.classList.remove('disabled');
                this.elements.nextLevelBtn.style.display = 'inline-flex'; // Mostrar o botão
            }
            this.completeLevel();
        }
    }

    
    // Completar nível
    completeLevel() {
        console.log(`🎉 Nível ${this.gameState.currentLevel} completado!`);
        
        // Parar cronômetro
        this.stopTimer();
        
        // Bonus por tempo restante
        if (this.gameState.currentLevel >= this.config.timerStartLevel && this.gameState.timeRemaining > 0) {
            const timeBonus = this.gameState.timeRemaining * 5;
            this.addScore(timeBonus);
            this.showNotification(`⏰ Bônus de tempo: +${timeBonus} pontos`, 'success', 3000);
        }
        
        // Tocar som de vitória
        this.playSuccessSound();
        
        // Mostrar mensagem de conclusão
        this.showMessage(`🎉 Nível ${this.gameState.currentLevel} completado! Parabéns!`);
        
        // Verificar se há próximo nível ou se o jogo foi completado
        if (this.gameState.currentLevel < this.config.maxLevel && this.gameData[this.gameState.currentLevel + 1]) {
            // O botão já foi habilitado em checkLevelCompletion
        } else {
            // Jogo completado
            this.completeGame();
        }
        
        // Atualizar botões (desabilitar dica, etc., se necessário)
        this.updateButtons();
    }
    
    // Próximo nível
    nextLevel() {
        console.log('🎯 Avançando para próximo nível...');
        
        // Incrementar nível
        this.gameState.currentLevel++;
        
        // Verificar se nível existe
        if (!this.gameData[this.gameState.currentLevel]) {
            console.log('🏆 Todos os níveis completados!');
            this.completeGame();
            return;
        }
        
        // Resetar estado do nível
        this.gameState.hintsUsed = 0;
        this.gameState.timeRemaining = this.config.timePerLevel; // Reiniciar tempo para o novo nível
        this.usedSyllables.clear();
        this.gameState.wordsCompleted = 0; // Resetar palavras completadas para o novo nível
        
        // Configurar novo nível
        this.setupLevel(this.gameState.currentLevel);
        
        // Atualizar interface
        this.updateUI();
        this.updateButtons(); // Atualizar botões após a mudança de nível (esconder próximo nível)
        
        // Mostrar mensagem
        this.showMessage(`🎯 Nível ${this.gameState.currentLevel} iniciado! Boa sorte!`);
        
        // Esconder botão de próximo nível
        if (this.elements.nextLevelBtn) {
            this.elements.nextLevelBtn.style.display = 'none';
        }
        
        console.log(`✅ Nível ${this.gameState.currentLevel} configurado!`);
    }

    
    // Completar jogo
    completeGame() {
        console.log('🏆 Jogo completado!');
        
        this.gameState.isPlaying = false;
        this.stopTimer(); // Parar o timer ao completar o jogo
        
        // Mostrar modal de vitória
        this.showGameOverModal(true);
    }
    
    // ===== SISTEMA DE CRONÔMETRO =====
    startTimer() {
        this.stopTimer(); // Limpar timer anterior
        
        this.gameState.timerInterval = setInterval(() => {
            this.gameState.timeRemaining--;
            this.updateTimerDisplay();
            
            // Avisos de tempo
            if (this.gameState.timeRemaining === 30) {
                this.showNotification('⏰ 30 segundos restantes!', 'warning', 3000);
            } else if (this.gameState.timeRemaining === 10) {
                this.showNotification('⏰ 10 segundos restantes!', 'error', 3000);
                this.elements.gameTimer.classList.add('animate-pulse');
            }
            
            // Tempo esgotado
            if (this.gameState.timeRemaining <= 0) {
                this.timeUp();
            }
        }, 1000);
    }
    
    // Parar cronômetro
    stopTimer() {
        if (this.gameState.timerInterval) {
            clearInterval(this.gameState.timerInterval);
            this.gameState.timerInterval = null;
        }
        
        this.elements.gameTimer?.classList.remove('animate-pulse');
    }
    
    // Atualizar display do cronômetro
    updateTimerDisplay() {
        if (this.elements.gameTimer) {
            this.elements.gameTimer.textContent = `${this.gameState.timeRemaining}s`;
        }
    }
    
    // Tempo esgotado
    timeUp() {
        console.log('⏰ Tempo esgotado!');
        
        this.stopTimer();
        this.gameState.isPlaying = false;
        
        // Tocar som de derrota
        this.playErrorSound();
        
        // Mostrar modal de game over
        this.showGameOverModal(false);
    }
    
    // ===== SISTEMA DE DICAS =====
    showHint() {
        if (this.gameState.hintsUsed >= this.config.hintsPerLevel) {
            this.showNotification('❌ Você já usou todas as dicas deste nível!', 'warning', 3000);
            return;
        }
        
        // Encontrar primeira palavra incompleta
        const incompleteWord = document.querySelector('.word-item:not(.completed)');
        if (!incompleteWord) {
            this.showNotification('✅ Todas as palavras já foram completadas!', 'info', 3000);
            return;
        }
        
        const wordIndex = parseInt(incompleteWord.dataset.wordIndex);
        const wordData = this.currentWords[wordIndex];
        
        // Encontrar primeiro slot vazio
        const emptySlot = incompleteWord.querySelector('.syllable-slot:not(.filled)');
        if (!emptySlot) return;
        
        const slotIndex = parseInt(emptySlot.dataset.slotIndex);
        const expectedSyllable = wordData.syllables[slotIndex];
        
        // Destacar sílaba correta
        const correctSyllableElement = Array.from(document.querySelectorAll('.syllable-item')).find(
            el => el.textContent === expectedSyllable && !el.classList.contains('used')
        );
        
        if (correctSyllableElement) {
            // Efeito visual na sílaba
            correctSyllableElement.classList.add('animate-pulse');
            correctSyllableElement.style.border = '3px solid var(--neon-orange)';
            correctSyllableElement.style.boxShadow = '0 0 20px var(--neon-orange)';
            
            // Efeito visual no slot
            emptySlot.style.border = '3px solid var(--neon-orange)';
            emptySlot.style.boxShadow = '0 0 20px var(--neon-orange)';
            
            // Remover efeitos após 3 segundos
            setTimeout(() => {
                correctSyllableElement.classList.remove('animate-pulse');
                correctSyllableElement.style.border = '';
                correctSyllableElement.style.boxShadow = '';
                emptySlot.style.border = '';
                emptySlot.style.boxShadow = '';
            }, 3000);
            
            this.gameState.hintsUsed++;
            this.showNotification(`💡 Dica: A sílaba "${expectedSyllable}" vai no slot destacado!`, 'info', 4000);
            
            // Atualizar botão de dica
            this.updateHintButton();
        } else {
            this.showNotification('Nenhuma sílaba disponível para esta dica no momento.', 'info', 3000);
        }
    }
    
    // Atualizar botão de dica
    updateHintButton() {
        if (this.elements.hintBtn) {
            const remaining = this.config.hintsPerLevel - this.gameState.hintsUsed;
            this.elements.hintBtn.innerHTML = `<i class="fas fa-lightbulb"></i> Dica (${remaining})`;
            
            if (remaining <= 0) {
                this.elements.hintBtn.disabled = true;
                this.elements.hintBtn.style.opacity = '0.5';
            } else {
                this.elements.hintBtn.disabled = false;
                this.elements.hintBtn.style.opacity = '1';
            }
        }
    }
    
    // ===== CONTROLES DO JOGO =====
    resetGame() {
        console.log('🔄 Resetando jogo...');
        
        // Parar cronômetro
        this.stopTimer();
        
        // Resetar estado para o início do jogo (Nível 1)
        this.gameState = {
            isPlaying: false,
            isPaused: false,
            currentLevel: 1, // Começa do nível 1
            score: 0,
            wordsCompleted: 0,
            hintsUsed: 0,
            timeRemaining: 0,
            timerInterval: null
        };
        
        // Limpar interface
        this.elements.wordsContainer.innerHTML = '';
        this.elements.syllablesContainer.innerHTML = '';
        this.usedSyllables.clear();
        
        // Atualizar interface
        this.updateUI();
        this.updateButtons(); // Mostrar botão 'Iniciar Jogo'
        
        // Esconder cronômetro
        this.elements.timerContainer.style.display = 'none';
        
        // Mostrar mensagem
        this.showMessage('🔄 Jogo resetado! Clique em "Iniciar Jogo" para começar novamente.');
        
        this.showNotification('🔄 Jogo resetado com sucesso!', 'info', 3000);
    }
    
    // Reembaralhar sílabas
    reshuffleSyllables() {
        const syllableElements = Array.from(this.elements.syllablesContainer.children);
        const shuffledElements = this.shuffleArray(syllableElements);
        
        // Limpar container
        this.elements.syllablesContainer.innerHTML = '';
        
        // Adicionar elementos embaralhados
        shuffledElements.forEach(element => {
            this.elements.syllablesContainer.appendChild(element);
        });
        
        this.showNotification('🔀 Sílabas embaralhadas!', 'info', 2000);
    }
    
    // ===== INTERFACE E FEEDBACK =====
    updateUI() {
        // Atualizar informações do jogo
        if (this.elements.currentLevel) {
            this.elements.currentLevel.textContent = this.gameState.currentLevel;
        }
        
        if (this.elements.currentScore) {
            this.elements.currentScore.textContent = this.gameState.score;
        }
        
        if (this.elements.wordsCompleted) {
            this.elements.wordsCompleted.textContent = this.gameState.wordsCompleted;
        }
        
        // Atualizar cronômetro
        this.updateTimerDisplay();
        
        // Atualizar botão de dica
        this.updateHintButton();
    }
    
    // Atualizar botões
    updateButtons() {
        if (!this.gameState.isPlaying) {
            this.elements.startGameBtn.style.display = 'inline-flex';
            this.elements.resetGameBtn.style.display = 'none';
            this.elements.nextLevelBtn.style.display = 'none'; // Sempre escondido quando não estiver jogando
            this.elements.hintBtn.style.display = 'none';
        } else {
            this.elements.startGameBtn.style.display = 'none';
            this.elements.resetGameBtn.style.display = 'inline-flex';
            this.elements.hintBtn.style.display = 'inline-flex';
            // O botão nextLevelBtn será exibido e habilitado na função checkLevelCompletion
            // se o nível for completado. Caso contrário, permanece escondido.
            if (document.querySelectorAll('.word-item:not(.completed)').length > 0) {
                 this.elements.nextLevelBtn.style.display = 'none';
            }
        }
    }
    
    // Atualizar progresso
    updateProgress() {
        const completedWords = document.querySelectorAll('.word-item.completed').length;
        const totalWords = this.currentWords.length;
        const percentage = totalWords > 0 ? (completedWords / totalWords) * 100 : 0;
        
        if (this.elements.levelProgress) {
            this.elements.levelProgress.style.width = `${percentage}%`;
        }
        
        if (this.elements.progressText) {
            this.elements.progressText.textContent = `${Math.round(percentage)}%`;
        }
    }
    
    // Mostrar mensagem
    showMessage(message) {
        if (this.elements.gameMessage) {
            this.elements.gameMessage.innerHTML = `<p>${message}</p>`;
        }
    }
    
    // Adicionar pontuação
    addScore(points) {
        this.gameState.score += points;
        this.updateUI();
        
        // Efeito visual de pontuação
        if (this.elements.currentScore) {
            this.elements.currentScore.classList.add('animate-bounce');
            setTimeout(() => {
                this.elements.currentScore.classList.remove('animate-bounce');
            }, 500);
        }
    }
    
    // ===== MODAL DE FIM DE JOGO =====
    showGameOverModal(isVictory) {
        const modal = this.elements.gameOverModal;
        if (!modal) return;
        
        // Configurar conteúdo do modal
        if (isVictory) {
            this.elements.modalTitle.innerHTML = '<i class="fas fa-trophy"></i> Parabéns!';
            this.elements.modalMessage.textContent = 'Você completou todos os níveis com sucesso!';
        } else {
            this.elements.modalTitle.innerHTML = '<i class="fas fa-clock"></i> Tempo Esgotado!';
            this.elements.modalMessage.textContent = 'O tempo acabou, mas você pode tentar novamente!';
        }
        
        // Atualizar estatísticas
        this.elements.finalScore.textContent = this.gameState.score;
        this.elements.finalLevel.textContent = this.gameState.currentLevel;
        this.elements.finalWords.textContent = this.gameState.wordsCompleted;
        
        // Mostrar tempo restante apenas se o timer foi ativado em algum nível
        if (this.gameState.currentLevel >= this.config.timerStartLevel) {
            this.elements.finalTime.textContent = `${Math.max(0, this.gameState.timeRemaining)}s`; // Garante que não mostre tempo negativo
            this.elements.finalTimeContainer.style.display = 'flex';
        } else {
            this.elements.finalTimeContainer.style.display = 'none';
        }
        
        // Mostrar modal
        modal.classList.add('show');
        modal.style.display = 'flex';
        
        // Tocar som apropriado
        if (isVictory) {
            this.playSuccessSound();
        } else {
            this.playErrorSound();
        }
    }
    
    // Fechar modal
    closeModal() {
        const modal = this.elements.gameOverModal;
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }
    
    // Jogar novamente
    playAgain() {
        this.closeModal();
        this.resetGame(); // Reset para o estado inicial
        setTimeout(() => {
            this.startGame(); // Inicia um novo jogo
        }, 500);
    }
    
    // ===== CONTROLES DE TECLADO =====
    handleKeyboard(e) {
        if (!this.gameState.isPlaying) return;
        
        switch (e.key) {
            case 'h':
            case 'H':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.showHint();
                }
                break;
            case 'r':
            case 'R':
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.resetGame();
                }
                break;
            case 'Escape':
                this.closeModal();
                break;
        }
    }
    
    // ===== SISTEMA DE ÁUDIO =====
    playSuccessSound() {
        try {
            const audio = new Audio('audio/winners..mp3');
            audio.volume = 0.3;
            audio.play().catch(e => console.log('Erro ao tocar som de sucesso:', e));
        } catch (error) {
            console.log('Som de sucesso não disponível');
        }
    }
    
    playErrorSound() {
        try {
            const audio = new Audio('audio/defeat.mp3');
            audio.volume = 0.3;
            audio.play().catch(e => console.log('Erro ao tocar som de erro:', e));
        } catch (error) {
            console.log('Som de erro não disponível');
        }
    }
    
    // ===== SISTEMA DE NOTIFICAÇÕES =====
    showNotification(message, type = 'info', duration = 3000) {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Adicionar ao body
        document.body.appendChild(notification);
        
        // Mostrar notificação
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Configurar botão de fechar
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            this.removeNotification(notification);
        });
        
        // Auto-remover após duração especificada
        setTimeout(() => {
            this.removeNotification(notification);
        }, duration);
    }
    
    // Remover notificação
    removeNotification(notification) {
        if (notification && notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }
}

// ===== INICIALIZAÇÃO =====
let educationalGame;

// Função de inicialização principal
function initEducationalGame() {
    try {
        // Aguardar DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                educationalGame = new EducationalGame();
                window.educationalGame = educationalGame;
            });
        } else {
            educationalGame = new EducationalGame();
            window.educationalGame = educationalGame;
        }
        
        console.log('🎮 Sistema do jogo educativo inicializado com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro ao inicializar jogo educativo:', error);
    }
}

// Inicializar jogo
initEducationalGame();

// ===== TRATAMENTO DE ERROS =====
window.addEventListener('error', (event) => {
    console.error('🚨 Erro no jogo educativo:', event.error);
});

console.log('🎮 Jogo educativo carregado com sucesso!');