document.addEventListener('DOMContentLoaded', () => {
    // --- Ümumi Elementlər ---
    const burgerMenu = document.getElementById('burger-menu');
    const navMenu = document.getElementById('nav-menu');

    if (burgerMenu) {
        burgerMenu.addEventListener('click', () => {
            navMenu.classList.toggle('is-open');
        });
    }

    // --- SCROLL ANIMATION MÜŞAHİDƏÇİSİ ---
    const animateElements = document.querySelectorAll('.animate-scroll, .animate-in');
    
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // elementin 10%-i görünəndə
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // .animate-in sinifini səhifə yüklənərkən göstərmək üçün unobserve etmirik (bəzi hallarda)
                if (!entry.target.classList.contains('animate-in')) {
                   observer.unobserve(entry.target); 
                }
            }
        });
    }, observerOptions);

    animateElements.forEach(el => {
        observer.observe(el);
    });

    // --- JSON Data Yüklənməsi (index.html üçün sadələşdirilmiş simulyasiya) ---
    const dataTable = document.getElementById('customer-data-table');
    if (dataTable) {
        // Simulyasiya: Real data.json faylı yoxdursa
        console.warn('JSON data simulyasiya edilir. data.json faylı tələb olunur.');
        // Burada real JSON fetch kodunuz yerləşir.
    }


    // =================================================================
    // --- AUTHENTICATION MƏNTİQİ (Həm Chat, Həm Booking üçün Local Storage) ---
    // =================================================================
    
    const authForm = document.getElementById('auth-form');
    const authBox = document.querySelector('.auth-box');
    const authTitle = document.getElementById('auth-title');
    const toggleAuth = document.getElementById('toggle-auth');
    const logoutBtnChat = document.querySelector('.auth-box .logout-btn');

    // Funksiya: Login statusunu yoxlayır və Chat UI-nı yeniləyir
    function checkAuthStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userEmail = localStorage.getItem('userEmail');
        
        // Chat səhifəsinə xas elementlər
        if (document.querySelector('.chat-main-container')) {
            const chatSection = document.querySelector('.chat-section');
            if (isLoggedIn) {
                authBox.querySelector('h3').textContent = `Xoş Gəlmisiniz, ${userEmail}!`;
                if (authForm) authForm.style.display = 'none';
                if (toggleAuth) toggleAuth.style.display = 'none';
                if (logoutBtnChat) logoutBtnChat.style.display = 'block';

                // Çat hissəsini aktivləşdir
                chatSection.style.opacity = '1';
                chatSection.style.pointerEvents = 'auto';
            } else {
                authBox.querySelector('h3').textContent = authTitle ? authTitle.textContent : 'Daxil Ol';
                if (authForm) authForm.style.display = 'block';
                if (toggleAuth) toggleAuth.style.display = 'block';
                if (logoutBtnChat) logoutBtnChat.style.display = 'none';

                // Çat hissəsini passivləşdir
                chatSection.style.opacity = '0.5';
                chatSection.style.pointerEvents = 'none';
            }
        }
    }
    
    // Auth Form Submit Hadisəsi (Qeydiyyat/Daxil Ol Simulyasiyası)
    if (authForm) {
        if (toggleAuth) {
             toggleAuth.addEventListener('click', (e) => {
                e.preventDefault();
                const isLoginMode = authTitle.textContent === 'Daxil Ol';
                authTitle.textContent = isLoginMode ? 'Qeydiyyatdan Keç' : 'Daxil Ol';
                toggleAuth.textContent = isLoginMode ? 'Daxil Ol' : 'Qeydiyyatdan Keçin';
                authForm.reset();
            });
        }
        
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = authForm.querySelector('input[type="email"]').value.trim();
            
            // İstifadəçinin məlumatını Local Storage-a yaz
            localStorage.setItem('userEmail', emailInput);
            localStorage.setItem('isLoggedIn', 'true');

            const currentMode = authTitle.textContent;
            alert(`${currentMode === 'Qeydiyyatdan Keç' ? 'Uğurlu Qeydiyyat!' : 'Uğurlu Daxil Olma!'} ${emailInput} adından giriş edildi.`);
            
            checkAuthStatus();
            authForm.reset();
        });
    }

    // Çıxış Et Hadisəsi (Chat səhifəsi üçün)
    if (logoutBtnChat) {
        logoutBtnChat.addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userEmail');
            alert('Sistemdən çıxış edildi.');
            location.reload(); 
        });
    }

    // Səhifə yüklənəndə statusu yoxla
    checkAuthStatus();
    
    // =================================================================
    // --- ÇAT FUNKSIONALLIĞI (chat.html) ---
    // =================================================================

    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    if (chatBox && userInput && sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        function sendMessage() {
            const messageText = userInput.value.trim();
            if (messageText === '') return;
            
            // Qeyd: Login check artıq DOMContentLoaded zamanı checkAuthStatus() tərəfindən idarə edilir.
            // Əgər chat-section passivdirsə, buraya gəlməməlidir.
            
            appendMessage('user', messageText);
            userInput.value = '';
            simulateAIResponse(messageText);
        }

        function appendMessage(sender, text) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'ai-message');
            
            if (sender !== 'user') {
                const icon = document.createElement('i');
                icon.classList.add('fas', 'fa-robot');
                messageDiv.appendChild(icon);
            }

            const textP = document.createElement('p');
            textP.textContent = text;
            messageDiv.appendChild(textP);

            chatBox.appendChild(messageDiv);
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        function simulateAIResponse(userMessage) {
            let response = "Maraqlı sualdır! Mən dağçılıq və səyahət turları ilə bağlı məlumat bazasına baxıram...";
            const lowerCaseMsg = userMessage.toLowerCase();
            
            if (lowerCaseMsg.includes('bilet') || lowerCaseMsg.includes('uçuş')) {
                response = "Uçuş biletləri üçün 'Uçuş Bileti' səhifəsinə keçməyinizi tövsiyə edirəm.";
            } else if (lowerCaseMsg.includes('alpinist') || lowerCaseMsg.includes('məsləhət')) {
                response = "Bizim təcrübəli alpinistlərimiz var. Hansı dağ marşrutu haqqında məlumat lazımdır?";
            }

            const typingMessage = document.createElement('div');
            typingMessage.classList.add('message', 'ai-message', 'typing-indicator');
            const icon = document.createElement('i');
            icon.classList.add('fas', 'fa-robot');
            const typingDots = document.createElement('p');
            typingDots.innerHTML = '<span>.</span><span>.</span><span>.</span>'; 
            typingMessage.appendChild(icon);
            typingMessage.appendChild(typingDots);
            chatBox.appendChild(typingMessage);
            chatBox.scrollTop = chatBox.scrollHeight;

            setTimeout(() => {
                chatBox.removeChild(typingMessage);
                appendMessage('ai', response);
            }, 1500);
        }
    }
    
    
    // =================================================================
    // --- BİLET REZERVASYASI FUNKSIONALLIĞI (booking.html) ---
    // =================================================================
    
    const flightSearchForm = document.getElementById('flight-search-form');
    const flightResultsContainer = document.getElementById('flight-results-container');
    const reservationModal = document.getElementById('reservation-modal');
    const paymentForm = document.getElementById('payment-form');
    const selectedPriceElement = document.getElementById('selected-price');
    const resultPopup = document.getElementById('result-popup');
    const popupTitle = document.getElementById('popup-title');
    const popupMessage = document.getElementById('popup-message');
    const closePopupBtn = resultPopup ? resultPopup.querySelector('.close-popup-btn') : null;
    const modalCloseButtons = document.querySelectorAll('.modal .close-btn');
    let currentFlightDetails = {};


    // Köməkçi Funksiya: Nəticə Popup-unu göstərir
    function showPopup(title, message, isSuccess = true) {
        if (resultPopup && popupTitle && popupMessage) {
            popupTitle.textContent = title;
            popupMessage.textContent = message;
            popupTitle.style.color = isSuccess ? 'var(--secondary-color)' : '#dc3545';
            resultPopup.style.display = 'block';
        }
    }


    if (flightSearchForm) {
        // Modal Bağlama Logic
        modalCloseButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (reservationModal) reservationModal.style.display = 'none';
                if (resultPopup) resultPopup.style.display = 'none';
            });
        });

        if (closePopupBtn) {
            closePopupBtn.addEventListener('click', () => {
                 resultPopup.style.display = 'none';
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target === reservationModal) {
                reservationModal.style.display = 'none';
            }
            if (e.target === resultPopup) {
                resultPopup.style.display = 'none';
            }
        });

        // 1. Axtarış Formunun Göndərilməsi
        flightSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const departure = document.getElementById('departure').value;
            const arrival = document.getElementById('arrival').value;
            const departDate = document.getElementById('depart-date').value;
            const passengers = document.getElementById('passengers').value;

            displayFlightResults(departure, arrival, departDate, passengers);
        });

        // 2. Axtarış Nəticələrini Görüntüləmək (Simulyasiya)
        function displayFlightResults(dep, arr, date, count) {
            if (!flightResultsContainer) return;

            flightResultsContainer.innerHTML = '';
            
            const basePrice = 120;
            const flightOptions = [
                { time: '10:00', carrier: 'AZAL', price: basePrice },
                { time: '15:30', carrier: 'FlyPeak', price: basePrice + 35, type: 'Fast Track' },
                { time: '21:45', carrier: 'Qafqaz Air', price: basePrice + 70, type: 'Business Class' }
            ];

            flightOptions.forEach(option => {
                const card = document.createElement('div');
                card.classList.add('flight-card', 'animate-scroll');
                // ... card.innerHTML kodu ... (Qısa olması üçün buraxıldı)
                card.innerHTML = `
                    <div class="flight-details">
                        <p><strong>${option.carrier}</strong> | ${option.time}</p>
                        <p>Gediş: ${dep} | Çatış: ${arr}</p>
                        <p>Tarix: ${date} | Sərnişin: ${count}</p>
                        ${option.type ? `<p style="color:var(--primary-color);">Tip: ${option.type}</p>` : ''}
                    </div>
                    <div class="flight-action">
                        <span class="flight-price">${option.price * count} AZN</span>
                        <button class="btn-secondary reserve-btn" data-price="${option.price * count}">Rezervasiya Et</button>
                    </div>
                `;
                flightResultsContainer.appendChild(card);
            });

            setTimeout(() => {
                const newAnimateElements = flightResultsContainer.querySelectorAll('.animate-scroll');
                newAnimateElements.forEach(el => observer.observe(el)); // Yüklənən elementləri müşahidə et
            }, 50);
            
            document.querySelectorAll('.reserve-btn').forEach(button => {
                button.addEventListener('click', handleReservationClick);
            });
        }
        
        // 3. Rezervasiya Düyməsinə klikləmə (LOGIN CHECK MODAL İLƏ)
        function handleReservationClick(e) {
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

            if (!isLoggedIn) {
                // Xəbərdarlıq modalını göstər
                showPopup(
                    'Giriş Tələb Olunur 🛑', 
                    'Bilet rezervasiyası etmək üçün zəhmət olmasa əvvəlcə Qeydiyyatdan keçin və ya Daxil Olun.', 
                    false
                );
                return; 
            }
            
            const price = e.target.getAttribute('data-price');
            currentFlightDetails = { price: price };
            
            if (selectedPriceElement) selectedPriceElement.textContent = price + ' AZN';
            
            // Modal pəncərəni aç
            if (reservationModal) reservationModal.style.display = 'block';
        }

        // 4. Ödəniş Formunun Göndərilməsi (Simulyasiya)
        if (paymentForm) {
            paymentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

                if (!isLoggedIn) {
                    if (reservationModal) reservationModal.style.display = 'none';
                    showPopup(
                        'Xəta Baş Verdi ⚠️', 
                        'Ödəniş alınmadı: Rezervasiya etmək üçün sistemə daxil olmalısınız!', 
                        false
                    );
                    return;
                }
                
                const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
                const cardName = document.getElementById('card-name').value.trim();

                let success = false;
                // Simulyasiya: 16 rəqəm olmalı və 4-lə başlamalı
                if (cardNumber.length === 16 && cardName !== '' && cardNumber.startsWith('4')) { 
                    success = true;
                } 

                if (reservationModal) reservationModal.style.display = 'none'; // Rezervasiya modalını bağla

                if (success) {
                    showPopup(
                        'Ödəniş Təsdiqləndi! 🎉',
                        `Təbriklər, ${currentFlightDetails.price} AZN dəyərində olan biletiniz uğurla rezervasiya edildi. Təsdiq e-poçtu ${localStorage.getItem('userEmail') || 'ünvanınıza'} göndərildi.`,
                        true
                    );
                } else {
                     showPopup(
                        'Ödəniş Təsdiqlənmədi! ❌',
                        'Kart məlumatlarınızı yoxlayın və ya başqa bir kartdan istifadə edin. Zəhmət olmasa yenidən cəhd edin.',
                        false
                    );
                }
                
                paymentForm.reset();
            });
        }
    }
});
// =================================================================
// --- MARŞRUT PLANLAYICISI FUNKSIONALLIĞI (routes.html) ---
// =================================================================

