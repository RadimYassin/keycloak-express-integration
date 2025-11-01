import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  keycloakId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  firstName: String,
  lastName: String,
  roles: [String],
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  preferences: {
    type: Map,
    of: String,
    default: {},
  },
}, {
  timestamps: true,
});

userSchema.index({ keycloakId: 1 });
userSchema.index({ email: 1 });

const User = mongoose.model('User', userSchema);

export default User;
