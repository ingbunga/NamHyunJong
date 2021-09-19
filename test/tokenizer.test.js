const { test, expect } = require("@jest/globals");
import { tokenize } from '../src/tokenizer';

test('number', () => {
    expect(tokenize(`1`)).toStrictEqual(['1'])
})

test('string', () => {
    expect(tokenize(`"hello world"`)).toStrictEqual([`"hello world"`])
})

test('test 1 + 2', () => {
    expect(tokenize(`(+ 1 2)`)).toStrictEqual(['(', '+', '1', '2', ')'])
})

test('add string', () => {
    expect(tokenize(`(+ "hello" "world !")`)).toStrictEqual([`(`, `+`, `"hello"`, `"world !"`, `)`])
})