const routePlanningForm = document.getElementById('route-planning-form');
const mountainSelect = document.getElementById('mountain-select');
const routeDetailsContainer = document.getElementById('route-details');
const carOptionsContainer = document.getElementById('car-options');
const carSelectionMessage = document.getElementById('car-selection-message');
const mapPlaceholder = document.getElementById('map-placeholder'); // Yeni element

// JSON Dağ Məlumatları və Avtomobil Tövsiyələri
const mountainData = {
    'shahdag': {
        name: 'Şahdağ (Qusar)',
        safety: 'Yüksək (Turizm infrastrukturu inkişaf edib)',
        path: 'Qusar yolu. Keyfiyyətli **asfalt yol** və kanat. Qışda zəncir tələb oluna bilər. **Ən Sərfəli Yol:** Kompleksə birbaşa asfalt yol.',
        description: 'Azərbaycanın ikinci ən hündür dağı (4243m). Turistlər üçün əsasən Şahdağ Qış-Yay Turizm Kompleksinə gediş nəzərdə tutulur.',
        cars: ['SUV', 'Sedan', 'Minivan'],
        carIcons: { 'SUV': 'fas fa-car-side', 'Sedan': 'fas fa-car', 'Minivan': 'fas fa-bus-alt' },
        // Google Maps iframe URL (Koordinat: Şahdağ Kompleksi)
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11594.13264426543!2d48.1691383!3d41.3435137!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x403fb232a9cc0a87%3A0x8df5529f796245c6!2sShahdag%20Mountain%20Resort!5e0!3m2!1sen!2saz!4v1700000000000'
    },
    'bazarduzu': {
        name: 'Bazardüzü (Qəbələ/Qusar)',
        safety: 'Çətin (Yalnız peşəkar alpinistlər üçün)',
        path: 'Qəbələ/Qusar tərəfdən kənd yolları. Avtomobil yolu yalnız düşərgə yerinə qədərdir. **Ən Sərfəli Yol:** 4x4 avtomobillə son mümkün nöqtəyə qədər, sonra Trekkinq.',
        description: 'Azərbaycanın ən hündür zirvəsi (4466m). Çox çətin marşrutdur və xüsusi icazə/bələdçi tələb olunur.',
        cars: ['4x4', 'SUV'],
        carIcons: { '4x4': 'fas fa-truck-monster', 'SUV': 'fas fa-car-side' },
        // Google Maps iframe URL (Koordinat: Bazardüzü zirvəsinə yaxın ərazi)
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15444.62953252516!2d47.8385317!3d41.2268157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x403f90113c23c65d%3A0x35639f7f44d5c19d!2sMount%20Bazarduzu!5e0!3m2!1sen!2saz!4v1700000000001'
    },
    'tufandag': {
        name: 'Tufandağ (Qəbələ)',
        safety: 'Orta (Dağlıq, lakin bələdçi ilə tövsiyə olunur)',
        path: 'Qəbələ yolu. Tufandağ Qış-Yay Turizm Mərkəzinə qədər **yaxşı asfalt** yol. Yüksəklikdə yalnız piyada marşrutları. **Ən Sərfəli Yol:** Kanat yolundan istifadə etmək.',
        description: 'Gözəl mənzərələri və kanat yolları ilə məşhurdur. Həm istirahət, həm də yüngül alpinizm üçün uygundur.',
        cars: ['SUV', '4x4', 'Sedan'],
        carIcons: { 'SUV': 'fas fa-car-side', '4x4': 'fas fa-truck-monster', 'Sedan': 'fas fa-car' },
        // Google Maps iframe URL (Koordinat: Tufandağ Kompleksi)
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3032.540192534947!2d47.8872958!3d40.9998064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x403f9a72b53c713b%3A0x1b438287e07a2a5e!2sTufandag%20Mountain%20Resort!5e0!3m2!1sen!2saz!4v1700000000002'
    },
    'khinalig': {
        name: 'Xınalıq Kəndi Yolu (Quba)',
        safety: 'Diqqətli (Yol dar, qışda riskli)',
        path: 'Qubadan Xınalığa gedən yol. Bəzi hissələr **çınqıllı və yoxuşludur**. Sürətli yox, ehtiyatlı sürmə tələb olunur. **Ən Sərfəli Yol:** Yay aylarında, bələdçinin müşayiəti ilə.',
        description: 'Hündürlükdə yerləşən qədim kəndə gedən bu marşrut möhtəşəm mənzərələr təqdim edir, lakin yollar çətindir.',
        cars: ['4x4', 'SUV'],
        carIcons: { '4x4': 'fas fa-truck-monster', 'SUV': 'fas fa-car-side' },
        // Google Maps iframe URL (Koordinat: Xınalıq Kəndi)
        mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2994.482093557434!2d48.1636111!3d41.1394444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x403f7e5e33d0614f%3A0xd64f43407e3295c0!2sKhinalug!5e0!3m2!1sen!2saz!4v1700000000003'
    }
};

