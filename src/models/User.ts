import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  lastLogin: Date;
  displayNameHistory?: {
    previousName: string;
    changedAt: Date;
  }[];
  lastDisplayNameChange?: Date;
  deviceInfo?: {
    browser: string;
    os: string;
    device: string;
    userAgent: string;
  };
  ipAddress?: string;
  loginHistory?: {
    timestamp: Date;
    ipAddress: string;
    deviceInfo: {
      browser: string;
      os: string;
      device: string;
      userAgent: string;
    };
  }[];
}

const UserSchema = new Schema<IUser>({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  photoURL: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  displayNameHistory: [{
    previousName: String,
    changedAt: Date
  }],
  lastDisplayNameChange: {
    type: Date,
    default: null
  },
  deviceInfo: {
    browser: String,
    os: String,
    device: String,
    userAgent: String
  },
  ipAddress: String,
  loginHistory: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    ipAddress: String,
    deviceInfo: {
      browser: String,
      os: String,
      device: String,
      userAgent: String
    }
  }]
});

export default mongoose.model<IUser>('User', UserSchema); 