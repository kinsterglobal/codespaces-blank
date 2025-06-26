# Kinster Attendance Tracking Application

A modern React TypeScript application for location-based attendance tracking and management, built with Vite and featuring a comprehensive admin panel.

## 🚀 Features

### User Features
- **Location-based Check-in/Check-out**: Uses GPS coordinates for precise attendance tracking
- **Real-time Location Tracking**: Automatic location detection with accuracy indicators
- **Attendance History**: View personal attendance records with working hours
- **Responsive Design**: Mobile-friendly interface for on-the-go usage

### Admin Features
- **User Management**: Create, edit, and delete user accounts
- **Real-time Monitoring**: Monitor all users' attendance and locations
- **Attendance Analytics**: View detailed attendance records with location data
- **Role Management**: Assign admin or user roles to accounts

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: SQLite (better-sqlite3)
- **Icons**: Lucide React
- **Forms**: React Hook Form + Yup validation
- **Notifications**: React Toastify
- **Date Handling**: date-fns
- **Routing**: React Router DOM
- **Location**: Geolocation Web API

## 📁 Project Structure

```
src/
├── components/         # Reusable UI components
├── pages/             # Main application pages
├── contexts/          # React contexts (Auth)
├── hooks/             # Custom React hooks
├── utils/             # Utility functions and database
└── types/             # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kinster-attendance
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

## 🔐 Default Credentials

### Admin Account
- **Email**: admin@kinster.com
- **Password**: admin123

### User Account
- **Email**: user@kinster.com
- **Password**: user123

## 📱 Usage

### For Users
1. **Login** with your credentials
2. **Allow location access** when prompted
3. **Clock In** to start tracking attendance
4. **Clock Out** when done working
5. **View history** in the attendance table

### For Admins
1. **Login** with admin credentials
2. **Manage Users**: Add, edit, or delete user accounts
3. **Monitor Attendance**: View real-time attendance data
4. **Track Locations**: See check-in/check-out locations
5. **Analyze Hours**: Review total working hours

## 🗄️ Database Schema

### Users Table
- `id`: Unique identifier
- `email`: User email (unique)
- `password`: Encrypted password
- `name`: Full name
- `role`: 'admin' or 'user'
- `created_at`: Account creation timestamp
- `is_active`: Account status

### Attendance Records Table
- `id`: Unique identifier
- `user_id`: Reference to user
- `login_time`: Check-in timestamp
- `logout_time`: Check-out timestamp (optional)
- `login_location_lat/lng`: Check-in coordinates
- `logout_location_lat/lng`: Check-out coordinates (optional)
- `total_hours`: Calculated working hours
- `created_at`: Record creation timestamp

## 🔧 Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

## 🌟 Key Features in Detail

### Location Tracking
- **High Accuracy GPS**: Uses enableHighAccuracy for precise positioning
- **Error Handling**: Graceful fallback when location access is denied
- **Real-time Updates**: Live location status indicators
- **Coordinate Display**: Shows latitude/longitude for transparency

### Attendance Management
- **Automatic Calculations**: Real-time working hours computation
- **Status Tracking**: Visual indicators for active/inactive sessions
- **Historical Data**: Complete attendance history with filtering
- **Export Ready**: Data structured for easy reporting

### Security Features
- **Role-based Access**: Separate interfaces for admin and users
- **Protected Routes**: Route guards based on authentication
- **Local Storage**: Secure session management
- **Input Validation**: Form validation with error handling

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Loading States**: Smooth loading indicators
- **Error Messages**: User-friendly error notifications
- **Toast Notifications**: Success and error feedback
- **Interactive Elements**: Hover effects and transitions

## 🔧 Configuration

The application is configured for:
- **Location Services**: Browser geolocation API
- **Database**: SQLite with better-sqlite3
- **Styling**: Tailwind CSS with custom configuration
- **Build Tool**: Vite with TypeScript support

## 📊 Performance Features

- **Lazy Loading**: Code splitting for optimal performance
- **Efficient Queries**: Optimized database queries
- **Minimal Re-renders**: Proper React optimization
- **Fast Builds**: Vite's lightning-fast build system

## 🛡️ Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Geolocation Support**: Requires browsers with location API
- **JavaScript**: ES6+ features supported
- **Responsive**: Mobile and desktop compatible

## 📝 Development Notes

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting (can be configured)
- **Git**: Version control with meaningful commits

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary.

---

**Kinster Attendance System** - Built with ❤️ using React, TypeScript, and modern web technologies.
