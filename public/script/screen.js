import { wait } from "./common.js"

export const PRINTING_TEXT = 1
export const DONE_TEXT = 2
export class Screen {
  #engine
  #canvas
  #ctx

  constructor(engine) {
    this.#engine = engine
    this.#canvas = document.getElementById("canvas")
    if (!this.#canvas) {
      console.error("Canvas not found")
      return
    }

    this.#ctx = this.#canvas.getContext("2d")
  }

  setEngine(engine) {
    this.#engine = engine
  }

  async clear() {
    this.#ctx.beginPath()
    this.#ctx.fillStyle = "black"
    this.#ctx.fillRect(0, 0, this.#canvas.width, this.#canvas.height)
    this.#ctx.closePath()
  }
  async printTalk(talk) {
    this.#ctx.beginPath()
    this.#ctx.fillStyle = "white"
    this.#ctx.font = "20px Arial"
    if (talk.speaker) {
      this.#ctx.fillText(talk.speaker.name, 10, 20)
    }
    await this.printText(talk.line)
    this.#ctx.closePath()
  }
  async printLocation(loc) {
    this.#ctx.beginPath()
    this.#ctx.fillStyle = "blue"
    this.#ctx.font = "20px Arial"
    this.#ctx.fillText(loc.name, 10, 100)
    this.#ctx.closePath()
  }
  async printTitle(title) {
    this.#ctx.beginPath()
    this.#ctx.fillStyle = "red"
    this.#ctx.font = "20px Arial"
    this.#ctx.fillText(title.title, 10, 60)
  }
  async printSelect(sel) {
    return Promise.any(
      sel.options.map((opt, i) => {
        return this.printButton(opt.str, 10, 100 + i * 35, 200, 30, () => {
          for (let act of opt.act) {
            this.#engine.runStmt(act)
          }
        })
      }),
    )
  }
  async printText(text) {
    for (let i = 0; i < text.length; i++) {
      this.#ctx.fillStyle = "white"
      this.#ctx.font = "20px Arial"
      this.#ctx.fillText(text.substring(0, i + 1), 10, 40)
      await wait(40)
    }
  }

  async waitForClick() {
    return new Promise((resolve) => {
      const handler = () => {
        this.#canvas.removeEventListener("click", handler)
        resolve()
      }
      this.#canvas.addEventListener("click", handler)
    })
  }

  async printButton(text, x, y, w, h, fn) {
    this.#ctx.beginPath()
    this.#ctx.fillStyle = "gray"
    this.#ctx.rect(x, y, w, h)
    this.#ctx.fill()
    this.#ctx.closePath()

    this.#ctx.beginPath()
    this.#ctx.textAlign = "left"
    this.#ctx.textBaseline = "top"
    this.#ctx.fillStyle = "white"
    this.#ctx.font = "20px Arial"
    this.#ctx.fillText(text, x, y)
    this.#ctx.closePath()

    return new Promise((resolve) => {
      let callback = (e) => {
        const rect = this.#canvas.getBoundingClientRect()
        const cx = e.clientX - rect.left
        const cy = e.clientY - rect.top

        if (cx >= x && cx <= x + w && cy >= y && cy <= y + h) {
          fn()
          this.#canvas.removeEventListener("click", callback)
          resolve()
        }
      }
      this.#canvas.addEventListener("click", callback)
    })
  }
}
