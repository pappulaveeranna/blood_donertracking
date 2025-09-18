import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Donor from './models/Donor.js';

dotenv.config();

const sampleDonors = [
  {
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "+1234567890",
    bloodGroup: "O+",
    age: 28,
    weight: 70,
    location: {
      address: "123 Main Street",
      city: "New York",
      state: "NY",
      pincode: "10001"
    },
    isAvailable: true
  },
  {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1234567891",
    bloodGroup: "A+",
    age: 32,
    weight: 65,
    location: {
      address: "456 Oak Avenue",
      city: "Los Angeles",
      state: "CA",
      pincode: "90001"
    },
    isAvailable: true
  },
  {
    name: "Mike Davis",
    email: "mike.davis@email.com",
    phone: "+1234567892",
    bloodGroup: "B+",
    age: 25,
    weight: 75,
    location: {
      address: "789 Pine Road",
      city: "Chicago",
      state: "IL",
      pincode: "60601"
    },
    isAvailable: true
  },
  {
    name: "Emily Wilson",
    email: "emily.wilson@email.com",
    phone: "+1234567893",
    bloodGroup: "AB+",
    age: 29,
    weight: 60,
    location: {
      address: "321 Elm Street",
      city: "Houston",
      state: "TX",
      pincode: "77001"
    },
    isAvailable: true
  },
  {
    name: "David Brown",
    email: "david.brown@email.com",
    phone: "+1234567894",
    bloodGroup: "O-",
    age: 35,
    weight: 80,
    location: {
      address: "654 Maple Drive",
      city: "Phoenix",
      state: "AZ",
      pincode: "85001"
    },
    isAvailable: true
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Donor.deleteMany({});
    console.log('Cleared existing donors');

    // Insert sample data
    await Donor.insertMany(sampleDonors);
    console.log('Sample donors inserted successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();