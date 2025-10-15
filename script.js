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
    const lengthReq = document.getElementById('length-req');
    const lowercaseReq = document.getElementById('lowercase-req');
    const uppercaseReq = document.getElementById('uppercase-req');
    const numbersReq = document.getElementById('numbers-req');
    const specialReq = document.getElementById('special-req');
    
    // Элементы журнала
    const historyCountSelect = document.getElementById('history-count-select');
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    const downloadHistoryBtn = document.getElementById('download-history-btn');
    const passwordsList = document.getElementById('passwords-list');
    const prevPageBtn = document.getElementById('prev-page-btn');
    const nextPageBtn = document.getElementById('next-page-btn');
    const pageInfo = document.getElementById('page-info');
    
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
    
    // Пагинация
    let currentPage = 1;
    const itemsPerPage = 10;
    
    // Инициализация истории паролей
    let passwordHistory = loadPasswordHistory();
    
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
        checkPasswordStrength(password);
        
        // Добавление пароля в историю
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
            return;
        }
        
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
        
        strengthText.textContent = strengthLabel;
        strengthText.className = `strength-text strength-${strengthLevel}`;
    }
    
    function resetRequirements() {
        const requirements = [lengthReq, lowercaseReq, uppercaseReq, numbersReq, specialReq];
        
        requirements.forEach(req => {
            req.textContent = '!';
            req.classList.remove('requirement-met');
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
        const totalPages = Math.ceil(passwordHistory.length / itemsPerPage);
        
        // Корректируем текущую страницу, если необходимо
        if (currentPage > totalPages) {
            currentPage = Math.max(1, totalPages);
        }
        
        // Рассчитываем индексы для отображаемых элементов
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, passwordHistory.length);
        const passwordsToShow = passwordHistory.slice(startIndex, endIndex);
        
        // Очищаем список
        passwordsList.innerHTML = '';
        
        if (passwordsToShow.length === 0) {
            passwordsList.innerHTML = '<div class="empty-history">Журнал паролей пуст</div>';
            return;
        }
        
        // Добавляем пароли в список
        passwordsToShow.forEach((entry, index) => {
            const globalIndex = startIndex + index + 1;
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
        
        // Обновляем информацию о странице
        pageInfo.textContent = `Страница ${currentPage} из ${totalPages}`;
        
        // Обновляем состояние кнопок пагинации
        prevPageBtn.disabled = currentPage <= 1;
        nextPageBtn.disabled = currentPage >= totalPages;
        
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
            currentPage = 1;
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
        currentPage = 1;
        updatePasswordsList();
    });
    
    // Пагинация
    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            updatePasswordsList();
        }
    });
    
    nextPageBtn.addEventListener('click', function() {
        const totalPages = Math.ceil(passwordHistory.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            updatePasswordsList();
        }
    });
    
    // Инициализация
    validateGeneratorOptions();
    generateBtn.click();
    updatePasswordsList();
});