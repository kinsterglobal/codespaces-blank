import Database from 'better-sqlite3';
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

class DatabaseManager {
  private db: Database.Database;

  constructor() {
    this.db = new Database('kinster.db');
    this.initializeTables();
    this.seedData();
  }

  private initializeTables() {
    // Create users table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin', 'user')),
        created_at TEXT NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT 1
      )
    `);

    // Create attendance_records table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS attendance_records (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        login_time TEXT NOT NULL,
        logout_time TEXT,
        login_location_lat REAL NOT NULL,
        login_location_lng REAL NOT NULL,
        logout_location_lat REAL,
        logout_location_lng REAL,
        total_hours REAL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);
  }

  private seedData() {
    // Check if admin user exists
    const adminExists = this.db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('admin') as { count: number };
    
    if (adminExists.count === 0) {
      // Create default admin user
      const adminId = uuidv4();
      this.db.prepare(`
        INSERT INTO users (id, email, password, name, role, created_at, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(adminId, 'admin@kinster.com', 'admin123', 'Administrator', 'admin', new Date().toISOString(), true);

      // Create a sample user
      const userId = uuidv4();
      this.db.prepare(`
        INSERT INTO users (id, email, password, name, role, created_at, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(userId, 'user@kinster.com', 'user123', 'Test User', 'user', new Date().toISOString(), true);
    }
  }

  // User management methods
  createUser(email: string, password: string, name: string, role: 'admin' | 'user' = 'user'): User {
    const id = uuidv4();
    const created_at = new Date().toISOString();
    
    this.db.prepare(`
      INSERT INTO users (id, email, password, name, role, created_at, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, email, password, name, role, created_at, true);

    return { id, email, password, name, role, created_at, is_active: true };
  }

  getUserByEmail(email: string): User | null {
    return this.db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | null;
  }

  getUserById(id: string): User | null {
    return this.db.prepare('SELECT * FROM users WHERE id = ?').get(id) as User | null;
  }

  getAllUsers(): User[] {
    return this.db.prepare('SELECT * FROM users ORDER BY created_at DESC').all() as User[];
  }

  updateUser(id: string, updates: Partial<User>): boolean {
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    
    const result = this.db.prepare(`UPDATE users SET ${setClause} WHERE id = ?`).run(...values, id);
    return result.changes > 0;
  }

  deleteUser(id: string): boolean {
    const result = this.db.prepare('DELETE FROM users WHERE id = ?').run(id);
    return result.changes > 0;
  }

  // Attendance management methods
  createAttendanceRecord(
    userId: string,
    loginTime: string,
    loginLat: number,
    loginLng: number
  ): AttendanceRecord {
    const id = uuidv4();
    const created_at = new Date().toISOString();
    
    this.db.prepare(`
      INSERT INTO attendance_records (id, user_id, login_time, login_location_lat, login_location_lng, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, userId, loginTime, loginLat, loginLng, created_at);

    return {
      id,
      user_id: userId,
      login_time: loginTime,
      login_location_lat: loginLat,
      login_location_lng: loginLng,
      created_at
    };
  }

  updateAttendanceLogout(
    recordId: string,
    logoutTime: string,
    logoutLat: number,
    logoutLng: number,
    totalHours: number
  ): boolean {
    const result = this.db.prepare(`
      UPDATE attendance_records 
      SET logout_time = ?, logout_location_lat = ?, logout_location_lng = ?, total_hours = ?
      WHERE id = ?
    `).run(logoutTime, logoutLat, logoutLng, totalHours, recordId);
    
    return result.changes > 0;
  }

  getAttendanceRecords(userId?: string): AttendanceRecord[] {
    if (userId) {
      return this.db.prepare('SELECT * FROM attendance_records WHERE user_id = ? ORDER BY login_time DESC').all(userId) as AttendanceRecord[];
    }
    return this.db.prepare('SELECT * FROM attendance_records ORDER BY login_time DESC').all() as AttendanceRecord[];
  }

  getActiveAttendanceRecord(userId: string): AttendanceRecord | null {
    return this.db.prepare('SELECT * FROM attendance_records WHERE user_id = ? AND logout_time IS NULL ORDER BY login_time DESC LIMIT 1').get(userId) as AttendanceRecord | null;
  }

  getAttendanceWithUserDetails(): Array<AttendanceRecord & { user_name: string; user_email: string }> {
    return this.db.prepare(`
      SELECT 
        ar.*, 
        u.name as user_name, 
        u.email as user_email
      FROM attendance_records ar
      JOIN users u ON ar.user_id = u.id
      ORDER BY ar.login_time DESC
    `).all() as Array<AttendanceRecord & { user_name: string; user_email: string }>;
  }

  close() {
    this.db.close();
  }
}

// Create and export a singleton instance
export const database = new DatabaseManager();
export default database;
