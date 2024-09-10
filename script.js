import parse from "./parser.js"

async function loadScript() {
    return (await (await fetch("script.molu")).text())
}
export async function init() {
    let script = await loadScript()
    return parse(script)
}

export function getPrintLine(textDiv) {
    return function printLine(str) {
        let index = 0;
        textDiv.textContent = ""

        const intervalId = setInterval(() => {
            if (index < str.length) {
                // 텍스트를 출력할 HTML 요소를 선택합니다.
                textDiv.textContent += str[index];
                index++;
            } else {
                clearInterval(intervalId);
            }
        }, 100);

        return intervalId
    }
}

