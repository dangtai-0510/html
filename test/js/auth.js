// js/auth.js
const Auth = {
  showLogin(){
    Router.go(`
      <div class="box">
        <h1 class="title has-text-centered">Đăng nhập</h1>
        <input id="lgUser" class="input" placeholder="Tên đăng nhập">
        <input id="lgPass" class="input" type="password" placeholder="Mật khẩu">
        <p id="lgMsg" class="has-text-danger"></p>
        <button class="button is-primary is-fullwidth" onclick="Auth.login()">Đăng nhập</button>
        <p class="has-text-centered mt-4">Chưa có tài khoản?
           <a onclick="Auth.showRegister()">Đăng ký</a></p>
      </div>` );
    Router.nav();
  },

  showRegister(){
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
        <input id="rgCode" class="input hidden" placeholder="Mã quản lý (0510)">
        <p id="rgMsg" class="has-text-danger"></p>
        <button class="button is-link is-fullwidth" onclick="Auth.register()">Tạo tài khoản</button>
        <p class="has-text-centered mt-4">Đã có tài khoản?
           <a onclick="Auth.showLogin()">Đăng nhập</a></p>
      </div>` );
  },

  toggleCode(role){
    document.getElementById('rgCode').classList.toggle('hidden', role!=='manager');
  },

  register(){
    const u=rgUser.value.trim(), p=rgPass.value.trim(),
          r=rgRole.value, c=rgCode.value.trim(), msg=rgMsg;
    if(!u||!p)  return msg.textContent='Nhập đủ thông tin';
    const users=DB.getUsers();
    if(users[u]) return msg.textContent='Tên đã tồn tại';
    if(r==='manager' && c!=='0510') return msg.textContent='Sai mã quản lý';
    users[u]={pass:p,role:r}; DB.setUsers(users);
    alert('Tạo tài khoản thành công!'); this.showLogin();
  },

  login(){
    const u=lgUser.value.trim(), p=lgPass.value.trim(), users=DB.getUsers();
    if(!users[u]||users[u].pass!==p){ lgMsg.textContent='Sai thông tin'; return; }
    sessionStorage.curUser=u; Router.nav(u);
    users[u].role==='student' ? Student.view() : Manager.view();
  }
};

window.addEventListener('DOMContentLoaded', ()=>Auth.showLogin());
