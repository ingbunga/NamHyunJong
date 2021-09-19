const { test, expect } = require("@jest/globals");
import { _Symbol } from '../../src/core';
import { atom } from '../../src/parse';


test('number atom 1', () => {
    expect(atom(`12`)).toBe(12);
})

test('symbol atom 1', () => {
    expect(atom(`+`)).toStrictEqual(new _Symbol(`+`))
})

test('string atom 1', () => {
    expect(atom(`"hello world"`)).toBe(String('hello world'))
})

test('string atom 2', () => {
    expect(atom(`"\\""`)).toBe(String(`\\"`))
})