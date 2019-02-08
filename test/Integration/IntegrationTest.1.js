process.env['JSTEST_RESULTS_DIRECTORY'] = 'c:\\temp';
const TestContext = require('../Unit/bin/src/index').TestContext;

describe('suite b', () => {
    it('test case 1', () => {
        debugger;
        console.log(TestContext.Attachments.getTestAttachmentDirectory());
        console.log(TestContext.getCurrentTestName());
        console.log(__filename);
    });
    
    it('test case 2', () => {
        debugger;
        console.log(TestContext.Attachments.getTestAttachmentDirectory());
        console.log(TestContext.getCurrentTestName());
        console.log(__filename);
    });
});