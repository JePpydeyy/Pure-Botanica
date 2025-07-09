// Cập nhật đầy đủ Brands.tsx với lọc theo tên và trạng thái, popup icon sửa/xoá, giữ nguyên layout cũ
"use client";

import { useEffect, useState } from 'react';
import styles from './brand.module.css';
import type { Brand } from '@/app/components/Brand_interface';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faEye, faPlus } from '@fortawesome/free-solid-svg-icons';

export default function Brands() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState<'success' | 'error' | 'info' | ''>('');
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandStatus, setNewBrandStatus] = useState('show');
  const [searchName, setSearchName] = useState('');
  const [searchStatus, setSearchStatus] = useState('all');

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch('https://api-zeal.onrender.com/api/brands');
        const data = await res.json();
        setBrands(data);
        setFilteredBrands(data);
      } catch (error) {
        console.error('Lỗi khi tải danh sách thương hiệu:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    let filtered = brands;
    if (searchName.trim()) {
      filtered = filtered.filter((b) => b.name.toLowerCase().includes(searchName.toLowerCase()));
    }
    if (searchStatus !== 'all') {
      filtered = filtered.filter((b) => b.status === searchStatus);
    }
    setFilteredBrands(filtered);
  }, [searchName, searchStatus, brands]);

  const handleToggleStatus = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn thay đổi trạng thái thương hiệu này không?')) return;
    try {
      const resToggle = await fetch(`https://api-zeal.onrender.com/api/brands/${id}/toggle-visibility`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      if (resToggle.ok) {
        const updated = await resToggle.json();
        setBrands((prev) => prev.map((b) => (b._id === id ? updated : b)));
        setPopupMessage('Cập nhật trạng thái thành công');
        setPopupType('success');
      } else {
        setPopupMessage('Thay đổi trạng thái thất bại');
        setPopupType('error');
      }
    } catch (error) {
      setPopupMessage('Lỗi khi xử lý thương hiệu');
      setPopupType('error');
    } finally {
      setShowPopup(true);
    }
  };

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('https://api-zeal.onrender.com/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newBrandName, status: newBrandStatus }),
      });
      const result = await res.json();
      if (res.ok) {
        setBrands((prev) => [...prev, result.brand]);
        setPopupMessage('Thêm thành công');
        setPopupType('success');
        setShowAddPopup(false);
        setNewBrandName('');
        setNewBrandStatus('show');
      } else {
        setPopupMessage(result?.error || 'Lỗi thêm thương hiệu');
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
    try {
      const res = await fetch(`https://api-zeal.onrender.com/api/brands/${selectedBrand._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newBrandName, status: newBrandStatus }),
      });
      if (res.ok) {
        setBrands((prev) => prev.map((b) => (b._id === selectedBrand._id ? { ...b, name: newBrandName, status: newBrandStatus } : b)));
        setPopupMessage('Cập nhật thành công');
        setPopupType('success');
        setShowEditPopup(false);
        setSelectedBrand(null);
      } else {
        setPopupMessage('Cập nhật thất bại');
        setPopupType('error');
      }
    } catch (error) {
      setPopupMessage('Lỗi khi cập nhật');
      setPopupType('error');
    } finally {
      setShowPopup(true);
    }
  };

  return (
    <div className={styles.containerCategory}>
      <div className={styles.formTableCategory}>
        <div className={styles.nameTableCategory}>
          <span className={styles.span}>Thương Hiệu</span>
          <div className={styles.formBtnAddNewCategory}>
            <button className={styles.btnAddNewCategory} onClick={() => setShowAddPopup(true)}>
              <FontAwesomeIcon icon={faPlus} /> Thêm thương hiệu
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Tìm theo tên"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className={styles.editInput}
            style={{ maxWidth: '300px' }}
          />
          <select
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
            className={styles.editInput}
            style={{ maxWidth: '200px' }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="show">Hiển thị</option>
            <option value="hidden">Ẩn</option>
          </select>
        </div>

        <table className={styles.categoryTable}>
          <thead>
            <tr className={styles.categoryTableTr}>
              <th>Tên</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredBrands.map((brand) => (
              <tr key={brand._id}>
                <td>{brand.name}</td>
                <td>{brand.status === 'show' ? 'Hiển thị' : 'Ẩn'}</td>
                <td className={styles.categoryTableTdLast}>
                  <button className={styles.btnEdit} onClick={() => {
                    setSelectedBrand(brand);
                    setNewBrandName(brand.name);
                    setNewBrandStatus(brand.status);
                    setShowEditPopup(true);
                  }}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </button>
                  <button className={styles.btnRemove} onClick={() => handleToggleStatus(brand._id)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <button className={styles.btnView} onClick={() => {
                    setPopupMessage(`Tên: ${brand.name}\nTrạng thái: ${brand.status}`);
                    setPopupType('info');
                    setShowPopup(true);
                  }}>
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showPopup && (
        <div className={styles.popupOverlay}>
          <div className={`${styles.popup} ${styles[popupType]}`}>
            <p>{popupMessage}</p>
            <button className={styles.btnClose} onClick={() => setShowPopup(false)}>Đóng</button>
          </div>
        </div>
      )}

      {(showAddPopup || showEditPopup) && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupForm}>
            <h2 className={styles.popupTitle}>{showAddPopup ? 'Thêm Thương Hiệu Mới' : 'Chỉnh Sửa Thương Hiệu'}</h2>
            <form onSubmit={showAddPopup ? handleAddBrand : handleEditBrand}>
              <div className={styles.formGroup}>
                <label>Tên Thương Hiệu:</label>
                <input
                  type="text"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  className={styles.editInput}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Trạng Thái:</label>
                <select
                  value={newBrandStatus}
                  onChange={(e) => setNewBrandStatus(e.target.value)}
                  className={styles.editInput}
                >
                  <option value="show">Hiển thị</option>
                  <option value="hidden">Ẩn</option>
                </select>
              </div>
              <div className={styles.formActions}>
                <button type="submit" className={styles.btnSave}>
                  <FontAwesomeIcon icon={showAddPopup ? faPlus : faPenToSquare} /> {showAddPopup ? 'Thêm' : 'Lưu'}
                </button>
                <button
                  type="button"
                  className={styles.btnCancel}
                  onClick={() => {
                    setShowAddPopup(false);
                    setShowEditPopup(false);
                    setSelectedBrand(null);
                  }}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
