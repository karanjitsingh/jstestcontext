import { Md5 } from './Utils/MD5';
import * as fs from 'fs';
import * as path from 'path';
import * as assert from 'assert';

// tslint:disable:no-invalid-this
// tslint:disable:no-arg
// tslint:disable:no-banned-terms

const testResultsEnvVar = 'JSTEST_RESULTS_DIRECTORY';

export interface ITestContextOptions {
    callerRecursionDepth: number;
}

const options: ITestContextOptions = {
    callerRecursionDepth: 5
};

declare var it: any;

const itList = [];
let itOverrideSuccess = false;

try {
    const oldit = it;

    it = function(...args: Array<any>) {
        const spec = oldit.call(this, ...args);
        itList.push([spec, ...args]);
    };

    itOverrideSuccess = true;
} catch (e) {
    // how to log?
}

function getTestGuid(testName: string): string {
    const hash = new Md5();
    hash.appendStr(testName);
    return hash.getGuid();
}

function callerMatch(method: any, caller: any, depth: number): boolean {
    if (method === caller) {
        return true;
    } else if (!caller) {
        return false;
    }

    try {
        let nestedCaller = caller;
        for (let i = 1; i <= depth; i++) {
            nestedCaller = nestedCaller.caller;

            if (!nestedCaller) {
                return false;
            }

            if (nestedCaller === method) {
                return true;
            }
        }
    } catch (e) {
        // tslint:disable-next-line:max-line-length
        assert.fail(`jstestcontext: Could not get current test name with caller recursion depth ${options.callerRecursionDepth}. Refer to https://github.com/karanjitsingh/jstestcontext for correct usage.`);
        return false;
    }
}

export namespace TestContext {
    
    export function getCurrentTestName(): string | null {
        if (itOverrideSuccess) {
            // Jasmine/Jest
            for (let i = 0; i < itList.length; i++) {
                if (callerMatch(itList[i][2], <any>getCurrentTestName.caller, options.callerRecursionDepth)) {
                    
                    const spec = itList[i][0];

                    // jasmine/jest
                    if (spec.id) {
                        return spec.id;
                    }

                    // mocha
                    if (spec.title) {
                        let node = spec;
                        let title = '';
                        while (node && !node.root) {
                            title = node.title + (title ? ' ' : '') + title;
                            node = node.parent;
                        }
                        return title;
                    }
                }
            }
        }
    }

    export function getTestAttachmentDirectory(): string | null {
        const testResultsDirectory = process.env[testResultsEnvVar];
        
        if (!testResultsDirectory) {
            return null;
        }

        const testName = this.getCurrentTestName();

        if (!testName) {
            return null;
        }

        try {
            const testHash = getTestGuid(testName);
            const testFolder = path.join(testResultsDirectory, testHash);

            if (!fs.existsSync(testFolder)) {
                fs.mkdirSync(testFolder);
            }

            return testFolder;
        } catch (e) {
            // how to log?
            return null;
        } 
        return null;
    }

    export function uploadAttachment(path: string): boolean {
        // const testAttachmentDirectory = getTestAttachmentDirectory();
        
        return false;
    }
}