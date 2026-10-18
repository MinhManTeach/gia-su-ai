const normalize = (value) => String(value)
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[đĐ]/g, 'd')
  .toLocaleLowerCase('vi');

const includesAny = (text, fragments) => fragments.some((fragment) => text.includes(normalize(fragment)));

export function evaluateResponse(scenario, response) {
  const normalized = normalize(response);
  const checks = scenario.criteria.map((criterion) => {
    const missing = criterion.mustContainAny?.length && !includesAny(normalized, criterion.mustContainAny);
    const forbidden = criterion.mustNotContainAny?.length && includesAny(normalized, criterion.mustNotContainAny);
    return {
      id: criterion.id,
      description: criterion.description,
      passed: !missing && !forbidden,
      ...(missing ? { reason: `Expected one of: ${criterion.mustContainAny.join(', ')}` } : {}),
      ...(forbidden ? { reason: `Found forbidden phrase: ${criterion.mustNotContainAny.join(', ')}` } : {}),
    };
  });

  for (const number of scenario.forbiddenNumbers ?? []) {
    const leaked = new RegExp(`(^|\\D)${number.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}(?=\\D|$)`).test(String(response));
    checks.push({ id: 'no_answer_leak', description: `Do not reveal forbidden answer ${number}.`, passed: !leaked, ...(!leaked ? {} : { reason: `Revealed forbidden answer ${number}` }) });
  }

  return { id: scenario.id, category: scenario.category, response, passed: checks.every((check) => check.passed), checks };
}

export async function runEvaluations(scenarios, respond = null) {
  const results = [];
  for (const scenario of scenarios) {
    const publicInput = { id: scenario.id, category: scenario.category, context: scenario.context, learnerTurn: scenario.learnerTurn };
    const response = respond ? await respond(publicInput) : scenario.simulatorResponse;
    results.push(evaluateResponse(scenario, response));
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
