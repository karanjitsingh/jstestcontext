[![Build Status](https://dev.azure.com/karanjitsingh/jstestcontext/_apis/build/status/CI?branchName=master)](https://dev.azure.com/karanjitsingh/jstestcontext/_build/latest?definitionId=14&branchName=master)
[![npm version](https://img.shields.io/npm/v/jstestcontext/latest.svg?label=npm&style=flat)](https://www.npmjs.com/package/jstestcontext)

### jstestcontext

jstestcontext is an extension package for [jstestadapter](https://github.com/karanjitsingh/jstestadapter) as a means to provide _MSTest_ style `TestContext`. Currently the main feature that TestContext exposes is uploading test case level result attachments. This is especially helpful when using screenshots for failed UI tests running in CI scenario.

#### Building from source
```bash
# Build binaries and javascript to `./artifacts/Debug/out/` along with the package tarball in `./artifacts/Debug`
.\scripts\build.ps1
```

#### Running Unit Tests
```bash
npm run test
```

{{USAGE.md}}