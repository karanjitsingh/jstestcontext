import {} from '../../src/Constants';
import * as assert from 'assert';

describe('String.format Tests', () => {
    it('Bad template returns same string', () => {
        const template1 = 'template {} {asdf}';
        const template2 = 'template { asdf';
        const template3 = 'template } asdf';
        const template4 = 'template asdf';
        assert.equal(String.format(template1, 1, 2, 3), template1);
        assert.equal(String.format(template2, 1, 2, 3), template2);
        assert.equal(String.format(template3, 1, 2, 3), template3);
        assert.equal(String.format(template4, 1, 2, 3), template4);
    });

    it('Replace patterns correctly', () => {
        const template = 'template {0} {1} template';
        assert.equal(String.format(template, 'a', 'b', 'c'), 'template a b template');
        assert.equal(String.format(template, 'a', 'b'), 'template a b template');
        assert.equal(String.format(template, 'a'), 'template a  template');
    });
    
    it('Will work if param is same as pattern', () => {
        const template = 'template {0} {1} template';
        assert.equal(String.format(template, '{0}', '{1}'), template);
    });
});