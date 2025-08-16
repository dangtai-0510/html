// js/manager.js
// ====================
//  Trang dành cho Quản lý
// ====================
const Manager = {
  /* -------- Bảng thống kê -------- */
  view() {
    const data = DB.getSubs();                  // { user : [ {title,time}, … ] }

    Router.go(`
      <h2 class="title is-4">Thống kê nộp bài</h2>

      <table class="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>Học viên</th>
            <th class="has-text-centered">Số bài</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${Object.keys(data).map(u => `
            <tr>
              <td>${u}</td>
              <td class="has-text-centered">${data[u].length}</td>
              <td>
                <button class="button is-small is-info"
                        onclick="Manager.viewSubmissions('${u}')">
                  Xem bài
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `);
  },

  /* -------- Xem chi tiết bài nộp của 1 học viên -------- */
  viewSubmissions(user) {
    const subs      = DB.getSubs();
    const userSubs  = subs[user] || [];

    Router.go(`
      <h2 class="title is-4">Bài làm của: ${user}</h2>

      <button class="button" onclick="Manager.view()">← Trở lại</button>

      <table class="table is-fullwidth is-striped mt-4">
        <thead>
          <tr><th>Tiêu đề</th><th>Thời gian nộp</th></tr>
        </thead>
        <tbody>
          ${userSubs.map(s => `
            <tr>
              <td>${s.title}</td>
              <td>${new Date(s.time).toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `);
  }
};
