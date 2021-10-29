let form = document.querySelector("form");
let result = document.querySelector("#result")
let resultContainer = document.querySelector("#resultContainer");
let body = document.querySelector('body')
localStorage.setItem("state", 0)
localStorage.setItem("operand1", 0)
localStorage.setItem("operand2", 0)
localStorage.setItem("operator", null)
let state = localStorage.getItem('state');
form.addEventListener("submit", perform)

//frontend was modeled as finita state machine


//function handles the state of frontend when some number is pressed
function updateResult(value) {
    //getting number after evaluating the result immedietly
    if (localStorage.getItem('state') == 4) {
        if (value == 0)
            document.querySelector("#result").innerText = 0;
        localStorage.setItem('state', 0)
    }
    //recieving first operand
    if (localStorage.getItem('state') == 0) {
        if (value != 0 && value != ".") {
            result.innerText = value
            localStorage.setItem('state', 1)
        } else {
            if (value == ".") {
                result.innerText += value
                localStorage.setItem('state', 1)
            }
        }
    }
    else {
        //accumilating on first or second operand
        if (localStorage.getItem('state') == 1 || localStorage.getItem('state') == 3) {
            if (value == ".") {
                if ((localStorage.getItem('state') == 1 && !document.querySelector("#result").innerText.includes(".")) || (localStorage.getItem('state') == 3 && !document.querySelector("#result").innerText.trim().split(" ")[2].includes(".")))
                    result.innerText += value
            } else {
                result.innerText += value
            }
        }
        else {
            //recieving firs digit of second operand
            if (localStorage.getItem('state') == 2) {
                document.querySelector("#result").innerText += " " + value
                localStorage.setItem('state', 3)
            }
        }
    }
}
//function handles state when recieving operators
function updateState(operator) {
    //recieving operator after evaluating the result immeditly
    if (localStorage.getItem('state') == 4) {
        localStorage.setItem('state', 1)
    }
    //recieving operator withot any firs operand aka 0
    if (localStorage.getItem('state') == 0) {
        localStorage.setItem('operand1', 0);
        localStorage.setItem('operator', operator);
        localStorage.setItem('state', 2);
        document.querySelector("#result").innerText += " " + operator;
    } else {
        //recieving operator after finishing first operand
        if (localStorage.getItem('state') == 1) {
            localStorage.setItem('operand1', document.querySelector("#result").innerText.trim())
            localStorage.setItem('operator', operator)
            localStorage.setItem('state', 2)
            document.querySelector("#result").innerText += " " + operator
        } else {
            //changing the operand
            if (localStorage.getItem('state') == 2) {
                localStorage.setItem('operator', operator);
                text = document.querySelector("#result").innerHTML.slice(0, -1)
                document.querySelector("#result").innerHTML = text + " " + operator;
            } else {
                //recieving operator after getting 2 operands aka execution
                if (localStorage.getItem('state') == 3) {
                    localStorage.setItem("operand2", document.querySelector("#result").innerText.trim().split(" ")[2])
                    perform(event, operator);

                }
            }
        }
    }
}
//function updates the state when recieving operand to calculate the result
function updateInner(result, operator) {
    localStorage.setItem('operator', operator);
    localStorage.setItem("operand1", result);
    localStorage.setItem("operand2", 0)
    localStorage.setItem('state', 2)
    document.querySelector("#result").innerText = result + " " + operator
}
//function performs post request with fetch api
function perform(event, operator = null) {
    event.preventDefault();
    if (localStorage.getItem('state') == 3) {
        localStorage.setItem("operand2", document.querySelector("#result").innerText.trim().split(" ")[2])
    }
    if (localStorage.getItem('state') == 0 || localStorage.getItem('state') == 1)
        return;
    fetch("http://127.0.0.1:5000", {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            operand1: localStorage.getItem('operand1'),
            operand2: localStorage.getItem('operand2'),
            operator: localStorage.getItem('operator')
        }),
    })
        .then((data) => data.json())
        .then((data) => {
            if (data[0].success) {
                if (operator == null) {
                    document.querySelector("#result").innerText = data[0].result
                    localStorage.setItem("operand1", result);
                    localStorage.setItem("operand2", 0)
                    localStorage.setItem("state", 4)
                }
                else {
                    updateInner(data[0].result, operator)
                }
            }
            else {
                document.querySelector("#result").innerText = 0
                localStorage.setItem('state', 0)
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        })
}

//function clear when clicking on AC
function clr() {
    localStorage.setItem("state", 0)
    localStorage.setItem("operand1", 0)
    localStorage.setItem("operand2", 0)
    localStorage.setItem("operator", null)
    document.querySelector("#result").innerText = "0"
}