//there are constants that can be changed at will

//size of cell
let cellSize = 1

//zoom
let zoom = 50

//width and height of car
let width = 6; height = 8

//max angle of front wheel
let maxAngleWheel = 45

//length of hook from car and hook form body
let lenFromCarToBody = 3
let lenFromBodyToCar = 1

//max angle of body
let maxBodyAngle = 45

//width of hook
let widthHook = 0.2

//width and height of body
let widthBody = 6; heightBody= 8

//mass of car and body
let massCar = 100, massBody= 25

//gravity Constant
let gravityConstant = 9.8

//force Wheels
let forceWheels = 2000

//coefficient of perpendicular and parallel friction
let coefficientOfPerFriction = 1000000000 
let coefficientOfParFriction = 1

//width and height of wheel
let widthWheel = 1; heightWheel = 2

//speed change angle front wheels
let speedChangeWheelAngle = 5

const carAndBody= new CarWithBody(width, height, maxAngleWheel, lenFromCarToBody, lenFromBodyToCar,
                                  maxBodyAngle, widthHook, widthBody, heightBody, massCar, massBody,
                                  gravityConstant, forceWheels, coefficientOfPerFriction, 
                                  coefficientOfParFriction, widthWheel, heightWheel, speedChangeWheelAngle)
const imageOfCarWithBody = new Image(carAndBody, cellSize, zoom) 
var start = 0
let work = 1
function newFram(timestamp) {
    if (!start) start = timestamp;
    let t = (timestamp - start)/1000;
    start = timestamp
    t = t > 1 ? 1 :
    carAndBody.newFrame(t)
    imageOfCarWithBody.drawNet()
    imageOfCarWithBody.drawCar()
    if (work == 1) {
    requestAnimationFrame(newFram)}
}
document.addEventListener('keydown',event => {
    event.preventDefault()
    console.log(event.key)
    if (event.key == "ArrowUp") {
        carAndBody.gas(1)
    }
    if (event.key == "ArrowDown") {
        carAndBody.gas(-1)
    }
    if (event.key == "ArrowRight") {
        carAndBody.turnWheelSwith(1)
    }
    if (event.key == "ArrowLeft") {
        carAndBody.turnWheelSwith(-1)
    }
    if (event.key == "z") {
        carAndBody.gas(0)
    }
    if (event.key == "x") {
        work = 0
    }
})
document.addEventListener('keyup',event => {
    event.preventDefault()
    console.log(event.key)
    if (event.key == "ArrowUp") {
        carAndBody.gas(0)
    }
    if (event.key == "ArrowDown") {
        carAndBody.gas(0)
    }
    if (event.key == "ArrowRight") {
        carAndBody.turnWheelSwith(0)
    }
    if (event.key == "ArrowLeft") {
        carAndBody.turnWheelSwith(0)
    }
})
requestAnimationFrame(newFram)