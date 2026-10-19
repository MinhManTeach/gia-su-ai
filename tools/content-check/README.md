# Content checker

Run the automated tests from the repository root with:

```sh
node --test tools/content-check/test/content.test.mjs
```

Validate the draft lesson directly with:

```sh
node tools/content-check/check.mjs content/toan/lop-2/cong-co-nho-100.v1.json
```

The checker uses only Node.js built-ins. It reports:

- an incorrect sum, an addition without a carry, or a sum above 100;
- a `prompt` whose addition differs from `operands`;
- mismatched difficulty within an `equivalentGroup` (operand digits, carry count, and result digits), or a group with only one question;
- missing hint levels, or any hint level that states the question's answer;
- a worked example that repeats the question operands, reveals its answer, does not carry, or ends with a wrong result (`được N`);
- invalid lesson metadata: a draft (`nháp`) must keep the note `chưa duyệt`; an approved lesson (`đã duyệt`) must list at least one reference source.

The JSON schema documents the same contract but is not executed by the checker, so keep both in step when the format changes. No AI model or network service is called.
