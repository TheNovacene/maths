/* NEO Maths GreenPrint — progress module v0.1
 *
 * Design intent: lesson pages and the index both talk to NEOProgress,
 * never to a storage mechanism directly. Today the backend is
 * localStorage on the learner's own device (no accounts, no data leaves
 * the browser). When real-time progress tracking arrives, implement a
 * remote backend with the same four methods and swap it in setBackend().
 *
 * Data minimisation by design: we record lesson id, state and a
 * timestamp. Nothing else. No names, no identifiers, no analytics.
 */
(function () {
  'use strict';

  var KEY = 'neo-maths-progress-v1';

  var localBackend = {
    _read: function () {
      try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
      catch (e) { return {}; }
    },
    _write: function (data) {
      try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* storage unavailable */ }
    },
    get: function (lessonId) { return this._read()[lessonId] || null; },
    getAll: function () { return this._read(); },
    set: function (lessonId, state) {
      var data = this._read();
      data[lessonId] = { state: state, at: new Date().toISOString() };
      this._write(data);
    },
    clear: function () { try { localStorage.removeItem(KEY); } catch (e) {} }
  };

  var backend = localBackend;

  window.NEOProgress = {
    STATES: { OPENED: 'opened', COMPLETE: 'complete' },

    setBackend: function (b) { backend = b; },        // future: remote real-time backend

    markOpened: function (lessonId) {
      var current = backend.get(lessonId);
      if (!current || current.state !== this.STATES.COMPLETE) {
        backend.set(lessonId, this.STATES.OPENED);
      }
    },
    markComplete: function (lessonId) { backend.set(lessonId, this.STATES.COMPLETE); },
    get: function (lessonId) { return backend.get(lessonId); },
    getAll: function () { return backend.getAll(); },
    reset: function () { backend.clear(); },

    /* Called from a small snippet injected into each lesson page at build
       time. Marks the lesson opened on load; a lesson can call
       NEOProgress.markComplete(id) from its own completion moment. */
    autoTrack: function (lessonId) {
      this.markOpened(lessonId);
      window.NEO_LESSON_ID = lessonId;
    }
  };
})();
