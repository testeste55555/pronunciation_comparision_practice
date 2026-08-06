import {
  interpolatePose,
  normalizePose,
  timelineMs,
  tonguePathFromPose,
  tongueSurfacePath,
  withTongueTipOffset
} from './anatomy.js';

const NS = 'http://www.w3.org/2000/svg';

function el(name, attrs = {}) {
  const node = document.createElementNS(NS, name);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
  return node;
}

function lipsFromPose(pose) {
  const gap = pose.lipGap;
  const round = pose.lipRound;
  const protrude = round * 12;
  const upperY = 105 - gap / 2;
  const lowerY = 105 + gap / 2 + pose.jaw * 0.35;
  return {
    upper: `M 260 ${upperY} C ${272 + protrude} ${upperY - 7}, ${289 + protrude} ${upperY - 4}, ${304 + protrude} ${104 - gap * 0.08}`,
    lower: `M 260 ${lowerY} C ${272 + protrude} ${lowerY + 7}, ${289 + protrude} ${lowerY + 4}, ${304 + protrude} ${106 + gap * 0.08 + pose.jaw * 0.35}`
  };
}

function easeInOut(progress) {
  return progress < 0.5
    ? 2 * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
}

export class MouthStage {
  constructor(container, { compact = false } = {}) {
    this.container = container;
    this.compact = compact;
    this.animations = [];
    this.timers = [];
    this.frames = [];
    this.pose = normalizePose();
    this.speed = 1;
    this.build();
  }

  build() {
    this.container.innerHTML = '';
    this.svg = el('svg', {
      viewBox: '0 0 340 230',
      role: 'img',
      'aria-label': '発音運動を示す口腔矢状断の構造試作図',
      class: `mouth-svg${this.compact ? ' is-compact' : ''}`
    });

    this.tissue = el('path', {
      d: 'M 61 29 C 102 6 172 7 222 20 C 260 30 285 50 294 76 C 299 91 298 116 291 131 C 281 153 262 164 246 174 C 228 186 220 202 216 222 L 86 222 C 84 203 80 185 70 169 C 57 149 44 130 40 108 C 35 79 40 47 61 29 Z',
      class: 'organ organ-tissue'
    });
    this.svg.appendChild(this.tissue);

    this.nasalCavity = el('path', {
      d: 'M 72 53 C 111 31 166 30 215 44 C 235 50 248 58 257 68 C 237 69 218 73 201 81 C 171 73 137 72 105 79 C 91 73 80 64 72 53 Z',
      class: 'organ organ-nasal'
    });
    this.svg.appendChild(this.nasalCavity);

    this.hardPalate = el('path', {
      d: 'M 101 85 C 133 72 171 72 202 81 C 217 85 228 89 240 91',
      class: 'organ landmark organ-hard-palate'
    });
    this.svg.appendChild(this.hardPalate);

    this.softPalate = el('path', {
      d: 'M 101 85 C 88 94 82 105 83 116 C 84 125 91 131 100 132',
      class: 'organ landmark organ-soft-palate'
    });
    this.svg.appendChild(this.softPalate);

    this.uvula = el('path', {
      d: 'M 99 130 C 96 138 98 144 103 148 C 108 143 109 136 105 131',
      class: 'organ organ-uvula'
    });
    this.svg.appendChild(this.uvula);

    this.alveolarRidge = el('path', {
      d: 'M 237 91 C 244 91 251 92 258 95',
      class: 'organ landmark organ-alveolar'
    });
    this.svg.appendChild(this.alveolarRidge);

    this.upperTeeth = el('path', {
      d: 'M 257 91 L 270 93 L 269 112 L 258 112 Z M 270 93 L 281 96 L 279 113 L 269 112 Z',
      class: 'organ organ-teeth'
    });
    this.lowerTeeth = el('path', {
      d: 'M 258 119 L 270 118 L 270 136 L 259 137 Z M 270 118 L 281 116 L 281 133 L 270 136 Z',
      class: 'organ organ-teeth organ-lower-teeth'
    });
    this.svg.append(this.upperTeeth, this.lowerTeeth);

    this.pharynx = el('path', {
      d: 'M 82 116 C 74 142 75 171 87 199',
      class: 'organ landmark organ-pharynx'
    });
    this.svg.appendChild(this.pharynx);

    this.tongueGhost = el('path', { class: 'organ organ-tongue organ-tongue-ghost' });
    this.tongue = el('path', { class: 'organ organ-tongue' });
    this.tongueSurface = el('path', { class: 'organ organ-tongue-surface' });
    this.svg.append(this.tongueGhost, this.tongue, this.tongueSurface);

    this.glottis = el('g', { class: 'organ organ-glottis' });
    this.glottis.append(
      el('path', { d: 'M 91 179 C 85 189 85 202 91 214', class: 'glottis-line glottis-left' }),
      el('path', { d: 'M 103 179 C 109 189 109 202 103 214', class: 'glottis-line glottis-right' })
    );
    this.svg.appendChild(this.glottis);

    this.upperLip = el('path', { class: 'organ organ-lip organ-upper-lip' });
    this.lowerLip = el('path', { class: 'organ organ-lip organ-lower-lip' });
    this.svg.append(this.upperLip, this.lowerLip);

    this.airflow = el('g', { class: 'organ organ-airflow' });
    for (let index = 0; index < 9; index += 1) {
      this.airflow.appendChild(el('circle', {
        cx: 255 + index * 8,
        cy: 105 + (index % 3 - 1) * 4,
        r: Math.max(1.4, 3 - index * 0.16),
        class: 'air-particle'
      }));
    }
    this.svg.appendChild(this.airflow);

    this.velumAir = el('path', {
      d: 'M 99 124 C 91 107 89 88 99 73',
      class: 'organ organ-nasal-air'
    });
    this.svg.appendChild(this.velumAir);

    this.focusRing = el('ellipse', { cx: 165, cy: 117, rx: 128, ry: 88, class: 'focus-ring' });
    this.svg.appendChild(this.focusRing);

    if (!this.compact) {
      const landmarkGroup = el('g', { class: 'teacher-landmarks' });
      [
        [258, 94, '歯槽'], [200, 81, '硬口蓋'], [101, 86, '軟口蓋'],
        [237, 119, '舌先'], [188, 116, '舌前部'], [128, 139, '舌後部']
      ].forEach(([cx, cy, label]) => {
        landmarkGroup.appendChild(el('circle', { cx, cy, r: 2.8, class: 'landmark-dot' }));
        const text = el('text', { x: cx + 5, y: cy - 5, class: 'landmark-label' });
        text.textContent = label;
        landmarkGroup.appendChild(text);
      });
      this.svg.appendChild(landmarkGroup);
    }

    this.container.appendChild(this.svg);
    this.applyPose(this.pose);
  }

