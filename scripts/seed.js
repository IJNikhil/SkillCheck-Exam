import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load env
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, '../.env') });

const URL = process.env.VITE_GOOGLE_SCRIPT_URL;

if (!URL) {
    console.error("Error: VITE_GOOGLE_SCRIPT_URL not found in .env");
    process.exit(1);
}

const SAMPLE_STUDENTS = [
    { name: "Nikki Adam", phone: "9876543210" },
    { name: "John Doe", phone: "1234567890" },
    { name: "Jane Smith", phone: "5555555555" }
];

const seed = async () => {
    console.log(`Seeding data to: ${URL}`);
    console.log("Adding Students...");

    for (const student of SAMPLE_STUDENTS) {
        try {
            // Apps Script expects stringified JSON in body with a specific structure
            // depending on how we set up axios in api.js. 
            // Here we are using raw axios, so we match the doPost expectation:
            // doPost parses e.postData.contents

            const payload = JSON.stringify({
                action: 'addStudent',
                name: student.name,
                phone: student.phone
            });

            const res = await axios.post(URL, payload, {
                headers: { 'Content-Type': 'text/plain' }
            });

            if (res.data && res.data.success) {
                console.log(`✅ Added: ${student.name}`);
            } else {
                console.error(`❌ Failed: ${student.name}`, res.data);
            }
        } catch (err) {
            console.error(`❌ Error adding ${student.name}:`, err.response ? err.response.data : err.message);
        }
    }
    console.log("\n--- Seeding Complete ---");
    console.log("Note: Questions cannot be added via API. Please manually copy the data from SAMPLE_DATA.md to your Google Sheet.");
};

seed();
