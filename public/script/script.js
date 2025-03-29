import parse from "./parser.js"
import tokenize from "./token.js"

async function loadScript() {
  return await (await fetch(`script.molu`)).text()
}
export async function initScript() {
  let script = await loadScript()
  script = tokenize(script)
  script = parse(script)

  return script
}
