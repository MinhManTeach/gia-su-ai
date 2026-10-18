# Content checker

Run the automated tests from the repository root with:

```sh
node --test tools/content-check/test/content.test.mjs
```

Validate the draft lesson directly with:

```sh
node tools/content-check/check.mjs content/toan/lop-2/cong-co-nho-100.v1.json
```

The checker uses only Node.js built-ins. It reports an incorrect sum, an addition without a carry, mismatched difficulty within an `equivalentGroup` (operand digits, carry count, and result digits), a worked example that repeats the question operands or reveals its answer, missing hint levels, and invalid lesson metadata. No AI model or network service is called.
