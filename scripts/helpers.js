/* scripts/helpers.js
   Responsibilities: storage helpers, validation utilities, small DOM helpers.
   Exposes: window.AppHelpers and attaches storage helpers to window.App.Storage when possible.
*/

(function(window, $){
  // Create helpers namespace; do not overwrite App which will be created in ui.js
  window.AppHelpers = window.AppHelpers || {};

  // Safe localStorage access with graceful failures
  window.AppHelpers.StorageKey = 'nova-ai.waitlist.v1';

  window.AppHelpers.save = function(key, value){
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage save failed', e);
      return false;
    }
  };

  window.AppHelpers.load = function(key, fallback){
    try {
      var raw = window.localStorage.getItem(key);
      if (!raw) return fallback === undefined ? null : fallback;
      return JSON.parse(raw);
    } catch (e) {
      console.error('Storage load failed', e);
      return fallback === undefined ? null : fallback;
    }
  };

  window.AppHelpers.isValidEmail = function(email){
    if (!email || typeof email !== 'string') return false;
    // Simple but robust regex for validation
    var re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    return re.test(email.trim());
  };

  // Small DOM helper for accessible focus trap option
  window.AppHelpers.focusFirst = function($container){
    try {
      var $first = $container.find('input,button,textarea,select').filter(':visible').first();
      if ($first && $first.length) $first.focus();
    } catch (e) { /* ignore */ }
  };

  // Expose storage-specific helpers under the App namespace if present
  if (window.App) {
    window.App.Storage = window.App.Storage || {};
    window.App.Storage.key = window.AppHelpers.StorageKey;
    window.App.Storage.saveWaitlist = function(list){
      return window.AppHelpers.save(window.App.Storage.key, list);
    };
    window.App.Storage.loadWaitlist = function(){
      return window.AppHelpers.load(window.App.Storage.key, []);
    };
  }

})(window, jQuery);
