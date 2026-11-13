// Contact form: shows the device fields for bug reports and sends the form to Web3Forms
// without leaving the page. Without JavaScript the form still posts normally.
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  var reason = form.elements.reason;
  var bugFields = form.querySelector('.bug-fields');
  var status = form.querySelector('.form-status');
  var button = form.querySelector('button[type="submit"]');

  function toggleBugFields() {
    var isBug = reason.value === 'Bug report';
    bugFields.hidden = !isBug;
    bugFields.disabled = !isBug; // a disabled fieldset is neither validated nor sent
  }

  function setStatus(text, kind) {
    status.textContent = text;
    status.className = 'form-status' + (kind ? ' ' + kind : '');
  }

  reason.addEventListener('change', toggleBugFields);
  toggleBugFields();

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var data = new FormData(form);
    data.set('subject', 'Bobby Kids: ' + reason.value + ' (' + form.dataset.lang + ')');
    data.set('language', form.dataset.lang);

    button.disabled = true;
    setStatus(form.dataset.sending, '');

    fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(Object.fromEntries(data))
    })
      .then(function (response) {
        return response.json().catch(function () { return {}; }).then(function (json) {
          if (!response.ok || json.success === false) throw new Error(json.message || response.status);
        });
      })
      .then(function () {
        form.reset();
        toggleBugFields();
        setStatus(form.dataset.ok, 'ok');
      })
      .catch(function () {
        setStatus(form.dataset.fail, 'error');
      })
      .then(function () {
        button.disabled = false;
      });
  });
})();
