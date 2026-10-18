import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { validateLesson } from '../check.mjs';

const dataPath = fileURLToPath(new URL('../../../content/toan/lop-2/cong-co-nho-100.v1.json', import.meta.url));
const schemaPath = fileURLToPath(new URL('../../../content/schema/lesson.schema.json', import.meta.url));
const lesson = JSON.parse(await readFile(dataPath, 'utf8'));

test('schema describes the content contract and the sample passes all checks', async () => {
  const schema = JSON.parse(await readFile(schemaPath, 'utf8'));
  assert.equal(schema.$schema, 'https://json-schema.org/draft/2020-12/schema');
  assert.deepEqual(schema.required, ['lessonId', 'objectiveId', 'version', 'referenceSources', 'prerequisites', 'questions', 'approvalStatus']);
  assert.equal(schema.properties.questions.minItems, 10);
  assert.equal(schema.properties.questions.maxItems, 15);
  assert.equal(schema.properties.questions.items.properties.answer.maximum, 100);
  assert.deepEqual(schema.properties.questions.items.properties.hints.required, ['reminder', 'nextStep', 'workedExample']);
  assert.deepEqual(validateLesson(lesson), []);
});

test('accepts a carrying sum of exactly 100', () => {
  const boundary = structuredClone(lesson);
  boundary.questions[0].operands = [83, 17];
  boundary.questions[0].answer = 100;
  assert.deepEqual(validateLesson(boundary), []);
});

test('reports an incorrect answer', () => {
  const invalid = structuredClone(lesson);
  invalid.questions[0].answer = 0;
  assert.ok(validateLesson(invalid).some((error) => error.includes('Q01') && error.includes('answer')));
});

test('reports a question that does not require carrying', () => {
  const invalid = structuredClone(lesson);
  invalid.questions[0].operands = [41, 25];
  invalid.questions[0].answer = 66;
  assert.ok(validateLesson(invalid).some((error) => error.includes('Q01') && error.includes('carry')));
});

test('reports equivalent questions with different operand digit counts', () => {
  const invalid = structuredClone(lesson);
  invalid.questions[0].operands = [9, 86];
  invalid.questions[0].answer = 95;
  assert.ok(validateLesson(invalid).some((error) => error.includes('equivalent') && error.includes('difficulty')));
});

test('reports equivalent questions with different difficulty', () => {
  const invalid = structuredClone(lesson);
  invalid.questions[0].operands = [41, 25];
  invalid.questions[0].answer = 66;
  assert.ok(validateLesson(invalid).some((error) => error.includes('equivalent') && error.includes('difficulty')));
});

test('reports missing hint levels', () => {
  const invalid = structuredClone(lesson);
  delete invalid.questions[0].hints.workedExample;
  assert.ok(validateLesson(invalid).some((error) => error.includes('Q01') && error.includes('hints')));
});
