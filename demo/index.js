
import { global_env, _eval, schemestr } from '../src/core.js';
import { parse } from '../src/parse.js'

const inputDom = document.getElementById('input');
const outputDom = document.getElementById('output');
const frontDom = document.getElementById('front');

global_env.scope.print = (...args) => {
    AddToOutput(args.map(String).join(' ') + '<br>');
}

function AddToOutput(text) {
    outputDom.innerHTML += text.replace(/\s/gi, '&nbsp;');
}

const keyPressed = {};
let multiline_acc = '';

inputDom.addEventListener('keydown', (e) => {
    keyPressed[e.key] = true;

    function writeInput() {
        AddToOutput(frontDom.innerHTML + ' ' + inputDom.value + '<br>');
    }

    function writeInConsole(datas) {
        for (const data of datas) {
            AddToOutput(data + '<br>');
        }
        inputDom.value = '';
    }

    if (keyPressed['Shift'] && keyPressed['Enter']) {
        multiline_acc += inputDom.value + '\n';

        writeInput();

        frontDom.innerHTML = '..';
        inputDom.value = '';
    }
    else if (keyPressed['Enter']) {
        writeInput();
        try {
            var val = parse(multiline_acc + inputDom.value).map(e => _eval(e));
            
            writeInConsole(val.map(schemestr));
        }
        catch (e) {
            writeInConsole([e]);
            console.error(e);
        }
        finally {
            gotoBottom(outputDom);
            
            frontDom.innerHTML = '>>';
            multiline_acc = '';
        }
    }
});


inputDom.addEventListener('keyup', (event) => {
    keyPressed[event.key] = false;
});


globalThis.debug = {
    global_env,
    keyPressed
}

function gotoBottom(element) {
    element.scrollTop = element.scrollHeight - element.clientHeight;
}
