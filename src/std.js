import {
    Env,
    _eval,
} from './core.js';
import {
    List,
    QuotedSymbol,
    isNumber,
    isString,
    unQuote
} from './datatypes.js';


export function standard_env() {
    const env = new Env();

    const values = {
        'null'          : null,
        'true'          : true,
        'false'         : false,  
    };

    const procedures = {
        '+'             : (...xs) => xs.reduce((acc, e) => acc + e),
        '-'             : (...xs) => xs.length === 1
                                     ? -xs[0]
                                     :xs.reduce((acc, e) => acc - e),
        '*'             : (...xs) => xs.reduce((acc, e) => acc * e),
        '/'             : (...xs) => xs.reduce((acc, e) => acc / e),
        '>'             : (...xs) => xs.slice(1).reduce((acc, e, i) => acc && xs[i] > e, true),
        '<'             : (...xs) => xs.slice(1).reduce((acc, e, i) => acc && xs[i] < e, true),
        '>='            : (...xs) => xs.slice(1).reduce((acc, e, i) => acc && xs[i] >= e, true),
        '<='            : (...xs) => xs.slice(1).reduce((acc, e, i) => acc && xs[i] <= e, true),
        '='             : (...xs) => xs.slice(1).reduce((acc, e, i) => acc && xs[i] == e, true),
        'append'        : (xs1, xs2) => xs1.concat(xs2),
        'apply'         : (xs, f) => f(...xs),
        'begin'         : (...args) => args.slice(-1)[0],
        'car'           : xs => xs[0],
        'cdr'           : xs => xs.slice(1),
        'cons'          : (x, xs) => [x].concat(xs),
        'eq?'           : (x1, x2) => JSON.stringify(x1) === JSON.stringify(x2),
        'expt'          : Math.pow,
        'equal?'        : (x1, x2) => x1 === x2,
        'length'        : xs => xs.length,
        'list'          : (...args) => new List(...args),
        'list?'         : x => x instanceof List,
        'map'           : (f, xs) => xs.map(f),
        'max'           : (...args) => args.length === 1
                                       ? Math.max(...args[0])
                                       : Math.max(...args),
        'min'           : (...args) => args.length === 1
                                       ? Math.min(...args[0])
                                       : Math.min(...args),
        'not'           : x => !x,
        'null?'         : x => x === null,
        'number?'       : isNumber,
        'print'         : console.log,
        'produre?'      : x => x instanceof Function,
        'string?'       : isString,
        'new'           : arg => new arg,
        'eval'          : x => _eval(unQuote(x)),
        'typeof'        : x => typeof x,
        'quotedSymbol?' : x => x instanceof QuotedSymbol,
        'unquote'       : unQuote,
    };

    const macros = {
    };


    for (const key in procedures) {
        const value = procedures[key];
        value.toString = () => `[NativeProcedure (...)]`;
    }

    for (const key in macros) {
        const value = macros[key];
        value.isMacro = true;
        value.toString = () => `[NativeMacro (...)]`;
    }

    env.scope = {
        ...values,
        ...procedures,
        ...macros
    };
    
    return env;
}