if (routePlanningForm) {
    routePlanningForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const selectedMountainKey = mountainSelect.value;

        if (selectedMountainKey && mountainData[selectedMountainKey]) {
            const data = mountainData[selectedMountainKey];
            
            // 1. Məlumatları doldur
            document.getElementById('route-mountain').textContent = data.name;
            document.getElementById('route-safety').textContent = data.safety;
            document.getElementById('route-recommended-path').innerHTML = data.path; 
            document.getElementById('route-description').textContent = data.description;
            
            // 2. Google Maps Xəritəsini Yüklə
            mapPlaceholder.innerHTML = `<iframe src="${data.mapUrl}&zoom=12" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
            mapPlaceholder.style.backgroundColor = '#fff';
            
            // 3. Avtomobil seçimlərini doldur
            displayCarOptions(data.cars, data.carIcons);
            
            // 4. Nəticə blokunu göstər və animasiya tətbiq et
            routeDetailsContainer.style.display = 'block';
            
            // Animasiya sinfini əlavə et (məzmun göründükdən sonra)
            // Bu, istifadəçinin DOM-un yenilənməsini görməsi üçün lazımdır.
            setTimeout(() => {
                routeDetailsContainer.classList.add('is-visible');
            }, 50); 
            
        } else {
            alert('Zəhmət olmasa, səyahət etmək istədiyiniz dağı seçin.');
            routeDetailsContainer.style.display = 'none';
            routeDetailsContainer.classList.remove('is-visible');
            mapPlaceholder.innerHTML = `<p style="padding: 20px;">Zəhmət olmasa, yuxarıdan bir dağ seçin və "Marşrutu Göstər" düyməsinə basın.</p>`;
        }
    });
}

function displayCarOptions(recommendedCars, icons) {
    carOptionsContainer.innerHTML = '';
    carSelectionMessage.textContent = ''; 

    recommendedCars.forEach(carType => {
        const carCard = document.createElement('div');
        carCard.classList.add('car-card');
        carCard.setAttribute('data-car', carType);
        
        const iconClass = icons[carType] || 'fas fa-car'; 
        
        // Qiymətləri carType-a görə simulyasiya edirik
        let price = '';
        if (carType === '4x4') price = '120 AZN/gün';
        else if (carType === 'SUV') price = '80 AZN/gün';
        else if (carType === 'Minivan') price = '95 AZN/gün';
        else if (carType === 'Sedan') price = '50 AZN/gün';

        carCard.innerHTML = `
            <i class="${iconClass}"></i>
            <p>${carType}</p>
            <p style="font-size:0.9em; color: #888;">Kirayə: ${price}</p>
        `;

        carCard.addEventListener('click', () => {
            // Seçimi təmizlə
            document.querySelectorAll('.car-card').forEach(card => card.classList.remove('selected'));
            
            // Yeni kartı seç
            carCard.classList.add('selected');
            
            // İstifadəçiyə mesaj ver
            let message = '';
            const selectedMountain = mountainSelect.value;

            if (carType === '4x4') {
                message = `**${carType}** seçildi. Bu, **Bazardüzü** və **Xınalıq** kimi çətin marşrutlar üçün ideal və ən təhlükəsiz seçimdir.`;
            } else if (carType === 'SUV') {
                message = `**${carType}** seçildi. **Şahdağ** və **Tufandağ** mərkəzi yolları üçün mükəmməldir. Palçıqlı və çox sıldırım hissələrdə diqqət tələb olunur.`;
            } else if (carType === 'Minivan') {
                message = `**${carType}** seçildi. Əsasən **Şahdağ** kimi asfalt yollar və böyük qruplar üçün uygundur. Dağlıq ərazinin dərinliklərinə gediş tövsiyə edilmir.`;
            } else if (carType === 'Sedan') {
                 // Sedan riskli dağlar seçiləndə xəbərdarlıq edir
                 if (selectedMountain === 'bazarduzu' || selectedMountain === 'khinalig') {
                    message = `**Sedan** seçimi bu marşrut üçün **çox risklidir**. Yalnız asfalt yollarda istifadə edin. 4x4 tövsiyə olunur!`;
                    carSelectionMessage.style.color = '#dc3545'; // Qırmızı xəbərdarlıq
                 } else {
                    message = `**Sedan** seçildi. **Şahdağ** və **Tufandağ** komplekslərinin əsas giriş yolları üçün uyğundur.`;
                    carSelectionMessage.style.color = 'var(--primary-color)'; 
                 }
            }
            carSelectionMessage.textContent = message;
        });

        carOptionsContainer.appendChild(carCard);
    });
}
document.addEventListener('DOMContentLoaded', () => {
    // --- Ümumi Elementlər ---
    const burgerMenu = document.getElementById('burger-menu');
    const navMenu = document.getElementById('nav-menu');

    if (burgerMenu) {
        burgerMenu.addEventListener('click', () => {
            navMenu.classList.toggle('is-open');
        });
    }

    // --- SCROLL ANIMATION VƏ LAZY LOAD MÜŞAHİDƏÇİSİ ---
    const animateElements = document.querySelectorAll('.animate-scroll, .animate-in');
    
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // elementin 10%-i görünəndə
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // .animate-in sinifini səhifə yüklənərkən göstərmək üçün unobserve etmirik (bəzi hallarda)
                if (!entry.target.classList.contains('animate-in')) {
                   observer.unobserve(entry.target); 
                }
            }
        });
    }, observerOptions);

    animateElements.forEach(el => {
        observer.observe(el);
    });

    // --- JSON Data Yüklənməsi (index.html üçün sadələşdirilmiş simulyasiya) ---
    const dataTable = document.getElementById('customer-data-table');
    if (dataTable) {
        // Simulyasiya: Real data.json faylı yoxdursa
        console.warn('JSON data simulyasiya edilir. data.json faylı tələb olunur.');
        // Burada real JSON fetch kodunuz yerləşir.
    }


    // =================================================================
    // --- AUTHENTICATION MƏNTİQİ (Login/Qeydiyyat/Logout) ---
    // =================================================================
    
    const authForm = document.getElementById('auth-form');
    const authBox = document.querySelector('.auth-box');
    const authTitle = document.getElementById('auth-title');
    const toggleAuth = document.getElementById('toggle-auth');
    const logoutBtnChat = document.querySelector('.auth-box .logout-btn');

    // Funksiya: Login statusunu yoxlayır və Chat UI-nı yeniləyir
    function checkAuthStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const userEmail = localStorage.getItem('userEmail');
        
        // Chat səhifəsinə xas elementlər
        if (document.querySelector('.chat-main-container')) {
            const chatSection = document.querySelector('.chat-section');
            if (authBox) {
                if (isLoggedIn) {
                    authBox.querySelector('h3').textContent = `Xoş Gəlmisiniz, ${userEmail}!`;
                    if (authForm) authForm.style.display = 'none';
                    if (toggleAuth) toggleAuth.style.display = 'none';
                    if (logoutBtnChat) logoutBtnChat.style.display = 'block';

                    // Çat hissəsini aktivləşdir
                    chatSection.style.opacity = '1';
                    chatSection.style.pointerEvents = 'auto';
                } else {
                    authBox.querySelector('h3').textContent = authTitle ? authTitle.textContent : 'Daxil Ol';
                    if (authForm) authForm.style.display = 'block';
                    if (toggleAuth) toggleAuth.style.display = 'block';
                    if (logoutBtnChat) logoutBtnChat.style.display = 'none';

                    // Çat hissəsini passivləşdir
                    chatSection.style.opacity = '0.5';
                    chatSection.style.pointerEvents = 'none';
                }
            }
        }
    }
    
    // Auth Form Submit Hadisəsi (Qeydiyyat/Daxil Ol Simulyasiyası)
    if (authForm) {
        if (toggleAuth) {
             toggleAuth.addEventListener('click', (e) => {
                e.preventDefault();
                const isLoginMode = authTitle.textContent === 'Daxil Ol';
                authTitle.textContent = isLoginMode ? 'Qeydiyyatdan Keç' : 'Daxil Ol';
                toggleAuth.textContent = isLoginMode ? 'Daxil Ol' : 'Qeydiyyatdan Keçin';
                authForm.reset();
            });
        }
        
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = authForm.querySelector('input[type="email"]').value.trim();
            
            // İstifadəçinin məlumatını Local Storage-a yaz
            localStorage.setItem('userEmail', emailInput);
            localStorage.setItem('isLoggedIn', 'true');

            const currentMode = authTitle.textContent;
            alert(`${currentMode === 'Qeydiyyatdan Keç' ? 'Uğurlu Qeydiyyat!' : 'Uğurlu Daxil Olma!'} ${emailInput} adından giriş edildi.`);
            
            checkAuthStatus();
            authForm.reset();
        });
    }

    // Çıxış Et Hadisəsi (Chat səhifəsi üçün)
    if (logoutBtnChat) {
        logoutBtnChat.addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userEmail');
            alert('Sistemdən çıxış edildi.');
            location.reload(); 
        });
    }

    // Səhifə yüklənəndə statusu yoxla
    checkAuthStatus();
    
    // =================================================================
    // --- ÇAT FUNKSIONALLIĞI (chat.html) ---
    // =================================================================

    const chatBox = document.getElementById('chat-box');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    if (chatBox && userInput && sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        function sendMessage() {
            const messageText = userInput.value.trim();
            if (messageText === '') return;
            
            appendMessage('user', messageText);
            userInput.value = '';
            simulateAIResponse(messageText);
        }

        function appendMessage(sender, text) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'ai-message');
            
            if (sender !== 'user') {
                const icon = document.createElement('i');
                icon.classList.add('fas', 'fa-robot');
                messageDiv.appendChild(icon);
            }

            const textP = document.createElement('p');
            textP.textContent = text;
            messageDiv.appendChild(textP);

            chatBox.appendChild(messageDiv);
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        function simulateAIResponse(userMessage) {
            let response = "Maraqlı sualdır! Mən dağçılıq və səyahət turları ilə bağlı məlumat bazasına baxıram...";
            const lowerCaseMsg = userMessage.toLowerCase();
            
            if (lowerCaseMsg.includes('bilet') || lowerCaseMsg.includes('uçuş')) {
                response = "Uçuş biletləri üçün 'Uçuş Bileti' səhifəsinə keçməyinizi tövsiyə edirəm.";
            } else if (lowerCaseMsg.includes('alpinist') || lowerCaseMsg.includes('məsləhət')) {
                response = "Bizim təcrübəli alpinistlərimiz var. Hansı dağ marşrutu haqqında məlumat lazımdır?";
            }

            const typingMessage = document.createElement('div');
            typingMessage.classList.add('message', 'ai-message', 'typing-indicator');
            const icon = document.createElement('i');
            icon.classList.add('fas', 'fa-robot');
            const typingDots = document.createElement('p');
            typingDots.innerHTML = '<span>.</span><span>.</span><span>.</span>'; 
            typingMessage.appendChild(icon);
            typingMessage.appendChild(typingDots);
            chatBox.appendChild(typingMessage);
            chatBox.scrollTop = chatBox.scrollHeight;

            setTimeout(() => {
                chatBox.removeChild(typingMessage);
                appendMessage('ai', response);
            }, 1500);
        }
    }
    
    
    // =================================================================
    // --- BİLET REZERVASYASI FUNKSIONALLIĞI (booking.html) ---
    // =================================================================
    
    const flightSearchForm = document.getElementById('flight-search-form');
    const flightResultsContainer = document.getElementById('flight-results-container');
    const reservationModal = document.getElementById('reservation-modal');
    const paymentForm = document.getElementById('payment-form'); // Booking üçün payment form
    const selectedPriceElement = document.getElementById('selected-price');
    const resultPopup = document.getElementById('result-popup');
    const popupTitle = document.getElementById('popup-title');
    const popupMessage = document.getElementById('popup-message');
    const closePopupBtn = resultPopup ? resultPopup.querySelector('.close-popup-btn') : null;
    const modalCloseButtons = document.querySelectorAll('.modal .close-btn, .modal .close-popup-btn');
    let currentFlightDetails = {};


    // Köməkçi Funksiya: Nəticə Popup-unu göstərir (Həm booking, həm routes üçün istifadə olunur)
    function showPopup(title, message, isSuccess = true) {
        if (resultPopup && popupTitle && popupMessage) {
            popupTitle.textContent = title;
            popupMessage.textContent = message;
            popupTitle.style.color = isSuccess ? 'var(--secondary-color)' : '#dc3545';
            resultPopup.style.display = 'block';
        }
    }

    // Modal Bağlama Logic
    modalCloseButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (reservationModal) reservationModal.style.display = 'none';
            if (carReservationModal) carReservationModal.style.display = 'none'; // Routes modalı üçün
            if (resultPopup) resultPopup.style.display = 'none';
        });
    });

    if (window) {
        window.addEventListener('click', (e) => {
            if (e.target === reservationModal) {
                reservationModal.style.display = 'none';
            }
            if (e.target === carReservationModal) {
                 carReservationModal.style.display = 'none';
            }
            if (e.target === resultPopup) {
                resultPopup.style.display = 'none';
            }
        });
    }

    // BOOKING.HTML spesifik funksionallıq
    if (flightSearchForm) {

        // 2. Axtarış Nəticələrini Görüntüləmək (Simulyasiya)
        function displayFlightResults(dep, arr, date, count) {
            if (!flightResultsContainer) return;

            flightResultsContainer.innerHTML = '';
            
            const basePrice = 120;
            const flightOptions = [
                { time: '10:00', carrier: 'AZAL', price: basePrice },
                { time: '15:30', carrier: 'FlyPeak', price: basePrice + 35, type: 'Fast Track' },
                { time: '21:45', carrier: 'Qafqaz Air', price: basePrice + 70, type: 'Business Class' }
            ];

            flightOptions.forEach(option => {
                const card = document.createElement('div');
                card.classList.add('flight-card', 'animate-scroll');
                card.innerHTML = `
                    <div class="flight-details">
                        <p><strong>${option.carrier}</strong> | ${option.time}</p>
                        <p>Gediş: ${dep} | Çatış: ${arr}</p>
                        <p>Tarix: ${date} | Sərnişin: ${count}</p>
                        ${option.type ? `<p style="color:var(--primary-color);">Tip: ${option.type}</p>` : ''}
                    </div>
                    <div class="flight-action">
                        <span class="flight-price">${option.price * count} AZN</span>
                        <button class="btn-secondary reserve-btn" data-price="${option.price * count}">Rezervasiya Et</button>
                    </div>
                `;
                flightResultsContainer.appendChild(card);
            });

            setTimeout(() => {
                const newAnimateElements = flightResultsContainer.querySelectorAll('.animate-scroll');
                newAnimateElements.forEach(el => observer.observe(el)); 
            }, 50);
            
            document.querySelectorAll('.reserve-btn').forEach(button => {
                button.addEventListener('click', handleReservationClick);
            });
        }
        
        // 1. Axtarış Formunun Göndərilməsi
        flightSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const departure = document.getElementById('departure').value;
            const arrival = document.getElementById('arrival').value;
            const departDate = document.getElementById('depart-date').value;
            const passengers = document.getElementById('passengers').value;

            displayFlightResults(departure, arrival, departDate, passengers);
        });

        
        // 3. Rezervasiya Düyməsinə klikləmə (LOGIN CHECK MODAL İLƏ)
        function handleReservationClick(e) {
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

            if (!isLoggedIn) {
                showPopup(
                    'Giriş Tələb Olunur 🛑', 
                    'Bilet rezervasiyası etmək üçün zəhmət olmasa əvvəlcə Qeydiyyatdan keçin və ya Daxil Olun.', 
                    false
                );
                return; 
            }
            
            const price = e.target.getAttribute('data-price');
            currentFlightDetails = { price: price };
            
            if (selectedPriceElement) selectedPriceElement.textContent = price + ' AZN';
            
            // Modal pəncərəni aç
            if (reservationModal) reservationModal.style.display = 'block';
        }

        // 4. Ödəniş Formunun Göndərilməsi (Simulyasiya)
        if (paymentForm) {
            paymentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

                if (!isLoggedIn) {
                    if (reservationModal) reservationModal.style.display = 'none';
                    showPopup( 'Xəta Baş Verdi ⚠️', 'Ödəniş alınmadı: Rezervasiya etmək üçün sistemə daxil olmalısınız!', false);
                    return;
                }
                
                const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
                
                let success = false;
                // Simulyasiya: 16 rəqəm olmalı və 4-lə başlamalı
                if (cardNumber.length === 16 && cardNumber.startsWith('4')) { 
                    success = true;
                } 

                if (reservationModal) reservationModal.style.display = 'none'; // Rezervasiya modalını bağla

                if (success) {
                    showPopup(
                        'Ödəniş Təsdiqləndi! 🎉',
                        `Təbriklər, ${currentFlightDetails.price} AZN dəyərində olan biletiniz uğurla rezervasiya edildi. Təsdiq e-poçtu ${localStorage.getItem('userEmail') || 'ünvanınıza'} göndərildi.`,
                        true
                    );
                } else {
                     showPopup(
                        'Ödəniş Təsdiqlənmədi! ❌',
                        'Kart məlumatlarınızı yoxlayın. Zəhmət olmasa yenidən cəhd edin.',
                        false
                    );
                }
                
                paymentForm.reset();
            });
        }
    }


    // =================================================================
    // --- DƏSTƏK FORMUNUN İDARƏ EDİLMƏSİ (support.html) ---
    // =================================================================

    const supportForm = document.getElementById('direct-support-form');
    const supportMessageStatus = document.getElementById('support-message-status');

    if (supportForm) {
        supportForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            supportMessageStatus.textContent = "Mesajınız göndərilir, zəhmət olmasa gözləyin...";
            supportMessageStatus.style.color = 'var(--primary-color)';
            supportMessageStatus.style.display = 'block';

            setTimeout(() => {
                supportMessageStatus.textContent = "✅ Mesajınız uğurla göndərildi! Ən qısa zamanda sizə cavab veriləcək.";
                supportMessageStatus.style.color = 'var(--secondary-color)';
                supportForm.reset();
            }, 1500);
        });
    }


    // =================================================================
    // --- MARŞRUT PLANLAYICISI VƏ AVTOMOBİL KİRAYƏSİ (routes.html) ---
    // =================================================================

    const routePlanningForm = document.getElementById('route-planning-form');
    const mountainSelect = document.getElementById('mountain-select');
    const routeDetailsContainer = document.getElementById('route-details');
    const carOptionsContainer = document.getElementById('car-options');
    const carSelectionMessage = document.getElementById('car-selection-message');
    const mapPlaceholder = document.getElementById('map-placeholder');

    // Avtomobil Kirayəsi Modal Elementləri
    const carPaymentForm = document.getElementById('payment-form-car');
    const carReservationModal = document.getElementById('reservation-modal'); // Routes modalı
    const selectedCarTypeModal = document.getElementById('selected-car-type-modal');
    const selectedCarPriceModal = document.getElementById('selected-car-price-modal');
    let currentCarDetails = {}; // Seçilmiş avtomobilin məlumatını saxlamaq üçün


    // JSON Dağ Məlumatları və Avtomobil Tövsiyələri
    const mountainData = {
        'shahdag': {
            name: 'Şahdağ (Qusar)',
            safety: 'Yüksək (Turizm infrastrukturu inkişaf edib)',
            path: 'Qusar yolu. Keyfiyyətli **asfalt yol** və kanat. Qışda zəncir tələb oluna bilər. **Ən Sərfəli Yol:** Kompleksə birbaşa asfalt yol.',
            description: 'Azərbaycanın ikinci ən hündür dağı (4243m). Turistlər üçün əsasən Şahdağ Qış-Yay Turizm Kompleksinə gediş nəzərdə tutulur.',
            cars: ['SUV', 'Sedan', 'Minivan'],
            carIcons: { 'SUV': 'fas fa-car-side', 'Sedan': 'fas fa-car', 'Minivan': 'fas fa-bus-alt' },
            // Google Maps iframe URL (Simulyasiya, real linkləri əvəz edin)
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11594.13264426543!2d48.1691383!3d41.3435137!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x403fb232a9cc0a87%3A0x8df5529f796245c6!2sShahdag%20Mountain%20Resort!5e0!3m2!1sen!2saz!4v1700000000000'
        },
        'bazarduzu': {
            name: 'Bazardüzü (Qəbələ/Qusar)',
            safety: 'Çətin (Yalnız peşəkar alpinistlər üçün)',
            path: 'Qəbələ/Qusar tərəfdən kənd yolları. Avtomobil yolu yalnız düşərgə yerinə qədərdir. **Ən Sərfəli Yol:** 4x4 avtomobillə son mümkün nöqtəyə qədər, sonra Trekkinq.',
            description: 'Azərbaycanın ən hündür zirvəsi (4466m). Çox çətin marşrutdur və xüsusi icazə/bələdçi tələb olunur.',
            cars: ['4x4', 'SUV'],
            carIcons: { '4x4': 'fas fa-truck-monster', 'SUV': 'fas fa-car-side' },
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15444.62953252516!2d47.8385317!3d41.2268157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x403f90113c23c65d%3A0x35639f7f44d5c19d!2sMount%20Bazarduzu!5e0!3m2!1sen!2saz!4v1700000000001'
        },
        'tufandag': {
            name: 'Tufandağ (Qəbələ)',
            safety: 'Orta (Dağlıq, lakin bələdçi ilə tövsiyə olunur)',
            path: 'Qəbələ yolu. Tufandağ Qış-Yay Turizm Mərkəzinə qədər **yaxşı asfalt** yol. Yüksəklikdə yalnız piyada marşrutları. **Ən Sərfəli Yol:** Kanat yolundan istifadə etmək.',
            description: 'Gözəl mənzərələri və kanat yolları ilə məşhurdur. Həm istirahət, həm də yüngül alpinizm üçün uygundur.',
            cars: ['SUV', '4x4', 'Sedan'],
            carIcons: { 'SUV': 'fas fa-car-side', '4x4': 'fas fa-truck-monster', 'Sedan': 'fas fa-car' },
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3032.540192534947!2d47.8872958!3d40.9998064!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x403f9a72b53c713b%3A0x1b438287e07a2a5e!2sTufandag%20Mountain%20Resort!5e0!3m2!1sen!2saz!4v1700000000002'
        },
        'khinalig': {
            name: 'Xınalıq Kəndi Yolu (Quba)',
            safety: 'Diqqətli (Yol dar, qışda riskli)',
            path: 'Qubadan Xınalığa gedən yol. Bəzi hissələr **çınqıllı və yoxuşludur**. Sürətli yox, ehtiyatlı sürmə tələb olunur. **Ən Sərfəli Yol:** Yay aylarında, bələdçinin müşayiəti ilə.',
            cars: ['4x4', 'SUV'],
            carIcons: { '4x4': 'fas fa-truck-monster', 'SUV': 'fas fa-car-side' },
            mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2994.482093557434!2d48.1636111!3d41.1394444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x403f7e5e33d0614f%3A0xd64f43407e3295c0!2sKhinalug!5e0!3m2!1sen!2saz!4v1700000000003'
        }
    };

    if (routePlanningForm) {
        routePlanningForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const selectedMountainKey = mountainSelect.value;

            if (selectedMountainKey && mountainData[selectedMountainKey]) {
                const data = mountainData[selectedMountainKey];
                
                // 1. Məlumatları doldur
                document.getElementById('route-mountain').textContent = data.name;
                document.getElementById('route-safety').textContent = data.safety;
                document.getElementById('route-recommended-path').innerHTML = data.path; 
                document.getElementById('route-description').textContent = data.description;
                
                // 2. Google Maps Xəritəsini Yüklə
                mapPlaceholder.innerHTML = `<iframe src="${data.mapUrl}&zoom=12" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
                mapPlaceholder.style.backgroundColor = '#fff';
                
                // 3. Avtomobil seçimlərini doldur
                displayCarOptions(data.cars, data.carIcons);
                
                // 4. Nəticə blokunu göstər və animasiya tətbiq et
                routeDetailsContainer.style.display = 'block';
                
                setTimeout(() => {
                    routeDetailsContainer.classList.add('is-visible');
                }, 50); 
                
            } else {
                alert('Zəhmət olmasa, səyahət etmək istədiyiniz dağı seçin.');
                routeDetailsContainer.style.display = 'none';
                routeDetailsContainer.classList.remove('is-visible');
                mapPlaceholder.innerHTML = `<p style="padding: 20px;">Zəhmət olmasa, yuxarıdan bir dağ seçin və "Marşrutu Göstər" düyməsinə basın.</p>`;
            }
        });
    }

    function displayCarOptions(recommendedCars, icons) {
        carOptionsContainer.innerHTML = '';
        carSelectionMessage.textContent = ''; 

        recommendedCars.forEach(carType => {
            const carCard = document.createElement('div');
            carCard.classList.add('car-card');
            carCard.setAttribute('data-car', carType);
            
            const iconClass = icons[carType] || 'fas fa-car'; 
            
            let price = '';
            if (carType === '4x4') price = '120 AZN/gün';
            else if (carType === 'SUV') price = '80 AZN/gün';
            else if (carType === 'Minivan') price = '95 AZN/gün';
            else if (carType === 'Sedan') price = '50 AZN/gün';

            carCard.innerHTML = `
                <i class="${iconClass}"></i>
                <p>${carType}</p>
                <p style="font-size:0.9em; color: #888;">Kirayə: ${price}</p>
                <button class="btn-primary select-car-btn" style="margin-top: 10px;">Kirayələ</button>
            `;

            carCard.addEventListener('click', (e) => {
                // Animasiya seçimi
                document.querySelectorAll('.car-card').forEach(card => card.classList.remove('selected'));
                carCard.classList.add('selected');
                
                // İstifadəçiyə mesaj ver
                let message = '';
                const selectedMountain = mountainSelect.value;
                
                if (carType === '4x4') {
                    message = `**${carType}** seçildi. Bu, çətin marşrutlar üçün ideal seçimdir.`;
                } else if (carType === 'SUV') {
                    message = `**${carType}** seçildi. Mərkəzi yollar üçün mükəmməldir.`;
                } else if (carType === 'Minivan') {
                    message = `**${carType}** seçildi. Əsasən asfalt yollar və böyük qruplar üçün uygundur.`;
                } else if (carType === 'Sedan') {
                     if (selectedMountain === 'bazarduzu' || selectedMountain === 'khinalig') {
                        message = `**Sedan** seçimi bu marşrut üçün **çox risklidir**. 4x4 tövsiyə olunur!`;
                        carSelectionMessage.style.color = '#dc3545';
                     } else {
                        message = `**Sedan** seçildi. Əsas giriş yolları üçün uyğundur.`;
                        carSelectionMessage.style.color = 'var(--primary-color)'; 
                     }
                }
                
                carSelectionMessage.textContent = message.replace(/\*\*/g, ''); // Markdown işarələrini sil

                // Əgər "Kirayələ" düyməsinə klikləməyibsə, yalnız mesajı göstər
                if (!e.target.classList.contains('select-car-btn')) {
                    return;
                }

                // --- Əsas Məntiq: Modalı Açın ---
                currentCarDetails = { type: carType, price: price };
                
                if (selectedCarTypeModal) selectedCarTypeModal.textContent = carType;
                if (selectedCarPriceModal) selectedCarPriceModal.textContent = price;
                
                // Modalı aç
                if (carReservationModal) carReservationModal.style.display = 'block';

                carSelectionMessage.textContent = `Ödəniş üçün pəncərə açıldı. ${carType} (${price}) seçildi.`;
            });

            carOptionsContainer.appendChild(carCard);
        });
    }

    // --- Avtomobil Kirayəsi Formu Submit Hadisəsi (routes.html) ---
    if (carPaymentForm) {
        carPaymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (carReservationModal) carReservationModal.style.display = 'none';

            const cardNumber = document.getElementById('card-number-car').value.replace(/\s/g, '');
            
            let success = false;
            // Simulyasiya: 16 rəqəm olmalı
            if (cardNumber.length === 16) { 
                success = true;
            } 

            if (success) {
                showPopup(
                    'Kirayə Təsdiqləndi! ✅',
                    `Təbriklər! ${currentCarDetails.type} (${currentCarDetails.price}) avtomobil kirayəsi uğurla tamamlandı. Təsdiq e-poçtu ${localStorage.getItem('userEmail') || 'ünvanınıza'} göndərildi.`,
                    true
                );
            } else {
                 showPopup(
                    'Ödəniş Təsdiqlənmədi! ❌',
                    'Kart məlumatlarınızda xəta var. Zəhmət olmasa, kart nömrəsini yoxlayın.',
                    false
                );
            }
            
            carPaymentForm.reset();
        });
    }
});
// Alpinistlərin Məlumat Bazası (Daha ətraflı bioqrafiya əlavə edildi)
const alpinistsData = [
    {
        id: 1, 
        name: "İsrafil Aşurlı",
        title: "Azərbaycanın Zirvə Fatehçisi",
        image: "./image/isrifal.jpg",
        achievements: [
            "Everest (8848m) zirvəsinin fəthi",
            "Yeddi Zirvə proqramını tamamlayan ilk azərbaycanlı",
            "Lhotse (8516m) və Manaslu (8163m) fəthləri"
        ],
        year: "1969-cu il təvəllüd",
        fullBio: "İsrafil Aşurlı Azərbaycan alpinizminin ən tanınmış simasıdır. O, dünyanın ən yüksək yeddi zirvəsini fəth edərək ölkə tarixində bir ilkə imza atmışdır. Onun məqsədi Azərbaycan gənclərini bu idmana həvəsləndirmək və beynəlxalq arenalarda təmsil etməkdir. O, həmçinin xilasetmə əməliyyatlarında iştirakı ilə də tanınır."
    },
    {
        id: 2,
        name: "Nəcməddin Hacıyev",
        title: "Azərbaycan Alpinizminin Banisi",
        image: "./image/a.avif",
        achievements: [
            "AAF-ın (Alpinizm Federasiyası) ilk prezidenti",
            "Təlimatçı və təşkilatçı"
        ],
        year: "1929-cu il təvəllüd",
        fullBio: "Tibb elmləri doktoru olan Nəcməddin Hacıyev XX əsrin ortalarında Azərbaycanda alpinizmin əsasını qoyan şəxsdir. O, federasiyanın yaranmasında və ilk böyük ekspedisiyaların təşkilində mühüm rol oynamışdır. Onun irsi bu gün də davam edir."
    },
    {
        id: 3,
        name: "Vəfa Musayeva",
        title: "Everestə çixan ilk Qadın ",
        image: "./image/vefa.png",
        achievements: [
            "Vəfa alpinistliyə 2016-cı ildə başlamışdır.",
            "Everest və Lhotze zirvələrini eyni ekspedisiyada fəth edən ilk azərbaycanlı"
        ],
        year: "1930-cu illər",
        fullBio: "Vəfa Musayeva Azərbaycan idman tarixində qadınların alpinizmdə iştirakının ilk parlaq nümunəsidir. Onun 1953-cü ildə qazandığı çempionluq qadınların da dağlara çıxması üçün böyük stimul olmuşdur. O, cəsarəti və əzmi ilə tanınıb."
    }
];


