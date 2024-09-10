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
class Exec {
    constructor() {
        this.cmd = []
    }
}

function parse(script) {
    return script.split('\n')
}

const errUnexpectedChar = new Error("Unexpected character!")

export default parse