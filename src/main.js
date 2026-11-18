import './style.css';
import './motion.css';
import './hero-motion.css';
import './readability.css';
import { initScrollExperience } from './motion.js';
import { questions, references } from './content.js';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
initScrollExperience(reducedMotion);
if (!reducedMotion && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('js-motion');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
const progress = document.querySelector('.scroll-progress');
let ticking = false;
addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    const total = document.documentElement.scrollHeight - innerHeight;
    progress.style.width = `${total > 0 ? scrollY / total * 100 : 0}%`;
    ticking = false;
  });
}, { passive: true });

const box = document.querySelector('#quiz-box');
let current = 0;
let answers = [];
let reviewing = false;
function renderQuestion(focus = false) {
  const q = questions[current];
  box.innerHTML = `<div class="quiz-top"><span>SEU MOMENTO DE APRENDER</span><span>${current + 1} / ${questions.length}</span></div><div class="quiz-progress" role="progressbar" aria-label="Progresso do quiz" aria-valuemin="0" aria-valuemax="${questions.length}" aria-valuenow="${current}"><span style="width:${current / questions.length * 100}%"></span></div><h3 tabindex="-1">${q.question}</h3><div class="options"></div><div class="feedback" aria-live="polite"></div>`;
  const options = box.querySelector('.options');
  q.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.className = 'option'; button.textContent = option;
    button.addEventListener('click', () => chooseAnswer(index));
    options.append(button);
  });
  if (focus) box.querySelector('h3').focus({ preventScroll: true });
}
function chooseAnswer(index) {
  if (answers.length > current) return;
  const q = questions[current];
  answers.push(index);
  box.querySelectorAll('.option').forEach((button, i) => {
    button.disabled = true;
    if (i === q.correct) { button.classList.add('correct'); button.textContent = `✓ ${button.textContent}`; }
    else if (i === index) { button.classList.add('wrong'); button.textContent = `✕ ${button.textContent}`; }
  });
  const feedback = box.querySelector('.feedback');
  const title = document.createElement('strong');
  title.textContent = index === q.correct ? 'Isso mesmo!' : 'Vamos aprender juntos.';
  feedback.append(title, document.createTextNode(q.explanation));
  const next = document.createElement('button');
  next.className = 'button'; next.textContent = current === questions.length - 1 ? 'Ver meu resultado' : 'Próxima pergunta';
  next.addEventListener('click', () => { current++; current < questions.length ? renderQuestion(true) : renderResult(); });
  box.append(next);
  next.focus({ preventScroll: true });
}
function renderResult() {
  const score = answers.filter((answer, i) => answer === questions[i].correct).length;
  box.innerHTML = `<div class="quiz-top">QUIZ CONCLUÍDO</div><p class="score">${score}<small> / ${questions.length}</small></p><h3 tabindex="-1">${score >= 6 ? 'Conhecimento também é cuidado.' : 'Cada descoberta é um passo.'}</h3><p>Você concluiu o quiz! Continue essa conversa e compartilhe o que aprendeu.</p><button class="button" id="review">Revisar respostas</button> <button class="button" id="restart">Tentar novamente</button><div id="review-list"></div>`;
  box.querySelector('h3').focus({ preventScroll: true });
  reviewing = false;
  box.querySelector('#restart').addEventListener('click', () => { current = 0; answers = []; renderQuestion(true); });
  box.querySelector('#review').addEventListener('click', () => {
    reviewing = !reviewing;
    box.querySelector('#review').textContent = reviewing ? 'Fechar revisão' : 'Revisar respostas';
    const list = box.querySelector('#review-list'); list.replaceChildren();
    if (reviewing) questions.forEach((q, i) => {
      const article = document.createElement('article'); article.className = 'review-item';
      const title = document.createElement('strong'); title.textContent = `${answers[i] === q.correct ? '✓' : '✕'} ${q.question}`;
      const chosen = document.createElement('p'); chosen.textContent = `Sua resposta: ${q.options[answers[i]]}`;
      const answer = document.createElement('p'); answer.textContent = `Resposta correta: ${q.options[q.correct]}. ${q.explanation}`;
      article.append(title, chosen, answer); list.append(article);
    });
  });
}
renderQuestion();

const list = document.querySelector('#reference-list');
references.forEach(ref => {
  const article = document.createElement('article'); article.className = 'reference';
  const institution = document.createElement('small'); institution.textContent = ref.institution;
  const body = document.createElement('div');
  const title = document.createElement('h3'); title.textContent = ref.title;
  const description = document.createElement('p'); description.textContent = ref.description;
  const link = document.createElement('a'); link.href = ref.url; link.textContent = 'Acessar'; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.setAttribute('aria-label', `Acessar ${ref.title} (nova aba)`);
  body.append(title, description); article.append(institution, body, link); list.append(article);
});

