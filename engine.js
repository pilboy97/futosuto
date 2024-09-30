import {Scene, Location, Talk, Select, Goto} from "./struct.js"

const ErrUnknownVar = new Error("cannot find variable")
const ErrWrongTypeScene = new Error("variable is not scene type")
const ErrWrongTypeStmt = new Error("wrong type of statement")

export class Engine {
    constructor(vars, screen) {
        this.sel = null
        this.vars = {}
        for(let i = 0;i < vars.length;i++) {
            this.vars[vars[i].name] = vars[i]
        }

        this.screen = screen
    }

    async runLocation(loc) {
        if (!(loc instanceof Location))
            throw ErrWrongTypeStmt

        this.screen.printLocation(loc)
        await this.waitForClick()
    }
    async runTalk(talk) {
        if (!(talk instanceof Talk))
            throw ErrWrongTypeStmt

        console.log(`${talk.speaker} : ${talk.line}`)
        await this.waitForClick()
    }
    async runSelect(sel) {
        if(!(sel instanceof Select))
            throw ErrWrongTypeStmt

        this.sel = null

        console.log("[")

        for(let i = 0;i < sel.options.length;i++) {
            console.log(sel.options[i].str)
        }

        console.log("]")
    }
    async runGoto(cmd) {
        if(!(cmd instanceof Goto)) 
            throw ErrWrongTypeStmt

        await this.runScene(cmd.target)
    }
    async runStmt(stmt) {
        if(stmt instanceof Location) {
            await this.runLocation(stmt)
        } else if(stmt instanceof Talk) {
            await this.runTalk(stmt)
        } else if(stmt instanceof Select) {
            await this.runSelect(stmt)
        } else if(stmt instanceof Goto) {
            await this.runGoto(stmt)
        } else {
            throw ErrWrongTypeStmt
        }
    }
    async runScene(name) {
        let scene = this.vars[name]

        if (scene === null) {
            throw ErrUnknownVar
        }
        if (!(scene instanceof Scene)) {
            throw ErrWrongTypeScene
        }

        console.log(`run ${scene.name}`)

        for(let i = 0;i < scene.stmt.length;i++) {
            await this.runStmt(scene.stmt[i])
        }

        console.log(`end ${scene.name}`)
    }
    async run() {
        await this.runScene("INIT")
    }

    async waitForClick() {
        await this.screen.waitForClick()
    }
}