# Security policy

## Supported versions

JEREBU.EXE has no releases. Only the latest commit on the `main` branch is supported.

At the time of writing (14 October 2026), **the site is not deployed anywhere**. If a deployment exists later, only the latest deployment built from `main` is supported.

## Reporting a vulnerability

**Please do not open a public issue, pull request or discussion for a security vulnerability.**

Report it privately in one of these ways:

- **Email [JEREBU.EXE@proton.me](mailto:JEREBU.EXE@proton.me)** with a subject line starting "Security:".
- **GitHub private vulnerability reporting**, if it is enabled for this repository. When it is enabled, a "Report a vulnerability" option appears under the repository's **Security** tab. Whether it is enabled was not known when this policy was written, so email is the reliable route.

Helpful details to include:

- what the problem is, and what an attacker could do with it
- where it is: the file, commit, workflow or URL
- steps to reproduce it
- a suggested fix, if you have one
- whether you would like to be credited, and under what name

When testing, please do not access or change data that is not yours. Do not attempt denial-of-service attacks or social engineering. Do not include other people's personal data in your report.

## What to expect

The project has a very small maintainer team: in practice, its founder alone. Handling is **best effort, and there is no guaranteed response time (no SLA)**. We will try to acknowledge your report, keep you informed, and credit you when a fix is published, if you want credit. Please allow reasonable time for a fix before disclosing the issue publicly.

**There is no bug bounty.** The project cannot offer payment or rewards.

## Scope

**In scope**

- The site's code and configuration in this repository: `src/`, `next.config.ts` and the build setup.
- Dependencies, as used by this project (`package.json` and `package-lock.json`).
- The CI workflow ([`.github/workflows/ci.yml`](.github/workflows/ci.yml)), for example token permissions or unsafe handling of pull request content.
- Secrets, credentials or personal data accidentally committed anywhere in the git history.
- **Data-integrity issues**, for example:
  - a fabricated citation
  - a claim attributed to a source that does not say it
  - a claim presented as verified when it is not
  - a linked source domain that appears to have been taken over
  - content that wrongly implicates an identifiable person or organisation

  Ordinary factual errors can be reported in a public issue. Report privately if public discussion could cause harm, for example where an identifiable person is wrongly implicated.

**Out of scope**

- Vulnerabilities in third-party websites that the site links to, such as government portals and data services. Please report those to their operators.
- GitHub's platform, and the email provider behind the project address.
- Hosting configuration, such as security headers, for a deployment that does not yet exist. Suggestions for future hosting are welcome as ordinary issues.
- Denial-of-service, spam, social engineering and physical attacks.
- Reports from automated scanners that do not show a concrete impact.
- The known development-only advisory described below.

## Current security posture

V0 is deliberately minimal.

- **Static site.** Every route is prerendered at build time. The root layout exports `ensureStatic = "navigation"`, so `next build` fails if any route needs request-time rendering. There are no API routes, server actions or request-time rendering.
- **No database, no user accounts, no authentication, no forms and no file uploads.** The only contact method is a `mailto:` link.
- **No cookies are set by the site's code.** No analytics, no tracking and no third-party scripts.
- **Fonts are self-hosted.** `next/font` downloads them at build time and serves them from the site, so visitors' browsers do not contact a font provider. No images or scripts load from external hosts.
- **No API keys or secrets are in the repository.** Any keys needed by future experiments must be supplied through environment variables and **never committed**. `.gitignore` excludes `.env` files (except `.env.example`) and `*.pem` files.
- **CI** installs dependencies with `npm ci` from the lockfile, and runs with a read-only `contents: read` token. The checkout step does not persist its credentials, so later steps cannot read the token from the git configuration.
- The `X-Powered-By` header is turned off (`poweredByHeader: false`). External links use `rel="noopener noreferrer"`.

This posture will need reviewing before any deployment, and again whenever an experiment adds data access or new dependencies.

## Known issues

**Development-only `npm audit` advisory chain.** As of 14 October 2026, `npm audit` reports five high-severity vulnerable packages, and `npm audit --omit=dev` reports none. All five come from one advisory, GHSA-vfj7-8cjw-p6xm, in a single chain of development dependencies:

```text
eslint-config-next 16.4.0
  └─ @next/eslint-plugin-next 16.4.0
       └─ fast-glob 3.3.1
            └─ micromatch 4.0.8
                 └─ braces 3.0.3   GHSA-vfj7-8cjw-p6xm
```

The root advisory, [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), describes a stack-exhaustion denial of service in `braces` (versions up to 3.0.3), triggered by deeply nested patterns.

This code runs only when the project's own source files are linted, on a developer's machine or in CI. It is not part of the built site and is never sent to browsers.

npm's only suggested fix is `npm audit fix --force`. That would downgrade `eslint-config-next` to 14.2.35, a breaking major-version change. The chain has therefore been left as it is, and will be revisited when an upstream fix is available.

---

<sub>AI involvement: this policy is AI GENERATED. It was written by Claude Code during Experiment 001 and has not yet been reviewed by a human.</sub>
