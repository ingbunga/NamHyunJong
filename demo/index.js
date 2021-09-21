
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

const consoleHistory = {
    list: [''],
    historyPtr: 0,

    maximumListSize: 100,

    addToHistory(txt) {
        this.list.push(txt);
        if (this.list.length > this.maximumListSize)
            this.list.shift();
    },

    setHistoryPtrToLast() {
        this.historyPtr = this.list.length;
    },

    setHistoryPtrToPrev() {
        if (this.historyPtr > 0)
            this.historyPtr--;
        else
            this.historyPtr = 0;
    },

    setHistoryPtrToNext() {
        if (this.historyPtr < this.list.length - 1)
            this.historyPtr++;
        else
            this.historyPtr = this.list.length - 1;
    },

    getHistoryTxt() {
        return this.list[this.historyPtr]
    }
}



inputDom.addEventListener('keydown', (e) => {
    keyPressed[e.key] = true;

    function writeInput() {
        consoleHistory.addToHistory(inputDom.value);
        
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

        consoleHistory.setHistoryPtrToLast();
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

            consoleHistory.setHistoryPtrToLast();
        }
    }
    if (keyPressed['ArrowUp']) {
        consoleHistory.setHistoryPtrToPrev();
        inputDom.value = consoleHistory.getHistoryTxt();
    }
    if (keyPressed['ArrowDown']) {
        consoleHistory.setHistoryPtrToNext();
        inputDom.value = consoleHistory.getHistoryTxt();
    }
});


inputDom.addEventListener('keyup', (event) => {
    keyPressed[event.key] = false;
});


inputDom.addEventListener('paste', (event) => {
    let text = (event.clipboardData || window.clipboardData).getData('text');
    event.preventDefault();

    function pressEnter() {
        inputDom.dispatchEvent(new KeyboardEvent('keydown',{'key':'Shift'}));
        inputDom.dispatchEvent(new KeyboardEvent('keydown',{'key':'Enter'}));
        inputDom.dispatchEvent(new KeyboardEvent('keyup',{'key':'Shift'}));
        inputDom.dispatchEvent(new KeyboardEvent('keyup',{'key':'Enter'}));
    }

    text.split('\n').forEach((e, i, original) => {
        inputDom.value = e;
        if(i < original.length - 1)
            pressEnter();
    });
})

globalThis.debug = {
    global_env,
    keyPressed,
    consoleHistory
}

function gotoBottom(element) {
    element.scrollTop = element.scrollHeight - element.clientHeight;
}
