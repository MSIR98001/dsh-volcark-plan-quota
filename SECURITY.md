# Security Policy

## Supported versions

Security fixes are applied to the latest release.

## Reporting a vulnerability

Please do not open a public issue containing credentials, SSO tokens, account IDs, or other sensitive information. Use GitHub's private vulnerability reporting feature for this repository when available, or contact the repository owner privately through GitHub.

## Credential model

This plugin uses the official Volcano Ark CLI SSO flow. The repository and release archives must never contain:

- Volcano account credentials
- API keys or AK/SK values
- SSO access or refresh tokens
- files copied from `~/.arkcli`

Each user authenticates locally with their own Volcano account.
