const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./db/cars.db');

db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='cars'", (err, row) => {
    if (err) {
        console.error('Error checking for table:', err.message);
        db.close();
        return;
    }

    if (!row) {
        console.log("Creating 'cars' table and seeding data...");

        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS cars (
                id TEXT PRIMARY KEY,
                make TEXT NOT NULL,
                model TEXT NOT NULL,
                package TEXT,
                color TEXT, 
                year NUMBER NOT NULL,
                category TEXT NOT NULL,
                mileage NUMBER, 
                price NUMBER NOT NULL
            )`);


            let stmt = db.prepare("INSERT INTO cars (id, make, model, package, color, year, category, mileage, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");

            // Sample data
            stmt.run('ABC1234', 'Toyota', 'Camry', 'Standard', 'Black', 2021, 'Sedan', 5000, 2500000);
            stmt.run('XYZ5678', 'Honda', 'Civic', 'Sport', 'Red', 2020, 'Sedan', 10000, 2200000);

            stmt.finalize();
        });

        console.log("'cars' table created and data seeded successfully!");
    } else {
        console.log("'cars' table already exists. Skipping creation and seeding.");
    }

    db.close();
});
