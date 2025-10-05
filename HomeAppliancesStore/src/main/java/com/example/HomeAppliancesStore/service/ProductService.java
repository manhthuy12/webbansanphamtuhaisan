package com.example.HomeAppliancesStore.service;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import org.apache.commons.text.similarity.CosineSimilarity;

import com.example.HomeAppliancesStore.model.Accessory;
import com.example.HomeAppliancesStore.model.Product;
import com.example.HomeAppliancesStore.model.ProductVariant;
import com.example.HomeAppliancesStore.model.Review;
import com.example.HomeAppliancesStore.repository.OrderRepository;
import com.example.HomeAppliancesStore.repository.ProductRepository;
import org.springframework.data.domain.Sort;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    private CosineSimilarity cosineSimilarity = new CosineSimilarity();

    public Page<Product> searchProducts(String name, List<Long> categoryIdList, Double minPrice, Double maxPrice,
            Boolean hot, Boolean sale, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("id").descending());
        Page<Product> productPage = productRepository.searchProducts(name, categoryIdList, minPrice, maxPrice, hot,
                sale, pageRequest);

        // Lấy danh sách productId
        List<Long> productIds = productPage.getContent().stream()
                .map(Product::getId)
                .collect(Collectors.toList());

        // Lấy tổng số lượng đã bán cho từng sản phẩm
        List<Object[]> soldList = orderRepository.findSoldQuantityByProductIds(productIds);
        Map<Long, Integer> soldMap = new HashMap<>();
        for (Object[] row : soldList) {
            Long pid = (Long) row[0];
            Long qty = (Long) row[1];
            soldMap.put(pid, qty != null ? qty.intValue() : 0);
        }

        productPage.getContent().forEach(product -> {
            // Tính trung bình đánh giá
            double averageRating = product.getAverageRating();
            product.setAverageRating(averageRating);

            // ✅ Lọc các variants có deleted = false
            if (product.getVariants() != null) {
                product.setVariants(
                        product.getVariants().stream()
                                .filter(variant -> !variant.isDeleted())
                                .collect(Collectors.toList()));
            }

            // Gán số lượng đã bán
            product.setSoldQuantity(soldMap.getOrDefault(product.getId(), 0));
        });

        return productPage;
    }

    // Lấy sản phẩm theo ID
    public Product getProductById(Long id) {
        Product product = productRepository.findById(id)
                .filter(p -> !p.isDeleted())
                .orElseThrow(() -> new RuntimeException("Product not found with id " + id));

        // Lọc đánh giá gốc
        List<Review> rootReviews = product.getReviews().stream()
                .filter(review -> review.getParentReview() == null)
                .collect(Collectors.toList());
        product.setReviews(rootReviews);

        // Lọc phụ kiện còn hoạt động
        List<Accessory> activeAccessories = product.getAccessories().stream()
                .filter(accessory -> !accessory.isDeleted())
                .collect(Collectors.toList());
        product.setAccessories(activeAccessories);

        // ❗ Lọc biến thể chưa bị xóa
        List<ProductVariant> activeVariants = product.getVariants().stream()
                .filter(variant -> !variant.isDeleted())
                .collect(Collectors.toList());
        product.setVariants(activeVariants);

        return product;
    }

    public Product createProduct(Product product) {
        // Nếu có biến thể
        if (product.getVariants() != null && !product.getVariants().isEmpty()) {
            for (ProductVariant variant : product.getVariants()) {
                variant.setProduct(product); // Gán mối quan hệ ngược lại
            }

            // ✅ Tính tổng số lượng từ tất cả biến thể (chưa xóa)
            int totalQuantity = product.getVariants().stream()
                    .filter(variant -> !variant.isDeleted()) // nếu có flag isDeleted
                    .mapToInt(ProductVariant::getQuantity)
                    .sum();
            product.setQuantity(totalQuantity);
        } else {
            // ✅ Nếu không có biến thể, giữ nguyên quantity được nhập từ người dùng
            product.setQuantity(product.getQuantity());
        }

        return productRepository.save(product);
    }

    // Cập nhật sản phẩm
    public Product updateProduct(Long id, Product productDetails) {
        Product product = productRepository.findById(id)
                .filter(p -> !p.isDeleted())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));

        // Cập nhật thông tin sản phẩm cơ bản
        product.setName(productDetails.getName());
        product.setPrice(productDetails.getPrice());
        product.setSalePrice(productDetails.getSalePrice());
        product.setDescription(productDetails.getDescription());
        product.setHot(productDetails.isHot());
        product.setSale(productDetails.isSale());
        product.setCategory(productDetails.getCategory());

        // Cập nhật URL hình ảnh nếu có thay đổi
        if (productDetails.getImages() != null && !productDetails.getImages().isEmpty()) {
            product.setImages(productDetails.getImages());
        }

        // Cập nhật phụ kiện
        if (productDetails.getAccessories() != null) {
            product.getAccessories().clear();
            for (Accessory accessory : productDetails.getAccessories()) {
                accessory.setProduct(product);
                product.getAccessories().add(accessory);
            }
        }

        // Cập nhật biến thể sản phẩm (ProductVariant)
        if (productDetails.getVariants() != null) {
            List<ProductVariant> existingVariants = product.getVariants();
            List<ProductVariant> updatedVariants = productDetails.getVariants();

            // Đánh dấu các variant không còn tồn tại là đã xóa
            for (ProductVariant oldVariant : existingVariants) {
                boolean stillExists = updatedVariants.stream()
                        .anyMatch(newVar -> newVar.getId() != null && newVar.getId().equals(oldVariant.getId()));
                if (!stillExists) {
                    oldVariant.setDeleted(true);
                }
            }

            // Cập nhật hoặc thêm mới các variant
            for (ProductVariant updated : updatedVariants) {
                if (updated.getId() != null) {
                    ProductVariant existing = existingVariants.stream()
                            .filter(v -> v.getId().equals(updated.getId()))
                            .findFirst()
                            .orElse(null);

                    if (existing != null) {
                        existing.setName(updated.getName());
                        existing.setPrice(updated.getPrice());
                        existing.setQuantity(updated.getQuantity());
                        existing.setDeleted(false); // Khôi phục nếu bị đánh dấu xóa
                    }
                } else {
                    updated.setProduct(product);
                    existingVariants.add(updated);
                }
            }

            // ✅ Tính lại tổng quantity từ các variant chưa bị xóa
            int totalQuantity = product.getVariants().stream()
                    .filter(v -> !v.isDeleted())
                    .mapToInt(ProductVariant::getQuantity)
                    .sum();
            product.setQuantity(totalQuantity);

        } else {
            // ✅ Không có variant => dùng quantity trực tiếp từ productDetails
            product.setQuantity(productDetails.getQuantity());
        }

        return productRepository.save(product);
    }

    // Xóa ẩn sản phẩm
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id).filter(p -> !p.isDeleted())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm"));
        product.setDeleted(true);

        // Đặt số lượng biến thể về 0 thay vì xóa hoàn toàn
        product.getVariants().forEach(variant -> variant.setQuantity(0));

        productRepository.save(product);
    }

    // Kết hợp name, category và variants của sản phẩm thành một chuỗi duy nhất
    private String combineProductAttributes(Product product) {
        String variantNames = product.getVariants().stream()
                .map(ProductVariant::getName)
                .collect(Collectors.joining(" "));
        return product.getName() + " " + product.getCategory().getName() + " " + variantNames;
    }

    // Tính toán độ tương đồng giữa hai chuỗi
    private double calculateSimilarity(String text1, String text2) {
        Map<CharSequence, Integer> vector1 = toVector(text1);
        Map<CharSequence, Integer> vector2 = toVector(text2);
        return cosineSimilarity.cosineSimilarity(vector1, vector2);
    }

    public Map<CharSequence, Integer> toVector(String text) {
        Map<CharSequence, Integer> vector = new HashMap<>();
        String[] words = text.toLowerCase().split("\\s+");
        for (String word : words) {
            vector.put(word, vector.getOrDefault(word, 0) + 1);
        }
        return vector;
    }

    // Gợi ý sản phẩm dựa trên lịch sử mua hàng của người dùng
    public List<Product> getSuggestedProductsFromHistory(List<Product> purchasedProducts) {
        List<Product> allProducts = productRepository.findAllByDeletedFalse();

        List<String> purchasedProductAttributes = purchasedProducts.stream()
                .map(this::combineProductAttributes)
                .collect(Collectors.toList());

        return allProducts.stream()
                .filter(product -> purchasedProducts.stream().noneMatch(p -> p.getId().equals(product.getId())))
                .map(product -> {
                    double maxSimilarity = purchasedProductAttributes.stream()
                            .mapToDouble(attr -> calculateSimilarity(attr, combineProductAttributes(product)))
                            .max()
                            .orElse(0.0);
                    product.setSimilarity(maxSimilarity);
                    return product;
                })
                .filter(product -> product.getSimilarity() > 0.3)
                .sorted((p1, p2) -> Double.compare(p2.getSimilarity(), p1.getSimilarity()))
                .collect(Collectors.toList());
    }
}
