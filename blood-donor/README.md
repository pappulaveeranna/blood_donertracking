# Blood Donor Tracking System

A full-stack web application for managing blood donors with search functionality by blood group and location.

## Features

- **Donor Registration**: Register as a blood donor with complete details
- **Blood Group Search**: Search donors by blood group and location
- **Location-based Search**: Find nearby donors in specific cities
- **Contact Information**: Get donor contact details for emergency needs
- **Clean UI**: Modern, responsive design with intuitive navigation
- **Donor Management**: View all registered donors with filtering options

## Tech Stack

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- CORS enabled for cross-origin requests
- RESTful API design

### Frontend
- React.js with React Router
- Axios for API calls
- Lucide React for icons
- Responsive CSS Grid/Flexbox layout

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- Git

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Update the `.env` file with your MongoDB connection string:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Donors
- `GET /api/donors` - Get all donors with optional filters
- `GET /api/donors/:id` - Get donor by ID
- `POST /api/donors` - Create new donor
- `PUT /api/donors/:id` - Update donor
- `DELETE /api/donors/:id` - Delete donor
- `GET /api/donors/search/:bloodGroup` - Search donors by blood group and location

### Query Parameters
- `bloodGroup` - Filter by blood group (A+, A-, B+, B-, AB+, AB-, O+, O-)
- `city` - Filter by city name
- `state` - Filter by state name
- `available` - Filter by availability (true/false)

## Usage

1. **Home Page**: Overview of the application with statistics and navigation
2. **Search Donors**: Find donors by blood group and optionally by city
3. **Register as Donor**: Complete registration form for new donors
4. **All Donors**: View all registered donors with filtering options

## Database Schema

### Donor Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  phone: String (required),
  bloodGroup: String (required, enum),
  age: Number (18-65),
  weight: Number (min: 50),
  location: {
    address: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: { lat: Number, lng: Number }
  },
  lastDonation: Date,
  isAvailable: Boolean,
  medicalHistory: String
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.