// Khung thời gian + đếm bài hôm nay
const Header = {
  greeting(){
    const h=new Date().getHours();
    if(h<11&&h>=5)   return{txt:'Chào buổi sáng',icon:'☀️'};
    if(h<14)         return{txt:'Buổi trưa vui vẻ',icon:'🌤️'};
    if(h<18)         return{txt:'Chào buổi chiều',icon:'🌇'};
    return                       {txt:'Chúc buổi tối tốt lành',icon:'🌙'};
  },
  isToday(ms){
    const d=new Date(ms),t=new Date();
    return d.getFullYear()===t.getFullYear()&&d.getMonth()===t.getMonth()&&d.getDate()===t.getDate();
  },
  todayCountUser(user){
    return (DB.getSubs()[user]||[]).filter(s=>Header.isToday(s.time)).length;
  },
  todayCountAll(){
    let n=0;
    Object.values(DB.getSubs()).forEach(l=>n+=l.filter(s=>Header.isToday(s.time)).length);
    return n;
  },
  html(isManager=false){
    const {txt,icon}=Header.greeting();
    const count=isManager?Header.todayCountAll():Header.todayCountUser(sessionStorage.curUser);
    const today=new Date().toLocaleDateString('vi-VN');
    return `
      <div class="notification is-primary is-light has-text-centered mb-4">
        <span class="icon">${icon}</span>
        <span class="ml-2">${txt}! Hôm nay (${today}) có <strong>${count}</strong> bài nộp.</span>
      </div>`;
  }
};
