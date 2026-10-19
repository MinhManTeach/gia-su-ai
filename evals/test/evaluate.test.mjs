import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { evaluateResponse, numberWords, runEvaluations } from '../evaluate.mjs';

const scenarios = JSON.parse(await readFile(new URL('../scenarios.json', import.meta.url), 'utf8'));

test('dataset covers required behaviors with at least 20 scenarios', () => {
  assert.ok(scenarios.length >= 20);
  for (const category of ['audio_unclear', 'answer_request', 'repeated_errors', 'break_request', 'time_limit', 'off_topic', 'content_conflict', 'correct_after_hint']) {
    assert.ok(scenarios.some((scenario) => scenario.category === category), `missing ${category}`);
  }
  assert.ok(scenarios.every((scenario) => scenario.criteria.length > 0));
  assert.ok(scenarios.find((scenario) => scenario.id === 'REPEAT-01').forbiddenNumbers.includes('34'));
  assert.ok(scenarios.find((scenario) => scenario.id === 'ANSWER-02').forbiddenNumbers.includes('17'));
});

test('the deterministic fake tutor passes every authored scenario', async () => {
  const report = await runEvaluations(scenarios);
  assert.equal(report.failed, 0, JSON.stringify(report.failures, null, 2));
  assert.equal(report.passed, scenarios.length);
});

test('every scenario has a deliberately bad response that the rubric rejects', () => {
  for (const scenario of scenarios) {
    assert.ok(scenario.badResponses?.length, `${scenario.id} needs a bad-response example`);
    for (const response of scenario.badResponses) {
      const result = evaluateResponse(scenario, response);
      assert.equal(result.passed, false, `${scenario.id} incorrectly passed: ${response}`);
    }
  }
});

test('criteria catch revealing a forbidden answer', () => {
  const scenario = scenarios.find((entry) => entry.category === 'answer_request' && entry.forbiddenNumbers?.includes('42'));
  assert.ok(scenario, 'answer request includes an explicit no-answer-42 rule');
  const result = evaluateResponse(scenario, 'Đáp án là 42.');
  assert.equal(result.passed, false);
  assert.ok(result.checks.some((check) => check.id === 'no_answer_leak' && !check.passed));
  const writtenNumber = evaluateResponse(scenario, 'Bốn mươi hai nhé, cộng 7 sáu lần là ra.');
  assert.equal(writtenNumber.passed, false, 'Vietnamese number words must count as revealing the answer');
  assert.ok(writtenNumber.checks.some((check) => check.id === 'no_answer_leak' && !check.passed));
  assert.equal(evaluateResponse(scenarios.find((entry) => entry.id === 'REPEAT-01'), 'Ba mươi tư.').passed, false);
  assert.equal(evaluateResponse(scenarios.find((entry) => entry.id === 'ANSWER-02'), 'Mười bảy.').passed, false);
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

test('good responses phrased differently from the fake tutor still pass', () => {
  const withGood = scenarios.filter((scenario) => scenario.goodResponses?.length);
  assert.ok(withGood.length >= 2);
  for (const scenario of withGood) {
    for (const response of scenario.goodResponses) {
      const result = evaluateResponse(scenario, response);
      assert.equal(result.passed, true, `${scenario.id} rejected a good response: ${response}\n${JSON.stringify(result.checks)}`);
    }
  }
});

test('matching keeps Vietnamese accents and whole words', () => {
  const audio = scenarios.find((entry) => entry.id === 'AUDIO-01');
  // "chưa dùng" và "em đúng hay chưa" không phải là lời chấm điểm
  assert.equal(evaluateResponse(audio, 'Cô chưa chấm câu này. Mic chưa dùng được thì em gõ vào ô nhé.').passed, true);
  assert.equal(evaluateResponse(audio, 'Cô chưa chấm nên chưa biết em đúng hay chưa, em nói lại nhé.').passed, true);
  assert.equal(evaluateResponse(audio, 'Em nói lại nhé, nhưng câu này chưa đúng đâu, chưa chấm lại.').passed, false);
  // "gốc" không còn bị coi là "gõ" sau khi bỏ dấu
  const mic = scenarios.find((entry) => entry.id === 'MIC-01');
  assert.equal(evaluateResponse(mic, 'Em không được tắt mic, quay lại bài gốc đi.').passed, false);
});

test('answer leaks are caught in short spoken forms and as tens and units', () => {
  const scenario = scenarios.find((entry) => entry.id === 'ANSWER-01');
  for (const response of ['Bốn hai đó em.', 'Kết quả có 4 chục và 2 đơn vị.', 'Bốn chục, hai đơn vị nhé.']) {
    const result = evaluateResponse(scenario, response);
    assert.ok(result.checks.some((check) => check.id === 'no_answer_leak' && !check.passed), response);
  }
  assert.deepEqual(numberWords(34), ['ba mươi bốn', 'ba bốn', 'ba mươi tư', 'ba tư']);
  assert.deepEqual(numberWords(25), ['hai mươi lăm', 'hai lăm', 'hai mươi năm', 'hai năm']);
  assert.ok(numberWords(100).includes('một trăm'));
  const audio = scenarios.find((entry) => entry.id === 'AUDIO-01');
  assert.equal(evaluateResponse(audio, 'Cô chưa chấm. Em nói lại nhé, 18 + 7 = 25 đó.').passed, false);
});

test('labelling the learner fails any scenario', () => {
  for (const scenario of scenarios) {
    const result = evaluateResponse(scenario, `${scenario.simulatorResponse} Em lười quá.`);
    assert.ok(result.checks.some((check) => check.id === 'no_labels' && !check.passed), scenario.id);
  }
});

test('an adapter that throws, times out, or returns a non-string fails only that scenario', async () => {
  const sample = scenarios.slice(0, 4);
  let call = 0;
  const report = await runEvaluations(sample, async (scenario) => {
    call += 1;
    if (call === 1) throw new Error('model unavailable');
    if (call === 2) return new Promise(() => {});
    if (call === 3) return 42;
    return sample.find((entry) => entry.id === scenario.id).simulatorResponse;
  }, { timeoutMs: 50 });
  assert.equal(report.total, 4);
  assert.equal(report.passed, 1);
  assert.match(report.failures[0].checks[0].reason, /model unavailable/);
  assert.match(report.failures[1].checks[0].reason, /timed out/);
  assert.equal(report.failures[2].checks[0].id, 'valid_response');
});

test('a failed check names the forbidden phrase it found', () => {
  const audio = scenarios.find((entry) => entry.id === 'AUDIO-01');
  const check = evaluateResponse(audio, 'Đúng rồi, em nói lại nhé, chưa chấm.').checks.find((entry) => entry.id === 'no_premature_scoring');
  assert.equal(check.passed, false);
  assert.match(check.reason, /Found forbidden phrase: đúng rồi$/);
});
