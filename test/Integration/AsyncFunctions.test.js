const assert = require('assert');
const TestContext = require('jstestcontext').TestContext;

process.env['JSTEST_RESULTS_DIRECTORY'] = 'C:\\temp';

describe('Async Functions', () => {
    
    it('Async Call', async () => {
        console.log(TestContext.Attachments.getTestAttachmentDirectory());
        console.log(TestContext.getCurrentTestName());
        console.log(TestContext.getCurrentTestIdentifier())
    });

    it('Async Nested Call', async () => {
        let threw = false;
        try {
            nested()
        } catch (e) {
            threw = true;
        }

        assert.equal(threw, true, "First call should have thrown");

        TestContext.updateOptions({
            callerMatchDepth: 4
        })

        nested();
    });
    
});

function nested() {
    nested2();
}

function nested2() {
    nested3()
}

function nested3() {
    console.log(TestContext.Attachments.getTestAttachmentDirectory());
    console.log(TestContext.getCurrentTestName());
    console.log(TestContext.getCurrentTestIdentifier())
}