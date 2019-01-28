import { TestContext } from './TestContext';
import * as fs from 'fs';
import * as path from 'path';

const testResultsEnvVar = 'JSTEST_RESULTS_DIRECTORY';

export namespace Attachments {
    
    function getTestGuid(testName: string): string {
        return null;
    }
    
    export function getTestAttachmentDirectory(): string | null {
        return null;
    }

    export function recordAttachment(path: string): boolean {
        return false;
    }
}