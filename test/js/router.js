const Router = {
  go(html){ document.getElementById('view-container').innerHTML = html; },
  nav(user=''){
    document.getElementById('nav-right').innerHTML = user
      ? `<div class="navbar-item">Xin chào, <strong>${user}</strong></div>
         <a class="navbar-item" onclick="Router.logout()">Đăng xuất</a>` : '';
  },
  logout(){ sessionStorage.removeItem('curUser'); Auth.showLogin(); }
};
