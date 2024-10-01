
export const Oper = {
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
    NOT : "!",
    DIV : "/",
    AT : "@",
    SHARP : "#"
}
Object.freeze(Oper)

export const Kind = {
    ...Oper,
    TXT : "TXT",
    EOF : "EOF"
}
Object.freeze(Kind)