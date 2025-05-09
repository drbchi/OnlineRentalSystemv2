const faqItems = document.querySelectorAll('.faq-item');
const searchInput = document.querySelector('#faq-search');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  const icon = item.querySelector('.icon');

  question.addEventListener('click', () => {
    // Close other open FAQs
    faqItems.forEach(otherItem => {
      if (otherItem !== item) {
        otherItem.querySelector('.faq-answer').classList.remove('open');
        otherItem.querySelector('.icon').classList.remove('rotate');
      }
    });

    // Toggle current FAQ
    answer.classList.toggle('open');
    icon.classList.toggle('rotate');
  });
});

// Search functionality
searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.toLowerCase();

  faqItems.forEach(item => {
    const questionText = item.querySelector('.faq-question h3').textContent.toLowerCase();
    const answerText = item.querySelector('.faq-answer').textContent.toLowerCase();

    if (questionText.includes(searchTerm) || answerText.includes(searchTerm)) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
});