// ===== DADOS DO JOGO =====
const GAME_DATA = {
    levels: [
        {
            id: 1,
            name: "Nível 1 - Animais",
            words: [
                {
                    image: "https://via.placeholder.com/120x120/ff6b6b/ffffff?text=🦶",
                    syllables: ["SA", "_A", "TO"],
                    missing: [{ position: 1, vowel: "P" }],
                    complete: "SAPATO",
                    hint: "Você usa nos pés para caminhar"
                },
                {
                    image: "https://via.placeholder.com/120x120/4ecdc4/ffffff?text=🦜",
                    syllables: ["TU", "_A", "NO"],
                    missing: [{ position: 1, vowel: "C" }],
                    complete: "TUCANO",
                    hint: "Ave colorida com bico grande"
                },
                {
                    image: "https://via.placeholder.com/120x120/45b7d1/ffffff?text=⚽",
                    syllables: ["BO", "_A"],
                    missing: [{ position: 1, vowel: "L" }],
                    complete: "BOLA",
                    hint: "Objeto redondo usado em esportes"
                },
                {
                    image: "https://via.placeholder.com/120x120/96ceb4/ffffff?text=🥄",
                    syllables: ["ES", "_O", "LA"],
                    missing: [{ position: 1, vowel: "C" }],
                    complete: "ESCOLA",
                    hint: "Local onde você aprende"
                }
            ]
        },
        {
            id: 2,
            name: "Nível 2 - Objetos",
            words: [
                {
                    image: "https://via.placeholder.com/120x120/feca57/ffffff?text=🍰",
                    syllables: ["BO", "_O"],
                    missing: [{ position: 1, vowel: "L" }],
                    complete: "BOLO",
                    hint: "Doce que comemos em aniversários"
                },
                {
                    image: "https://via.placeholder.com/120x120/ff6b6b/ffffff?text=🐴",
                    syllables: ["CA", "_A", "LO"],
                    missing: [{ position: 1, vowel: "V" }],
                    complete: "CAVALO",
                    hint: "Animal que galopa"
                },
                {
                    image: "https://via.placeholder.com/120x120/4ecdc4/ffffff?text=🍌",
                    syllables: ["BA", "_A", "NA"],
                    missing: [{ position: 1, vowel: "N" }],
                    complete: "BANANA",
                    hint: "Fruta amarela e doce"
                },
                {
                    image: "https://via.placeholder.com/120x120/45b7d1/ffffff?text=🪑",
                    syllables: ["ES", "_A", "DA"],
                    missing: [{ position: 1, vowel: "C" }],
                    complete: "ESCADA",
                    hint: "Usamos para subir"
                }
            ]
        }
    ],
    
    vowels: ["A", "E", "I", "O", "U"],
    consonants: ["B", "C", "D", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "V", "W", "X", "Y", "Z"]
};

// ===== CLASSE PRINCIPAL DO JOGO =====
class EducationalGame {
    constructor() {
        this.currentLevel = 1;
        this.score = 0;
        this.timer = 0;
        this.timerInterval = null;
        this.isGameActive = false;
        this.completedWords = 0;
        this.totalWords = 0;
        this.mistakes = 0;
        this.hintsUsed = 0;
        this.soundEnabled = true;
        this.difficulty = 'medium';
        
        // Elementos DOM
        this.elements = {};
        
        this.init();
    }
    
    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.updateUI();
        
