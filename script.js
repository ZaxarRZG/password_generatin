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
            
            // Наборы символов для генерации паролей
            const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
            const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const numberChars = '0123456789';
            const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
            
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
            
            // Генерация пароля
            generateBtn.addEventListener('click', function() {
                if (!validateGeneratorOptions()) return;
                
                const password = generatePassword();
                generatedPassword.value = password;
                checkPasswordStrength(password);
            });
            
            // Копирование пароля в буфер обмена
            copyBtn.addEventListener('click', function() {
                if (generatedPassword.value) {
                    navigator.clipboard.writeText(generatedPassword.value)
                        .then(() => {
                            const originalText = copyBtn.textContent;
                            copyBtn.textContent = 'Скопировано!';
                            setTimeout(() => {
                                copyBtn.textContent = originalText;
                            }, 2000);
                        })
                        .catch(err => {
                            console.error('Ошибка копирования: ', err);
                            // Альтернативный метод для старых браузеров
                            generatedPassword.select();
                            document.execCommand('copy');
                            const originalText = copyBtn.textContent;
                            copyBtn.textContent = 'Скопировано!';
                            setTimeout(() => {
                                copyBtn.textContent = originalText;
                            }, 2000);
                        });
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
                }
                
                // Создание и скачивание файла
                const blob = new Blob([passwordsContent], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'passwords.txt';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                generatorError.textContent = `Файл с ${count} паролями сохранен!`;
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
                
                if (strength <= 40) {
                    strengthFill.style.backgroundColor = '#E59312';
                    strengthText.textContent = 'Плохой';
                    strengthText.className = 'strength-text strength-poor';
                } else if (strength <= 80) {
                    strengthFill.style.backgroundColor = '#F4B315';
                    strengthText.textContent = 'Хороший';
                    strengthText.className = 'strength-text strength-good';
                } else {
                    strengthFill.style.backgroundColor = '#D3AF85';
                    strengthText.textContent = 'Отличный';
                    strengthText.className = 'strength-text strength-excellent';
                }
            }
            
            function resetRequirements() {
                const requirements = [lengthReq, lowercaseReq, uppercaseReq, numbersReq, specialReq];
                
                requirements.forEach(req => {
                    req.textContent = '!';
                    req.classList.remove('requirement-met');
                });
            }
            
            // Инициализация
            validateGeneratorOptions();
            generateBtn.click();
        });