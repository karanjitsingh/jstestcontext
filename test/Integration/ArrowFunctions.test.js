const assert = require('assert');
const TestContext = require('jstestcontext').TestContext;

process.env['JSTEST_RESULTS_DIRECTORY'] = 'C:\\temp';

describe('Arrow Functions', () => {

    it('Normal Call', () => {
        console.log(TestContext.Attachments.getTestAttachmentDirectory());
        console.log(TestContext.getCurrentTestName());
        console.log(TestContext.getCurrentTestIdentifier())
    });

    it('Nested Call', () => {
        let threw = false;
        try {
            nested()
        } catch (e) {
            threw = true;
        }

        assert.equal(threw, true, "First call should have thrown");

        TestContext.updateOptions({
            callerMatchDepth: 1
        })

        nested();
    });

});

function nested() {
    console.log(TestContext.Attachments.getTestAttachmentDirectory());
    console.log(TestContext.getCurrentTestName());
    console.log(TestContext.getCurrentTestIdentifier())
}