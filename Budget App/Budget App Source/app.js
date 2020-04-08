
// *********************************______MODULE 1______*********************************
// invoked function -- Data privacy and won't interact with other code outside the function

//DUDGET CONTROLLER
var budgetController = (function(){
    
    //Function constructors expense and income:
    var Expense = function(id, description, value) {
        //objects
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1; //not defined
    };
    
    // calculates expense percentage
    Expense.prototype.calcPercentage = function(totalIncome) {
        
        if(totalIncome > 0) {       
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };
    
    //returns the calculated expense percentage 
    Expense.prototype.getPercentage= function() {
        return this.percentage;
    }
    
    var Income = function(id, description, value) {
        //objects
        this.id = id;
        this.description = description;
        this.value = value;
        
    };
    
    var calcualteTotal = function(type) {
        var sum = 0; //initial value
        data.allItems[type].forEach(function(cur) {
            sum += cur.value; //sum = sum + current value
        });
        data.totals[type] = sum; //set total of type (income or expenses) = to sum just calculated above
    };
    
    
    var data = {
        allItems: {
            
            exp: [], // all expenses in this array
            inc: []  // all incomes in this array
        },
        totals: {
            exp: 0,
            inc: 0    
        },
        budget: 0,
        percentage: -1 //does't exist at this point
    };
    
    return {
        addItem: function(type, des, val) {
            
            var newItem, ID; //Initialise variables
            
            //[1 2 3 4 5], next ID = 6
            //[1 2 4 6 8], next ID = 9
            //We want the last ID = last ID + 1  NB!!!!!!!!!!!!!!!!
            
            //ID = data.allItems[type][data.allItems[type].length -1].id // old ID
            
            // Create new ID
            if (data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length -1].id + 1; 
            
            } else {
                ID = 0;
            }
            
            // Create new item on'inc' or 'exp' type
            if(type === 'exp') {
                
                newItem = new Expense(ID, des, val); // des = designation
                
            } else if(type === 'inc') {
                newItem = new Income(ID, des, val);      
            }
            
            // Push it into our data structure
            data.allItems[type].push(newItem);
            
            // Return the new element
            return newItem;
        },
        
        deleteItem: function(type, id) {
            var ids, index;
            
            // id = 6
            //data.allItems[type][id];
            //ids = [1 2 4 6 8]
            //index = 3
            
            // .map creates a new array with the result of calling a function 
            ids = data.allItems[type].map(function(current) {
                
                // callback function
                return current.id; 
            });
            
            index = ids.indexOf(id);
            
            if (index !== -1) {
                //.splice changes the contents of an array, adding new elements while removing old el.
                data.allItems[type].splice(index, 1) //first argument = where we want to start deleting elements & second argument is how many elements we want to delete
            }
            
        },
        
        calculateBudget: function(){
          
            // calculate total income and expenses
            calcualteTotal('exp'); //expenses
            calcualteTotal('inc'); //income
            
            // calcualte the budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            
            // calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);

            } else {
                data.percentage = -1;

            }
            
            
        }, 
        
        calculatePercentages: function() {
            /*
            a = 20
            b = 10
            c = 40
            income = 100
            a = 20/100 = 20%
            b = 10/100 = 10%
            c = 40/100 = 40%
            */
            
            // calculate the expense percentage for each item in our object by calling calcPercentage function
            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentage(data.totals.inc); //send total income array
                
            });
            
        },
        
        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) { //store all percentages in a new array
                return cur.getPercentage();
            });
            return allPerc; // return the new array with the percentages
        },
        
        getBudget: function() {
            return {
                budget: data.budget, 
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
            
        },
        
        testing: function() {
            console.log(data);
        }
    };
    
})();

    



// *********************************______MODULE 2______*********************************

