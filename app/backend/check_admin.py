import sqlite3
conn = sqlite3.connect('app.db')
cursor = conn.cursor()
cursor.execute('SELECT id, email, login, role FROM users')
for row in cursor.fetchall():
    print(f"ID: {row[0]}, Email: {row[1]}, Login: {row[2]}, Role: {row[3]}")
conn.close()