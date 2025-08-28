(function(){
  const avatar         = document.getElementById('avatar');
  const toggleImageBtn = document.getElementById('toggleImageBtn');
  const darkToggleBtn  = document.getElementById('darkModeToggle');
  const greeting       = document.getElementById('greeting');

  // Ẩn/Hiện ảnh
  toggleImageBtn.addEventListener('click', () => {
    avatar.classList.toggle('hidden');
  });

  // Dark / Light mode với localStorage
  darkToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  });

  // Khi trang load
  window.addEventListener('DOMContentLoaded', () => {
    // Cập nhật greeting theo giờ
    const hour = new Date().getHours();
    let msg = 'Xin chào';
    if (hour < 12) msg = 'Chào buổi sáng';
    else if (hour < 18) msg = 'Chào buổi chiều';
    else msg = 'Chào buổi tối';
    greeting.innerHTML = `${msg}! Tôi tên là <strong>Đặng Đức Tài</strong>.`;

    // Áp dark-mode nếu user đã chọn trước đó
    if (localStorage.getItem('darkMode') === 'true') {
      document.body.classList.add('dark-mode');
    }
  });
})();
