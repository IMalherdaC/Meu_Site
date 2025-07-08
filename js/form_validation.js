// ===== SISTEMA DE VALIDAÇÃO DE FORMULÁRIO =====

class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.fields = {};
        this.errors = {};
        this.isSubmitting = false;
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        // Mapear todos os campos do formulário
        this.mapFormFields();
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Configurar validação em tempo real
        this.setupRealTimeValidation();
        
        console.log('✅ Validador de formulário inicializado');
    }
    
    mapFormFields() {
        // Mapear campos de input
        const inputs = this.form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            this.fields[input.name] = {
                element: input,
                errorElement: document.getElementById(`${input.name}Error`),
                rules: this.getValidationRules(input),
                isValid: false
            };
        });
    }
    
    getValidationRules(input) {
        const rules = [];
        
        // Regras baseadas em atributos HTML
        if (input.hasAttribute('required')) {
            rules.push('required');
        }
        
        // Regras baseadas no tipo de input
        switch (input.type) {
            case 'email':
                rules.push('email');
                break;
            case 'tel':
                rules.push('phone');
                break;
            case 'number':
                rules.push('number');
                break;
            case 'date':
                rules.push('date');
                break;
        }
        
        // Regras baseadas no nome do campo
        switch (input.name) {
            case 'name':
                rules.push('name');
                break;
            case 'age':
                rules.push('age');
                break;
            case 'message':
                rules.push('message');
                break;
            case 'contactType':
                rules.push('radio');
                break;
        }
        
        return rules;
    }
    
    setupEventListeners() {
        // Prevenir envio padrão do formulário
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
        
        // Limpar erros quando o usuário começar a digitar
        Object.values(this.fields).forEach(field => {
            if (field.element.type === 'radio') {
                // Para radio buttons, escutar mudanças em todos os elementos do grupo
                const radioGroup = this.form.querySelectorAll(`input[name="${field.element.name}"]`);
                radioGroup.forEach(radio => {
                    radio.addEventListener('change', () => {
                        this.clearFieldError(field.element.name);
                        this.validateField(field.element.name);
                    });
                });
            } else {
                field.element.addEventListener('input', () => {
                    this.clearFieldError(field.element.name);
                });
                
                field.element.addEventListener('blur', () => {
                    this.validateField(field.element.name);
                });
            }
        });
    }
    
    setupRealTimeValidation() {
        // Validação em tempo real para campos específicos
        Object.entries(this.fields).forEach(([fieldName, field]) => {
            if (['email', 'phone', 'age'].includes(fieldName)) {
                field.element.addEventListener('input', 
                    this.debounce(() => this.validateField(fieldName), 500)
                );
            }
        });
    }
    
    validateField(fieldName) {
        const field = this.fields[fieldName];
        if (!field) return true;
        
        const value = this.getFieldValue(fieldName);
        const rules = field.rules;
        
        // Limpar erro anterior
        this.clearFieldError(fieldName);
        
        // Aplicar regras de validação
        for (const rule of rules) {
            const result = this.applyValidationRule(rule, value, fieldName);
            if (!result.isValid) {
                this.showFieldError(fieldName, result.message);
                field.isValid = false;
                return false;
            }
        }
        
        // Campo válido
        field.isValid = true;
        this.showFieldSuccess(fieldName);
        return true;
    }
    
    getFieldValue(fieldName) {
        const field = this.fields[fieldName];
        
        if (field.element.type === 'radio') {
            const checked = this.form.querySelector(`input[name="${fieldName}"]:checked`);
            return checked ? checked.value : '';
        }
        
        if (field.element.type === 'checkbox') {
            const checked = this.form.querySelectorAll(`input[name="${fieldName}"]:checked`);
            return Array.from(checked).map(cb => cb.value);
        }
        
        return field.element.value.trim();
    }
    
    applyValidationRule(rule, value, fieldName) {
        switch (rule) {
            case 'required':
                return this.validateRequired(value);
                
            case 'email':
                return this.validateEmail(value);
                
            case 'phone':
                return this.validatePhone(value);
                
            case 'name':
                return this.validateName(value);
                
            case 'age':
                return this.validateAge(value);
                
            case 'date':
                return this.validateDate(value);
                
            case 'number':
                return this.validateNumber(value);
                
            case 'message':
                return this.validateMessage(value);
                
            case 'radio':
                return this.validateRadio(fieldName);
                
            default:
                return { isValid: true };
        }
    }
    
    // ===== REGRAS DE VALIDAÇÃO =====
    
    validateRequired(value) {
        if (!value || value.length === 0) {
            return { isValid: false, message: 'Este campo é obrigatório.' };
        }
        return { isValid: true };
    }
    
    validateEmail(value) {
        if (!value) return { isValid: true }; // Não obrigatório se vazio
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return { isValid: false, message: 'Por favor, insira um email válido.' };
        }
        return { isValid: true };
    }
    
    validatePhone(value) {
        if (!value) return { isValid: true }; // Não obrigatório se vazio
        
        // Remover caracteres não numéricos para validação
        const cleanPhone = value.replace(/\D/g, '');
        if (cleanPhone.length < 10 || cleanPhone.length > 11) {
            return { isValid: false, message: 'Por favor, insira um telefone válido.' };
        }
        return { isValid: true };
    }
    
    validateName(value) {
        if (!value) return { isValid: false, message: 'Nome é obrigatório.' };
        
        if (value.length < 2) {
            return { isValid: false, message: 'Nome deve ter pelo menos 2 caracteres.' };
        }
        
        if (value.length > 100) {
            return { isValid: false, message: 'Nome deve ter no máximo 100 caracteres.' };
        }
        
        // Verificar se contém apenas letras e espaços
        const nameRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
        if (!nameRegex.test(value)) {
            return { isValid: false, message: 'Nome deve conter apenas letras e espaços.' };
        }
        
        return { isValid: true };
    }
    
    validateAge(value) {
        if (!value) return { isValid: true }; // Não obrigatório se vazio
        
        const age = parseInt(value);
        if (isNaN(age) || age < 1 || age > 120) {
            return { isValid: false, message: 'Por favor, insira uma idade válida (1-120).' };
        }
        return { isValid: true };
    }
    
    validateDate(value) {
        if (!value) return { isValid: true }; // Não obrigatório se vazio
        
        const date = new Date(value);
        const today = new Date();
        
        if (isNaN(date.getTime())) {
            return { isValid: false, message: 'Por favor, insira uma data válida.' };
        }
        
        // Verificar se a data não é no futuro (para data de nascimento)
        if (date > today) {
            return { isValid: false, message: 'Data de nascimento não pode ser no futuro.' };
        }
        
        // Verificar se a data não é muito antiga (mais de 120 anos)
        const minDate = new Date();
        minDate.setFullYear(today.getFullYear() - 120);
        if (date < minDate) {
            return { isValid: false, message: 'Data de nascimento inválida.' };
        }
        
        return { isValid: true };
    }
    
    validateNumber(value) {
        if (!value) return { isValid: true }; // Não obrigatório se vazio
        
        if (isNaN(value)) {
            return { isValid: false, message: 'Por favor, insira um número válido.' };
        }
        return { isValid: true };
    }
    
    validateMessage(value) {
        if (!value) return { isValid: false, message: 'Mensagem é obrigatória.' };
        
        if (value.length < 10) {
            return { isValid: false, message: 'Mensagem deve ter pelo menos 10 caracteres.' };
        }
        
        if (value.length > 1000) {
            return { isValid: false, message: 'Mensagem deve ter no máximo 1000 caracteres.' };
        }
        
        return { isValid: true };
    }
    
    validateRadio(fieldName) {
        const checked = this.form.querySelector(`input[name="${fieldName}"]:checked`);
        if (!checked) {
            return { isValid: false, message: 'Por favor, selecione uma opção.' };
        }
        return { isValid: true };
    }
    
    // ===== INTERFACE DE USUÁRIO =====
    
    showFieldError(fieldName, message) {
        const field = this.fields[fieldName];
        if (!field) return;
        
        // Adicionar classe de erro ao campo
        field.element.classList.add('error');
        field.element.parentElement.classList.add('error');
        
        // Mostrar mensagem de erro
        if (field.errorElement) {
            field.errorElement.textContent = message;
            field.errorElement.style.display = 'block';
        }
        
        // Adicionar ícone de erro (opcional)
        this.addFieldIcon(fieldName, 'error');
    }
    
    showFieldSuccess(fieldName) {
        const field = this.fields[fieldName];
        if (!field) return;
        
        // Adicionar classe de sucesso ao campo
        field.element.classList.remove('error');
        field.element.classList.add('success');
        field.element.parentElement.classList.remove('error');
        field.element.parentElement.classList.add('success');
        
        // Adicionar ícone de sucesso (opcional)
        this.addFieldIcon(fieldName, 'success');
    }
    
    clearFieldError(fieldName) {
        const field = this.fields[fieldName];
        if (!field) return;
        
        // Remover classes de erro e sucesso
        field.element.classList.remove('error', 'success');
        field.element.parentElement.classList.remove('error', 'success');
        
        // Ocultar mensagem de erro
        if (field.errorElement) {
            field.errorElement.textContent = '';
            field.errorElement.style.display = 'none';
        }
        
        // Remover ícone
        this.removeFieldIcon(fieldName);
    }
    
    addFieldIcon(fieldName, type) {
        const field = this.fields[fieldName];
        if (!field) return;
        
        // Remover ícone existente
        this.removeFieldIcon(fieldName);
        
        // Criar novo ícone
        const icon = document.createElement('i');
        icon.className = `field-icon fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`;
        icon.style.cssText = `
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: ${type === 'success' ? '#10b981' : '#ef4444'};
            pointer-events: none;
        `;
        
        // Adicionar ícone ao container do campo
        const container = field.element.parentElement;
        container.style.position = 'relative';
        container.appendChild(icon);
    }
    
    removeFieldIcon(fieldName) {
        const field = this.fields[fieldName];
        if (!field) return;
        
        const existingIcon = field.element.parentElement.querySelector('.field-icon');
        if (existingIcon) {
            existingIcon.remove();
        }
    }
    
    // ===== ENVIO DO FORMULÁRIO =====
    
    async handleSubmit() {
        if (this.isSubmitting) return;
        
        // Validar todos os campos
        const isFormValid = this.validateAllFields();
        
        if (!isFormValid) {
            this.showFormError('Por favor, corrija os erros antes de enviar.');
            this.focusFirstError();
            return;
        }
        
        // Mostrar estado de carregamento
        this.setSubmittingState(true);
        
        try {
            // Simular envio (substituir por lógica real)
            await this.submitForm();
            
            // Sucesso
            this.showFormSuccess('Mensagem enviada com sucesso! Entrarei em contato em breve.');
            this.resetForm();
            
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            this.showFormError('Erro ao enviar mensagem. Tente novamente.');
        } finally {
            this.setSubmittingState(false);
        }
    }
    
    validateAllFields() {
        let isValid = true;
        
        Object.keys(this.fields).forEach(fieldName => {
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    async submitForm() {
        // Simular delay de rede
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Aqui você implementaria a lógica real de envio
        // Por exemplo, enviar para um endpoint ou serviço de email
        
        const formData = this.getFormData();
        console.log('Dados do formulário:', formData);
        
        // Exemplo de envio para um endpoint
        /*
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            throw new Error('Erro no servidor');
        }
        */
    }
    
    getFormData() {
        const data = {};
        
        Object.entries(this.fields).forEach(([fieldName, field]) => {
            data[fieldName] = this.getFieldValue(fieldName);
        });
        
        return data;
    }
    
    setSubmittingState(isSubmitting) {
        this.isSubmitting = isSubmitting;
        const submitButton = this.form.querySelector('.submit-btn');
        
        if (submitButton) {
            if (isSubmitting) {
                submitButton.disabled = true;
                submitButton.classList.add('loading');
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            } else {
                submitButton.disabled = false;
                submitButton.classList.remove('loading');
                submitButton.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar Mensagem';
            }
        }
    }
    
    showFormSuccess(message) {
        // Usar sistema de notificações se disponível
        if (window.AppUtils && window.AppUtils.showNotification) {
            window.AppUtils.showNotification(message, 'success', 5000);
        } else {
            alert(message);
        }
    }
    
    showFormError(message) {
        // Usar sistema de notificações se disponível
        if (window.AppUtils && window.AppUtils.showNotification) {
            window.AppUtils.showNotification(message, 'error', 5000);
        } else {
            alert(message);
        }
    }
    
    focusFirstError() {
        const firstErrorField = Object.values(this.fields).find(field => !field.isValid);
        if (firstErrorField) {
            firstErrorField.element.focus();
            firstErrorField.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    resetForm() {
        this.form.reset();
        
        // Limpar todos os estados de validação
        Object.keys(this.fields).forEach(fieldName => {
            this.clearFieldError(fieldName);
            this.fields[fieldName].isValid = false;
        });
    }
    
    // ===== UTILITÁRIOS =====
    
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
}

// ===== MÁSCARAS DE INPUT =====
class InputMasks {
    constructor() {
        this.init();
    }
    
    init() {
        // Aplicar máscara de telefone
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach(input => {
            input.addEventListener('input', this.phoneMask);
        });
        
        // Aplicar máscara de idade (apenas números)
        const ageInputs = document.querySelectorAll('input[name="age"]');
        ageInputs.forEach(input => {
            input.addEventListener('input', this.numberMask);
        });
    }
    
    phoneMask(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length <= 11) {
            if (value.length <= 10) {
                value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            } else {
                value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            }
        }
        
        e.target.value = value;
    }
    
    numberMask(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
    }
}

// ===== CONTADOR DE CARACTERES =====
class CharacterCounter {
    constructor() {
        this.init();
    }
    
    init() {
        const textareas = document.querySelectorAll('textarea');
        textareas.forEach(textarea => {
            this.addCounter(textarea);
        });
    }
    
    addCounter(textarea) {
        const maxLength = 1000; // Limite máximo
        
        // Criar elemento contador
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 0.875rem;
            color: #666;
            margin-top: 4px;
        `;
        
        // Inserir contador após o textarea
        textarea.parentNode.insertBefore(counter, textarea.nextSibling);
        
        // Atualizar contador
        const updateCounter = () => {
            const currentLength = textarea.value.length;
            counter.textContent = `${currentLength}/${maxLength}`;
            
            if (currentLength > maxLength * 0.9) {
                counter.style.color = '#ef4444';
            } else if (currentLength > maxLength * 0.7) {
                counter.style.color = '#f59e0b';
            } else {
                counter.style.color = '#666';
            }
        };
        
        textarea.addEventListener('input', updateCounter);
        updateCounter(); // Inicializar
    }
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar validador de formulário
    window.formValidator = new FormValidator('contactForm');
    
    // Inicializar máscaras de input
    new InputMasks();
    
    // Inicializar contador de caracteres
    new CharacterCounter();
    
    console.log('✅ Sistema de validação de formulário inicializado');
});

// ===== EXPORTAR PARA USO GLOBAL =====
window.FormValidator = FormValidator;
