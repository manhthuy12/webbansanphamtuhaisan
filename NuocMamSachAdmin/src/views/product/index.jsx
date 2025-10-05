import { useState, useEffect } from 'react';
import { Button, Table, Typography, Popconfirm, message, Input, Spin, Select, Switch, Badge, Tag } from 'antd';
import MainCard from 'ui-component/cards/MainCard';
import { getAllProducts, deleteProduct } from 'services/productService';
import { getAllCategories } from 'services/categoryService';
import CreateProductModal from './CreateProductModal'; // Import CreateProductModal
import EditProductModal from './EditProductModal'; // Import EditProductModal
import { debounce } from 'lodash';
import defaultImage from 'assets/images/machine.png';
import { formatCurrency } from 'utils/formatCurrency';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false); // Modal for creating product
  const [editModalOpen, setEditModalOpen] = useState(false); // Modal for editing product
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });

  const fetchProducts = async (name = '', categoryId = '', page = 1, pageSize = 5) => {
    setLoading(true);
    try {
      const data = await getAllProducts(name, categoryId, page - 1, pageSize);
      setProducts(data.content);
      setPagination({
        current: data.pageable.pageNumber + 1,
        pageSize: data.pageable.pageSize,
        total: data.totalElements
      });
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  };
  const fetchCategories = async () => {
    try {
      const data = await getAllCategories('', 0, 0);
      setCategories(data.content);
    } catch (error) {
      console.error('Lỗi khi lấy danh mục:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleOpenCreateModal = () => {
    setCreateModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setCurrentProduct(product);
    setEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setCreateModalOpen(false);
    setEditModalOpen(false);
    setCurrentProduct(null);
  };

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      message.success('Xóa sản phẩm thành công!');
      fetchProducts(searchTerm, selectedCategory, pagination.current, pagination.pageSize);
    } catch (error) {
      message.error('Lỗi khi xóa sản phẩm!');
    }
  };

  const handleSearch = debounce((value) => {
    setSearchTerm(value);
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchProducts(value, selectedCategory, 1, pagination.pageSize);
  }, 800);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    fetchProducts(searchTerm, categoryId, 1, pagination.pageSize);
  };

  const handleTableChange = (pagination) => {
    fetchProducts(searchTerm, selectedCategory, pagination.current, pagination.pageSize);
  };

  const columns = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'images',
      key: 'images',
      render: (images) => (
        <img
          src={images && images.length > 0 ? images[0] : defaultImage} // Hiển thị ảnh sản phẩm hoặc ảnh mặc định nếu không có
          alt="product"
          style={{ width: '50px', height: '50px', borderRadius: '10px' }}
        />
      )
    },
    {
      title: 'Giá bán',
      dataIndex: 'salePrice',
      key: 'salePrice',
      render: (price) => `${formatCurrency(price)}`
    },
    {
      title: 'Giá gốc',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${formatCurrency(price)}`
    },

    {
      title: 'Số lượng tồn',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center',
      render: (quantity) => (
        <Tag
          color={quantity > 0 ? 'green' : 'default'}
          style={{
            fontSize: 15,
            fontWeight: 600,
            padding: '4px 16px',
            borderRadius: 8,
            minWidth: 36,
            display: 'inline-block',
          }}
        >
          {quantity}
        </Tag>
      ),
    },
    {
      title: 'Đã bán',
      dataIndex: 'soldQuantity',
      key: 'soldQuantity',
      align: 'center',
      render: (soldQuantity) => (
        <Tag
          color="orange"
          style={{
            fontSize: 15,
            fontWeight: 600,
            padding: '4px 16px',
            borderRadius: 8,
            minWidth: 36,
            display: 'inline-block',
          }}
        >
          {soldQuantity}
        </Tag>
      ),
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (category) => category.name // Hiển thị tên danh mục
    },
    {
      title: 'Hot',
      dataIndex: 'hot',
      key: 'hot',
      render: (hot, record) => <Switch checked={hot} />
    },
    {
      title: 'Đang giảm giá',
      dataIndex: 'sale',
      key: 'sale',
      render: (sale, record) => <Switch checked={sale} />
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (text, record) => (
        <div>
          <Button type="primary" onClick={() => handleOpenEditModal(record)}>
            Cập nhật
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa sản phẩm này?"
            onConfirm={() => handleDeleteProduct(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="danger" style={{ marginLeft: '8px' }}>
              Xóa
            </Button>
          </Popconfirm>
        </div>
      )
    }
  ];

  return (
    <MainCard title="Quản lý Sản phẩm">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', height: '40px' }}>
        <Input
          placeholder="Tìm kiếm sản phẩm"
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: '40%', height: '40px' }}
          allowClear
        />
        <Select placeholder="Chọn danh mục" onChange={handleCategoryChange} style={{ width: '30%', height: '40px' }} allowClear>
          <Select.Option value="">Tất cả danh mục</Select.Option>
          {categories.map((category) => (
            <Select.Option key={category.id} value={category.id}>
              {category.name}
            </Select.Option>
          ))}
        </Select>
        <Button type="primary" onClick={handleOpenCreateModal} style={{ width: '20%', height: '40px' }}>
          Tạo mới sản phẩm
        </Button>
      </div>

      {loading ? (
        <Spin tip="Đang tải sản phẩm..." style={{ display: 'block', textAlign: 'center', marginTop: '20px' }} />
      ) : (
        <Table
          columns={columns}
          dataSource={products}
          rowKey="id"
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total
          }}
          onChange={handleTableChange}
          scroll={{ x: 1000 }}
        />
      )}

      <CreateProductModal
        open={createModalOpen}
        onClose={handleCloseModal}
        categories={categories}
        fetchProducts={() => fetchProducts(searchTerm, selectedCategory, pagination.current, pagination.pageSize)}
      />

      {currentProduct && (
        <EditProductModal
          open={editModalOpen}
          onClose={handleCloseModal}
          product={currentProduct}
          categories={categories}
          fetchProducts={() => fetchProducts(searchTerm, selectedCategory, pagination.current, pagination.pageSize)}
        />
      )}
    </MainCard>
  );
};

export default ProductManagement;