const alpinistList = document.getElementById('alpinist-list');
const modal = document.getElementById('alpinistModal');
const modalBody = document.getElementById('modal-body');
const closeBtn = document.querySelector('.close-btn');


// Əgər əsas konteyner tapılmazsa, funksiyanın işləməsinin qarşısını alan yoxlama
if (!alpinistList) {
    console.error("XƏTA: Kartların əlavə ediləcəyi əsas konteyner (alpinistList) tapılmadı.");
    // Səhv yaranmaması üçün digər kodları işə salma.
} 
// =========================================================================
// 2. KART VƏ MODAL FUNKSİYALARI
// =========================================================================

// Kart Yaratma Funksiyası
function createAlpinistCard(alpinist) {
    // Əgər alpinistList null olarsa, burada səhv yaranmaz, çünki yoxlama artıq yuxarıda aparılıb.
    if (!alpinistList) return; 
    
    const achievementsList = alpinist.achievements.map(achievement => 
        `<li>${achievement}</li>`
    ).join('');

    const cardHTML = `
        <div class="alpinist-card">
            <img src="${alpinist.image}" alt="${alpinist.name} şəkli" class="alpinist-image">
            <div class="card-content">
                <h3 class="card-title">${alpinist.name}</h3>
                <p class="card-info"><span>Fəaliyyət Sahəsi:</span> ${alpinist.title}</p>
                <div class="card-achievements">
                    <h4>Əsas Nailiyyətləri:</h4>
                    <ul>
                        ${achievementsList}
                    </ul>
                </div>
                <button class="read-more-btn" data-id="${alpinist.id}">Ətraflı Oxu</button>
            </div>
        </div>
    `;
    alpinistList.innerHTML += cardHTML;
}

