const NS = 'http://www.w3.org/2000/svg';

function el(name, attrs = {}) {
  const node = document.createElementNS(NS, name);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  return node;
}

function pathFromPose(pose) {
  const tipX = 70 + pose.tongueTipX;
  const tipY = 30 + pose.tongueTipY;
  const bodyY = 33 + pose.tongueBodyY;
  const arch = pose.tongueArch || 0;
  return `M 95 129 C ${tipX - 24} ${bodyY + 20}, ${tipX - 10} ${tipY + arch}, ${tipX} ${tipY} C ${tipX + 18} ${tipY + arch * 0.25}, 165 ${bodyY - arch}, 205 ${bodyY + 13} C 177 ${bodyY + 30}, 135 ${bodyY + 35}, 95 129 Z`;
}

function lipsFromPose(pose) {
  const gap = pose.lipGap ?? 10;
  const round = pose.lipRound ?? 0;
  const protrude = round * 11;
  const upperY = 70 - gap / 2;
  const lowerY = 70 + gap / 2;
  return {
    upper: `M 238 ${upperY} C ${250 + protrude} ${upperY - 8}, ${267 + protrude} ${upperY - 4}, ${281 + protrude} ${70 - gap * 0.12}`,
    lower: `M 238 ${lowerY} C ${250 + protrude} ${lowerY + 8}, ${267 + protrude} ${lowerY + 4}, ${281 + protrude} ${70 + gap * 0.12}`
  };
}

export class MouthStage {
  constructor(container, { compact = false } = {}) {
    this.container = container;
    this.compact = compact;
    this.animations = [];
    this.pose = null;
    this.build();
  }

  build() {
    this.container.innerHTML = '';
    this.svg = el('svg', {
      viewBox: '0 0 320 210',
      role: 'img',
      'aria-label': '発音運動を示す簡略口腔断面図',
      class: `mouth-svg${this.compact ? ' is-compact' : ''}`
    });

    const defs = el('defs');
    const clip = el('clipPath', { id: `oral-clip-${Math.random().toString(36).slice(2)}` });
    clip.appendChild(el('path', { d: 'M72 37 C129 6 220 12 268 53 C295 76 293 117 258 139 C209 171 126 178 82 142 C53 119 45 71 72 37 Z' }));
    defs.appendChild(clip);
    this.svg.appendChild(defs);

    this.head = el('path', {
      d: 'M65 31 C128 1 224 8 276 48 C307 72 305 121 265 148 C212 184 119 188 68 150 C31 122 30 64 65 31 Z',
      class: 'organ organ-head'
    });
    this.svg.appendChild(this.head);

    this.nasal = el('path', {
      d: 'M87 47 C129 23 183 25 224 44 C198 52 172 62 154 77 C127 69 105 60 87 47 Z',
      class: 'organ organ-nasal'
    });
    this.svg.appendChild(this.nasal);

    this.palate = el('path', {
      d: 'M96 67 C130 50 176 47 220 59 C199 65 182 72 163 84 C140 78 117 74 96 67 Z',
      class: 'organ organ-palate'
    });
    this.svg.appendChild(this.palate);

    this.teeth = el('path', {
      d: 'M221 61 L239 63 L239 91 L222 90 Z M221 91 L239 92 L239 112 L224 111 Z',
      class: 'organ organ-teeth'
    });
    this.svg.appendChild(this.teeth);

    this.tongueGhost = el('path', {
      d: pathFromPose({ tongueTipX: 32, tongueTipY: 54, tongueBodyY: 52, tongueArch: 10 }),
      class: 'organ organ-tongue organ-tongue-ghost'
    });
    this.svg.appendChild(this.tongueGhost);

    this.tongue = el('path', {
      d: pathFromPose({ tongueTipX: 32, tongueTipY: 54, tongueBodyY: 52, tongueArch: 10 }),
      class: 'organ organ-tongue'
    });
    this.svg.appendChild(this.tongue);

    this.glottis = el('g', { class: 'organ organ-glottis' });
    this.glottis.appendChild(el('path', { d: 'M87 130 C78 143 77 160 85 174', class: 'glottis-line glottis-left' }));
    this.glottis.appendChild(el('path', { d: 'M99 130 C108 143 109 160 101 174', class: 'glottis-line glottis-right' }));
    this.svg.appendChild(this.glottis);

    this.upperLip = el('path', { class: 'organ organ-lip organ-upper-lip' });
    this.lowerLip = el('path', { class: 'organ organ-lip organ-lower-lip' });
    this.svg.appendChild(this.upperLip);
    this.svg.appendChild(this.lowerLip);

    this.airflow = el('g', { class: 'organ organ-airflow' });
    for (let i = 0; i < 7; i += 1) {
      const particle = el('circle', {
        cx: String(230 + i * 11),
        cy: String(69 + (i % 2 ? 4 : -3)),
        r: String(2.4 - i * 0.12),
        class: 'air-particle'
      });
      this.airflow.appendChild(particle);
    }
    this.svg.appendChild(this.airflow);

    this.focusRing = el('ellipse', {
      cx: '154', cy: '88', rx: '72', ry: '50', class: 'focus-ring'
    });
    this.svg.appendChild(this.focusRing);

    this.container.appendChild(this.svg);
  }

