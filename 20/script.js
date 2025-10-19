const viewBtn = document.getElementById("viewBtn");
const welcome = document.getElementById("welcome");
const stickman = document.getElementById("stickman");
const armRight = document.getElementById("armRight");
const bomb = document.getElementById("bomb");
const explosion = document.getElementById("explosion");
const message = document.getElementById("message");
const body = document.body;

const GRAVITY = 1800;
const THROW_TIME = 1.05;
const TYPING_SPEED = 40;

// Hàm đánh chữ
function typeWriter(text, speed = TYPING_SPEED, append = false) {
  return new Promise((resolve) => {
    message.classList.remove("hidden");
    message.style.opacity = 1;
    if (!append) message.innerHTML = "";
    let i = 0;
    const timer = setInterval(() => {
      const ch = text[i];
      message.innerHTML += ch === "\n" ? "<br>" : ch;
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        resolve();
      }
    }, speed);
  });
}

// Ném bom parabol
function throwBombParabola(start, target, totalTimeSec) {
  const startTime = performance.now();
  const t = totalTimeSec;
  const dx = target.x - start.x;
  const dy = target.y - start.y;
  const vx = dx / t;
  const vy = (dy - 0.5 * GRAVITY * t * t) / t;

  return new Promise((resolve) => {
    function frame(now) {
      const elapsed = (now - startTime) / 1000;
      if (elapsed >= t) {
        bomb.style.left = `${target.x}px`;
        bomb.style.top = `${target.y}px`;
        resolve();
        return;
      }
      const curX = start.x + vx * elapsed;
      const curY = start.y + vy * elapsed + 0.5 * GRAVITY * elapsed * elapsed;
      bomb.style.left = `${curX}px`;
      bomb.style.top = `${curY}px`;
      bomb.style.transform = `translate(-50%,-50%) rotate(${elapsed * 720}deg)`;
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });
}

// Hoa bay
function spawnFlowers(cx, cy, count = 20) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.innerText = Math.random() < 0.5 ? "🌸" : "💮";
    el.style.position = "absolute";
    el.style.left = `${cx}px`;
    el.style.top = `${cy}px`;
    el.style.zIndex = 120;
    el.style.pointerEvents = "none";
    el.style.fontSize = `${18 + Math.random() * 8}px`;
    document.body.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    const dist = 90 + Math.random() * 160;
    const tx = cx + Math.cos(angle) * dist;
    const ty = cy + Math.sin(angle) * dist - 40;

    el.animate(
      [
        { transform: "translate(-50%,-50%) scale(0.2)", opacity: 1 },
        {
          transform: `translate(${tx - cx}px, ${ty - cy}px) scale(1) rotate(${Math.random() * 360}deg)`,
          opacity: 1,
        },
        {
          transform: `translate(${tx - cx}px, ${ty - cy - 30}px) scale(0.6) rotate(${Math.random() * 720}deg)`,
          opacity: 0,
        },
      ],
      { duration: 1500 + Math.random() * 1000, easing: "cubic-bezier(.2,.9,.3,1)", fill: "forwards" }
    );
    setTimeout(() => el.remove(), 2500 + Math.random() * 700);
  }
}

// Bom lăn
function rollBomb(startX, endX, y, duration = 2000) {
  return new Promise((resolve) => {
    bomb.classList.remove("hidden");
    bomb.style.opacity = 1;
    bomb.style.top = `${y}px`;
    bomb.animate(
      [
        { left: `${startX}px`, transform: "translate(-50%, -50%) rotate(0deg)" },
        { left: `${endX}px`, transform: "translate(-50%, -50%) rotate(720deg)" },
      ],
      { duration, easing: "ease-in-out", fill: "forwards" }
    );
    setTimeout(resolve, duration);
  });
}

// Hiệu ứng nổ
function explodeAt(x, y) {
  return new Promise((resolve) => {
    bomb.style.opacity = 0;
    explosion.classList.remove("hidden");
    explosion.style.left = `${x}px`;
    explosion.style.top = `${y}px`;
    explosion.style.transform = `translate(-50%,-50%) scale(1.6)`;
    explosion.style.opacity = 1;
    spawnFlowers(x, y, 30);

    body.animate(
      [
        { transform: "translate(0,0)" },
        { transform: "translate(10px,-10px)" },
        { transform: "translate(-10px,10px)" },
        { transform: "translate(0,0)" },
      ],
      { duration: 600 }
    );

    setTimeout(() => {
      explosion.style.opacity = 0;
      explosion.style.transform = `translate(-50%,-50%) scale(3)`;
      resolve();
    }, 900);
  });
}

