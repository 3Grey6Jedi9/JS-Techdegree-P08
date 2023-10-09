// Add focus to the input fields when clicking in the corresponding labels.
const labels = document.querySelectorAll('label');
labels.forEach(label => {
  label.addEventListener('click', () => {
    const input = document.getElementById(label.getAttribute('for'));
    input.focus();
  });
});


