# Just Bid It – Online Auction System

Welcome to **Just Bid It**, an online auction platform inspired by systems like eBay. Users can create accounts, post items for sale, bid on items, and manage auctions in real-time.

>  **Want to know what’s implemented?**  
> Check out the [Issues section](https://github.com/shashwatijha/oas/issues) (filter:  *is:issue state:closed* )or the included feature checklist to see the list of developed and planned features.

[![Watch the demo](https://img.youtube.com/vi/2yrfb0eTMiA/0.jpg)](https://youtu.be/2yrfb0eTMiA)

---

## Getting Started

### 1. Clone the Repository

### 2. Download MySQL Workbench

Download and install it from:
https://dev.mysql.com/downloads/workbench/

### 3. Setup Python Virtual Environment
```
cd server
python -m venv venv
```

**Activate the virtual environment:**
macOS/Linux : `source venv/bin/activate`
Windows : `.\venv\Scripts\activate`

### 4. Install Dependencies

`pip install -r requirements.txt`

### 5. Run the Server
```
cd server
python server.py
```
### 6. Run the Client
Open a new terminal window:
```
cd client
npm install
npm start
```

Your application will run at: http://localhost:8000

### 7. Setup Database in MySQL Workbench

Open MySQL Workbench
Create a new database and run the [createTable.sql SQL](https://github.com/shashwatijha/oas/blob/main/createTable.sql) setup script

**Make sure to update your database connection details in app.py if needed.**

