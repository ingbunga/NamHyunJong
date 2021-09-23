import {
    Env,
    _eval,
    schemestr,
} from './core.js'


export class _Symbol {
    constructor(name) {
        this.name = name;
    }
    toString() {
        return this.name;
    }
}


export function Procedure(params, bodys, env) {

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


export function Macro(params, bodys, env) {

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


export class List extends Array {
    toString() {
        return schemestr(this);
    }
}


export class QuotedSymbol extends _Symbol{

}


export function quote(x) {
    if (isValue(x)) {
        return x;
    }
    else if (x instanceof _Symbol) {
        return new QuotedSymbol(x.name);
    }
    else if (x instanceof Array) {
        return new List(...x);
    }
}


export function unQuote(x) {
    if (x instanceof List) {
        return [...x];
    }
    else if (x instanceof QuotedSymbol) {
        return new _Symbol(x.name);
    }
    else {
        return x;
    }
}


export function isSymbol(s) {
    return s instanceof _Symbol;
}

export function isString(s) {
    return typeof (s) === 'string' || s instanceof String;
}

export function isNumber(n) {
    return typeof (n) === 'number' || n instanceof Number;
}

/**
 * value means not AST
 * likes Number, String, List...
 */
export function isValue(x) {
    // Array means AST.
    return (
        (x instanceof List) ||
        (x instanceof QuotedSymbol) ||
        !(x instanceof Array) &&
        !(x instanceof _Symbol)
    );
}