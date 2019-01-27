import * as assert from 'assert';
import { ITestContextOptions } from './ITestContextOptions';
import { Attachments as _Attachments } from './Attachments';

// tslint:disable:no-invalid-this
// tslint:disable:no-banned-terms

declare var it: any;

export namespace TestContext {
    
    let itOverrideSuccess = false;
    const itList = [];
    let options: ITestContextOptions;

    function init(options: ITestContextOptions) {
        updateOptions(options);
        
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

    export function updateOptions(testContextOptions: ITestContextOptions) {
        options = testContextOptions;
    }

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

    // tslint:disable-next-line:variable-name
    export const Attachments = _Attachments;

    init({
        callerRecursionDepth: 5
    });
}