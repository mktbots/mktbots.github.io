
function isVisible(elem, threshold=0.1) {
    var rect = elem.getBoundingClientRect();
    var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return rect.top <= viewHeight && ((viewHeight - rect.top) / viewHeight) > threshold
}

function makeElemInvisible(elem) {
    elem.classList.add('hidden')
    elem.classList.remove('visible')
}
function makeElemVisible(elem) {
    elem.classList.remove('hidden')
    elem.classList.add('visible')
}

function hideElems() {
    let elems = Array.from(document.querySelectorAll('.main-feature-container'))
    elems.push(document.getElementById('welcome'))
    elems.push(document.getElementById('welcome-msg'))
    elems.push(document.getElementById('arrow-down'))

    for (let elem of elems) {
        makeElemInvisible(elem)
    }
}

function showWelcome() {
    let table = [
        [document.getElementById('welcome'), 300],
        [document.getElementById('welcome-msg'), 500],
        [document.getElementById('arrow-down'), 700]
    ]

    for (let [elem, ms] of table) {
        setTimeout(() => {
            makeElemVisible(elem)
        }, ms);
    }
}

function update() {
    let elems = document.querySelectorAll('.main-feature-container')
    let arrow = document.getElementById('arrow-down')

    makeElemInvisible(arrow)

    for (let elem of elems) {
        if (isVisible(elem)) {
            makeElemVisible(elem)
        }
    }
}

document.addEventListener("scroll", update);
hideElems() // hide elems so browsers without js will still show content
showWelcome()