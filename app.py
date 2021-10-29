from flask import Flask, render_template, request
from handle_request import *

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/", methods=["POST"])
def makeOperation():
    print(request.data)
    return handleOperationRequest(request.data)


if __name__ == "__main__":
    app.run(debug=True)
