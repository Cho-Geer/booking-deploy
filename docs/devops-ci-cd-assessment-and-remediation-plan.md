# Booking DevOps CI/CD Strict Assessment and Read-Only Remediation Checklist

## Assessment Scope

This assessment covers the current DevOps CI/CD implementation across:

- `C:\Users\USER\Documents\Playground\booking-backend`
- `C:\Users\USER\Documents\Playground\booking-frontend`
- `C:\Users\USER\Documents\Playground\deploy`

This is a static review based on repository contents, workflow definitions, deploy scripts, compose files, and documentation. No code or configuration changes were executed as part of this assessment.

## Executive Summary

The current DevOps setup is no longer a pure design draft. It already includes:

- backend CI workflow
- frontend CI workflow with cross-repo E2E
- backend and frontend image workflows
- deploy compose files for `dev` and `prod`
- manual deploy scripts
- deployment documentation

However, the full CI/CD chain is not yet robust enough to be treated as production-grade. The main issues are not missing files, but broken or weak contracts between image build, migration execution, image verification, deploy inputs, and cross-repo version pairing.

Current maturity assessment:

- `CI`: `B`
- `Image build`: `C`
- `Manual CD`: `C+`
- `Rollback readiness`: `C-`
- `Overall DevOps CI/CD maturity`: `C`

## Detailed Assessment

### Strengths

- Backend CI has both quality and integration gates, with real Postgres and Redis services.
- Frontend CI includes real cross-repo E2E coverage for the primary booking flows.
- Deploy structure exists under `deploy/compose`, `deploy/env`, and `deploy/scripts`.
- Manual deployment already follows a sensible high-level order:
  - pull images
  - run migration
  - start services
  - run health checks
- Health endpoint, Swagger verification, and frontend reachability are all wired into deployment verification.

### Findings

#### Finding 1 - P1

**Title**: Migration deploy path is broken by image/runtime mismatch

**Problem**:
The deploy stack runs the `migration` service via `npm run prisma:deploy`, but the default deploy env points `BACKEND_MIGRATION_IMAGE` to the regular backend image rather than a dedicated migration image.

**Impact**:
The backend runtime image is built after pruning dev dependencies. Since `prisma` is a dev dependency, the CLI required by `prisma:deploy` is not guaranteed to exist in the deploy-time image. This creates a direct risk that deployment fails before the application starts, even though the repository already contains a dedicated `Dockerfile.migrate`.

**Evidence**:

- `deploy/compose/docker-compose.dev.yml:34-43`
- `deploy/compose/dev.compose.env.example:2-4`
- `booking-backend/Dockerfile:20-22`
- `booking-backend/Dockerfile.migrate:1-16`
- `booking-backend/.github/workflows/backend-image.yml:56-65`

**Assessment**:
The deployment design says "migration before app startup," but the image pipeline does not currently make that contract reliable.

#### Finding 2 - P1

**Title**: Backend image validation job cannot prove the published image is deployable

**Problem**:
The backend image workflow runs the image directly and expects `/v1/health` to succeed without providing database, Redis, or required runtime environment variables.

**Impact**:
This validation does not reflect the actual deploy contract. A healthy image can fail this check simply because its runtime dependencies are absent. That creates a misleading signal and may encourage weakening startup or health requirements just to satisfy CI.

**Evidence**:

- `booking-backend/.github/workflows/backend-image.yml:88-93`
- `deploy/compose/docker-compose.dev.yml:45-80`
- `deploy/scripts/deploy-dev.sh:23-25`

**Assessment**:
The image workflow currently validates "container starts in isolation," not "image is deployable in the documented environment."

#### Finding 3 - P1

**Title**: Image verification script is internally inconsistent and effectively unusable for the documented flow

**Problem**:
`verify-images.sh` pulls branch tags, runs containers directly, and checks backend health without starting required dependencies or loading deploy env files. The script also contains malformed collapsed lines, making it unsafe to rely on as a documented verification path.

**Impact**:
The repository currently advertises an image verification path that does not actually validate the deploy topology used by compose. This weakens confidence in image quality before deployment.

**Evidence**:

- `deploy/scripts/verify-images.sh:12-21`
- `deploy/scripts/verify-images.sh:38-63`
- `deploy/README.md:63-67`
- `deploy/compose/docker-compose.dev.yml:34-80`

**Assessment**:
This script should not be treated as a trustworthy pre-deploy gate in its current form.

#### Finding 4 - P2

**Title**: Frontend E2E gate tests against an unpinned backend revision

**Problem**:
The frontend CI checks out `Cho-Geer/booking-backend` without pinning a branch, tag, or commit ref.

**Impact**:
Cross-repo compatibility becomes unstable. A frontend PR may pass or fail depending on whichever backend revision GitHub resolves at runtime rather than a backend version explicitly paired with the frontend change.

**Evidence**:

- `booking-frontend/.github/workflows/frontend-ci.yml:81-86`

**Assessment**:
This is a reproducibility and contract-stability problem rather than a complete pipeline blocker, but it materially weakens confidence in E2E results.