  stop() {
    this.animations.forEach((animation) => animation.cancel());
    this.animations = [];
    this.svg.classList.remove('is-playing', 'is-imitating', 'is-transitioning', 'is-difference');
  }

  applyPose(pose, { ghostPose = null, duration = 0, easing = 'ease-in-out' } = {}) {
    this.pose = pose;
    const lips = lipsFromPose(pose);
    const tonguePath = pathFromPose(pose);

    if (duration > 0 && this.tongue.getAttribute('d')) {
      const fadeOut = this.tongue.animate(
        [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0.35, transform: 'scale(0.985)' }],
        { duration: duration * 0.42, easing, fill: 'forwards' }
      );
      this.animations.push(fadeOut);
      window.setTimeout(() => {
        this.tongue.setAttribute('d', tonguePath);
        const fadeIn = this.tongue.animate(
          [{ opacity: 0.35, transform: 'scale(0.985)' }, { opacity: 1, transform: 'scale(1)' }],
          { duration: duration * 0.58, easing, fill: 'forwards' }
        );
        this.animations.push(fadeIn);
      }, duration * 0.4);
    } else {
      this.tongue.setAttribute('d', tonguePath);
    }

    this.upperLip.setAttribute('d', lips.upper);
    this.lowerLip.setAttribute('d', lips.lower);
    this.svg.style.setProperty('--airflow-strength', String(pose.airflow ?? 0));
    this.svg.style.setProperty('--jaw-shift', `${pose.jaw ?? 0}px`);
    this.svg.classList.toggle('is-voiced', Boolean(pose.voiced));
    this.svg.classList.toggle('is-lip-dental', Boolean(pose.lipDental));
    this.svg.classList.toggle('is-tap', Boolean(pose.tap));
    this.svg.classList.toggle('is-trill', Boolean(pose.trill));

    if (ghostPose) {
      this.tongueGhost.setAttribute('d', pathFromPose(ghostPose));
      this.tongueGhost.style.opacity = '1';
    } else {
      this.tongueGhost.style.opacity = '0';
    }
  }

  setFocus(focus = 'all') {
    this.svg.dataset.focus = focus;
    const focusMap = {
      tongue: { cx: 151, cy: 98, rx: 84, ry: 58 },
      lips: { cx: 258, cy: 78, rx: 45, ry: 38 },
      airflow: { cx: 258, cy: 76, rx: 67, ry: 38 },
      voice: { cx: 91, cy: 150, rx: 39, ry: 48 },
      all: { cx: 162, cy: 100, rx: 128, ry: 82 }
    };
    const target = focusMap[focus] || focusMap.all;
    Object.entries(target).forEach(([key, value]) => this.focusRing.setAttribute(key, String(value)));
  }

  play(pose, { speed = 1, focus = 'all', mode = 'normal', sourcePose = null } = {}) {
    this.stop();
    this.setFocus(focus);
    const base = Math.max(280, 900 / Math.max(speed, 0.25));

    if (mode === 'transition' && sourcePose) {
      this.applyPose(sourcePose);
      this.svg.classList.add('is-transitioning');
      window.setTimeout(() => this.applyPose(pose, { duration: base * 0.82 }), 90);
      return;
    }

    if (mode === 'difference' && sourcePose) {
      this.applyPose(pose, { ghostPose: sourcePose });
      this.svg.classList.add('is-difference');
      const pulse = this.focusRing.animate(
        [{ opacity: 0.15, transform: 'scale(0.94)' }, { opacity: 0.9, transform: 'scale(1.05)' }, { opacity: 0.15, transform: 'scale(0.94)' }],
        { duration: base * 1.25, iterations: Infinity, easing: 'ease-in-out' }
      );
      this.animations.push(pulse);
      return;
    }

    this.applyPose(pose);
    this.svg.classList.add('is-playing');

    if (mode === 'imitate') {
      this.svg.classList.add('is-imitating');
      const stagePulse = this.svg.animate(
        [
          { opacity: 1, transform: 'scale(1)' },
          { opacity: 1, transform: 'scale(1.015)', offset: 0.28 },
          { opacity: 0.5, transform: 'scale(0.99)', offset: 0.44 },
          { opacity: 0.5, transform: 'scale(0.99)', offset: 0.78 },
          { opacity: 1, transform: 'scale(1)' }
        ],
        { duration: base * 2.2, iterations: 3, easing: 'ease-in-out' }
      );
      this.animations.push(stagePulse);
    }

    if (pose.tap) {
      const taps = pose.trill ? 4 : 1;
      const frames = [];
      for (let i = 0; i < taps; i += 1) {
        frames.push({ transform: 'translateY(9px) rotate(0deg)' });
        frames.push({ transform: 'translateY(-2px) rotate(-1deg)' });
      }
      frames.push({ transform: 'translateY(9px) rotate(0deg)' });
      const tapAnimation = this.tongue.animate(frames, {
        duration: base * (pose.trill ? 0.88 : 0.62),
        iterations: mode === 'imitate' ? 3 : 1,
        easing: 'ease-in-out'
      });
      this.animations.push(tapAnimation);
    }
  }
}
