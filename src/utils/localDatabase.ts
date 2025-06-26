import { v4 as uuidv4 } from 'uuid';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  created_at: string;
  is_active: boolean;
}

export interface AttendanceRecord {
  id: string;
  user_id: string;
  login_time: string;
  logout_time?: string;
  login_location_lat: number;
  login_location_lng: number;
  logout_location_lat?: number;
  logout_location_lng?: number;
  total_hours?: number;
  created_at: string;
}

class LocalStorageDatabase {
  private usersKey = 'kinster_users';
  private attendanceKey = 'kinster_attendance';

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize with default users if none exist
    const users = this.getUsers();
    if (users.length === 0) {
      const adminId = uuidv4();
      const userId = uuidv4();
      
      const defaultUsers: User[] = [
        {
          id: adminId,
          email: 'admin@kinster.com',
          password: 'admin123',
          name: 'Administrator',
          role: 'admin',
          created_at: new Date().toISOString(),
          is_active: true
        },
        {
          id: userId,
          email: 'user@kinster.com',
          password: 'user123',
          name: 'Test User',
          role: 'user',
          created_at: new Date().toISOString(),
          is_active: true
        }
      ];
      
      localStorage.setItem(this.usersKey, JSON.stringify(defaultUsers));
    }

    // Initialize attendance records if none exist
    const attendance = this.getStoredAttendanceRecords();
    if (attendance.length === 0) {
      localStorage.setItem(this.attendanceKey, JSON.stringify([]));
    }
  }

  private getUsers(): User[] {
    const users = localStorage.getItem(this.usersKey);
    return users ? JSON.parse(users) : [];
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  }

  private getStoredAttendanceRecords(): AttendanceRecord[] {
    const records = localStorage.getItem(this.attendanceKey);
    return records ? JSON.parse(records) : [];
  }

  private saveAttendanceRecords(records: AttendanceRecord[]): void {
    localStorage.setItem(this.attendanceKey, JSON.stringify(records));
  }

  // User management methods
  createUser(email: string, password: string, name: string, role: 'admin' | 'user' = 'user'): User {
    const users = this.getUsers();
    
    // Check if email already exists
    if (users.find(u => u.email === email)) {
      throw new Error('Email already exists');
    }

    const user: User = {
      id: uuidv4(),
      email,
      password,
      name,
      role,
      created_at: new Date().toISOString(),
      is_active: true
    };

    users.push(user);
    this.saveUsers(users);
    return user;
  }

  getUserByEmail(email: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.email === email) || null;
  }

  getUserById(id: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.id === id) || null;
  }

  getAllUsers(): User[] {
    return this.getUsers().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  updateUser(id: string, updates: Partial<User>): boolean {
    const users = this.getUsers();
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      return false;
    }

    users[userIndex] = { ...users[userIndex], ...updates };
    this.saveUsers(users);
    return true;
  }

  deleteUser(id: string): boolean {
    const users = this.getUsers();
    const filteredUsers = users.filter(u => u.id !== id);
    
    if (filteredUsers.length === users.length) {
      return false; // User not found
    }

    this.saveUsers(filteredUsers);
    
    // Also remove related attendance records
    const attendanceRecords = this.getStoredAttendanceRecords();
    const filteredAttendance = attendanceRecords.filter(r => r.user_id !== id);
    this.saveAttendanceRecords(filteredAttendance);
    
    return true;
  }

  // Attendance management methods
  createAttendanceRecord(
    userId: string,
    loginTime: string,
    loginLat: number,
    loginLng: number
  ): AttendanceRecord {
    const records = this.getStoredAttendanceRecords();
    
    const record: AttendanceRecord = {
      id: uuidv4(),
      user_id: userId,
      login_time: loginTime,
      login_location_lat: loginLat,
      login_location_lng: loginLng,
      created_at: new Date().toISOString()
    };

    records.push(record);
    this.saveAttendanceRecords(records);
    return record;
  }

  updateAttendanceLogout(
    recordId: string,
    logoutTime: string,
    logoutLat: number,
    logoutLng: number,
    totalHours: number
  ): boolean {
    const records = this.getStoredAttendanceRecords();
    const recordIndex = records.findIndex(r => r.id === recordId);
    
    if (recordIndex === -1) {
      return false;
    }

    records[recordIndex] = {
      ...records[recordIndex],
      logout_time: logoutTime,
      logout_location_lat: logoutLat,
      logout_location_lng: logoutLng,
      total_hours: totalHours
    };

    this.saveAttendanceRecords(records);
    return true;
  }

  getAttendanceRecords(userId?: string): AttendanceRecord[] {
    const records = this.getStoredAttendanceRecords();
    
    if (userId) {
      return records.filter(r => r.user_id === userId)
        .sort((a, b) => new Date(b.login_time).getTime() - new Date(a.login_time).getTime());
    }
    
    return records.sort((a, b) => new Date(b.login_time).getTime() - new Date(a.login_time).getTime());
  }

  getActiveAttendanceRecord(userId: string): AttendanceRecord | null {
    const records = this.getStoredAttendanceRecords();
    return records.find(r => r.user_id === userId && !r.logout_time) || null;
  }

  getAttendanceWithUserDetails(): Array<AttendanceRecord & { user_name: string; user_email: string }> {
    const records = this.getStoredAttendanceRecords();
    const users = this.getUsers();
    
    return records.map(record => {
      const user = users.find(u => u.id === record.user_id);
      return {
        ...record,
        user_name: user?.name || 'Unknown User',
        user_email: user?.email || 'unknown@email.com'
      };
    }).sort((a, b) => new Date(b.login_time).getTime() - new Date(a.login_time).getTime());
  }

  close() {
    // No-op for localStorage implementation
  }
}

// Create and export a singleton instance
export const database = new LocalStorageDatabase();
export default database;
