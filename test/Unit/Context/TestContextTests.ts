// Since TestContext it modifies the test function 'it', we'll save it as 'IT'
const IT = it;

// The mocking also needs to be done before TestContext is even imported
let mockSpec: any;
const itMock = <any> (() => {
    return mockSpec;
});

// Override the default test function
it = itMock;

import { TestContext } from '../../../src';
import * as assert from 'assert';
import { Constants } from '../../../src/Constants';

// Describe sets "it" back to the original test function
const modifiedIt = it;

describe('TestContext Suite', () => {

    beforeEach(() => {
        // Restore overridden it
        it = modifiedIt;
    });

    IT('getCurrentTestName/getCurrentTestIdentifier will return test name and identifier and override "it" for mocha', () => {
        const id = 'ecb9e5f6-dd8c-8fd3-6748-fc6fbed1d4bd';
        let testContextCalled = false; 

        mockSpec = {
            title: 'spec title'
        };

        const specTitle = 'spec title';
        const specMethod = () => {
            assert.equal(TestContext.getCurrentTestName(), mockSpec.title);
            assert.equal(TestContext.getCurrentTestIdentifier(), id);
            testContextCalled = true;
        };
        
        assert.equal(mockSpec, it(specTitle, specMethod));

        specMethod();
        assert.equal(testContextCalled, true);
    });

    IT('getCurrentTestName/getCurrentTestIdentifier will return test name and identifier and override "it" for jest and jasmine', () => {
        const id = 'e65ef7c5-5ed4-4a77-8e9d-f58b5ddf2451';
        let testContextCalled = false;

        mockSpec = {
            description: 'spec title',
            id: 'spec id'
        };

        const specTitle = 'spec title';
        const specMethod = () => {
            assert.equal(TestContext.getCurrentTestName(), mockSpec.description);
            assert.equal(TestContext.getCurrentTestIdentifier(), id);
            testContextCalled = true;
        };
        
        assert.equal(mockSpec, it(specTitle, specMethod));

        specMethod();
        assert.equal(testContextCalled, true);
    });

    IT('getCurrentTestName/getCurrentTestIdentifier will throw for nested functions with default nested depth of 0', () => {
        let testContextCalled = false;

        mockSpec = {
            description: 'spec title',
            id: 'spec id'
        };

        const specTitle = 'spec title';
        
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
        
        assert.equal(mockSpec, it(specTitle, specMethod));
        specMethod();
        assert.equal(testContextCalled, true);        
    });

    IT('getCurrentTestName/getCurrentTestIdentifier will not throw for nested functions if appropriate callerMatchDepth set', () => {
        // tslint:disable
        const id = 'e65ef7c5-5ed4-4a77-8e9d-f58b5ddf2451';
        let testContextCalled = false;

        mockSpec = {
            description: 'spec title',
            id: 'spec id'
        };

        const specTitle = 'spec title';
        
        const nestedMethod = () => {
            assert.equal(TestContext.getCurrentTestName(), mockSpec.description);
            assert.equal(TestContext.getCurrentTestIdentifier(), id);
            testContextCalled = true;
        }

        const specMethod = () => {
            nestedMethod();
        };

        TestContext.updateOptions({
            callerMatchDepth: 1
        });
        
        assert.equal(mockSpec, it(specTitle, specMethod));
        specMethod();
        assert.equal(testContextCalled, true);        
    });
    
});