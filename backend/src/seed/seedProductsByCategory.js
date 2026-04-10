require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const connectDB = require('../config/db');
const Product = require('../models/Product.model');
const User = require('../models/User.model');

const CATEGORY_DATA = {
  'Furniture Hardware': [
    { title: 'Stainless Steel Door Handle Set', keyword: 'stainless door handle', subcategory: 'Handles', brand: 'Godrej' },
    { title: 'Soft Close Cabinet Hinge 165 Degree', keyword: 'cabinet hinge', subcategory: 'Hinges', brand: 'Hettich' },
    { title: 'Telescopic Drawer Channel 18 Inch', keyword: 'drawer slide', subcategory: 'Slides', brand: 'Ebco' },
    { title: 'Brass Mortise Main Door Lock', keyword: 'mortise lock', subcategory: 'Locks', brand: 'Dorset' },
    { title: 'Wardrobe Sliding Track Kit', keyword: 'sliding wardrobe track', subcategory: 'Slides', brand: 'Hafele' },
    { title: 'Hydraulic Gas Spring Cabinet Lift', keyword: 'gas spring cabinet', subcategory: 'Cabinet Fittings', brand: 'Hettich' },
    { title: 'Concealed Profile Cabinet Handle', keyword: 'concealed cabinet handle', subcategory: 'Handles', brand: 'Godrej' },
    { title: 'Magnetic Door Catch Pair', keyword: 'door magnetic catch', subcategory: 'Cabinet Fittings', brand: 'Ebco' },
    { title: 'Furniture Connector Bolt Nut Kit', keyword: 'furniture bolt connector', subcategory: 'Cabinet Fittings', brand: 'Hafele' },
    { title: 'Kitchen Tandem Basket Channel', keyword: 'kitchen pullout basket', subcategory: 'Slides', brand: 'Dorset' }
  ],
  Sanitary: [
    { title: 'Chrome Pillar Cock Faucet', keyword: 'bathroom faucet', subcategory: 'Faucets', brand: 'Jaquar' },
    { title: 'Square Rain Shower 8 Inch', keyword: 'rain shower head', subcategory: 'Showers', brand: 'Hindware' },
    { title: 'Dual Flush Concealed Cistern', keyword: 'flush cistern', subcategory: 'Flush Systems', brand: 'Parryware' },
    { title: 'Ceramic Pedestal Wash Basin', keyword: 'wash basin', subcategory: 'Basins', brand: 'Cera' },
    { title: 'Quarter Turn Brass Angle Valve', keyword: 'angle valve bathroom', subcategory: 'Valves', brand: 'Jaquar' },
    { title: 'Wall Mounted Bib Cock', keyword: 'bib cock tap', subcategory: 'Faucets', brand: 'Hindware' },
    { title: 'Flexible Braided Inlet Pipe', keyword: 'braided hose pipe', subcategory: 'Valves', brand: 'Astral' },
    { title: 'Hand Shower with Hose Kit', keyword: 'hand shower', subcategory: 'Showers', brand: 'Parryware' },
    { title: 'Health Faucet Jet Spray Set', keyword: 'health faucet', subcategory: 'Showers', brand: 'Cera' },
    { title: 'Bathroom Flush Push Plate', keyword: 'flush plate', subcategory: 'Flush Systems', brand: 'Jaquar' }
  ],
  Electrical: [
    { title: 'Electric Dry Iron 1200W', keyword: 'electric iron', subcategory: 'Small Appliances', brand: 'Philips' },
    { title: 'LED Panel Light 18W Square', keyword: 'led panel light', subcategory: 'Lighting', brand: 'Havells' },
    { title: 'Copper Wire 1.5 sq mm Roll', keyword: 'copper electrical wire', subcategory: 'Wires', brand: 'Polycab' },
    { title: '8 Way MCB Distribution Box', keyword: 'distribution box mcb', subcategory: 'Distribution', brand: 'Anchor' },
    { title: '4 Gang Smart WiFi Touch Switch', keyword: 'smart touch switch', subcategory: 'Smart Devices', brand: 'Wipro' },
    { title: 'LED Bulb 9W B22 Pack', keyword: 'led bulb', subcategory: 'Lighting', brand: 'Philips' },
    { title: '5 Step Electronic Fan Regulator', keyword: 'fan regulator switch', subcategory: 'Switches', brand: 'Anchor' },
    { title: 'PVC Electrical Conduit Pipe 25mm', keyword: 'electrical conduit pipe', subcategory: 'Wires', brand: 'Polycab' },
    { title: 'USB Modular Wall Socket', keyword: 'usb wall socket', subcategory: 'Switches', brand: 'Havells' },
    { title: 'COB Spot Downlight 12W', keyword: 'spot downlight', subcategory: 'Lighting', brand: 'Wipro' }
  ],
  'Home Decor': [
    { title: 'Nordic Ceramic Flower Vase Set', keyword: 'ceramic flower vase', subcategory: 'Table Decor', brand: 'HomeKraft' },
    { title: 'Metal Vintage Wall Clock 12 Inch', keyword: 'vintage wall clock', subcategory: 'Wall Decor', brand: 'Ajanta' },
    { title: 'Floating Wall Shelf Set of 3', keyword: 'floating wall shelf', subcategory: 'Storage Decor', brand: 'WoodCraft' },
    { title: 'Warm White Fairy String Lights', keyword: 'fairy lights decor', subcategory: 'Lighting Decor', brand: 'CraftVilla' },
    { title: 'Artificial Eucalyptus Plant Pot', keyword: 'artificial plant pot', subcategory: 'Plants', brand: 'GreenDeco' },
    { title: 'Boho Macrame Wall Hanging', keyword: 'macrame wall hanging', subcategory: 'Wall Decor', brand: 'CraftVilla' },
    { title: 'Decorative Table Lamp Shade', keyword: 'decor table lamp', subcategory: 'Lighting Decor', brand: 'HomeKraft' },
    { title: 'Abstract Canvas Wall Art Frame', keyword: 'canvas wall art', subcategory: 'Wall Decor', brand: 'WoodCraft' },
    { title: 'Aroma Diffuser Home Piece', keyword: 'aroma diffuser decor', subcategory: 'Table Decor', brand: 'GreenDeco' },
    { title: 'Minimal Wooden Photo Frame Combo', keyword: 'wooden photo frame', subcategory: 'Table Decor', brand: 'Ajanta' }
  ]
};

