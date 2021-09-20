const { test, expect } = require("@jest/globals");
import { _Symbol, _eval } from '../../src/core';
import { parse } from '../../src/parse';

const parse_eval = p => parse(p).map(e=>_eval(e)).slice(-1)[0];

test('number atom 1', () => {
    expect(parse_eval(`12`)).toBe(12)
})

test('string atom 1', () => {
    expect(parse_eval(`"hello world"`)).toBe(String('hello world'))
})

test('string atom 2', () => {
    expect(parse_eval(`"\\""`)).toBe(String(`\\"`))
})

test('1 + 1', () => {
    expect(parse_eval(`(+ 1 1)`)).toBe(2)
})

test('hell o world', () => {
    expect(parse_eval(`(+ "hell" "o" "world")`)).toBe("helloworld")
})

test('sigmoid', () => {
    expect(parse_eval(
        `(define sigmoid (lambda (x)
           (/ 1 (+ 1 ((. Math pow) (. Math E) (- x))))))
        
        (sigmoid 0)`
    )).toBe(0.5);
})

test('factorial (recursive)', () => {
    parse_eval(
        `(define factorial (lambda (x)
            (if (> x 1)
                (* x (factorial (- x 1)))
                1)))`
    )

    expect(parse_eval(`(factorial 1)`)).toBe(1)
    expect(parse_eval(`(factorial 2)`)).toBe(2)
    expect(parse_eval(`(factorial 3)`)).toBe(6)
    expect(parse_eval(`(factorial 4)`)).toBe(24)
    expect(parse_eval(`(factorial 5)`)).toBe(120)
})

test('js Map', () => {
    parse_eval(`(define a (new Map))`)
    expect(parse_eval(`((. a get) "10")`)).toBe(undefined)
    expect(parse_eval(`((. a set) "10" "value")`)).toBe(parse_eval(`a`))
    expect(parse_eval(`((. a get) "10")`)).toBe("value")
})