// Hiệu ứng chuyển cảnh
function transitionToScene2() {
  return new Promise((resolve) => {
    const plane = document.createElement("div");
    plane.innerText = "🚀";
    plane.style.position = "fixed";
    plane.style.left = "-100px";
    plane.style.bottom = "40px";
    plane.style.fontSize = "60px";
    plane.style.zIndex = 250;
    plane.style.filter = "drop-shadow(0 0 10px white)";
    document.body.appendChild(plane);

    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.inset = 0;
    overlay.style.zIndex = 200;
    overlay.style.background = "#fff";
    overlay.style.opacity = 0;
    document.body.appendChild(overlay);

    plane.animate(
      [
        { transform: "translate(0,0) rotate(15deg)", opacity: 1 },
        { transform: "translate(400px,-150px) rotate(5deg)", opacity: 1 },
        { transform: `translate(${window.innerWidth + 200}px,-400px) rotate(-10deg)`, opacity: 0.8 },
      ],
      { duration: 2500, easing: "ease-in-out", fill: "forwards" }
    );

    overlay.animate([{ opacity: 0 }, { opacity: 1 }, { opacity: 0 }], {
      duration: 2600,
      fill: "forwards",
      easing: "ease-in-out",
    });

    setTimeout(() => {
      body.animate(
        [
          { background: "linear-gradient(135deg,#ffd6e7,#fff0f5)" },
          { background: "linear-gradient(135deg,#ffb8d2,#ffe0e7)" },
          { background: "linear-gradient(135deg,#fbc2eb,#a6c1ee)" },
        ],
        { duration: 3000, fill: "forwards", easing: "ease-in-out" }
      );
      message.innerHTML = "";
    }, 1300);

    setTimeout(() => {
      plane.remove();
      overlay.remove();
      resolve();
    }, 2700);
  });
}

