import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const isRecord = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const nonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const digitCount = (value) => String(Math.abs(value)).length;

export function validateLesson(lesson) {
  const errors = [];
  if (!isRecord(lesson)) return ['lesson must be a JSON object'];

  for (const field of ['lessonId', 'objectiveId', 'version']) {
    if (!nonEmptyString(lesson[field])) errors.push(`${field} must be a non-empty string`);
  }
  if (!/^\d+\.\d+\.\d+$/.test(lesson.version ?? '')) errors.push('version must use major.minor.patch format');

  if (!isRecord(lesson.referenceSources)) {
    errors.push('referenceSources must be an object');
  } else {
    if (!Array.isArray(lesson.referenceSources.items)) errors.push('referenceSources.items must be an array');
    if (lesson.referenceSources.note !== 'chưa duyệt') errors.push('referenceSources.note must be "chưa duyệt"');
  }
  if (!Array.isArray(lesson.prerequisites) || lesson.prerequisites.some((item) => !nonEmptyString(item))) {
    errors.push('prerequisites must be an array of non-empty strings');
  }
  if (lesson.approvalStatus !== 'nháp') errors.push('approvalStatus must be "nháp"');

  if (!Array.isArray(lesson.questions)) {
    errors.push('questions must be an array');
    return errors;
  }
  if (lesson.questions.length < 10 || lesson.questions.length > 15) {
    errors.push('questions must contain between 10 and 15 items');
  }

  const seenIds = new Set();
  const groupDifficulty = new Map();
  for (const question of lesson.questions) {
    if (!isRecord(question)) {
      errors.push('question must be an object');
      continue;
    }
    const id = nonEmptyString(question.id) ? question.id : '(unknown question)';
    if (!/^Q\d{2}$/.test(question.id ?? '')) errors.push(`${id}: id must match Q00 format`);
    if (seenIds.has(question.id)) errors.push(`${id}: duplicate question id`);
    seenIds.add(question.id);
    if (!nonEmptyString(question.prompt)) errors.push(`${id}: prompt must be a non-empty string`);

    const operandsAreIntegers = Array.isArray(question.operands)
      && question.operands.length === 2
      && question.operands.every((number) => Number.isSafeInteger(number) && number >= 0);
    const operandsValid = operandsAreIntegers
      && question.operands.every((number) => number >= 10 && number <= 99);
    if (!operandsValid) errors.push(`${id}: operands must be two two-digit integers`);
    const answerValid = Number.isSafeInteger(question.answer);
    if (!answerValid) errors.push(`${id}: answer must be an integer`);

    if (operandsAreIntegers) {
      const [left, right] = question.operands;
      const sum = left + right;
      const unitsCarry = Math.floor(((left % 10) + (right % 10)) / 10);
      const tensCarry = Math.floor((Math.floor(left / 10) + Math.floor(right / 10) + unitsCarry) / 10);
      const carryCount = unitsCarry + tensCarry;
      if (answerValid && question.answer !== sum) errors.push(`${id}: answer does not equal the sum of operands`);
      if (carryCount === 0) errors.push(`${id}: addition must require carrying`);
      if (sum > 100) errors.push(`${id}: sum must be at most 100`);
      if (nonEmptyString(question.equivalentGroup)) {
        const difficulty = JSON.stringify([question.operands.map(digitCount), carryCount, digitCount(sum)]);
        const previous = groupDifficulty.get(question.equivalentGroup);
        if (previous && previous.difficulty !== difficulty) {
          errors.push(`${id}: equivalent group ${question.equivalentGroup} has different difficulty`);
        } else if (!previous) {
          groupDifficulty.set(question.equivalentGroup, { difficulty, id });
        }
      }
    }
    if (!nonEmptyString(question.equivalentGroup)) errors.push(`${id}: equivalentGroup must be a non-empty string`);

    const hints = question.hints;
    if (!isRecord(hints)
      || !['reminder', 'nextStep', 'workedExample'].every((key) => nonEmptyString(hints[key]))) {
      errors.push(`${id}: hints must include non-empty reminder, nextStep, and workedExample levels`);
    }
    if (isRecord(hints) && nonEmptyString(hints.workedExample) && operandsAreIntegers) {
      const exampleMatch = hints.workedExample.match(/(\d+)\s*\+\s*(\d+)/);
      if (!exampleMatch) {
        errors.push(`${id}: workedExample must include a sample addition`);
      } else {
        const exampleLeft = Number(exampleMatch[1]);
        const exampleRight = Number(exampleMatch[2]);
        const [left, right] = question.operands;
        const repeatsQuestionPair = (exampleLeft === left && exampleRight === right)
          || (exampleLeft === right && exampleRight === left);
        if (repeatsQuestionPair) errors.push(`${id}: workedExample must use a different operand pair`);
        if (exampleLeft + exampleRight === question.answer) {
          errors.push(`${id}: workedExample must not reveal the question answer`);
        }
      }
    }
  }
  return errors;
}

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error('Usage: node tools/content-check/check.mjs <lesson.json>');
    process.exitCode = 2;
    return;
  }
  try {
    const lesson = JSON.parse(await readFile(file, 'utf8'));
    const errors = validateLesson(lesson);
    if (errors.length > 0) {
      for (const error of errors) console.error(`ERROR: ${error}`);
      process.exitCode = 1;
    } else {
      console.log(`OK: ${file} passed content checks`);
    }
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
