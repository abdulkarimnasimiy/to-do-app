const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const countEl = document.getElementById('count');
const prioritySelect = document.getElementById('priority');
const dueInput = document.getElementById('due-date');
const filterBtns = document.querySelectorAll('.filters button');
const progressBar = document.getElementById('progress-bar');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let filter = 'all';

/* INIT */
render();
loadTheme();
updateProgress();

/* ADD */
form.addEventListener('submit', e => {
  e.preventDefault();
  if(!input.value.trim()) return;

  todos.push({
    id: Date.now(),
    text: input.value.trim(),
    done: false,
    priority: prioritySelect.value,
    dueDate: dueInput.value || null
  });

  input.value = '';
  save();
});

/* RENDER */
function render(){
  list.innerHTML = '';
  getFiltered().forEach(todo=>{
    const li = document.createElement('li');
    const overdue = todo.dueDate && !todo.done && new Date(todo.dueDate)<new Date();

    li.className = `todo ${todo.done?'done':''} ${overdue?'overdue':''}`;
    li.draggable = true;
    li.dataset.id = todo.id;

    li.innerHTML = `
      <span>${todo.text}
        <span class="badge ${todo.priority}">${todo.priority}</span>
      </span>
      <div class="todo-actions">
        <button onclick="toggle(${todo.id})">✔</button>
        <button onclick="edit(${todo.id})">✏</button>
        <button class="delete" onclick="remove(${todo.id})">🗑</button>
      </div>
    `;
    list.appendChild(li);
  });
  updateCount();
  updateProgress();
}

/* ACTIONS */
function toggle(id){
  todos = todos.map(t=>t.id===id?{...t,done:!t.done}:t);
  save();
}
function remove(id){
  todos = todos.filter(t=>t.id!==id);
  save();
}
function edit(id){
  const t = todos.find(t=>t.id===id);
  const txt = prompt('Edit task',t.text);
  if(txt) t.text = txt;
  save();
}

/* FILTER */
filterBtns.forEach(btn=>{
  btn.onclick=()=>{
    filterBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    filter = btn.dataset.filter;
    render();
  };
});
function getFiltered(){
  if(filter==='active') return todos.filter(t=>!t.done);
  if(filter==='done') return todos.filter(t=>t.done);
  return todos;
}

/* PROGRESS */
function updateProgress(){
  if(!todos.length){progressBar.style.width='0%';return;}
  const done = todos.filter(t=>t.done).length;
  progressBar.style.width = (done/todos.length)*100 + '%';
}

/* COUNT */
function updateCount(){
  const active = todos.filter(t=>!t.done).length;
  countEl.textContent = `${active} task${active!==1?'s':''}`;
}

/* STORAGE */
function save(){
  localStorage.setItem('todos',JSON.stringify(todos));
  render();
}

/* THEME */
document.getElementById('theme').onclick=()=>{
  document.body.classList.toggle('light');
  localStorage.setItem('theme',document.body.classList.contains('light')?'light':'dark');
};
function loadTheme(){
  if(localStorage.getItem('theme')==='light') document.body.classList.add('light');
}

/* PWA */
if('serviceWorker'in navigator){
  navigator.serviceWorker.register('sw.js');
}
