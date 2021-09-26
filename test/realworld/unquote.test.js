const { test, expect } = require("@jest/globals");
import { global_env, _eval } from '../../src/core';
import { 
    QuotedSymbol,  
    List,
    _Symbol,
} from '../../src/datatypes';
import { parse } from '../../src/parse';

const parse_eval = p => parse(p).map(e=>_eval(e)).slice(-1)[0];


test('unquote symbol', () => {
    expect(parse_eval(`(unquote (quote x))`))
        .toStrictEqual(new _Symbol('x'));
})

test('unquote List', () => {
    expect(parse_eval(`(unquote (quote (+ 1 2)))`))
        .toStrictEqual([new _Symbol('+'), 1, 2]);
})
