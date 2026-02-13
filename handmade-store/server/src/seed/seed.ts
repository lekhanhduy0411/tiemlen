import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Category from '../models/Category';
import Product from '../models/Product';
import Promotion from '../models/Promotion';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/handmade-store');
    console.log('✅ MongoDB connected');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Promotion.deleteMany({});

    // Create users
    const admin = await User.create({
      fullName: 'Admin Handmade',
      email: 'admin@handmade.com',
      password: 'admin123',
      phone: '0901234567',
      role: 'admin',
    });

    const staff = await User.create({
      fullName: 'Nhân viên Lan',
      email: 'staff@handmade.com',
      password: 'staff123',
      phone: '0901234568',
      role: 'staff',
    });

    const customer = await User.create({
      fullName: 'Nguyễn Văn An',
      email: 'customer@handmade.com',
      password: 'customer123',
      phone: '0901234569',
      address: '123 Đường Lê Lợi, Q.1, TP.HCM',
      role: 'customer',
    });

    console.log('✅ Users created');

    // Create categories
    const categories = await Category.create([
      { name: 'Trang sức handmade', slug: 'trang-suc-handmade', description: 'Trang sức thủ công tinh xảo', image: 'https://images.unsplash.com/photo-1515562141589-67f0d916b4aa?w=400' },
      { name: 'Túi xách handmade', slug: 'tui-xach-handmade', description: 'Túi xách thủ công độc đáo', image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400' },
      { name: 'Nến thơm', slug: 'nen-thom', description: 'Nến thơm handmade từ sáp tự nhiên', image: 'https://images.unsplash.com/photo-1602607881009-5132fd8decca?w=400' },
      { name: 'Gốm sứ handmade', slug: 'gom-su-handmade', description: 'Gốm sứ thủ công mỹ nghệ', image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400' },
      { name: 'Đồ trang trí', slug: 'do-trang-tri', description: 'Đồ trang trí nhà cửa handmade', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400' },
      { name: 'Quà tặng', slug: 'qua-tang', description: 'Quà tặng handmade ý nghĩa', image: 'https://images.unsplash.com/photo-1549465220-1a8b9238f6ed?w=400' },
    ]);

    console.log('✅ Categories created');

    // Create products
    const products = [
      // Trang sức
      { name: 'Vòng tay đá tự nhiên', description: 'Vòng tay được làm từ đá thạch anh tự nhiên, mang lại năng lượng tích cực cho người đeo. Mỗi viên đá đều được chọn lọc kỹ càng.', price: 250000, originalPrice: 350000, category: categories[0]._id, images: ['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600'], stock: 50, sold: 120, rating: 4.8, numReviews: 45, featured: true, tags: ['vòng tay', 'đá tự nhiên', 'thạch anh'] },
      { name: 'Bông tai ngọc trai', description: 'Bông tai ngọc trai nước ngọt, được kết hợp với dây bạc 925. Thiết kế đơn giản nhưng sang trọng.', price: 180000, originalPrice: 220000, category: categories[0]._id, images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600'], stock: 30, sold: 85, rating: 4.6, numReviews: 32, featured: true, tags: ['bông tai', 'ngọc trai'] },
      { name: 'Dây chuyền hoa khô', description: 'Dây chuyền mặt kính chứa hoa khô thật, được bảo quản trong resin trong suốt. Mỗi chiếc là một tác phẩm nghệ thuật độc nhất.', price: 150000, originalPrice: 200000, category: categories[0]._id, images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600'], stock: 25, sold: 60, rating: 4.7, numReviews: 28, featured: false, tags: ['dây chuyền', 'hoa khô', 'resin'] },
      // Túi xách
      { name: 'Túi tote vải canvas', description: 'Túi tote vải canvas in họa tiết handmade, bền đẹp và thân thiện với môi trường. Phụ kiện dạo phố lý tưởng.', price: 320000, originalPrice: 420000, category: categories[1]._id, images: ['https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=600'], stock: 40, sold: 95, rating: 4.5, numReviews: 38, featured: true, tags: ['túi tote', 'canvas', 'eco'] },
      { name: 'Ví cầm tay thêu hoa', description: 'Ví cầm tay được thêu tay hoa văn truyền thống, chất liệu vải lụa cao cấp. Phù hợp làm quà tặng.', price: 280000, originalPrice: 350000, category: categories[1]._id, images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600'], stock: 20, sold: 45, rating: 4.9, numReviews: 22, featured: true, tags: ['ví', 'thêu tay', 'truyền thống'] },
      // Nến thơm
      { name: 'Nến thơm lavender', description: 'Nến thơm từ sáp đậu nành tự nhiên, hương lavender thư giãn. Thời gian cháy khoảng 40 giờ.', price: 180000, originalPrice: 250000, category: categories[2]._id, images: ['https://images.unsplash.com/photo-1602607881009-5132fd8decca?w=600'], stock: 60, sold: 150, rating: 4.9, numReviews: 55, featured: true, tags: ['nến thơm', 'lavender', 'sáp đậu nành'] },
      { name: 'Set nến thơm 3 mùi', description: 'Bộ 3 nến thơm mini với 3 mùi hương khác nhau: vanilla, hoa hồng, bạc hà. Hộp quà tặng sang trọng.', price: 350000, originalPrice: 450000, category: categories[2]._id, images: ['https://images.unsplash.com/photo-1603905179682-9a4b46227e0b?w=600'], stock: 35, sold: 80, rating: 4.7, numReviews: 30, featured: false, tags: ['nến thơm', 'set', 'quà tặng'] },
      // Gốm sứ
      { name: 'Cốc gốm vẽ tay', description: 'Cốc gốm được vẽ tay với họa tiết hoa lá, tráng men an toàn thực phẩm. Dung tích 300ml.', price: 150000, originalPrice: 200000, category: categories[3]._id, images: ['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600'], stock: 45, sold: 110, rating: 4.6, numReviews: 42, featured: true, tags: ['cốc', 'gốm', 'vẽ tay'] },
      { name: 'Bình hoa gốm nghệ thuật', description: 'Bình hoa gốm được tạo hình thủ công, phong cách minimalist. Trang trí nhà cửa đẳng cấp.', price: 450000, originalPrice: 600000, category: categories[3]._id, images: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600'], stock: 15, sold: 35, rating: 4.8, numReviews: 18, featured: true, tags: ['bình hoa', 'gốm', 'minimalist'] },
      // Đồ trang trí
      { name: 'Dreamcatcher handmade', description: 'Dreamcatcher được đan thủ công từ sợi macrame, trang trí lông vũ tự nhiên. Kích thước 30cm.', price: 220000, originalPrice: 300000, category: categories[4]._id, images: ['https://images.unsplash.com/photo-1503602642458-232111445657?w=600'], stock: 30, sold: 70, rating: 4.7, numReviews: 25, featured: false, tags: ['dreamcatcher', 'macrame', 'trang trí'] },
      { name: 'Khung ảnh gỗ khắc tên', description: 'Khung ảnh gỗ tự nhiên, có thể khắc tên theo yêu cầu. Quà tặng ý nghĩa cho người thân.', price: 280000, originalPrice: 350000, category: categories[4]._id, images: ['https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=600'], stock: 25, sold: 55, rating: 4.5, numReviews: 20, featured: false, tags: ['khung ảnh', 'gỗ', 'khắc tên'] },
      // Quà tặng
      { name: 'Hộp quà handmade combo', description: 'Hộp quà gồm: nến thơm mini, túi thơm lavender, thiệp viết tay. Đóng hộp sang trọng.', price: 400000, originalPrice: 550000, category: categories[5]._id, images: ['https://images.unsplash.com/photo-1549465220-1a8b9238f6ed?w=600'], stock: 50, sold: 130, rating: 4.9, numReviews: 48, featured: true, tags: ['hộp quà', 'combo', 'set quà'] },
      { name: 'Album ảnh scrapbook', description: 'Album ảnh scrapbook handmade, 40 trang, trang trí với sticker và washi tape. Lưu giữ kỷ niệm đẹp.', price: 350000, originalPrice: 450000, category: categories[5]._id, images: ['https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=600'], stock: 0, sold: 90, rating: 4.6, numReviews: 35, featured: false, tags: ['album', 'scrapbook', 'quà tặng'] },
    ];

    await Product.create(products);
    console.log('✅ Products created');

    // Create promotions
    await Promotion.create([
      {
        code: 'WELCOME10',
        name: 'Chào mừng thành viên mới',
        description: 'Giảm 10% cho đơn hàng đầu tiên',
        type: 'percentage',
        value: 10,
        minOrderAmount: 200000,
        maxDiscount: 100000,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
        usageLimit: 1000,
        isActive: true,
      },
      {
        code: 'HANDMADE50K',
        name: 'Giảm 50K',
        description: 'Giảm 50.000đ cho đơn hàng từ 500.000đ',
        type: 'fixed',
        value: 50000,
        minOrderAmount: 500000,
        maxDiscount: 50000,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-06-30'),
        usageLimit: 500,
        isActive: true,
      },
    ]);
    console.log('✅ Promotions created');

    console.log('\n🎉 Seed data thành công!');
    console.log('📧 Admin: admin@handmade.com / admin123');
    console.log('📧 Staff: staff@handmade.com / staff123');
    console.log('📧 Customer: customer@handmade.com / customer123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
