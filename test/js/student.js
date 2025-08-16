// js/student.js
const Student = {
  view(){
    const user=sessionStorage.curUser, subs=DB.getSubs()[user]||[];
    Router.go(`
      <h2 class="title is-4">Xin chào, ${user}</h2>
      <div class="field is-grouped">
        <div class="control is-expanded">
          <input id="tskTitle" class="input" placeholder="Tiêu đề bài tập">
        </div>
        <div class="control">
          <button class="button is-primary" onclick="Student.submit()">Nộp</button>
        </div>
      </div>
      <table class="table is-fullwidth is-striped">
        <thead><tr><th>Tiêu đề</th><th>Thời gian</th></tr></thead>
        <tbody>${subs.map(t=>`
          <tr><td>${t.title}</td><td>${new Date(t.time).toLocaleString()}</td></tr>`).join('')}
        </tbody>
      </table>` );
  },

  submit(){
    const title=tskTitle.value.trim(); if(!title) return alert('Nhập tiêu đề!');
    const user=sessionStorage.curUser, data=DB.getSubs();
    if(!data[user]) data[user]=[];
    data[user].push({title,time:Date.now()}); DB.setSubs(data); this.view();
  }
};
