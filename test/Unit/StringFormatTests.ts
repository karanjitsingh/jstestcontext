import {} from '../../src/Constants';
import * as assert from 'assert';

describe('String.format Tests', () => {
    it('Bad template returns same string', () => {
        const template = 'template {} {asdf}';
        assert.equal(String.format(template, 1, 2, 3), template);
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