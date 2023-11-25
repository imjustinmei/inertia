chrome.runtime.onStartup.addListener(() => {
  clearAlarms();
  chrome.storage.local.get(['times', 'names'], (res) => createAlarms(res.names, res.times, res.times));
  chrome.storage.local.set({ start: Date.now() });
});

chrome.runtime.onMessage.addListener((req) => {
  if (req.action === 'count') createAlarms(req.names, req.times, req.current);
  else if (req.action === 'pause') clearAlarms();
});

chrome.alarms.onAlarm.addListener((alarm) => {
  chrome.storage.local.get(['names', 'level'], ({ names, level }) => {
    if (names.includes(alarm.name)) {
      notification(level, alarm.name);
    }
  });
});

const createAlarms = (names, times, current) => {
  times.forEach((time, i) => {
    if (time === 0 || names[i] === '') return;

    chrome.alarms.create(names[i], {
      delayInMinutes: current[i] / 60,
      periodInMinutes: time / 60,
    });
  });
};

const clearAlarms = () => {
  chrome.storage.local.get('names', ({ names }) => {
    for (const name of names) {
      if (name === '') continue;
      chrome.alarms.clear(name);
    }
  });
};

const notification = (level, name) => {
  if (level > 1) {
    chrome.tabs.create({ url: `alarm/alarm.html?name=${encodeURIComponent(name)}` });
  }
  if (level > 0) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/notif.png',
      title: name,
      message: '',
      silent: true,
    });
  }
  play('notification/notif.mp3');
};

const play = async (source) => {
  await createOffscreen();
  await chrome.runtime.sendMessage({ source });
};

const createOffscreen = async () => {
  if (await chrome.offscreen.hasDocument()) return;
  await chrome.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: ['AUDIO_PLAYBACK'],
    justification: 'notification',
  });
};
