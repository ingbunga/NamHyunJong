const { test, expect } = require("@jest/globals");
import { _eval } from '../../src/core';
import { 
    QuotedSymbol,  
    List,
    _Symbol,
} from '../../src/datatypes';
import { parse } from '../../src/parse';

const parse_eval = p => parse(p).map(e=>_eval(e)).slice(-1)[0];


test('quote number', () => {
    expect(parse_eval(`(quote 10)`)).toBe(10);
})

test('quote number 2', () => {
    expect(parse_eval(`(quote 10.4)`)).toBe(10.4);
})

test('quote string', () => {
    expect(parse_eval(`(quote "hello world")`)).toBe("hello world");
})

test('quoted list', () => {
    expect(parse_eval(`(quote (+ 1 2))`)).toStrictEqual(new List(new _Symbol("+"), 1, 2))
})

test('quoted symbol', () => {
    expect(parse_eval(`(quote a)`)).toStrictEqual(new QuotedSymbol("a"));
})