import sqlite3

conn = sqlite3.connect('app.db')
cursor = conn.cursor()

# Check alembic version
cursor.execute("SELECT * FROM alembic_version")
versions = cursor.fetchall()
print("Alembic versions:", versions)

# Get latest migration file
import os
migrations_dir = 'alembic/versions'
migration_files = [f for f in os.listdir(migrations_dir) if f.endswith('.py') and f != '__pycache__']
print("Migration files:", migration_files)

# Extract version IDs from migration files
version_ids = []
for f in migration_files:
    # Extract revision ID from filename or file content
    with open(os.path.join(migrations_dir, f), 'r') as mf:
        content = mf.read()
        if 'revision = ' in content:
            for line in content.split('\n'):
                if line.startswith('revision = '):
                    rev_id = line.split('=')[1].strip().strip('"\'')
                    version_ids.append(rev_id)
                    break

print("Version IDs found:", version_ids)

# Find head revisions (ones not referenced as down_revision in other files)
down_revisions = []
for f in migration_files:
    with open(os.path.join(migrations_dir, f), 'r') as mf:
        content = mf.read()
        for line in content.split('\n'):
            if line.startswith('down_revision = '):
                rev_id = line.split('=')[1].strip().strip('"\'')
                if rev_id:
                    down_revisions.append(rev_id)

print("Down revisions:", down_revisions)
heads = [v for v in version_ids if v not in down_revisions]
print("Head revisions:", heads)

conn.close()