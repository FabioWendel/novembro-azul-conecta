// Scroll drives the scenes; CSS animates the hero independently while visible.
export function initScrollExperience(reducedMotion) {
  if (reducedMotion) return;
  const hero = document.querySelector('.hero');
  const scene = document.querySelector('.scroll-story');
  const stage = scene.querySelector('.story-stage');
  const chapters = [...scene.querySelectorAll('.story-chapter')];
  const words = [...document.querySelectorAll('.manifesto-word')];
  const careCards = [...document.querySelectorAll('.care-card')];
  const feature = document.querySelector('.feature-panel');
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const compactStory = matchMedia('(max-width: 900px), (max-height: 800px)');
  let frame = 0;
  let active = -1;
  let heroVisible = true;
  const syncHeroPlayback = () => hero.classList.toggle('is-animating', heroVisible && !document.hidden && !media.matches);
  if ('IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      syncHeroPlayback();
    });
    heroObserver.observe(hero);
  }
  document.addEventListener('visibilitychange', syncHeroPlayback);
  media.addEventListener('change', syncHeroPlayback);
  syncHeroPlayback();
  const update = () => {
    frame = 0;
    if (media.matches) {
      document.documentElement.classList.remove('scroll-enhanced');
      chapters.forEach(chapter => chapter.removeAttribute('aria-hidden'));
      return;
    }
    document.documentElement.classList.add('scroll-enhanced');
    const viewport = innerHeight;
    const heroRect = hero.getBoundingClientRect();
    const heroProgress = clamp(-heroRect.top / heroRect.height);
    hero.style.setProperty('--hero-scroll', heroProgress.toFixed(4));
    const rect = scene.getBoundingClientRect();
    const value = clamp(-rect.top / Math.max(1, rect.height - viewport));
    stage.style.setProperty('--story-progress', value.toFixed(4));
    const chapterIndex = Math.min(chapters.length - 1, Math.floor(value * chapters.length));
    if (active !== chapterIndex) {
      active = chapterIndex;
      chapters.forEach((chapter, index) => {
        chapter.classList.toggle('is-active', index === active);
      });
      scene.querySelectorAll('.story-step').forEach((step, index) => step.classList.toggle('is-active', index === active));
      stage.dataset.chapter = String(active);
    }
    chapters.forEach((chapter, index) => {
      if (compactStory.matches) chapter.removeAttribute('aria-hidden');
      else chapter.setAttribute('aria-hidden', String(index !== active));
    });
    scene.querySelector('.story-line-fill').style.transform = `scaleX(${value})`;
    const manifesto = document.querySelector('.manifesto').getBoundingClientRect();
    const reveal = clamp((viewport * .85 - manifesto.top) / (viewport * .65));
    words.forEach((word, index) => word.style.setProperty('--word-opacity', String(.16 + .84 * clamp((reveal * (words.length + 4) - index) / 3))));
    const featureRect = feature.getBoundingClientRect();
    const featureProgress = clamp((viewport - featureRect.top) / (viewport + featureRect.height));
    feature.style.setProperty('--anatomy-turn', `${(featureProgress - .5) * 22}deg`);
    careCards.forEach((card, index) => {
      const cardRect = card.getBoundingClientRect();
      const entry = clamp((viewport - cardRect.top) / (viewport * .75));
      card.style.setProperty('--card-turn', `${(1 - entry) * (index % 2 ? -9 : 9)}deg`);
      card.style.setProperty('--card-rise', `${(1 - entry) * 70}px`);
    });
  };
  const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule, { passive: true });
  media.addEventListener('change', schedule);
  addEventListener('pageshow', schedule);
  schedule();
}
