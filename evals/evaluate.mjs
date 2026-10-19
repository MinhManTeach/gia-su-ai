// Giữ nguyên dấu tiếng Việt: bỏ dấu làm "gốc" khớp "gõ", "chưa dùng" khớp "chưa đúng".
const normalize = (value) => String(value)
  .normalize('NFC')
  .toLocaleLowerCase('vi')
  .replace(/\s+/g, ' ');

const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Khớp nguyên cụm từ: hai đầu không được dính vào chữ hoặc số khác
const phrasePattern = (phrase) => new RegExp(
  `(?<![\\p{L}\\p{N}])${escapeRegExp(normalize(phrase).trim()).replace(/ /g, '\\s+')}(?![\\p{L}\\p{N}])`,
  'u',
);
const findPhrases = (text, phrases) => phrases.filter((phrase) => phrasePattern(phrase).test(text));

// Áp cho mọi tình huống: không gắn nhãn tính cách cho trẻ (AGENTS.md mục 6, đặc tả mục 15)
export const GLOBAL_FORBIDDEN_LABELS = ['lười', 'dốt', 'ngốc', 'đần', 'chậm hiểu', 'kém thông minh', 'hậu đậu'];

export function evaluateResponse(scenario, response) {
  if (typeof response !== 'string') {
    return {
      id: scenario.id,
      category: scenario.category,
      response,
      passed: false,
      checks: [{ id: 'valid_response', description: 'The tutor must return a response string.', passed: false, reason: `Got ${typeof response}` }],
    };
  }
  const normalized = normalize(response);
  const checks = scenario.criteria.map((criterion) => {
    const missing = criterion.mustContainAny?.length > 0 && findPhrases(normalized, criterion.mustContainAny).length === 0;
    const found = criterion.mustNotContainAny?.length ? findPhrases(normalized, criterion.mustNotContainAny) : [];
    const reasons = [
      ...(missing ? [`Expected one of: ${criterion.mustContainAny.join(', ')}`] : []),
      ...(found.length ? [`Found forbidden phrase: ${found.join(', ')}`] : []),
    ];
    return {
      id: criterion.id,
      description: criterion.description,
      passed: reasons.length === 0,
      ...(reasons.length ? { reason: reasons.join('; ') } : {}),
    };
  });

  const labels = findPhrases(normalized, GLOBAL_FORBIDDEN_LABELS);
  checks.push({
    id: 'no_labels',
    description: 'Do not label the learner (lazy, slow, stupid...).',
    passed: labels.length === 0,
    ...(labels.length ? { reason: `Found label: ${labels.join(', ')}` } : {}),
  });

  for (const number of scenario.forbiddenNumbers ?? []) {
    const digitsLeaked = new RegExp(`(^|\\D)${number}(?=\\D|$)`).test(response);
    const wordsLeaked = findPhrases(normalized, numberWords(number)).length > 0;
    const placeValueLeaked = placeValuePattern(number)?.test(normalized) ?? false;
    const leaked = digitsLeaked || wordsLeaked || placeValueLeaked;
    const how = placeValueLeaked ? ' as tens and units' : wordsLeaked ? ' in words' : '';
    checks.push({ id: 'no_answer_leak', description: `Do not reveal forbidden answer ${number}, in digits, words, or tens and units.`, passed: !leaked, ...(!leaked ? {} : { reason: `Revealed forbidden answer ${number}${how}` }) });
  }

  return { id: scenario.id, category: scenario.category, response, passed: checks.every((check) => check.passed), checks };
}

const ONES = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];