#### Finding 5 - P2

**Title**: Default deploy inputs use mutable branch tags, weakening rollback and reproducibility

**Problem**:
The deployment env examples recommend mutable branch tags such as `dev` and `main` rather than immutable commit-based tags.

**Impact**:
Repeated `docker compose pull` operations can fetch different artifacts for the same logical input. That makes rollback less predictable and makes it hard to reconstruct the exact environment that was deployed during an incident.

**Evidence**:

- `deploy/compose/dev.compose.env.example:2-4`
- `deploy/compose/prod.compose.env.example:2-4`
- `booking-backend/.github/workflows/backend-image.yml:48-54`
- `booking-frontend/.github/workflows/frontend-image.yml:48-54`

**Assessment**:
The image workflows already generate richer tag sets, but the default deploy examples steer operators toward weaker, mutable choices.

## Overall Conclusion

The current system has a credible CI baseline and a meaningful manual deployment foundation. The main gaps are concentrated in four areas:

- migration image contract
- image validation realism
- immutable deploy inputs
- cross-repo version pinning

In other words, the platform is close to "operationally usable for controlled environments," but not yet strong enough to claim fully reliable, reproducible CI/CD.

## Read-Only Remediation Checklist

The following checklist is intentionally written as a read-only remediation route. It is meant to guide implementation work without implying that the changes have already been applied.

### P1 Remediation Route

#### Goal

Stabilize the deployment-critical parts of the pipeline so that image build, migration execution, and image verification all reflect the real deploy contract.

#### Required Actions

1. Define a dedicated migration image contract.
   - Build and publish a migration-specific image from `booking-backend/Dockerfile.migrate`.
   - Stop using the regular backend runtime image as the default `BACKEND_MIGRATION_IMAGE`.
   - Keep the migration command aligned with the image purpose so `prisma:deploy` is guaranteed to exist at runtime.

2. Redesign backend image validation to match actual runtime expectations.
   - Validate the backend image with Postgres, Redis, and required env vars available.
   - Prefer compose-based or service-container-based smoke validation over isolated container startup.
   - Treat `/v1/health` as a dependency-aware readiness signal, not a standalone liveness shortcut.

3. Replace or rewrite `deploy/scripts/verify-images.sh`.
   - Make it load deploy env files and start the same dependency graph used by deploy compose.
   - Remove malformed shell constructs and ensure the script is syntactically valid end to end.
   - Use it only if it can verify the same image/runtime contract that deploy scripts rely on.

#### Completion Criteria

- Migration can run successfully using the published deploy image path.
- Backend image verification reflects real deploy dependencies.
- The documented image verification route is syntactically valid and operationally meaningful.

### P2 Remediation Route

#### Goal

Improve reproducibility, rollback precision, and cross-repo compatibility confidence.

#### Required Actions

1. Change deploy defaults to immutable image references.
   - Update deploy env examples to recommend commit-based or equivalent immutable tags by default.
   - Keep mutable tags only as convenience options, not as the primary documented deployment input.

2. Pin the backend revision used by frontend E2E.
   - Explicitly define how frontend CI selects the backend revision.
   - Use a branch, tag, commit SHA, or other deterministic ref strategy instead of an implicit default.
   - Document the pairing rule so frontend and backend changes can be tested consistently.

3. Align image workflow documentation with deploy usage.
   - Make the deploy README explain which tag classes are safe for release, rollback, and debugging.
   - Ensure image build workflows and deploy examples describe the same tag policy.

#### Completion Criteria

- Each deployment can be traced to a unique image artifact.
- Each frontend E2E run can identify the backend revision it tested against.
- Rollback instructions operate on immutable, reproducible image references.

### P3 Remediation Route

#### Goal

Improve maintainability, operator clarity, and day-to-day usability of the DevOps surface area.

#### Required Actions

1. Clean up deployment documentation quality.
   - Remove formatting corruption and line-collapsing issues from `deploy/README.md`.
   - Make command examples copy-safe and visually consistent.

2. Unify terminology across workflows, compose files, and docs.
   - Use the same names for image types, migration steps, validation steps, and environments.
   - Make sure `dev`, `prod`, `backend`, `frontend`, and `migration` mean the same thing everywhere.

3. Expand operator-facing runbook guidance.
   - Add a short rollback procedure tied to actual image selection rules.
   - Add a quick troubleshooting section for migration failure, health check failure, and image pull failure.
   - Make the manual verification path explicit and consistent with deploy scripts.

#### Completion Criteria

- Deployment docs can be used without additional oral explanation.
- Commands, image names, and tag expectations are consistent across the repo.
- Operators can follow a short rollback and troubleshooting path during incidents.

## Suggested Execution Order

1. Complete all `P1` items first.
2. Address `P2` items immediately after `P1`, because they strengthen rollback and test trustworthiness.
3. Finish `P3` items last to consolidate operational clarity and reduce maintenance friction.

## Final Note

This document is a strict assessment plus a read-only remediation route. It should be treated as an execution guide for future DevOps hardening work, not as evidence that the identified issues have already been resolved.
