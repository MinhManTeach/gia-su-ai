import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { evaluateResponse, runEvaluations } from '../evaluate.mjs';

const scenarios = JSON.parse(await readFile(new URL('../scenarios.json', import.meta.url), 'utf8'));

test('dataset covers required behaviors with at least 20 scenarios', () => {
  assert.ok(scenarios.length >= 20);
  for (const category of ['audio_unclear', 'answer_request', 'repeated_errors', 'break_request', 'time_limit', 'off_topic', 'content_conflict', 'correct_after_hint']) {
    assert.ok(scenarios.some((scenario) => scenario.category === category), `missing ${category}`);
  }
  assert.ok(scenarios.every((scenario) => scenario.criteria.length > 0));
});

test('the deterministic fake tutor passes every authored scenario', async () => {
  const report = await runEvaluations(scenarios);
  assert.equal(report.failed, 0, JSON.stringify(report.failures, null, 2));
  assert.equal(report.passed, scenarios.length);
});

test('criteria catch revealing a forbidden answer', () => {
  const scenario = scenarios.find((entry) => entry.category === 'answer_request' && entry.forbiddenNumbers?.includes('42'));
  assert.ok(scenario, 'answer request includes an explicit no-answer-42 rule');
  const result = evaluateResponse(scenario, 'Đáp án là 42.');
  assert.equal(result.passed, false);
  assert.ok(result.checks.some((check) => check.id === 'no_answer_leak' && !check.passed));
});

test('report groups pass rates by scenario type', async () => {
  const report = await runEvaluations(scenarios);
  assert.equal(report.byCategory.audio_unclear.total, 2);
  assert.equal(report.byCategory.audio_unclear.rate, 1);
  assert.equal(report.byCategory.correct_after_hint.total, 2);
});

test('adapter sees only the public scenario input, not scoring guidance or fake output', async () => {
  let received;
  await runEvaluations(scenarios.slice(0, 1), async (scenario) => {
    received = scenario;
    return scenarios[0].simulatorResponse;
  });
  assert.deepEqual(Object.keys(received).sort(), ['category', 'context', 'id', 'learnerTurn'].sort());
});