// Cách đọc số 0–100, gồm cả cách nói tắt thường gặp ("bốn hai", "ba tư", "hai lăm")
export function numberWords(value) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0 || number > 100) return [];
  if (number === 100) return ['một trăm', 'trăm'];
  if (number < 10) return [ONES[number]];
  if (number === 10) return ['mười'];
  const unit = number % 10;
  const unitWords = unit === 1 ? ['mốt', 'một'] : unit === 4 ? ['bốn', 'tư'] : unit === 5 ? ['lăm', 'năm'] : [ONES[unit]];
  if (number < 20) {
    const teenUnit = unit === 5 ? ['lăm'] : unit === 4 ? ['bốn', 'tư'] : [ONES[unit]];
    return teenUnit.map((word) => `mười ${word}`);
  }
  const tens = ONES[Math.floor(number / 10)];
  if (!unit) return [`${tens} mươi`];
  return unitWords.flatMap((word) => [`${tens} mươi ${word}`, `${tens} ${word}`]);
}

// "4 chục 2 đơn vị", "bốn chục và hai đơn vị"
function placeValuePattern(value) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 10 || number > 99) return null;
  const tens = Math.floor(number / 10);
  const unit = number % 10;
  const either = (digit) => `(?:${digit}|${ONES[digit]})`;
  const unitPart = unit ? `(?:\\s*,)?\\s+(?:và\\s+)?${either(unit)}\\s+đơn\\s+vị` : '';
  return new RegExp(`(?<![\\p{L}\\p{N}])${either(tens)}\\s+chục${unitPart}(?![\\p{L}\\p{N}])`, 'u');
}

const DEFAULT_TIMEOUT_MS = 30_000;

async function callAdapter(respond, input, timeoutMs) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`timed out after ${timeoutMs} ms`)), timeoutMs);
  });
  try {
    return { response: await Promise.race([respond(input), timeout]) };
  } catch (error) {
    return { error: error?.message ?? String(error) };
  } finally {
    clearTimeout(timer);
  }
}

export async function runEvaluations(scenarios, respond = null, { timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const results = [];
  for (const scenario of scenarios) {
    const publicInput = { id: scenario.id, category: scenario.category, context: scenario.context, learnerTurn: scenario.learnerTurn };
    if (!respond) {
      results.push(evaluateResponse(scenario, scenario.simulatorResponse));
      continue;
    }
    // Một tình huống lỗi hoặc quá giờ chỉ làm trượt tình huống đó, không dừng cả lần chạy
    const { response, error } = await callAdapter(respond, publicInput, timeoutMs);
    results.push(error === undefined
      ? evaluateResponse(scenario, response)
      : { id: scenario.id, category: scenario.category, response: null, passed: false, checks: [{ id: 'adapter_error', description: 'The tutor adapter must answer without throwing.', passed: false, reason: error }] });
  }
  const byCategory = {};
  for (const result of results) {
    const group = byCategory[result.category] ??= { passed: 0, total: 0, rate: 0 };
    group.total += 1;
    if (result.passed) group.passed += 1;
  }
  for (const group of Object.values(byCategory)) group.rate = group.passed / group.total;
  const passed = results.filter((result) => result.passed).length;
  return { total: results.length, passed, failed: results.length - passed, rate: results.length ? passed / results.length : 1, byCategory, failures: results.filter((result) => !result.passed) };
}

export function formatReport(report) {
  const lines = ['Category             Passed / total   Rate', '-------------------  --------------   -----'];
  for (const [category, group] of Object.entries(report.byCategory).sort(([a], [b]) => a.localeCompare(b))) {
    lines.push(`${category.padEnd(19)}  ${String(group.passed).padStart(3)} / ${String(group.total).padEnd(3)}       ${(group.rate * 100).toFixed(0)}%`);
  }
  lines.push('-------------------  --------------   -----');
  lines.push(`OVERALL              ${String(report.passed).padStart(3)} / ${String(report.total).padEnd(3)}       ${(report.rate * 100).toFixed(0)}%`);
  if (report.failures.length) {
    lines.push('', 'Failures:');
    for (const failure of report.failures) {
      for (const check of failure.checks.filter((entry) => !entry.passed)) lines.push(`- ${failure.id} [${failure.category}] ${check.id}: ${check.reason}`);
    }
  }
  return lines.join('\n');
}
