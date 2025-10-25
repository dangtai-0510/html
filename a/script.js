// Elements
const btnWatch = document.getElementById('btn-watch');
const btnNext  = document.getElementById('btn-next');
const screenWarning = document.getElementById('screen-warning');
const screenEffects = document.getElementById('screen-effects');
const screenMessage = document.getElementById('screen-message');

const effectTextEl = document.getElementById('effectText');
const messageTextEl = document.getElementById('messageText');
const finalEl = document.getElementById('finalMessage');

// Text contents
const effectsContent = `1️⃣ Ảnh hưởng gan, thận, tim mạch
2️⃣ Giảm trí nhớ và phản xạ chậm
3️⃣ Dễ gây nghiện, mất kiểm soát hành vi
4️⃣ Mất ngủ, mệt mỏi, kém tập trung
5️⃣ Và cả làm tao bực với lo vcl dmmm, t làm cái web này để động viên m đấy, 1h sáng rồi dcm


Thấy hại rồi thì bỏ đi, tao không thích nhìn m vậy 1 lần nào nữa đâu`;

const messageContent = `Tao cũng giống như m thôi, ngày đầu tao mới vào ngành này cũng gặp khó khăn với việc chạy code,
nhưng mà sau 1 kì tao cũng thích nghi và cũng quen dần ấy chứ.
Đâu ai hoàn hảo trong lần đầu đâu.
Mặc dù đến bây h vẫn bị chửi là ngu nhưng mà t thấy t đã cố gắng và tiến bộ hơn trước rồi.
Cố lên nha, good luck 🍀🍀`;

// Helper: switch screens
function activateScreen(hideEl, showEl){
  if(hideEl) hideEl.classList.remove('active');
  if(showEl){
    // small delay for smoothness
    setTimeout(()=> showEl.classList.add('active'), 220);
  }
}

// Safe: ensure final is hidden at start
finalEl.classList.remove('show');

// Start: watch button -> go to effects and start typing effects
btnWatch.addEventListener('click', () => {
  activateScreen(screenWarning, screenEffects);
  // clear previous content just in case
  effectTextEl.textContent = '';
  messageTextEl.textContent = '';
  finalEl.classList.remove('show');
  // start typing effects after tiny delay
  setTimeout(()=> typeText(effectsContent, effectTextEl, 32, onEffectsDone), 300);
});

// When effects typing done -> reveal "Xem tiếp" button
function onEffectsDone(){
  btnNext.style.display = 'inline-block';
  // small entrance effect
  btnNext.style.transform = 'translateY(6px)';
  setTimeout(()=> btnNext.style.transform = 'translateY(0)', 50);
}

// Next button -> go to message and start typing message
btnNext.addEventListener('click', () => {
  btnNext.style.display = 'none';
  activateScreen(screenEffects, screenMessage);
  // start typing message after tiny delay
  setTimeout(()=> typeText(messageContent, messageTextEl, 38, onMessageDone), 260);
});

// When message typing done -> show final
function onMessageDone(){
  // ensure final visible with animation
  finalEl.classList.add('show');
  // optional: small pulse once
  finalEl.animate([
    { transform: 'translateY(4px) scale(0.995)' },
    { transform: 'translateY(0) scale(1)' }
  ], { duration: 520, easing: 'ease-out' });
}

/**
 * Generic typewriter function
 * text: string to type
 * targetEl: DOM element to append text to
 * delay: ms per character
 * callback: optional function when typing finishes
 */
function typeText(text, targetEl, delay = 40, callback = null){
  let i = 0;
  targetEl.textContent = '';
  (function tick(){
    if(i < text.length){
      targetEl.textContent += text.charAt(i);
      i++;
      setTimeout(tick, delay);
    } else {
      if(typeof callback === 'function') callback();
    }
  })();
}
