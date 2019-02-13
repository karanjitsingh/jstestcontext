// "use strict";

const TestContext = require('../Unit/bin/src/index').TestContext;

describe('suite c', () => {
    it('test case 1', () => {
        nested();
    });
    
    it('test case 2', () => {
        console.log(TestContext.Attachments.getTestAttachmentDirectory());
        console.log(TestContext.getCurrentTestName());
        console.log(__filename);
    });
});

function nested() {
    console.log(TestContext.Attachments.getTestAttachmentDirectory());
    console.log(TestContext.getCurrentTestName());
    console.log(__filename);
}