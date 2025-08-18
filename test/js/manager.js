// js/manager.js
// ====================
//  Trang Quản lý
// ====================
const Manager = {
  /* -------- Bảng thống kê -------- */
  view() {
    const data = DB.getSubs();

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
                        onclick="Manager.viewSub('${u}')">Xem bài</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `);
  },

  /* -------- Xem chi tiết bài nộp -------- */
  viewSub(user) {
    const list = DB.getSubs()[user] || [];

    Router.go(`
      <h2 class="title is-4">Bài làm của: ${user}</h2>

      <button class="button" onclick="Manager.view()">← Trở lại</button>

      <table class="table is-fullwidth is-striped mt-4">
        <thead>
          <tr>
            <th>#</th><th>Tiêu đề</th><th>File</th><th>Thời gian nộp</th>
          </tr>
        </thead>
        <tbody>
          ${list.map((s,i)=>`
            <tr>
              <td>${i+1}</td>
              <td>${s.title}</td>
              <td>
                ${s.fileName
                    ? `<a href="${s.fileData}" download="${s.fileName}">${s.fileName}</a>`
                    : '—'}
              </td>
              <td>${new Date(s.time).toLocaleString()}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `);
  }
};
