import {Scene, Location, Talk, Select, Goto, Title} from "./struct.js"

const ErrUnknownVar = new Error("cannot find variable")
const ErrWrongTypeScene = new Error("variable is not scene type")
const ErrWrongTypeStmt = new Error("wrong type of statement")
const ErrWrongSelect = new Error("select statement error")
const Abort = new Error("This is not Error. This is just to abort JS")

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

        this.screen.printTalk(talk)
        await this.waitForClick()
    }
    async runSelect(sel) {
        if(!(sel instanceof Select))
            throw ErrWrongTypeStmt

        this.sel = null

        this.sel = await this.screen.printSelect(sel)

        //console.log(this.sel)
        if (!(this.sel >= 0 && this.sel < sel.options.length)) {
            throw ErrWrongSelect
        }

        let res = sel.options[this.sel]
        for(let i = 0;i < res.act.length;i++) {
            await this.runStmt(res.act[i])
        }
    }
    async runGoto(cmd) {
        if(!(cmd instanceof Goto)) 
            throw ErrWrongTypeStmt

        await this.runScene(cmd.target)
        throw Abort
    }
    async runTitle(title) {
        this.screen.printTitle(title)
        await this.waitForClick()
    }
    async runStmt(stmt) {
        //console.log(stmt)

        if(stmt instanceof Location) {
            await this.runLocation(stmt)
        } else if(stmt instanceof Talk) {
            await this.runTalk(stmt)
        } else if(stmt instanceof Select) {
            await this.runSelect(stmt)
        } else if(stmt instanceof Title) {
            await this.runTitle(stmt)
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

        //console.log(`run ${scene.name}`)

        for(let i = 0;i < scene.stmt.length;i++) {
            await this.runStmt(scene.stmt[i])
        }

        //console.log(`end ${scene.name}`)
    }
    async run() {
        try {
            await this.runScene("INIT")
        } catch(e) {
            if (e !== Abort)
                throw e
        }

        this.screen.clear()
    }

    async waitForClick() {
        await this.screen.waitForClick()
    }
}