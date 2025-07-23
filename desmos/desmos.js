document.addEventListener('DOMContentLoaded', function() {
  const descArea = document.getElementById('desmos-desc-area');
  document.querySelectorAll('.desmos-sidebar button').forEach(btn => {
    btn.addEventListener('click', function() {
      const link = btn.getAttribute('data-link');
      const desc = btn.getAttribute('data-desc') || '';
      document.getElementById('desmos-frame').src = link;
descArea.textContent = '';
descArea.innerHTML = desc.replace(/\\n/g, '<br>');
    });
  });
  // Optionally, show the first description by default
  const firstBtn = document.querySelector('.desmos-sidebar button');
  if (firstBtn && descArea) {
    const firstDescDiv = document.querySelector('[data-desc-first]');
descArea.textContent = firstDescDiv ? firstDescDiv.getAttribute('data-desc-first') : '';
  }
});
