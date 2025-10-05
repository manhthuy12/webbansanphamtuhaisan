-- Chèn dữ liệu vào bảng Category
INSERT INTO category (id, name, description) VALUES (1, 'Kitchen Appliances', 'Thiết bị nhà bếp');
INSERT INTO category (id, name, description) VALUES (2, 'Home Appliances', 'Thiết bị gia dụng');
INSERT INTO category (id, name, description) VALUES (3, 'Electronics', 'Thiết bị điện tử');
INSERT INTO category (id, name, description) VALUES (4, 'Outdoor Equipment', 'Thiết bị ngoài trời');

-- Chèn dữ liệu vào bảng Product
INSERT INTO product (id, name, price, description, sale_price, hot, sale, quantity, category_id) 
VALUES (1, 'Blender', 150, 'Máy xay sinh tố cao cấp', 120, true, true, 100, 1);
INSERT INTO product (id, name, price, description, sale_price, hot, sale, quantity, category_id) 
VALUES (2, 'Microwave', 200, 'Lò vi sóng hiện đại', 180, false, true, 50, 1);
INSERT INTO product (id, name, price, description, sale_price, hot, sale, quantity, category_id) 
VALUES (3, 'Smart TV', 1000, 'TV thông minh 4K', 900, true, false, 30, 3);
INSERT INTO product (id, name, price, description, sale_price, hot, sale, quantity, category_id) 
VALUES (4, 'Washing Machine', 500, 'Máy giặt tự động', 450, false, true, 20, 2);
INSERT INTO product (id, name, price, description, sale_price, hot, sale, quantity, category_id) 
VALUES (5, 'Lawn Mower', 400, 'Máy cắt cỏ công suất cao', 350, true, true, 40, 4);
INSERT INTO product (id, name, price, description, sale_price, hot, sale, quantity, category_id) 
VALUES (6, 'Air Conditioner', 800, 'Điều hòa không khí thông minh', 750, true, false, 25, 2);
INSERT INTO product (id, name, price, description, sale_price, hot, sale, quantity, category_id) 
VALUES (7, 'Refrigerator', 600, 'Tủ lạnh Inverter tiết kiệm điện', 550, false, true, 30, 1);

-- Chèn dữ liệu vào bảng Accessory
INSERT INTO accessory (id, name, price, image, quantity, product_id) 
VALUES (1, 'Blender Blade', 50, 'blade.png', 100, 1);
INSERT INTO accessory (id, name, price, image, quantity, product_id) 
VALUES (2, 'Microwave Plate', 20, 'plate.png', 150, 2);
INSERT INTO accessory (id, name, price, image, quantity, product_id) 
VALUES (3, 'Lawn Mower Blade', 80, 'lawn_blade.png', 200, 5);
INSERT INTO accessory (id, name, price, image, quantity, product_id) 
VALUES (4, 'Air Conditioner Filter', 30, 'filter.png', 300, 6);

-- Chèn dữ liệu vào bảng Voucher
INSERT INTO voucher (id, code, discount_value, start_date, end_date, is_active) 
VALUES (1, 'SALE2024', 100, '2024-01-01', '2024-12-31', true);
INSERT INTO voucher (id, code, discount_value, start_date, end_date, is_active) 
VALUES (2, 'NEWYEAR2024', 50, '2024-01-01', '2024-02-28', true);
INSERT INTO voucher (id, code, discount_value, start_date, end_date, is_active) 
VALUES (3, 'SUMMER2024', 150, '2024-06-01', '2024-08-31', true);

-- Chèn dữ liệu vào bảng Profile
INSERT INTO profile (id, full_name, email, phone_number, address) 
VALUES (1, 'Nguyen Van A', 'nguyenvana@example.com', '0987654321', 'Hanoi, Vietnam');
INSERT INTO profile (id, full_name, email, phone_number, address) 
VALUES (2, 'Tran Thi B', 'tranthib@example.com', '0987654322', 'Ho Chi Minh City, Vietnam');
INSERT INTO profile (id, full_name, email, phone_number, address) 
VALUES (3, 'Le Van C', 'levanc@example.com', '0987654323', 'Da Nang, Vietnam');

