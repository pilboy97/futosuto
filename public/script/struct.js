export class Scene {
    constructor() {
        this.name = ""
        this.stmt = []
    }
}
export class Location {
    constructor() {
        this.name = ""
    }
}
export class Speaker {
    constructor(str) {
        let tokens = str.split(".")
        
        this.name = tokens[0]
        if(tokens.length >= 2)
            this.options = tokens.slice(1)
    }
}
export class Talk {
    constructor() {
        this.speaker = null
        this.line = ""
    }
}
export class Select {
    constructor() {
        this.options = []
    }
}
export class Option {
    constructor() {
        this.str = ""
        this.act = []
    }
}
export class Goto {
    constructor() {
        this.target = ""
    }
}

export class Title {
    constructor() {
        this.title = ""
    }
}