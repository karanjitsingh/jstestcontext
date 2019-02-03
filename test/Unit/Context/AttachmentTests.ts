import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { TestContext } from '../../../src';
import { Md5 } from '../../../src/Utils/MD5';

describe('Attachment Suite', () =>  {
    const resultsDirectory = 'C:\\temp';
    let existsSyncDescriptor: PropertyDescriptor;
    let mkdirSyncDescriptor: PropertyDescriptor;
    let copyFileDescriptor: PropertyDescriptor;
    let lstatSyncDescriptor: PropertyDescriptor;
    let assertFailDescriptor: PropertyDescriptor;

    before(() => {
        process.env.JSTEST_RESULTS_DIRECTORY = resultsDirectory;
        existsSyncDescriptor = Object.getOwnPropertyDescriptor(fs, 'existsSync');
        mkdirSyncDescriptor = Object.getOwnPropertyDescriptor(fs, 'mkdirSync');
        copyFileDescriptor = Object.getOwnPropertyDescriptor(fs, 'copyFile');
        lstatSyncDescriptor = Object.getOwnPropertyDescriptor(fs, 'lstatSync');
        assertFailDescriptor = Object.getOwnPropertyDescriptor(assert, 'fail');
    });

    after(() => {
        Object.defineProperty(fs, 'existsSync', existsSyncDescriptor);
        Object.defineProperty(fs, 'mkdirSync', mkdirSyncDescriptor);
        Object.defineProperty(assert, 'fail', assertFailDescriptor);
    });
    
    it('getTestAttachmentDirectory will return correct test attachment', () => {
        const testName = 'sample test';
        let existsSyncCheck = false;
        
        TestContext.getCurrentTestName = () => {
            return testName;
        };
        
        const hash = new Md5();
        hash.appendStr(testName);
        const hashStr = hash.getGuid();
        
        const expectedPath = path.join(resultsDirectory, hashStr);

        Object.defineProperty(fs, 'existsSync', { value: (filePath) => {
            assert.equal(filePath, expectedPath);
            existsSyncCheck = true;
            return true;
        }});

        assert.equal(TestContext.Attachments.getTestAttachmentDirectory(), expectedPath);
        assert.equal(existsSyncCheck, true);
    });

    it('getTestAttachmentDirectory will create directory and return correct test attachment', () => {
        const testName = 'sample test';
        let existsSyncCheck = false;
        let mkdirSyncCheck = false;
        
        TestContext.getCurrentTestName = () => {
            return testName;
        };
        
        const hash = new Md5();
        hash.appendStr(testName);
        const hashStr = hash.getGuid();
        
        const expectedPath = path.join(resultsDirectory, hashStr);

        Object.defineProperty(fs, 'existsSync', { value: (filePath) => {
            assert.equal(filePath, expectedPath);
            existsSyncCheck = true;
            return false;
        }});

        Object.defineProperty(fs, 'mkdirSync', { value: (filePath) => {
            assert.equal(filePath, expectedPath);
            mkdirSyncCheck = true;
        }});

        assert.equal(TestContext.Attachments.getTestAttachmentDirectory(), expectedPath);
        assert.equal(existsSyncCheck, true);
        assert.equal(mkdirSyncCheck, true);
    });
    
    it('getTestAttachmentDirectory will assert.fail if error occured', () => {
        const testName = 'sample test';
        
        TestContext.getCurrentTestName = () => {
            return testName;
        };
        
        Object.defineProperty(fs, 'existsSync', { value: (filePath) => {
            throw new Error('some error');
        }});

        Object.defineProperty(assert, 'fail', { value: (error) => {
            assert.equal(error, 'Could not get test attachment directory: some error');
        }});
        
        TestContext.Attachments.getTestAttachmentDirectory();
    });

    it('getTestAttachmentDirectory will return null if getCurrentTestName fails', () => {
        TestContext.getCurrentTestName = () => {
            return '';
        };
        
        assert.equal(TestContext.Attachments.getTestAttachmentDirectory(), null);
    });
});