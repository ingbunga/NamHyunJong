
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

const domconsole = {
    history: {
        list: [''],
        historyPtr: 0,
    
        maximumListSize: 100,
    
        add(txt) {
            this.list.push(txt);
            if (this.list.length > this.maximumListSize)
                this.list.shift();
        },
    
        setPtrToLast() {
            this.historyPtr = this.list.length;
        },
    
        setPtrToPrev() {
            if (this.historyPtr > 0)
                this.historyPtr--;
            else
                this.historyPtr = 0;
        },
    
        setPtrToNext() {
            if (this.historyPtr < this.list.length - 1)
                this.historyPtr++;
            else
                this.historyPtr = this.list.length - 1;
        },
    
        getPtrTxt() {
            return this.list[this.historyPtr]
        }
    },
    indent: {
        depth: 0,
        
        parseFromInput(input) {
            let i;
            for(i = 0; i < input.length; i++)
                if(input[i] !== ' ')
                    break;
            this.depth = i;
        },
    
        getIndentAsString() {
            return ' '.repeat(this.depth);
        }
    }
}


const keyPressed = {};
let multiline_acc = '';

inputDom.addEventListener('keydown', (e) => {
    keyPressed[e.key] = true;

    function initInput() {
        inputDom.value = domconsole.indent.getIndentAsString();
    }

    function writeInput() {
        domconsole.history.add(inputDom.value);
        domconsole.indent.parseFromInput(inputDom.value);
        
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

        domconsole.history.setPtrToLast();
        initInput();
    }
    else if (keyPressed['Enter']) {
        writeInput();
        try {
            var val = parse(multiline_acc + inputDom.value).map(e => _eval(e));
            
            console.debug(...val)
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

            domconsole.history.setPtrToLast();
        }
    }
    if (keyPressed['ArrowUp']) {
        domconsole.history.setPtrToPrev();
        inputDom.value = domconsole.history.getPtrTxt();
    }
    if (keyPressed['ArrowDown']) {
        domconsole.history.setPtrToNext();
        inputDom.value = domconsole.history.getPtrTxt();
    }
});


inputDom.addEventListener('keyup', (event) => {
    keyPressed[event.key] = false;
});


inputDom.addEventListener('paste', (event) => {
    let text = (event.clipboardData || window.clipboardData).getData('text');
    event.preventDefault();

    function pressShiftEnter() {
        inputDom.dispatchEvent(new KeyboardEvent('keydown',{'key':'Shift'}));
        inputDom.dispatchEvent(new KeyboardEvent('keydown',{'key':'Enter'}));
        inputDom.dispatchEvent(new KeyboardEvent('keyup',{'key':'Shift'}));
        inputDom.dispatchEvent(new KeyboardEvent('keyup',{'key':'Enter'}));
    }

    text.split('\n').forEach((e, i, original) => {
        inputDom.value = inputDom.value + e;
        if(i < original.length - 1) {
            pressShiftEnter();
            inputDom.value = '';
        }
    });
})

globalThis.debug = {
    global_env,
    keyPressed,
    domconsole
}

function gotoBottom(element) {
    element.scrollTop = element.scrollHeight - element.clientHeight;
}