// Bütün alpinist kartlarını yaradırıq
// Yalnız alpinistList tapılıbsa işlət
if (alpinistList && typeof alpinistsData !== 'undefined') {
    alpinistsData.forEach(createAlpinistCard);
}


// Modalı açmaq və məlumatı yükləmək funksiyası
function openModal(alpinistId) {
    if (!modal || !modalBody) return; // Modal elementləri tapılmayıbsa funksiyanı dayandır
    
    // Alpinisti ID-ə görə tapırıq
    const alpinist = alpinistsData.find(a => a.id === parseInt(alpinistId));
    
    if (alpinist) {
        const fullAchievementsList = alpinist.achievements.map(achievement => 
            `<li>${achievement}</li>`
        ).join('');

        modalBody.innerHTML = `
            <div class="modal-header">
                <img src="${alpinist.image}" alt="${alpinist.name}" />
                <h3>${alpinist.name}</h3>
            </div>
            <p><strong>Titulu:</strong> ${alpinist.title}</p>
            <p><strong>Təxmini Dövr:</strong> ${alpinist.year}</p>
            <hr>
            <h4>Bioqrafiya:</h4>
            <p>${alpinist.fullBio}</p>
            <h4>Ətraflı Uğurlar:</h4>
            <ul>
                ${fullAchievementsList}
            </ul>
        `;
        
        modal.style.display = "block"; 
        document.body.style.overflow = "hidden";
    }
}

