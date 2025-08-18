// LocalStorage helpers
const DB = {
  getUsers()  { return JSON.parse(localStorage.users || '{}'); },
  setUsers(d) { localStorage.users = JSON.stringify(d); },
  getSubs()   { return JSON.parse(localStorage.subs  || '{}'); },
  setSubs(d)  { localStorage.subs  = JSON.stringify(d); },
  seed() {
    if (!localStorage.users) this.setUsers({admin:{pass:'admin123',role:'manager'}});
    if (!localStorage.subs)  this.setSubs({});
  }
};
DB.seed();
