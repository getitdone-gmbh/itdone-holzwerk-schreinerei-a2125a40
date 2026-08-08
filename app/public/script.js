document.getElementById('jahr').textContent = new Date().getFullYear();

const params = new URLSearchParams(window.location.search);
const status = params.get('status');
const statusBox = document.getElementById('form-status');

if (status && statusBox) {
  statusBox.hidden = false;
  if (status === 'erfolg') {
    statusBox.textContent = 'Danke für Ihre Nachricht! Wir melden uns in Kürze bei Ihnen.';
    statusBox.classList.add('success');
  } else {
    statusBox.textContent = 'Bitte füllen Sie alle Pflichtfelder aus und versuchen Sie es erneut.';
    statusBox.classList.add('error');
  }
}
