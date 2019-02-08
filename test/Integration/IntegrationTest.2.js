const TestContext = require('../Unit/bin/src/index').TestContext;

describe('suite a', () => {
    it('test case 1', () => {
        console.log(TestContext.Attachments.getTestAttachmentDirectory());
        console.log(TestContext.getCurrentTestName());
        console.log(__filename);
    });
    
    it('test case 2', () => {
        console.log(TestContext.Attachments.getTestAttachmentDirectory());
        console.log(TestContext.getCurrentTestName());
        console.log(__filename);
    });
});