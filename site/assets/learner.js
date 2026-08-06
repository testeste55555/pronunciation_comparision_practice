import { defaultState, sounds } from './data.js';
import { MouthStage } from './mouth.js';

const STORAGE_KEY = 'pronunciation-comparison-state-v1';
const CHANNEL_NAME = 'pronunciation-comparison-channel-v1';
const channel = 'BroadcastChannel' in window ? new BroadcastChannel(CHANNEL_NAME) : null;
const stageElement = document.querySelector('#learnerStage');
const mouth = new MouthStage(document.querySelector('#learnerMouth'));
const params = new URLSearchParams(location.search);
const preview = params.get('preview') === '1';
let state = readState();

if (preview) stageElement.classList.add('is-preview');

function readState() {
  try {
    return { ...defaultState, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
  } catch {
    return { ...defaultState };
  }
}

function applyState(nextState) {
  state = { ...defaultState, ...nextState };
  const sound = sounds[state.soundId] || sounds.shi;
  const candidate = sound.candidates[state.profileId] || sound.candidates.unknown;
  const target = sound.japanese;
  const scene = state.sceneId;
  const speed = state.speed;

  stageElement.classList.toggle('is-blank', scene === 'blank');
  stageElement.classList.toggle('is-imitate', scene === 'imitate');
  mouth.stop();

  if (scene === 'blank') return;
  if (scene === 'source-audio' || scene === 'source-motion') {
    mouth.play(candidate.pose, { speed, focus: sound.focus });
  } else if (scene === 'target-audio' || scene === 'target-motion') {
    mouth.play(target.pose, { speed, focus: sound.focus });
  } else if (scene === 'tongue') {
    mouth.play(target.pose, { speed, focus: 'tongue' });
  } else if (scene === 'lips') {
    mouth.play(target.pose, { speed, focus: 'lips' });
  } else if (scene === 'airflow') {
    mouth.play(target.pose, { speed, focus: 'airflow' });
  } else if (scene === 'voice') {
    mouth.play(target.pose, { speed, focus: 'voice' });
  } else if (scene === 'transition') {
    mouth.play(target.pose, { speed, focus: sound.focus, mode: 'transition', sourcePose: candidate.pose });
  } else if (scene === 'difference') {
    mouth.play(target.pose, { speed, focus: sound.focus, mode: 'difference', sourcePose: candidate.pose });
  } else if (scene === 'imitate') {
    mouth.play(target.pose, { speed, focus: sound.focus, mode: 'imitate' });
  }
}

channel?.addEventListener('message', (event) => applyState(event.data));
window.addEventListener('storage', (event) => {
  if (event.key !== STORAGE_KEY || !event.newValue) return;
  try { applyState(JSON.parse(event.newValue)); } catch { /* ignore */ }
});
window.addEventListener('focus', () => applyState(readState()));
applyState(state);
