// js/router.js
const Router = {
  go(viewHTML){ document.getElementById('view-container').innerHTML = viewHTML; },
  nav(username=''){
    document.getElementById('nav-right').innerHTML = username
      ? `<div class="navbar-item">Xin chào, <strong>${username}</strong></div>
         <a class="navbar-item" onclick="Router.logout()">Đăng xuất</a>`
      : '';
  },
  logout(){
    sessionStorage.removeItem('curUser');
    Auth.showLogin();
  }
};
