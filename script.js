const lightbox = document.querySelector('#lightbox');
document.querySelectorAll('[data-photo]').forEach(button => button.addEventListener('click', () => {
  const source = button.querySelector('img');
  lightbox.querySelector('img').src = source.src;
  lightbox.querySelector('img').alt = source.alt;
  lightbox.querySelector('p').textContent = source.alt;
  lightbox.showModal();
}));
lightbox.querySelector('.close').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', event => { if (event.target === lightbox) { const r = lightbox.getBoundingClientRect(); if(event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) lightbox.close(); } });
document.querySelector('#year').textContent = new Date().getFullYear();

const bookingForm = document.querySelector('#booking-form');
const dateField = bookingForm.elements.date;
function harareNow() {
  const parts = new Intl.DateTimeFormat('en-GB', {timeZone:'Africa/Harare',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date());
  const p = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}` };
}
dateField.min = harareNow().date;
bookingForm.addEventListener('submit', event => {
  event.preventDefault();
  const fields = bookingForm.elements;
  const error = document.querySelector('#booking-error');
  error.textContent = '';
  const now = harareNow();
  dateField.min = now.date;
  const name = fields.customer.value.trim();
  if (!name) { error.textContent = 'Please enter your name.'; fields.customer.focus(); return; }
  if (!bookingForm.reportValidity()) return;
  if (fields.date.value < now.date || (fields.date.value === now.date && fields.time.value <= now.time)) {
    error.textContent = 'Please choose a future date and time (Harare time).';
    dateField.focus(); return;
  }
  const date = new Intl.DateTimeFormat('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric', timeZone:'Africa/Harare' }).format(new Date(fields.date.value + 'T12:00:00+02:00'));
  const message = `Hi Styles Barbershop! I’d like to request a booking.\n\nName: ${name}\nService: ${fields.service.value}\nPreferred date: ${date}\nPreferred time: ${fields.time.value} (Harare time)\n\nPlease confirm availability. Thank you!`;
  window.location.assign('https://wa.me/263775330294?text=' + encodeURIComponent(message));
});
