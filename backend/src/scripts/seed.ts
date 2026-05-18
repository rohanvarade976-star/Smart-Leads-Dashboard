import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';

dotenv.config();

const seed = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB for seeding');

    // Create or Reset Admin
    const adminEmail = 'admin@leads.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = new User({
        name: 'System Admin',
        email: adminEmail,
        password: 'adminpassword123',
        role: 'admin'
      });
      await admin.save();
      console.log('👤 Admin user created successfully:');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: adminpassword123`);
    } else {
      admin.password = 'adminpassword123';
      await admin.save();
      console.log('👤 Admin password reset to: adminpassword123');
    }

    // Create or Reset Sales User
    const salesEmail = 'sales@leads.com';
    let sales = await User.findOne({ email: salesEmail });
    if (!sales) {
      sales = new User({
        name: 'Sales Rep',
        email: salesEmail,
        password: 'salespassword123',
        role: 'sales'
      });
      await sales.save();
      console.log('👤 Sales user created successfully:');
      console.log(`   Email: ${salesEmail}`);
      console.log(`   Password: salespassword123`);
    } else {
      sales.password = 'salespassword123';
      await sales.save();
      console.log('👤 Sales password reset to: salespassword123');
    }

    await mongoose.disconnect();
    console.log('✅ Seeding completed and disconnected');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seed();
