const levels = ['mild', 'med', 'very'];

const add = document.getElementById('add');
const title = document.getElementById('title');
const slider = document.getElementById('level');

const create = (currentValue, timeValue, nameValue) => {
  if (current.length > 2) return;
  const item = document.createElement('div');
  item.className = 'item';

  const time = document.createElement('input');
  time.value = convert(currentValue);
  time.id = times.length;
  time.className = 'time';
  time.maxLength = 5;
  time.placeholder = '00:00';
  time.addEventListener('input', () => update(time));
  time.addEventListener('blur', () => {
    pad(time);
    save();
  });
  time.addEventListener('focus', () => {
    time.value = '';
    if (interval) toggle();
  });

  const name = document.createElement('input');
  name.value = nameValue;
  name.className = 'name';
  name.addEventListener('input', (event) => {
    names[time.id] = event.target.value;
    save();
  });
  name.addEventListener('focus', () => {
    if (interval) toggle();
  });

  const del = document.createElement('button');
  del.textContent = 'X';
  del.className = 'delete';
  del.addEventListener('click', () => {
    remove(time.id - offset);
    del.parentElement.remove();
  });

  item.appendChild(time);
  item.appendChild(name);
  item.appendChild(del);

  document.getElementById('items').appendChild(item);
  times.push(timeValue);
  current.push(currentValue);
  names.push(nameValue);
  save();
};

const remove = (id) => {
  offset++;
  times.splice(id, 1);
  current.splice(id, 1);
  names.splice(id, 1);
  save();
};

const toggle = () => {
  title.classList.toggle('on');
  title.textContent = !interval ? 'ertia' : 'inertia';
  if (!interval) {
    chrome.runtime.sendMessage({ action: 'count', times, current, names });
    interval = setInterval(count, 1000);
  } else {
    chrome.runtime.sendMessage({ action: 'pause' });
    clearInterval(interval);
    interval = '';
  }
  chrome.storage.local.set({ active: !!interval });
};

add.addEventListener('click', () => create(0, 0, ''));

title.addEventListener('click', () => {
  toggle();
  chrome.storage.local.set({ start: Date.now() });
});

slider.oninput = () => {
  label.textContent = levels[slider.value];
  chrome.storage.local.set({ level: slider.value });
};
