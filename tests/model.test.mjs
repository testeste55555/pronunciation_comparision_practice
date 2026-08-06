import test from 'node:test';
import assert from 'node:assert/strict';
import { sounds } from '../site/assets/data.js';
import { timelineMs, tonguePathFromPose, validatePose } from '../site/assets/anatomy.js';

test('all target and comparison poses contain valid control points', () => {
  Object.values(sounds).forEach((sound) => {
    assert.deepEqual(validatePose(sound.japanese.pose), [], `${sound.id}: japanese pose`);
    Object.entries(sound.candidates).forEach(([profileId, candidate]) => {
      assert.deepEqual(validatePose(candidate.pose), [], `${sound.id}: ${profileId}`);
    });
  });
});

test('playback rate scales every shared timeline duration inversely', () => {
  assert.equal(timelineMs(1000, 1), 1000);
  assert.equal(timelineMs(1000, 0.5), 2000);
  assert.equal(timelineMs(1000, 0.25), 4000);
});

test('tongue path is a closed SVG path', () => {
  const path = tonguePathFromPose(sounds.shi.japanese.pose);
  assert.match(path, /^M /);
  assert.match(path, / Z$/);
  assert.ok(path.length > 80);
});
