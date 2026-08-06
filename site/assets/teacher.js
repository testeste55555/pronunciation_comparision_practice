import { APP_VERSION, defaultState, profiles, scenes, sounds } from './data.js';
import { ANATOMY_MODEL_STATUS } from './anatomy.js';
import { MouthStage } from './mouth.js';

const STORAGE_KEY = 'pronunciation-comparison-state-v1';
const CHANNEL_NAME = 'pronunciation-comparison-channel-v1';
const channel = 'BroadcastChannel' in window ? new BroadcastChannel(CHANNEL_NAME) : null;

const elements = {
  versionLabel: document.querySelector('#versionLabel'),
  profileSelect: document.querySelector('#profileSelect'),
  soundTabs: document.querySelector('#soundTabs'),
  speedTabs: document.querySelector('#speedTabs'),
  sceneGrid: document.querySelector('#sceneGrid'),
  profileWarning: document.querySelector('#profileWarning'),
  japaneseInfo: document.querySelector('#japaneseInfo'),
  candidateInfo: document.querySelector('#candidateInfo'),
  coachingList: document.querySelector('#coachingList'),
  statusBadge: document.querySelector('#statusBadge'),
  confidenceBadge: document.querySelector('#confidenceBadge'),
  previewStatus: document.querySelector('#previewStatus'),
  blankButton: document.querySelector('#blankButton'),
  lockButton: document.querySelector('#lockButton'),
  openLearnerButton: document.querySelector('#openLearnerButton'),
  modelNote: document.querySelector('#modelNote')
};

const teacherMouth = new MouthStage(document.querySelector('#teacherMouth'));
let state = loadState();
let learnerWindow = null;

