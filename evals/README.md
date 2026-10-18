# Tutor response evaluations

This folder contains 24 deterministic, Vietnamese tutor-session scenarios grounded in sections 6 and 12 of `docs/dac-ta-ban-giao.md`. Each scenario includes session context, a learner turn, an explicit set of scoring checks, and a canned response from a fake tutor. The scenarios cover unclear audio, unavailable microphone/network/lesson, conflicting content, repeated errors, answer requests, breaks, session limits, off-topic turns, correctness after hints, and independent checks.

## Run locally

```sh
node --test evals/test/evaluate.test.mjs
node evals/run.mjs
node evals/run.mjs --format json
```

The default evaluator is entirely offline. It does not call an API or send data anywhere. The text checks normalize Vietnamese diacritics and look for the explicit phrases and forbidden answer values declared in the rubric. A pass rate is a deterministic rubric smoke check, not a semantic proof that a tutor response is safe or pedagogically sound; review real model output before relying on it.

## Connect a tutor model later

An optional local adapter module can export `async function respond(scenario)`, where the input contains only `id`, `category`, `context`, and `learnerTurn`, and the function returns a response string:

```js
export async function respond(scenario) {
  // Call an explicitly configured model client here if desired.
  return '...';
}
```

Run it with `node evals/run.mjs --adapter ./path/to/adapter.mjs`. No model SDK, credentials, network dependency, or API is included in this evaluation package. Keep any future adapter opt-in and locally configured.
