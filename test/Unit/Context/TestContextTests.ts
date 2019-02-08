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

// Describe sets "it" back to the original test function
const modifiedIt = it;

describe('TestContext Suite', () => {

    beforeEach(() => {
        // Restore overridden it
        it = modifiedIt;
    });

    IT('getCurrentTestName/getCurrentTestIdentifier will return test name and identifier and override "it" for mocha', () => {
        const id = 'ecb9e5f6-dd8c-8fd3-6748-fc6fbed1d4bd';

        mockSpec = {
            title: 'spec title'
        };

        const specTitle = 'spec title';
        const specMethod = () => {
            assert.equal(TestContext.getCurrentTestName(), mockSpec.title);
            assert.equal(TestContext.getCurrentTestIdentifier(), id);
        };
        
        assert.equal(mockSpec, it(specTitle, specMethod));

        specMethod();
    });

    IT('getCurrentTestName/getCurrentTestIdentifier will return test name and identifier and override "it" for jest and jasmine', () => {
        const id = 'e65ef7c5-5ed4-4a77-8e9d-f58b5ddf2451';

        mockSpec = {
            description: 'spec title',
            id: 'spec id'
        };

        const specTitle = 'spec title';
        const specMethod = () => {
            assert.equal(TestContext.getCurrentTestName(), mockSpec.description);
            assert.equal(TestContext.getCurrentTestIdentifier(), id);
        };
        
        assert.equal(mockSpec, it(specTitle, specMethod));
        specMethod();
    });
    
});