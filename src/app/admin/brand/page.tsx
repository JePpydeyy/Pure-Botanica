"use client";

import { useEffect, useState } from 'react';
import styles from './brand.module.css';
import { Brand } from '@/app/components/Brand_interface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faEye, faEyeSlash, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';


export default function Brands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState<'success' | 'error' | ''>('');
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandStatus, setNewBrandStatus] = useState<'show' | 'hidden'>('show');
  const [newBrandLogo, setNewBrandLogo] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [searchName, setSearchName] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'show' | 'hidden'>('all');

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch('https://api-zeal.onrender.com/api/brands');
        if (!res.ok) throw new Error('Lỗi khi tải danh sách thương hiệu');
        const data: Brand[] = await res.json();
        setBrands(data);
        setFilteredBrands(data);
      } catch (error) {
        console.error('Lỗi khi tải danh sách thương hiệu:', error);
        setPopupMessage('Lỗi khi tải danh sách thương hiệu');
        setPopupType('error');
        setShowPopup(true);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    let filtered = [...brands];
    if (searchName.trim()) {
      filtered = filtered.filter((b) => b.name.toLowerCase().includes(searchName.toLowerCase()));
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter((b) => b.status === statusFilter);
    }
    setFilteredBrands(filtered);
  }, [searchName, statusFilter, brands]);

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
    setSelectedBrand(null);
    setNewBrandName('');
    setNewBrandStatus('show');
    setNewBrandLogo(null);
    setPreviewUrl(null);
  };

  const handleToggleStatus = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn thay đổi trạng thái thương hiệu này không?')) return;
    try {
      const res = await fetch(`https://api-zeal.onrender.com/api/brands/${id}/toggle-visibility`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (res.ok) {
        setBrands((prev) => prev.map((b) => (b._id === id ? result.brand : b)));
        setPopupMessage(result.message);
        setPopupType('success');
      } else {
        setPopupMessage(result.error || 'Thay đổi trạng thái thất bại');
        setPopupType('error');
      }
    } catch (error) {
      setPopupMessage('Lỗi khi thay đổi trạng thái');
      setPopupType('error');
    } finally {
      setShowPopup(true);
    }
  };

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
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
      const result = await res.json();
      if (res.ok) {
        setBrands((prev) => [...prev, result.brand]);
        setPopupMessage(result.message);
        setPopupType('success');
        resetForm();
      } else {
        setPopupMessage(result.error || 'Lỗi khi thêm thương hiệu');
        setPopupType('error');
      }
    } catch (error) {
      setPopupMessage('Lỗi mạng khi thêm thương hiệu');
      setPopupType('error');
    } finally {
      setShowPopup(true);
    }
  };

  const handleEditBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBrand) return;

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
      const result = await res.json();
      if (res.ok) {
        setBrands((prev) =>
          prev.map((b) => (b._id === selectedBrand._id ? result.brand : b))
        );
        setPopupMessage(result.message);
        setPopupType('success');
        resetForm();
      } else {
        setPopupMessage(result.error || 'Cập nhật thất bại');
        setPopupType('error');
      }
    } catch (error) {
      setPopupMessage('Lỗi khi cập nhật thương hiệu');
      setPopupType('error');
    } finally {
      setShowPopup(true);
    }
  };

  const handleDeleteBrand = async () => {
    if (!selectedBrand) return;
    if (!confirm('Bạn có chắc chắn muốn xóa thương hiệu này không?')) return;

    try {
      const res = await fetch(`https://api-zeal.onrender.com/api/brands/${selectedBrand._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (res.ok) {
        setBrands((prev) => prev.filter((b) => b._id !== selectedBrand._id));
        setPopupMessage(result.message);
        setPopupType('success');
        resetForm();
      } else {
        setPopupMessage(result.error || 'Xóa thất bại');
        setPopupType('error');
      }
    } catch (error) {
      setPopupMessage('Lỗi khi xóa thương hiệu');
      setPopupType('error');
    } finally {
      setShowPopup(true);
    }
  };

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
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className={styles.errorContainer}>
                  Đang tải danh sách thương hiệu...
                </td>
              </tr>
            ) : filteredBrands.length === 0 ? (
              <tr>
                <td colSpan={4} className={styles.errorContainer}>
                  Không có thương hiệu nào phù hợp.
                </td>
              </tr>
            ) : (
              filteredBrands.map((brand) => (
                <tr key={brand._id} className={styles.productRow}>
                  <td>
                    <img
                      src={`https://api-zeal.onrender.com/${brand.logoImg}`}
                      alt={brand.name}
                      className={styles.brandLogo}
                    />
                  </td>
                  <td>{brand.name}</td>
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
                          setPreviewUrl(`https://api-zeal.onrender.com/${brand.logoImg}`);
                          setShowEditPopup(true);
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
                    <img src={previewUrl} alt="Logo Preview" className={styles.previewImage} />
                  </div>
                )}
                {!newBrandLogo && selectedBrand && (
                  <div className={styles.previewContainer}>
                    <img
                      src={`https://api-zeal.onrender.com/${selectedBrand.logoImg}`}
                      alt="Current Logo"
                      className={styles.previewImage}
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