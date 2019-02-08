import * as assert from 'assert';
import * as path from 'path';
import { ITestContextOptions } from './ITestContextOptions';
import { Attachments as _Attachments } from './Attachments';
import { Md5 } from '../Utils/MD5';

// tslint:disable:no-invalid-this
// tslint:disable:no-banned-terms

declare var it: any;

export namespace TestContext {
    let itOverrideSuccess = false;
    let options: ITestContextOptions;
    
    const itList = [];
    const defaultOptions = <ITestContextOptions> {
        callerMatchDepth: 5
    };

    function init(options: ITestContextOptions) {
        updateOptions(options);
        const oldit = it;
    
        it = function(...args: Array<any>) {
            // oldit.call can fail
            const spec = oldit.call(this, ...args);
            itList.push([spec, ...args]);
            return spec;
        };
    
        itOverrideSuccess = true;
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
            return false;
        }
    }
    
    function getTestName(caller: Function, userIdentifier: boolean = false) {
        if (itOverrideSuccess) {
            // Jasmine/Jest
            for (let i = 0; i < itList.length; i++) {
                if (callerMatch(itList[i][2], <any>caller, options.callerMatchDepth)) {
                    const spec = itList[i][0];

                    // jasmine/jest
                    if (userIdentifier) {
                        if (spec.id) {
                            return spec.id;
                        }
                    } else {
                        if (spec.description) {
                            return spec.description;
                        }
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

            // tslint:disable-next-line:max-line-length
            assert.fail(`jstestcontext: Could not get current test method with caller recursion depth ${options.callerMatchDepth}. Refer to https://github.com/karanjitsingh/jstestcontext for correct usage.`);
        }
    }

    /**
    * Update TestContextOptions
    * @param testContextOptions instance of ITestContextOptions 
    */
    export function updateOptions(testContextOptions: ITestContextOptions) {
        options = testContextOptions;
    }

    /**
    * Get the name of the current test.
    * @returns Returns the name of the current test. 
    */
    export function getCurrentTestName(): string | null {
        return getTestName(getCurrentTestName.caller);
    }

    /**
    * Get the identifier of the current test.
    * @returns Returns the name of the current test. 
    */
    export function getCurrentTestIdentifier(): string | null {
        const testName = getTestName(getCurrentTestIdentifier.caller, true);

        if (testName) {
            const hash = new Md5();
            hash.appendStr(testName);
            return hash.getGuid();
        }
        
        return null;
    }

    // tslint:disable-next-line:variable-name
    export const Attachments = _Attachments;

    init(defaultOptions);
}

const contextFolder = path.dirname(__filename);
delete require.cache[__filename];
delete require.cache[path.join(contextFolder, 'Attachments.js')];
delete require.cache[path.join(path.dirname(contextFolder), 'index.js')];
