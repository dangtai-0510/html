// Biến toàn cục
let currentZoom = 1;
const minZoom = 0.5;
const maxZoom = 3;
const zoomStep = 0.2;
let audioEnabled = true;
let audioContext = null;
let isFullscreen = false;

// DOM Elements
const flagContainer = document.getElementById('flagContainer');
const flag = document.getElementById('flag');
const zoomIndicator = document.getElementById('zoomIndicator');
const particlesContainer = document.getElementById('particles');
const clickPrompt = document.getElementById('clickPrompt');
const messageModal = document.getElementById('messageModal');
const closeModal = document.getElementById('closeModal');
const controls = {
    zoomIn: document.getElementById('zoomIn'),
    zoomOut: document.getElementById('zoomOut'),
    reset: document.getElementById('reset'),
    fullscreen: document.getElementById('fullscreen'),
    audio: document.getElementById('audioToggle')
};

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    startIntroAnimation();
});

// Khởi tạo ứng dụng
function initializeApp() {
    updateZoomIndicator();
    initAudioContext();
    
    // Kiểm tra support fullscreen
    if (!document.fullscreenEnabled && !document.webkitFullscreenEnabled) {
        controls.fullscreen.style.opacity = '0.5';
        controls.fullscreen.disabled = true;
    }
}

// Thiết lập event listeners
function setupEventListeners() {
    // Zoom controls
    controls.zoomIn.addEventListener('click', zoomIn);
    controls.zoomOut.addEventListener('click', zoomOut);
    controls.reset.addEventListener('click', resetView);
    controls.fullscreen.addEventListener('click', toggleFullscreen);
    controls.audio.addEventListener('click', toggleAudio);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);
    
    // Mouse wheel zoom
    flagContainer.addEventListener('wheel', handleMouseWheel, { passive: false });
    
    // Touch gestures for mobile
    let initialDistance = 0;
    let lastTouchTime = 0;
    
    // Click prompt and message modal
    clickPrompt.addEventListener('click', showMessage);
    closeModal.addEventListener('click', hideMessage);
    messageModal.addEventListener('click', (e) => {
        if (e.target === messageModal) {
            hideMessage();
        }
    });
    
    flagContainer.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            initialDistance = getTouchDistance(e.touches);
        }
        
        // Double tap detection
        const currentTime = new Date().getTime();
        if (currentTime - lastTouchTime < 300) {
            toggleFullscreen();
        }
        lastTouchTime = currentTime;
    });
    
    flagContainer.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const currentDistance = getTouchDistance(e.touches);
            const scale = currentDistance / initialDistance;
            
            if (scale > 1.1) {
                zoomIn();
                initialDistance = currentDistance;
            } else if (scale < 0.9) {
                zoomOut();
                initialDistance = currentDistance;
            }
        }
    });
    
    // Fullscreen change events
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    
    // Window resize
    window.addEventListener('resize', handleResize);
}

// Xử lý phím tắt
function handleKeyboard(e) {
    switch(e.key) {
        case '+':
        case '=':
            e.preventDefault();
            zoomIn();
            break;
        case '-':
        case '_':
            e.preventDefault();
            zoomOut();
            break;
        case '0':
        case 'Home':
            e.preventDefault();
            resetView();
            break;
        case 'f':
        case 'F':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                toggleFullscreen();
            }
            break;
        case 'Escape':
            if (isFullscreen) {
                toggleFullscreen();
            }
            break;
        case 'm':
        case 'M':
            toggleAudio();
            break;
        case 'Enter':
        case ' ':
            if (clickPrompt.style.opacity !== '0' && !messageModal.classList.contains('active')) {
                e.preventDefault();
                showMessage();
            } else if (messageModal.classList.contains('active')) {
                e.preventDefault();
                hideMessage();
            }
            break;
        case 'r':
        case 'R':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                location.reload();
            }
            break;
    }
}

// Xử lý mouse wheel
function handleMouseWheel(e) {
    e.preventDefault();
    
    if (e.deltaY < 0) {
        zoomIn();
    } else {
        zoomOut();
    }
}

// Lấy khoảng cách giữa 2 touch points
function getTouchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

// Phóng to
function zoomIn() {
    if (currentZoom < maxZoom) {
        currentZoom = Math.min(maxZoom, currentZoom + zoomStep);
        applyZoom();
        playInteractionSound(440);
    }
}

