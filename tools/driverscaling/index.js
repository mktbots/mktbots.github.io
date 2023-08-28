var canvas = document.getElementById("outputCanvas")
var ctx = canvas.getContext('2d')

const bgPaths = {
    'hd': 'assets/hed.png',
    'sd': 'assets/sd.png',
    'nd': 'assets/nd.png'
}
const framePaths = {
    'hd': 'assets/heFrame.png',
    'sd': 'assets/sFrame.png',
    'nd': 'assets/nFrame.png'
}

window.onload = updateCanvas

let urlCache = {}
function getImage(url) {
    return new Promise((resolve, reject) => {
        if (urlCache[url])
            return resolve(urlCache[url])

        let img = new Image
        img.src = url
        img.onload = () => {
            urlCache[url] = img
            resolve(img)
        }
        img.onerror = reject
    })
}

async function drawBackground() {
    let driverType = document.getElementById('dType').value
    let bg = await getImage(bgPaths[driverType])
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)
}

async function drawFrame() {
    let driverType = document.getElementById('dType').value
    let frame = await getImage(framePaths[driverType])
    ctx.drawImage(frame, 0, 0, canvas.width, canvas.height)
}

async function drawDriver() {
    let errorMessage = document.getElementById('errorMessage')
    let url = document.getElementById('driverUrl').value.trim()
    
    if (url == '') {
        errorMessage.hidden = true
        return false
    }
    if (!url.startsWith('https://')) {
        errorMessage.innerHTML = "Error: The driver url must start with https://"
        errorMessage.hidden = false
        return false
    }
    if (!errorMessage.hidden)
        errorMessage.hidden = true

    // load in left right and top values
    let args = url.split(" ")
    if (args.length == 4) {
        let left = document.getElementById('left')
        let right = document.getElementById('right')
        let top = document.getElementById('top')

        left.value = args[1]
        right.value = args[2]
        top.value = args[3]
        url = args[0]
        document.getElementById('driverUrl').value = url
    }

    let image = await getImage(url).catch(e => null)
    if (!image) {
        errorMessage.innerHTML = "Error: There was a problem fetching the image link. If it is from MKT Wiki, make sure to click 'copy image address' instead of copying the page url from the search bar."
        errorMessage.hidden = false
        return false
    }

    let left = document.getElementById('left').value / 10
    let right = document.getElementById('right').value / 10
    let top = document.getElementById('top').value / 10
    let width = image.width * (right - left)
    let height = width * 280/216

    // console.log({right, left, top})

    let canvas2 = document.getElementById('tmpCanvas')
    canvas2.width = width
    canvas2.height = height
    let ctx2 = canvas2.getContext('2d')
    let scale = 190 / canvas2.width

    ctx2.drawImage(image, -left*image.width, -top*image.height)
    ctx.drawImage(canvas2, 13, 13, canvas2.width*scale, canvas2.height*scale)
    return true
}

function updateScalingTable(drewDriver) {
    let scaleTable = document.getElementById('scalingTable')

    let left = drewDriver ? document.getElementById('left').value : " "
    let right = drewDriver ? document.getElementById('right').value : " "
    let top = drewDriver ? document.getElementById('top').value : " "

    scaleTable.innerHTML = `
        <tr>
            <td>${left}</td>
            <td>${right}</td>
            <td>${top}</td>
        </tr>
    `
}

let lines = []
let curLine = 0 // for input
function loadData() {
    let data = document.getElementById('import').value
    lines = data.split("\n")
    curLine = 0
    
    if (lines.length == 0)
        return

    let args = lines[curLine].trim().split(" ")
    if (args.length == 5)
        args.shift()
    if (args.length == 4) {
        document.getElementById('left').value = args[1]
        document.getElementById('right').value = args[2]
        document.getElementById('top').value = args[3]
        document.getElementById('driverUrl').value = args[0]
    }
    updateCanvas()
}

function next() {
    if (curLine >= lines.length) 
        return

    curLine++
    let line = lines[curLine]
    let args = lines[curLine].split(" ")
    if (args.length == 5)
        args.shift()
    if (args.length == 4) {
        document.getElementById('left').value = args[1]
        document.getElementById('right').value = args[2]
        document.getElementById('top').value = args[3]
        document.getElementById('driverUrl').value = args[0]
    }
    updateCanvas()
}

async function updateCanvas(shouldReset=false) {
    if (shouldReset) {
        document.getElementById('left').value = 0
        document.getElementById('right').value = 10
        document.getElementById('top').value = 0
    }

    await drawBackground()
    let drewDriver = await drawDriver()
    if (drewDriver) {
        await drawFrame()
    }
    updateScalingTable(drewDriver)
}
