
export function tokenize(chars) {
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
            
            case '\n':
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
