/* Learning skeleton: implement the methods marked TODO.
   Plain JavaScript. No jQuery or drag-and-drop libraries.
   Required HTML elements: #cards, #panel-list and #add.
   This is a structure to complete, not a working calculator.
   Load this file with <script src="calc4-skeleton.js" defer></script>. */

/* -------------------- Your drag-and-drop component -------------------- */
// Design and implement your own reusable drag-and-drop component.
// Use mousedown, mousemove and mouseup, without native HTML drag-and-drop.
// Reuse the same component for the cards and the control panel.
// Choose its methods, options and event contract yourself.
// Let CalculatorApp update the shared state and save the resulting order.

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

    this.initDrag = function() {

        // TODO: connect your drag-and-drop component to both views.
        // Choose how it reports the requested reorder to CalculatorApp.
        // Keep drag mechanics separate from calculator data and storage.
        const dragField = document.querySelector('.calculator-list')
        const controlDragField = document.querySelector(".calculator-control-list")

        

        //dragable value for calculators
        let isDragAllowed = false
        //dragstart value 
        let isDragging = false
        let currentCalculator = null


        //drag value for control panel
        let isDragAllowedInControlPanel = false
        //dragstart value 
        let isDraggingInControlPanel = false
        let currentCalculatorInControlPanel = null
        //checkbox valu for Switch to advaced draggable
        let isAdvasedOn = false



        controlDragField.addEventListener('mousedown', (event) =>{
            isAdvasedOn = this.advansedDraggable.checked
            if(event.target.closest('.control-drag-handle')){
                isDragAllowed = true
                event.target.closest('.calculator-control-row').setAttribute("draggable", isDragAllowed)
                currentCalculator = event.target.closest('.calculator-control-row')
            }

        })
        controlDragField.addEventListener('mouseup', (event) =>{
            if(!currentCalculator) return
            if(event.target.closest('.control-drag-handle')){
                isDragAllowed = false
                event.target.closest('.calculator-control-row').setAttribute("draggable", isDragAllowed)
                if(!isDragging){
                    currentCalculator = null
    
                }
            }
        })
        controlDragField.addEventListener('dragstart', (event) =>{
            if(!isDragAllowed){
                event.preventDefault()
                return
            }
            isDragging = true
            event.dataTransfer.setData("text/plain", currentCalculator.dataset.id);

            const dragPreview = currentCalculator.cloneNode(true);
            dragPreview.classList.add('drag-preview')

       
        })
        controlDragField.addEventListener('dragover', (event) => {
            event.preventDefault();
        
            const targetCalculator = event.target.closest('.calculator-control-row');
        
            if (!targetCalculator) return;
            if (!targetCalculator || targetCalculator === currentCalculator) return;
            const targetCalculatorRect = targetCalculator.getBoundingClientRect();
        
            let position = event.clientY - targetCalculatorRect.top;
            let targetCalculatorHalfHeight = targetCalculatorRect.height / 2;
        
            targetCalculator.classList.remove('drop-before', 'drop-after');

            controlDragField.querySelectorAll('.alculator-control-row.drag-target').forEach((calculator) => {
                if (calculator !== targetCalculator) {
                    calculator.classList.remove('drag-target');
                }
            });
            targetCalculator.classList.add('drag-target');
            if(!isAdvasedOn){
                if (position < targetCalculatorHalfHeight) {
                    targetCalculator.classList.add('drop-before');
                } else {
                    targetCalculator.classList.add('drop-after');
                }
            }else{
                targetCalculator.classList.add('advansed-style');
            }

           
        })
        controlDragField.addEventListener('dragleave', (event) => {
            const targetCalculator = event.target.closest('.calculator-control-row');
            if (!targetCalculator) return;
            if (event.relatedTarget && targetCalculator.contains(event.relatedTarget)) {
                return;
            }
            targetCalculator.classList.remove('drag-target');
            targetCalculator.classList.remove('drop-before', 'drop-after','advansed-style');
        })
        controlDragField.addEventListener('drop', (event) =>{
            const calcId = event.dataTransfer.getData("text/plain")

            const draggedCaculator = controlDragField.querySelector(`[data-id="${calcId}"]`);
            const targetCaculator = event.target.closest('.calculator-control-row')
            if(!draggedCaculator) return;
            if(draggedCaculator === targetCaculator) return;

            const fieldRect = controlDragField.getBoundingClientRect()
  

             if(event.clientX >= fieldRect.left  && event.clientX <= fieldRect.right &&
                event.clientY >= fieldRect.top && event.clientY <= fieldRect.bottom
             ){
                if(targetCaculator){
                    const targetCaulatorRect = targetCaculator.getBoundingClientRect()

                    let position = event.clientY - targetCaulatorRect.top

                    let targetCaculatorWidthHapfPart = targetCaulatorRect.height / 2


                                            
                    if(isAdvasedOn){
                        if(event.clientY > targetCaulatorRect.top && event.clientY < targetCaulatorRect.bottom){
                            targetCaculator.after(draggedCaculator)
                            return
                        }
                    }

                    if(position >= targetCaculatorWidthHapfPart){
                        targetCaculator.after(draggedCaculator)
                    }else{
                        targetCaculator.before(draggedCaculator)
                    }
              


                    
                }else{
                    const allCaculators = Array.from(controlDragField.querySelectorAll(".calculator-control-row")).filter(item => item.dataset.id !== draggedCaculator.dataset.id)
                    
                    const lastCalculator = allCaculators[allCaculators.length - 1]

                    if(allCaculators.length == 0) return
                    const lastCalculatorRect = lastCalculator.getBoundingClientRect()

                    if(event.clientY > lastCalculatorRect.button){
                        controlDragField.append(draggedCaculator)
                        return
                    }

                    for( let i = 0; i < allCaculators.length -1; i ++){
                        const caculatorRect = allCaculators[i].getBoundingClientRect()
        
                        if(caculatorRect.button < event.clientY){
                            allCaculators[i].after(draggedCaculator)
                            return
                        } else if(event.clientY < caculatorRect.top){
                            controlDragField.prepend(draggedCaculator)
                        return
                    }
                 }
                }
             }

            
             controlDragField.querySelectorAll('.calculator-control-row').forEach((calculator) => {
                calculator.classList.remove('drop-before', 'drop-after');
            });
        })
        controlDragField.addEventListener('dragend', (event) =>{
            isDragAllowed = false
            isDragging = false;
            event.target.closest('.calculator-control-row').setAttribute("draggable", isDragAllowed)
            currentCalculator = null
            controlDragField.querySelectorAll('.calculator-control-row').forEach((calculator) => {
                calculator.classList.remove('drag-target', 'drop-before', 'drop-after', 'advansed-style');
            });
            this.moveCalculator(true)
            
        })


        dragField.addEventListener('mousedown', (event) =>{
            isAdvasedOn = this.advansedDraggable.checked

            if(event.target.closest('.drag-calculator-button')){
                isDragAllowed = true
                event.target.closest('.calculator').setAttribute("draggable", isDragAllowed)
                currentCalculator = event.target.closest('.calculator')

               
            }
        })
        dragField.addEventListener('mouseup', (event) =>{
            if(!currentCalculator) return

            if(event.target.closest('.drag-calculator-button')){
                isDragAllowed = false
                event.target.closest('.calculator').setAttribute("draggable", isDragAllowed)
                if(!isDragging){
                    currentCalculator = null
        
                }
               
               

            }

        })
        dragField.addEventListener('dragstart', (event) =>{
            if(!isDragAllowed){
                event.preventDefault()
                return
            }
            isDragging = true
            event.dataTransfer.setData("text/plain", currentCalculator.dataset.id);
            
       
        })
        dragField.addEventListener('dragover', (event) => {
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
        
            if(!isAdvasedOn){
            if (position < targetCalculatorHalfWidth) {
                targetCalculator.classList.add('drop-before');
            } else {
                targetCalculator.classList.add('drop-after');
            }
            
        }else{
            targetCalculator.classList.add('advansed-style');
        }
            
          
           
        })
        dragField.addEventListener('dragleave', (event) => {

            const targetCalculator = event.target.closest('.calculator');
        
            if (!targetCalculator) return;
        
            if (event.relatedTarget && targetCalculator.contains(event.relatedTarget)) {
                return;
            }

            targetCalculator.classList.remove('drag-target');
            targetCalculator.classList.remove('drop-before', 'drop-after');
            targetCalculator.classList.remove('advansed-style');
        
        });
        dragField.addEventListener('drop', (event) =>{
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


                        
                        if(isAdvasedOn){
                            if(event.clientX > targetCaulatorRect.left && event.clientX < targetCaulatorRect.right){
                                targetCaculator.after(draggedCaculator)
                                return
                            }
                        }
    

    
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
    
        })
        dragField.addEventListener('dragend', (event) => {
            isDragAllowed = false
            isDragging = false;
            event.target.closest('.calculator').setAttribute("draggable", isDragAllowed)
            currentCalculator = null
            dragField.querySelectorAll('.calculator').forEach((calculator) => {
                calculator.classList.remove('drag-target', 'drop-before', 'drop-after', 'advansed-style');
            });
            this.moveCalculator()
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
