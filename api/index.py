from flask import Flask, render_template, request
import numpy as np
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads/'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_audio():
    if 'audio' not in request.files:
        return 'No audio file uploaded', 400

    audio_file = request.files['audio']
    if audio_file.filename == '':
        return 'No audio file selected', 400

    if audio_file:
        filename = audio_file.filename
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        audio_file.save(file_path)
        # prediction = np.random.randint(2)
        # if prediction == 1:
        #     prediction_result = "Your audio suggests that the watch is a genuine Rolex based on the dataset we have."
        # else:
        #     prediction_result = "Your audio suggests that the watch is a genuine Rolex based on the dataset we have."  #not 

        # disclaimer = "Please note that this analysis is based on the available dataset and may not be conclusive.\n For a more definitive authentication, consult with a professional Rolex expert."

        # return f'{prediction_result} \n \n {disclaimer}'

    return f'Error uploading audio chunk'

if __name__ == '__main__':
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    app.run(debug=True)
