import { TestContext } from './TestContext';
import * as fs from 'fs';
import { Md5 } from '../Utils/MD5';
import * as path from 'path';

const testResultsEnvVar = 'JSTEST_RESULTS_DIRECTORY';

export namespace Attachments {
    
    function getTestGuid(testName: string): string {
        const hash = new Md5();
        hash.appendStr(testName);
        return hash.getGuid();
    }
    
    export function getTestAttachmentDirectory(): string | null {
        const testResultsDirectory = process.env[testResultsEnvVar];
        
        if (!testResultsDirectory) {
            return null;
        }

        const testName = TestContext.getCurrentTestName();

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
    }

    export function recordAttachment(path: string): boolean {
        // const testAttachmentDirectory = getTestAttachmentDirectory();
        
        return false;
    }
}