-- Chèn dữ liệu vào bảng User
INSERT INTO user (id, username, password, role, account_locked, reset_token, last_login_time, points, profile_id) 
VALUES (1, 'admin', '$2a$10$.3JPwyPyJc0ZkmzHwq7AL.GIqY5KRD6GlmZ7gmeEHYemDUR8EL6TO', 'ADMIN', false, NULL, NULL, 0, 1);
INSERT INTO user (id, username, password, role, account_locked, reset_token, last_login_time, points, profile_id) 
VALUES (2, 'staff', '$2a$10$W4okVsCrEtCgF0Z5cWTfsuWaDgeVKigV86hupxpzXVumJUP8BIEza', 'STAFF', false, NULL, NULL, 0, 2);
INSERT INTO user (id, username, password, role, account_locked, reset_token, last_login_time, points, profile_id) 
VALUES (3, 'user', '$2a$10$aH/Crdwm4VeAIQkPhwtBf.aUtmpoxZcrWtTK6WPLgLhDW6htMrr9q', 'USER', false, NULL, NULL, 0, 3);

-- Chèn dữ liệu vào bảng Order
INSERT INTO orders (id, status, total_amount, order_time, is_paid, payment_method, user_id, voucher_id) 
VALUES (1, 'Processing', 1250, '2024-01-20 10:00:00', true, 'Credit Card', 1, 1);
INSERT INTO orders (id, status, total_amount, order_time, is_paid, payment_method, user_id, voucher_id) 
VALUES (2, 'Shipped', 1500, '2024-01-19 15:30:00', true, 'MoMo', 2, 2);
INSERT INTO orders (id, status, total_amount, order_time, is_paid, payment_method, user_id, voucher_id) 
VALUES (3, 'Completed', 1750, '2024-01-15 09:00:00', true, 'Cash on Delivery', 3, 3);

-- Chèn dữ liệu vào bảng OrderItem
INSERT INTO order_item (id, product_id, quantity, price_at_purchase, order_id) 
VALUES (1, 1, 1, 120, 1);
INSERT INTO order_item (id, product_id, quantity, price_at_purchase, order_id) 
VALUES (2, 3, 1, 900, 1);
INSERT INTO order_item (id, product_id, quantity, price_at_purchase, order_id) 
VALUES (3, 2, 1, 180, 2);
INSERT INTO order_item (id, product_id, quantity, price_at_purchase, order_id) 
VALUES (4, 6, 1, 750, 3);

-- Chèn dữ liệu vào bảng OrderAccessoryItem
INSERT INTO order_accessory_item (id, accessory_id, quantity, price_at_purchase, order_item_id) 
VALUES (1, 1, 1, 50, 1);
INSERT INTO order_accessory_item (id, accessory_id, quantity, price_at_purchase, order_item_id) 
VALUES (2, 2, 1, 20, 3);
INSERT INTO order_accessory_item (id, accessory_id, quantity, price_at_purchase, order_item_id) 
VALUES (3, 4, 1, 30, 4);

-- Chèn dữ liệu vào bảng News
INSERT INTO news (id, title, content, image) 
VALUES (1, 'Sản phẩm mới: Máy xay sinh tố', 'Máy xay sinh tố cao cấp với nhiều chức năng.', 'blender-news.png');
INSERT INTO news (id, title, content, image) 
VALUES (2, 'Khuyến mãi cuối năm', 'Nhận ưu đãi lên đến 50% cho tất cả sản phẩm gia dụng.', 'sale-news.png');
INSERT INTO news (id, title, content, image) 
VALUES (3, 'Giảm giá mùa hè', 'Ưu đãi đặc biệt cho các thiết bị điện tử trong mùa hè này.', 'summer-sale.png');

-- Chèn dữ liệu vào bảng ChatRoom
INSERT INTO chatroom (id, customer_id) 
VALUES (1, 1);
INSERT INTO chatroom (id, customer_id) 
VALUES (2, 3);

-- Chèn dữ liệu vào bảng Message
INSERT INTO message (id, content, timestamp, sender_id, chat_room_id) 
VALUES (1, 'Xin chào, tôi cần hỗ trợ về đơn hàng.', '2024-01-20 10:05:00', 1, 1);
INSERT INTO message (id, content, timestamp, sender_id, chat_room_id) 
VALUES (2, 'Chúng tôi sẽ kiểm tra và phản hồi sớm.', '2024-01-20 10:15:00', 2, 1);
INSERT INTO message (id, content, timestamp, sender_id, chat_room_id) 
VALUES (3, 'Tôi muốn biết thêm thông tin về sản phẩm mới.', '2024-01-19 08:30:00', 3, 2);
INSERT INTO message (id, content, timestamp, sender_id, chat_room_id) 
VALUES (4, 'Tôi sẽ gửi thông tin chi tiết cho bạn.', '2024-01-19 08:45:00', 2, 2);
