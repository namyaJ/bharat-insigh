const fs = require('fs');
const path = require('path');

const NUM_ROWS = 100000;
const STATES = ['Andhra Pradesh', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Kerala', 'Rajasthan'];
const DEPARTMENTS = ['Agriculture', 'Health', 'Finance', 'Education', 'Transport'];
const STATUS = ['Active', 'Completed', 'Pending', 'Under Review'];

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateData() {
  const data = [];
  let idCounter = 1;
  const startYear = 2010;

  for (let i = 0; i < NUM_ROWS; i++) {
    const year = startYear + Math.floor(Math.random() * 15); // up to 2024
    
    data.push({
      id: `IND-${idCounter.toString().padStart(6, '0')}`,
      state: randomChoice(STATES),
      department: randomChoice(DEPARTMENTS),
      year: year,
      funding_crores: parseFloat((Math.random() * 500).toFixed(2)),
      status: randomChoice(STATUS),
      beneficiaries: Math.floor(Math.random() * 50000)
    });
    idCounter++;
  }

  return data;
}

const dirPath = path.resolve(__dirname, '..', 'public', 'data');
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

const dataFile = path.join(dirPath, 'dataset.json');
const generatedData = generateData();

fs.writeFileSync(dataFile, JSON.stringify(generatedData));
console.log(`Generated ${NUM_ROWS} rows of data.gov.in mock data at ${dataFile}`);
