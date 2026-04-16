const cursorGlow = document.getElementById('cursor-glow');
const gridOverlay = document.getElementById('grid-overlay');
const interactiveEls = document.querySelectorAll('a, button, .bento-card, .feature-card, .type-card');

document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;

    // Cursor position
    cursorGlow.style.left = `${x}px`;
    cursorGlow.style.top = `${y}px`;

    // Grid Parallax
    const moveX = (x / window.innerWidth - 0.5) * 40;
    const moveY = (y / window.innerHeight - 0.5) * 40;
    gridOverlay.style.transform = `rotateX(60deg) translate(${moveX}px, ${moveY}px)`;
});

interactiveEls.forEach(el => {
    el.addEventListener('mouseenter', () => cursorGlow.classList.add('active'));
    el.addEventListener('mouseleave', () => cursorGlow.classList.remove('active'));
});

// --- Scroll Reveal Animations ---
const revealElements = document.querySelectorAll('.reveal-up');
const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
}, revealOptions);

revealElements.forEach(el => revealObserver.observe(el));

// --- 3D Hover Tilt Effect on Cards (Bento & Features) ---
const tiltCards = document.querySelectorAll('.tilt-card');

tiltCards.forEach(card => {
    const inner = card.querySelector('.card-inner');
    if (!inner) return;

    // Elements to move independently for depth
    const moveEls = card.querySelectorAll('.feature-icon, .card-icon, .type-header, .feature-title, .card-title, .type-title');

    // Create glare element
    const glare = document.createElement('div');
    glare.className = 'glare-effect';
    inner.appendChild(glare);

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const tiltX = ((y - centerY) / centerY) * -10;
        const tiltY = ((x - centerX) / centerX) * 10;

        inner.style.transform = `translateZ(30px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

        // Move inner elements for parallax depth
        moveEls.forEach(el => {
            el.style.transform = `translateZ(60px) translate(${(x - centerX) * 0.05}px, ${(y - centerY) * 0.05}px)`;
        });

        // Move glare
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(226, 253, 112, 0.2) 0%, transparent 60%)`;
    });

    card.addEventListener('mouseleave', () => {
        inner.style.transform = `translateZ(30px) rotateX(0deg) rotateY(0deg)`;
        moveEls.forEach(el => {
            el.style.transform = `translateZ(40px) translate(0, 0)`;
        });
        glare.style.background = `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, transparent 60%)`;
    });
});

// --- Magnetic Button Effect ---
const magneticBtns = document.querySelectorAll('.magnetic-btn');

magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Gentle pull towards cursor
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = `translate(0px, 0px)`;
    });
});

// --- Navbar scroll effect ---
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Number Count Up Animation
const countElements = document.querySelectorAll('.count-up');

const observerOptions = {
    threshold: 0.5
};

const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            animateValue(entry.target, 0, target, 2000);
            countObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

countElements.forEach(el => countObserver.observe(el));

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);

        // Easing function for smooth deceleration
        const easeOutQuad = t => t * (2 - t);
        const currentProgress = easeOutQuad(progress);

        obj.innerHTML = Math.floor(currentProgress * (end - start)).toLocaleString();

        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            obj.innerHTML = end.toLocaleString();
            // Subtle pop animation when done
            obj.style.transform = 'scale(1.1)';
            setTimeout(() => obj.style.transform = 'scale(1)', 200);
        }
    };
    window.requestAnimationFrame(step);
}

// Modal Interaction
const modal = document.getElementById('quote-modal');
const quoteBtns = document.querySelectorAll('#quote-btn, #hero-quote-btn');
const closeBtn = document.getElementById('modal-close');

quoteBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
});

closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
});

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
});