function onlineImages(keyword, idx) {
  const q = encodeURIComponent(keyword);
  return [
    `https://loremflickr.com/1200/900/${q}?lock=${idx + 1}`,
    `https://loremflickr.com/1200/900/${q}?lock=${idx + 501}`
  ];
}

function buildBulkPricing(maxPrice, moq) {
  return [
    { minQty: moq, maxQty: moq * 4 - 1, price: maxPrice },
    { minQty: moq * 4, maxQty: moq * 10 - 1, price: Math.max(1, Math.round(maxPrice * 0.9)) },
    { minQty: moq * 10, price: Math.max(1, Math.round(maxPrice * 0.8)) }
  ];
}

function buildSpecs(category, subcategory, idx) {
  return {
    material: category === 'Electrical' ? 'ABS + Copper' : category === 'Sanitary' ? 'Brass / Ceramic' : category === 'Home Decor' ? 'Mixed Decor Material' : 'Stainless Steel / Alloy',
    finish: idx % 2 === 0 ? 'Matte' : 'Gloss',
    application: subcategory,
    warranty: `${(idx % 3) + 1} year`,
    origin: 'India'
  };
}

async function seedProductsByCategory() {
  try {
    await connectDB();
    const shouldReplace = process.argv.includes('--replace');

    const admin = await User.findOne({ role: 'admin' }).select('_id');
    const fallbackUser = !admin ? await User.findOne().select('_id') : null;
    const createdBy = admin?._id || fallbackUser?._id || undefined;

    const categories = Object.keys(CATEGORY_DATA);
    const products = [];
    let serial = 1;

    for (const category of categories) {
      const items = CATEGORY_DATA[category];
      for (let i = 0; i < items.length; i += 1) {
        const item = items[i];
        const moqList = [5, 10, 20, 25, 50];
        const moq = moqList[(serial + i) % moqList.length];
        const maxPrice = 300 + (i * 140) + (category.length * 10);
        const minPrice = Math.max(100, Math.round(maxPrice * 0.78));
        const stock = 500 + (i * 230);

        products.push({
          title: `${item.title} - ${item.brand} ${serial}`,
          description: `${item.title} suitable for wholesale procurement and project supply. Designed for ${item.subcategory.toLowerCase()} use cases with reliable quality and repeat order consistency.`,
          category,
          subcategory: item.subcategory,
          brand: item.brand,
          images: onlineImages(item.keyword, serial),
          minPrice,
          maxPrice,
          bulkPricingTiers: buildBulkPricing(maxPrice, moq),
          moq,
          stock,
          isActive: true,
          featured: serial % 6 === 0,
          avgRating: Number((3.9 + ((serial % 10) * 0.1)).toFixed(1)),
          numReviews: 5 + (serial % 60),
          specifications: buildSpecs(category, item.subcategory, serial),
          ...(createdBy ? { createdBy } : {})
        });

        serial += 1;
      }
    }

    if (shouldReplace) {
      await Product.deleteMany({});
      console.log('Existing products deleted (replace mode).');
    }

    const inserted = [];
    for (const product of products) {
      const created = await Product.create(product);
      inserted.push(created);
    }

    console.log(`Inserted ${inserted.length} products successfully.`);
    console.log('Category split:');
    for (const category of categories) {
      console.log(`- ${category}: ${products.filter((p) => p.category === category).length}`);
    }

    const total = await Product.countDocuments();
    console.log(`Total products in DB now: ${total}`);
    process.exit(0);
  } catch (error) {
    console.error('Failed to seed products by category:', error.message);
    process.exit(1);
  }
}

seedProductsByCategory();
