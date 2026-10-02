document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('[data-role-filter]');
  links.forEach((link) => {
    link.addEventListener('click', () => {
      const role = link.dataset.roleFilter;
      const cards = document.querySelectorAll('[data-role-card]');
      cards.forEach((card) => {
        if (!role || role === 'all') {
          card.style.display = 'block';
        } else {
          card.style.display = card.dataset.roleCard === role ? 'block' : 'none';
        }
      });
    });
  });
});
