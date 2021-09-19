
import { global_env, _eval, schemestr } from '../src/core';
import { parse } from '../src/parse'

const inputDom = document.querySelector('#input');
const outputDom = document.querySelector('#output');


function gotoBottom(element){
    element.scrollTop = element.scrollHeight - element.clientHeight;
}


let temp_lazy_print = '';

global_env.scope.print = (...args) => {
    temp_lazy_print += args.map(String).join(' ') + '<br>'
}

inputDom.addEventListener('keypress', (e)=>{
    function writeInConsole(s) {
        outputDom.innerHTML += '>> ' + inputDom.value + '<br>';
        outputDom.innerHTML += temp_lazy_print;
        outputDom.innerHTML += s + '<br>';
        inputDom.value = '';
        temp_lazy_print = '';
    }

    if(e.code === 'Enter') {
        try {
            var val = _eval(parse(inputDom.value));
            console.log(val);
        }
        catch(e) {
            writeInConsole(e);
            console.error(e);
        }
        if(val !== null) {
            writeInConsole(schemestr(val));
        }
        gotoBottom(outputDom);
    }
});


globalThis.debug = {
    global_env
}