// 🎬 Kịch bản chính
viewBtn.addEventListener("click", async () => {
  // Giai đoạn 1 – nền đỏ hồng năng động
  body.style.background = "linear-gradient(135deg,#ffb6c1,#ff7f7f)";
  welcome.style.opacity = 0;
  setTimeout(() => (welcome.style.display = "none"), 500);

  stickman.classList.remove("hidden");
  bomb.classList.remove("hidden");

  const rect = stickman.getBoundingClientRect();
  const startX = rect.left + rect.width * 0.78;
  const startY = rect.top + rect.height * 0.45;
  bomb.style.left = `${startX}px`;
  bomb.style.top = `${startY}px`;
  bomb.style.opacity = 1;

  armRight.animate([{ transform: "rotate(-30deg)" }, { transform: "rotate(-80deg)" }], {
    duration: 220,
    easing: "ease-out",
    fill: "forwards",
  });
  await new Promise((r) => setTimeout(r, 180));

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const target = { x: vw * 0.52, y: vh * 0.42 };

  armRight.animate([{ transform: "rotate(-80deg)" }, { transform: "rotate(10deg)" }], {
    duration: 480,
    easing: "cubic-bezier(.2,.9,.3,1)",
    fill: "forwards",
    delay: 120,
  });

  await throwBombParabola({ x: startX, y: startY }, target, THROW_TIME);
  await explodeAt(target.x, target.y);

  stickman.style.opacity = 0;
  setTimeout(() => stickman.classList.add("hidden"), 400);

  await new Promise((r) => setTimeout(r, 500));

  // -------- TAB 1 --------
  await typeWriter(
    "Chào con gà tduong, cái này được nghĩ và bắt tay vào làm hơn tháng, nma cũng là trình 1 thằng năm hai và gà mờ nên hơi sơ sài, có gì thông cảm cho bạn 😀😀😀😀",
    40,
    false
  );

  // Giữ lại nội dung vài giây trước khi qua tab 2
  await new Promise((r) => setTimeout(r, 2500));

  // Xóa nội dung tab 1 (chuyển sang tab 2)
  message.innerHTML = "";

  // Giai đoạn 2 – nền hồng pastel nhẹ (đậm hơn để chữ nổi rõ)
  body.animate(
    [
      { background: "linear-gradient(135deg, #f5c6ec, #ffe4f2)" },
      { background: "linear-gradient(135deg, #e8aaff, #ffd6eb)" },
    ],
    { duration: 2000, fill: "forwards" }
  );

  // -------- TAB 2 --------
  await new Promise((r) => setTimeout(r, 1500));
  await typeWriter(
    "Đầu tiên thì Tôi chúc bạn 20/10 vui vẻ và lúc nào cũng xinh như những bó hoa nhé =))))))😀😀😶‍🌫️😶‍🌫️",
    40,
    false
  );

  await new Promise((r) => setTimeout(r, 2000));
  await typeWriter("\nHọc ít thôi dcmmm =)))", 40, true);
  await new Promise((r) => setTimeout(r, 2500));
  await typeWriter("\nTiếp nào con gà =)))))", 50, true);

  await new Promise((r) => setTimeout(r, 1000));
  await transitionToScene2();

  // Các đoạn sau (tab 3...) giữ nguyên như cũ
  const start2X = -100;
  const midY = window.innerHeight * 0.65;
  const midX = window.innerWidth / 2;

  await rollBomb(start2X, midX, midY, 2500);
  await explodeAt(midX, midY);

  // Giai đoạn 3 – nền tím hồng mộng mơ
  body.animate(
    [
      { background: "linear-gradient(135deg,#ffdef2,#ffc9e7)" },
      { background: "linear-gradient(135deg,#fbc2eb,#a6c1ee)" },
      { background: "linear-gradient(135deg,#dcb0ed,#99c2ff)" },
    ],
    { duration: 4000, fill: "forwards", easing: "ease-in-out" }
  );

  await new Promise((r) => setTimeout(r, 2000));
  await typeWriter("Tab này bạn cop gpt nma vẫn thật lòng nha =))), tại bị bí ý tưởng á", 40, false);
  await new Promise((r) => setTimeout(r, 2000));
  await typeWriter("\nChúc bạn một ngày 20/10 thật đặc biệt - được nhận nhiều lời chúc, hoa và cả những điều bất ngờ dễ thương nữa 😄", 40, false);
  await new Promise((r) => setTimeout(r, 2000));
  await typeWriter("\nHy vọng bạn luôn giữ được nụ cười tươi, tinh thần lạc quan và niềm vui trong học tập cũng như cuộc sống.", 40, false);
  await new Promise((r) => setTimeout(r, 2000));
  await typeWriter("\nNói chung là chúc mọi điều tốt đẹp nhất sẽ đến với bạn nha! 💐✨", 40, false);
  await new Promise((r) => setTimeout(r, 2500));
  await typeWriter("\nCó thể đến đây thôi được rồi, hơi sơ sài nhưng mà có thành ý =)))", 40, true);
  await new Promise((r) => setTimeout(r, 2000));
  await typeWriter("\n😤😠À dcmm m hẹn chán chê đi ăn r còn chưa đi đâu đó, nma thoi tạm thời bây giờ chắc không cần nữa =)))🤦‍♂️🤦‍♂️🤦‍♂️", 40, false);

  // 🎬 Kết thúc lãng mạn (giữ nguyên đoạn kết)
  await new Promise((r) => setTimeout(r, 3500));
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.inset = 0;
  overlay.style.background = "linear-gradient(135deg,#f8e0f7,#f9c5d1,#f1d1f1)";
  overlay.style.zIndex = 400;
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.fontSize = "2em";
  overlay.style.color = "#a3006b";
  overlay.style.textAlign = "center";
  overlay.style.opacity = 0;
  overlay.style.transition = "opacity 1.5s ease";
  overlay.style.backdropFilter = "blur(8px)";
  overlay.innerHTML = `
    <div>Hết rồi con gà </div>
    <div style="font-size:1.4rem;margin-top:12px;">Cảm ơn vì đã xem đến cuối nhá</div>
    <div style="font-size:1.2rem;margin-top:8px;">Tduong is a chicken🐔🐔🐔 </div>
    <button id="retryBtn" style="
      margin-top:28px;
      background: linear-gradient(90deg,#ff9ad6,#ff5fb1);
      color:#fff;
      border:none;
      padding:10px 28px;
      border-radius:30px;
      font-size:1rem;
      cursor:pointer;
      box-shadow:0 0 20px rgba(255,100,200,0.3);
      transition:transform 0.2s ease;
    ">🔁 có muốn xem lại thì click vào đây =))</button>
  `;
  document.body.appendChild(overlay);

  overlay.offsetHeight;
  overlay.style.opacity = 1;

  // Hoa bay nhẹ nền kết thúc
  setInterval(() => {
    spawnFlowers(Math.random() * window.innerWidth, Math.random() * window.innerHeight, 1);
  }, 900);

  document.getElementById("retryBtn").addEventListener("click", () => {
    overlay.style.opacity = 0;
    setTimeout(() => {
      overlay.remove();
      location.reload();
    }, 800);
  });
});
