const { test, expect } = require("@jest/globals");
import { _Symbol } from '../../src/core';
import { parse } from '../../src/parse';


test('number', () => {
    expect(parse(`1`)).toStrictEqual([1])
})

test('string', () => {
    expect(parse(`"hello world"`)).toStrictEqual([`hello world`])
})

test('test 1 + 2', () => {
    expect(parse(`(+ 1 2)`)).toStrictEqual([[new _Symbol('+'), 1, 2]])
})

test('add string', () => {
    expect(parse(`(+ "hello" "world !")`)).toStrictEqual([[new _Symbol('+'), `hello`, `world !`]])
})
