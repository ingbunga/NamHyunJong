
const _Symbol = String;

class Env {
    outer;
    scope;

    constructor(params=[], args=[], outer=null) {
        this.scope = {
            ...this.scope, 
            ...params.reduce((acc, e, i) => ({...acc, [e]: args[i]}), {}),
        };
        this.outer = outer;
    }

    find(name) {
        if(this.scope[name] !== undefined)
            return this.scope;
        else
            console.log(name);
            return this.outer.find(name);
    }
}


function Procedure(params, body, env) {

    return function(...args) {
        return _eval(body, new Env(params, args, env));
    }

}


function isSymbol(s) {
    return typeof(s) === 'string' || s instanceof _Symbol;
}


function isNumber(n) {
    return typeof(n) === 'number' || n instanceof Number;
}


function standard_env() {
    const env = new Env();
    env.scope = {
        '+'         : (...xs) => xs.reduce((acc, e) => acc+e, 0),
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
    };
    return env;
}


const math_env = new Env();
math_env.scope = Math;
const global_env = standard_env();
global_env.outer = math_env;


function tokenize(chars) {
    return chars.replace(/\(/gi, ' ( ').replace(/\)/gi, ' ) ').split(' ').filter(e => e !== '');
}


function parse(program) {
    return read_from_token(tokenize(program))
}


function read_from_token(tokens) {
    if (tokens.length === 0)
        throw SyntaxError("unexpected EOF");

    const token = tokens.shift();

    switch(token) {
        case '(':
            const sub_tkn = []
            while (tokens[0] !== ')')
                sub_tkn.push(read_from_token(tokens))
            tokens.shift(); // remove ')'
            return sub_tkn;
        case ')':
            throw SyntaxError('unexpected )');
        default:
            return atom(token);
    }
    
}


function atom(token) {
    const ftoken = parseFloat(token);
    if(isNaN(ftoken))
        return _Symbol(token)
    else
        return ftoken
}


function _eval(x, env=global_env) {
    if (isSymbol(x))
        return env.find(x)[x];
    if (isNumber(x))
        return x;
    const [op, ...args] = x;
    switch(op){
        case 'quote':
            return args[0];
        case 'if':
            var [test, conseq, alt] = args;
            var exp = _eval(test, env) ? conseq : alt;
            return _eval(exp, env);
        case 'define':
            var [symbol, exp] = args;
            env.scope[symbol] = _eval(exp, env);
            return env.scope[symbol];
        case 'set!':
            var [symbol, exp] = args;
            env.find(symbol)[symbol] = _eval(exp, env);
            break;
        case 'lambda':
            var [params, body] = args;
            return Procedure(params, body, env);
        default:
            var proc = _eval(x[0], env);
            var execArgs = x.slice(1).map(arg => _eval(arg, env));
            return proc(...execArgs)
        
    }
}


function schemestr(exp) {
    if(exp instanceof Array)
        return '(' + exp.map(schemestr).join(' ') + ')'
    else
        return str(exp)
}