// Modalı bağlamaq funksiyası
function closeModal() {
    if (!modal) return; // Modal elementi tapılmayıbsa funksiyanı dayandır
    modal.style.display = "none";
    document.body.style.overflow = "auto";
}

// =========================================================================
// 3. HADİSƏ DİNLƏYİCİLƏRİ (EVENT LISTENERS)
// =========================================================================

// Kart siyahısı (alpinistList) tapılıbsa, klikləmə hadisəsini əlavə et
if (alpinistList) {
    alpinistList.addEventListener('click', (e) => {
        // Klikləmə hədəfi 'read-more-btn' sinifinə malikdirsə (yəni düymədirsə)
        if (e.target.classList.contains('read-more-btn')) {
            const id = e.target.getAttribute('data-id');
            openModal(id);
        }
    });
}

// Çarpaz işarəyə (X) klik
if (closeBtn) {
    closeBtn.onclick = closeModal;
}


// İstifadəçi modalın kənarına kliklədikdə bağlamaq
window.onclick = function(event) {
    if (modal && event.target == modal) {
        closeModal();
    }
}

// ESC düyməsinə basanda bağlamaq
document.addEventListener('keydown', (e) => {
    if (modal && e.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
});

// modalCloseButtons dəyişəni artıq lazım deyil. Onu ya silin, ya da təyin edin:
// const modalCloseButtons = document.querySelectorAll('.modal .close-btn, .modal .close-popup-btn');
// =========================================================================
// MÜŞTƏRİ PROFİLİ KARTLARININ DATA.JSON-DAN ÇƏKİLƏRƏK YARADILMASI
// =========================================================================

const profilesContainer = document.getElementById('touristProfilesContainer');
// totalProfilesCount elementi təqdim etdiyiniz HTML-də yoxdur, 
// lakin əgər əlavə etmək istəsəniz, burada qalsın.
const totalProfilesCount = document.getElementById('total-profiles-count'); 
const jsonFilePath = 'data.json'; // JSON faylının yolu dəyişdirildi

/**
 * Müştəri kartlarını DOM-a əlavə edən funksiya
 * @param {Array<Object>} profilesData - Müştəri məlumatları massivi
 */
function renderCustomerProfiles(profilesData) {
    if (!profilesContainer) {
        console.error("XƏTA: touristProfilesContainer elementi tapılmadı.");
        return;
    }

    // Yüklənmə mesajını təmizlə
    profilesContainer.innerHTML = ''; 

    if (profilesData && profilesData.length > 0) {
        
        // Əgər totalProfilesCount elementi varsa, ümumi sayı yenilə
        if (totalProfilesCount) {
            totalProfilesCount.textContent = profilesData.length;
        }

        profilesData.forEach((profile, index) => {
            // Sadiqlik xalına görə sinif təyin etmək
            let pointClass = '';
            // Loyal balın yüksəkliyini və aşağılığını müəyyən edir
            if (profile.loyalty_point > 800) {
                pointClass = 'high-interest';
            } else if (profile.loyalty_point < 100) {
                pointClass = 'low-interest';
            }

            // Məlumatı HTML kart formatında qurmaq (Əvvəlki CSS dizaynına uyğundur)
            const cardHTML = `
                <div class="tourist-card" style="animation-delay: ${0.1 * index}s;">
                    
                    <div class="card-name">
                        ${profile.name}
                    </div>
                    
                    <div class="card-details">
                        <div class="detail-item">
                            <strong><i class="fas fa-envelope"></i> Email:</strong> ${profile.email}
                        </div>
                        
                        <div class="detail-item">
                            <strong><i class="fas fa-calendar-alt"></i> Qeyd. Tarixi:</strong> ${profile.registration_date}
                        </div>
                        
                        <div class="detail-item">
                            <strong><i class="fas fa-route"></i> Son Tur:</strong> ${profile.last_tour}
                        </div>
                        
                        <div class="detail-item ${pointClass}">
                            <strong><i class="fas fa-star"></i> Sadiqlik Balı:</strong> ${profile.loyalty_point}
                        </div>

                        <div class="detail-item">
                            <strong><i class="fas fa-check-circle"></i> Status:</strong> ${profile.is_active ? 'Aktiv' : 'Passiv'}
                        </div>
                    </div>
                </div>
            `;
            
            profilesContainer.innerHTML += cardHTML;
        });

    } else {
        profilesContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Heç bir müştəri profili tapılmadı.</p>';
    }
}


// JSON faylından datanı çəkmək (Fetch)
fetch(jsonFilePath)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP xətası! Status: ${response.status}. Fayl yolu: ${jsonFilePath}`);
        }
        return response.json(); 
    })
    .then(data => {
        // Datanı uğurla çəkdikdən sonra kartları yarat
        renderCustomerProfiles(data);
    })
    .catch(error => {
        // Hər hansı bir xəta zamanı istifadəçiyə məlumat ver
        console.error("Müştəri məlumatları çəkilərkən xəta baş verdi:", error);
        if (profilesContainer) {
             profilesContainer.innerHTML = '<p style="color: red; text-align: center;">Məlumatlar yüklənərkən xəta baş verdi. Konsolu yoxlayın.</p>';
        }
    });
    // =========================================================================
// TUFANDAĞ MODAL FUNKSIONALLIĞI
// =========================================================================

const paymentModalTufandag = document.getElementById('payment-modal-tufandag');
const closeBtnTufandag = paymentModalTufandag ? paymentModalTufandag.querySelector('.close-btn') : null;
const selectedTourNameTufandag = document.getElementById('selected-tour-name-tufandag');
const selectedTourPriceTufandag = document.getElementById('selected-tour-price-tufandag');
const buyTourButtonsTufandag = document.querySelectorAll('.buy-tour-tufandag');
const paymentFormTufandag = document.getElementById('payment-form-tufandag');
const cardNumberInputTufandag = document.getElementById('card-number-tufandag');
const expiryDateInputTufandag = document.getElementById('expiry-date-tufandag');


// Modalı Açma Funksiyası
function openTufandagModal(name, price) {
    if (paymentModalTufandag && selectedTourNameTufandag && selectedTourPriceTufandag) {
        selectedTourNameTufandag.textContent = name;
        selectedTourPriceTufandag.textContent = `${price} AZN`;
        
        paymentModalTufandag.style.display = "block"; 
        document.body.style.overflow = "hidden";
    }
}

// Modalı Bağlama Funksiyası
function closeTufandagModal() {
    if (paymentModalTufandag) {
        paymentModalTufandag.style.display = "none";
        document.body.style.overflow = "auto";
        if (paymentFormTufandag) {
             paymentFormTufandag.reset();
        }
    }
}


// "Turu Al" Düymələrinə Hadisə Dinləyiciləri
if (buyTourButtonsTufandag.length > 0) {
    buyTourButtonsTufandag.forEach(button => {
        button.addEventListener('click', (e) => {
            const tourName = e.target.getAttribute('data-tour-name');
            const tourPrice = e.target.getAttribute('data-price');
            
            if (tourName && tourPrice) {
                openTufandagModal(tourName, tourPrice);
            }
        });
    });
}

// Kart Nömrəsi Formatlaşdırılması (Tufandağ)
if (cardNumberInputTufandag) {
    cardNumberInputTufandag.addEventListener('input', (e) => {
        let { value } = e.target;
        value = value.replace(/\D/g, ''); 
        value = value.replace(/(\d{4})(?=\d)/g, '$1 '); 
        e.target.value = value.trim();
    });
}

// Bitiş Tarixinin formatlaşdırılması (Tufandağ)
if (expiryDateInputTufandag) {
    expiryDateInputTufandag.addEventListener('input', (e) => {
        let { value } = e.target;
        value = value.replace(/\D/g, ''); 
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    });
}


// Modal Bağlama Hadisə Dinləyiciləri
if (closeBtnTufandag) {
    closeBtnTufandag.onclick = closeTufandagModal;
}

// Kənara kliklədikdə bağlamaq (Tufandağ)
window.onclick = function(event) {
    // Digər modallarla toqquşmamaq üçün şərt qoyulur
    if (paymentModalTufandag && event.target == paymentModalTufandag) {
        closeTufandagModal();
    }
}

// ESC düyməsinə basanda bağlamaq (Tufandağ)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && paymentModalTufandag && paymentModalTufandag.style.display === 'block') {
        closeTufandagModal();
    }
});


// Ödəniş Formunun Göndərilməsi (Demo Məqsədilə)
if (paymentFormTufandag) {
    paymentFormTufandag.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Sadə forma yoxlaması
        if (cardNumberInputTufandag.value.replace(/\s/g, '').length !== 16) {
            alert("Xəta: Kart nömrəsi 16 rəqəm olmalıdır.");
            return;
        }

        const tourName = selectedTourNameTufandag.textContent;
        alert(`Təbriklər! Tufandağ üçün "${tourName}" turu üçün ödənişiniz (simulyasiya edilmiş) uğurla qəbul edildi.`);
        
        closeTufandagModal();
    });
}