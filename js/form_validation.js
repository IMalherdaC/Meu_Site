// ===== VALIDAÇÃO DE FORMULÁRIO FUNCIONAL =====
// Arquivo criado durante o aprendizado de JavaScript - 1º período ADS
// Sistema de validação completo - implementação própria

console.log('📝 Sistema de validação de formulário carregado');

// Classe para gerenciar validação do formulário
class FormValidator {
    constructor() {
        // Elemento do formulário - conceito de DOM aprendido
        this.form = document.getElementById('contactForm');
        
        // Campos do formulário - usando seletores aprendidos
        this.fields = {
            name: document.getElementById('name'),
            email: document.getElementById('email'),
            phone: document.getElementById('phone'),
            userRole: document.getElementById('userRole'),
            age: document.getElementById('age'),
            contactType: document.querySelectorAll('input[name="contactType"]'),
            interests: document.querySelectorAll('input[name="interests"]'),
            howFound: document.getElementById('howFound'),
            message: document.getElementById('message')
        };
        
        // Elementos de erro - para mostrar mensagens
        this.errorElements = {
            name: document.getElementById('nameError'),
            email: document.getElementById('emailError'),
            phone: document.getElementById('phoneError'),
            userRole: document.getElementById('userRoleError'),
            age: document.getElementById('ageError'),
            contactType: document.getElementById('contactTypeError'),
            message: document.getElementById('messageError')
        };
        
        // Estado do formulário
        this.isSubmitting = false;
        
        // Inicializar validação
        this.init();
    }
    
    // Método de inicialização
    init() {
        console.log('📝 Inicializando validação de formulário...');
        
        if (!this.form) {
            console.error('❌ Formulário não encontrado!');
            return;
        }
        
        // Configurar eventos
        this.setupEventListeners();
        
        // Configurar validação em tempo real
        this.setupRealTimeValidation();
        
        console.log('✅ Validação de formulário inicializada!');
    }
    
