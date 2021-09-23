import { _Symbol } from './core.js';
import { tokenize } from './tokenizer.js';


export function read_from_token(tokens) {
    const parsed = [];
    
    function parse_one() {
        const token = tokens.shift();
    
        switch(token) {
            case undefined: {
                throw SyntaxError("uncomplete input");
            }
            case '(': {
                const sub_tkn = []
                while (tokens[0] !== ')')
                    sub_tkn.push(parse_one(tokens))
                tokens.shift(); // remove ')'
                return sub_tkn;
            }
            case ')': {
                throw SyntaxError('unexpected )');
            }   
            default: {
                return atom(token);
            }
                
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

export function atom(token) {
    const ftoken = parseFloat(token);
    if(!isNaN(ftoken))
        return ftoken
    if(isStingAtom(token))
        return String(token.slice(1, -1))
    else
        return new _Symbol(token)
}


export function parse(program) {
    return read_from_token(tokenize(program))
}


