chrome.runtime.onStartup.addListener(() => {
  clearAlarms();
  chrome.storage.local.set({ start: Date.now() });
});

chrome.runtime.onMessage.addListener((req, sender, res) => {
  if (req.action === 'count') {
    req.times.forEach((time, i) => {
      if (time === 0 || req.names[i] === '') return;

      chrome.alarms.create(req.names[i], {
        delayInMinutes: req.current[i] / 60,
        periodInMinutes: time / 60,
      });
    });
  } else if (req.action === 'pause') {
    clearAlarms();
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  chrome.storage.local.get(['names', 'level'], ({ names, level }) => {
    if (names.includes(alarm.name)) {
      notification(level, alarm.name);
    }
  });
});

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
  if (!(await chrome.offscreen.hasDocument())) {
    await chrome.offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['AUDIO_PLAYBACK'],
      justification: 'notification',
    });
  }
  await chrome.runtime.sendMessage({ source });
};
