import { _Symbol } from './core';
import { tokenize } from './tokenizer';


export function read_from_token(tokens) {
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
