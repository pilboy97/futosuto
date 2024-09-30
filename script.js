import parse from "./parser.js"

async function loadScript() {
    return (await (await fetch("script.molu")).text())
}
export async function init() {
    let script = await loadScript()
    return script
}

export class Screen {
    #prevId
    #engine

    constructor(gameDiv, locDiv, nameDiv, textDiv, optDiv) {
        this.gameDiv = gameDiv
        this.locDiv = locDiv
        this.nameDiv = nameDiv
        this.textDiv = textDiv
        this.optDiv = optDiv

        this.#prevId = 0

        this.locDiv.style.display = 'none'
        this.nameDiv.style.display = 'none'
        this.textDiv.style.display = 'none'
        this.optDiv.style.display = 'none'
    }

    setEngine(engine) {
        this.#engine = engine
    }
    printTalk(talk) {
        let index = 0;
        this.textDiv.style.display = 'block'
        this.textDiv.textContent = ""

        if (talk.name) {
            this.nameDiv.style.display = "block"
            this.nameDiv.textContent = talk.name
        } else {
            this.nameDiv.style.display = "none"
        }
        let str = talk.line

        if (this.#prevId !== 0) {
            clearInterval(this.#prevId)
        }

        const intervalId = setInterval(() => {
            if (index < str.length) {
                // 텍스트를 출력할 HTML 요소를 선택합니다.
                textDiv.textContent += str[index];
                index++;
            } else {
                clearInterval(intervalId);
            }
        }, 100);

        this.#prevId = intervalId
    }
    printLocation(loc) {
        this.locDiv.style.display = "block"
        this.locDiv.textContent = loc.name
    }
    waitForClick() {
        return new Promise(resolve => {
            this.gameDiv.addEventListener('click', resolve, { once: true });
        })
    }
}