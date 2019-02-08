import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import { TestContext } from '../../../src';
import { Md5 } from '../../../src/Utils/MD5';

// tslint:disable

describe('Attachment Suite', () => {
    const resultsDirectory = 'C:\\temp';
    let existsSyncDescriptor: PropertyDescriptor;
    let mkdirSyncDescriptor: PropertyDescriptor;
    let copyFileDescriptor: PropertyDescriptor;
    let lstatSyncDescriptor: PropertyDescriptor;
    let assertFailDescriptor: PropertyDescriptor;

    beforeEach(() => {
        process.env.JSTEST_RESULTS_DIRECTORY = resultsDirectory;
        existsSyncDescriptor = Object.getOwnPropertyDescriptor(fs, 'existsSync');
        mkdirSyncDescriptor = Object.getOwnPropertyDescriptor(fs, 'mkdirSync');
        copyFileDescriptor = Object.getOwnPropertyDescriptor(fs, 'copyFile');
        lstatSyncDescriptor = Object.getOwnPropertyDescriptor(fs, 'lstatSync');
        assertFailDescriptor = Object.getOwnPropertyDescriptor(assert, 'fail');
    });

    afterEach(() => {
        Object.defineProperty(fs, 'existsSync', existsSyncDescriptor);
        Object.defineProperty(fs, 'mkdirSync', mkdirSyncDescriptor);
        Object.defineProperty(fs, 'existsSync', lstatSyncDescriptor);
        Object.defineProperty(fs, 'mkdirSync', copyFileDescriptor);
        Object.defineProperty(assert, 'fail', assertFailDescriptor);
    });

    it('getTestAttachmentDirectory will return correct directory', () => {
        const strings = new MockStrings();
        const checks = new MockChecks();

        setup(new MockFunctions({
            existsSync: true,
            getCurrentTestName: true
        }), strings, checks, new MockReturns());

        assert.equal(TestContext.Attachments.getTestAttachmentDirectory(), strings.attachmentDirectory);
        assert.equal(checks.existsSyncCheck, true);
    });

    it('getTestAttachmentDirectory will create directory and return correct test attachment', () => {
        const strings = new MockStrings();
        const checks = new MockChecks();

        setup(new MockFunctions({
            existsSync: true,
            mkdirSync: true,
            getCurrentTestName: true,
        }), strings, checks, new MockReturns({
            existsSync: false
        }));

        assert.equal(TestContext.Attachments.getTestAttachmentDirectory(), strings.attachmentDirectory);
        assert.equal(checks.existsSyncCheck, true);
        assert.equal(checks.mkdirSyncCheck, true);
    });

    it('getTestAttachmentDirectory will assert.fail if error occured', () => {
        const testName = 'sample test';

        TestContext.getCurrentTestName = () => {
            return testName;
        };

        Object.defineProperty(fs, 'existsSync', {
            value: (filePath) => {
                throw new Error('some error');
            }
        });

        Object.defineProperty(assert, 'fail', {
            value: (error) => {
                assert.equal(error, new MockStrings().failString);
            }
        });

        TestContext.Attachments.getTestAttachmentDirectory();
    });

    it('getTestAttachmentDirectory will return null if getCurrentTestName fails', () => {
        TestContext.getCurrentTestName = () => {
            return '';
        };

        assert.equal(TestContext.Attachments.getTestAttachmentDirectory(), null);
    });

    it('recordAttachment will copy file and resolve to destination path', (done) => {
        const strings = new MockStrings();
        const checks = new MockChecks();
        const returns = new MockReturns();

        setup(new MockFunctions({
            existsSync: true,
            lstatSync: true,
            getTestAttachmentDirectory: true,
            copyFile: true
        }), strings, checks, returns);

        TestContext.Attachments.recordAttachment(strings.attachmentPath).then((src) => {
            assert.equal(src, strings.expectedAttachmentPath);
            done();
        }, (reason) => {
            assert.fail(reason);
            done();
        });

        assert.equal(checks.lstatSyncCheck, true);
        assert.equal(checks.copyFileCheck, true);
    });

    it('recordAttachment will reject with error if copyFile throws', (done) => {
        const error = new Error();
        const strings = new MockStrings();
        const checks = new MockChecks();
        const returns = new MockReturns({copyFile: error});

        setup(new MockFunctions({
            existsSync: true,
            lstatSync: true,
            getTestAttachmentDirectory: true,
            copyFile: true
        }), strings, checks, returns);

        TestContext.Attachments.recordAttachment(strings.attachmentPath).then(() => {
            assert.fail('Should not have resolved');
            done();
        }, (reason) => {
            assert.equal(reason, error);
            done();
        });

        assert.equal(checks.lstatSyncCheck, true);
        assert.equal(checks.copyFileCheck, true);
    });

    it('recordAttachment will reject with reason if file does not exist', (done) => {
        const error = new Error();
        const strings = new MockStrings();
        const checks = new MockChecks();
        const returns = new MockReturns({
            lstatSync: { isFile: () => false }
        });

        setup(new MockFunctions({
            existsSync: true,
            lstatSync: true
        }), strings, checks, returns);

        TestContext.Attachments.recordAttachment(strings.attachmentPath).then(() => {
            assert.fail('Should not have resolved');
            done();
        }, (reason) => {
            assert.equal(reason, 'Given path is not a file.');
            done();
        });

        assert.equal(checks.lstatSyncCheck, true);
    });
    
    it('recordAttachment will reject with reason if something throws', (done) => {
        const error = new Error('some error');
        const strings = new MockStrings();
        const checks = new MockChecks();
        const returns = new MockReturns({
            lstatSync: { isFile: () => { throw error; } }
        });

        setup(new MockFunctions({
            existsSync: true,
            lstatSync: true
        }), strings, checks, returns);

        TestContext.Attachments.recordAttachment(strings.attachmentPath).then(() => {
            assert.fail('Should not have resolved');
            done();
        }, (reason) => {
            assert.equal(reason, 'Could not copy attachment: ' + error);
            done();
        });

        assert.equal(checks.lstatSyncCheck, true);
    });

    
    it('recordAttachment will reject with reason if path does not exist', (done) => {
        const error = new Error('some error');
        const strings = new MockStrings();
        const checks = new MockChecks();
        const returns = new MockReturns({
            existsSync: false
        });

        setup(new MockFunctions({
            existsSync: true,
            lstatSync: true
        }), strings, checks, returns);

        TestContext.Attachments.recordAttachment(strings.attachmentPath).then(() => {
            assert.fail('Should not have resolved');
            done();
        }, (reason) => {
            assert.equal(reason, 'The file ' + strings.attachmentPath + ' does not exist.');
            done();
        });

    });
});

