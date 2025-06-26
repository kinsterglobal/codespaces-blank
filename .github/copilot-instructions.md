# Kinster Attendance Tracking Application

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a React TypeScript application built with Vite for location tracking and attendance management. The application includes:

- **User Authentication**: Separate login flows for admin and regular users
- **Location Tracking**: GPS-based check-in/check-out functionality
- **Attendance Management**: Real-time tracking of work hours and locations
- **Admin Panel**: User management and attendance monitoring
- **SQLite Database**: Local database storage using better-sqlite3

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: SQLite (better-sqlite3)
- **Icons**: Lucide React
- **Forms**: React Hook Form + Yup validation
- **Notifications**: React Toastify
- **Date Handling**: date-fns
- **Routing**: React Router DOM

## Key Features
1. **Location-based Attendance**: Uses browser geolocation API for precise clock-in/out
2. **Role-based Access**: Admin and user roles with different interfaces
3. **Real-time Tracking**: Live monitoring of employee locations and work hours
4. **Data Persistence**: SQLite database for reliable data storage
5. **Responsive Design**: Mobile-friendly interface using Tailwind CSS

## Database Schema
- **users**: id, email, password, name, role, created_at, is_active
- **attendance_records**: id, user_id, login_time, logout_time, login_location_lat, login_location_lng, logout_location_lat, logout_location_lng, total_hours, created_at

## Default Credentials
- **Admin**: admin@kinster.com / admin123
- **User**: user@kinster.com / user123

## Development Guidelines
- Use TypeScript for all new components
- Follow React functional components with hooks
- Use Tailwind CSS for styling
- Implement proper error handling and loading states
- Ensure location permissions are properly requested
- Maintain responsive design principles