  setPlaybackRate(speed = 1) {
    this.speed = Math.max(0.25, Number(speed) || 1);
    this.svg.style.setProperty('--airflow-duration', `${timelineMs(1150, this.speed)}ms`);
    this.svg.style.setProperty('--glottis-duration', `${timelineMs(140, this.speed)}ms`);
    this.svg.querySelectorAll('.air-particle').forEach((particle, index) => {
      particle.style.animationDelay = `${-timelineMs(index * 165, this.speed)}ms`;
    });
  }

  stop() {
    this.animations.forEach((animation) => animation.cancel());
    this.animations = [];
    this.timers.forEach((timer) => window.clearTimeout(timer));
    this.timers = [];
    this.frames.forEach((frame) => window.cancelAnimationFrame(frame));
    this.frames = [];
    this.svg.classList.remove('is-playing', 'is-imitating', 'is-transitioning', 'is-difference');
  }

  renderPose(pose, ghostPose = null) {
    const normalized = normalizePose(pose);
    this.pose = normalized;
    const lips = lipsFromPose(normalized);

    this.tongue.setAttribute('d', tonguePathFromPose(normalized));
    this.tongueSurface.setAttribute('d', tongueSurfacePath(normalized));
    this.upperLip.setAttribute('d', lips.upper);
    this.lowerLip.setAttribute('d', lips.lower);
    this.lowerTeeth.style.transform = `translateY(${normalized.jaw * 0.35}px)`;
    this.svg.style.setProperty('--airflow-strength', String(normalized.airflow));
    this.svg.style.setProperty('--velum-opacity', String(Math.min(1, Math.max(0, normalized.velumOpen))));
    this.svg.classList.toggle('is-voiced', normalized.voiced);
    this.svg.classList.toggle('is-lip-dental', normalized.lipDental);

    if (ghostPose) {
      this.tongueGhost.setAttribute('d', tonguePathFromPose(ghostPose));
      this.tongueGhost.style.opacity = '1';
    } else {
      this.tongueGhost.style.opacity = '0';
    }
  }

