let interval = '';
let offset = 0;
let current = [];
let times = [];
let names = [];

const save = () => {
  chrome.storage.local.set({
    times,
    names,
  });
};

chrome.runtime.onMessage.addListener((req, sender, res) => {
  if (req.action === 'getCurrent') {
    res({ current });
  }
});

chrome.storage.local.get(['times', 'names', 'level', 'active', 'start'], (res) => {
  if (!res.times) return;

  const now = Date.now();
  current = res.times.map((time, i) => {
    if (res.names[i] !== '' && time !== 0) {
      time = res.active ? time - (Math.round((now - res.start) / 1000) % time) : res.times[i];
    }
    create(time, res.times[i], res.names[i]);
    return time;
  });

  slider.value = res.level;
  document.getElementById('label').textContent = levels[res.level];
  if (res.active) toggle();
});
