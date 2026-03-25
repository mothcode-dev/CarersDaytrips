import sqlite3 #Imports SQLite Databases library
import csv #Imports library that allows file to read CSV files

conn = sqlite3.connect('activities.db') #Connects to the 'activities.db' file and creates it in the same folder, creating one if one doesn't exist
cursor = conn.cursor() #Creates a cursor object, in order to run SQL commands 

#Runs a SQL command to create the database table if it doesn't exist
cursor.execute(''' 
  CREATE TABLE IF NOT EXISTS activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT, 
    location TEXT,
    postcode TEXT,
    price TEXT,
    price_numeric REAL, 
    category TEXT,
    date TEXT,
    duration TEXT,
    duration_mins INTEGER,
    opening_hours TEXT,
    url TEXT,
    image TEXT
  )
''') #Each line defines a column - its name and the data type, with integer being a whole number, real being a decimal and text being a text string

cursor.execute('DELETE FROM activities') #Deletes all rows before importing new data, in order to prevent duplicates

with open('DaytripOptions.csv', newline='', encoding='latin-1') as f: #Opens the CSV file, using newline to prevent blank lines being made and encoding to read the £ 
    reader = csv.DictReader(f) #Reads each row as a dictionary, with the column headers being the keys
    for row in reader: #Loops through every row
        if not row['Activity Name'].strip(): #Jumps to the next row
            continue
        #Inserts one row into the activities table, with the ? acting as placeholders, where SQLite fills them 
        cursor.execute('''
            INSERT INTO activities (name, location, postcode, price, price_numeric, category, date, duration, duration_mins, opening_hours, url, image)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            row['Activity Name'].strip(), #Strip removes any spaces
            row['Location '].strip(),
            row['Postcode'].strip(),
            row['Price'].strip(),
            float(row['price_numeric']) if row.get('price_numeric') else 0, #Float converts strings i.e. 24 to a number
            row['Category'].strip(),
            row['Date'].strip(),
            row['Duration of Visit'].strip(),
            int(row['duration_mins']) if row.get('duration_mins') else None, #Int converts the string 210 to a number, defaulting to none if empty
            row['Opening Hours'].strip(),
            row['URL'].strip(),
            row['Image'].strip() if row.get('Image') else None #If there's no image filemname, stores null as an empty string
        ))

conn.commit() #Saves all INSERT operations permanently
conn.close() #Closes the database connection
print('Database created successfully!') #Prints a confirmation message to the terminal