function loadState() {
  try {
    return { ...defaultState, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
  } catch {
    return { ...defaultState };
  }
}

function saveAndBroadcast() {
  state.revision = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  channel?.postMessage(state);
}

function getCurrentModels() {
  const sound = sounds[state.soundId] || sounds.shi;
  const profile = profiles[state.profileId] || profiles.unknown;
  const candidate = sound.candidates[state.profileId] || sound.candidates.unknown;
  return { sound, profile, candidate, japanese: sound.japanese };
}

function setState(patch, { force = false } = {}) {
  if (state.locked && !force && !('locked' in patch)) return;
  state = { ...state, ...patch };
  saveAndBroadcast();
  render();
}

function makeInfoRows(target, rows) {
  target.innerHTML = '';
  rows.forEach(([label, value]) => {
    const dt = document.createElement('dt');
    dt.textContent = label;
    const dd = document.createElement('dd');
    dd.textContent = value || '未設定';
    target.append(dt, dd);
  });
}

function renderControls() {
  elements.profileSelect.innerHTML = Object.values(profiles)
    .map((profile) => `<option value="${profile.id}">${profile.label}</option>`)
    .join('');
  elements.profileSelect.value = state.profileId;

  elements.soundTabs.innerHTML = Object.values(sounds)
    .map((sound) => `<button type="button" class="sound-button${sound.id === state.soundId ? ' is-active' : ''}" data-sound="${sound.id}">${sound.label}</button>`)
    .join('');

  const speeds = [0.25, 0.5, 1];
  elements.speedTabs.innerHTML = speeds
    .map((speed) => `<button type="button" class="speed-button${speed === state.speed ? ' is-active' : ''}" data-speed="${speed}">${speed}倍</button>`)
    .join('');

  elements.sceneGrid.innerHTML = scenes
    .map((scene) => `<button type="button" class="scene-button${scene.id === state.sceneId ? ' is-active' : ''}" data-scene="${scene.id}" ${state.locked && scene.id !== 'blank' ? 'disabled' : ''}>${scene.label}</button>`)
    .join('');

  elements.lockButton.textContent = state.locked ? '投影ロック解除' : '投影をロック';
  elements.lockButton.classList.toggle('is-active', state.locked);
}

function renderTeacherInfo() {
  const { sound, profile, candidate, japanese } = getCurrentModels();
  elements.profileWarning.textContent = `${profile.warning} ${sound.note}`;
  elements.modelNote.textContent = `${ANATOMY_MODEL_STATUS.description} 現在の座標はUIとアニメーション構造の検証値であり、授業提示・発音診断には使用できません。`;

  makeInfoRows(elements.japaneseInfo, [
    ['IPA', japanese.ipa], ['調音点', japanese.place], ['調音法', japanese.manner],
    ['声', japanese.voicing], ['息', japanese.airflow], ['唇', japanese.lips], ['声帯', japanese.glottis]
  ]);

  makeInfoRows(elements.candidateInfo, [
    ['IPA', candidate.ipa], ['調音点', candidate.place], ['調音法', candidate.manner],
    ['声', candidate.voicing], ['息', candidate.airflow], ['比較メモ', candidate.comparison]
  ]);

  elements.coachingList.innerHTML = japanese.coaching.map((item) => `<li>${item}</li>`).join('');
  elements.statusBadge.textContent = `status: ${sound.status}`;
  elements.confidenceBadge.textContent = `confidence: ${sound.confidence}`;
  elements.previewStatus.textContent = `表示：${scenes.find((scene) => scene.id === state.sceneId)?.label || state.sceneId}｜${state.speed}倍${state.locked ? '（ロック中）' : ''}`;
}

function renderTeacherStage() {
  const { sound, candidate, japanese } = getCurrentModels();
  const scene = state.sceneId;
  const speed = state.speed;

  if (scene === 'blank') {
    teacherMouth.stop();
    teacherMouth.container.style.opacity = '.12';
    return;
  }

  teacherMouth.container.style.opacity = '1';
  if (scene.startsWith('source')) {
    teacherMouth.play(candidate.pose, { speed, focus: sound.focus });
  } else if (scene === 'tongue') {
    teacherMouth.play(japanese.pose, { speed, focus: 'tongue' });
  } else if (scene === 'lips') {
    teacherMouth.play(japanese.pose, { speed, focus: 'lips' });
  } else if (scene === 'airflow') {
    teacherMouth.play(japanese.pose, { speed, focus: 'airflow' });
  } else if (scene === 'voice') {
    teacherMouth.play(japanese.pose, { speed, focus: 'voice' });
  } else if (scene === 'transition') {
    teacherMouth.play(japanese.pose, { speed, focus: sound.focus, mode: 'transition', sourcePose: candidate.pose });
  } else if (scene === 'difference') {
    teacherMouth.play(japanese.pose, { speed, focus: sound.focus, mode: 'difference', sourcePose: candidate.pose });
  } else if (scene === 'imitate') {
    teacherMouth.play(japanese.pose, { speed, focus: sound.focus, mode: 'imitate' });
  } else {
    teacherMouth.play(japanese.pose, { speed, focus: sound.focus });
  }
}

function render() {
  elements.versionLabel.textContent = `教師用操作画面｜${APP_VERSION}`;
  renderControls();
  renderTeacherInfo();
  renderTeacherStage();
}

elements.profileSelect.addEventListener('change', (event) => setState({ profileId: event.target.value, sceneId: 'blank' }));
elements.soundTabs.addEventListener('click', (event) => {
  const button = event.target.closest('[data-sound]');
  if (button) setState({ soundId: button.dataset.sound, sceneId: 'blank' });
});
elements.speedTabs.addEventListener('click', (event) => {
  const button = event.target.closest('[data-speed]');
  if (button) setState({ speed: Number(button.dataset.speed) });
});
elements.sceneGrid.addEventListener('click', (event) => {
  const button = event.target.closest('[data-scene]');
  if (button) setState({ sceneId: button.dataset.scene });
});
elements.blankButton.addEventListener('click', () => setState({ sceneId: 'blank' }, { force: true }));
elements.lockButton.addEventListener('click', () => setState({ locked: !state.locked }, { force: true }));
elements.openLearnerButton.addEventListener('click', () => {
  learnerWindow = window.open('learner.html', 'pronunciationLearner', 'popup=yes,width=1280,height=800');
  learnerWindow?.focus();
  window.setTimeout(saveAndBroadcast, 400);
});

window.addEventListener('storage', (event) => {
  if (event.key !== STORAGE_KEY || !event.newValue) return;
  try {
    state = { ...defaultState, ...JSON.parse(event.newValue) };
    render();
  } catch {
    // Ignore malformed local state.
  }
});

saveAndBroadcast();
render();
