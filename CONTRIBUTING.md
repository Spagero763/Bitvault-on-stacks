# Contributing to BitVault

Thanks for your interest in improving BitVault. This document explains how to set
up the project and the conventions we follow.

## Development setup

1. Fork and clone the repository.
2. Install dependencies with `npm install`.
3. Make sure the contracts check cleanly with `clarinet check`.
4. Run the test suite with `npm test`.

## Branching

- Create a feature branch off `main`, for example `feat/proposal-cancel` or
  `fix/threshold-check`.
- Keep branches focused on a single change.

## Commit messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` a new feature
- `fix:` a bug fix
- `test:` adding or updating tests
- `docs:` documentation only
- `chore:` tooling, config, or maintenance

Scope the message to the area when it helps, e.g. `feat(voting): add weight reset`.

## Pull requests

- Describe what changed and why.
- Add or update tests for behaviour changes.
- Make sure `npm test` passes before requesting a review.

## Code style

- Clarity contracts follow the existing layout: constants and error codes first,
  then data definitions, then read-only functions, then public functions.
- Front-end code is formatted with Prettier.
