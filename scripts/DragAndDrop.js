function DragAndDrop(container, itemSelector, handleSelector) {

    this.container = container;
    this.itemSelector = itemSelector;
    this.handleSelector = handleSelector
  
}

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
    
    
            controlDragField.addEventListener('mousedown', (event) =>{

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
        
                controlDragField.querySelectorAll('.calculator-control-row.drag-target').forEach((calculator) => {
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
            
    
                if (position < targetCalculatorHalfWidth) {
                    targetCalculator.classList.add('drop-before');
                } else {
                    targetCalculator.classList.add('drop-after');
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