// js/student.js
// =============================
//  Chức năng Học viên nâng cao
// =============================
const Student = {
  editingIndex: null,  // null = đang thêm mới

  /* -------- Hiển thị giao diện -------- */
  view() {
    const user = sessionStorage.curUser;
    const subs = DB.getSubs()[user] || [];

    Router.go(`
      <h2 class="title is-4">Xin chào, ${user}</h2>

      <div class="box">
        <div class="field">
          <label class="label">Tiêu đề bài tập</label>
          <input id="tskTitle" class="input" placeholder="Nhập tiêu đề">
        </div>

        <div class="field">
          <label class="label">Đính kèm file (tuỳ chọn)</label>
          <input id="tskFile" class="input" type="file">
        </div>

        <button id="submitBtn" class="button is-primary"
                onclick="Student.submit()">Thêm</button>
      </div>

      <h3 class="title is-5 mt-5">Bài đã nộp</h3>

      <table class="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>#</th><th>Tiêu đề</th><th>File</th>
            <th>Thời gian</th><th class="has-text-centered">Hành động</th>
          </tr>
        </thead>
        <tbody>
          ${subs.map((s, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${s.title}</td>
              <td>
                ${s.fileName
                  ? `<a href="${s.fileData}" download="${s.fileName}">${s.fileName}</a>`
                  : '—'}
              </td>
              <td>${new Date(s.time).toLocaleString()}</td>
              <td class="has-text-centered">
                <button class="button is-small"
                        onclick="Student.startEdit(${i})">Sửa</button>
                <button class="button is-small is-danger"
                        onclick="Student.delete(${i})">Xoá</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `);
  },

  /* -------- Thêm mới / Lưu chỉnh sửa -------- */
  submit() {
    const title = tskTitle.value.trim();
    if (!title) return alert('Vui lòng nhập tiêu đề!');

    const fileInput = document.getElementById('tskFile');
    const file      = fileInput.files[0] || null;

    const done = (fileName, fileData) => {
      const user   = sessionStorage.curUser;
      const data   = DB.getSubs();
      const list   = data[user] || [];

      const item = {
        title,
        time: Date.now(),
        fileName,
        fileData
      };

      if (this.editingIndex === null) {
        list.push(item);                     // thêm mới
      } else {
        list[this.editingIndex] = item;      // ghi đè khi sửa
      }

      data[user] = list;
      DB.setSubs(data);

      this.resetForm();
      this.view();
    };

    if (file) {
      const reader = new FileReader();
      reader.onload = e => done(file.name, e.target.result);
      reader.readAsDataURL(file);
    } else {
      done(null, null);
    }
  },

  /* -------- Bắt đầu sửa -------- */
  startEdit(index) {
    const user  = sessionStorage.curUser;
    const item  = DB.getSubs()[user][index];

    this.editingIndex = index;
    tskTitle.value    = item.title;
    document.getElementById('submitBtn').textContent = 'Lưu';
  },

  /* -------- Xoá -------- */
  delete(index) {
    if (!confirm('Xoá bài này?')) return;

    const user  = sessionStorage.curUser;
    const data  = DB.getSubs();
    data[user].splice(index, 1);
    DB.setSubs(data);

    this.view();
  },

  /* -------- Reset form sau khi lưu -------- */
  resetForm() {
    this.editingIndex = null;
    tskTitle.value    = '';
    tskFile.value     = '';
    document.getElementById('submitBtn').textContent = 'Thêm';
  }
};