  applyPose(pose, { ghostPose = null, duration = 0 } = {}) {
    const target = normalizePose(pose);
    if (!duration) {
      this.renderPose(target, ghostPose);
      return;
    }

    const source = normalizePose(this.pose);
    const startedAt = performance.now();
    const step = (now) => {
      const rawProgress = Math.min(1, (now - startedAt) / duration);
      this.renderPose(interpolatePose(source, target, easeInOut(rawProgress)), ghostPose);
      if (rawProgress < 1) {
        const frame = window.requestAnimationFrame(step);
        this.frames.push(frame);
      }
    };
    const frame = window.requestAnimationFrame(step);
    this.frames.push(frame);
  }

  setFocus(focus = 'all') {
    this.svg.dataset.focus = focus;
    const focusMap = {
      tongue: { cx: 173, cy: 126, rx: 91, ry: 61 },
      lips: { cx: 283, cy: 106, rx: 48, ry: 39 },
      airflow: { cx: 287, cy: 105, rx: 72, ry: 39 },
      voice: { cx: 97, cy: 197, rx: 37, ry: 35 },
      all: { cx: 170, cy: 119, rx: 136, ry: 93 }
    };
    const target = focusMap[focus] || focusMap.all;
    Object.entries(target).forEach(([key, value]) => this.focusRing.setAttribute(key, value));
  }

  animateTongueTip(pose, { cycles = 1, duration = 600, iterations = 1 } = {}) {
    const basePose = normalizePose(pose);
    const contactPose = withTongueTipOffset(basePose, -8, -1);
    const startedAt = performance.now();
    const totalDuration = duration * iterations;

    const step = (now) => {
      const elapsed = now - startedAt;
      const overallProgress = Math.min(1, elapsed / totalDuration);
      const local = (elapsed % duration) / duration;
      const wave = Math.max(0, Math.sin(local * Math.PI * 2 * cycles));
      this.renderPose(interpolatePose(basePose, contactPose, wave));
      if (overallProgress < 1) {
        const frame = window.requestAnimationFrame(step);
        this.frames.push(frame);
      } else {
        this.renderPose(basePose);
      }
    };
    const frame = window.requestAnimationFrame(step);
    this.frames.push(frame);
  }

  play(pose, { speed = 1, focus = 'all', mode = 'normal', sourcePose = null } = {}) {
    this.stop();
    this.setPlaybackRate(speed);
    this.setFocus(focus);
    const normalized = normalizePose(pose);
    const base = timelineMs(900, this.speed);

    if (mode === 'transition' && sourcePose) {
      this.renderPose(sourcePose);
      this.svg.classList.add('is-transitioning', 'is-playing');
      const timer = window.setTimeout(
        () => this.applyPose(normalized, { duration: base * 0.9 }),
        timelineMs(130, this.speed)
      );
      this.timers.push(timer);
      return;
    }

    if (mode === 'difference' && sourcePose) {
      this.renderPose(normalized, sourcePose);
      this.svg.classList.add('is-difference');
      const pulse = this.focusRing.animate(
        [
          { opacity: 0.15, transform: 'scale(0.94)' },
          { opacity: 0.9, transform: 'scale(1.05)' },
          { opacity: 0.15, transform: 'scale(0.94)' }
        ],
        { duration: base * 1.25, iterations: Infinity, easing: 'ease-in-out' }
      );
      this.animations.push(pulse);
      return;
    }

    this.renderPose(normalized);
    this.svg.classList.add('is-playing');

    if (mode === 'imitate') {
      this.svg.classList.add('is-imitating');
      const stagePulse = this.svg.animate(
        [
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 1, transform: 'scale(1.012)', offset: 0.28 },
          { opacity: 0.48, transform: 'scale(0.992)', offset: 0.44 },
          { opacity: 0.48, transform: 'scale(0.992)', offset: 0.78 },
          { opacity: 1, transform: 'scale(1)' }
        ],
        { duration: base * 2.2, iterations: 3, easing: 'ease-in-out' }
      );
      this.animations.push(stagePulse);
    }

    if (normalized.tap) {
      this.animateTongueTip(normalized, {
        cycles: normalized.trill ? 4 : 1,
        duration: base * (normalized.trill ? 0.9 : 0.62),
        iterations: mode === 'imitate' ? 3 : 1
      });
    }
  }
}
