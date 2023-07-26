class Vec {
    constructor(x,y) {
        this.x = x
        this.y = y
    }
    sum(vec) {
        return new Vec(this.x + vec.x, this.y + vec.y)
    }
    length() {
        return Math.sqrt((this.x*this.x) + (this.y*this.y))
    }
    rotate(angle) {
        let angleInRad = (angle/180)*Math.PI
        let x = Math.cos(angleInRad)*this.x- Math.sin(angleInRad)*this.y
        let y = Math.sin(angleInRad)*this.x + Math.cos(angleInRad)*this.y
        return new Vec(x,y)
    }
    multiply(n) {
        return new Vec(this.x * n,this.y * n)
    }
    changeDirection(vec) {
        return new Vec(vec.x*this.x - vec.y*this.y,vec.y*this.x + vec.x*this.y)
    }
    multiplyVec(vec) {
        return new Vec(this.x*vec.x,this.y*vec.y)
    }
    scalarProduct(vec) {
        return (this.x*vec.x + this.y*vec.y)
    }
    normalize() {
        return this.multiply(1/this.length())
    }
    calcBetwenAngle(vec) {
        let scalar = this.scalarProduct(vec)
        return Math.acos(scalar)*180/Math.PI
    }
}

class CarWithBody {
    constructor(width= 6, height= 8, maxSteringAngle= 45, lenFromCarToBody= 1,
                lenFromBodyToCar= 3, maxBodyAngle= 45, widthHook= 0.2, widthBody= 6, heightBody= 8, 
                mass= 100, massBody= 50, gravityConstant= 9.8, forceWheels= 20, 
                coefficientOfPerFriction= 1000000000,coefficientOfParFriction = 1, 
                widthWheel= 1, heightWheel= 2, speedChangeWheelAngle= 5) {
        //задающиеся значения
        //значения машины
        this.width = width
        this.height = height
        this.maxSteringAngle = maxSteringAngle
        this.lenFromCarToBody = lenFromCarToBody 
        this.mass = mass
        this.wheels = [0,0,0,0]
        for (let i= -1; i< 2; i+= 2) {
            for (let j= -1; j< 2; j+=2) {
                this.wheels[ (i+1) + (j+1)/2 ] = new Vec( j* this.width/2, i* this.height/2)
            }
        }
        this.widthWheel = widthWheel
        this.heightWheel = heightWheel
        this.speedChangeWheelAngle = speedChangeWheelAngle
        
        //физические постоянные
        this.gravityConstant = gravityConstant
        this.forceWheels = forceWheels
        this.coefficientOfPerFriction = coefficientOfPerFriction 
        this.coefficientOfParFriction = coefficientOfParFriction

        //значения прицепа
        this.widthBody = widthBody
        this.heightBody = heightBody
        this.maxBodyAngle = maxBodyAngle
        this.lenFromBodyToCar = lenFromBodyToCar
        this.widthHook = widthHook
        this.massBody = massBody
        this.bodyWheels = [0,0]
        for (let i = 0; i <2; i+=1) {
            let direct = (i == 1) ?  1 :-1
            this.bodyWheels[i] = new Vec(direct*this.widthBody/2,-this.heightBody/2)
        }

        //не задающиеся значения    
        //значения машины
        this.pozition = new Vec(0,0)
        this.pulse = new Vec(0,0)
        this.direction = new Vec(0,1)
        this.angleSpeed = 0
        this.wheelAngle = 0
        this.motor = 0
        this.handbrake = 1
        this.turnWheel = 0
        //значения прицепа
        this.bodyPozition = new Vec(0,-(this.height/2)-this.lenFromCarToBody
                                    -(this.heightBody/2)-this.lenFromBodyToCar)
        this.bodyPulse = new Vec(0,0)
        this.bodyDirection = new Vec(0,1)
        this.bodyAngleSpeed = 0
        this.bodyAngle = 0  
    }
    addPulse(vec){
        this.pulse = this.pulse.sum(vec)
    }
    addBodyPulse(vec) {
        this.bodyPulse = this.bodyPulse.sum(vec)
    }
    addPozition(vec) {
        this.pozition = this.pozition.sum(vec)
    }
    addBodyPozition(vec) {
        this.bodyPozition = this.bodyPozition.sum(vec)
    }
    addAngle(angle) {
        this.direction = this.direction.rotate(angle)
        this.wheels = this.wheels.map( w => w.rotate(angle))
    }
    addBodyAngle(angle) {
        this.bodyDirection = this.bodyDirection.rotate(angle)
        this.bodyWheels = this.bodyWheels.map( w => w.rotate(angle))
    }
    addWheelAngle(angle) {
        this.wheelAngle += angle
        if (this.wheelAngle > this.maxSteringAngle) {
            this.wheelAngle = this.maxSteringAngle
        } else if (this.wheelAngle < -this.maxSteringAngle) {
            this.wheelAngle = -this.maxSteringAngle
        }
    }
    wheelDirection() {
        return this.direction.rotate(this.wheelAngle)
    }
    gas(level) {
        this.motor = level
    }
    handbrakeSwith() {
        this.handbrake = -this.handbrake
    }
    turnWheelSwith(direct) {
        this.turnWheel = direct
    }
    processAngleWheel() {
        if (this.turnWheel != 0) {
        this.addWheelAngle(-this.speedChangeWheelAngle*this.turnWheel)
        } else {
        let direct = (this.wheelAngle < 0) ? (1) : ((this.wheelAngle > 0) ? (-1) : (0))
        this.addWheelAngle(this.speedChangeWheelAngle*direct)
        }
    }
    tipHookBody() {
        return this.bodyDirection.multiply(this.heightBody/2+this.lenFromBodyToCar)
    }
    tipHook() {
        return this.direction.multiply(-this.height/2-this.lenFromCarToBody)
    }
    pulseInPozition(poz,pulse,angleSpeed,mass = 1) {
        return poz.rotate(90).multiply(angleSpeed).sum(pulse).multiply(1/mass)
    }
    correctAngles(angleSpeedBody) {
        if (this.direction.calcBetwenAngle(this.bodyDirection) > this.maxBodyAngle) {
            let averageAngleSpeed = (this.angleSpeed/this.mass + this.bodyAngleSpeed/this.massBody)/2
            let direct = this.direction.rotate(-90).scalarProduct(this.bodyDirection) > 0 ? -1 : 1 
            this.addBodyAngle(-0.1*direct)//костыль
            this.angleSpeed = averageAngleSpeed*this.mass
            this.bodyAngleSpeed = averageAngleSpeed*this.massBody
        }
    }
    correctPozitions() {
        let distanceHookCar = this.tipHook()
        this.bodyPozition = this.pozition.sum(distanceHookCar.sum(
            this.bodyDirection.multiply(-(this.heightBody/2+this.lenFromBodyToCar))))
    }
    averageDifferent() {
        let pulseHookBody = this.pulseInPozition(this.tipHookBody(),this.bodyPulse,this.bodyAngleSpeed,this.massBody)
        let pulseHookCar = this.pulseInPozition(this.tipHook(),this.pulse,this.angleSpeed,this.mass)
        return pulseHookBody.sum(pulseHookCar.multiply(-1)).multiply(1/2)
    }
    changeGeneralPulse(j,t = 1) {
        this.addPulse(j[0].multiply(t))
        this.angleSpeed += (j[1]*t)
        this.bodyPulse = this.bodyPulse.sum(j[2].multiply(t))
        this.bodyAngleSpeed += (j[3]*t)
    }
    addTime(t) {
        this.addPozition(this.pulse.multiply(t/this.mass))
        this.addAngle(this.angleSpeed*t*180/(Math.PI*this.mass))
        this.addBodyPozition(this.bodyPulse.multiply(t/this.massBody))
        this.addBodyAngle(this.bodyAngleSpeed*t*180/(Math.PI*this.massBody))
    }
    processForceCalc(poz,force,mass = 1) {
        let a = poz.scalarProduct(force)
        let f = force.length()
        let l = poz.scalarProduct(poz)
        let w = (1/2)*Math.sqrt(((f*f)-((a*a)/l))/l)
        let testDirectionW = poz.rotate(90).scalarProduct(force)
        w = testDirectionW > 0 ? w : (testDirectionW < 0 ? -w : 0)
        if (isNaN(w)) {w = 0}
        let fc = poz.multiply(a/l).sum(force).multiply(1/2)
        return [fc.multiply(mass), w*mass]
    }
    calcFriction(poz,direct,coefficient) {
        let frictionTest = poz.scalarProduct(direct)
        let frictionDirect = (frictionTest > 0) ? (1) : ((frictionTest < 0) ? -1 : 0)
        let totalCoefOfFriction = Math.min(Math.abs(frictionTest), coefficient)
        return -frictionDirect*totalCoefOfFriction
    }
    calcWheelDelta(direct,poz,angleSpeed,pulse,motor = 0) {
        //проверка на ортогональность
        let pulseInPoz = this.pulseInPozition(poz,pulse,angleSpeed)
        let perFriction = this.calcFriction(pulseInPoz,direct.rotate(-90),this.coefficientOfPerFriction*this.gravityConstant)
        let parFriction = this.calcFriction(pulseInPoz,direct,this.coefficientOfParFriction*this.gravityConstant)
        let notProcessForce = direct.rotate(-90).multiply(perFriction).sum(direct.multiply(parFriction))
        .sum(direct.multiply(this.forceWheels*motor))
        return this.processForceCalc(poz,notProcessForce)
    }
    calcGeneralDelta() {
        let deltaPulse = new Vec(0,0)
        let deltaAngleSpeed = 0
        let deltaBodyPulse = new Vec(0,0)
        let deltaBodyAngleSpeed = 0
        let j
        //подсчет сил 
        for (let i = 0; i < 4;i++) {
            let direct = (i <2) ? this.direction : this.wheelDirection()
            let motor = (i <2) ? this.motor : 0
            j = this.calcWheelDelta(direct,this.wheels[i],this.angleSpeed,this.pulse,motor)
            deltaPulse = deltaPulse.sum(j[0])
            deltaAngleSpeed += j[1]
        } 
        for (let i = 0; i< 2;i++) {
            j = this.calcWheelDelta(this.bodyDirection,this.bodyWheels[i],
                                    this.bodyAngleSpeed,this.bodyPulse)
            deltaBodyPulse = deltaBodyPulse.sum(j[0])
            deltaBodyAngleSpeed += j[1]
        }
        return [deltaPulse,deltaAngleSpeed,deltaBodyPulse,deltaBodyAngleSpeed]
    }
    newFrame(t) {
        this.processAngleWheel()
        let delta = this.calcGeneralDelta()
        this.changeGeneralPulse(delta,t)
        let averageDifferent = this.averageDifferent()
        let jHookCar = this.processForceCalc(this.tipHook(),averageDifferent,this.mass)
        let jHookBody = this.processForceCalc(this.tipHookBody(),averageDifferent.multiply(-1),this.massBody)
        this.changeGeneralPulse(jHookCar.concat(jHookBody))
        this.correctPozitions()
        this.correctAngles()
        this.addTime(t)
    }
}