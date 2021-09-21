const { test, expect } = require("@jest/globals");
import { _Symbol, _eval, global_env } from '../../src/core';
import { parse } from '../../src/parse';

const parse_eval = p => parse(p).map(e=>_eval(e)).slice(-1)[0];

test('unless macro', () => {
    parse_eval(
        `
        (define unless (macro (test then else)
            (if (eval test)
                else
                then)))
        
        (define true-cause (lambda ()
            (print "true-cause")
            1))

        (define false-cause (lambda ()
            (print "false-cause")
            0))
        `
    )
    
    let acc = '';
    global_env.scope.print = (...args) => {acc += args.map(String).join(' ') + '\n'}
    
    expect(parse_eval(`(unless 1 (true-cause) (false-cause))`)).toBe(0);
    expect(acc).toBe('false-cause\n');

    acc = '';

    expect(parse_eval(`(unless 0 (true-cause) (false-cause))`)).toBe(1);
    expect(acc).toBe('true-cause\n');
})