//UI CONTROLLER
var UIController = (function() {
    
    // manage strings easily
    var DOMstrings = {
        // now I only have to change the inputType and it will be updated throughout the document  (look at getInput fucntion to see how it is used as well as the line 74)
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn', // line 74
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'
    };
    
    var formatNumber = function(num, type) {
        
        var numSplit, int, dec;
            
        /*
        + or - before the number
        exactly 2 decimal numbers
        comma separatingthe thousands
            
        2310.4567 -> + 2,310.46
        2000 -> + 2,000.00
        */
            
        num = Math.abs(num); //store the absolute value of the number given
        num = num.toFixed(2); //method of the number prototype 'toFixed' -> returns a string value with (x) decimal numbers
            
        numSplit = num.split('.')
            
        int = numSplit[0]; //string
        if(int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3); //substr -> 1. index number where we start, 2.  length.  If input is 2310, output  2,310
        }
        
        dec = numSplit[1]; //string
      
        //type === 'exp' ? sign = '-' : sign = "+"; //sign
        if(int.length > 7) {
            int = int.substr(0, int.length - 7) + ',' + int.substr(int.length - 7, 7);
            console.log(int);
            console.log('a');
            
            if (int.length > 11) {
                int = int.substr(0, int.length - 11) + ',' + int.substr(int.length - 11, 11);
                console.log(int);
                console.log('b');
                
                if (int.length > 15) {
                    int = int.substr(0, int.length - 15) + ',' + int.substr(int.length - 15, 15);
                    console.log(int);
                    console.log('c');
                }
            }

        }
            
        return (type === 'exp' ? '-' : "+") + ' ' + int + '.' + dec; // return the formated number
            
    };
    
    //make are own forEach function for nodes
    var nodeListForEach = function(list, callback){
                
        for(var i = 0;i < list.length; i++) {
                    callback(list[i], i);
        }
    };
    
    return {
      getInput: function() {
        return {
            
            // we read the value of the type *NOTE* 
            type: document.querySelector(DOMstrings.inputType).value, //will be either inc or exp
            description: document.querySelector(DOMstrings.inputDescription).value,
            value: parseFloat(document.querySelector(DOMstrings.inputValue).value) // converst string to a number and allows for decimal numbers
          
        };
      },
        
        addListItem: function(obj, type){
            var html, newHtml, element;
            
            // Create HTML string with placeholder text (lets us see the text on the UI)
            
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>';
            } else if(type === 'exp') {
                element = DOMstrings.expensesContainer;
                
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }                
            
            // Replace the placeholder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
            
            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
            //beforeend inserst newHtml as the last child of the list
            
        },
        
        deleteListItem: function(selectorID, type) {
            var el;
            el = document.getElementById(selectorID); // the item we want to remove
            el.parentNode.removeChild(el) // remove the child element
            
        },
        
        clearFields: function() {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
            
            fieldsArr = Array.prototype.slice.call(fields); //trick to access slice function
            
            //for each changes each element in the array
            fieldsArr.forEach(function(current, index, array) {
                current.value = ""; //clears the field
            });
            
            fieldsArr[0].focus(); //set focus back to add description box 'inputDescription' in UI
        },
        
        displayBudget: function(obj){
            
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
            
            
            if (obj.percentage > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
                
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }
            
        },
        
        //Display percentages on UI
        displayPercentages: function(percentages) {
            
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel); // returns a node list.  In a DOM tree (where all of the HTML elements of our page are stored) each element is callled a node
            
            
            // we pass a callback function through it and execute list.length number of times
            nodeListForEach(fields, function(current, index){
                
                // if current percentage is greater than zero add '%' sign else only show '---'
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },
        
        displayMonth: function() {
            var now, year, month, months;
            
            now = new Date();
            //var christmas = new Date(2016, 11, 25;)
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            
            month = now.getMonth();
            year = now.getFullYear();
            document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
            
            
        },
        
        changedType: function() {
            
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue); 
            
            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus'); //toggle and when it not there and removes when its not there
            });
            
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },
        
        getDOMstrings: function(){
            return DOMstrings; //exposing the DOMstrings object into the public
        }
    };
    
})();




// *********************************______MODULE 3______*********************************

//GLOBAL APP CONTROLLER -- Main controller used to tell other modules what to do
var controller = (function(budgetCtrl, UICtrl) {
    
    var setupEventListeners = function() {
        //when inputBtn is clicked, add an item
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    
        //when the enter key is pressed, add an item
        document.addEventListener('keypress', function(event) { 
            if(event.keyCode === 13 || event.which === 13) {  // 'which' is for older browsers
                ctrlAddItem();
                       
            };
        });
        
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
    };
    
    
    var updateBudget = function() {
        
        //1. Calculate the budget
        budgetCtrl.calculateBudget();
        
        //2. Return the budget
        var budget = budgetCtrl.getBudget(); // stores the budget
        
        //3. Display the budget on the UI
        UICtrl.displayBudget(budget); // pass the object budget
        
    };
    
    var updatePercentages = function() {
        
        // 1. Calculate the percentages
        budgetCtrl.calculatePercentages();
        
        // 2. Read percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();
        
        // 3. Update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
        console.log(percentages);
        
    }
    
    var DOM = UICtrl.getDOMstrings(); // Retrieve DOMstrings exposed to the public in getDOMstrings function
    
    var ctrlAddItem  = function() {
        
        var input, newItem;
        
        // 1. get the filled input data
        input = UICtrl.getInput();
          
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) { //prevent inputs with no description and values with not a number (NaN) and must be more than zero
        
            // 2. Add the item to the budget controller
            var newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        
       
            // 3. Add the item to the UI
            UICtrl.addListItem(newItem, input.type);
        
            // 4. Clear the fields
            UICtrl.clearFields();
        
            // 5. Calculate and update budget
            updateBudget();
            
            // 6. Calculate and update percentages
            updatePercentages();
        }
    };
    
    //
    var ctrlDeleteItem = function(event) {
        
        var itemID, splitID, type, ID;
        
        //stores the id of the income parent node
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemID) {
            
            //inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);
            
            // 1. Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);
            
            // 2. Delete the item from the UI
            UICtrl.deleteListItem(itemID);
            
            // 3. Update and show the new budget
            updateBudget();
            
            // 4. Calculate and update percentages
            updatePercentages();
            
        }
        
        /*
        //shows the element where the event was fired
        console.log(event.target);
        
        //shows the parent node of the element where the event was fired    
        console.log(event.target.parentNode);
        
        //shows the div element we are interested in 'income' so that we can get the id    
        console.log(event.target.parentNode.parentNode.parentNode.parentNode.id);
        */
    };
    
    // return to public
    return {
        init: function() {
            console.log('Application has started.');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0, 
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };
    
})(budgetController, UIController);


// only line of code placed on the outside
//Initialiser
controller.init();  // without this line nothing is ever going to happen



































