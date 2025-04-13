import openai
from flask import Flask, request, jsonify

app = Flask(__name__)


openai.api_key = "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"

def summarise(content):
    try:
       
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  
            messages=[
                {"role": "system", "content": "You are a helpful assistant that summarizes reinforcement learning swarm data concisely."},
                {"role": "user", "content": f"Please summarize the following data from my RL swarm: {content}"}
            ],
            max_tokens=200
        )
      
        return response.choices[0].message["content"].strip()
    except Exception as e:
        return f"Error: {str(e)}"

@app.route("/summarise", methods=["POST"])
def get_summary():
    if request.method == "POST":
        data = request.get_json()  
        content = data.get("prompt", "")  
        if content:
          
            summary = summarise(content)  
            return jsonify({"summary": summary})  
        else:
            return jsonify({"error": "No prompt provided"}), 400 
    else:
        return jsonify({"message": "Please send a POST request with the data to /summarize."})

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
