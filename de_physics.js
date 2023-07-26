// проверка класса веткора
// проверка создания вектора
const de_x_1 = 4
const de_y_1 = 3
const de_pozition_1 = new Vec(de_x_1,de_y_1)

if ( (de_pozition_1.x != de_x_1) || (de_pozition_1.y != de_y_1) ) {
    console.log("ERROR WITH CREATE VEC")
}

//проверка прибавления вектора
const de_x_2 = -8
const de_y_2 = -6
const de_pozition_2 = new Vec(de_x_2,de_y_2)
const de_pozition_3 = de_pozition_2.sum(de_pozition_1)
if ((de_pozition_3.x != (de_x_2 + de_x_1)) || (de_pozition_3.y != (de_y_2 + de_y_1))) {
    console.log("ERROR WITH SUM VEC")
}

//проверка расчета расстояния вектора
function de_calc_length(x,y) {
    return Math.sqrt((x*x) + (y*y))
}
const de_length_3 = de_pozition_3.length()
const de_length_1 = de_pozition_1.length()
const de_length_2 = de_pozition_2.length()
if ((de_length_1 != de_calc_length(de_x_1, de_y_1)) || 
    (de_length_2 != de_calc_length(de_x_2, de_y_2)) ||  
    (de_length_3 != de_calc_length(de_x_1+ de_x_2, de_y_1+ de_y_2))) {
        console.log("ERROR WITH CALCULATE LENGTH")
}
//проверка поворота
const de_pozition_4 = de_pozition_1.rotate(90)
if ((de_pozition_4.y != de_x_1) || (de_pozition_4.x != -de_y_1)) {
    console.log("ERROR WITH ROTATE VEC",de_pozition_4)
}
//проверка умножения
if (de_pozition_1.multiply(2).length() != 10) {
    console.log("ERROR WITH MULTIPLY VECTOR")
}
//проверка поворота, через нормированный вектор
if (de_pozition_1.changeDirection(new Vec(0,1)).x != -3) {
    console.log("ERROR WITH CHANGE DIRECTION")
}
//проверка умножения векторов
if (de_pozition_1.multiplyVec(de_pozition_2).x != -32) {
    console.log("ERROR WITH MULTIPLY VECTOR WITH VECTOR")
}
//проверка скалярного произвидения
if (de_pozition_1.scalarProduct(de_pozition_1) != Math.pow(de_pozition_1.length(),2)) {
    console.log("ERROR WITH SCALAR PRODUCT")
}
//проверка нормализации
let de_normalize_poz1 = de_pozition_1.normalize()
if (de_normalize_poz1.x != 4/5) {
    console.log("ERROR WITH NORMALIZE")
}
//проверка нахождения угла между векторами
if (new Vec(1,0).calcBetwenAngle(new Vec(-1,0)) != 180) {
    console.log("ERROR WITH CALC ANGLE BETWEEN VECTOR")
}

//проверка класса машины с прицепом
//проверка создания
const de_car = new CarWithBody()

//проверка добавления значения к импульсу
de_car.addPulse(new Vec(1,0))
if (de_car.pulse.length() != 1) {
    console.log("ERROR WITH CHANGE PULSE")
} 
//проверка добавления значения к положению
de_car.addPozition(new Vec(1,0))
if (de_car.pozition.x != 1) {
    console.log("ERROR WITH CHANGE POZITION")
}
//проверка колес
if ((de_car.wheels[3].x != 3) || (de_car.wheels[3].y != 4)) {
    console.log("ERROR WITH ARRAY WHEELS")
}
//проверка добавления угла к машине
de_car.addAngle(90)
if (de_car.direction.x != -1) {
    console.log("ERROR WITH CHANGE ANGLE")
} 
//проверка выдачи положения колес
de_car.addAngle(45)
de_wheel = de_car.wheels[0]
de_test_vec = new Vec( -de_car.width/2, -de_car.height/2)
de_test_vec = de_test_vec.rotate(135)
if (de_wheel.y != de_test_vec.y) {
    console.log("ERROR WITH CHANGE ANGLE FOR WHEEL")
}
//проверка добавления угла к колесу
de_car.addWheelAngle(30)
if (de_car.wheelAngle != 30) {
    console.log("ERROR WITH CHANGE WHEEL ANGLE")
}
//проверка лимита угла колеса
de_car.addWheelAngle(30)
if (de_car.wheelAngle != 45) {
    console.log("ERROR WITH CHANGE WHEEL ANGLE")
}
//проверка выдачи направления колес
let de_wheelDirection = de_car.wheelDirection()
if (de_wheelDirection.y != -1) {
    console.log("ERROR WITH WHEEL DIRECTION")
}
//проверка включения/отключения двигателей
de_car.gas(1)
if (de_car.motor != 1) {
    console.log("ERROR WITH GAS")
}
//проверка обновления кадра
de_car.handbrakeSwith()
if (de_car.handbrake != -1) {
    console.log("ERROR WITH TORMOZ")
}
//проверка рассчета ускорения
let de_acceleration_result = de_car.processForceCalc(new Vec(1,1), new Vec(0,1))
if (de_acceleration_result[0].x != 1/4 || de_acceleration_result[1] != 1/4) {
    console.log("ERROR WITH ACCELERATION RESULT")
}
//проверка расчета дельты
// de_car.addAngle(-135)
// de_car.wheelAngle = 0
// de_car.pulse = new Vec(0,1).rotate(45)
// de_car.motor = 0
// let de_delta = de_car.calcDelta()
// if ((de_delta[1] !=0)) {
//     console.log("ERROR WITH CALCULATE DELTA",de_delta)
// }
//проверка выбора поворота
de_car.turnWheelSwith(1)
if (de_car.turnWheel != 1) {
    console.log("ERROR WITH TURN WHEELS")
}
//проверка изменения угла колеса из-за выбора
de_car.processAngleWheel()
if (de_car.wheelAngle != -5) {
    console.log("ERROR WITH PROCCES CHANGLE ANGLE")
}

//вся физика прицепа
//проверка угола прицепа
if (de_car.bodyAngle !=0) {
    console.log("ERROR WITH ANGLE BODY")
} 
//проверка изменение угла прицепа
de_car.addBodyAngle(5)
if (de_car.bodyAngle != 5) {
    console.log("ERROR WITH CHANGE ANGLE BODY")
}
//проверка лимита угла прицепа
//проверка центр прицепа
//проверка направление прицепа
//проверка координаты колес относительно центра прицепа
//проверка лимита поворота колес
