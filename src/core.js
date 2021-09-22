
export class _Symbol {
    constructor(name) {
        this.name = name;
    }
    toString() {
        return this.name;
    }
}

export class Env {
    constructor(params = [], args = [], outer = null) {
        this.scope = {
            ...this.scope,
            ...params.reduce((acc, e, i) => ({ ...acc, [e.name]: args[i] }), {}),
        };
        this.outer = outer;
    }

    find(name) {
        if (this.scope[name] !== undefined)
            return this.scope;
        if (!this.outer)
            throw SyntaxError(`cannot find symbol ${name}`);
        else
            return this.outer.find(name);
    }
}


function Procedure(params, bodys, env) {

    const createdFunc = function (...args) {
        const createdEnv = new Env(params, args, env);
        createdEnv.scope.arguments = arguments;

        return bodys.reduce((_, e) => _eval(e, createdEnv), undefined);
    };
    createdFunc.toString = () => (
        `[Procedure (${params.map(e => e?.name)})]`
    );

    return createdFunc;
}


function Macro(params, bodys, env) {

    const createdMacro = function (...args) {
        const createdEnv = new Env(params, args, env);
        createdEnv.scope.arguments = arguments;

        return bodys.reduce((_, e) => _eval(e, createdEnv), undefined);
    }
    createdMacro.toString = () => (
        `[Macro (${params.map(e => e?.name)})]`
    );
    createdMacro.isMacro = true;

    return createdMacro;
}


class List extends Array {
    toString() {
        return schemestr(this);
    }
}

function unQuote(x) {
    return [...x];
}


function isSymbol(s) {
    return s instanceof _Symbol;
}

function isString(s) {
    return typeof (s) === 'string' || s instanceof String;
}

function isNumber(n) {
    return typeof (n) === 'number' || n instanceof Number;
}

/**
 * value means not AST
 * likes Number, String, List...
 */
function isValue(x) {
    // Array means AST.
    return (
        (x instanceof List) ||
        !(x instanceof Array)
    );
}


function standard_env() {
    const env = new Env();
    env.scope = {
        '+'         : (...xs) => xs.reduce((acc, e) => acc + e),
        '-'         : (...xs) => xs.length === 1
                                 ? -xs[0]
                                 :xs.reduce((acc, e) => acc - e),
        '*'         : (...xs) => xs.reduce((acc, e) => acc * e),
        '/'         : (...xs) => xs.reduce((acc, e) => acc / e),
        '>'         : (...xs) => xs.slice(1).reduce((acc, e, i) => acc && xs[i] > e, true),
        '<'         : (...xs) => xs.slice(1).reduce((acc, e, i) => acc && xs[i] < e, true),
        '>='        : (...xs) => xs.slice(1).reduce((acc, e, i) => acc && xs[i] >= e, true),
        '<='        : (...xs) => xs.slice(1).reduce((acc, e, i) => acc && xs[i] <= e, true),
        '='         : (...xs) => xs.slice(1).reduce((acc, e, i) => acc && xs[i] == e, true),
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
        'list'      : (...args) => new List(...args),
        'list?'     : x => x instanceof List,
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
        'Math'      : Math,
        'new'       : arg => new arg,
        'eval'      : x => _eval(unQuote(x)),
        'typeof'     : x => typeof x,
    };
    
    for (let key in env.scope) {
        let e = env.scope[key];
        if (e instanceof Function)
            e.toString = () => `[NativeProcedure (...)]`
    }
    return env;
}


export function _eval(x, env = global_env) {
    if (isSymbol(x))
        return env.find(x.name)[x.name];
    if (isValue(x)) // Quoted, Number, String, ...
        return x;
    const [op, ...args] = x;
    switch (op?.name) {
        case 'quote':
            return new List(...args[0]);
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
            var [params, ...bodys] = args;
            return Procedure(params, bodys, env);
        case 'macro':
            var [params, ...bodys] = args;
            return Macro(params, bodys, env);
        case '.':
            return args.slice(1)
                .reduce((acc, e) => (
                    acc[e.name] instanceof Function
                        ? acc[e.name].bind(acc)
                        : acc[e.name]
                ), _eval(args[0], env));
        default:
            var proc = _eval(x[0], env);
            if (proc?.isMacro) {
                const execArgs = args.map(arg => new List(...arg));
                return _eval(unQuote(proc(...execArgs)));
            }
            else {
                const execArgs = args.map(arg => _eval(arg, env));
                return proc(...execArgs);
            }
    }
}


export function schemestr(exp) {
    if (isSymbol(exp))
        return exp.name;
    if (isString(exp))
        return `"${exp}"`;
    if (exp instanceof Array)
        return '(' + exp.map(schemestr).join(' ') + ')';
    else
        return String(exp);
}


const js_env = new Env();
js_env.scope = globalThis;
const math_env = new Env();
math_env.scope = Math;
math_env.outer = js_env;
export const global_env = standard_env();
global_env.outer = math_env;