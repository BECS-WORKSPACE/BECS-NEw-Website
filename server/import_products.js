const mongoose = require('mongoose');
const dotenv = require('dotenv');
const xlsx = require('xlsx');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Subcategory = require('./models/Subcategory');

dotenv.config();

function slugify(text) {
  if (!text) return '';
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

async function importExcel(filePath, mainCategory) {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet);
    
    const report = {
        totalSourceRows: data.length,
        imported: 0,
        updated: 0,
        skipped: 0,
        duplicates: 0,
        invalid: 0,
        missingSku: 0,
        missingPrice: 0,
        missingName: 0,
        missingCategory: 0
    };

    const uniqueSkus = new Set();
    
    for (const row of data) {
        try {
            const sku = row.PID;
            const name = row.name;
            const subcat = row.subcat;
            const price = parseFloat(row.price);
            const image = row.imglink;
            const description = row.description;

            if (!sku) {
                report.missingSku++;
                report.invalid++;
                report.skipped++;
                continue;
            }
            if (!name) {
                report.missingName++;
                report.invalid++;
                report.skipped++;
                continue;
            }
            if (isNaN(price)) {
                report.missingPrice++;
                report.invalid++;
                report.skipped++;
                continue;
            }
            if (!subcat) {
                report.missingCategory++;
                report.invalid++;
                report.skipped++;
                continue;
            }

            if (uniqueSkus.has(sku)) {
                report.duplicates++;
                report.skipped++;
                continue;
            }
            uniqueSkus.add(sku);

            const productData = {
                name: name,
                sku: sku,
                category: mainCategory,
                subcategory: subcat,
                price: price,
                originalPrice: price, // Since MRP is not there or same
                description: description || '',
                image: image || '',
                status: 'Published'
            };

            const existing = await Product.findOne({ sku: sku });
            if (existing) {
                await Product.updateOne({ sku: sku }, productData);
                report.updated++;
            } else {
                await Product.create(productData);
                report.imported++;
            }
        } catch (err) {
            console.error("Error importing row", row, err);
            report.skipped++;
        }
    }
    
    return report;
}

const runImport = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb+srv://Becs2k26:Becs2k26@cluster0.hap0jpp.mongodb.net/?appName=Cluster0';
    console.log(`Connecting to MongoDB...`);
    await mongoose.connect(mongoURI);

    // Make sure we have the main categories first (we might use string based category for Product schema as we modified it)
    console.log("Importing Electronics...");
    const elecReport = await importExcel('/tmp/excel_imports/electronics.xlsx', 'Electronics');
    console.log("ELECTRONICS REPORT:", elecReport);

    console.log("Importing Electrical...");
    const electReport = await importExcel('/tmp/excel_imports/electrical.xlsx', 'Electrical');
    console.log("ELECTRICAL REPORT:", electReport);

    const totalUniqueProducts = await Product.countDocuments();
    const totalElectronics = await Product.countDocuments({ category: 'Electronics' });
    const totalElectrical = await Product.countDocuments({ category: 'Electrical' });

    console.log("Total unique products:", totalUniqueProducts);
    console.log("Electronics products:", totalElectronics);
    console.log("Electrical products:", totalElectrical);

    console.log("Archiving dummy products...");
    // Archive Dummy products (dummy means they don't have a PID/sku in our new format)
    const result = await Product.updateMany(
        { sku: { $exists: false } },
        { $set: { status: 'Archived' } }
    );
    console.log(`Archived ${result.modifiedCount} dummy products.`);
    
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

runImport();
