import sqlite3
conn = sqlite3.connect('backend/app.db')
cursor = conn.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='site_content'")
print(cursor.fetchall())
conn.close()