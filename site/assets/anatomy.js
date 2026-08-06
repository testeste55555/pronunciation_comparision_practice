export const ANATOMY_MODEL_STATUS = Object.freeze({
  status: 'prototype-only',
  classroomUse: false,
  description: '制御点方式への移行確認用モデル。音声学的監修前。'
});

export const TONGUE_POINT_NAMES = Object.freeze([
  'root',
  'rear',
  'mid',
  'front',
  'blade',
  'tip'
]);

export const NEUTRAL_TONGUE = Object.freeze({
  root: Object.freeze({ x: 104, y: 162 }),
  rear: Object.freeze({ x: 128, y: 139 }),
  mid: Object.freeze({ x: 158, y: 123 }),
  front: Object.freeze({ x: 188, y: 116 }),
  blade: Object.freeze({ x: 215, y: 116 }),
  tip: Object.freeze({ x: 236, y: 119 })
});

export function clonePoint(point) {
  return { x: Number(point.x), y: Number(point.y) };
}

export function cloneTongue(tongue = NEUTRAL_TONGUE) {
  return Object.fromEntries(
    TONGUE_POINT_NAMES.map((name) => [name, clonePoint(tongue[name] || NEUTRAL_TONGUE[name])])
  );
}

export function normalizePose(pose = {}) {
  return {
    ...pose,
    tongue: cloneTongue(pose.tongue),
    lipGap: Number.isFinite(pose.lipGap) ? pose.lipGap : 12,
    lipRound: Number.isFinite(pose.lipRound) ? pose.lipRound : 0,
    jaw: Number.isFinite(pose.jaw) ? pose.jaw : 0,
    airflow: Number.isFinite(pose.airflow) ? pose.airflow : 0,
    voiced: Boolean(pose.voiced),
    lipDental: Boolean(pose.lipDental),
    tap: Number(pose.tap || 0),
    trill: Boolean(pose.trill),
    velumOpen: Number.isFinite(pose.velumOpen) ? pose.velumOpen : 0
  };
}

export function interpolateNumber(from, to, progress) {
  return from + (to - from) * progress;
}

export function interpolatePose(fromPose, toPose, progress) {
  const from = normalizePose(fromPose);
  const to = normalizePose(toPose);
  const tongue = {};

  TONGUE_POINT_NAMES.forEach((name) => {
    tongue[name] = {
      x: interpolateNumber(from.tongue[name].x, to.tongue[name].x, progress),
      y: interpolateNumber(from.tongue[name].y, to.tongue[name].y, progress)
    };
  });

  return {
    ...to,
    tongue,
    lipGap: interpolateNumber(from.lipGap, to.lipGap, progress),
    lipRound: interpolateNumber(from.lipRound, to.lipRound, progress),
    jaw: interpolateNumber(from.jaw, to.jaw, progress),
    airflow: interpolateNumber(from.airflow, to.airflow, progress),
    velumOpen: interpolateNumber(from.velumOpen, to.velumOpen, progress),
    voiced: progress < 0.5 ? from.voiced : to.voiced,
    lipDental: progress < 0.5 ? from.lipDental : to.lipDental,
    tap: interpolateNumber(from.tap, to.tap, progress),
    trill: progress < 0.5 ? from.trill : to.trill
  };
}

function smoothCurve(points) {
  if (points.length < 2) return '';
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    const middleX = (current.x + next.x) / 2;
    const middleY = (current.y + next.y) / 2;
    path += ` Q ${current.x} ${current.y}, ${middleX} ${middleY}`;
  }
  const last = points.at(-1);
  path += ` T ${last.x} ${last.y}`;
  return path;
}

export function tonguePathFromPose(pose) {
  const normalized = normalizePose(pose);
  const upper = TONGUE_POINT_NAMES.map((name) => normalized.tongue[name]);
  const lowerThickness = [13, 18, 22, 24, 19, 12];
  const lower = [...upper].reverse().map((point, reverseIndex) => {
    const originalIndex = upper.length - 1 - reverseIndex;
    return {
      x: point.x - (originalIndex < 2 ? 3 : 0),
      y: point.y + lowerThickness[originalIndex]
    };
  });

  return `${smoothCurve(upper)} L ${lower[0].x} ${lower[0].y} ${smoothCurve(lower).replace(/^M [^QTL]+/, '')} Z`;
}

export function tongueSurfacePath(pose) {
  const normalized = normalizePose(pose);
  return smoothCurve(TONGUE_POINT_NAMES.map((name) => normalized.tongue[name]));
}

export function withTongueTipOffset(pose, offsetY = 0, offsetX = 0) {
  const next = normalizePose(pose);
  next.tongue.tip.x += offsetX;
  next.tongue.tip.y += offsetY;
  next.tongue.blade.x += offsetX * 0.45;
  next.tongue.blade.y += offsetY * 0.55;
  return next;
}

export function timelineMs(baseMs, playbackRate = 1) {
  const rate = Math.max(0.25, Number(playbackRate) || 1);
  return baseMs / rate;
}

export function validatePose(pose) {
  const errors = [];
  const normalized = normalizePose(pose);

  TONGUE_POINT_NAMES.forEach((name) => {
    const point = normalized.tongue[name];
    if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
      errors.push(`tongue.${name} must contain finite x/y values`);
    }
  });

  ['lipGap', 'lipRound', 'jaw', 'airflow', 'velumOpen'].forEach((name) => {
    if (!Number.isFinite(normalized[name])) errors.push(`${name} must be finite`);
  });

  return errors;
}
