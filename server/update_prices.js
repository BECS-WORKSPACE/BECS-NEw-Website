const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
dotenv.config();

const runUpdate = async () => {
    const mongoURI = process.env.MONGO_URI || 'mongodb+srv://Becs2k26:Becs2k26@cluster0.hap0jpp.mongodb.net/?appName=Cluster0';
    await mongoose.connect(mongoURI);

    // Increase originalPrice by 10% for all products using raw db collection since mongoose updatePipeline is tricky
    const result = await Product.collection.updateMany(
        { sku: { $exists: true } }, 
        [ { $set: { originalPrice: { $round: [{ $multiply: ["$price", 1.1] }, 2] } } } ]
    );

    console.log(`Updated original prices for ${result.modifiedCount} products.`);
    process.exit(0);
}
runUpdate();
