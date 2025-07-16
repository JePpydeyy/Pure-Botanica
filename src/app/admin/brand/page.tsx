"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './brand.module.css';
import { Brand } from '@/app/components/Brand_interface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faEye, faEyeSlash, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

interface Product {
  _id: string;
  id_brand: string;
}

export default function Brands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [productCounts, setProductCounts] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState<'success' | 'error' | ''>('');
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showConfirmEditPopup, setShowConfirmEditPopup] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandStatus, setNewBrandStatus] = useState<'show' | 'hidden'>('show');
  const [newBrandLogo, setNewBrandLogo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [searchName, setSearchName] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'show' | 'hidden'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'none'>('none');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Check admin authentication
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (!token || role !== 'admin') {
      router.push('/user/login');
    }
  }, [router, token]);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setPopupMessage('Không tìm thấy token. Vui lòng đăng nhập lại.');
        setPopupType('error');
        setShowPopup(true);
        router.push('/user/login');
        return;
      }

      try {
        // Fetch brands
        const brandsRes = await fetch('https://api-zeal.onrender.com/api/brands', {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });
        if (brandsRes.status === 401 || brandsRes.status === 403) {
          setPopupMessage('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
          setPopupType('error');
          setShowPopup(true);
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('email');
          router.push('/user/login');
          return;
        }
        if (!brandsRes.ok) {
          const errorText = await brandsRes.text();
          throw new Error(`Lỗi khi tải danh sách thương hiệu: ${brandsRes.status} ${errorText}`);
        }
        const brandsData: Brand[] = await brandsRes.json();
        console.log('Brands fetched:', brandsData);

        // Fetch products for counting
        let productsData: Product[] = [];
        try {
          const productsRes = await fetch('https://api-zeal.onrender.com/api/products?fields=id_brand', {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
          });
          if (productsRes.status === 401 || productsRes.status === 403) {
            setPopupMessage('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
            setPopupType('error');
            setShowPopup(true);
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('email');
            router.push('/user/login');
            return;
          }
          if (!productsRes.ok) {
            console.warn('Field filtering not supported, fetching all product data');
            const fallbackRes = await fetch('https://api-zeal.onrender.com/api/products', {
              headers: { Authorization: `Bearer ${token}` },
              cache: 'no-store',
            });
            if (fallbackRes.status === 401 || fallbackRes.status === 403) {
              setPopupMessage('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
              setPopupType('error');
              setShowPopup(true);
              localStorage.removeItem('token');
              localStorage.removeItem('role');
              localStorage.removeItem('email');
              router.push('/user/login');
              return;
            }
            if (!fallbackRes.ok) {
              throw new Error(`Lỗi khi tải danh sách sản phẩm: ${fallbackRes.status} ${await fallbackRes.text()}`);
            }
            productsData = await fallbackRes.json();
          } else {
            productsData = await productsRes.json();
          }
        } catch (error) {
          console.warn('Error fetching products with field filtering:', error);
          const fallbackRes = await fetch('https://api-zeal.onrender.com/api/products', {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
          });
          if (fallbackRes.status === 401 || fallbackRes.status === 403) {
            setPopupMessage('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
            setPopupType('error');
            setShowPopup(true);
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('email');
            router.push('/user/login');
            return;
          }
          if (!fallbackRes.ok) {
            throw new Error(`Lỗi khi tải danh sách sản phẩm: ${fallbackRes.status} ${await fallbackRes.text()}`);
          }
          productsData = await fallbackRes.json();
        }
        console.log('Products fetched:', productsData);

        // Calculate product counts per brand
        const counts = productsData.reduce((acc: { [key: string]: number }, product: Product) => {
          if (product.id_brand) {
            acc[product.id_brand] = (acc[product.id_brand] || 0) + 1;
          }
          return acc;
        }, {});
        console.log('Product counts:', counts);

        setBrands(brandsData);
        setProductCounts(counts);
        setFilteredBrands(brandsData);
      } catch (error: any) {
        console.error('Lỗi khi tải dữ liệu:', error.message);
        setPopupMessage(`Lỗi khi tải dữ liệu: ${error.message}`);
        setPopupType('error');
        setShowPopup(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router, token]);

  useEffect(() => {
    let filtered = [...brands];
    if (searchName.trim()) {
      filtered = filtered.filter((b) => b.name.toLowerCase().includes(searchName.toLowerCase()));
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter((b) => b.status === statusFilter);
    }
    if (sortOrder !== 'none') {
      filtered.sort((a, b) => {
        const countA = productCounts[a._id] || 0;
        const countB = productCounts[b._id] || 0;
        return sortOrder === 'asc' ? countA - countB : countB - countA;
      });
    }
    setFilteredBrands(filtered);
  }, [searchName, statusFilter, sortOrder, brands, productCounts]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setNewBrandLogo(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const resetForm = () => {
    setShowAddPopup(false);
    setShowEditPopup(false);
    setShowDeletePopup(false);
    setShowConfirmEditPopup(false);
    setSelectedBrand(null);
    setNewBrandName('');
    setNewBrandStatus('show');
    setNewBrandLogo(null);
    setPreviewUrl(null);
  };

  const handleToggleStatus = async (id: string) => {
    if (!token) {
      setPopupMessage('Không tìm thấy token. Vui lòng đăng nhập lại.');
      setPopupType('error');
      setShowPopup(true);
      router.push('/user/login');
      return;
    }

    const brand = brands.find((b) => b._id === id);
    if (!brand) return;

    const productCount = productCounts[id] || 0;
    if (brand.status === 'show' && productCount > 0) {
      if (!confirm(`Thương hiệu này có ${productCount} sản phẩm. Ẩn thương hiệu sẽ ẩn tất cả các sản phẩm liên quan. Bạn có chắc chắn muốn tiếp tục?`)) return;
    } else if (!confirm('Bạn có chắc chắn muốn thay đổi trạng thái thương hiệu này không?')) return;

    try {
      const res = await fetch(`https://api-zeal.onrender.com/api/brands/${id}/toggle-visibility`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 401 || res.status === 403) {
        setPopupMessage('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        setPopupType('error');
        setShowPopup(true);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        router.push('/user/login');
        return;
      }
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Thay đổi trạng thái thất bại: ${res.status} ${errorText}`);
      }
      const result = await res.json();
      setBrands((prev) => prev.map((b) => (b._id === id ? result.brand : b)));
      setPopupMessage(result.message);
      setPopupType('success');
    } catch (error: any) {
      setPopupMessage(`Lỗi khi thay đổi trạng thái: ${error.message}`);
      setPopupType('error');
    } finally {
      setShowPopup(true);
    }
  };

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setPopupMessage('Không tìm thấy token. Vui lòng đăng nhập lại.');
      setPopupType('error');
      setShowPopup(true);
      router.push('/user/login');
      return;
    }
    if (!newBrandLogo) {
      setPopupMessage('Vui lòng tải lên logo thương hiệu');
      setPopupType('error');
      setShowPopup(true);
      return;
    }

    const formData = new FormData();
    formData.append('name', newBrandName);
    formData.append('status', newBrandStatus);
    formData.append('logoImg', newBrandLogo);

    try {
      const res = await fetch('https://api-zeal.onrender.com/api/brands', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (res.status === 401 || res.status === 403) {
        setPopupMessage('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        setPopupType('error');
        setShowPopup(true);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        router.push('/user/login');
        return;
      }
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Lỗi khi thêm thương hiệu: ${res.status} ${errorText}`);
      }
      const result = await res.json();
      setBrands((prev) => [...prev, result.brand]);
      setPopupMessage(result.message);
      setPopupType('success');
      resetForm();
    } catch (error: any) {
      setPopupMessage(`Lỗi khi thêm thương hiệu: ${error.message}`);
      setPopupType('error');
    } finally {
      setShowPopup(true);
    }
  };

  const handleEditBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrand) return;
    if (!token) {
      setPopupMessage('Không tìm thấy token. Vui lòng đăng nhập lại.');
      setPopupType('error');
      setShowPopup(true);
      router.push('/user/login');
      return;
    }

    const formData = new FormData();
    formData.append('name', newBrandName);
    formData.append('status', newBrandStatus);
    if (newBrandLogo) {
      formData.append('logoImg', newBrandLogo);
    }

    try {
      const res = await fetch(`https://api-zeal.onrender.com/api/brands/${selectedBrand._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (res.status === 401 || res.status === 403) {
        setPopupMessage('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        setPopupType('error');
        setShowPopup(true);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        router.push('/user/login');
        return;
      }
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Cập nhật thất bại: ${res.status} ${errorText}`);
      }
      const result = await res.json();
      setBrands((prev) =>
        prev.map((b) => (b._id === selectedBrand._id ? result.brand : b))
      );
      setPopupMessage(result.message);
      setPopupType('success');
      resetForm();
    } catch (error: any) {
      setPopupMessage(`Lỗi khi cập nhật thương hiệu: ${error.message}`);
      setPopupType('error');
    } finally {
      setShowPopup(true);
    }
  };

  const handleDeleteBrand = async () => {
    if (!selectedBrand) return;
    if (!token) {
      setPopupMessage('Không tìm thấy token. Vui lòng đăng nhập lại.');
      setPopupType('error');
      setShowPopup(true);
      router.push('/user/login');
      return;
    }
    if (!confirm('Bạn có chắc chắn muốn xóa thương hiệu này không?')) return;

    try {
      const res = await fetch(`https://api-zeal.onrender.com/api/brands/${selectedBrand._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 401 || res.status === 403) {
        setPopupMessage('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
        setPopupType('error');
        setShowPopup(true);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        router.push('/user/login');
        return;
      }
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Xóa thất bại: ${res.status} ${errorText}`);
      }
      const result = await res.json();
      setBrands((prev) => prev.filter((b) => b._id !== selectedBrand._id));
      setPopupMessage(result.message);
      setPopupType('success');
      resetForm();
    } catch (error: any) {
      setPopupMessage(`Lỗi khi xóa thương hiệu: ${error.message}`);
      setPopupType('error');
    } finally {
      setShowPopup(true);
    }
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBrands.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className={styles.NewManagementContainer}>
      <div className={styles.titleContainer}>
        <h1>QUẢN LÝ THƯƠNG HIỆU</h1>
        <div className={styles.filterContainer}>
          <input
            type="text"
            placeholder="Tìm theo tên..."
            className={styles.searchInput}
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <select
            className={styles.categorySelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'show' | 'hidden')}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="show">Hiển thị</option>
            <option value="hidden">Ẩn</option>
          </select>
          <select
            className={styles.categorySelect}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc' | 'none')}
          >
            <option value="none">Sắp xếp mặc định</option>
            <option value="asc">Số sản phẩm: Ít nhất</option>
            <option value="desc">Số sản phẩm: Nhiều nhất</option>
          </select>
          <button
            className={styles.addProductBtn}
            onClick={() => setShowAddPopup(true)}
          >
            <FontAwesomeIcon icon={faPlus} /> Thêm thương hiệu
          </button>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.productTable}>
          <thead className={styles.productTableThead}>
            <tr>
              <th>Logo</th>
              <th>Tên</th>
              <th>Số sản phẩm</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className={styles.errorContainer}>
                  Đang tải danh sách thương hiệu...
                </td>
              </tr>
            ) : currentItems.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.errorContainer}>
                  Không có thương hiệu nào phù hợp.
                </td>
              </tr>
            ) : (
              currentItems.map((brand) => (
                <tr key={brand._id} className={styles.productRow}>
                  <td>
                    <img
                      src={brand.logoImg}
                      alt={brand.name}
                      className={styles.brandLogo}
                      onError={(e) => {
                        e.currentTarget.src = 'https://png.pngtree.com/png-vector/20210227/ourlarge/pngtree-error-404-glitch-effect-png-image_2943478.jpg'; // fallback nếu lỗi ảnh
                      }}
                    />

                  </td>
                  <td>{brand.name}</td>
                  <td>{productCounts[brand._id] || 0}</td>
                  <td>
                    <span className={brand.status === 'show' ? styles.statusShow : styles.statusHidden}>
                      {brand.status === 'show' ? 'Hiển thị' : 'Ẩn'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.editBtn}
                        onClick={() => {
                          setSelectedBrand(brand);
                          setNewBrandName(brand.name);
                          setNewBrandStatus(brand.status);
                          setPreviewUrl(brand.logoImg);

                          setShowConfirmEditPopup(true);
                        }}
                        title="Chỉnh sửa"
                      >
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button
                        className={styles.toggleStatusBtn}
                        onClick={() => handleToggleStatus(brand._id)}
                        title={brand.status === 'show' ? 'Ẩn thương hiệu' : 'Hiển thị thương hiệu'}
                      >
                        <FontAwesomeIcon icon={brand.status === 'show' ? faEyeSlash : faEye} />
                      </button>
                      <button
                        className={styles.cancelBtn}
                        onClick={() => {
                          setSelectedBrand(brand);
                          setShowDeletePopup(true);
                        }}
                        title="Xóa thương hiệu"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.paginationBtn}
          >
            Trước
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`${styles.paginationBtn} ${currentPage === i + 1 ? styles.active : ''}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={styles.paginationBtn}
          >
            Sau
          </button>
        </div>
      )}

      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={`${styles.popup} ${styles[popupType]}`}>
            <p style={{ whiteSpace: 'pre-wrap' }}>{popupMessage}</p>
            <button
              className={styles.btnClose}
              onClick={() => setShowPopup(false)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {showAddPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupForm}>
            <h2 className={styles.popupTitle}>Thêm Thương Hiệu Mới</h2>
            <form onSubmit={handleAddBrand}>
              <div className={styles.formGroup}>
                <label>Tên Thương Hiệu:</label>
                <input
                  type="text"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  className={styles.searchInput}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Logo Thương Hiệu:</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/gif,image/webp,image/svg+xml"
                  onChange={handleFileChange}
                  className={styles.searchInput}
                  required
                />
                {previewUrl && (
                  <div className={styles.previewContainer}>
                    <img src={previewUrl} alt="Logo Preview" className={styles.previewImage} />
                  </div>
                )}
              </div>
              <div className={styles.formGroup}>
                <label>Trạng Thái:</label>
                <select
                  value={newBrandStatus}
                  onChange={(e) => setNewBrandStatus(e.target.value as 'show' | 'hidden')}
                  className={styles.categorySelect}
                >
                  <option value="show">Hiển thị</option>
                  <option value="hidden">Ẩn</option>
                </select>
              </div>
              <div className={styles.formActions}>
                <button
                  type="submit"
                  className={styles.addProductBtn}
                >
                  <FontAwesomeIcon icon={faPlus} /> Thêm
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={resetForm}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showConfirmEditPopup && selectedBrand && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupForm}>
            <h2 className={styles.popupTitle}>Xác Nhận Chỉnh Sửa</h2>
            <p>Bạn có chắc chắn muốn chỉnh sửa thương hiệu "{selectedBrand.name}"?</p>
            <div className={styles.formActions}>
              <button
                className={styles.addProductBtn}
                onClick={() => {
                  setShowConfirmEditPopup(false);
                  setShowEditPopup(true);
                }}
              >
                Xác nhận
              </button>
              <button
                className={styles.cancelBtn}
                onClick={resetForm}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupForm}>
            <h2 className={styles.popupTitle}>Chỉnh Sửa Thương Hiệu</h2>
            <form onSubmit={handleEditBrand}>
              <div className={styles.formGroup}>
                <label>Tên Thương Hiệu:</label>
                <input
                  type="text"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  className={styles.searchInput}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Logo Thương Hiệu:</label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,image/gif,image/webp,image/svg+xml"
                  onChange={handleFileChange}
                  className={styles.searchInput}
                />
                {previewUrl && (
                  <div className={styles.previewContainer}>
                    <img src={previewUrl} alt="Logo Preview" className={styles.previewImage}
                    onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://png.pngtree.com/png-vector/20210227/ourlarge/pngtree-error-404-glitch-effect-png-image_2943478.jpg";
                        }}
                    />
                  </div>
                )}
              </div>
              <div className={styles.formGroup}>
                <label>Trạng Thái:</label>
                <select
                  value={newBrandStatus}
                  onChange={(e) => setNewBrandStatus(e.target.value as 'show' | 'hidden')}
                  className={styles.categorySelect}
                >
                  <option value="show">Hiển thị</option>
                  <option value="hidden">Ẩn</option>
                </select>
              </div>
              <div className={styles.formActions}>
                <button
                  type="submit"
                  className={styles.addProductBtn}
                >
                  <FontAwesomeIcon icon={faPenToSquare} /> Lưu
                </button>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={resetForm}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeletePopup && selectedBrand && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupForm}>
            <h2 className={styles.popupTitle}>Xác Nhận Xóa</h2>
            <p>Bạn có chắc chắn muốn xóa thương hiệu "{selectedBrand.name}"?</p>
            <div className={styles.formActions}>
              <button
                className={styles.addProductBtn}
                onClick={handleDeleteBrand}
              >
                Xóa
              </button>
              <button
                className={styles.cancelBtn}
                onClick={resetForm}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}