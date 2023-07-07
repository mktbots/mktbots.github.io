
function isVisible(elem, threshold=0.1) {
    var rect = elem.getBoundingClientRect();
    var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
    return rect.top <= viewHeight && ((viewHeight - rect.top) / viewHeight) > threshold
}
function makeElemInvisible(elem) {
    elem.classList.add('hidden')
    elem.classList.remove('visible')
    elem.classList.remove('hide')
}
function makeElemVisible(elem) {
    elem.classList.remove('hidden')
    elem.classList.add('visible')
}
function hideElems() {
    let elems = Array.from(document.querySelectorAll('.hide'))
    for (let elem of elems) {
        makeElemInvisible(elem)
    }
}
function checkHiddenElems() {
    let elems = document.querySelectorAll('.hidden')

    for (let elem of elems) {
        if (isVisible(elem)) {
            makeElemVisible(elem)
        }
    }
}


document.addEventListener("scroll", checkHiddenElems);
hideElems() // hide elems so browsers without js will still show content
checkHiddenElems()