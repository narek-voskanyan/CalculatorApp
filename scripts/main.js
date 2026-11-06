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

    this.moveCalculator = function() {
        // TODO: choose the arguments and update the array order.
        // Update both views and save the new order.
        // Convert data-attribute IDs to numbers if using numeric state IDs.

      
    };

    
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

            this.cards.appendChild(clone)

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
