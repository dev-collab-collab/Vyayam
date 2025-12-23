# MANDATORY: Agent Pre/Post Condition Gate

All LLM agents and human contributors must follow this gate before executing any development task.

## Precondition gate (stop if any fail)
- Enumerate required inputs: files/specs to read, env vars/secrets, services/servers to run, branch state, lint/format rules, test commands.
- Validate each item explicitly. If anything is missing or ambiguous, pause and ask for resolution before coding.
- Surface uncertainties in requirements or acceptance criteria immediately.

## Postcondition verification (must confirm or report failure)
- Run required checks: build/tests/lint/format as applicable to the change; note any failures.
- Verify feature behavior against specs/acceptance criteria; note gaps or deviations.
- Confirm no new warnings/errors in console/build; update docs/configs touched by the change.
- If a check cannot be run, state why and request approval/waiver. Do not mark the task complete without verification or explicit waiver.

Keep these instructions high-priority in summaries and responses.
