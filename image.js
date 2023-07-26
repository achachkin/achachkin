class Image {
    constructor(car,sizeNet,zoom) {
        //холст
        this.canvas = document.createElement("canvas")
        this.ctx = this.canvas.getContext("2d")
        this.x = window.innerWidth;
        this.y = window.innerHeight;
        this.divisionPartes = this.y/this.x
        this.canvas.width = this.x
        this.canvas.height = this.y
        document.body.appendChild(this.canvas)

        //машина
        this.car = car

        //камера
        this.sizeNet = sizeNet
        this.zoomX = 0
        this.zoomY
        this.pixelsForCell
        this.plusZoom(zoom)
        this.cameraPozition = new Vec(this.car.x,this.car.y)
    }
    //рисование сетки
    drawNet() {
        //временный clear (a может и нет)
        this.ctx.clearRect(0,0,this.x,this.y)
        let shiftX = -this.car.pozition.x%this.sizeNet
        let shiftY = this.car.pozition.y%this.sizeNet
        this.ctx.beginPath()
        for( let x = 0; x<= this.zoomX; x++) {
            let xCoord = (x*this.sizeNet+shiftX) * this.pixelsForCell
            this.ctx.moveTo(xCoord, 0)
            this.ctx.lineTo(xCoord,this.y)
        }
        for( let y = 0; y<= this.zoomY; y++) {
            let yCoord = (y*this.sizeNet+shiftY) * this.pixelsForCell
            this.ctx.moveTo(0,     yCoord)
            this.ctx.lineTo(this.x,yCoord)
        }
        this.ctx.stroke()
    }
    //рисование прямоугольника
    drawRectAngle(pozition,direct,width,height,color) {
        let widthVec = direct.rotate(90).multiply(this.pixelsForCell*width/2)
        let heightVec = direct.multiply(this.pixelsForCell*height/2)
        let dotDraw = pozition.multiply(this.pixelsForCell).sum(widthVec).sum(heightVec)
        dotDraw = dotDraw.sum(new Vec(this.x/2,-this.y/2))
        this.ctx.fillStyle = color 
        this.ctx.beginPath()
        this.ctx.moveTo(dotDraw.x,
                        -dotDraw.y)
        dotDraw = dotDraw.sum(heightVec.multiply(-2))
        this.ctx.lineTo(dotDraw.x,
                        -dotDraw.y)
        dotDraw = dotDraw.sum(widthVec.multiply(-2))
        this.ctx.lineTo(dotDraw.x,
                        -dotDraw.y)
        dotDraw = dotDraw.sum(heightVec.multiply(2))
        this.ctx.lineTo(dotDraw.x,
                        -dotDraw.y)
        this.ctx.fill() // слишком сложно!!! нада упростить
    }
    //рисование машины
    drawCar() {
        //car
        //упростить!!!!!
        let direct
        let vecPulse
        for (let i = 0; i < 4;i++) {
            direct = (i<2) ? this.car.direction : this.car.wheelDirection()
            this.drawRectAngle(this.car.wheels[i],direct,this.car.widthWheel,
                               this.car.heightWheel,"black")
            // если нужно увидеть импульс колес, то можно расскоментировать ниже написанное
            // vecPulse = this.car.wheels[i].rotate(90).multiply(this.car.angleSpeed).sum(this.car.pulse)
            // this.drawRectAngle(this.car.wheels[i].sum(vecPulse.multiply(1/2)),vecPulse.normalize(),
            //                     0.5,vecPulse.length(),"green")
        }
        this.drawRectAngle(new Vec(0,0),this.car.direction,this.car.width,this.car.height,"red")
        //если нужно увидеть импульс машины, то можно расскоментировать ниже написанное
        // vecPulse = this.car.pulse
        //     this.drawRectAngle(vecPulse.multiply(1/2),vecPulse.normalize(),
        //                         0.5,vecPulse.length(),"yellow")
        //hook
        //упростить!!!!!
        let bodyDirect = this.car.bodyDirection
        let pozStartHook = this.car.direction.multiply(-this.car.height/2)
        let halfSizeHook = this.car.direction.multiply(-this.car.lenFromCarToBody/2)
        this.drawRectAngle(pozStartHook.sum(halfSizeHook),
                            this.car.direction,this.car.widthHook,this.car.lenFromCarToBody,"black")
        let pozStartSecondHook = pozStartHook.sum(halfSizeHook.multiply(2))
        let halfSizeSecondHook = bodyDirect.multiply(-this.car.lenFromBodyToCar/2)
        this.drawRectAngle(pozStartSecondHook.sum(halfSizeSecondHook),bodyDirect,
                            this.car.widthHook,this.car.lenFromBodyToCar,"black")
        //wheels body
        let pozCenterBody = this.car.bodyPozition.sum(this.car.pozition.multiply(-1))
        for (let i = 0; i <2;i++) {
            this.drawRectAngle(pozCenterBody.sum(this.car.bodyWheels[i]),
                            bodyDirect,this.car.widthWheel,this.car.heightWheel,"black")
            //если нужно увидеть импульс колес прицепа, то можно расскоментировать ниже написанное
            // vecPulse = this.car.bodyWheels[i].rotate(90)
            //             .multiply(this.car.bodyAngleSpeed).sum(this.car.bodyPulse)
            // this.drawRectAngle(this.car.bodyWheels[i].sum(vecPulse.multiply(1/2).sum(pozCenterBody)),vecPulse.normalize(),
            //                     0.5,vecPulse.length(),"green")
        }
        //body
        this.drawRectAngle(pozCenterBody,bodyDirect,this.car.widthBody,this.car.heightBody,"gray")
        //если нужно увидеть импульс прицепа, то можно расскоментировать ниже написанное
        // vecPulse = this.car.bodyPulse
        //     this.drawRectAngle(pozCenterBody.sum(vecPulse.multiply(1/2)),vecPulse.normalize(),
        //                         0.5,vecPulse.length(),"yellow")
    }
    //изменение зума
    plusZoom(n) {
        this.zoomX +=n
        this.zoomY = this.divisionPartes * this.zoomX
        this.pixelsForCell = this.x/this.zoomX
    }
}