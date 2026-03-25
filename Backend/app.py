from flask import Flask, jsonify, request, render_template #Uses flask to run the web server, using jsonify to convert Python data into a JSON format
#Request lets Flask read parameters from the URL, ADD HERE
import sqlite3 #Imports SQLite to connect to the database
import os #Imports operating system, to build file paths that are compatible on different devices

app = Flask(__name__) #Creates the flask app, ADD HERE


@app.route('/') #Tells flask to fun the function, directing the URL
def index():
    return render_template('index.html') #render_template() looks inside the /templates folder for 'index.html' and sends the content to the browser

@app.route('/TripPlanner') 
def trip_planner(): 
    return render_template('TripPlanner.html')

@app.route('/Results') 
def results(): 
    return render_template('Results.html') 

@app.route('/AboutUs')
def about():
    return render_template('AboutUs.html')

@app.route('/Contact')
def contact():
    return render_template('Contact.html')


@app.route('/api/activities') #The API that the Results page calls to get activities from from the database
def get_activities():
    category = request.args.get('category', '') #Reads the 'category' parameter from the URL, defaulting to '' if not provided
    date     = request.args.get('date', '') #Reads the 'date' parameter from the URL, defaulting to '' if not provided

    conn = sqlite3.connect(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'activities.db')) #Connects to the database file in the Backend folder, 'os.path.join' builds the full path regardless of operating system
    conn.row_factory = sqlite3.Row #Makes each row behave like a dictionary so columns can be accessed by name
    cursor = conn.cursor()

    if category and date: #Runs different SQL queries depending on the filters selected, i.e. it matches both category and date provided, in order to only display support groups on the specific dates
        cursor.execute('''
            SELECT * FROM activities 
            WHERE category = ? 
            AND (date = ? OR date = 'N/A')
        ''', (category, date))
    elif category: #If only a category was provided it would return all activities of that type regardless of date
        cursor.execute('SELECT * FROM activities WHERE category = ?', (category,))
    elif date: #If only a date was provided it would return all activities on that date and all ongoing activities
        cursor.execute('''
            SELECT * FROM activities 
            WHERE date = ? OR date = 'N/A'
        ''', (date,))
    else: #Will return every activity if no filters were selected
        cursor.execute('SELECT * FROM activities')

    rows = cursor.fetchall() #Fetches all the matching rows from the cursor into a Python list
    conn.close() #Closes the database connection

    activities = [dict(row) for row in rows] #Converts each Row object into a plain Python dictionary, as jsonify can't convert Row objects directly, therefore using a dictionary allows for writing a loop that transforms every item in a list
    return jsonify(activities) #Converts the list of dictionaries to a JSON response and sends it to the browser, where Flask automatically sets the 'Content-Type' header to 'application/json', so the browser knows it's receiving structured data, not HTML

if __name__ == '__main__': #Only runs the Flask development server if this file is run in the terminal
    app.run(debug=True) # debug=True enables auto-reloading when changes are saved and shown