// Học viên: thêm • sửa • xoá • file
const Student = {
  editing:null,

  view(){
    const user=sessionStorage.curUser;
    const subs=DB.getSubs()[user]||[];

    Router.go(`
      ${Header.html(false)}
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
          <tr><th>#</th><th>Tiêu đề</th><th>File</th>
              <th>Thời gian</th><th class="has-text-centered">Hành động</th></tr>
        </thead>
        <tbody>
          ${subs.map((s,i)=>`
            <tr>
              <td>${i+1}</td>
              <td>${s.title}</td>
              <td>${s.fileName?`<a href="${s.fileData}" download="${s.fileName}">${s.fileName}</a>`:'—'}</td>
              <td>${new Date(s.time).toLocaleString()}</td>
              <td class="has-text-centered">
                <button class="button is-small"        onclick="Student.edit(${i})">Sửa</button>
                <button class="button is-small is-danger" onclick="Student.del(${i})">Xoá</button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>`);
  },

  /* ---- Thêm mới / lưu chỉnh sửa ---- */
  submit(){
    const title=tskTitle.value.trim();
    if(!title)return alert('Nhập tiêu đề!');
    const file=tskFile.files[0]||null;

    const done=(fileName,fileData)=>{
      const user=sessionStorage.curUser;
      const data=DB.getSubs(); const list=data[user]||[];
      const obj={title,time:Date.now(),fileName,fileData};
      this.editing===null?list.push(obj):list.splice(this.editing,1,obj);
      data[user]=list; DB.setSubs(data); this.reset(); this.view();
    };

    if(file){
      const fr=new FileReader();
      fr.onload=e=>done(file.name,e.target.result);
      fr.readAsDataURL(file);
    }else done(null,null);
  },

  /* ---- Sửa ---- */
  edit(i){
    const item=DB.getSubs()[sessionStorage.curUser][i];
    this.editing=i; tskTitle.value=item.title; tskFile.value=''; submitBtn.textContent='Lưu';
  },

  /* ---- Xoá ---- */
  del(i){
    if(!confirm('Xoá bài này?'))return;
    const u=sessionStorage.curUser,data=DB.getSubs();
    data[u].splice(i,1); DB.setSubs(data); this.view();
  },

  reset(){this.editing=null; tskTitle.value=''; tskFile.value=''; submitBtn.textContent='Thêm';}
};