// --- 연락처 자동 하이픈 포맷팅 ---
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        // 숫자만 추출
        let digits = e.target.value.replace(/\D/g, '');

        // 최대 11자리 제한
        if (digits.length > 11) digits = digits.slice(0, 11);

        // 포맷 적용: 010-XXXX-XXXX 또는 02-XXXX-XXXX 등
        let formatted = '';
        if (digits.startsWith('02')) {
            // 서울 지역번호 (02-XXXX-XXXX)
            if (digits.length <= 2) {
                formatted = digits;
            } else if (digits.length <= 6) {
                formatted = digits.slice(0, 2) + '-' + digits.slice(2);
            } else {
                formatted = digits.slice(0, 2) + '-' + digits.slice(2, 6) + '-' + digits.slice(6);
            }
        } else {
            // 010, 011, 0XX 등 (XXX-XXXX-XXXX)
            if (digits.length <= 3) {
                formatted = digits;
            } else if (digits.length <= 7) {
                formatted = digits.slice(0, 3) + '-' + digits.slice(3);
            } else {
                formatted = digits.slice(0, 3) + '-' + digits.slice(3, 7) + '-' + digits.slice(7);
            }
        }

        e.target.value = formatted;
    });
}

// 텔레그램 연동 설정을 위한 상수 (나중에 직접 채워주세요!)
const TELEGRAM_BOT_TOKEN = '8602319567:AAG8VPaq0Ia0DsRAPe5fyCKXo6yzA40kSm0';
const TELEGRAM_CHAT_ID = '8781562240';

// Form submission (Telegram Integration)
const quoteForm = document.getElementById('quote-form');
if (quoteForm) {
    quoteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = quoteForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;

        // 데이터 수집
        const carNum = document.getElementById('car-num').value;
        const phone = document.getElementById('phone').value;
        const privacyCheck = document.getElementById('privacy-check');

        // 동의 여부 확인
        if (privacyCheck && !privacyCheck.checked) {
            alert('개인정보 수집 및 이용에 동의해주세요.');
            return;
        }

        // 버튼 상태 변경
        submitBtn.innerHTML = '<span class="spinner"></span> 전송 중...';
        submitBtn.disabled = true;

        // 텔레그램 메시지 구성
        const message = `🔔 [폐차라이프] 신규 견적 요청\n\n🚗 차량번호: ${carNum}\n📞 연락처: ${phone}\n⏰ 일시: ${new Date().toLocaleString()}`;

        try {
            // 실제 전송 (토큰이 설정되어 있을 때만 실행)
            if (TELEGRAM_BOT_TOKEN !== 'YOUR_BOT_TOKEN_HERE') {
                const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: TELEGRAM_CHAT_ID,
                        text: message
                    })
                });

                if (!response.ok) throw new Error('Telegram API Error');
            } else {
                // 테스트 모드 (토큰이 없을 때)
                console.log('Telegram Test Mode:', message);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            // 성공 UI 처리
            submitBtn.innerHTML = '문자가 발송되었습니다 ✓';
            submitBtn.style.backgroundColor = '#e2fd70';
            submitBtn.style.color = '#0a0a0c';

            setTimeout(() => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
                quoteForm.reset();

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style = '';
                }, 300);
            }, 1500);

        } catch (error) {
            console.error('Submission Error:', error);
            submitBtn.innerHTML = '전송 실패 (다시 시도)';
            submitBtn.style.backgroundColor = '#ef4444';
            submitBtn.disabled = false;

            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style = '';
            }, 3000);
        }
    });
}

