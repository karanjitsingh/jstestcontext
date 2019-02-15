// Since TestContext it modifies the test function 'it', we'll save it as 'IT'
const IT = it;

// The mocking also needs to be done before TestContext is even imported
let mockSpec: any;
const itMock = <any> (() => {
    return mockSpec;
});

// Override the default test function
it = itMock;

import * as assert from 'assert';
import { TestContext } from '../../../src';
import { Constants } from '../../../src/Constants';
import { Md5 } from '../../../src/Utils/MD5';

// Describe sets "it" back to the original test function
const modifiedIt = it;

describe('TestContext Suite', () => {

    beforeEach(() => {
        // Restore overridden it
        it = modifiedIt;
    });

    IT('getCurrentTestName/getCurrentTestIdentifier will return test name and identifier and override "it" for mocha', () => {
        let testContextCalled = false; 

        mockSpec = {
            title: 'spec title',
            file: 'file name',
            parent: {
                title: 'parent 2',
                parent: {
                    title: 'parent 1',
                    parent: {
                        root: true
                    }
                }
            }
        };
        
        const id = new Md5().appendStr('parent 1 parent 2 spec title|file name').getGuid();

        const specMethod = () => {
            assert.equal(TestContext.getCurrentTestName(), mockSpec.title);
            assert.equal(TestContext.getCurrentTestIdentifier(), id);
            testContextCalled = true;
        };
        
        assert.equal(mockSpec, it('spec title', specMethod));

        specMethod();
        assert.equal(testContextCalled, true);
    });

    IT('getCurrentTestName/getCurrentTestIdentifier will return test name and identifier and override "it" for jest and jasmine', () => {
        let testContextCalled = false;

        mockSpec = {
            description: 'spec title',
            id: 'spec id',
            result: {
                fullName: 'fullname'
            }
        };

        const id = new Md5().appendStr('fullname|spec id').getGuid();

        const specMethod = () => {
            assert.equal(TestContext.getCurrentTestName(), mockSpec.description);
            assert.equal(TestContext.getCurrentTestIdentifier(), id);
            testContextCalled = true;
        };
        
        assert.equal(mockSpec, it('spec title', specMethod));

        specMethod();
        assert.equal(testContextCalled, true);
    });

    IT('getCurrentTestName/getCurrentTestIdentifier will throw for nested functions if callerMatchDepth is insufficient', () => {
        let testContextCalled = false;

        mockSpec = {
        };

        const nestedMethod = () => {
            try {
                TestContext.getCurrentTestName();
            } catch (e) {
                assert.equal(e.message, String.format(Constants.CouldNotGetTestMethodError, 0));                
            }
            try {
                TestContext.getCurrentTestIdentifier();
            } catch (e) {
                assert.equal(e.message, String.format(Constants.CouldNotGetTestMethodError, 0));                
            }
            testContextCalled = true;
        };

        const specMethod = () => {
            nestedMethod();
        };

        TestContext.updateOptions({
            callerMatchDepth: 0
        });
        
        assert.equal(mockSpec, it('spec title', specMethod));
        specMethod();
        assert.equal(testContextCalled, true);        
    });

    IT('getCurrentTestName/getCurrentTestIdentifier will not throw for nested functions if appropriate callerMatchDepth set', () => {
        let testContextCalled = false;

        mockSpec = {
            description: 'spec title',
            id: 'spec id',
            result: {
                fullName: 'fullname'
            }
        };
        
        const id = new Md5().appendStr('fullname|spec id').getGuid();

        const nestedMethod = () => {
            assert.equal(TestContext.getCurrentTestName(), mockSpec.description);
            assert.equal(TestContext.getCurrentTestIdentifier(), id);
            testContextCalled = true;
        };

        const specMethod = () => {
            nestedMethod();
        };

        TestContext.updateOptions({
            callerMatchDepth: 1
        });
        
        assert.equal(mockSpec, it('spec title', specMethod));
        specMethod();
        assert.equal(testContextCalled, true);        
    });
    
    IT('getCurrentTestName/getCurrentTestIdentifier will throw if spec object contract does not validate', () => {
        let testContextCalled = false;

        mockSpec = {
        };

        const specMethod = () => {
            try {
                TestContext.getCurrentTestName();
            } catch (e) {
                assert.equal(e.message, String.format(Constants.CouldNotGetSpecNameIdentifierError, 0));                
            }
            try {
                TestContext.getCurrentTestIdentifier();
            } catch (e) {
                assert.equal(e.message, String.format(Constants.CouldNotGetSpecNameIdentifierError, 0));                
            }
            testContextCalled = true;
        };
        
        assert.equal(mockSpec, it('spec title', specMethod));
        specMethod();
        assert.equal(testContextCalled, true);        
    });

});