const setup = (mocks: MockFunctions, strings: MockStrings, checks: MockChecks, returns: MockReturns) => {
    const testName = 'sample test';

    if (mocks.getTestAttachmentDirectory)
        TestContext.Attachments.getTestAttachmentDirectory = () => {
            return strings.attachmentDirectory;
        };

    if (mocks.getCurrentTestName)
        TestContext.getCurrentTestName = () => {
            return testName;
        };

    if (mocks.existsSync)
        Object.defineProperty(fs, 'existsSync', {
            value: (filePath) => {
                checks.existsSyncCheck = true;
                return returns.existsSync;
            }
        });

    if (mocks.mkdirSync)
        Object.defineProperty(fs, 'mkdirSync', {
            value: (filePath) => {
                assert.equal(filePath, strings.attachmentDirectory);
                checks.mkdirSyncCheck = true;
            }
        });


    if (mocks.lstatSync)
        Object.defineProperty(fs, 'lstatSync', {
            value: (filePath) => {
                assert.equal(filePath, strings.attachmentPath);
                checks.lstatSyncCheck = true;
                return returns.lstatSync;
            }
        });

    if (mocks.copyFile)
        Object.defineProperty(fs, 'copyFile', {
            value: (src, dest, callback) => {
                assert.equal(src, strings.attachmentPath);
                assert.equal(dest, strings.expectedAttachmentPath);
                checks.copyFileCheck = true;

                callback(returns.copyFile);
            }
        });
};

class Mockables {

    init(options: any = {}, obj: Mockables) {
        const keys = Object.keys(obj);
        keys.forEach((key) => {
            obj[key] = options[key] !== undefined ? options[key] : obj[key];
        });
    }
}

class MockFunctions extends Mockables {
    public existsSync: boolean = false;
    public mkdirSync: boolean = false;
    public lstatSync: boolean = false;
    public copyFile: boolean = false;
    public getCurrentTestName: boolean = false;
    public getTestAttachmentDirectory: boolean = false;

    constructor(options: any = {}) {
        super();
        this.init(options, this);
    }
}

// tslint:disable:variable-name
class MockReturns extends Mockables {
    public copyFile: any = null;
    public existsSync: boolean = true;
    public lstatSync: any = { isFile: () => true };

    constructor(options: any = {}) {
        super();
        this.init(options, this);
    }
}

class MockChecks extends Mockables {
    public existsSyncCheck: boolean = false;
    public lstatSyncCheck: boolean = false;
    public copyFileCheck: boolean = false;
    public mkdirSyncCheck: boolean = false;

    constructor(options: any = {}) {
        super();
        this.init(options, this);
    }
}

class MockStrings extends Mockables {
    public testName: string = 'sample test';
    public attachmentPath: string = 'C:\\attachment.png';
    public attachmentDirectory: string = 'C:\\temp\\fc9dbe42-bb08-fee3-d521-cb7df88b0933';
    public expectedAttachmentPath: string = 'C:\\temp\\fc9dbe42-bb08-fee3-d521-cb7df88b0933\\attachment.png';
    public failString: string = 'Could not get test attachment directory: some error';

    constructor(options: any = {}) {
        super();
        this.init(options, this);
    }
}