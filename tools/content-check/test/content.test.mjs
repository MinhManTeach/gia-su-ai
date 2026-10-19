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
  boundary.questions[0].prompt = 'Tính 83 + 17.';
  boundary.questions[0].operands = [83, 17];
  boundary.questions[0].answer = 100;
  boundary.questions[0].equivalentGroup = 'two-digit-carry-g';
  // Q01 và Q02 cùng nhóm, nên đổi cả Q02 sang một phép cộng tổng 100 khác
  boundary.questions[1].prompt = 'Tính 72 + 28.';
  boundary.questions[1].operands = [72, 28];
  boundary.questions[1].answer = 100;
  boundary.questions[1].equivalentGroup = 'two-digit-carry-g';
  assert.deepEqual(validateLesson(boundary), []);
});

test('reports an incorrect answer', () => {
  const invalid = structuredClone(lesson);
  invalid.questions[0].answer = 0;
  assert.ok(validateLesson(invalid).some((error) => error.includes('Q01') && error.includes('answer')));
});

test('reports a question that does not require carrying', () => {
  const invalid = structuredClone(lesson);
  invalid.questions[0].prompt = 'Tính 41 + 25.';
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

test('reports different difficulty for otherwise valid Q11 and Q12 when grouped as equivalent', () => {
  const invalid = structuredClone(lesson);
  invalid.questions[11].equivalentGroup = invalid.questions[10].equivalentGroup;
  assert.ok(validateLesson(invalid).some((error) => error.includes('Q12') && error.includes('equivalent') && error.includes('difficulty')));
});

test('reports missing hint levels', () => {
  const invalid = structuredClone(lesson);
  delete invalid.questions[0].hints.workedExample;
  assert.ok(validateLesson(invalid).some((error) => error.includes('Q01') && error.includes('hints')));
});

test('reports a worked example whose total reveals the question answer', () => {
  const invalid = structuredClone(lesson);
  invalid.questions[6].hints.workedExample = 'Ví dụ 57 + 26: 7 + 6 = 13, được 83.';
  assert.ok(validateLesson(invalid).some((error) => error.includes('Q07') && error.includes('workedExample') && error.includes('answer')));
});

test('reports a worked example that repeats the question operands in reverse order', () => {
  const invalid = structuredClone(lesson);
  invalid.questions[9].hints.workedExample = 'Ví dụ 58 + 29: 8 + 9 = 17, được 87.';
  assert.ok(validateLesson(invalid).some((error) => error.includes('Q10') && error.includes('workedExample') && error.includes('operand pair')));
});

test('reports a prompt that shows different numbers from the operands', () => {
  const invalid = structuredClone(lesson);
  invalid.questions[0].prompt = 'Tính 99 + 99.';
  assert.ok(validateLesson(invalid).some((error) => error.includes('Q01') && error.includes('prompt')));
});

test('reports a worked example whose own result is wrong', () => {
  const invalid = structuredClone(lesson);
  invalid.questions[1].hints.workedExample = 'Ví dụ 45 + 17: 5 + 7 = 12, viết 2 nhớ 1; 4 + 1 + 1 = 6, được 99.';
  assert.ok(validateLesson(invalid).some((error) => error.includes('Q02') && error.includes('workedExample result')));
});

test('reports a worked example that does not require carrying', () => {
  const invalid = structuredClone(lesson);
  invalid.questions[0].hints.workedExample = 'Ví dụ 34 + 25: 4 + 5 = 9; 3 + 2 = 5, được 59.';
  assert.ok(validateLesson(invalid).some((error) => error.includes('Q01') && error.includes('carrying')));
});

test('reports any hint level that states the answer', () => {
  const invalid = structuredClone(lesson);
  invalid.questions[0].hints.nextStep = 'Đáp án là 45.';
  assert.ok(validateLesson(invalid).some((error) => error.includes('Q01') && error.includes('nextStep') && error.includes('answer')));
});

test('reports an equivalent group with only one question', () => {
  const invalid = structuredClone(lesson);
  invalid.questions[13].equivalentGroup = 'lonely-group';
  assert.ok(validateLesson(invalid).some((error) => error.includes('Q14') && error.includes('at least 2')));
});

test('accepts an approved lesson with sources and rejects one without', () => {
  const approved = structuredClone(lesson);
  approved.approvalStatus = 'đã duyệt';
  approved.referenceSources = { items: [{ title: 'Toán 2, Kết nối tri thức', locator: 'Tập 1, bài mẫu' }], note: 'Đã đối chiếu' };
  assert.deepEqual(validateLesson(approved), []);
  approved.referenceSources.items = [];
  assert.ok(validateLesson(approved).some((error) => error.includes('reference source')));
});
