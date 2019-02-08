// tslint:disable
// Since TestContext it modifies the test function 'it', we'll save it as 'IT'
debugger;
const IT = it;

// The mocking also needs to be done before TestContext is even imported
let mockSpec = {
    id: 'some id'
};
const itMock = <any> (() => {
    return mockSpec;
});

it = itMock;

import { TestContext } from '../../../src';
import * as assert from 'assert';

describe('TestContext Suite', () => {

    beforeEach(() => {
        it = itMock;
    })

    IT('Requiring TestContext will override "it"', () => {
        const specTitle = 'spec title';
        const specMethod = () => { /**/ };

        assert.equal(mockSpec, it(specTitle, specMethod));
    });

    IT('getCurrentTestName will return test name', () => {
        const specTitle = 'spec title';
        const specMethod = () => {
            assert.equal(TestContext.getCurrentTestName(), specTitle);
        };
        
        assert.equal(mockSpec, it(specTitle, specMethod));
        specMethod();
    });
});