require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User.model');
const Product = require('../models/Product.model');
const StartupKit = require('../models/StartupKit.model');
const CommissionSetting = require('../models/CommissionSetting.model');

const seedData = async () => {
  try {
    await connectDB();
    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      StartupKit.deleteMany({}),
      CommissionSetting.deleteMany({})
    ]);

    // Create Admin
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@dreamstartup.in',
      phone: '9999999999',
      password: 'admin123',
      role: 'admin',
      city: 'Mumbai',
      state: 'Maharashtra',
      isVerified: true
    });
    console.log('Admin created: admin@dreamstartup.in / admin123');

    // Create Customer
    await User.create({
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      phone: '9876543210',
      password: 'password123',
      role: 'customer',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001'
    });
    console.log('Customer created: rajesh@example.com / password123');

    // Create Vendor
    await User.create({
      name: 'Suresh Carpenter',
      email: 'suresh@example.com',
      phone: '9876543211',
      password: 'password123',
      role: 'vendor',
      city: 'Pune',
      state: 'Maharashtra'
    });
    console.log('Vendor created: suresh@example.com / password123');

    // Products
    const products = [
      {
        title: 'Stainless Steel Door Handle - Premium',
        description: 'High-quality stainless steel door handle suitable for all types of doors. Durable finish with anti-rust coating. Perfect for homes and offices.',
        category: 'Furniture Hardware',
        brand: 'Godrej',
        wholesalePrice: 250,
        moq: 50,
        stock: 5000,
        featured: true,
        bulkPricingTiers: [
          { minQty: 50, maxQty: 199, price: 250 },
          { minQty: 200, maxQty: 499, price: 220 },
          { minQty: 500, price: 195 }
        ],
        specifications: { material: 'Stainless Steel 304', finish: 'Satin', length: '150mm', warranty: '5 years' },
        createdBy: admin._id
      },
      {
        title: 'Cabinet Hinge - Soft Close 165°',
        description: 'European style soft-close cabinet hinge. Full overlay, 165-degree opening angle. Ideal for modular kitchens.',
        category: 'Furniture Hardware',
        brand: 'Hettich',
        wholesalePrice: 85,
        moq: 100,
        stock: 10000,
        featured: true,
        bulkPricingTiers: [
          { minQty: 100, maxQty: 499, price: 85 },
          { minQty: 500, maxQty: 999, price: 72 },
          { minQty: 1000, price: 65 }
        ],
        specifications: { type: 'Soft Close', angle: '165°', overlay: 'Full', material: 'Steel with Nickel Plating' },
        createdBy: admin._id
      },
      {
        title: 'Telescopic Drawer Slide - 18 inch',
        description: 'Ball-bearing telescopic channel for smooth drawer operation. Heavy-duty 45kg load capacity.',
        category: 'Furniture Hardware',
        brand: 'Ebco',
        wholesalePrice: 320,
        moq: 25,
        stock: 3000,
        featured: false,
        bulkPricingTiers: [
          { minQty: 25, maxQty: 99, price: 320 },
          { minQty: 100, maxQty: 499, price: 285 },
          { minQty: 500, price: 260 }
        ],
        specifications: { length: '18 inch / 450mm', loadCapacity: '45 kg', type: 'Full Extension', material: 'Cold Rolled Steel' },
        createdBy: admin._id
      },
      {
        title: 'CP Pillar Cock - Swan Neck',
        description: 'Chrome plated brass pillar cock with swan neck design. Suitable for wash basin. Quarter turn ceramic cartridge.',
        category: 'Sanitary',
        brand: 'Jaquar',
        wholesalePrice: 1200,
        moq: 10,
        stock: 500,
        featured: true,
        bulkPricingTiers: [
          { minQty: 10, maxQty: 49, price: 1200 },
          { minQty: 50, maxQty: 99, price: 1050 },
          { minQty: 100, price: 950 }
        ],
        specifications: { material: 'Brass', finish: 'Chrome Plated', type: 'Swan Neck', cartridge: 'Ceramic Quarter Turn' },
        createdBy: admin._id
      },
      {
        title: 'Wall Mixer with Shower - 3-in-1',
        description: 'Premium wall mixer with provision for overhead shower and hand shower. Brass body with chrome finish.',
        category: 'Sanitary',
        brand: 'Hindware',
        wholesalePrice: 3500,
        moq: 5,
        stock: 200,
        featured: true,
        bulkPricingTiers: [
          { minQty: 5, maxQty: 19, price: 3500 },
          { minQty: 20, maxQty: 49, price: 3100 },
          { minQty: 50, price: 2800 }
        ],
        specifications: { material: 'Brass', finish: 'Chrome', inlets: '2', type: '3-in-1 Wall Mixer' },
        createdBy: admin._id
      },
      {
        title: 'LED Panel Light - 18W Square',
        description: 'Slim LED panel light, 18 watt, cool daylight. Surface mount. Energy efficient with 50,000 hours lifespan.',
        category: 'Electrical',
        brand: 'Philips',
        wholesalePrice: 380,
        moq: 20,
        stock: 8000,
        featured: true,
        bulkPricingTiers: [
          { minQty: 20, maxQty: 99, price: 380 },
          { minQty: 100, maxQty: 499, price: 340 },
          { minQty: 500, price: 310 }
        ],
        specifications: { wattage: '18W', shape: 'Square', color: '6500K Cool Daylight', lifespan: '50000 hours' },
        createdBy: admin._id
      },
      {
        title: 'Modular Switch Board - 8 Module',
        description: '8-module modular switch plate with frame. White finish. Compatible with all standard modular switches.',
        category: 'Electrical',
        brand: 'Havells',
        wholesalePrice: 180,
        moq: 50,
        stock: 6000,
        featured: false,
        bulkPricingTiers: [
          { minQty: 50, maxQty: 199, price: 180 },
          { minQty: 200, maxQty: 499, price: 155 },
          { minQty: 500, price: 140 }
        ],
        specifications: { modules: '8', material: 'Polycarbonate', color: 'White', type: 'Modular Plate' },
        createdBy: admin._id
      },
      {
        title: 'Decorative Wall Sconce - Modern',
        description: 'Modern decorative wall sconce with warm LED light. Gold and black finish. Perfect for living room and bedroom decor.',
        category: 'Home Decor',
        brand: 'Fos Lighting',
        wholesalePrice: 950,
        moq: 10,
        stock: 400,
        featured: true,
        bulkPricingTiers: [
          { minQty: 10, maxQty: 49, price: 950 },
          { minQty: 50, maxQty: 99, price: 850 },
          { minQty: 100, price: 780 }
        ],
        specifications: { style: 'Modern', finish: 'Gold & Black', lightSource: 'LED E27', material: 'Metal + Glass' },
        createdBy: admin._id
      }
    ];

    for (const p of products) { await Product.create(p); }
    console.log(`${products.length} products seeded`);

    // Startup Kits
    const kits = [
      {
        title: 'Hardware Shop Setup',
        description: 'Complete hardware shop setup package including initial product stock, shop branding, GST registration assistance, trade license support, and digital marketing setup. Start your own furniture hardware business with our expert guidance.',
        category: 'Furniture Hardware',
        startingPrice: 500000,
        includedServices: [
          'Initial product stock worth ₹3,00,000',
          'GST registration assistance',
          'Shop/trade license guidance',
          'Shop branding & signboard',
          'Basic website setup',
          'Google My Business listing',
          'Supplier network access',
          'Business training (3 days)',
          '3 months support'
        ],
        isActive: true
      },
      {
        title: 'Sanitary Shop Setup',
        description: 'Turn-key sanitary ware shop setup. Get started with premium bathroom fittings stock, complete legal registration support, attractive shop branding, and marketing materials. Ideal for tier-2 and tier-3 cities.',
        category: 'Sanitary',
        startingPrice: 700000,
        includedServices: [
          'Initial product stock worth ₹4,50,000',
          'GST registration assistance',
          'Shop/trade license guidance',
          'Shop interior design consultation',
          'Shop branding & signboard',
          'Product display setup',
          'Website with product catalog',
          'Social media marketing setup',
          'Supplier network access',
          'Business training (5 days)',
          '6 months support'
        ],
        isActive: true
      },
      {
        title: 'Electrical Shop Setup',
        description: 'Complete electrical shop business package. Includes switchgear, wiring, lighting stock, all legal documentation support, branding, and online presence setup. Great opportunity in growing construction market.',
        category: 'Electrical',
        startingPrice: 400000,
        includedServices: [
          'Initial product stock worth ₹2,50,000',
          'GST registration assistance',
          'Shop/trade license guidance',
          'Electrical contractor license guidance',
          'Shop branding & signboard',
          'Basic website setup',
          'Supplier network access',
          'Business training (3 days)',
          '3 months support'
        ],
        isActive: true
      }
    ];

    for (const k of kits) { await StartupKit.create(k); }
    console.log(`${kits.length} startup kits seeded`);

    // Commission Settings
    await CommissionSetting.insertMany([
      { profession: 'carpenter', defaultCommissionRate: 10, active: true },
      { profession: 'electrician', defaultCommissionRate: 12, active: true },
      { profession: 'plumber', defaultCommissionRate: 12, active: true }
    ]);
    console.log('Commission settings seeded');

    console.log('\nSeed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
