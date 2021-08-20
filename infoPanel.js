class InfoPanel{
    constructor(target,maxCount=0, params={height:50, width:100}){
        this.className = target;
        this.height = params.height;
        this.width = params.width;
        this.classInfoPanel = this.generateClassName("info-panel")
        this.classInfoBody = this.generateClassName("info-panel__body")

        this.styleInfoPanel =`style="display:block; position:absolute; padding: 0 10px; top:15px; left:20px; height: ${this.height}px; min-width: ${this.width}px;  display: flex; justify-content: center; align-items: center; border: 2px white solid; border-radius: 10px; background-color: rgba(1,1,1,0.4)"`
        this.styleInfoBody =`style="font-size: 25px; color: white"`
        this.counter = 0
        this.maxCount = maxCount

        this.init()

    }

    init(){
        let template = `
        <div class="${this.classInfoPanel}" ${this.styleInfoPanel} >
        
            <div class="${this.classInfoBody}"  ${this.styleInfoBody}>Cows: ${this.counter}/${this.maxCount}</div>
        </div>`
        document.querySelector(this.className).insertAdjacentHTML('afterend', template);

    }

    drawCounter(){
        console.log('counter------------------')
        console.log(document.querySelector(`.${this.classInfoBody}`))

        let template = `Cows: ${this.counter}/${this.maxCount}`
        document.querySelector(`.${this.classInfoBody}`).innerText = '';
        document.querySelector(`.${this.classInfoBody}`).insertAdjacentText('afterbegin', template);
       

    }

    increase(){
        this.counter += 1
        this.drawCounter()
    }

    generateClassName(className){
        let newName = className + Math.round(new Date().getTime() * (Math.random()*200+2))
        console.log("New Class Name: " + newName)
        return newName
    }
}