
import { global_env, _eval, schemestr } from '../src/core.js';
import { parse } from '../src/parse.js'

const inputDom = document.getElementById('input');
const outputDom = document.getElementById('output');
const frontDom = document.getElementById('front');

function gotoBottom(element) {
    element.scrollTop = element.scrollHeight - element.clientHeight;
}


let temp_lazy_print = '';

global_env.scope.print = (...args) => {
    temp_lazy_print += args.map(String).join(' ') + '<br>'
}

const keyPressed = {};
let temp_input = '';

inputDom.addEventListener('keydown', (e) => {
    keyPressed[e.key] = true;


    function writeInConsole(datas) {
        AddToOutput(frontDom.innerHTML + ' ' + inputDom.value + '<br>');
        AddToOutput(temp_lazy_print);
        for (const data of datas) {
            AddToOutput(data + '<br>');
        }
        inputDom.value = '';
        temp_lazy_print = '';
    }

    function AddToOutput(text) {
        outputDom.innerHTML += text.replace(/\s/gi, '&nbsp;');
    }

    if (keyPressed['Shift'] && keyPressed['Enter']) {
        temp_input += inputDom.value + '\n';

        AddToOutput(frontDom.innerHTML + ' ' + inputDom.value + '<br>');

        frontDom.innerHTML = '..';
        inputDom.value = '';
    }
    else if (keyPressed['Enter']) {
        try {
            var val = parse(temp_input + inputDom.value).map(e => _eval(e));
        }
        catch (e) {
            writeInConsole([e]);
            console.error(e);
        }


        writeInConsole(val.map(schemestr));

        gotoBottom(outputDom);
        frontDom.innerHTML = '>>';
        temp_input = '';
    }
});


inputDom.addEventListener('keyup', (event) => {
    keyPressed[event.key] = false;
});


globalThis.debug = {
    global_env,
    keyPressed
}
// textarea
var heightLimit = 200; /* Maximum height: 200px */

inputDom.oninput = function () {
    inputDom.style.height = ""; /* Reset the height*/
    inputDom.style.height = Math.min(inputDom.scrollHeight - 3, heightLimit) + "px";
};