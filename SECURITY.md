# Security Policy

## Scope

This repository is an unofficial example project for deterministic local contract testing around Foundry-oriented workflows.

It does not ship a hosted service, production credentials, or managed infrastructure. Most security issues in this repo are therefore likely to fall into one of these buckets:

- accidental inclusion of secrets or credentials
- unsafe example code that could mislead downstream adopters
- dependency vulnerabilities in the local demo or tooling chain

## Reporting

If you find a security issue, do not open a public issue with exploit details.

Instead:

1. contact the maintainer privately through a repository owner or organization contact channel
2. include reproduction steps, impacted files, and severity context
3. note whether the issue affects only this example repo or likely downstream adopters too

If you cannot identify a private contact path, open a minimal public issue without sensitive details and request a private follow-up channel.

## Expectations

- do not commit secrets, tokens, or private keys
- do not add examples that imply insecure defaults are production-safe
- do not describe this repository as production-certified or security-reviewed

## Supported Versions

Security fixes, if any, are expected to land on the latest version of the repository rather than through a long-term support branch model.
