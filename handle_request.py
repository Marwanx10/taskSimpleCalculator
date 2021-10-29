import json
import operator
from flask.json import jsonify

validOperands = {"+": operator.add, "-": operator.sub, "*": operator.mul,
                 "/": operator.truediv, "^": operator.pow, "%": operator.mod}

# simple handling of operands as evaluating them


def handleOperationRequest(data):
    try:
        data = json.loads(data.decode('utf-8'))
        if eval(data['operand1']) is not None and data['operator'] is not None and eval(data['operand2']) is not None:
            result = calculateResult(
                eval(data['operand1']), data['operator'], eval(data['operand2']))
            if result is not None:
                return jsonify({
                    "success": True,
                    "result": result
                }, 200)
            else:
                return jsonify({
                    "success": False,
                    "result": "Error in Inserted Data"
                }, 400)
        else:
            return jsonify({
                "success": False,
                "result": "Error in the inserted Data"
            }, 400)
    except Exception as e:
        return jsonify({
            "success": False,
            "result": "Error in inserted Data"
        }, 400)

# function that calculates the result


def calculateResult(operand1, operator, operand2):
    print(operator, operand1, operand2)
    if operator in validOperands.keys():
        return validOperands[operator](operand1, operand2)
