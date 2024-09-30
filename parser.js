import {Kind, Oper} from "./symbol.js"
import {Scene, Location, Talk, Select, Option, Goto} from "./struct.js"


const errUnexpectedChar = new Error("Unexpected character!")

let code = []
let header = 0

function peek() {
    return code[header]
}
function is(ch) {
    if (code[header].kind === ch) {
        header++
        return true
    }
    return false
}
function must(cond) {
    if (!cond) {
        throw errUnexpectedChar
    }
}
function isSceneBeginOpen() {
    if (header + 1 >= code.length)
        return false

    if (code[header].kind !== Kind.LE)
        return false
    if (code[header + 1].kind !== Kind.LE)
        return false

    header += 2
    return true
}
function isSceneBeginClose() {
    if (header + 1 >= code.length)
        return false

    if (code[header].kind !== Kind.GR)
        return false
    if (code[header + 1].kind !== Kind.GR)
        return false

    header += 2
    return true
}
function isSceneEnd() {
    if (header + 4 >= code.length)
        return false

    if (code[header].kind !== Kind.LE)
        return false
    if (code[header + 1].kind !== Kind.LE)
        return false
    if (code[header + 2].kind !== Kind.DIV)
        return false
    if (code[header + 3].kind !== Kind.GR)
        return false
    if (code[header + 4].kind !== Kind.GR)
        return false

    header += 5
    return true
}
function isLocationOpen() {
    return is(Kind.OB)
}
function isLocationClose() {
    return is(Kind.CB)
}
function isScriptOpen() {
    if (header + 1 >= code.length)
        return false

    if (code[header].kind !== Kind.OBL)
        return false
    if (code[header + 1].kind !== Kind.OBL)
        return false

    header += 2
    return true
}
function isScriptClose() {
    if (header + 1 >= code.length)
        return false

    if (code[header].kind !== Kind.CBL)
        return false
    if (code[header + 1].kind !== Kind.CBL)
        return false

    header += 2
    return true
}
function isSelectBegin() {
    return is(Kind.OSB)
}
function isSelectEnd() {
    return is(Kind.CSB)
}
function isOptionBeginOpen() {
    return is(Kind.LE)
}
function isOptionBeginClose() {
    return is(Kind.GR)
}
function isOptionEnd() {
    if (header + 2 >= code.length)
        return false

    if (code[header].kind !== Kind.LE)
        return false
    if (code[header + 1].kind !== Kind.DIV)
        return false
    if (code[header + 2].kind !== Kind.GR)
        return false

    header += 3
    return true
}
function isCommand() {
    return is(Kind.SHARP)
}
function isEOF() {
    return is(Kind.EOF)
}
function isTXT() {
    return is(Kind.TXT)
}

function parse(tokens) {
    let res = []

    code = tokens
    header = 0

    while(!isEOF()) {
        res.push(parseScene())
    }

    return res
}

function getTXT() {
    let txt = peek().str

    must(isTXT())

    return txt
}

function parseScene() {
    let res = new Scene()

    must(isSceneBeginOpen())

    res.name = getTXT()

    must(isSceneBeginClose())

    while (!isEOF() && !isSceneEnd()) {
        res.stmt.push(parseStmt())
    }
    
    header -= 5
    must(isSceneEnd())

    return res
}
function parseStmt() {
    if(isLocationOpen()) {
        header -= 1

        return parseLocation()
    }
    else if(isLocationOpen()) {
        header -= 1
        
        return parseLocation()
    }
    else if(isSelectBegin()) {
        header -= 1

        return parseSelect()
    }
    else if(isScriptOpen()) {
        header -= 2

        return parseScript()
    }
    else if(isCommand()) {
        header -= 1

        return parseCommand()
    }
    return parseTalk()
}
function parseLocation() {
    let res = new Location()

    must(isLocationOpen())
    
    res.name = getTXT()

    must(isLocationClose())

    return res
}
function parseCommand() {

    must(isCommand())

    let cmd = getTXT()

    if(cmd == "goto") {
        let res = new Goto()

        res.target = getTXT()

        return res
    }
}
function parseTalk() {
    let res = new Talk()

    if(is(Kind.AT)) {
        res.speaker = getTXT()
    }
    res.line = getTXT()

    return res
}
function parseSelect() {
    let res = new Select()

    must(isSelectBegin())

    while(!isEOF() && !isSelectEnd()) {
        res.options.push(parseOption())
    }

    header -= 1
    must(isSelectEnd())

    return res
}
function parseOption() {
    let res = new Option()

    must(isOptionBeginOpen())
    res.str = getTXT()
    must(isOptionBeginClose())

    while(!isEOF() && !isOptionEnd()) {
        res.act.push(parseStmt())
    }
    header -= 3

    must(isOptionEnd())

    return res
}

export default parse