// Thu nhỏ
function zoomOut() {
    if (currentZoom > minZoom) {
        currentZoom = Math.max(minZoom, currentZoom - zoomStep);
        applyZoom();
        playInteractionSound(330);
    }
}

// Reset view
function resetView() {
    currentZoom = 1;
    applyZoom();
    
    if (isFullscreen) {
        toggleFullscreen();
    }
    
    playInteractionSound(523);
    
    // Restart animation
    setTimeout(() => {
        flagContainer.style.animation = 'none';
        flagContainer.offsetHeight; // Trigger reflow
        flagContainer.style.animation = 'flagEntrance 2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
        
        const star = document.querySelector('.star');
        star.style.animation = 'none';
        star.offsetHeight;
        star.style.animation = 'starAppear 1.5s ease-out 0.5s forwards';
    }, 100);
}

// Áp dụng zoom
function applyZoom() {
    flagContainer.style.setProperty('--zoom-scale', currentZoom);
    flagContainer.classList.add('zoomed');
    updateZoomIndicator();
    
    // Thêm hiệu ứng pulse khi zoom
    flagContainer.style.animation = 'pulse 0.3s ease-out';
    setTimeout(() => {
        flagContainer.style.animation = '';
    }, 300);
}

// Cập nhật zoom indicator
function updateZoomIndicator() {
    const percentage = Math.round(currentZoom * 100);
    zoomIndicator.textContent = `${percentage}%`;
    
    // Thay đổi màu theo mức zoom
    if (currentZoom > 1.5) {
        zoomIndicator.style.background = 'rgba(255, 0, 0, 0.7)';
    } else if (currentZoom < 0.8) {
        zoomIndicator.style.background = 'rgba(0, 100, 255, 0.7)';
    } else {
        zoomIndicator.style.background = 'rgba(0, 0, 0, 0.7)';
    }
}

// Toggle fullscreen
function toggleFullscreen() {
    if (!isFullscreen) {
        enterFullscreen();
    } else {
        exitFullscreen();
    }
}

// Vào fullscreen
function enterFullscreen() {
    const elem = document.documentElement;
    
    if (elem.requestFullscreen) {
        elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
    }
    
    // Backup method nếu fullscreen API không khả dụng
    setTimeout(() => {
        flagContainer.classList.add('fullscreen-mode');
        controls.fullscreen.textContent = '⛶';
        playInteractionSound(659);
    }, 100);
}

// Thoát fullscreen
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
    
    flagContainer.classList.remove('fullscreen-mode');
    controls.fullscreen.textContent = '⛶';
    playInteractionSound(523);
}

// Xử lý thay đổi fullscreen
function handleFullscreenChange() {
    isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement);
    
    if (!isFullscreen) {
        flagContainer.classList.remove('fullscreen-mode');
        controls.fullscreen.textContent = '⛶';
    }
}

// Xử lý resize window
function handleResize() {
    // Điều chỉnh particles khi resize
    clearParticles();
    setTimeout(createParticles, 500);
}

// Toggle audio
function toggleAudio() {
    audioEnabled = !audioEnabled;
    controls.audio.textContent = audioEnabled ? '🔊' : '🔇';
    controls.audio.style.opacity = audioEnabled ? '1' : '0.5';
    
    if (audioEnabled) {
        playInteractionSound(880);
    }
}

// Khởi tạo Audio Context
function initAudioContext() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.warn('Web Audio API không được hỗ trợ:', e);
        audioEnabled = false;
        controls.audio.style.opacity = '0.5';
    }
}

// Phát âm thanh tương tác
function playInteractionSound(frequency = 440) {
    if (!audioEnabled || !audioContext) return;
    
    try {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        console.warn('Không thể phát âm thanh:', e);
    }
}

// Phát âm thanh intro
function playIntroSound() {
    if (!audioEnabled || !audioContext) return;
    
    try {
        // Tạo giai điệu intro
        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
        const duration = 0.4;
        
        notes.forEach((frequency, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
                oscillator.type = 'triangle';
                
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + duration);
            }, index * 300);
        });
    } catch (e) {
        console.warn('Không thể phát âm thanh intro:', e);
    }
}

