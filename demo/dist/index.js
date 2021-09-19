/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "_Symbol": () => (/* binding */ _Symbol),
/* harmony export */   "Env": () => (/* binding */ Env),
/* harmony export */   "_eval": () => (/* binding */ _eval),
/* harmony export */   "schemestr": () => (/* binding */ schemestr),
/* harmony export */   "global_env": () => (/* binding */ global_env)
/* harmony export */ });

class _Symbol {
    constructor(name) {
        this.name = name;
    }
}

class Env {
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
        else
            return this.outer.find(name);
    }
}


function Procedure(params, body, env) {

    const createdFunc = function (...args) {
        return _eval(body, new Env(params, args, env));
    };
    createdFunc.toString = () => (
        `[Procedure (${params.map(e => e?.name)})]`
    );

    return createdFunc;
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


function standard_env() {
    const env = new Env();
    env.scope = {
        '+'         : (...xs) => xs.reduce((acc, e) => acc + e),
        '-'         : (...xs) => xs.length === 1
                                 ? -xs[0]
                                 :xs.reduce((acc, e) => acc - e),
        '*'         : (...xs) => xs.reduce((acc, e) => acc * e),
        '/'         : (...xs) => xs.reduce((acc, e) => acc / e),
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


function _eval(x, env = global_env) {
    if (isSymbol(x))
        return env.find(x.name)[x.name];
    if (isNumber(x) || isString(x))
        return x;
    const [op, ...args] = x;
    switch (op?.name) {
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


function schemestr(exp) {
    if (isString(exp))
        return `"${exp}"`
    if (exp instanceof Array)
        return '(' + exp.map(schemestr).join(' ') + ')'
    else
        return String(exp)
}


const math_env = new Env();
math_env.scope = Math;
const global_env = standard_env();
global_env.outer = math_env;

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "read_from_token": () => (/* binding */ read_from_token),
/* harmony export */   "atom": () => (/* binding */ atom),
/* harmony export */   "parse": () => (/* binding */ parse)
/* harmony export */ });
/* harmony import */ var _core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _tokenizer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);




function read_from_token(tokens) {
    const parsed = [];
    
    function parse_one() {
        const token = tokens.shift();
    
        switch(token) {
            case '(':
                const sub_tkn = []
                while (tokens[0] !== ')')
                    sub_tkn.push(parse_one(tokens))
                tokens.shift(); // remove ')'
                return sub_tkn;
            
            case ')':
                console.log(parsed, token, tokens)
                throw SyntaxError('unexpected )');
                
            default:
                return atom(token);
                
        }
    }

    while (tokens.length > 0) {
        parsed.push(parse_one());
    }

    return parsed;
}


function isStingAtom(token) {
    return (
        token.length >= 2 &&
        token[0] == '"' &&
        token[token.length-1] == '"'
    )
}

function atom(token) {
    const ftoken = parseFloat(token);
    if(!isNaN(ftoken))
        return ftoken
    if(isStingAtom(token))
        return String(token.slice(1, -1))
    else
        return new _core__WEBPACK_IMPORTED_MODULE_0__._Symbol(token)
}


function parse(program) {
    return read_from_token((0,_tokenizer__WEBPACK_IMPORTED_MODULE_1__.tokenize)(program))
}


// console.log(parse(`(+ 10 20)(+ 30 40)`))

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "tokenize": () => (/* binding */ tokenize)
/* harmony export */ });

function tokenize(chars) {
    const tokens = [];

    let acc = '';

    function clearAcc() {
        acc = '';
    }

    function saveAcc() {
        if(acc !== '') {
            tokens.push(acc)
        }
    }

    function shouldBeEmptyAcc(errorMessage = "no space") {
        if(acc !== '') {
            throw SyntaxError(errorMessage)
        }
    }

    for(let i = 0; i < chars.length; i++) {
        const e = chars[i];

        switch (e) {
            case '(':
                saveAcc();
                tokens.push(e);
                clearAcc();
                break;

            case ')':
                saveAcc();
                tokens.push(e);
                clearAcc();
                break;

            case '"':
                shouldBeEmptyAcc('nospace' + acc);
                
                let inner_str = '"';
                
                for(i += 1; i < chars.length; i++) {
                    const before = chars[i-1];
                    const cur = chars[i];
                    
                    inner_str += cur;

                    if(cur === '"' && before !== '\\')
                        break;
                }

                tokens.push(inner_str);
                break;

            case ' ':
                saveAcc();
                clearAcc();
                break;

            default:
                acc += e;
        }
    }

    saveAcc();

    return tokens;
    
}


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _src_parse__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);




const inputDom = document.querySelector('#input');
const outputDom = document.querySelector('#output');


function gotoBottom(element) {
    element.scrollTop = element.scrollHeight - element.clientHeight;
}


let temp_lazy_print = '';

_src_core__WEBPACK_IMPORTED_MODULE_0__.global_env.scope.print = (...args) => {
    temp_lazy_print += args.map(String).join(' ') + '<br>'
}

inputDom.addEventListener('keypress', (e) => {
    function writeInConsole(datas) {
        outputDom.innerHTML += '>> ' + inputDom.value + '<br>';
        outputDom.innerHTML += temp_lazy_print;
        for (const data of datas) {
            console.log(data);
            outputDom.innerHTML += data + '<br>';
        }
        inputDom.value = '';
        temp_lazy_print = '';
    }

    if (e.code === 'Enter') {
        try {
            var val = (0,_src_parse__WEBPACK_IMPORTED_MODULE_1__.parse)(inputDom.value).map(e => (0,_src_core__WEBPACK_IMPORTED_MODULE_0__._eval)(e));
            console.log(val);
        }
        catch (e) {
            writeInConsole([e]);
            console.error(e);
        }


        writeInConsole(val.map(_src_core__WEBPACK_IMPORTED_MODULE_0__.schemestr));

        gotoBottom(outputDom);
    }
});


globalThis.debug = {
    global_env: _src_core__WEBPACK_IMPORTED_MODULE_0__.global_env
}
})();

/******/ })()
;