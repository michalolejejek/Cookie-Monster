document.getElementById('cookieImage').addEventListener('click', function() {
    deleteCookies();
  });
  
  document.getElementById('settingsToggle').addEventListener('click', function() {
    var settingsContainer = document.getElementById('settingsContainer');
    if (settingsContainer.style.display === 'none') {
      settingsContainer.style.display = 'block';
    } else {
      settingsContainer.style.display = 'none';
    }
  });
  
  document.getElementById('timeInterval').addEventListener('change', function() {
    var timeInterval = document.getElementById('timeInterval').value;
  
    if (timeInterval === 'manual') {
      showMessage("Wybrano ręczne usuwanie. Ciasteczka nie zostaną usunięte automatycznie.");
    } else {
      chrome.storage.local.set({ 'timeInterval': timeInterval }, function() {
        showMessage("Ustawiono czas usuwania ciasteczek.");
  
        // Jeśli wybrano opcję codzienną lub tygodniową, zaplanuj usunięcie ciasteczek.
        if (timeInterval === 'daily' || timeInterval === 'weekly') {
          scheduleCookieCleanup(timeInterval);
        } else {
          removeCookieCleanupAlarm();
        }
      });
    }
  });
  
  function deleteCookies() {
    chrome.tabs.query({}, function(tabs) {
      tabs.forEach(function(tab) {
        chrome.cookies.getAll({url: tab.url}, function(cookies) {
          cookies.forEach(function(cookie) {
            chrome.cookies.remove({url: tab.url, name: cookie.name});
          });
        });
      });
      showMessage("Usunięto ciasteczka.");
    });
  }
  
  function scheduleCookieCleanup(timeInterval) {
    chrome.alarms.create('cookieCleanup', { periodInMinutes: getIntervalMinutes(timeInterval) });
  }
  
  function removeCookieCleanupAlarm() {
    chrome.alarms.clear('cookieCleanup');
  }
  
  function getIntervalMinutes(timeInterval) {
    switch (timeInterval) {
      case 'daily':
        return 24 * 60; // 24 godziny * 60 minut
      case 'weekly':
        return 7 * 24 * 60; // 7 dni * 24 godziny * 60 minut
      default:
        return 0;
    }
  }
  
  function showMessage(message) {
    var messageElement = document.getElementById('message');
    messageElement.textContent = message;
    setTimeout(function() {
      messageElement.textContent = '';
    }, 2000);
  }
  