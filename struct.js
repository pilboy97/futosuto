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
export class Talk {
    constructor() {
        this.speaker = ""
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