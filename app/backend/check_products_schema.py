import sqlite3
conn = sqlite3.connect('app.db')
cursor = conn.cursor()
cursor.execute("PRAGMA table_info(products)")
columns = cursor.fetchall()
for col in columns:
    print(col)
cursor.execute("SELECT * FROM products LIMIT 5")
rows = cursor.fetchall()
print("\nProducts count in DB:", len(rows))
for row in rows:
    print(row)
conn.close()