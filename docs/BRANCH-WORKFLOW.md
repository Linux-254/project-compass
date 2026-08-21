# ReForge Branch Workflow

ReForge uses a promotion chain rather than direct edits to the release branch:

```text
features -> dev -> staging -> main
```

## Branch responsibilities

| Branch | Purpose | Required checks |
| --- | --- | --- |
| `features` | Active feature work and focused fixes | `pnpm check`, targeted tests, local route verification |
| `dev` | Integrated development candidate | Full unit suite, production build, responsive preview checks |
| `staging` | Release-candidate validation | Manual authenticated acceptance, privacy review, migration review, smoke test |
| `main` | Production-ready source | Checkpoint created, all release gates green, publish initiated from the Management UI |

## Promotion rules

Create a focused branch from the current integration point, commit the change, and merge forward only after the checks for that branch pass. Do not use destructive history rewrites. If a release candidate is unstable, roll back to the latest project checkpoint rather than resetting the working tree.

The Manus project checkpoint is the source of truth for preview and publish. The selected GitHub repository receives the same promotion history for collaboration and review.

## Current migration note

The original Lovable project is treated as an analyzed source prototype. Lovable configuration is not required by the Manus runtime. New work should be authored in the Manus project, promoted through this branch chain, and documented in the production audit.