// --- Dynamic Reviews Loading ---
const reviewsData = [
    { name: "김성환", formatName: "김**", type: "조기폐차", typeClass: "type-early", date: "2026.01.20", text: "노후 경유차라 조기폐차 알아보다가 신청했는데, 보조금 신청부터 성능검사까지 알아서 다 해주셔서 너무 편했습니다. 감사합니다." },
    { name: "박지영", formatName: "박**", type: "일반폐차", typeClass: "type-general", date: "2026.01.24", text: "다른 곳보다 폐차 보상금을 더 많이 쳐주셨어요! 당일에 바로 견인해가시고 말소증도 문자로 바로 보내주셔서 믿음이 갑니다." },
    { name: "이재훈", formatName: "이**", type: "압류폐차", typeClass: "type-foreclosure", date: "2026.01.25", text: "압류가 좀 잡혀있어서 걱정했는데 차령초과말소 제도로 합법적으로 처리해주셨습니다. 상담사분이 정말 친절하세요." },
    { name: "최은주", formatName: "최**", type: "조기폐차", typeClass: "type-early", date: "2026.01.28", text: "서류 준비할 게 많을 줄 알았는데 안내해주신 대로만 하니까 금방 끝났어요. 입금도 약속한 시간에 정확히 들어왔습니다." },
    { name: "정민수", formatName: "정**", type: "일반폐차", typeClass: "type-general", date: "2026.02.02", text: "차량이 완전히 방전돼서 꼼짝도 못하는 상태였는데, 무료로 안전하게 견인해 주셔서 정말 다행이었습니다." },
    { name: "강동철", formatName: "강**", type: "일반폐차", typeClass: "type-general", date: "2026.02.05", text: "여러 군데 비교해봤는데 여기가 제일 조건이 좋았어요. 진행 상황도 중간중간 투명하게 알려주셔서 안심할 수 있었습니다." },
    { name: "윤진호", formatName: "윤**", type: "압류폐차", typeClass: "type-foreclosure", date: "2026.02.10", text: "골치 아픈 문제였는데 전문가분들이 나서서 해결해주시니 속이 다 후련하네요. 주위에도 적극 추천하겠습니다!" },
    { name: "송미영", formatName: "송**", type: "조기폐차", typeClass: "type-early", date: "2026.02.15", text: "처음 해보는 폐차라 막막했는데 첫 전화 상담부터 마무리까지 완벽했습니다. 폐차라이프 화이팅!" },
    { name: "한수진", formatName: "한**", type: "일반폐차", typeClass: "type-general", date: "2026.02.20", text: "신속 정확 그 자체! 오전 일찍 연락드렸는데 점심때쯤 벌써 말소증이 날아왔네요. 일처리 속도에 감탄했습니다." }
];

function loadRandomReviews() {
    const container = document.getElementById('reviews-container');
    if (!container) return;

    const shuffled = [...reviewsData].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    const gridHTML = document.createElement('div');
    gridHTML.className = 'reviews-grid';

    selected.forEach((review, index) => {
        const delay = (index + 1) * 0.1;
        const cardHTML = `
            <div class="review-card ${review.typeClass} reveal-up" style="--stagger: ${delay}s;">
                <div class="review-header">
                    <div class="reviewer-profile">
                        <div class="reviewer-avatar">${review.formatName}</div>
                        <div class="reviewer-info">
                            <span class="reviewer-name">${review.name}</span>
                            <span class="review-type">${review.type}</span>
                        </div>
                    </div>
                    <div class="review-stars">★★★★★</div>
                </div>
                <div class="review-text">"${review.text}"</div>
                <div class="review-date">${review.date}</div>
            </div>
        `;
        gridHTML.innerHTML += cardHTML;
    });

    container.innerHTML = '';
    container.appendChild(gridHTML);
    const newRevealElements = container.querySelectorAll('.reveal-up');
    newRevealElements.forEach(el => revealObserver.observe(el));
}

function initVisitorCounter() {
    const dailyCounterEl = document.getElementById('daily-visitors');
    const totalCounterEl = document.getElementById('total-visitors');
    const currentYearEl = document.getElementById('current-year');

    if (!dailyCounterEl || !totalCounterEl) return;
    if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const secondsPassedToday = (now - startOfDay) / 1000;

    let dailyVisitors = 180 + Math.floor(secondsPassedToday / 180) * 2;
    const launchDate = new Date(2025, 0, 1);
    const daysSinceLaunch = Math.floor((now - launchDate) / (1000 * 60 * 60 * 24));
    let totalVisitors = 15000 + (daysSinceLaunch * 350) + dailyVisitors;

    setInterval(() => {
        if (Math.random() > 0.7) {
            const increment = Math.floor(Math.random() * 4) + 1;
            dailyVisitors += increment;
            totalVisitors += increment;
            updateDisplay();
        }
    }, 8000);

    function updateDisplay() {
        dailyCounterEl.textContent = dailyVisitors.toLocaleString();
        totalCounterEl.textContent = totalVisitors.toLocaleString();
    }
    updateDisplay();
}

