
import { global_env, _eval, schemestr } from '../src/core';
import { parse } from '../src/parse'

const inputDom = document.querySelector('#input');
const outputDom = document.querySelector('#output');


function gotoBottom(element) {
    element.scrollTop = element.scrollHeight - element.clientHeight;
}


let temp_lazy_print = '';

global_env.scope.print = (...args) => {
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
            var val = parse(inputDom.value).map(e => _eval(e));
            console.log(val);
        }
        catch (e) {
            writeInConsole([e]);
            console.error(e);
        }


        writeInConsole(val.map(schemestr));

        gotoBottom(outputDom);
    }
});


globalThis.debug = {
    global_env
}