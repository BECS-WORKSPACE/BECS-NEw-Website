const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
dotenv.config();

const runUpdate = async () => {
    const mongoURI = process.env.MONGO_URI || 'mongodb+srv://Becs2k26:Becs2k26@cluster0.hap0jpp.mongodb.net/?appName=Cluster0';
    await mongoose.connect(mongoURI);

    // Unarchive 1 rupee products
    const unarchived = await Product.updateMany(
        { sku: { $exists: false }, price: 1 }, 
        { $set: { status: 'Published' } }
    );
    console.log(`Unarchived ${unarchived.modifiedCount} 1-rupee products.`);

    // Archive other dummy products just to be safe
    const archived = await Product.updateMany(
        { sku: { $exists: false }, price: { $ne: 1 } }, 
        { $set: { status: 'Archived' } }
    );
    console.log(`Archived ${archived.modifiedCount} other dummy products.`);

    process.exit(0);
}
runUpdate();
