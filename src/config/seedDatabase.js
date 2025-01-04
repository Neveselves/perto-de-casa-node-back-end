const Hall = require('../models/Hall');
const data = require('../models/data');

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Hall.deleteMany({});
    
    // Insert new data
    await Hall.insertMany(data.halls);
    
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

module.exports = seedDatabase;