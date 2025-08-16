// js/manager.js
const Manager = {
  view(){
    const data=DB.getSubs();
    Router.go(`
      <h2 class="title is-4">Thống kê nộp bài</h2>
      <table class="table is-fullwidth is-striped">
        <thead><tr><th>Học viên</th><th class="has-text-centered">Số bài</th></tr></thead>
        <tbody>${Object.keys(data).map(u=>`
          <tr><td>${u}</td><td class="has-text-centered">${data[u].length}</td></tr>`).join('')}
        </tbody>
      </table>` );
  }
};
