import { initScript } from "./script.js"
import { Screen } from "./screen.js"
import { Title, Location, Talk, Select, Goto } from "./struct.js"

export class Engine {
  constructor() {
    this.screen = new Screen(this)
    this.scenes = initScript()
    this.header = this.scenes.then((s) =>
      s.map((s) => ({ name: s.name, header: 0 })),
    )
    this.stack = []
  }

  async begin() {
    this.scenes = await this.scenes
    this.header = await this.header

    let scene = this.scenes.find((s) => s.name === "INIT")

    if (!scene) {
      console.error("INIT scene not found")
      return
    }

    await this.screen.clear()
    await this.runScene(scene)
  }

  async runStmt(stmt) {
    await this.screen.clear() // fix: await 누락
    if (stmt instanceof Title) {
      await this.screen.printTitle(stmt)
    } else if (stmt instanceof Location) {
      await this.screen.printLocation(stmt)
    } else if (stmt instanceof Talk) {
      await this.screen.printTalk(stmt)
    } else if (stmt instanceof Select) {
      await this.screen.printSelect(stmt)
    } else if (stmt instanceof Goto) {
      let scene = this.scenes.find((s) => s.name === stmt.target)
      if (!scene) {
        console.error(`Scene ${stmt.target} not found`)
        return
      }
      await this.runScene(scene)
    }
  }

  async runScene(scene) {
    this.stack.push(scene.name)

    let header = this.header.find((h) => h.name === scene.name)
    if (!header) {
      console.error(`Scene ${scene.name} not found`)
      return
    }
    header = header.header

    for (let i = header; i < scene.stmt.length; i++) {
      let stmt = scene.stmt[i]
      await this.runStmt(stmt)
      // fix: Select는 버튼 클릭으로 이미 진행되므로 waitForClick 스킵
      if (!(stmt instanceof Select)) {
        await this.screen.waitForClick()
      }
    }

    this.stack.pop()

    if (this.stack.length == 0) {
      await this.printEnd()
    }
  }

  async printEnd() {
    await this.screen.clear()
    await this.screen.printText("Thank you for playing!")
    // fix: 클릭하면 재시작
    await this.screen.waitForClick()
    await this.restart()
  }

  async restart() {
    this.scenes = initScript()
    this.header = this.scenes.then((s) =>
      s.map((s) => ({ name: s.name, header: 0 })),
    )
    this.stack = []
    await this.begin()
  }
}
