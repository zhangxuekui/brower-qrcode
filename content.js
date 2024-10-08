chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "getSelection") {
      sendResponse({selection: window.getSelection().toString()});
    }
  });