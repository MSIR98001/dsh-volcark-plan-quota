# Contributing

Contributions are welcome through GitHub issues and pull requests.

## Development checks

```bash
npm install
npm run check
npm pack --dry-run
```

## Pull requests

- Keep changes focused.
- Do not commit credentials, account data, SSO state, or machine-specific paths.
- Preserve both light and dark theme behavior.
- Verify Agent Plan progress bars at the four thresholds: below 50%, 50–69%, 70–89%, and 90% or above.
- Update the README when installation or authentication behavior changes.

## Release archives

Release archives are produced with `npm pack`. Attach both the `.tgz` file and its SHA-256 checksum to the GitHub Release.
