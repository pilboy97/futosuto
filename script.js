import parse from "./parser.js"

async function loadScript() {
    let filename = window.location.hash.substring(1)
    let filepath = `${filename}.molu`

    console.log(filepath)

    return (await (await fetch(`script/${filepath}`)).text())
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

        this.#engine = null
        this.#prevId = 0

        this.locDiv.style.display = 'none'
        this.nameDiv.style.display = 'none'
        this.textDiv.style.display = 'none'
        this.optDiv.style.display = 'none'
    }

    setEngine(engine) {
        this.#engine = engine
    }
    clear() {
        this.locDiv.style.display = 'none'
        this.nameDiv.style.display = 'none'
        this.textDiv.style.display = 'none'
        this.optDiv.style.display = 'none'
    }
    printTalk(talk) {
        this.clear()

        let index = 0;
        this.textDiv.style.display = 'block'
        this.textDiv.textContent = ""

        if (talk.speaker) {
            this.nameDiv.style.display = "block"
            this.nameDiv.textContent = talk.speaker.name
        } else {
            this.nameDiv.style.display = "none"
        }
        let str = talk.line

        if (this.#prevId !== 0) {
            clearInterval(this.#prevId)
        }

        const intervalId = setInterval(() => {
            if (index < str.length) {
                this.textDiv.textContent += str[index];
                index++;
            } else {
                clearInterval(intervalId);
            }
        }, 100);

        this.#prevId = intervalId
    }
    printLocation(loc) {
        this.clear()

        this.locDiv.style.display = "block"
        this.locDiv.textContent = loc.name
    }
    async printSelect(sel) {
        this.clear()

        this.optDiv.style.display = "block"

        let listeners = []

        for(let i = 0;i < sel.options.length;i++) {
            const option = document.createElement('div')

            option.textContent = sel.options[i].str

            let listener = new Promise((resolve) => {
                option.addEventListener('click', resolve, {once:true})
            })
            .then(event => {
                event.stopPropagation()
                return i
            })
            listeners.push(listener)

            option.classList.add('option')
            this.optDiv.appendChild(option)
        }

        return Promise.any(listeners)
    }
    waitForClick() {
        return new Promise(resolve => {
            this.gameDiv.addEventListener('click', resolve, { once: true });
        })
        .then(event => {
            event.stopPropagation()
        })
    }
}