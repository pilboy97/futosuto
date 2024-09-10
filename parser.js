import {Kind, Oper} from "./symbol.js"

class Scene {
    constructor() {
        this.name = ""
        this.stmt = []
    }
}
class Location {
    constructor() {
        this.name = ""
    }
}
class Talk {
    constructor() {
        this.speaker = ""
        this.emotion = ""
        this.line = ""
    }
}
class Select {
    constructor() {
        this.options = []
    }
}
class Option {
    constructor() {
        this.str = ""
        this.act = []
    }
}

const errUnexpectedChar = new Error("Unexpected character!")

let code = []
let header = 0

function now() {
    return code[header++]
}
function is(ch) {
    if (code[header].kind === ch) {
        header++
        return true
    }
    return false
}
function must(cond) {
    let res = code[header]

    if (!cond) {
        throw errUnexpectedChar
    }
    return res
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

    if (code[header].kind !== OBL)
        return false
    if (code[header + 1].kind !== OBL)
        return false

    header += 2
    return true
}
function isScriptClose() {
    if (header + 1 >= code.length)
        return false

    if (code[header].kind !== CBL)
        return false
    if (code[header + 1].kind !== CBL)
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
    return is(Kind.OSB)
}
function isOptionBeginClose() {
    return is(Kind.CSB)
}
function isOptionEnd() {
    if (header + 2 >= code.length)
        return false

    if (code[header].kind !== LE)
        return false
    if (code[header + 1].kind !== DIV)
        return false
    if (code[header + 2].kind !== GR)
        return false

    header += 3
    return true
}
function isEOF() {
    return is(Kind.EOF)
}

function parse(tokens) {
    let res = []

    while(!isEOF()) {
        res.push(parseScene())
    }

    return res
}

function parseScene() {
    let res = new Scene()

    must(isSceneBeginOpen())
    res.name = must(is(Kind.TXT)).str
    must(isSceneBeginClose())

    while (!isEOF() && !isSceneEnd()) {
        if(isLocationOpen()) {
            header -= 1

            res.stmt.push(parseLocation())
        }
        else if(isSelectBegin()) {
            header -= 1

            res.stmt.push(parseSelect())
        }
        else if(isScriptOpen()) {
            header -= 2

            res.stmt.push(parseScript())
        }
        else {
            res.stmt.push(parseTalk())
        }
    }
    
    header -= 5
    must(isSceneEnd())
}
function parseLocation() {
    let res = new Location()

    must(isLocationOpen())
    
    res.name = must(is(Kind.TXT)).str

    must(isLocationClose())

    return res
}
function parseTalk() {

}
function parseSelect() {

}
function parseOption() {
    
}

export default parse