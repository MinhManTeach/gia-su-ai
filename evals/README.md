# Tutor response evaluations

This folder contains 25 deterministic, Vietnamese tutor-session scenarios grounded in sections 6 and 12 of `docs/dac-ta-ban-giao.md`. Each scenario includes session context, a learner turn, explicit allow/deny scoring checks, a canned response from a fake tutor, and at least one deliberately bad response that the rubric must reject. The scenarios cover unclear audio, unavailable microphone/network/lesson, conflicting content, repeated errors, answer requests, breaks, session limits, off-topic turns (including requests for internal rules), correctness after hints, and independent checks.

## Run locally

```sh
node --test evals/test/evaluate.test.mjs
node evals/run.mjs
node evals/run.mjs --format json
```

The default evaluator is entirely offline. It does not call an API or send data anywhere. The text checks keep Vietnamese accents and match whole phrases only, so "gốc" never counts as "gõ" and "chưa dùng" never counts as "chưa đúng". Forbidden answers from 0 to 100 are recognized as digits, as Vietnamese words including short spoken forms ("bốn hai", "ba tư", "hai lăm"), and as tens and units ("4 chục 2 đơn vị"). Every scenario also fails if the response labels the learner ("lười", "dốt", "chậm hiểu"...). Some scenarios carry `goodResponses`, paraphrased answers that must pass, so the rubric is not tuned only to the fake tutor's wording. A pass rate is a deterministic rubric smoke check, not a semantic proof that a tutor response is safe or pedagogically sound; review real model output before relying on it.

## Connect a tutor model later

An optional local adapter module can export `async function respond(scenario)`, where the input contains only `id`, `category`, `context`, and `learnerTurn`, and the function returns a response string:

```js
export async function respond(scenario) {
  // Call an explicitly configured model client here if desired.
  return '...';
}
```

Run it with `node evals/run.mjs --adapter ./path/to/adapter.mjs`. If the adapter throws, returns something other than a string, or takes longer than 30 seconds, only that scenario fails and the run continues. No model SDK, credentials, network dependency, or API is included in this evaluation package. Keep any future adapter opt-in and locally configured.
