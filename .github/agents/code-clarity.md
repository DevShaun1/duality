# Commenting and JSDoc Agent Guidelines

Use these instructions when reviewing or adding documentation and comments in the Duality codebase.

## Objective

Improve code clarity without creating documentation noise.

Comments and JSDoc should help a developer understand:

- The responsibility of a module, hook, function, or component.
- Why non-obvious behaviour exists.
- Important edge cases, constraints, and browser quirks.
- Boundaries between different parts of the system.
- Side effects that are not clear from the function name or TypeScript types.

Do not add comments that simply restate the code.

## Core Principle

> Code should explain what happens. Comments should explain why it happens.

Prefer:

```ts
// Mobile browsers may end recognition after a pause without emitting a final
// result. Commit the pending transcript before restarting the next session.
```

Avoid:

```ts
// Commit the transcript.
```

## When to Add JSDoc

Add JSDoc when a component, hook, or function is:

- Exported and reused.
- Responsible for a meaningful workflow.
- Non-obvious from its name and TypeScript signature.
- Handling complex state or lifecycle behaviour.
- Performing side effects.
- Enforcing business or safety rules.
- Coordinating multiple modules.
- Working around platform or browser limitations.

JSDoc should describe the contract and responsibilities, not every implementation detail.

### Preferred Structure

```ts
/**
 * Brief description of the module's primary responsibility.
 *
 * Responsibilities:
 * - Describe stable responsibility one.
 * - Describe stable responsibility two.
 * - Describe important fallback or edge-case behaviour.
 *
 * Clarify ownership boundaries with related modules where useful.
 *
 * @param options Explain non-obvious parameters when TypeScript alone is insufficient.
 * @returns Explain the returned contract when it is not obvious.
 */
```

## When JSDoc Is Usually Unnecessary

Do not add JSDoc to:

- Small event handlers.
- Simple presentational components.
- Thin wrappers.
- Obvious getters or setters.
- Straightforward data transformations.
- Functions whose name, types, and implementation already explain their behaviour.

Avoid:

```ts
/**
 * Handles cancelling.
 */
function handleCancel() {
  navigate('/reflections');
}
```

## Component JSDoc

Component documentation should focus on:

- What the component owns.
- What state is controlled by the parent.
- What related hook or service owns.
- Important fallback behaviour.
- Significant side effects or lifecycle behaviour.

Avoid documenting volatile UI details such as exact button labels unless they are part of a stable product requirement.

## Hook JSDoc

Hook documentation should clarify:

- The lifecycle or state it manages.
- Side effects it performs.
- External APIs or browser capabilities it wraps.
- What it deliberately does not own.
- Any important retry, deduplication, or interruption behaviour.

## Inline Comment Rules

Add inline comments where code contains:

- Browser-specific workarounds.
- Mobile-specific behaviour.
- Timing constants and debounce logic.
- Race-condition prevention.
- Deduplication guards.
- Idempotency protections.
- Automatic retries or restarts.
- Intentional deviations from the obvious implementation.
- Safety or urgent-concern handling.
- Logic that could appear unnecessary without context.

Keep comments close to the code they explain.

## Comments for Refs and Guards

When a ref or flag prevents duplicate work, explain the failure it avoids.

Prefer:

```ts
// Prevent repeated renders during the same stopped session from appending
// the pending transcript more than once.
hasCommittedUnexpectedStopRef.current = true;
```

Avoid:

```ts
// Set committed to true.
hasCommittedUnexpectedStopRef.current = true;
```

## Timing Constants

Document timing values when the number is based on browser behaviour or a deliberate trade-off.

Example:

```ts
// Allows transient visibility events triggered by microphone activation to
// settle before treating page hiding as a real system interruption.
const START_GRACE_PERIOD_MS = 1500;
```

Do not comment obvious constants where the name is already sufficient.

## TypeScript and `@returns`

Do not add `@returns {JSX.Element}` to ordinary React components. TypeScript already infers the return type, and the annotation adds little value.

Use `@returns` only when the returned contract, fallback behaviour, or side effects are not obvious.

Prefer:

```ts
/**
 * @returns Speech-recognition state, capability flags, feedback, and controls.
 */
```

Avoid:

```ts
/**
 * @returns {JSX.Element} The rendered component.
 */
```

## Documentation Quality Checklist

Before keeping a comment or JSDoc block, ask:

1. Does it explain something the code or types do not?
2. Does it describe why the behaviour exists?
3. Is it likely to remain accurate after minor UI changes?
4. Does it clarify an edge case, responsibility, or boundary?
5. Would removing it make the code harder to maintain?

If the answer to all five is no, remove it.

## Review Process

When reviewing a file:

1. Identify exported components, hooks, and complex functions.
2. Add or update JSDoc only where it improves the contract.
3. Identify browser quirks, race conditions, retries, guards, and side effects.
4. Add concise inline comments explaining why those sections exist.
5. Remove comments that merely narrate the code.
6. Check that terminology is consistent across the file.
7. Ensure comments still match the current implementation.
8. Do not modify behaviour unless explicitly requested.

## Duality-Specific Priorities

Prioritise comments and documentation around:

- Speech recognition lifecycle behaviour.
- Mobile browser differences.
- Interim and final transcript handling.
- Transcript deduplication.
- System interruptions and auto-restart logic.
- AI prompt and response boundaries.
- Safety and urgent-concern detection.
- Supabase data ownership and RLS assumptions.
- Reflection and insight generation workflows.
- Account deletion and audit-log behaviour.

## Tone

Use clear, concise South African English.

Avoid:

- Overly formal language.
- Repeating implementation details.
- Speculative claims.
- Psychological or diagnostic wording.
- Comments that sound certain when the behaviour is browser-dependent.

Prefer wording such as:

- `Some mobile browsers may...`
- `This guard prevents...`
- `The delay allows...`
- `This remains separate so...`
- `The parent owns...`
- `The controller owns...`
