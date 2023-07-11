const navWidth = 275
var hasInteracted = false

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
function showArrow() {
    let arrow = document.getElementById('arrow-down')
    if (arrow && !hasInteracted)
        arrow.classList.remove('hidden')
}
function hideArrow() {
    let arrow = document.getElementById('arrow-down')
    if (arrow)
        makeElemInvisible(arrow)
}
function checkHiddenElems() {
    let elems = document.querySelectorAll('.hidden')
    
    hideArrow()
    hasInteracted = true

    for (let elem of elems) {
        if (isVisible(elem) && elem.id != 'arrow-down') {
            makeElemVisible(elem)
        }
    }
}

function openNav() {
    document.getElementById("nav").style.left = "0px";
    hasInteracted = true
}
function closeNav(e) {
    document.getElementById("nav").style.left = `-${navWidth+5}px`;
}

function handleClick(e) {
    let isNav = e.target == document.getElementById('nav')
    let isLink = e.target.tagName.toLowerCase() == 'a'
    let isButton = e.target == document.getElementById('nav-openbtn')
    let isMobile = window.innerWidth < 900

    if (isButton || !isMobile || isLink)
        return

    if (!isNav && !isButton)
        closeNav()
}
function handleNavButton() {
    if (document.getElementById("nav").style.left == '0px')
        closeNav()
    else {
        hideArrow()
        openNav()
    }
}

var screenWidth = window.innerWidth
function handleResize(e) {
    let isMobile = window.innerWidth < 900
    // add width checker since ios causes event to trigger if swiping up
    if (window.innerWidth == screenWidth)
        return
    screenWidth = window.innerWidth

    if (isMobile)
        closeNav(e)
    else
        openNav()
}

window.addEventListener('click', (e) => handleClick(e));
window.addEventListener('touchstart', (e) => handleClick(e));
window.addEventListener('resize', (e) => handleResize(e)) 
document.addEventListener("scroll", checkHiddenElems);
hideElems() // hide elems so browsers without js will still show content

setTimeout(() => {
    showArrow()
}, 3000);