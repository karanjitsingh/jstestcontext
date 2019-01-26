// tslint:disable:no-invalid-this
// tslint:disable:no-arg

const testResultsEnvVar = 'JSTEST_RESULTS_DIRECTORY';

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

export namespace TestContext {
    export function getCurrentTestName() {
        if (itOverrideSuccess) {
            // Jasmine/Jest
            for (let i = 0; i < itList.length; i++) {
                if (itList[i][2] === <any>getCurrentTestName.caller ) {
                    
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

    export function getAttachmentDirectory(): string | null {
        if (process.env[testResultsEnvVar]) {
            return process.env[testResultsEnvVar];
        }
        return null;
    }

    export function uploadAttachment(path: string): boolean {
        return false;
    }
}