import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { Md5 } from '../Utils/MD5';
import { TestContext } from './TestContext';

const testResultsEnvVar = 'JSTEST_RESULTS_DIRECTORY';

export namespace Attachments {
    
    function getTestGuid(testName: string): string {
        const hash = new Md5();
        hash.appendStr(testName);
        return hash.getGuid();
    }
    
    /**
    * Get the test attachment directory for the current test.
    * @returns Returns path to the directory.
    */
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
            assert.fail('Could not get test attachment directory: ' + e.message);
            return null;
        }
    }

    /**
    * Copies an attachment to the test attachment directory.
    * @param attachmentPath Path of the attachment.
    * @returns Returns a promise that resolves to the path of the copied file if success and reject with error/reason otherwise.
    */
    export function recordAttachment(attachmentPath: string): Promise<string> {
        let resolve: (value: string) => void;
        let reject: (reason: any) => void;

        // tslint:disable-next-line:promise-must-complete
        const returnPromise = new Promise<string>((resolver, rejector) => { resolve = resolver; reject = rejector; });
        
        if (fs.existsSync(attachmentPath)) {
            try {
                const stat = fs.lstatSync(attachmentPath);
                if (stat.isFile()) {
                    const attachmentDirectory = Attachments.getTestAttachmentDirectory();
                    const destinationFile = path.join(attachmentDirectory, path.basename(attachmentPath));
                    fs.copyFile(attachmentPath, destinationFile, (error) => {
                        if (!error) {
                            resolve(destinationFile);
                        } else {
                            reject(error);
                        }
                    });
                } else {
                    reject('Given path is not a file.');
                }

            } catch (e) {
                reject('Could not copy attachment: ' + e);
            }
        } else {
            reject('The file ' + attachmentPath + ' does not exist.');
        }
        return returnPromise;
    }
}