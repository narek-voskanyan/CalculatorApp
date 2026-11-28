window.CalculatorApp = function(options) {
    var self = this;

    /* -------------------- State -------------------- */
    this.initVars = function() {
        this.options = options;
        this.calculators = [];
        this.nextId = 1;
        this.cards = document.querySelector(options.cards);
        this.panel = document.querySelector(options.panel);
            //imput fields
        this.inputA = document.querySelector(".first-number")
        this.inputB = document.querySelector(".second-number")


        this.clearButton = document.querySelector(".clear-button")

        this.addCalculatorButton = document.querySelector(".add-calculator-button")

        this.advansedDraggable = document.querySelector(".advansed-druggable")

        this.collapseAllButton = document.querySelector(".collapse-all-button")
        this.expandAllButton = document.querySelector(".expand-all-button")



        //calculate
        this.calcualteButton = document.querySelector(".calculate-button")
        //resulet panel
        this.resultField = document.querySelector('.result')

        this.operator = document.querySelector(".operator-option")
        this.operatorButtons = document.querySelector(".operator-buttons")
        // Each calculator is a data object, not an HTML element:
        // { id: 1, title: 'Calculator 1', a: '', b: '', operation: '+',
        //   result: null, error: '', minimized: false, resetOperation: false }
        // The array order defines the order in both views.
        this.chosenOperator = ""

        this.calculatorTemplate  = document.querySelector("#calculator-template")
        this.controlPanelTamplate = document.querySelector("#control-row-template")

        
    };
      let firstNumber;
      let secondNumber;
      let currentOperator;

    this.findCalculator = function(id) {
        return this.calculators.find(function(item) {
            return item.id === id;
        });
    };

    /* -------------------- Actions -------------------- */
    this.createCalculator = function() {
        // TODO: add a new state object, then render and save.
        // Assign a unique ID using this.nextId.
        const calculator = {
            id: `calc-${this.nextId}`,
            title: `Calculator ${this.nextId}`,
            a: "",
            b: "",
            operation: "+",
            result: "",
            error: "",
            minimized: false,
            resetOperation: false
        };

        this.calculators.push(calculator);

        this.nextId++;
    
    };

    this.toggleCalculator = function(id) {
        var state = this.findCalculator(id);
        if (!state) return;

        state.minimized = !state.minimized;
        this.render();
        this.saveCalculators();
    };

    this.removeCalculator = function(id) {
        const index = this.calculators.findIndex(item => item.id === id);
        if(index === -1) return;

        this.calculators.splice(index, 1)
        this.render()

        this.saveCalculators();
    };

    this.moveCalculator = function(controlPanel = false) {
        // TODO: choose the arguments and update the array order.
        // Update both views and save the new order.
        // Convert data-attribute IDs to numbers if using numeric state IDs.
        if(!controlPanel){
            const calcualtorsFromPage = Array.from(document.querySelector('.calculator-list').querySelectorAll('.calculator'))
            const idesList =[]
            calcualtorsFromPage.forEach(item => {
            idesList.push(item.dataset.id)
        })

        this.calculators.sort((a, b) => {
            return idesList.indexOf(a.id) - idesList.indexOf(b.id)
        })

        this.saveCalculators()
        this.renderPanel()
        
        }else{
            const calcualtorsFromPage = Array.from(document.querySelector('.calculator-control-list').querySelectorAll('.calculator-control-row'))
                const idesList =[]
                calcualtorsFromPage.forEach(item => {
                    idesList.push(item.dataset.id)
                })

                this.calculators.sort((a, b) => {
                    return idesList.indexOf(a.id) - idesList.indexOf(b.id)
                })

                this.saveCalculators()
                this.renderCards()
        
     
        }

        

      
    };

    this.updateCheckboxStyleForDrag = function(){
        if(this.advansedDraggable.checked){
            document.querySelector('.add-calculator-container > label').classList.add("advansed-druggable-collor")
           }else{
            document.querySelector('.add-calculator-container > label').classList.remove("advansed-druggable-collor")
           }
    }
    
    this.calculate = function(a, b, operation) {
        // TODO: return { result: ..., error: ... }.
        // Validate empty input, finite numbers, operation and division by zero.
        // Do not read or modify HTML here.
        let first
        let second 
        if (a == null || b == null || a === "" || b === "") {
            return   {
                result: null,
                error: "Fill the numbers Please"
            }
        }else{
             first = Number(a)
             second = Number(b)
        }

        if (!Number.isFinite(first) || !Number.isFinite(second)){
         return   {
                result: null,
                error: "Fill the numbers Please"
            }
        }else if(operation == null){
          return  {
                result: null,
                error: "Chose an operator please"
            }
        }else if(operation === "/" && second === 0){
         return   {
                result: null,
                error: "Division by zero is not possible"
            }

        }else{

            let result
            switch(operation){
                case "*":
                result = first * second
                break;
                case "/":
                result =  first / second
                break;
                case "+":
                result = first + second
                break;
                case "-":
                result = first - second
                break;
                default:
                  return  {
                        result: null,
                        error: "Choose an operator"
                    }
       
            }
            if (!Number.isInteger(result)) {
                result = Number(result);
            }

            return {
                result: result,
                error: null
            };
        }

    };

    /* -------------------- Events -------------------- */
    this.bindEvents = function() {

        this.cards.addEventListener("input", (event) =>{
            if(event.target.matches(".first-number")){
                const currentCalculator = event.target.closest('.calculator')
                const currentCalculatorId = currentCalculator.dataset.id
                const caculator = this.calculators.find(item => item.id === currentCalculatorId)
                const inputValue = event.target.value
                const numberPattern = /^-?\d*\.?\d*$/;
                if(!numberPattern.test(inputValue)){
                    event.target.value = caculator.a;
                    return
                }else{
                    caculator.result = "";
                    caculator.error = "";
                    caculator.a = event.target.value
                }

                this.saveCalculators()
                this.updateCalculatorView(currentCalculatorId);
    

            }
        })
        this.cards.addEventListener("focusin", (event) =>{
            if(event.target.matches(".second-number")){
                const currentCalculator = event.target.closest('.calculator')
                const currentCalculatorId = currentCalculator.dataset.id
                const caculator = this.calculators.find(item => item.id === currentCalculatorId)
                
                    event.target.select()
               
            }
        })
        this.cards.addEventListener("focusin", (event) =>{
            if(event.target.matches(".first-number")){
                const currentCalculator = event.target.closest('.calculator')
                const currentCalculatorId = currentCalculator.dataset.id
                const caculator = this.calculators.find(item => item.id === currentCalculatorId)

                    event.target.select()
                
            }
        })
        this.cards.addEventListener("input", (event) =>{
            if(event.target.matches(".second-number")){
                const currentCalculator = event.target.closest('.calculator')
                const currentCalculatorId = currentCalculator.dataset.id
                const caculator = this.calculators.find(item => item.id === currentCalculatorId)
                const inputValue = event.target.value
                const numberPattern = /^-?\d*\.?\d*$/;
                if(!numberPattern.test(inputValue)){
                    event.target.value = caculator.b;
                    return
                }else{
                    caculator.result = "";
                    caculator.error = "";
                    caculator.b = event.target.value
                }
                this.saveCalculators()
                this.updateCalculatorView(currentCalculatorId);

            }
        })


        this.addCalculatorButton.addEventListener("click", () =>{
            this.createCalculator()

            this.saveCalculators()
            this.render()
    })
        // Checkbox
    this.cards.addEventListener("change", (event) =>{
        if(event.target.matches('.clear-operator-checkbox')){
        const currentCalculator = event.target.closest('.calculator')
        const currentCalculatorId = currentCalculator.dataset.id
        const caculator = this.calculators.find(item => item.id === currentCalculatorId)


        caculator.resetOperation = event.target.checked

        this.saveCalculators()
        }
        
    })
    
    this.advansedDraggable.addEventListener("change", (event) =>{
       this.updateCheckboxStyleForDrag()
       this.saveCalculators()

    })


        //clean button 
        this.cards.addEventListener("click", (event) =>{
            if(event.target.matches(".clear-button")){
                const currentCalculator = event.target.closest('.calculator')
                const currentCalculatorId = currentCalculator.dataset.id
                const caculator = this.calculators.find(item => item.id === currentCalculatorId)

                caculator.a = ""
                caculator.b = ""
                caculator.result = ""
                caculator.error = ""

                if(caculator.resetOperation){
                    caculator.operation = ""
                }

                this.saveCalculators()
                this.render()

            }
        })





       this.panel.addEventListener("click", (event) => {
            if(event.target.matches('.control-minimize-button')){
                const currentRow = event.target.closest('.calculator-control-row')
                const text  = currentRow.querySelector(".control-minimize-button").textContent 
                const calculatorID = currentRow.dataset.id;


                this.toggleCalculator(calculatorID)
          
            }

       })
       this.panel.addEventListener("click", (event) => {
        if (event.target.matches(".control-remove-button")) {
            const currentRow = event.target.closest('.calculator-control-row')
            const calculatorID = currentRow.dataset.id;

            this.removeCalculator(calculatorID)

        }

    });
    this.collapseAllButton.addEventListener("click", () => {
        this.calculators.forEach(item =>{
            if(item.minimized === false){
                item.minimized = true
            }
        })
        this.saveCalculators()
        this.render()
    })
    this.expandAllButton.addEventListener("click", () => {
        this.calculators.forEach(item =>{
            if(item.minimized === true){
                item.minimized = false
            }
        })
        this.saveCalculators()
        this.render()
    })

    this.cards.addEventListener("click", (event) => {
        if (event.target.matches(".minimize-calculator-button")) {
            const currentCalculator = event.target.closest('.calculator')
            const currentCalculatorId = currentCalculator.dataset.id


            this.toggleCalculator(currentCalculatorId)

        }
      
    });

    this.cards.addEventListener("click", (event) => {
        if (event.target.matches(".remove-calculator-button")) {
            const currentCalculator = event.target.closest('.calculator')
            const calculatorID = currentCalculator.dataset.id;

            this.removeCalculator(calculatorID)

   

        }
     
    });

    this.panel.addEventListener("input", (event) =>{
              if( event.target.matches('.control-calculator-title')){
                const currentRow = event.target.closest('.calculator-control-row')
                const calculatorID = currentRow.dataset.id;
                
                
                const calculator = this.calculators.find(item => item.id === calculatorID )
                calculator.title = event.target.value

                this.saveCalculators()
                this.renderCards()
              }
        })

    this.cards.addEventListener("click", (event) => {
            if(event.target.matches('.operator-option')){
                const currentCalculator = event.target.closest('.calculator')
                const calculatorID = currentCalculator.dataset.id;
                const calculatorChosenOperator = event.target.dataset.operatorValue;
                const caculatorData = this.calculators.find(item => item.id === calculatorID)
                caculatorData.operation = calculatorChosenOperator
                caculatorData.result = "";
                caculatorData.error = "";

                this.saveCalculators()
                this.render()
                
                
            }
        })

    this.cards.addEventListener("click", (event) =>{
          if(event.target.matches('.calculate-button')){
            const currentCalculator = event.target.closest('.calculator')
            const calculatorID = currentCalculator.dataset.id;
            const calculatorChosenOperator = event.target.dataset.operatorValue;

            const chosenCaculator = this.calculators.find(item => item.id === calculatorID )
            const firstNumber = chosenCaculator.a

            const secondNumber = chosenCaculator.b
            const operator = chosenCaculator.operation
            const result = this.calculate(firstNumber, secondNumber, operator)

           

            if (result.error === null) {
                chosenCaculator.result = result.result;
                chosenCaculator.error = "";
            } else {
                chosenCaculator.result = "";
                chosenCaculator.error = result.error;
            }

            this.saveCalculators()
            this.render()


            
          }

        })
    };
    
//////////////////////////////////////////////////////////
/////////////////////////////////////////////////////
////////////////////////////

        this.initDrag = function() {
            let isSimple
     
            // TODO: connect your drag-and-drop component to both views.
            // Choose how it reports the requested reorder to CalculatorApp.
            // Keep drag mechanics separate from calculator data and storage.
      
            let dragField
            let draggedCalculatorFieldClass
            let draggedCalculatorClass
            let draggedCalculatorButtonClass

            //dragable value for calculators
            let isDragAllowed = false
            //dragstart value 
            let isDragging = false
            let currentCalculator = null
    
            document.addEventListener('mousedown', (event) =>{
                const controlField = event.target.closest('.calculator-control-list');
                const mainField = event.target.closest('.calculator-list');
    
    
                if(controlField){
                    dragField = event.target.closest('.calculator-control-list');
                    draggedCalculatorClass = '.calculator-control-row'
                    draggedCalculatorButtonClass = '.control-drag-handle'
                    draggedCalculatorFieldClass = '.calculator-control-list'
                   
                }else if(mainField){
                    dragField = event.target.closest('.calculator-list');
                    draggedCalculatorClass = '.calculator'
                    draggedCalculatorButtonClass = '.drag-calculator-button'
                    draggedCalculatorFieldClass = '.calculator-list'
                    
                }
                if(this.advansedDraggable.checked){

                if(event.target.closest(draggedCalculatorButtonClass)){
                    isDragAllowed = true
                    event.target.closest(draggedCalculatorClass).setAttribute("draggable", isDragAllowed)
                    currentCalculator = event.target.closest(draggedCalculatorClass)
                }

    
                
                  }
                 if(!this.advansedDraggable.checked){
                if(event.target.closest(draggedCalculatorButtonClass)){
                    isDragAllowed = true
                    event.target.closest(draggedCalculatorClass).setAttribute("draggable", isDragAllowed)
                    currentCalculator = event.target.closest(draggedCalculatorClass)
                }
                }
            })
            document.addEventListener('mouseup', (event) =>{
                if(this.advansedDraggable.checked){
                if(!currentCalculator) return
                if(event.target.closest(draggedCalculatorButtonClass)){
                    isDragAllowed = false
                    event.target.closest(draggedCalculatorClass).setAttribute("draggable", isDragAllowed)
                    if(!isDragging){
                        currentCalculator = null
        
                    }
                }
             }                
                if(!this.advansedDraggable.checked){
                if(!currentCalculator) return
                if(event.target.closest(draggedCalculatorButtonClass)){
                    isDragAllowed = false
                    event.target.closest(draggedCalculatorClass).setAttribute("draggable", isDragAllowed)
                    if(!isDragging){
                        currentCalculator = null
        
                    }
                }
            }
            })
            document.addEventListener('dragstart', (event) =>{
            if(this.advansedDraggable.checked){
                if(!isDragAllowed){
                    event.preventDefault()
                    return
                }
                isDragging = true
                event.dataTransfer.setData("text/plain", currentCalculator.dataset.id);
    
                const dragPreview = currentCalculator.cloneNode(true);
                dragPreview.classList.add('drag-preview')
             }
            if(!this.advansedDraggable.checked){
                if(!isDragAllowed){
                    event.preventDefault()
                    return
                }
                isDragging = true
                event.dataTransfer.setData("text/plain", currentCalculator.dataset.id);
        
                const dragPreview = currentCalculator.cloneNode(true);
                dragPreview.classList.add('drag-preview')
        
            }
           
            })
            document.addEventListener('dragover', (event) => {
                
            if(this.advansedDraggable.checked){
                    event.preventDefault();
                const targetCalculator = event.target.closest(draggedCalculatorClass);
            
                if (!targetCalculator) return;
                if (!targetCalculator || targetCalculator === currentCalculator) return;
            
              
    
                dragField.querySelectorAll(`${draggedCalculatorClass}.drag-target`).forEach((calculator) => {
                    if (calculator !== targetCalculator) {
                        calculator.classList.remove('drag-target');
                    }
                });
                targetCalculator.classList.add('drag-target');
               
                targetCalculator.classList.add('advansed-style');
                
    
            }
            if(!this.advansedDraggable.checked && draggedCalculatorFieldClass === '.calculator-control-list'){
      
                event.preventDefault();
            
                const targetCalculator = event.target.closest(draggedCalculatorClass);
            
                if (!targetCalculator) return;
                if (!targetCalculator || targetCalculator === currentCalculator) return;
                const targetCalculatorRect = targetCalculator.getBoundingClientRect();
            
                let position = event.clientY - targetCalculatorRect.top;
                let targetCalculatorHalfHeight = targetCalculatorRect.height / 2;
            
                targetCalculator.classList.remove('drop-before', 'drop-after');
        
                dragField.querySelectorAll(`${draggedCalculatorClass}.drag-target`).forEach((calculator) => {
                    if (calculator !== targetCalculator) {
                        calculator.classList.remove('drag-target');
                    }
                });
                targetCalculator.classList.add('drag-target');
                    if (position < targetCalculatorHalfHeight) {
                        targetCalculator.classList.add('drop-before');
                    } else {
                        targetCalculator.classList.add('drop-after');
                    }
            }
            if(!this.advansedDraggable.checked && draggedCalculatorFieldClass === '.calculator-list'){
                event.preventDefault();
            
                const targetCalculator = event.target.closest('.calculator');
        
            
                if (!targetCalculator) return;
                if (!targetCalculator || targetCalculator === currentCalculator) return;
                const targetCalculatorRect = targetCalculator.getBoundingClientRect();
            
                let position = event.clientX - targetCalculatorRect.left;
                let targetCalculatorHalfWidth = targetCalculatorRect.width / 2;
        
                targetCalculator.classList.remove('advansed-style');
                targetCalculator.classList.remove('drop-before', 'drop-after');
        
                dragField.querySelectorAll('.calculator.drag-target').forEach((calculator) => {
                    if (calculator !== targetCalculator) {
                        calculator.classList.remove('drag-target');
                    }
                });
                targetCalculator.classList.add('drag-target');
            
    
                if (position < targetCalculatorHalfWidth) {
                    targetCalculator.classList.add('drop-before');
                } else {
                    targetCalculator.classList.add('drop-after');
                }
            }

            })
            document.addEventListener('dragleave', (event) => {
            if(this.advansedDraggable.checked){
                const targetCalculator = event.target.closest(draggedCalculatorClass);
                if (!targetCalculator) return;
                if (event.relatedTarget && targetCalculator.contains(event.relatedTarget)) {
                    return;
                }
                targetCalculator.classList.remove('drag-target');
                targetCalculator.classList.remove('advansed-style');
             }
            if(!this.advansedDraggable.checked){
                const targetCalculator = event.target.closest(draggedCalculatorClass);
                if (!targetCalculator) return;
                if (event.relatedTarget && targetCalculator.contains(event.relatedTarget)) {
                    return;
                }
                targetCalculator.classList.remove('drag-target');
                targetCalculator.classList.remove('drop-before', 'drop-after','advansed-style');
            }
            })
            document.addEventListener('drop', (event) =>{
                if(this.advansedDraggable.checked){
                const calcId = event.dataTransfer.getData("text/plain")
    
                const draggedCaculator = dragField.querySelector(`[data-id="${calcId}"]`);
                const targetCaculator = event.target.closest(draggedCalculatorClass)
    
    
    
                if(!draggedCaculator) return;
                if(draggedCaculator === targetCaculator) return;
    
                const fieldRect = dragField.getBoundingClientRect()
               
    
                 if(event.clientX >= fieldRect.left  && event.clientX <= fieldRect.right &&
                    event.clientY >= fieldRect.top && event.clientY <= fieldRect.bottom
                 ){
                   
                 
                    if(targetCaculator){
                        const targetCaulatorRect = targetCaculator.getBoundingClientRect()
    
                       
                        const ids = Array.from(
                            dragField.querySelectorAll(`${draggedCalculatorClass}[data-id]`),
                            el => el.dataset.id
                          );
                       const draggedCaculatorNumber = ids.indexOf(calcId)
                       const targetCaculatorNumber = ids.indexOf(targetCaculator.dataset.id)
            
                          if(draggedCalculatorClass === '.calculator-control-row'){
                            if(targetCaculatorNumber + 1  === draggedCaculatorNumber ){
                                targetCaculator.before(draggedCaculator)
                                return
                            }
    
                            if(event.clientY > targetCaulatorRect.top && event.clientY < targetCaulatorRect.bottom){
                                targetCaculator.after(draggedCaculator)
                                
                                return
                            }
                        }else if(draggedCalculatorClass === '.calculator'){
                          
                                if(targetCaculatorNumber + 1  === draggedCaculatorNumber){
                                    targetCaculator.before(draggedCaculator)
                                    return
                                }
                                if(event.clientX > targetCaulatorRect.left && event.clientX < targetCaulatorRect.right){
                                    targetCaculator.after(draggedCaculator)
                                    return
                                }
                        }
                
                    }else{
    
                        
                        const allCaculators = Array.from(dragField.querySelectorAll(draggedCalculatorClass)).filter(item => item.dataset.id !== draggedCaculator.dataset.id)
                        const lastCalculator = allCaculators[allCaculators.length - 1]
                        if(allCaculators.length == 0) return
                        const lastCalculatorRect = lastCalculator.getBoundingClientRect()
                        
                        if(draggedCalculatorClass === '.calculator-control-row'){
                           
                            if(event.clientY > lastCalculatorRect.bottom){
                            dragField.append(draggedCaculator)
                            return
                        }
    
                    
    
                     for( let i = 0; i < allCaculators.length -1; i ++){
                            const caculatorRect = allCaculators[i].getBoundingClientRect()
            
                            if(caculatorRect.bottom < event.clientY){
                                allCaculators[i].after(draggedCaculator)
                                return
                            } else if(event.clientY < caculatorRect.top){
                                dragField.prepend(draggedCaculator)
                            return
                        }
                     }
    
                        }else if(draggedCalculatorClass === '.calculator'){
                            if(event.clientX > lastCalculatorRect.right){
                                dragField.append(draggedCaculator)
                                return
                            }
        
                            for( let i = 0; i < allCaculators.length -1; i ++){
                                const caculatorRect = allCaculators[i].getBoundingClientRect()
                
                                if(caculatorRect.right < event.clientX){
                                    allCaculators[i].after(draggedCaculator)
                                    return
                                } else if(event.clientX < caculatorRect.left){
                                dragField.prepend(draggedCaculator)
                                return
                            }
                         }
                        }
                    }
                 } 
                }
                if(!this.advansedDraggable.checked  && draggedCalculatorFieldClass === '.calculator-control-list'){
                const calcId = event.dataTransfer.getData("text/plain")

                const draggedCaculator = dragField.querySelector(`[data-id="${calcId}"]`);
                const targetCaculator = event.target.closest(draggedCalculatorClass)
        
        
        
                if(!draggedCaculator) return;
                if(draggedCaculator === targetCaculator) return;
        
                const fieldRect = dragField.getBoundingClientRect()
        
        
                 if(event.clientX >= fieldRect.left  && event.clientX <= fieldRect.right &&
                    event.clientY >= fieldRect.top && event.clientY <= fieldRect.bottom
                 ){
                    
                    if(targetCaculator){
                        const targetCaulatorRect = targetCaculator.getBoundingClientRect()
        
                        let position = event.clientY - targetCaulatorRect.top
        
                        let targetCaculatorWidthHapfPart = targetCaulatorRect.height / 2
        

                        if(position >= targetCaculatorWidthHapfPart){
                            targetCaculator.after(draggedCaculator)
                        }else{
                            targetCaculator.before(draggedCaculator)
                        }
                
                    }else{
        
                        const allCaculators = Array.from(dragField.querySelectorAll(draggedCalculatorClass)).filter(item => item.dataset.id !== draggedCaculator.dataset.id)
                        
                        const lastCalculator = allCaculators[allCaculators.length - 1]
        
                        if(allCaculators.length == 0) return
                        const lastCalculatorRect = lastCalculator.getBoundingClientRect()
        
                        
        
                        if(event.clientY > lastCalculatorRect.button){
        
        
                            dragField.append(draggedCaculator)
                            return
                        }
        
                        for( let i = 0; i < allCaculators.length -1; i ++){
                            const caculatorRect = allCaculators[i].getBoundingClientRect()
            
                            if(caculatorRect.button < event.clientY){
                                allCaculators[i].after(draggedCaculator)
                                return
                            } else if(event.clientY < caculatorRect.top){
                                dragField.prepend(draggedCaculator)
                            return
                        }
                     }
                    }
                 }
        
          
                 dragField.querySelectorAll(draggedCalculatorClass).forEach((calculator) => {
                    calculator.classList.remove('drop-before', 'drop-after');
                });
                }
                if(!this.advansedDraggable.checked && draggedCalculatorFieldClass === '.calculator-list'){

                    const calcId = event.dataTransfer.getData("text/plain")
            
                        const draggedCaculator = dragField.querySelector(`[data-id="${calcId}"]`);
                        const targetCaculator = event.target.closest('.calculator')
                        if(!draggedCaculator) return;
                        if(draggedCaculator === targetCaculator) return;
            
                        const fieldRect = dragField.getBoundingClientRect()
            
            
              
            
                         if(event.clientX >= fieldRect.left  && event.clientX <= fieldRect.right &&
                            event.clientY >= fieldRect.top && event.clientY <= fieldRect.bottom
                         ){
            
                            if(targetCaculator){
            
                                const targetCaulatorRect = targetCaculator.getBoundingClientRect()
                                let position = event.clientX - targetCaulatorRect.left
            
                                let targetCaculatorWidthHapfPart = targetCaulatorRect.width / 2
            
                                if(position >= targetCaculatorWidthHapfPart){
                                    targetCaculator.after(draggedCaculator)
                                }else{
                                    targetCaculator.before(draggedCaculator)
                                }
                          
                            }else{
                                const allCaculators = Array.from(dragField.querySelectorAll(".calculator")).filter(item => item.dataset.id !== draggedCaculator.dataset.id)
                                
                                const lastCalculator = allCaculators[allCaculators.length - 1]
            
                                if(allCaculators.length == 0) return
                                const lastCalculatorRect = lastCalculator.getBoundingClientRect()
            
                                if(event.clientX > lastCalculatorRect.right){
                                    dragField.append(draggedCaculator)
                                    return
                                }
            
                                for( let i = 0; i < allCaculators.length -1; i ++){
                                    const caculatorRect = allCaculators[i].getBoundingClientRect()
                    
                                    if(caculatorRect.right < event.clientX){
                                        allCaculators[i].after(draggedCaculator)
                                        return
                                    } else if(event.clientX < caculatorRect.left){
                                        dragField.prepend(draggedCaculator)
                                    return
                                }
                             }
                            }
                         }
                         dragField.querySelectorAll('.calculator').forEach((calculator) => {
                            calculator.classList.remove('drop-before', 'drop-after');
                            
                            
                    });
                }
            })
            document.addEventListener('dragend', (event) =>{
                isDragAllowed = false
                isDragging = false;
                if(this.advansedDraggable.checked){
                    event.target.closest(draggedCalculatorClass).setAttribute("draggable", isDragAllowed)
                    currentCalculator = null
                    dragField.querySelectorAll(draggedCalculatorClass).forEach((calculator) => {
                        calculator.classList.remove('drag-target', 'advansed-style');
                    });
                    if(draggedCalculatorClass === '.calculator-control-row'){
                        this.moveCalculator(true)
                    }else if(draggedCalculatorClass === '.calculator'){
                        this.moveCalculator()
                    }
                }
                if(!this.advansedDraggable.checked){
                    event.target.closest(draggedCalculatorClass).setAttribute("draggable", isDragAllowed)
                    currentCalculator = null
                    dragField.querySelectorAll(draggedCalculatorClass).forEach((calculator) => {
                        calculator.classList.remove('drag-target', 'drop-before', 'drop-after', 'advansed-style');
                    });
                    if(draggedCalculatorClass === '.calculator-control-row'){
                        this.moveCalculator(true)
                    }else if(draggedCalculatorClass === '.calculator'){
                        this.moveCalculator()
                    }
                }            
            })    
        };

    /* -------------------- Rendering -------------------- */
    this.renderCards = function() {
        // TODO: display this.calculators as cards.
        // You can adapt your existing Calculator class for this view.
        //clean caculatores field
        this.cards.innerHTML = "";
      
        this.calculators.forEach(item => {
            const clone = this.calculatorTemplate.content.cloneNode(true);
            clone.querySelector(".calculator").dataset.id = item.id;
  
            clone.querySelector(".calculator-window-title").textContent  = item.title
            clone.querySelector(".first-number").value = item.a;
            clone.querySelector(".second-number").value = item.b;

            const calculatorContent = clone.querySelector(".calculator-content");
            const minimizedContent = clone.querySelector(".calculator-minimized-content");
            const minimizedResult = clone.querySelector(".calculator-minimized-result");
            const minimizeButton = clone.querySelector(".minimize-calculator-button")

            

            if(item.minimized){
                calculatorContent.hidden = true;
                minimizedContent.hidden = false;
                minimizeButton.textContent = "+"

            }else{
                calculatorContent.hidden = false;
                minimizedContent.hidden = true;
                minimizeButton.textContent = "-"
            }
        
            if(item.minimized){
                if((item.result === "" && item.error == "")) {
                    minimizedResult.textContent = "-"
                }else{
                    if(item.result === "" && item.error !== ""){
                        minimizedResult.textContent = item.error
                        minimizedResult.classList.toggle("error-message", item.error !== "");
                    }else{
                        minimizedResult.textContent = `${item.a} ${item.operation} ${item.b} = ${item.result}`
                    }
                     
                }
               
            } else{
                minimizedResult.textContent = ""
            }


            //checkbox
            clone.querySelector(".clear-operator-checkbox").checked = item.resetOperation



            const operators = clone.querySelectorAll(".operator-option");
            operators.forEach((button) =>{
                if(button.dataset.operatorValue === item.operation){
                    button.setAttribute("aria-pressed", "true")
                }else{
                    button.setAttribute("aria-pressed", "false")
                }
            })



                 //result field 
             const resultField = clone.querySelector(".result")

            resultField.classList.toggle("error-message", item.error !== "");

            if (item.error !== "")  {
                resultField.textContent = item.error;
            }  else if (item.result !== "" && item.result != null) {
                resultField.textContent = item.result;
            } else {
                resultField.textContent = "—";
            }

            this.cards.append(clone)

        })

     
        
    };

    this.renderPanel = function() {
        // TODO: display the same array as control panel rows
        this.panel.innerHTML = ""
     
        this.calculators.forEach(item => {

            const clone = this.controlPanelTamplate.content.cloneNode(true);
            clone.querySelector(".calculator-control-row").dataset.id = item.id;
            const controlPanellResultField = clone.querySelector(".control-calculator-result")


            clone.querySelector(".control-calculator-title").value  = item.title
            if (item.result == null || item.result === "") {
                controlPanellResultField.textContent = "-"
            }else{
                controlPanellResultField.textContent =  `${item.a} ${item.operation} ${item.b} = ${item.result}`
            }
            if(item.minimized == false){
                clone.querySelector(".control-minimize-button").textContent = "Minimize"
            }else{
                clone.querySelector(".control-minimize-button").textContent = "Open"
            }

        //result field 
        const resultField = clone.querySelector(".control-calculator-result")

        resultField.classList.toggle("error-message", item.error !== "");
             
        if (item.error !== ""){
        resultField.textContent = item.error;
        }  else if (item.result !== "" && item.result != null) {
            resultField.textContent = item.result;
        } else {
         resultField.textContent = "—";
        }
            




            this.panel.appendChild(clone)
        })

        
    };

    this.render = function() {
        this.renderCards();
        this.renderPanel();
        this.updateCheckboxStyleForDrag()

    };

    this.updateCalculatorView = function(id) {
        const calculator = this.findCalculator(id);
        if (!calculator) return;
    
        const currentCard = this.cards.querySelector(
            `.calculator[data-id="${id}"]`
        );
    
        if (currentCard) {
            const resultField = currentCard.querySelector(".result");
    
            resultField.classList.toggle(
                "error-message",
                calculator.error !== ""
            );
    
            if (calculator.error !== "") {
                resultField.textContent = calculator.error;
            } else if (calculator.result !== "" && calculator.result != null) {
                resultField.textContent = calculator.result;
            } else {
                resultField.textContent = "—";
            }
        }

    
        this.renderPanel();
    };

    /* -------------------- Persistence -------------------- */
    this.saveCalculators = function() {
        // TODO: serialize this.calculators and handle storage errors.
        // Save data, not HTML or references to DOM elements.
     
        

        
        try{
            const calculatorList = JSON.stringify(this.calculators)
            localStorage.setItem("calculators",  calculatorList)
        }catch(error){
            console.error("Failed to save calculators:", error);
            return;
        }
        
        try{
            localStorage.setItem("nextId", this.nextId)
        }catch(error){
            console.error("Failed to save nextID:", error);
            return;
        }

        try{
           const aaa =  document.querySelector(".advansed-druggable").checked
            const checkedValue = JSON.stringify(aaa)
            
            localStorage.setItem("checkbox", checkedValue)
        }catch(error){
            console.error("Failed to save checkbox value:", error);
            return;
        }
    };

    this.loadCalculators = function() {
        // TODO: read, parse and validate saved data.
        // Restore nextId from the highest saved numeric ID.
        // Preserve an intentionally empty list.
        const currentCalculators = localStorage.getItem("calculators")
        if(currentCalculators === null) return

        let  validCalculators 
   
       
        try{
       const calculatorsList = JSON.parse(currentCalculators)
        if (!Array.isArray(calculatorsList)) return;
  
        const unitIDset = new Set()
         validCalculators = calculatorsList.filter(element =>{
           if(element === null ) return false;
           if(typeof element !== "object")  return false;
           if(Array.isArray(element)) return false;
           if(typeof element.id !== "string") return false;

           //---------------------------------------------//
           const parts = element.id.split("-")
           if(parts.length !== 2) return false;
           const idNumber = Number(parts[1]);
           if(!/^[0-9]+$/.test(parts[1])) return false;
           if(!Number.isSafeInteger(idNumber)) return false;
           if(String(idNumber) !== parts[1]) return false
           if(!element.id.startsWith("calc-") ) return false;
           if(idNumber <= 0) return false;
           if(unitIDset.has(idNumber)) return false;
           unitIDset.add(idNumber)
           
           return true
        }

        );
        
        }catch(error){
            console.error("Failed to load calculators:", error);
            return;
        }

        const arr = []
        validCalculators.forEach(element => {
            const parts = element.id.split("-")
            const idNumber = Number(parts[1])
            arr.push(idNumber)
            
        });
        

        

        let nextIDNumber
        let checkValue = false
        const lastNumber = localStorage.getItem("nextId")
        if(lastNumber != null ) {
             nextIDNumber = Number(lastNumber)
             if( Number.isSafeInteger(nextIDNumber) && nextIDNumber > 0 ){
                checkValue = true
             } 
        }

        const maxValue = Math.max(0, ...arr)
        if( !Number.isSafeInteger(maxValue +1 ) ) return
        if (checkValue) {
            if( !Number.isSafeInteger(nextIDNumber +1 ) ) return
            this.nextId = Math.max(maxValue + 1, nextIDNumber);
        } else {
            this.nextId = maxValue + 1;
        }
        this.calculators = validCalculators

        if(this.calculators.length === 0){
            this.nextId = 1
        }


        const currentstatus = localStorage.getItem('checkbox')

        if(currentstatus == null) return

        const value = JSON.parse(currentstatus)

        this.advansedDraggable.checked  = value


    };
   
    /* -------------------- Initialization -------------------- */
    this.init = function() {
        this.initVars();
        this.loadCalculators();
        this.bindEvents();
        this.render();
        this.initDrag();
      
    };

    this.init();
};
window.calculator = new window.CalculatorApp({
    cards: '.calculator-list',
    panel: '.calculator-control-list'
})