document.addEventListener('DOMContentLoaded', () => {
    loadRandomReviews();
    initVisitorCounter();
    initLiveTicker();
    initFAQ();
    initFloatingCTA();
    initPrivacyModal();
});

// --- Live Ticker Logic ---
function initLiveTicker() {
    const ticker = document.getElementById('live-ticker');
    if (!ticker) return;

    const cities = ["서울 강남구", "서울 송파구", "경기 수원시", "경기 용인시", "인천 남동구", "부산 해운대구", "대구 수성구", "대전 유성구", "광주 북구", "경기 고양시", "서울 강서구", "충남 천안시"];
    const models = ["소나타", "아반떼", "그랜저", "싼타페", "카니발", "모닝", "K5", "K7", "스포티지", "쏘렌토", "제네시스", "봉고"];

    function createTickerItem() {
        const city = cities[Math.floor(Math.random() * cities.length)];
        const model = models[Math.floor(Math.random() * models.length)];
        const plate = (Math.floor(Math.random() * 90) + 10) + " * ****";
        const time = (Math.floor(Math.random() * 10) + 1) + "분 전";

        const li = document.createElement('li');
        li.className = 'ticker-item';
        li.innerHTML = `
            <div class="ticker-info">
                <span class="ticker-city">${city}</span>
                <span class="ticker-model">${model} (${plate})</span>
            </div>
            <span class="ticker-status">폐차 완료 <span class="ticker-time">${time}</span></span>
        `;
        return li;
    }

    // Initial fill
    for (let i = 0; i < 6; i++) {
        ticker.appendChild(createTickerItem());
    }

    // Animation loop
    function scrollTicker() {
        const firstItem = ticker.firstElementChild;
        if (!firstItem) return;

        const itemHeight = firstItem.offsetHeight;
        ticker.style.transition = 'transform 0.8s cubic-bezier(0.65, 0, 0.35, 1)';
        ticker.style.transform = `translateY(-${itemHeight}px)`;

        setTimeout(() => {
            ticker.style.transition = 'none';
            ticker.style.transform = 'translateY(0)';
            ticker.appendChild(firstItem);
        }, 800);
    }

    setInterval(scrollTicker, 3000);
}

// --- FAQ Interaction ---
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });
}

// --- Floating CTA ---
function initFloatingCTA() {
    const cta = document.getElementById('floating-quote');
    if (!cta) return;

    cta.addEventListener('click', () => {
        const modal = document.getElementById('quote-modal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    });

    // Show/hide on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            cta.style.opacity = '1';
            cta.style.pointerEvents = 'auto';
            cta.style.transform = 'translateY(0)';
        } else {
            cta.style.opacity = '0';
            cta.style.pointerEvents = 'none';
            cta.style.transform = 'translateY(20px)';
        }
    });
}
// --- Privacy Modal Initialization ---
function initPrivacyModal() {
    const privacyModal = document.getElementById('privacy-modal');
    const openPrivacy = document.getElementById('privacy-link');
    const closeBtn = document.getElementById('privacy-modal-close');
    const okBtn = document.getElementById('privacy-modal-ok');

    if (!privacyModal || !openPrivacy) return;

    const closeModal = () => {
        privacyModal.classList.remove('active');
        if (!document.getElementById('quote-modal').classList.contains('active')) {
            document.body.style.overflow = '';
        }
    };

    openPrivacy.addEventListener('click', (e) => {
        e.preventDefault();
        privacyModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    [closeBtn, okBtn].forEach(btn => {
        if (btn) btn.addEventListener('click', closeModal);
    });

    privacyModal.addEventListener('click', (e) => {
        if (e.target === privacyModal) closeModal();
    });
}
