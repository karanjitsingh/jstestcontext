[![Build Status](https://dev.azure.com/karanjitsingh/jstestcontext/_apis/build/status/CI?branchName=master)](https://dev.azure.com/karanjitsingh/jstestcontext/_build/latest?definitionId=14&branchName=master)
[![npm version](https://img.shields.io/npm/v/jstestcontext/latest.svg?label=npm&style=flat)](https://www.npmjs.com/package/jstestcontext)

# jstestcontext

jstestcontext is an extension package for [jstestadapter](https://github.com/karanjitsingh/jstestadapter) as a means to provide _MSTest_ style `TestContext` to javascript test methods. Currently the main feature that TestContext exposes is uploading test case level result attachments. This is especially helpful when associating screenshots with failed UI tests running in CI scenario.

### Install
```bash
npm install jstestcontext
```

<br>

### Usage

**NOTE: TestContext does not work with strict mode since it relies on Function.caller property.**

```typescript
// TypeScript
import { TestContext } from 'jstestcontext';
```

```javascript
// JavaScript
const TestContext = require('jstestcontext').TestContext;
```

#### TestContext.Attachment methods

```Typescript
describe('Suite', () => {
    it('Test', () => {.
        // Returns the directory in which attachments for this test case should be placed.
        const testResultsDirectory = TestContext.Attachments.getAttachmentDirectory();
        
        // User's responsibility to copy the attachment to the directory.
        copyAttachment('/path/to/some/file', testResultsDirectory);
    });
})
```

```Typescript
describe('Suite', () => {
    it('Test', () => {.
        // Copies the given file to the appropriate test attachment directory.
        TestContext.Attachments.recordAttachment('/path/to/some/file').
    });
})
```

#### TestContext methods

```Typescript
describe('Suite', () => {
    it('Test', () => {
        // Returns the test name for the current test method, result: `Test`.
        const testName = TestContext.getCurrentTestName();
        
        // Returns a GUID style identifier for the current test method.
        const testId = TestContext.getCurrentTestIdentifier();
    });
})
```

<br>

### Special Usage

Since the methods `getCurrentTestName()`, `getCurrentTestIdentifier()`, `Attachments.getAttachmentDirectory()`, `Attachments.recordAttachment()` rely on `Function.caller` property, there are some unique situations that arise.

#### Through nested functions

If any one of these functions are called in a nested method, for example, `testSpec -> someMethod -> TestContext.getCurrentTestName`, the call stack needs to be sequentially walked up till the test method is found. The limitation on this walk is determined by `callerMatchDepth` value of the TestContext options with default value 2.

Call depth follows the pattern:

| Call                                                             | Depth |
| ---------------------------------------------------------------- | ----- |
| testSpec -> method1 -> TestContext.getCurrentTestName            | 1     |
| testSpec -> method1 -> method2 -> TestContext.getCurrentTestName | 2     |


#### Updating `callerMatchDepth` option

```typescript
// TypeScript
import { TestContext, ITestContextOptions } from 'jstestcontext';
TestContext.updateOptions(<ITestContextOptions> {
    callerMatchDepth: 4
});
```

```javascript
// JavaScript
const TestContext = require('jstestcontext').TestContext;
TestContext.updateOptions({
    callerMatchDepth: 4
});
```

#### Through Promise executors

Since promises executors don't have caller context the following does not work:

```TypeScript
new Promise(() => {
    // Following will throw
    const dir = TestContext.Attachments.getAttachmentDirectory();
    doSomething(dir);
});
```

To use any one of these methods from inside promises the following is the only option

```TypeScript
const dir = TestContext.Attachments.getAttachmentDirectory();

new Promise(() => {
    // Following will throw
    doSomething(dir);
});
```

<br>

### :x: Nopes and Gotchas 

#### Calling in recursive methods

Calling in recurisve method does not work since `Function.caller` is a static property. The moment a `method` calls itself, it loses the caller as the test method.

```typescript
describe('Dont make such mistakes', () => {
    it('Im a smart guy using recursive functions', () => {
        const dir = method();
    });
})

let i = 0;

function method() {
    if (i++ >= 3) {
        return TestContext.Attachments.getAttachmentDirectory();
    } else {
        return method();
    }
}
```
<br>

----------------------------------------------------------------------------------------------------------------

### Building from source
```bash
# Build binaries and javascript to `./artifacts/Debug/out/` along with the package tarball in `./artifacts/Debug`
.\scripts\build.ps1
```

#### Running Unit Tests
```bash
npm run test
```
dfgh
