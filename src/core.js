import { tokenize } from './tokenizer';
import { parse } from './parse';

export class _Symbol {
    
    name;

    constructor(name) {
        this.name = name;
    }
}

export class Env {
    outer;
    scope;

    constructor(params=[], args=[], outer=null) {
        this.scope = {
            ...this.scope, 
            ...params.reduce((acc, e, i) => ({...acc, [e.name]: args[i]}), {}),
        };
        this.outer = outer;
    }

    find(name) {
        if(this.scope[name] !== undefined)
            return this.scope;
        else
            return this.outer.find(name);
    }
}


function Procedure(params, body, env) {

    const createdFunc = function(...args) {
        return _eval(body, new Env(params, args, env));
    };
    createdFunc.toString = () => (
        `[Procedure (${params.map(e=>e?.name)})]`
    );
    
    return createdFunc;
}


function isSymbol(s) {
    return s instanceof _Symbol;
}

function isString(s) {
    return typeof(s) === 'string' || s instanceof String;
}

function isNumber(n) {
    return typeof(n) === 'number' || n instanceof Number;
}


function standard_env() {
    const env = new Env();
    env.scope = {
        '+'         : (...xs) => xs.reduce((acc, e) => acc+e),
        '-'         : (x1, x2) => x1 - x2,
        '*'         : (x1, x2) => x1 * x2,
        '/'         : (x1, x2) => x1 / x2,
        '>'         : (x1, x2) => x1 > x2,
        '<'         : (x1, x2) => x1 < x2,
        '>='        : (x1, x2) => x1 >= x2,
        '<='        : (x1, x2) => x1 <= x2,
        '='         : (x1, x2) => x1 == x2,
        'append'    : (xs1, xs2) => xs1.concat(xs2),
        'apply'     : (xs, f) => f(...xs),
        'begin'     : (...args) => args.slice(-1)[0],
        'car'       : xs => xs[0],
        'cdr'       : xs => xs.slice(1),
        'cons'      : (x, xs) => [x].concat(xs),
        'eq?'       : (x1, x2) => JSON.stringify(x1) === JSON.stringify(x2),
        'expt'      : Math.pow,
        'equal?'    : (x1, x2) => x1 === x2,
        'length'    : xs => xs.length,
        'list'      : (...args) => args,
        'list?'     : x => x instanceof Array,
        'map'       : (f, xs) => xs.map(f),
        'max'       : (...args) => args.length === 1
                                ? Math.max(...args[0])
                                : Math.max(...args),
        'min'       : (...args) => args.length === 1
                                ? Math.min(...args[0])
                                : Math.min(...args),
        'not'       : x => !x,
        'null'      : x => x instanceof Array ? x.length < 1 : false,
        'number?'   : isNumber,
        'print'     : console.log,
        'produre?'  : x => x instanceof Function,
        'round'     : Math.round,
        'symbol?'   : isSymbol,
        'string?'   : isString,
    };
    return env;
}


export function _eval(x, env=global_env) {
    if (isSymbol(x))
        return env.find(x.name)[x.name];
    if (isNumber(x) || isString(x))
        return x;
    const [op, ...args] = x;
    switch(op?.name) {
        case 'quote':
            return args[0];
        case 'if':
            var [test, conseq, alt] = args;
            var exp = _eval(test, env) ? conseq : alt;
            return _eval(exp, env);
        case 'define':
            var [symbol, exp] = args;
            env.scope[symbol.name] = _eval(exp, env);
            return env.scope[symbol.name];
        case 'set!':
            var [symbol, exp] = args;
            env.find(symbol.name)[symbol.name] = _eval(exp, env);
            break;
        case 'lambda':
            var [params, body] = args;
            return Procedure(params, body, env);
        default:
            var proc = _eval(x[0], env);
            var execArgs = args.map(arg => _eval(arg, env));
            return proc(...execArgs);
    }
}


export function schemestr(exp) {
    if(isString(exp))
        return `"${exp}"`
    if(exp instanceof Array)
        return '(' + exp.map(schemestr).join(' ') + ')'
    else
        return String(exp)
}


const math_env = new Env();
math_env.scope = Math;
export const global_env = standard_env();
global_env.outer = math_env;