// Tạo particles
function createParticles() {
    const particleCount = window.innerWidth > 768 ? 50 : 25;
    
    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 8 + 's';
            particle.style.animationDuration = (8 + Math.random() * 4) + 's';
            
            // Random colors for some particles
            if (Math.random() < 0.3) {
                particle.style.background = '#da251d';
            }
            
            particlesContainer.appendChild(particle);
            
            // Xóa particle sau animation
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 12000);
        }, i * 100);
    }
}

// Xóa tất cả particles
function clearParticles() {
    while (particlesContainer.firstChild) {
        particlesContainer.removeChild(particlesContainer.firstChild);
    }
}

// Bắt đầu animation intro
function startIntroAnimation() {
    setTimeout(() => {
        playIntroSound();
    }, 500);
    
    setTimeout(() => {
        createParticles();
    }, 3000);
    
    // Tự động tạo particles mới
    setInterval(() => {
        if (document.visibilityState === 'visible') {
            createParticles();
        }
    }, 15000);
}

// Xử lý khi tab được focus/blur
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        // Pause animations when tab is hidden
        flagContainer.style.animationPlayState = 'paused';
    } else {
        // Resume animations when tab is visible
        flagContainer.style.animationPlayState = 'running';
        createParticles();
    }
});

// Hiển thị thông điệp
function showMessage() {
    clickPrompt.classList.add('clicked');
    messageModal.classList.add('active');
    
    // Phát âm thanh đặc biệt
    playCelebrationSound();
    
    // Tạo hiệu ứng pháo hoa particles
    createFireworks();
    
    // Ẩn click prompt
    setTimeout(() => {
        clickPrompt.style.display = 'none';
    }, 300);
}

// Ẩn thông điệp
function hideMessage() {
    messageModal.classList.remove('active');
    
    // Hiện lại click prompt sau 1 giây
    setTimeout(() => {
        clickPrompt.style.display = 'block';
        clickPrompt.classList.remove('clicked');
    }, 1000);
}

// Tạo hiệu ứng pháo hoa
function createFireworks() {
    const colors = ['#ffdd00', '#da251d', '#ff6b6b', '#4ecdc4', '#45b7d1'];
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.style.cssText = `
                position: absolute;
                width: 6px;
                height: 6px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                pointer-events: none;
                z-index: 10000;
                box-shadow: 0 0 10px currentColor;
            `;
            
            document.body.appendChild(firework);
            
            // Animation
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 100;
            const duration = 1000 + Math.random() * 1000;
            
            firework.animate([
                {
                    transform: 'translate(0, 0) scale(0)',
                    opacity: 1
                },
                {
                    transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(1)`,
                    opacity: 1
                },
                {
                    transform: `translate(${Math.cos(angle) * distance * 1.5}px, ${Math.sin(angle) * distance * 1.5 + 50}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: duration,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => {
                firework.remove();
            };
        }, i * 50);
    }
}

// Phát âm thanh ăn mừng
function playCelebrationSound() {
    if (!audioEnabled || !audioContext) return;
    
    try {
        // Giai điệu "Tiến Quân Ca" đơn giản
        const melody = [
            { freq: 523, duration: 0.3 }, // C5
            { freq: 587, duration: 0.3 }, // D5
            { freq: 659, duration: 0.3 }, // E5
            { freq: 698, duration: 0.4 }, // F5
            { freq: 784, duration: 0.4 }, // G5
            { freq: 880, duration: 0.5 }, // A5
            { freq: 1047, duration: 0.6 } // C6
        ];
        
        let totalDelay = 0;
        
        melody.forEach((note, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(note.freq, audioContext.currentTime);
                oscillator.type = 'triangle';
                
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.05);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + note.duration);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + note.duration);
            }, totalDelay);
            
            totalDelay += note.duration * 200;
        });
    } catch (e) {
        console.warn('Không thể phát âm thanh ăn mừng:', e);
    }
}
window.debugVietnamFlag = {
    getCurrentZoom: () => currentZoom,
    setZoom: (zoom) => {
        currentZoom = Math.max(minZoom, Math.min(maxZoom, zoom));
        applyZoom();
    },
    triggerParticles: createParticles,
    clearParticles: clearParticles,
    playSound: playInteractionSound,
    getAudioContext: () => audioContext
};