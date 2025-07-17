"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './contactAdmin.module.css'; // Updated to use the new CSS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import ToastNotification from "../../user/ToastNotification/ToastNotification";

export default function ContactAdmin() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmEditPopup, setShowConfirmEditPopup] = useState(false);
  const [showConfirmDeletePopup, setShowConfirmDeletePopup] = useState(false);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  const [searchName, setSearchName] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Chưa xử lý' | 'Đã xử lý'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'none'>('none');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [notification, setNotification] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success',
  });

  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (!token || role !== 'admin') {
      showNotification('Không tìm thấy token hoặc không có quyền admin. Vui lòng đăng nhập lại.', 'error');
      router.push('/user/login');
    }
  }, [router, token]);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        showNotification('Không tìm thấy token. Vui lòng đăng nhập lại.', 'error');
        router.push('/user/login');
        return;
      }

      try {
        const res = await fetch('https://api-zeal.onrender.com/api/contacts', {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });
        if (res.status === 401 || res.status === 403) {
          showNotification('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.', 'error');
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          localStorage.removeItem('email');
          router.push('/user/login');
          return;
        }
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Lỗi khi tải danh sách liên hệ: ${res.status} ${errorText}`);
        }
        const data = await res.json();
        setContacts(data.contacts);
        setFilteredContacts(data.contacts);
      } catch (error: any) {
        console.error('Lỗi khi tải dữ liệu:', error.message);
        showNotification(`Lỗi khi tải dữ liệu: ${error.message}`, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router, token]);

  useEffect(() => {
    let filtered = [...contacts];
    if (searchName.trim()) {
      filtered = filtered.filter((c) => c.fullName.toLowerCase().includes(searchName.toLowerCase()));
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }
    setFilteredContacts(filtered);
  }, [searchName, statusFilter, contacts]);

  const handleUpdateStatus = async (id: string) => {
    if (!token) {
      showNotification('Không tìm thấy token. Vui lòng đăng nhập lại.', 'error');
      router.push('/user/login');
      return;
    }

    const contact = contacts.find((c) => c._id === id);
    if (!contact) return;

    try {
      const res = await fetch(`https://api-zeal.onrender.com/api/contacts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'Đã xử lý' }),
      });
      if (res.status === 401 || res.status === 403) {
        showNotification('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.', 'error');
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
      setContacts((prev) => prev.map((c) => (c._id === id ? result.contact : c)));
      showNotification(result.message, 'success');
    } catch (error: any) {
      showNotification(`Lỗi khi thay đổi trạng thái: ${error.message}`, 'error');
    } finally {
      setShowConfirmEditPopup(false);
    }
  };

  const handleDeleteContact = async () => {
    if (!selectedContact || !token) {
      showNotification('Không tìm thấy token hoặc liên hệ. Vui lòng thử lại.', 'error');
      return;
    }

    try {
      const res = await fetch(`https://api-zeal.onrender.com/api/contacts/${selectedContact._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.status === 401 || res.status === 403) {
        showNotification('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.', 'error');
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
      setContacts((prev) => prev.filter((c) => c._id !== selectedContact._id));
      showNotification(result.message, 'success');
    } catch (error: any) {
      showNotification(`Lỗi khi xóa liên hệ: ${error.message}`, 'error');
    } finally {
      setShowConfirmDeletePopup(false);
      setSelectedContact(null);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredContacts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={styles.contactManagementContainer}>
      {notification.show && (
        <ToastNotification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ show: false, message: '', type: 'success' })}
        />
      )}
      <div className={styles.titleContainer}>
        <h1>QUẢN LÝ LIÊN HỆ</h1>
        <div className={styles.filterContainer}>
          <input
            type="text"
            placeholder="Tìm theo họ tên..."
            className={styles.searchInput}
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <select
            className={styles.categorySelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'Chưa xử lý' | 'Đã xử lý')}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="Chưa xử lý">Chưa xử lý</option>
            <option value="Đã xử lý">Đã xử lý</option>
          </select>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.productTable}>
          <thead className={styles.productTableThead}>
            <tr>
              <th>Họ và Tên</th>
              <th>Email</th>
              <th>Số Điện Thoại</th>
              <th>Thông Điệp</th>
              <th>Trạng Thái</th>
              <th>Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className={styles.errorContainer}>
                  Đang tải danh sách liên hệ...
                </td>
              </tr>
            ) : currentItems.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.errorContainer}>
                  Không có liên hệ nào phù hợp.
                </td>
              </tr>
            ) : (
              currentItems.map((contact) => (
                <tr key={contact._id} className={styles.productRow}>
                  <td>{contact.fullName}</td>
                  <td>{contact.email}</td>
                  <td>{contact.phone || 'N/A'}</td>
                  <td>{contact.message || 'N/A'}</td>
                  <td>
                    <span className={contact.status === 'Chưa xử lý' ? styles.statusHidden : styles.statusShow}>
                      {contact.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.viewDetailsBtn}
                        onClick={() => {
                          setSelectedContact(contact);
                          setShowDetailsPopup(true);
                        }}
                        title="Xem chi tiết"
                      >
                        Xem chi tiết
                      </button>
                      <button
                        className={styles.processBtn}
                        onClick={() => {
                          setSelectedContact(contact);
                          setShowConfirmEditPopup(true);
                        }}
                        title="Chuyển thành đã xử lý"
                        disabled={contact.status === 'Đã xử lý'}
                      >
                        Xử lý
                      </button>
                      <button
                        className={styles.cancelBtn}
                        onClick={() => {
                          setSelectedContact(contact);
                          setShowConfirmDeletePopup(true);
                        }}
                        title="Xóa liên hệ"
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

      {showConfirmEditPopup && selectedContact && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupForm}>
            <h2 className={styles.popupTitle}>Xác Nhận Cập Nhật</h2>
            <p>Bạn có chắc chắn muốn chuyển trạng thái của "{selectedContact.fullName}" thành "Đã xử lý"?</p>
            <div className={styles.formActions}>
              <button
                className={styles.addProductBtn}
                onClick={() => {
                  handleUpdateStatus(selectedContact._id);
                  setShowConfirmEditPopup(false);
                }}
              >
                Xác nhận
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowConfirmEditPopup(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmDeletePopup && selectedContact && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupForm}>
            <h2 className={styles.popupTitle}>Xác Nhận Xóa</h2>
            <p>Bạn có chắc chắn muốn xóa liên hệ của "{selectedContact.fullName}"?</p>
            <div className={styles.formActions}>
              <button
                className={styles.addProductBtn}
                onClick={handleDeleteContact}
              >
                Xác nhận
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowConfirmDeletePopup(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {showDetailsPopup && selectedContact && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupForm}>
            <h2 className={styles.popupTitle}>Chi Tiết Liên Hệ</h2>
            <p><strong>Họ và Tên:</strong> {selectedContact.fullName}</p>
            <p><strong>Email:</strong> {selectedContact.email}</p>
            <p><strong>Số Điện Thoại:</strong> {selectedContact.phone || 'N/A'}</p>
            <p><strong>Thông Điệp:</strong> {selectedContact.message || 'N/A'}</p>
            <p><strong>Trạng Thái:</strong> {selectedContact.status}</p>
            <div className={styles.formActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowDetailsPopup(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}