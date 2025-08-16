// js/auth.js
// =======================
//  Đăng ký / Đăng nhập
// =======================
const Auth = {
  /* ---------- Hiển thị form Đăng Nhập ---------- */
  showLogin() {
    Router.go(`
      <div class="box">
        <h1 class="title has-text-centered">Đăng nhập</h1>

        <input id="lgUser" class="input" placeholder="Tên đăng nhập">
        <input id="lgPass" class="input" type="password" placeholder="Mật khẩu">

        <p id="lgMsg" class="has-text-danger"></p>

        <button class="button is-primary is-fullwidth"
                onclick="Auth.login()">Đăng nhập</button>

        <p class="has-text-centered mt-4">Chưa có tài khoản?
           <a onclick="Auth.showRegister()">Đăng ký</a></p>
      </div>
    `);
    Router.nav();   // ẩn thanh “Xin chào …”
  },

  /* ---------- Hiển thị form Đăng Ký ---------- */
  showRegister() {
    Router.go(`
      <div class="box">
        <h1 class="title has-text-centered">Đăng ký</h1>

        <input id="rgUser" class="input" placeholder="Tên đăng nhập">
        <input id="rgPass" class="input" type="password" placeholder="Mật khẩu">

        <div class="select is-fullwidth mb-4">
          <select id="rgRole" onchange="Auth.toggleCode(this.value)">
            <option value="student">Học viên</option>
            <option value="manager">Quản lý</option>
          </select>
        </div>

        <!--  Đặt type=password  &  placeholder ngắn gọn -->
        <input id="rgCode" class="input hidden"
               type="password"
               placeholder="Mã quản lý">

        <p id="rgMsg" class="has-text-danger"></p>

        <button class="button is-link is-fullwidth"
                onclick="Auth.register()">Tạo tài khoản</button>

        <p class="has-text-centered mt-4">Đã có tài khoản?
           <a onclick="Auth.showLogin()">Đăng nhập</a></p>
      </div>
    `);
  },

  /* ---------- Ẩn/hiện ô nhập mã ---------- */
  toggleCode(role) {
    document.getElementById('rgCode')
            .classList.toggle('hidden', role !== 'manager');
  },

  /* ---------- Xử lý Đăng Ký ---------- */
  register() {
    const u = rgUser.value.trim();
    const p = rgPass.value.trim();
    const r = rgRole.value;
    const c = rgCode.value.trim();
    const msg = rgMsg;

    msg.textContent = '';

    if (!u || !p)  return msg.textContent = 'Nhập đủ thông tin';
    const users = DB.getUsers();
    if (users[u])   return msg.textContent = 'Tên đăng nhập đã tồn tại';
    if (r === 'manager' && c !== '0510')
                   return msg.textContent = 'Sai mã quản lý';

    users[u] = { pass: p, role: r };
    DB.setUsers(users);

    alert('Tạo tài khoản thành công!');
    this.showLogin();
  },

  /* ---------- Xử lý Đăng Nhập ---------- */
  login() {
    const u = lgUser.value.trim();
    const p = lgPass.value.trim();
    const users = DB.getUsers();

    if (!users[u] || users[u].pass !== p) {
      lgMsg.textContent = 'Sai tài khoản hoặc mật khẩu';
      return;
    }

    sessionStorage.curUser = u;
    Router.nav(u);

    users[u].role === 'student'
      ? Student.view()
      : Manager.view();
  }
};

/* ---------- Tự hiển thị form login khi tải trang ---------- */
window.addEventListener('DOMContentLoaded', () => Auth.showLogin());