        console.log('🎮 Jogo educativo inicializado!');
    }
    
    cacheElements() {
        this.elements = {
            // Telas
            instructions: document.getElementById('instructions'),
            gameArea: document.getElementById('gameArea'),
            resultScreen: document.getElementById('resultScreen'),
            
            // Botões principais
            startBtn: document.getElementById('startBtn'),
            resetBtn: document.getElementById('resetBtn'),
            hintBtn: document.getElementById('hintBtn'),
            checkBtn: document.getElementById('checkBtn'),
            
            // Botões de resultado
            nextLevelBtn: document.getElementById('nextLevelBtn'),
            replayBtn: document.getElementById('replayBtn'),
            menuBtn: document.getElementById('menuBtn'),
            
            // Áreas de jogo
            wordsGrid: document.getElementById('wordsGrid'),
            vowelsContainer: document.getElementById('vowelsContainer'),
            
            // Informações
            scoreValue: document.getElementById('scoreValue'),
            levelValue: document.getElementById('levelValue'),
            progressFill: document.getElementById('progressFill'),
            timerValue: document.getElementById('timerValue'),
            
            // Resultado
            resultIcon: document.getElementById('resultIcon'),
            resultTitle: document.getElementById('resultTitle'),
            resultMessage: document.getElementById('resultMessage'),
            finalScore: document.getElementById('finalScore'),
            finalTime: document.getElementById('finalTime'),
            finalAccuracy: document.getElementById('finalAccuracy'),
            
            // Modais
            hintModal: document.getElementById('hintModal'),
            settingsModal: document.getElementById('settingsModal'),
            hintText: document.getElementById('hintText'),
            hintImage: document.getElementById('hintImage'),
            
            // Configurações
            settingsBtn: document.getElementById('settingsBtn'),
            soundToggle: document.getElementById('soundToggle'),
            difficultySelect: document.getElementById('difficultySelect'),
            timerToggle: document.getElementById('timerToggle'),
            
            // Feedback
            feedbackArea: document.getElementById('feedbackArea'),
            particlesContainer: document.getElementById('particlesContainer')
        };
    }
    
    setupEventListeners() {
        // Botões principais
        this.elements.startBtn?.addEventListener('click', () => this.startGame());
        this.elements.resetBtn?.addEventListener('click', () => this.resetLevel());
        this.elements.hintBtn?.addEventListener('click', () => this.showHint());
        this.elements.checkBtn?.addEventListener('click', () => this.checkAnswers());
        
        // Botões de resultado
        this.elements.nextLevelBtn?.addEventListener('click', () => this.nextLevel());
        this.elements.replayBtn?.addEventListener('click', () => this.replayLevel());
        this.elements.menuBtn?.addEventListener('click', () => this.goToMenu());
        
        // Configurações
        this.elements.settingsBtn?.addEventListener('click', () => this.openSettings());
        this.elements.soundToggle?.addEventListener('change', (e) => {
            this.soundEnabled = e.target.checked;
        });
        this.elements.difficultySelect?.addEventListener('change', (e) => {
            this.difficulty = e.target.value;
        });
        
        // Fechar modais
        document.getElementById('closeHintModal')?.addEventListener('click', () => this.closeModal('hintModal'));
        document.getElementById('closeSettingsModal')?.addEventListener('click', () => this.closeModal('settingsModal'));
        
        // Fechar modal clicando fora
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target.id);
            }
        });
        
        // Teclas de atalho
        document.addEventListener('keydown', (e) => {
            if (this.isGameActive) {
                switch(e.key) {
                    case 'h':
                    case 'H':
                        this.showHint();
                        break;
                    case 'r':
                    case 'R':
                        this.resetLevel();
                        break;
                    case 'Enter':
                        this.checkAnswers();
                        break;
                    case 'Escape':
                        this.closeAllModals();
                        break;
                }
            }
        });
    }
    
    setupDragAndDrop() {
        // Será configurado dinamicamente quando as vogais forem criadas
    }
    
    startGame() {
        this.isGameActive = true;
        this.score = 0;
        this.timer = 0;
        this.completedWords = 0;
        this.mistakes = 0;
        this.hintsUsed = 0;
        
        this.showScreen('gameArea');
        this.loadLevel(this.currentLevel);
        this.startTimer();
        this.updateUI();
        
        this.showFeedback('Jogo iniciado! Boa sorte! 🎮', 'success');
    }
    
    loadLevel(levelNumber) {
        const levelData = GAME_DATA.levels.find(level => level.id === levelNumber);
        if (!levelData) {
            this.showFeedback('Nível não encontrado!', 'error');
            return;
        }
        
        this.totalWords = levelData.words.length;
        this.completedWords = 0;
        
        this.createWordsGrid(levelData.words);
        this.createVowelsContainer(levelData.words);
        this.updateProgress();
        
        console.log(`📚 Nível ${levelNumber} carregado:`, levelData.name);
    }
    
    createWordsGrid(words) {
        this.elements.wordsGrid.innerHTML = '';
        
        words.forEach((word, index) => {
            const wordCard = document.createElement('div');
            wordCard.className = 'word-card';
            wordCard.dataset.wordIndex = index;
            
            wordCard.innerHTML = `
                <div class="word-image">
                    <img src="${word.image}" alt="${word.complete}" loading="lazy">
                </div>
                <div class="word-syllables">
                    ${this.createSyllablesHTML(word.syllables, word.missing, index)}
                </div>
            `;
            
            this.elements.wordsGrid.appendChild(wordCard);
        });
    }
    
    createSyllablesHTML(syllables, missing, wordIndex) {
        return syllables.map((syllable, syllableIndex) => {
            if (syllable.includes('_')) {
                // Criar zona de drop para a letra faltante
                const missingInfo = missing.find(m => m.position === syllableIndex);
                return `
                    <div class="syllable">
                        ${syllable.split('').map((char, charIndex) => {
                            if (char === '_') {
                                return `<div class="drop-zone" 
                                           data-word="${wordIndex}" 
                                           data-syllable="${syllableIndex}" 
                                           data-char="${charIndex}"
                                           data-expected="${missingInfo?.vowel || ''}"></div>`;
                            }
                            return char;
                        }).join('')}
                    </div>
                `;
            } else {
                return `<div class="syllable complete">${syllable}</div>`;
            }
        }).join('');
    }
    
    createVowelsContainer(words) {
        this.elements.vowelsContainer.innerHTML = '';
        
        // Coletar todas as letras necessárias
        const neededLetters = [];
        words.forEach(word => {
            word.missing.forEach(missing => {
                neededLetters.push(missing.vowel);
            });
        });
        
        // Adicionar algumas letras extras para confundir
        const extraLetters = this.getRandomLetters(neededLetters.length);
        const allLetters = [...neededLetters, ...extraLetters];
        
        // Embaralhar as letras
        this.shuffleArray(allLetters);
        
        // Criar elementos de letras
        allLetters.forEach((letter, index) => {
            const vowelItem = document.createElement('div');
            vowelItem.className = 'vowel-item';
            vowelItem.textContent = letter;
            vowelItem.draggable = true;
            vowelItem.dataset.letter = letter;
            vowelItem.dataset.vowelId = `vowel-${index}`;
            
            // Configurar drag and drop
            this.setupVowelDragAndDrop(vowelItem);
            
            this.elements.vowelsContainer.appendChild(vowelItem);
        });
    }
    
    setupVowelDragAndDrop(vowelItem) {
        vowelItem.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', vowelItem.dataset.letter);
            e.dataTransfer.setData('vowel-id', vowelItem.dataset.vowelId);
            vowelItem.classList.add('dragging');
        });
        
        vowelItem.addEventListener('dragend', () => {
            vowelItem.classList.remove('dragging');
        });
        
        // Configurar drop zones
        this.setupDropZones();
    }
    
    setupDropZones() {
        const dropZones = document.querySelectorAll('.drop-zone');
        
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });
            
            zone.addEventListener('dragleave', () => {
                zone.classList.remove('drag-over');
            });
            
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                
                const letter = e.dataTransfer.getData('text/plain');
                const vowelId = e.dataTransfer.getData('vowel-id');
                const expected = zone.dataset.expected;
                
                // Verificar se a zona já está preenchida
                if (zone.classList.contains('filled')) {
                    this.showFeedback('Esta posição já está preenchida!', 'error');
                    return;
                }
                
                // Preencher a zona
                zone.textContent = letter;
                zone.classList.add('filled');
                zone.dataset.placedLetter = letter;
                
                // Marcar a vogal como usada
                const vowelElement = document.querySelector(`[data-vowel-id="${vowelId}"]`);
                if (vowelElement) {
                    vowelElement.classList.add('used');
                }
                
                // Verificar se está correto
                if (letter === expected) {
                    zone.classList.add('correct');
                    this.playSound('correct');
                    this.createParticleEffect(zone, 'success');
                } else {
                    zone.classList.add('incorrect');
                    this.mistakes++;
                    this.playSound('incorrect');
                    this.createParticleEffect(zone, 'error');
                }
                
                // Verificar se a palavra está completa
                this.checkWordCompletion(zone.dataset.word);
            });
            
            // Permitir remover letras clicando duas vezes
            zone.addEventListener('dblclick', () => {
                if (zone.classList.contains('filled')) {
                    this.removeLetter(zone);
                }
            });
        });
    }
    
    removeLetter(zone) {
        const letter = zone.dataset.placedLetter;
        
        // Limpar a zona
        zone.textContent = '';
        zone.classList.remove('filled', 'correct', 'incorrect');
        delete zone.dataset.placedLetter;
        
        // Reativar a vogal correspondente
        const vowelElements = document.querySelectorAll('.vowel-item');
        vowelElements.forEach(vowel => {
            if (vowel.dataset.letter === letter && vowel.classList.contains('used')) {
                vowel.classList.remove('used');
                return; // Remove apenas a primeira ocorrência
            }
        });
        
        this.showFeedback('Letra removida!', 'info');
    }
    
    checkWordCompletion(wordIndex) {
        const wordCard = document.querySelector(`[data-word-index="${wordIndex}"]`);
        const dropZones = wordCard.querySelectorAll('.drop-zone');
        
        let isComplete = true;
        let isCorrect = true;
        
        dropZones.forEach(zone => {
            if (!zone.classList.contains('filled')) {
                isComplete = false;
            }
            if (!zone.classList.contains('correct')) {
                isCorrect = false;
            }
        });
        
        if (isComplete) {
            if (isCorrect) {
                this.completeWord(wordCard, wordIndex);
            } else {
                this.showFeedback('Palavra incorreta! Tente novamente.', 'error');
            }
        }
    }
    
    completeWord(wordCard, wordIndex) {
        wordCard.classList.add('completed');
        this.completedWords++;
        this.score += this.calculateWordScore();
        
        this.updateUI();
        this.updateProgress();
        
        this.showFeedback('Palavra completa! Parabéns! 🎉', 'success');
        this.createCelebrationEffect(wordCard);
        this.playSound('word-complete');
        
        // Verificar se o nível está completo
        if (this.completedWords >= this.totalWords) {
            setTimeout(() => this.completeLevel(), 1000);
        }
    }
    
    calculateWordScore() {
        let baseScore = 100;
        
        // Bônus por dificuldade
        switch(this.difficulty) {
            case 'easy': baseScore *= 0.8; break;
            case 'hard': baseScore *= 1.5; break;
        }
        
        // Penalidade por erros
        baseScore -= (this.mistakes * 10);
        
        // Bônus por velocidade (menos tempo = mais pontos)
        if (this.timer < 30) baseScore += 50;
        else if (this.timer < 60) baseScore += 25;
        
        return Math.max(baseScore, 10); // Mínimo 10 pontos
    }
    
    checkAnswers() {
        const dropZones = document.querySelectorAll('.drop-zone');
        let allCorrect = true;
        let allFilled = true;
        
        dropZones.forEach(zone => {
            if (!zone.classList.contains('filled')) {
                allFilled = false;
                zone.classList.add('error');
                setTimeout(() => zone.classList.remove('error'), 1000);
            } else if (!zone.classList.contains('correct')) {
                allCorrect = false;
                zone.classList.add('error');
                setTimeout(() => zone.classList.remove('error'), 1000);
            }
        });
        
        if (!allFilled) {
            this.showFeedback('Complete todas as palavras primeiro!', 'warning');
        } else if (!allCorrect) {
            this.showFeedback('Algumas respostas estão incorretas!', 'error');
            this.mistakes++;
        } else {
            this.completeLevel();
        }
    }
    
    completeLevel() {
        this.isGameActive = false;
        this.stopTimer();
        
        const accuracy = Math.round(((this.totalWords * 4 - this.mistakes) / (this.totalWords * 4)) * 100);
        
        this.showResultScreen({
            success: true,
            score: this.score,
            time: this.formatTime(this.timer),
            accuracy: `${accuracy}%`,
            title: 'Parabéns!',
            message: 'Você completou o nível com sucesso!'
        });
        
        this.playSound('level-complete');
        this.createFireworksEffect();
    }
    
    showResultScreen(data) {
        this.elements.resultIcon.className = `result-icon ${data.success ? 'success' : 'error'}`;
        this.elements.resultIcon.innerHTML = `<i class="fas fa-${data.success ? 'trophy' : 'times-circle'}"></i>`;
        
        this.elements.resultTitle.className = `result-title ${data.success ? 'success' : 'error'}`;
        this.elements.resultTitle.textContent = data.title;
        
        this.elements.resultMessage.textContent = data.message;
        
        this.elements.finalScore.textContent = data.score;
        this.elements.finalTime.textContent = data.time;
        this.elements.finalAccuracy.textContent = data.accuracy;
        
        // Mostrar/ocultar botão de próximo nível
        if (data.success && this.currentLevel < GAME_DATA.levels.length) {
            this.elements.nextLevelBtn.style.display = 'inline-flex';
        } else {
            this.elements.nextLevelBtn.style.display = 'none';
        }
        
        this.showScreen('resultScreen');
    }
    
    nextLevel() {
        if (this.currentLevel < GAME_DATA.levels.length) {
            this.currentLevel++;
            this.startGame();
        } else {
            this.showFeedback('Parabéns! Você completou todos os níveis!', 'success');
            this.goToMenu();
        }
    }
    
    replayLevel() {
        this.startGame();
    }
    
    resetLevel() {
        // Limpar todas as zonas de drop
        const dropZones = document.querySelectorAll('.drop-zone');
        dropZones.forEach(zone => {
            if (zone.classList.contains('filled')) {
                this.removeLetter(zone);
            }
        });
        
        // Reativar todas as vogais
        const vowelItems = document.querySelectorAll('.vowel-item');
        vowelItems.forEach(vowel => {
            vowel.classList.remove('used');
        });
        
        this.completedWords = 0;
        this.mistakes = 0;
        this.updateUI();
        this.updateProgress();
        
        this.showFeedback('Nível reiniciado!', 'info');
    }
    
    goToMenu() {
        this.isGameActive = false;
        this.stopTimer();
        this.currentLevel = 1;
        this.score = 0;
        this.showScreen('instructions');
        this.updateUI();
    }
    
    showHint() {
        const currentLevelData = GAME_DATA.levels.find(level => level.id === this.currentLevel);
        if (!currentLevelData) return;
        
        // Encontrar a primeira palavra incompleta
        const incompleteWordIndex = this.findIncompleteWord();
        if (incompleteWordIndex === -1) {
            this.showFeedback('Todas as palavras estão completas!', 'info');
            return;
        }
        
        const word = currentLevelData.words[incompleteWordIndex];
        this.elements.hintText.textContent = word.hint;
        this.elements.hintImage.innerHTML = `<img src="${word.image}" alt="Dica">`;
        
        this.openModal('hintModal');
        this.hintsUsed++;
        this.score = Math.max(0, this.score - 25); // Penalidade por usar dica
        this.updateUI();
        
        this.playSound('hint');
    }
    
    findIncompleteWord() {
        const wordCards = document.querySelectorAll('.word-card');
        for (let i = 0; i < wordCards.length; i++) {
            if (!wordCards[i].classList.contains('completed')) {
                return i;
            }
        }
        return -1;
    }
    
    // ===== UTILITÁRIOS =====
    
    showScreen(screenName) {
        // Ocultar todas as telas
        this.elements.instructions.style.display = 'none';
        this.elements.gameArea.style.display = 'none';
        this.elements.resultScreen.style.display = 'none';
        
        // Mostrar tela solicitada
        if (this.elements[screenName]) {
            this.elements[screenName].style.display = 'block';
        }
    }
    
    updateUI() {
        if (this.elements.scoreValue) this.elements.scoreValue.textContent = this.score;
        if (this.elements.levelValue) this.elements.levelValue.textContent = this.currentLevel;
        if (this.elements.timerValue) this.elements.timerValue.textContent = this.formatTime(this.timer);
    }
    
    updateProgress() {
        const progress = this.totalWords > 0 ? (this.completedWords / this.totalWords) * 100 : 0;
        if (this.elements.progressFill) {
            this.elements.progressFill.style.width = `${progress}%`;
        }
    }
    
    startTimer() {
        this.stopTimer();
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateUI();
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    
    getRandomLetters(count) {
        const allLetters = [...GAME_DATA.vowels, ...GAME_DATA.consonants];
        const randomLetters = [];
        
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * allLetters.length);
            randomLetters.push(allLetters[randomIndex]);
        }
        
        return randomLetters;
    }
    
    // ===== FEEDBACK E EFEITOS VISUAIS =====
    
    showFeedback(message, type = 'info') {
        const feedback = document.createElement('div');
        feedback.className = `feedback-message ${type}`;
        feedback.textContent = message;
        
        this.elements.feedbackArea.appendChild(feedback);
        
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 3000);
    }
    
    createParticleEffect(element, type) {
        const colors = {
            success: ['#2ecc71', '#27ae60', '#00ff88'],
            error: ['#e74c3c', '#c0392b', '#ff4757'],
            info: ['#3498db', '#2980b9', '#00a8ff']
        };
        
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                background: ${colors[type][Math.floor(Math.random() * colors[type].length)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${centerX}px;
                top: ${centerY}px;
            `;
            
            document.body.appendChild(particle);
            
            const angle = (Math.PI * 2 * i) / 10;
            const velocity = 50 + Math.random() * 50;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            let x = 0, y = 0, opacity = 1;
            
            const animate = () => {
                x += vx * 0.02;
                y += vy * 0.02 + 0.5; // Gravidade
                opacity -= 0.02;
                
                particle.style.transform = `translate(${x}px, ${y}px)`;
                particle.style.opacity = opacity;
                
                if (opacity > 0) {
                    requestAnimationFrame(animate);
                } else {
                    document.body.removeChild(particle);
                }
            };
            
            animate();
        }
    }
    
    createCelebrationEffect(element) {
        const rect = element.getBoundingClientRect();
        
        // Criar efeito de brilho
        element.style.animation = 'glow 1s ease-in-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 1000);
        
        // Criar confetes
        this.createParticleEffect(element, 'success');
    }
    
    createFireworksEffect() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight * 0.5;
                
                for (let j = 0; j < 20; j++) {
                    const particle = document.createElement('div');
                    particle.style.cssText = `
                        position: fixed;
                        width: 8px;
                        height: 8px;
                        background: ${colors[Math.floor(Math.random() * colors.length)]};
                        border-radius: 50%;
                        pointer-events: none;
                        z-index: 1000;
                        left: ${x}px;
                        top: ${y}px;
                    `;
                    
                    document.body.appendChild(particle);
                    
                    const angle = (Math.PI * 2 * j) / 20;
                    const velocity = 100 + Math.random() * 100;
                    const vx = Math.cos(angle) * velocity;
                    const vy = Math.sin(angle) * velocity;
                    
                    let px = 0, py = 0, opacity = 1;
                    
                    const animate = () => {
                        px += vx * 0.01;
                        py += vy * 0.01 + 0.3;
                        opacity -= 0.015;
                        
                        particle.style.transform = `translate(${px}px, ${py}px)`;
                        particle.style.opacity = opacity;
                        
                        if (opacity > 0) {
                            requestAnimationFrame(animate);
                        } else {
                            document.body.removeChild(particle);
                        }
                    };
                    
                    animate();
                }
            }, i * 200);
        }
    }
    
    // ===== SISTEMA DE SOM =====
    
    playSound(type) {
        if (!this.soundEnabled) return;
        
        // Criar contexto de áudio se não existir
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const frequencies = {
            correct: [523.25, 659.25, 783.99], // Dó, Mi, Sol
            incorrect: [220, 196], // Lá, Sol
            'word-complete': [523.25, 659.25, 783.99, 1046.50], // Dó, Mi, Sol, Dó
            'level-complete': [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.50],
            hint: [440, 554.37], // Lá, Dó#
            info: [440] // Lá
        };
        
        const freq = frequencies[type] || [440];
        this.playTone(freq);
    }
    
    playTone(frequencies) {
        if (!this.audioContext) return;
        
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
                
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.3);
            }, index * 100);
        });
    }
    
    // ===== SISTEMA DE MODAIS =====
    
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    }
    
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }
    
    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.remove('active');
        });
    }
    
    openSettings() {
        this.openModal('settingsModal');
    }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    window.educationalGame = new EducationalGame();
    console.log('🎮 Jogo educativo pronto para usar!');
});

// ===== TRATAMENTO DE ERROS =====
window.addEventListener('error', (event) => {
    console.error('Erro no jogo:', event.error);
});

// ===== EXPORTAR PARA USO GLOBAL =====
window.EducationalGame = EducationalGame;