chrome.runtime.onMessage.addListener((req) => {
  if (req.source) new Audio(req.source).play();
});
