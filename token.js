const Kind = {
    OPER : "OPERATOR",
    WORD : "WORD",
    EOF : "EOF"
}
Object.freeze(Kind)

const Oper = {
    LE : "<",
    GR : ">",
    OB : "(",
    CB : ")",
    OSB : "[",
    CSB : "]",
    OBL : "{",
    CBL : "}",
    COMMA : ",",
    SCOLON : ";",
    DIV : "/",
}
Object.freeze(Oper)

class Token {
    constructor() {
        this.kind = ""
        this.str = ""
    }
}

function isOper(ch) {
    let key = Object.keys(Oper)
    let val = Object.values(Oper)

    for(let i = 0;i < key.length;i++) {
        if (val[i] == ch) {
            return key[i]
        }
    }

    return null
}
function tokenize(script) {
    let res = []

    for(let i = 0;i < script.length;i++) {
        let cur = script[i]

        if(/\s/.test(cur)) continue
        if(cur == '#') {
            while(cur != '\n') {
                i++
                cur = script[i]
            }
            continue
        }

        if(isOper(cur)) {
            let token = new Token()
            token.kind = isOper(cur)
            token.str = cur

            res.push(token)
        }
        else {
            let begin = i
            let end = begin

            while(cur != '\n') {
                i++
                cur = script[i]
            }

            let token = new Token()
            token.kind = WORD
            token.str = script.substring(begin, end)

            res.push(token)
        }
    }

    return res
}

export default tokenize