import {
    Macro,
    Procedure,
    isString,
    isSymbol,
    isValue,
    quote,
    unQuote
} from './datatypes.js';
import {
    standard_env
} from './std.js'


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


export function _eval(x, env = global_env) {
    if (isSymbol(x))
        return env.find(x.name)[x.name];
    if (isValue(x)) // Quoted, Number, String, ...
        return x;
    const [op, ...args] = x;
    switch (op?.name) {
        case 'quote': {
            return quote(args[0]);
        }
        case 'if': {
            const [test, conseq, alt] = args;
            const exp = _eval(test, env) ? conseq : alt;
            return _eval(exp, env);
        }
        case 'define': {
            const [symbol, exp] = args;
            env.scope[symbol.name] = _eval(exp, env);
            return env.scope[symbol.name];
        }
        case 'set!': {
            const [symbol, exp] = args;
            env.find(symbol.name)[symbol.name] = _eval(exp, env);
            break;
        }
        case 'lambda': {
            const [params, ...bodys] = args;
            return Procedure(params, bodys, env);
        }
        case 'macro': {
            const [params, ...bodys] = args;
            return Macro(params, bodys, env);
        }
        case '.': {
            return args.slice(1)
                .reduce((acc, e) => (
                    acc[e.name] instanceof Function
                        ? acc[e.name].bind(acc)
                        : acc[e.name]
                ), _eval(args[0], env));
        }
        default: {
            const proc = _eval(x[0], env);
            if (proc?.isMacro) {
                const execArgs = args.map(arg => quote(arg));
                return _eval(unQuote(proc(...execArgs)));
            }
            else {
                const execArgs = args.map(arg => _eval(arg, env));
                return proc(...execArgs);
            }
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