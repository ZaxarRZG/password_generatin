document.addEventListener('DOMContentLoaded', function() {
    // Элементы генератора
    const lengthSlider = document.getElementById('length-slider');
    const lengthValue = document.getElementById('length-value');
    const numbersCheckbox = document.getElementById('numbers');
    const lowercaseCheckbox = document.getElementById('lowercase');
    const uppercaseCheckbox = document.getElementById('uppercase');
    const specialCheckbox = document.getElementById('special');
    const multiplePasswordsCheckbox = document.getElementById('multiple-passwords');
    const multiplePasswordsSection = document.getElementById('multiple-passwords-section');
    const passwordsCountInput = document.getElementById('passwords-count');
    const saveBtn = document.getElementById('save-btn');
    const generateBtn = document.getElementById('generate-btn');
    const generatedPassword = document.getElementById('generated-password');
    const copyBtn = document.getElementById('copy-btn');
    const uppercaseItem = document.getElementById('uppercase-item');
    const specialItem = document.getElementById('special-item');
    const generatorError = document.getElementById('generator-error');
    
    // Элементы проверки
    const passwordInput = document.getElementById('password-input');
    const strengthFill = document.getElementById('strength-fill');
    const strengthText = document.getElementById('strength-text');
    let lengthReq = document.getElementById('length-req');
    let lowercaseReq = document.getElementById('lowercase-req');
    let uppercaseReq = document.getElementById('uppercase-req');
    let numbersReq = document.getElementById('numbers-req');
    let specialReq = document.getElementById('special-req');
    
    // Элементы журнала
    const historyCountSelect = document.getElementById('history-count-select');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    const downloadHistoryBtn = document.getElementById('download-history-btn');
    const passwordsList = document.getElementById('passwords-list');
    
    // Наборы символов для генерации паролей
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    // Ключ для localStorage
    const PASSWORD_HISTORY_KEY = 'passwordGeneratorHistory';
    const FILE_COUNTER_KEY = 'passwordFileCounter';
    
    // Максимальное количество паролей в истории
    const MAX_HISTORY_SIZE = 100;

    // Списки небезопасных PIN-кодов
    const unsafePins = [
        // Топ-20 самых популярных PIN-кодов
        "1234", "1111", "0000", "1212", "7777", "1004", "2000", "4444", 
        "2222", "6969", "9999", "3333", "5555", "6666", "1122", "1313", 
        "8888", "4321", "2001", "1010",
        // Топ-20 самых частых конечных PIN-кодов
        "1984", "1985", "1986", "1987", "1988", "1989", "1990", "1991",
        "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999",
        "2000", "2001", "2002", "2003"
    ];
    
    // Инициализация истории паролей
    let passwordHistory = loadPasswordHistory();
    
    // Сохраняем оригинальный HTML требований для пароля
    const originalRequirementsHTML = document.querySelector('.requirements').innerHTML;

    // Функция восстановления стандартных требований для пароля
    function restoreOriginalRequirements() {
        const requirementsContainer = document.querySelector('.requirements');
        requirementsContainer.innerHTML = originalRequirementsHTML;
        
        // Обновляем ссылки на элементы требований
        lengthReq = document.getElementById('length-req');
        lowercaseReq = document.getElementById('lowercase-req');
        uppercaseReq = document.getElementById('uppercase-req');
        numbersReq = document.getElementById('numbers-req');
        specialReq = document.getElementById('special-req');
    }

    // Получение счетчика файлов
    function getFileCounter() {
        let counter = localStorage.getItem(FILE_COUNTER_KEY);
        if (!counter) {
            counter = 1;
            localStorage.setItem(FILE_COUNTER_KEY, counter);
        }
        return parseInt(counter);
    }
    
    // Увеличение счетчика файлов
    function incrementFileCounter() {
        let counter = getFileCounter() + 1;
        localStorage.setItem(FILE_COUNTER_KEY, counter);
        return counter;
    }
    
    // Обновление значения длины пароля
    lengthSlider.addEventListener('input', function() {
        lengthValue.textContent = this.value;
        
        // При длине 4 отключаем чекбоксы букв и спецсимволов
        if (this.value === '4') {
            uppercaseItem.classList.add('disabled');
            specialItem.classList.add('disabled');
            uppercaseCheckbox.disabled = true;
            specialCheckbox.disabled = true;
            lowercaseCheckbox.disabled = true;
            
            // Снимаем выбор с отключенных чекбоксов
            uppercaseCheckbox.checked = false;
            specialCheckbox.checked = false;
            lowercaseCheckbox.checked = false;
            
            // Гарантируем, что цифры выбраны для PIN-кода
            numbersCheckbox.checked = true;
        } else {
            uppercaseItem.classList.remove('disabled');
            specialItem.classList.remove('disabled');
            uppercaseCheckbox.disabled = false;
            specialCheckbox.disabled = false;
            lowercaseCheckbox.disabled = false;
        }
        
        validateGeneratorOptions();
    });
    
    // Показать/скрыть секцию нескольких паролей
    multiplePasswordsCheckbox.addEventListener('change', function() {
        if (this.checked) {
            multiplePasswordsSection.classList.add('active');
        } else {
            multiplePasswordsSection.classList.remove('active');
        }
    });
    
    // Проверка выбранных опций генератора
    function validateGeneratorOptions() {
        const length = parseInt(lengthSlider.value);
        const includeNumbers = numbersCheckbox.checked;
        const includeLowercase = lowercaseCheckbox.checked;
        const includeUppercase = uppercaseCheckbox.checked;
        const includeSpecial = specialCheckbox.checked;
        
        // Для PIN-кодов разрешены только цифры
        if (length === 4) {
            if (!includeNumbers) {
                generatorError.textContent = 'Для PIN-кодов разрешены только цифры';
                generateBtn.disabled = true;
                return false;
            }
            generatorError.textContent = '';
            generateBtn.disabled = false;
            return true;
        }
        
        // Для обычных паролей должна быть выбрана хотя бы одна опция
        if (!includeNumbers && !includeLowercase && !includeUppercase && !includeSpecial) {
            generatorError.textContent = 'Выберите хотя бы один тип символов';
            generateBtn.disabled = true;
            return false;
        }
        
        generatorError.textContent = '';
        generateBtn.disabled = false;
        return true;
    }
    
    // Слушатели изменения чекбоксов
    numbersCheckbox.addEventListener('change', validateGeneratorOptions);
    lowercaseCheckbox.addEventListener('change', validateGeneratorOptions);
    uppercaseCheckbox.addEventListener('change', validateGeneratorOptions);
    specialCheckbox.addEventListener('change', validateGeneratorOptions);
    
    // Функция генерации одного пароля
    function generatePassword() {
        const length = parseInt(lengthSlider.value);
        const includeNumbers = numbersCheckbox.checked;
        const includeLowercase = lowercaseCheckbox.checked;
        const includeUppercase = uppercaseCheckbox.checked;
        const includeSpecial = specialCheckbox.checked;
        
        let charSet = '';
        
        // Для PIN-кодов используем только цифры
        if (length === 4) {
            charSet = numberChars;
        } else {
            // Для обычных паролей используем выбранные наборы символов
            if (includeNumbers) charSet += numberChars;
            if (includeLowercase) charSet += lowercaseChars;
            if (includeUppercase) charSet += uppercaseChars;
            if (includeSpecial) charSet += specialChars;
        }
        
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charSet.length);
            password += charSet[randomIndex];
        }
        
        return password;
    }
    
    // Анимация генерации пароля
    function animatePasswordGeneration(finalPassword) {
        const length = finalPassword.length;
        let steps = 0;
        const maxSteps = 15;
        const animationSpeed = 50; // ms
        
        // Функция для генерации случайного символа из доступных наборов
        function getRandomChar() {
            const includeNumbers = numbersCheckbox.checked;
            const includeLowercase = lowercaseCheckbox.checked;
            const includeUppercase = uppercaseCheckbox.checked;
            const includeSpecial = specialCheckbox.checked;
            
            let charSet = '';
            if (includeNumbers) charSet += numberChars;
            if (includeLowercase) charSet += lowercaseChars;
            if (includeUppercase) charSet += uppercaseChars;
            if (includeSpecial) charSet += specialChars;
            
            if (charSet.length === 0) charSet = numberChars; // fallback
            
            const randomIndex = Math.floor(Math.random() * charSet.length);
            return charSet[randomIndex];
        }
        
        // Анимация
        const interval = setInterval(() => {
            let animatedPassword = '';
            for (let i = 0; i < length; i++) {
                // Постепенно заменяем случайные символы на финальные
                if (steps > i * (maxSteps / length) || steps === maxSteps - 1) {
                    animatedPassword += finalPassword[i];
                } else {
                    animatedPassword += getRandomChar();
                }
            }
            
            generatedPassword.value = animatedPassword;
            generatedPassword.classList.add('password-generating');
            
            steps++;
            if (steps >= maxSteps) {
                clearInterval(interval);
                generatedPassword.value = finalPassword;
                setTimeout(() => {
                    generatedPassword.classList.remove('password-generating');
                }, 500);
            }
        }, animationSpeed);
    }
    
    // Генерация пароля
    generateBtn.addEventListener('click', function() {
        if (!validateGeneratorOptions()) return;
        
        const password = generatePassword();
        animatePasswordGeneration(password);
        
        // ИСПРАВЛЕНИЕ БАГА 3: Проверяем сгенерированный пароль в поле проверки
        passwordInput.value = password;
        checkPasswordStrength(password);
        
        // ИСПРАВЛЕНИЕ БАГА 1: Добавление пароля в историю
        addPasswordToHistory(password);
    });
    
    // Копирование пароля в буфер обмена
    copyBtn.addEventListener('click', function() {
        if (generatedPassword.value) {
            copyToClipboard(generatedPassword.value, copyBtn);
        }
    });
    
    // Сохранение нескольких паролей в файл
    saveBtn.addEventListener('click', function() {
        if (!validateGeneratorOptions()) return;
        
        const count = parseInt(passwordsCountInput.value);
        if (count < 2 || count > 50) {
            generatorError.textContent = 'Количество паролей должно быть от 2 до 50';
            return;
        }
        
        let passwordsContent = '';
        for (let i = 1; i <= count; i++) {
            const password = generatePassword();
            passwordsContent += `${i}. ${password}\n`;
            
            // Добавляем каждый пароль в историю
            addPasswordToHistory(password);
        }
        
        // Получаем номер для имени файла
        const fileCounter = getFileCounter();
        // Новый формат имени файла: Password_5_001.txt
        const fileName = `Password_${count}_${fileCounter.toString().padStart(3, '0')}.txt`;
        
        // Увеличиваем счетчик
        incrementFileCounter();
        
        // Создание и скачивание файла
        const blob = new Blob([passwordsContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        generatorError.textContent = `Файл ${fileName} с ${count} паролями сохранен!`;
        setTimeout(() => {
            generatorError.textContent = '';
        }, 3000);
    });

    // Дополнительные проверки для PIN-кодов
    function isUnsafePin(pin) {
        // Проверка по списку популярных PIN-кодов
        if (unsafePins.includes(pin)) {
            return "популярный PIN-код";
        }
        
        // Проверка на последовательности
        if (isSequence(pin)) {
            return "последовательность цифр";
        }
        
        // Проверка на повторяющиеся цифры
        if (isRepeating(pin)) {
            return "повторяющиеся цифры";
        }
        
        // Проверка на палиндромы
        if (isPalindrome(pin)) {
            return "палиндром";
        }
        
        // Проверка на годы (1900-2025)
        if (isYear(pin)) {
            return "год рождения";
        }
        
        return null;
    }
    
    function isSequence(pin) {
        const digits = pin.split('').map(Number);
        
        // Восходящая последовательность (1234, 2345, etc.)
        let ascending = true;
        for (let i = 1; i < digits.length; i++) {
            if (digits[i] !== digits[i-1] + 1) {
                ascending = false;
                break;
            }
        }
        
        // Нисходящая последовательность (4321, 5432, etc.)
        let descending = true;
        for (let i = 1; i < digits.length; i++) {
            if (digits[i] !== digits[i-1] - 1) {
                descending = false;
                break;
            }
        }
        
        return ascending || descending;
    }
    
    function isRepeating(pin) {
        // Все цифры одинаковые (1111, 2222, etc.)
        if (new Set(pin.split('')).size === 1) {
            return true;
        }
        
        // Пары одинаковых цифр (1122, 1212, etc.)
        const pairs = [
            /^(.)\1(.)\2$/, // AABB
            /^(.)(.)\1\2$/, // ABAB
            /^(.)(.)(.)\3$/, // ABCA
        ];
        
        return pairs.some(pattern => pattern.test(pin));
    }
    
    function isPalindrome(pin) {
        return pin === pin.split('').reverse().join('');
    }
    
    function isYear(pin) {
        const year = parseInt(pin);
        return year >= 1900 && year <= 2025;
    }
    
    // Функция показа требований для PIN-кода
    function showPinRequirements(pin, unsafeReason) {
        const requirementsContainer = document.querySelector('.requirements');
        
        // Создаем кастомные требования для PIN-кодов
        const customRequirements = [
            { id: 'pin-popular', text: 'Не популярный PIN', met: !unsafeReason || !unsafeReason.includes('популярный') },
            { id: 'pin-sequence', text: 'Не последовательность', met: !isSequence(pin) },
            { id: 'pin-repeat', text: 'Не повторяющиеся цифры', met: !isRepeating(pin) },
            { id: 'pin-palindrome', text: 'Не палиндром', met: !isPalindrome(pin) },
            { id: 'pin-year', text: 'Не год рождения', met: !isYear(pin) },
            { id: 'pin-entropy', text: 'Высокая энтропия', met: calculatePinEntropy(pin) >= 2 }
        ];
        
        // Обновляем отображение требований
        const requirementsHTML = customRequirements.map(req => `
            <div class="requirement-item">
                <div class="requirement-status ${req.met ? 'requirement-met' : ''}">${req.met ? '✓' : '!'}</div>
                <span>${req.text}</span>
            </div>
        `).join('');
        
        requirementsContainer.innerHTML = `
            <h3>Требования к PIN-коду:</h3>
            ${requirementsHTML}
            <div class="pin-warning">PIN-код должен быть сложным и непредсказуемым</div>
        `;
    }

    // Функция показа требований для пароля
    function showPasswordRequirements() {
        restoreOriginalRequirements();
    }

    // Проверка надежности пароля
    passwordInput.addEventListener('input', function() {
        checkPasswordStrength(this.value);
    });
    
    function checkPasswordStrength(password) {
        // Сброс всех требований
        resetRequirements();
        
        if (!password) {
            strengthFill.style.width = '0%';
            strengthFill.style.backgroundColor = '';
            strengthText.textContent = 'Введите пароль';
            strengthText.className = 'strength-text';
            showPasswordRequirements(); // Показываем стандартные требования
            return;
        }
        
        // Специальная проверка для PIN-кодов (4 цифры)
        if (password.length === 4 && /^\d+$/.test(password)) {
            checkPinStrength(password);
            return;
        }
        
        // Для обычных паролей показываем стандартные требования
        showPasswordRequirements();
        
        let strength = 0;
        let requirementsMet = 0;
        const totalRequirements = 5;
        
        // Проверка длины
        if (password.length >= 8) {
            strength += 20;
            requirementsMet++;
            lengthReq.textContent = '✓';
            lengthReq.classList.add('requirement-met');
        }
        
        // Проверка на строчные буквы
        if (/[a-z]/.test(password)) {
            strength += 20;
            requirementsMet++;
            lowercaseReq.textContent = '✓';
            lowercaseReq.classList.add('requirement-met');
        }
        
        // Проверка на заглавные буквы
        if (/[A-Z]/.test(password)) {
            strength += 20;
            requirementsMet++;
            uppercaseReq.textContent = '✓';
            uppercaseReq.classList.add('requirement-met');
        }
        
        // Проверка на цифры
        if (/[0-9]/.test(password)) {
            strength += 20;
            requirementsMet++;
            numbersReq.textContent = '✓';
            numbersReq.classList.add('requirement-met');
        }
        
        // Проверка на специальные символы
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(password)) {
            strength += 20;
            requirementsMet++;
            specialReq.textContent = '✓';
            specialReq.classList.add('requirement-met');
        }
        
        // Определение уровня надежности
        strengthFill.style.width = `${strength}%`;
        
        // Установка цвета и текста в зависимости от силы пароля
        updateStrengthDisplay(strength);
    }
    
    function checkPinStrength(pin) {
        // Показываем требования для PIN-кода
        let strength = 0;
        let strengthLabel = '';
        let reason = '';
        
        // Проверка на небезопасные комбинации
        const unsafeReason = isUnsafePin(pin);
        
        if (unsafeReason) {
            strength = 20; // Очень слабый
            strengthLabel = 'Очень слабый PIN';
            reason = ` - ${unsafeReason}`;
        } else {
            // Проверка энтропии PIN-кода
            const entropy = calculatePinEntropy(pin);
            
            if (entropy < 2) {
                strength = 40;
                strengthLabel = 'Слабый PIN';
            } else if (entropy < 3) {
                strength = 60;
                strengthLabel = 'Средний PIN';
            } else {
                strength = 80;
                strengthLabel = 'Надежный PIN';
            }
        }
        
        strengthFill.style.width = `${strength}%`;
        strengthText.textContent = strengthLabel + reason;
        updateStrengthDisplay(strength);
        
        // Показываем дополнительную информацию для PIN-кодов
        showPinRequirements(pin, unsafeReason);
    }
    
    function calculatePinEntropy(pin) {
        const digits = pin.split('');
        const uniqueDigits = new Set(digits).size;
        
        // Базовая энтропия на основе уникальных цифр
        let entropy = Math.log2(Math.pow(10, uniqueDigits));
        
        // Уменьшаем энтропию для предсказуемых паттернов
        if (isSequence(pin)) entropy *= 0.3;
        if (isRepeating(pin)) entropy *= 0.4;
        if (isPalindrome(pin)) entropy *= 0.5;
        if (isYear(pin)) entropy *= 0.6;
        
        return Math.max(entropy, 0.1);
    }
    
    function updateStrengthDisplay(strength) {
        let strengthLevel = 1;
        let strengthLabel = 'Фигня';
        
        if (strength <= 20) {
            strengthFill.style.backgroundColor = '#D32F2F';
            strengthLevel = 1;
            strengthLabel = 'Фигня';
        } else if (strength <= 40) {
            strengthFill.style.backgroundColor = '#F57C00';
            strengthLevel = 2;
            strengthLabel = 'Плохой';
        } else if (strength <= 60) {
            strengthFill.style.backgroundColor = '#FFB300';
            strengthLevel = 3;
            strengthLabel = 'Нормально';
        } else if (strength <= 80) {
            strengthFill.style.backgroundColor = '#AED581';
            strengthLevel = 4;
            strengthLabel = 'Хороший';
        } else {
            strengthFill.style.backgroundColor = '#388E3C';
            strengthLevel = 5;
            strengthLabel = 'Идеальный';
        }
        
        // Обновляем текст только если он не был установлен в checkPinStrength
        if (!strengthText.textContent.includes('PIN')) {
            strengthText.textContent = strengthLabel;
        }
        strengthText.className = `strength-text strength-${strengthLevel}`;
    }
    
    function resetRequirements() {
        const requirements = [lengthReq, lowercaseReq, uppercaseReq, numbersReq, specialReq];
        
        requirements.forEach(req => {
            if (req) {
                req.textContent = '!';
                req.classList.remove('requirement-met');
            }
        });
    }
    
    // Функции для работы с журналом паролей
    
    // Загрузка истории паролей из localStorage
    function loadPasswordHistory() {
        const storedHistory = localStorage.getItem(PASSWORD_HISTORY_KEY);
        if (storedHistory) {
            return JSON.parse(storedHistory);
        }
        return [];
    }
    
    // Сохранение истории паролей в localStorage
    function savePasswordHistory() {
        localStorage.setItem(PASSWORD_HISTORY_KEY, JSON.stringify(passwordHistory));
    }
    
    // Добавление пароля в историю
    function addPasswordToHistory(password) {
        const passwordEntry = {
            password: password,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleString('ru-RU')
        };
        
        // Добавляем в начало массива
        passwordHistory.unshift(passwordEntry);
        
        // Ограничиваем размер истории
        if (passwordHistory.length > MAX_HISTORY_SIZE) {
            passwordHistory = passwordHistory.slice(0, MAX_HISTORY_SIZE);
        }
        
        // Сохраняем в localStorage
        savePasswordHistory();
        
        // Обновляем отображение
        updatePasswordsList();
    }
    
    // Обновление списка паролей в журнале
    function updatePasswordsList() {
        const count = parseInt(historyCountSelect.value);
        const passwordsToShow = passwordHistory.slice(0, count);
        
        // Очищаем список
        passwordsList.innerHTML = '';
        
        if (passwordsToShow.length === 0) {
            passwordsList.innerHTML = '<div class="empty-history">Журнал паролей пуст</div>';
            return;
        }
        
        // Добавляем пароли в список
        passwordsToShow.forEach((entry, index) => {
            const passwordItem = document.createElement('div');
            passwordItem.className = 'password-item';
            
            // Добавляем задержку для анимации появления
            passwordItem.style.animationDelay = `${index * 0.05}s`;
            
            passwordItem.innerHTML = `
                <div>
                    <div class="password-text">${entry.password}</div>
                    <div class="password-date">${entry.date}</div>
                </div>
                <div class="password-actions">
                    <button class="history-copy-btn" data-password="${entry.password}">Копировать</button>
                </div>
            `;
            
            passwordsList.appendChild(passwordItem);
        });
        
        // Добавляем обработчики для кнопок копирования в журнале
        document.querySelectorAll('.history-copy-btn').forEach(button => {
            // Удаляем существующие обработчики, чтобы избежать дублирования
            button.replaceWith(button.cloneNode(true));
        });
        
        // Добавляем новые обработчики
        document.querySelectorAll('.history-copy-btn').forEach(button => {
            button.addEventListener('click', function() {
                const password = this.getAttribute('data-password');
                copyToClipboard(password, this);
            });
        });
    }
    
    // Функция копирования в буфер обмена
    function copyToClipboard(text, button) {
        navigator.clipboard.writeText(text)
            .then(() => {
                const originalText = button.textContent;
                button.textContent = 'Скопировано!';
                button.classList.add('copied');
                setTimeout(() => {
                    button.textContent = originalText;
                    button.classList.remove('copied');
                }, 2000);
            })
            .catch(err => {
                console.error('Ошибка копирования: ', err);
                // Альтернативный метод для старых браузеров
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                
                const originalText = button.textContent;
                button.textContent = 'Скопировано!';
                button.classList.add('copied');
                setTimeout(() => {
                    button.textContent = originalText;
                    button.classList.remove('copied');
                }, 2000);
            });
    }
    
    // Очистка журнала паролей
    clearHistoryBtn.addEventListener('click', function() {
        if (confirm('Вы уверены, что хотите очистить журнал паролей?')) {
            passwordHistory = [];
            savePasswordHistory();
            updatePasswordsList();
        }
    });
    
    // Скачивание журнала паролей
    downloadHistoryBtn.addEventListener('click', function() {
        if (passwordHistory.length === 0) {
            alert('Журнал паролей пуст');
            return;
        }
        
        let passwordsContent = '';
        passwordHistory.forEach((entry, index) => {
            passwordsContent += `${index + 1}. ${entry.password} (${entry.date})\n`;
        });
        
        // Создание и скачивание файла
        const blob = new Blob([passwordsContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'password_history.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
    
    // Изменение количества отображаемых паролей
    historyCountSelect.addEventListener('change', function() {
        updatePasswordsList();
    });
    
    // ИСПРАВЛЕНИЕ БАГА: Инициализация ползунка при загрузке
    function initializeSlider() {
        // Всегда устанавливаем значение 8 при загрузке
        lengthSlider.value = 8;
        lengthValue.textContent = '8';
        
        // Сбрасываем состояние чекбоксов для длины 8
        uppercaseItem.classList.remove('disabled');
        specialItem.classList.remove('disabled');
        uppercaseCheckbox.disabled = false;
        specialCheckbox.disabled = false;
        lowercaseCheckbox.disabled = false;
        
        // Убеждаемся, что чекбоксы в правильном состоянии
        numbersCheckbox.checked = true;
        lowercaseCheckbox.checked = true;
        uppercaseCheckbox.checked = true;
        specialCheckbox.checked = true;
    }
    
    // ИСПРАВЛЕНИЕ БАГА 2: Сброс состояния чекбокса "Несколько паролей" при загрузке
    function initializeMultiplePasswords() {
        // Сбрасываем состояние чекбокса
        multiplePasswordsCheckbox.checked = false;
        multiplePasswordsSection.classList.remove('active');
    }
    
    // Инициализация
    initializeSlider(); // Инициализируем ползунок
    initializeMultiplePasswords(); // Инициализируем состояние чекбокса нескольких паролей
    validateGeneratorOptions();
    generateBtn.click();
    updatePasswordsList();
});