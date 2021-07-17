from flask import Flask, flash, redirect, render_template, request, session

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
	size = request.form["size"]
	src = dest = aux = [];
	
	for layer in range(size):
		src.append(size - layer)
	
	print(hanoi(size, src, dest, aux))
	
	return render_template("index.html")

def hanoi(disk, src, dest, aux):
	if disk == 1:
		src.pop()
		dest.append(disk)
	else:
		hanoi(disk - 1, src, aux, dest)
		src.pop()
		dest.append(disk)
		hanoi(disk - 1, aux, dest, source)
		
	return dest