    // Configurar eventos do formulário
    setupEventListeners() {
        // Evento de envio do formulário
        this.form.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevenir envio padrão
            this.handleSubmit();
        });
        
        // Eventos de foco para limpar erros
        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName];
            
            if (field && field.length) {
                // Para radio buttons e checkboxes
                field.forEach(input => {
                    input.addEventListener('change', () => {
                        this.clearError(fieldName);
                    });
                });
            } else if (field) {
                // Para inputs normais
                field.addEventListener('focus', () => {
                    this.clearError(fieldName);
                });
                
                field.addEventListener('input', () => {
                    this.clearError(fieldName);
                });
            }
        });
    }
    
    // Configurar validação em tempo real
    setupRealTimeValidation() {
        // Validação do email em tempo real
        if (this.fields.email) {
            this.fields.email.addEventListener('blur', () => {
                this.validateEmail();
            });
        }
        
        // Validação do telefone em tempo real
        if (this.fields.phone) {
            this.fields.phone.addEventListener('input', (e) => {
                this.formatPhone(e.target);
            });
        }
        
        // Validação da idade
        if (this.fields.age) {
            this.fields.age.addEventListener('input', () => {
                this.validateAge();
            });
        }
    }
    
    // Processar envio do formulário
    async handleSubmit() {
        if (this.isSubmitting) return;
        
        console.log('📝 Processando envio do formulário...');
        
        // Validar todos os campos
        const isValid = this.validateAllFields();
        
        if (!isValid) {
            this.showNotification('❌ Por favor, corrija os erros no formulário', 'error');
            window.playErrorSound && window.playErrorSound();
            return;
        }
        
        // Mostrar estado de carregamento
        this.setSubmittingState(true);
        
        try {
            // Simular envio do formulário (implementação para estudante)
            await this.submitForm();
            
            // Sucesso
            this.handleSubmitSuccess();
            
        } catch (error) {
            console.error('❌ Erro ao enviar formulário:', error);
            this.handleSubmitError(error);
        } finally {
            this.setSubmittingState(false);
        }
    }
    
    // Validar todos os campos
    validateAllFields() {
        let isValid = true;
        
        // Validar nome
        if (!this.validateName()) isValid = false;
        
        // Validar email
        if (!this.validateEmail()) isValid = false;
        
        // Validar função/cargo
        if (!this.validateUserRole()) isValid = false;
        
        // Validar tipo de contato
        if (!this.validateContactType()) isValid = false;
        
        // Validar mensagem
        if (!this.validateMessage()) isValid = false;
        
        // Validar idade (se preenchida)
        if (this.fields.age.value) {
            if (!this.validateAge()) isValid = false;
        }
        
        return isValid;
    }
    
    // Validar nome
    validateName() {
        const name = this.fields.name.value.trim();
        
        if (!name) {
            this.showError('name', 'Nome é obrigatório');
            return false;
        }
        
        if (name.length < 2) {
            this.showError('name', 'Nome deve ter pelo menos 2 caracteres');
            return false;
        }
        
        if (name.length > 100) {
            this.showError('name', 'Nome muito longo (máximo 100 caracteres)');
            return false;
        }
        
        // Verificar se contém apenas letras e espaços
        const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
        if (!nameRegex.test(name)) {
            this.showError('name', 'Nome deve conter apenas letras');
            return false;
        }
        
        this.showSuccess('name');
        return true;
    }
    
    // Validar email
    validateEmail() {
        const email = this.fields.email.value.trim();
        
        if (!email) {
            this.showError('email', 'Email é obrigatório');
            return false;
        }
        
        // Regex para validação de email - conceito aprendido
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.showError('email', 'Email inválido');
            return false;
        }
        
        this.showSuccess('email');
        return true;
    }
    
    // Validar função/cargo
    validateUserRole() {
        const userRole = this.fields.userRole.value.trim();
        
        if (!userRole) {
            this.showError('userRole', 'Função é obrigatória');
            return false;
        }
        
        if (userRole.length < 2) {
            this.showError('userRole', 'Função deve ter pelo menos 2 caracteres');
            return false;
        }
        
        this.showSuccess('userRole');
        return true;
    }
    
    // Validar idade
    validateAge() {
        const age = parseInt(this.fields.age.value);
        
        if (this.fields.age.value && (isNaN(age) || age < 1 || age > 120)) {
            this.showError('age', 'Idade deve estar entre 1 e 120 anos');
            return false;
        }
        
        if (this.fields.age.value) {
            this.showSuccess('age');
        }
        return true;
    }
    
    // Validar tipo de contato
    validateContactType() {
        const contactTypeSelected = Array.from(this.fields.contactType).some(radio => radio.checked);
        
        if (!contactTypeSelected) {
            this.showError('contactType', 'Selecione um tipo de contato');
            return false;
        }
        
        return true;
    }
    
    // Validar mensagem
    validateMessage() {
        const message = this.fields.message.value.trim();
        
        if (!message) {
            this.showError('message', 'Mensagem é obrigatória');
            return false;
        }
        
        if (message.length < 10) {
            this.showError('message', 'Mensagem deve ter pelo menos 10 caracteres');
            return false;
        }
        
        if (message.length > 1000) {
            this.showError('message', 'Mensagem muito longa (máximo 1000 caracteres)');
            return false;
        }
        
        this.showSuccess('message');
        return true;
    }
    
    // Formatar telefone automaticamente
    formatPhone(input) {
        let value = input.value.replace(/\D/g, ''); // Remover não-dígitos
        
        // Aplicar máscara de telefone brasileiro
        if (value.length <= 11) {
            if (value.length <= 2) {
                value = value.replace(/(\d{0,2})/, '($1');
            } else if (value.length <= 7) {
                value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
            } else {
                value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
            }
        }
        
        input.value = value;
    }
    
    // Mostrar erro em campo específico
    showError(fieldName, message) {
        const field = this.fields[fieldName];
        const errorElement = this.errorElements[fieldName];
        
        // Adicionar classe de erro ao campo
        if (field && field.length) {
            // Para radio buttons
            field.forEach(input => {
                input.closest('.form-group').classList.add('error');
            });
        } else if (field) {
            field.classList.add('error');
            field.classList.remove('success');
        }
        
        // Mostrar mensagem de erro
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    // Mostrar sucesso em campo específico
    showSuccess(fieldName) {
        const field = this.fields[fieldName];
        const errorElement = this.errorElements[fieldName];
        
        // Adicionar classe de sucesso ao campo
        if (field && !field.length) {
            field.classList.add('success');
            field.classList.remove('error');
        }
        
        // Esconder mensagem de erro
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
    
    // Limpar erro de campo específico
    clearError(fieldName) {
        const field = this.fields[fieldName];
        const errorElement = this.errorElements[fieldName];
        
        // Remover classes de erro
        if (field && field.length) {
            field.forEach(input => {
                input.closest('.form-group').classList.remove('error');
            });
        } else if (field) {
            field.classList.remove('error');
        }
        
        // Esconder mensagem de erro
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
    
    // Definir estado de envio
    setSubmittingState(isSubmitting) {
        this.isSubmitting = isSubmitting;
        const submitBtn = this.form.querySelector('.submit-btn');
        
        if (submitBtn) {
            if (isSubmitting) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                submitBtn.classList.add('loading');
            } else {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensagem';
                submitBtn.classList.remove('loading');
            }
        }
    }
    
    // Simular envio do formulário
    async submitForm() {
        // Simular delay de envio
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Coletar dados do formulário
        const formData = this.collectFormData();
        
        console.log('📝 Dados do formulário:', formData);
        
        // Aqui seria feita a integração com um serviço real
        // Por enquanto, simular sucesso
        return { success: true, message: 'Formulário enviado com sucesso!' };
    }
    
    // Coletar dados do formulário
    collectFormData() {
        const data = {
            name: this.fields.name.value.trim(),
            email: this.fields.email.value.trim(),
            phone: this.fields.phone.value.trim(),
            userRole: this.fields.userRole.value.trim(),
            age: this.fields.age.value ? parseInt(this.fields.age.value) : null,
            contactType: Array.from(this.fields.contactType).find(radio => radio.checked)?.value,
            interests: Array.from(this.fields.interests).filter(checkbox => checkbox.checked).map(cb => cb.value),
            howFound: this.fields.howFound.value,
            message: this.fields.message.value.trim(),
            timestamp: new Date().toISOString()
        };
        
        return data;
    }
    
    // Processar sucesso do envio
    handleSubmitSuccess() {
        console.log('✅ Formulário enviado com sucesso!');
        
        // Tocar som de sucesso
        window.playSuccessSound && window.playSuccessSound();
        
        // Mostrar notificação de sucesso
        this.showNotification('✅ Mensagem enviada com sucesso! Obrigado pelo contato.', 'success', 5000);
        
        // Limpar formulário
        this.resetForm();
        
        // Scroll para o topo
        this.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Processar erro do envio
    handleSubmitError(error) {
        console.error('❌ Erro ao enviar formulário:', error);
        
        // Tocar som de erro
        window.playErrorSound && window.playErrorSound();
        
        // Mostrar notificação de erro
        this.showNotification('❌ Erro ao enviar mensagem. Tente novamente.', 'error', 5000);
    }
    
    // Resetar formulário
    resetForm() {
        // Limpar campos
        this.form.reset();
        
        // Remover classes de erro e sucesso
        Object.keys(this.fields).forEach(fieldName => {
            this.clearError(fieldName);
            const field = this.fields[fieldName];
            if (field && !field.length) {
                field.classList.remove('success', 'error');
            }
        });
        
        console.log('📝 Formulário resetado');
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
// Funções auxiliares para melhorar a experiência do usuário

// Contador de caracteres para textarea
function setupCharacterCounter() {
    const messageField = document.getElementById('message');
    if (!messageField) return;
    
    // Criar contador
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.style.cssText = `
        font-size: 0.7rem;
        color: var(--color-text-muted);
        text-align: right;
        margin-top: 0.2rem;
        font-family: var(--font-mono);
    `;
    
    // Inserir após o campo
    messageField.parentNode.insertBefore(counter, messageField.nextSibling);
    
    // Atualizar contador
    function updateCounter() {
        const length = messageField.value.length;
        const maxLength = 1000;
        counter.textContent = `${length}/${maxLength} caracteres`;
        
        if (length > maxLength * 0.9) {
            counter.style.color = 'var(--neon-orange)';
        } else if (length > maxLength) {
            counter.style.color = 'var(--neon-pink)';
        } else {
            counter.style.color = 'var(--color-text-muted)';
        }
    }
    
    messageField.addEventListener('input', updateCounter);
    updateCounter(); // Inicializar
}

// Auto-save do formulário (salvar no localStorage)
function setupAutoSave() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const STORAGE_KEY = 'portfolio_form_data';
    
    // Carregar dados salvos
    function loadSavedData() {
        try {
            const savedData = localStorage.getItem(STORAGE_KEY);
            if (savedData) {
                const data = JSON.parse(savedData);
                
                // Preencher campos
                Object.keys(data).forEach(key => {
                    const field = document.getElementById(key);
                    if (field && data[key]) {
                        if (field.type === 'radio') {
                            const radio = document.querySelector(`input[name="${key}"][value="${data[key]}"]`);
                            if (radio) radio.checked = true;
                        } else if (field.type === 'checkbox') {
                            if (Array.isArray(data[key])) {
                                data[key].forEach(value => {
                                    const checkbox = document.querySelector(`input[name="${key}"][value="${value}"]`);
                                    if (checkbox) checkbox.checked = true;
                                });
                            }
                        } else {
                            field.value = data[key];
                        }
                    }
                });
                
                console.log('📝 Dados do formulário restaurados');
            }
        } catch (error) {
            console.error('❌ Erro ao carregar dados salvos:', error);
        }
    }
    
    // Salvar dados
    function saveData() {
        try {
            const formData = new FormData(form);
            const data = {};
            
            for (let [key, value] of formData.entries()) {
                if (data[key]) {
                    // Se já existe, transformar em array
                    if (!Array.isArray(data[key])) {
                        data[key] = [data[key]];
                    }
                    data[key].push(value);
                } else {
                    data[key] = value;
                }
            }
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('❌ Erro ao salvar dados:', error);
        }
    }
    
    // Limpar dados salvos
    function clearSavedData() {
        localStorage.removeItem(STORAGE_KEY);
    }
    
    // Configurar eventos
    form.addEventListener('input', debounce(saveData, 1000));
    form.addEventListener('submit', clearSavedData);
    
    // Carregar dados ao inicializar
    loadSavedData();
}

// Função debounce para otimizar performance
function debounce(func, wait) {
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

// ===== INICIALIZAÇÃO =====
let formValidator;

// Inicializar quando o DOM estiver pronto
function initFormValidation() {
    try {
        formValidator = new FormValidator();
        setupCharacterCounter();
        setupAutoSave();
        
        console.log('📝 Sistema de validação de formulário inicializado!');
        
    } catch (error) {
        console.error('❌ Erro ao inicializar validação de formulário:', error);
    }
}

// Inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFormValidation);
} else {
    initFormValidation();
}

console.log('📝 Validação de formulário carregada com sucesso!');

