const assert = require('assert');
const TestContext = require('../../artifacts/Debug/out/index').TestContext;

describe('Normal Functions', () => {

    it('Normal Call', function() {
        console.log(TestContext.Attachments.getTestAttachmentDirectory());
        console.log(TestContext.getCurrentTestName());
        console.log(TestContext.getCurrentTestIdentifier())
    });

    it('Nested Call', function() {
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