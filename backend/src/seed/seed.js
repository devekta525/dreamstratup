require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User.model');
const Product = require('../models/Product.model');
const StartupKit = require('../models/StartupKit.model');
const CommissionSetting = require('../models/CommissionSetting.model');
const Review = require('../models/Review.model');

const seedData = async () => {
  try {
    await connectDB();
    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      StartupKit.deleteMany({}),
      CommissionSetting.deleteMany({}),
      Review.deleteMany({})
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

    // Create Customers
    const customer1 = await User.create({
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

    const customer2 = await User.create({
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '9876543212',
      password: 'password123',
      role: 'customer',
      city: 'Bangalore',
      state: 'Karnataka',
      pincode: '560001'
    });
    console.log('Customer created: priya@example.com / password123');

    const customer3 = await User.create({
      name: 'Amit Patel',
      email: 'amit@example.com',
      phone: '9876543213',
      password: 'password123',
      role: 'customer',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380001'
    });
    console.log('Customer created: amit@example.com / password123');

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
        minPrice: 195,
        maxPrice: 250,
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
        minPrice: 65,
        maxPrice: 85,
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
        minPrice: 260,
        maxPrice: 320,
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
        minPrice: 950,
        maxPrice: 1200,
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
        minPrice: 2800,
        maxPrice: 3500,
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
        minPrice: 310,
        maxPrice: 380,
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
        minPrice: 140,
        maxPrice: 180,
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
        minPrice: 780,
        maxPrice: 950,
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
      },

      // ─── Additional Furniture Hardware ─────────────────────────────────
      {
        title: 'Mortise Door Lock Set - Brass Antique',
        description: 'Heavy-duty brass mortise lock set with 3 keys. Antique finish. Suitable for main doors and bedroom doors. 7-lever security mechanism.',
        category: 'Furniture Hardware',
        brand: 'Godrej',
        minPrice: 850,
        maxPrice: 1200,
        moq: 10,
        stock: 1500,
        featured: true,
        bulkPricingTiers: [
          { minQty: 10, maxQty: 49, price: 1200 },
          { minQty: 50, maxQty: 199, price: 1020 },
          { minQty: 200, price: 850 }
        ],
        specifications: { material: 'Solid Brass', finish: 'Antique', levers: '7', warranty: '10 years' },
        createdBy: admin._id
      },
      {
        title: 'Wardrobe Sliding Track - 6 Feet Aluminium',
        description: 'Premium aluminium sliding track for wardrobes. Smooth roller mechanism with soft-close buffer. Supports up to 80kg door weight.',
        category: 'Furniture Hardware',
        brand: 'Hafele',
        minPrice: 1400,
        maxPrice: 1850,
        moq: 10,
        stock: 800,
        featured: false,
        bulkPricingTiers: [
          { minQty: 10, maxQty: 49, price: 1850 },
          { minQty: 50, maxQty: 99, price: 1600 },
          { minQty: 100, price: 1400 }
        ],
        specifications: { material: 'Aluminium', length: '6 feet / 1828mm', loadCapacity: '80 kg', type: 'Soft Close Sliding' },
        createdBy: admin._id
      },
      {
        title: 'Furniture Leg - Stainless Steel Round 6 inch',
        description: 'Adjustable stainless steel sofa and cabinet legs. Anti-slip rubber pad at bottom. Sleek modern design with mirror polish finish.',
        category: 'Furniture Hardware',
        brand: 'Ebco',
        minPrice: 45,
        maxPrice: 75,
        moq: 100,
        stock: 20000,
        featured: false,
        bulkPricingTiers: [
          { minQty: 100, maxQty: 499, price: 75 },
          { minQty: 500, maxQty: 1999, price: 58 },
          { minQty: 2000, price: 45 }
        ],
        specifications: { material: 'SS 202', height: '6 inch / 150mm', finish: 'Mirror Polish', adjustable: 'Yes (±10mm)' },
        createdBy: admin._id
      },
      {
        title: 'Gas Spring Strut - Kitchen Cabinet Lift',
        description: 'Hydraulic gas spring for kitchen overhead cabinets. Smooth lift-up operation. 100N force, ideal for 60cm wide shutters.',
        category: 'Furniture Hardware',
        brand: 'Hettich',
        minPrice: 180,
        maxPrice: 260,
        moq: 25,
        stock: 5000,
        featured: false,
        bulkPricingTiers: [
          { minQty: 25, maxQty: 99, price: 260 },
          { minQty: 100, maxQty: 499, price: 215 },
          { minQty: 500, price: 180 }
        ],
        specifications: { force: '100N', length: '245mm', type: 'Hydraulic Gas Spring', material: 'Steel + Nylon' },
        createdBy: admin._id
      },
      {
        title: 'Euro Profile Cylinder Lock - 70mm',
        description: 'High-security euro profile cylinder with 5 dimple keys. Anti-pick, anti-bump, anti-drill. Brass body with nickel plating.',
        category: 'Furniture Hardware',
        brand: 'Dorset',
        minPrice: 320,
        maxPrice: 480,
        moq: 20,
        stock: 3000,
        featured: false,
        bulkPricingTiers: [
          { minQty: 20, maxQty: 99, price: 480 },
          { minQty: 100, maxQty: 299, price: 390 },
          { minQty: 300, price: 320 }
        ],
        specifications: { length: '70mm (35/35)', keys: '5 Dimple Keys', security: 'Anti-pick, Anti-bump', material: 'Brass + Nickel' },
        createdBy: admin._id
      },

      // ─── Additional Sanitary ───────────────────────────────────────────
      {
        title: 'Concealed Cistern Flush - Dual Flush',
        description: 'Wall-concealed flush tank with dual flush (3L/6L) mechanism. ABS plastic body. Slim design for easy wall mounting behind tiles.',
        category: 'Sanitary',
        brand: 'Jaquar',
        minPrice: 2200,
        maxPrice: 2900,
        moq: 5,
        stock: 300,
        featured: true,
        bulkPricingTiers: [
          { minQty: 5, maxQty: 19, price: 2900 },
          { minQty: 20, maxQty: 49, price: 2500 },
          { minQty: 50, price: 2200 }
        ],
        specifications: { flushVolume: '3L / 6L Dual', material: 'ABS Plastic', thickness: '90mm Slim', warranty: '7 years' },
        createdBy: admin._id
      },
      {
        title: 'Rain Shower Head - 8 Inch Square SS',
        description: 'Ultra-slim stainless steel rain shower head. 8 inch square design with anti-lime nozzles. Mirror chrome finish.',
        category: 'Sanitary',
        brand: 'Hindware',
        minPrice: 650,
        maxPrice: 950,
        moq: 10,
        stock: 1200,
        featured: false,
        bulkPricingTiers: [
          { minQty: 10, maxQty: 49, price: 950 },
          { minQty: 50, maxQty: 99, price: 780 },
          { minQty: 100, price: 650 }
        ],
        specifications: { size: '8 inch / 200mm', material: 'SS 304', finish: 'Mirror Chrome', nozzles: 'Anti-lime Silicone' },
        createdBy: admin._id
      },
      {
        title: 'Angle Valve - Heavy Body CP Brass',
        description: 'Heavy-duty chrome plated brass angle valve. Quarter turn ceramic disc. Wall flange included. Essential for wash basin and WC connections.',
        category: 'Sanitary',
        brand: 'Parryware',
        minPrice: 180,
        maxPrice: 280,
        moq: 50,
        stock: 8000,
        featured: false,
        bulkPricingTiers: [
          { minQty: 50, maxQty: 199, price: 280 },
          { minQty: 200, maxQty: 499, price: 225 },
          { minQty: 500, price: 180 }
        ],
        specifications: { size: '15mm / 1/2 inch', material: 'Brass', finish: 'Chrome Plated', disc: 'Ceramic Quarter Turn' },
        createdBy: admin._id
      },
      {
        title: 'PVC CPVC Pipe Fitting Kit - 20 Piece',
        description: 'Complete plumbing fitting kit with elbows, tees, couplers, and reducers. CPVC material rated for hot and cold water. ISI certified.',
        category: 'Sanitary',
        brand: 'Astral',
        minPrice: 350,
        maxPrice: 520,
        moq: 20,
        stock: 2500,
        featured: false,
        bulkPricingTiers: [
          { minQty: 20, maxQty: 99, price: 520 },
          { minQty: 100, maxQty: 299, price: 420 },
          { minQty: 300, price: 350 }
        ],
        specifications: { pieces: '20', material: 'CPVC', size: '15mm & 20mm', certification: 'ISI Certified' },
        createdBy: admin._id
      },
      {
        title: 'Wash Basin Pedestal - Ceramic White',
        description: 'Full pedestal wash basin in glossy white ceramic. 22x16 inch basin with overflow hole. Elegant design for bathroom and guest room.',
        category: 'Sanitary',
        brand: 'Cera',
        minPrice: 1100,
        maxPrice: 1600,
        moq: 5,
        stock: 250,
        featured: true,
        bulkPricingTiers: [
          { minQty: 5, maxQty: 19, price: 1600 },
          { minQty: 20, maxQty: 49, price: 1350 },
          { minQty: 50, price: 1100 }
        ],
        specifications: { size: '22x16 inch', material: 'Ceramic', color: 'Glossy White', type: 'Full Pedestal' },
        createdBy: admin._id
      },

      // ─── Additional Electrical ─────────────────────────────────────────
      {
        title: 'MCB Distribution Box - 8 Way Double Door',
        description: 'Double door MCB distribution box. Powder coated metal body. Suitable for 8 MCB modules. IP43 rated with DIN rail.',
        category: 'Electrical',
        brand: 'Havells',
        minPrice: 420,
        maxPrice: 580,
        moq: 10,
        stock: 2000,
        featured: false,
        bulkPricingTiers: [
          { minQty: 10, maxQty: 49, price: 580 },
          { minQty: 50, maxQty: 199, price: 490 },
          { minQty: 200, price: 420 }
        ],
        specifications: { ways: '8', material: 'Powder Coated Metal', rating: 'IP43', mounting: 'Surface / Flush' },
        createdBy: admin._id
      },
      {
        title: 'Copper Wire 1.5 sq mm - 90 Meter Roll',
        description: 'FR PVC insulated single core copper wire. 1.5 sq mm cross section. Flame retardant, ISI certified. Suitable for domestic wiring.',
        category: 'Electrical',
        brand: 'Polycab',
        minPrice: 1350,
        maxPrice: 1650,
        moq: 5,
        stock: 1500,
        featured: true,
        bulkPricingTiers: [
          { minQty: 5, maxQty: 19, price: 1650 },
          { minQty: 20, maxQty: 49, price: 1480 },
          { minQty: 50, price: 1350 }
        ],
        specifications: { area: '1.5 sq mm', length: '90 meters', insulation: 'FR PVC', certification: 'ISI IS:694' },
        createdBy: admin._id
      },
      {
        title: 'LED Bulb 9W - B22 Cool Daylight (Pack of 10)',
        description: 'Energy-efficient 9W LED bulb pack of 10. B22 bayonet base. 6500K cool daylight. 25,000 hours lifespan with 2-year warranty.',
        category: 'Electrical',
        brand: 'Philips',
        minPrice: 520,
        maxPrice: 700,
        moq: 20,
        stock: 10000,
        featured: true,
        bulkPricingTiers: [
          { minQty: 20, maxQty: 99, price: 700 },
          { minQty: 100, maxQty: 499, price: 600 },
          { minQty: 500, price: 520 }
        ],
        specifications: { wattage: '9W', base: 'B22', color: '6500K Cool Daylight', packSize: '10 Bulbs' },
        createdBy: admin._id
      },
      {
        title: 'Ceiling Fan Regulator - Electronic Step',
        description: '5-step electronic fan regulator. Compact modular size fits standard switch board. Low power consumption, silent operation.',
        category: 'Electrical',
        brand: 'Anchor',
        minPrice: 110,
        maxPrice: 165,
        moq: 50,
        stock: 7000,
        featured: false,
        bulkPricingTiers: [
          { minQty: 50, maxQty: 199, price: 165 },
          { minQty: 200, maxQty: 499, price: 135 },
          { minQty: 500, price: 110 }
        ],
        specifications: { steps: '5', type: 'Electronic', size: 'Modular 1M', power: 'Low Consumption' },
        createdBy: admin._id
      },
      {
        title: 'PVC Conduit Pipe 25mm - 3 Meter',
        description: 'Heavy gauge PVC electrical conduit pipe. 25mm diameter, 3-meter length. ISI certified, flame retardant. For concealed wiring.',
        category: 'Electrical',
        brand: 'Finolex',
        minPrice: 42,
        maxPrice: 65,
        moq: 100,
        stock: 15000,
        featured: false,
        bulkPricingTiers: [
          { minQty: 100, maxQty: 499, price: 65 },
          { minQty: 500, maxQty: 1999, price: 52 },
          { minQty: 2000, price: 42 }
        ],
        specifications: { diameter: '25mm', length: '3 meters', gauge: 'Heavy', certification: 'ISI Certified' },
        createdBy: admin._id
      },
      {
        title: 'Smart WiFi Switch - 4 Gang Touch Panel',
        description: '4-gang smart touch switch with WiFi control. Works with Alexa and Google Home. Tempered glass panel. Timer and schedule support.',
        category: 'Electrical',
        brand: 'Wipro',
        minPrice: 1800,
        maxPrice: 2400,
        moq: 5,
        stock: 600,
        featured: true,
        bulkPricingTiers: [
          { minQty: 5, maxQty: 19, price: 2400 },
          { minQty: 20, maxQty: 49, price: 2050 },
          { minQty: 50, price: 1800 }
        ],
        specifications: { gangs: '4', connectivity: 'WiFi 2.4GHz', compatibility: 'Alexa, Google Home', panel: 'Tempered Glass' },
        createdBy: admin._id
      },

      // ─── Additional Home Decor ─────────────────────────────────────────
      {
        title: 'Ceramic Flower Vase Set - 3 Piece Nordic',
        description: 'Set of 3 Nordic-style ceramic vases in matte white finish. Different heights (15cm, 20cm, 25cm). Perfect for living room and shelf decor.',
        category: 'Home Decor',
        brand: 'HomeKraft',
        minPrice: 450,
        maxPrice: 680,
        moq: 10,
        stock: 1200,
        featured: true,
        bulkPricingTiers: [
          { minQty: 10, maxQty: 49, price: 680 },
          { minQty: 50, maxQty: 99, price: 550 },
          { minQty: 100, price: 450 }
        ],
        specifications: { pieces: '3', material: 'Ceramic', finish: 'Matte White', heights: '15cm, 20cm, 25cm' },
        createdBy: admin._id
      },
      {
        title: 'Wall Mounted Floating Shelf - Set of 3',
        description: 'MDF floating shelves with PU coating. Set of 3 different sizes. Hidden bracket mounting. Load capacity 5kg each. Modern minimalist design.',
        category: 'Home Decor',
        brand: 'WoodCraft',
        minPrice: 380,
        maxPrice: 550,
        moq: 15,
        stock: 2000,
        featured: false,
        bulkPricingTiers: [
          { minQty: 15, maxQty: 49, price: 550 },
          { minQty: 50, maxQty: 149, price: 450 },
          { minQty: 150, price: 380 }
        ],
        specifications: { pieces: '3', material: 'MDF + PU Coating', loadCapacity: '5 kg each', mounting: 'Hidden Bracket' },
        createdBy: admin._id
      },
      {
        title: 'LED String Fairy Lights - 10 Meter Warm White',
        description: 'Copper wire LED string lights, 10 meters with 100 LEDs. USB powered with remote control. 8 lighting modes. Waterproof IP65.',
        category: 'Home Decor',
        brand: 'Quace',
        minPrice: 120,
        maxPrice: 195,
        moq: 50,
        stock: 12000,
        featured: false,
        bulkPricingTiers: [
          { minQty: 50, maxQty: 199, price: 195 },
          { minQty: 200, maxQty: 499, price: 155 },
          { minQty: 500, price: 120 }
        ],
        specifications: { length: '10 meters', LEDs: '100', power: 'USB', rating: 'IP65 Waterproof' },
        createdBy: admin._id
      },
      {
        title: 'Artificial Plant with Pot - Eucalyptus',
        description: 'Realistic artificial eucalyptus plant with cement pot. 45cm tall. UV resistant for both indoor and outdoor use. Zero maintenance greenery.',
        category: 'Home Decor',
        brand: 'GreenDeco',
        minPrice: 280,
        maxPrice: 420,
        moq: 20,
        stock: 3500,
        featured: false,
        bulkPricingTiers: [
          { minQty: 20, maxQty: 99, price: 420 },
          { minQty: 100, maxQty: 299, price: 340 },
          { minQty: 300, price: 280 }
        ],
        specifications: { height: '45cm', plant: 'Eucalyptus', pot: 'Cement', feature: 'UV Resistant' },
        createdBy: admin._id
      },
      {
        title: 'Decorative Wall Clock - 12 Inch Metal',
        description: 'Silent quartz wall clock with metal frame. 12-inch diameter. Roman numeral design with vintage gold finish. No ticking sound.',
        category: 'Home Decor',
        brand: 'Ajanta',
        minPrice: 350,
        maxPrice: 520,
        moq: 10,
        stock: 1800,
        featured: true,
        bulkPricingTiers: [
          { minQty: 10, maxQty: 49, price: 520 },
          { minQty: 50, maxQty: 99, price: 420 },
          { minQty: 100, price: 350 }
        ],
        specifications: { diameter: '12 inch', material: 'Metal Frame', movement: 'Silent Quartz', style: 'Roman Numeral Vintage' },
        createdBy: admin._id
      },
      {
        title: 'Macrame Wall Hanging - Boho Large',
        description: 'Handwoven macrame wall hanging in natural cotton rope. Large size 40x80cm. Boho style with wooden dowel. Perfect for living room and bedroom.',
        category: 'Home Decor',
        brand: 'CraftVilla',
        minPrice: 220,
        maxPrice: 380,
        moq: 15,
        stock: 2500,
        featured: false,
        bulkPricingTiers: [
          { minQty: 15, maxQty: 49, price: 380 },
          { minQty: 50, maxQty: 149, price: 290 },
          { minQty: 150, price: 220 }
        ],
        specifications: { size: '40x80 cm', material: 'Natural Cotton Rope', style: 'Boho', hanger: 'Wooden Dowel' },
        createdBy: admin._id
      }
    ];

    const createdProducts = [];
    for (const p of products) { createdProducts.push(await Product.create(p)); }
    console.log(`${createdProducts.length} products seeded`);

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

    // Reviews
    const customers = [customer1, customer2, customer3];
    const reviewComments = [
      { rating: 5, comment: 'Excellent quality product! Very durable and well-made. Will definitely order again in bulk.' },
      { rating: 4, comment: 'Good product for the price. Packaging was neat and delivery was on time. Slightly heavy though.' },
      { rating: 5, comment: 'Best wholesale deal I have found. Material quality is top-notch. Highly recommended for shop owners.' },
      { rating: 4, comment: 'Decent quality and competitive pricing. Good for retail business. Delivery could be faster.' },
      { rating: 3, comment: 'Average quality. Works fine but finish could be better. Acceptable for the price range.' },
      { rating: 5, comment: 'Outstanding product! My customers love it. Ordering more for next month.' },
      { rating: 4, comment: 'Solid build quality. Perfect for our construction projects. Bulk pricing is great.' },
      { rating: 5, comment: 'Premium quality at wholesale rates. Very satisfied with this purchase.' },
    ];

    let reviewCount = 0;
    for (let i = 0; i < Math.min(createdProducts.length, 15); i++) {
      const numReviews = Math.floor(Math.random() * 3) + 1; // 1-3 reviews per product
      for (let j = 0; j < numReviews; j++) {
        const customer = customers[j % customers.length];
        const rc = reviewComments[(i + j) % reviewComments.length];
        await Review.create({
          product: createdProducts[i]._id,
          user: customer._id,
          rating: rc.rating,
          comment: rc.comment,
        });
        reviewCount++;
      }
    }
    console.log(`${reviewCount} reviews seeded`);

    console.log('\nSeed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
