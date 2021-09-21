const { test, expect } = require("@jest/globals");
import { _Symbol, _eval } from '../../src/core';
import { parse } from '../../src/parse';

const parse_eval = p => parse(p).map(e=>_eval(e)).slice(-1)[0];

test('number atom 1', () => {
    expect(parse_eval(`12;dsaasdfasdfsdf`)).toBe(12)
})

test('string atom 1', () => {
    expect(parse_eval(`"hello world";dsaasdfasdfsdf`)).toBe(String('hello world'))
})

test('string atom 2', () => {
    expect(parse_eval(`"\\"";dsaasdfasdfsdf`)).toBe(String(`\\"`))
})

test('1 + 1', () => {
    expect(parse_eval(`(+ 1 1);dsaasdfasdfsdf`)).toBe(2)
})

test('hell o world', () => {
    expect(parse_eval(`(+ "hell" "o" "world");dsaasdfasdfsdf`)).toBe("helloworld")
})

test('sigmoid', () => {
    expect(parse_eval(
        `(define sigmoid (lambda (x);;dsaasdfasdfsdf
           (/ 1 (+ 1 ((. Math pow) (. Math E) (- x))))));;dsaasdfasdfsdf
        
        (sigmoid 0);dsaasdfasdfsdf`
    )).toBe(0.5);
})

test('factorial (recursive)', () => {
    parse_eval(
        `(define factorial (lambda (x)      ;extremlyrandomcommentdsfalkjdsklajf89ewjaojasdkljflksadkjdfkljsalfjds
            (if (> x 1);extremlyrandomcommentdsfalkjdsklajf89ewjaojasdkljflksadkjdfkljsalfjds
                (* x (factorial (- x 1)));extremlyrandomcommentdsfalkjdsklajf89ewjaojasdkljflksadkjdfkljsalfjds
                1)));extremlyrandomcommentdsfalkjdsklajf89ewjaojasdkljflksadkjdfkljsalfjds`
    )

    expect(parse_eval(`(factorial 1);dsaasdfasdfsdf`)).toBe(1)
    expect(parse_eval(`(factorial 2);dsaasdfasdfsdf`)).toBe(2)
    expect(parse_eval(`(factorial 3);dsaasdfasdfsdf`)).toBe(6)
    expect(parse_eval(`(factorial 4);dsaasdfasdfsdf`)).toBe(24)
    expect(parse_eval(`(factorial 5);dsaasdfasdfsdf`)).toBe(120)
})

test('js Map', () => {
    parse_eval(`(define a (new Map));dsaasdfasdfsdf`)
    expect(parse_eval(`((. a get) "10");dsaasdfasdfsdf`)).toBe(undefined)
    expect(parse_eval(`((. a set) "10" "value");dsaasdfasdfsdf`)).toBe(parse_eval(`a`))
    expect(parse_eval(`((. a get) "10");dsaasdfasdfsdf`)).toBe("value")
})