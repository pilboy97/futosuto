import {Kind, Oper} from "./symbol.js"

class Token {
    constructor() {
        this.kind = ""
        this.str = ""
    }
}
function isSpace(ch) {
    return /\s/.test(ch)
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
        if(cur == '/') {
            if (i + 1 < script.length && script[i + 1] === '/') {
                while(cur != '\n' && i < script.length) {
                    i++
                    cur = script[i]
                }
                continue
            }
        }

        if(isOper(cur)) {
            let token = new Token()
            token.kind = isOper(cur)
            token.str = cur

            res.push(token)
        }
        else if(cur == '"') {
            let begin = i + 1
            let end = begin

            i++
            cur = script[i]
            while(cur != '"' && i < script.length) {
                i++
                cur = script[i]
            }
            end = i

            let token = new Token()
            token.kind = Kind.TXT
            token.str = script.substring(begin, end)

            res.push(token)
        }
        else {
            let begin = i
            let end = begin

            while(!isSpace(cur) && !isOper(cur) && i < script.length) {
                i++
                cur = script[i]
            }
            end = i
            if (isOper(cur)) i--

            let token = new Token()
            token.kind = Kind.TXT
            token.str = script.substring(begin, end)

            res.push(token)
        }
    }

    let eof = new Token()
    eof.kind = Kind.EOF
    eof.str = ""

    res.push(eof)

    return res
}

export default tokenize