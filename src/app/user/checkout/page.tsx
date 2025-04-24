'use client';

import React from 'react';
import styles from './checkout.module.css';

export default function CheckoutPage() {
  return (
    <div className={styles.container}>
      {/* Step indicator */}
      <div className={styles.steps}>
        <div className={styles.step}>
          <div className={styles.stepNumber}>1</div>
          <div className={styles.stepText}>Giỏ hàng</div>
        </div>
        <div className={styles.stepArrow}>›</div>
        <div className={styles.step}>
          <div className={styles.stepNumber}>2</div>
          <div className={styles.stepText}>Chi tiết đơn hàng</div>
        </div>
        <div className={styles.stepArrow}>›</div>
        <div className={styles.step}>
          <div className={styles.stepNumber}>3</div>
          <div className={styles.stepText}>Đơn hàng hoàn tất</div>
        </div>
      </div>
      
      {/* Main content */}
      <div className={styles.content}>
        {/* Form section */}
        <div className={styles.formSection}>
          <h3 className={styles.formTitle}>Nhập thông tin của bạn</h3>
          <input type="text" placeholder="Họ và Tên" />
          <input type="text" placeholder="Địa chỉ" />
          <input type="text" placeholder="Số Điện Thoại" />
          <input type="text" placeholder="Email" />
          
          <div className={styles.row}>
            <input type="text" placeholder="Tỉnh/ Thành Phố" />
            <input type="text" placeholder="Mã bưu chính" />
          </div>
          <div className={styles.row}>
            <input type="text" placeholder="Quận/Huyện" />
            <input type="text" placeholder="Xã/Phường/Thị Trấn" />
          </div>
          
          <input type="text" placeholder="Nhập địa chỉ cụ thể số nhà tên đường" />
          
          <textarea placeholder="Ghi chú cho đơn hàng của bạn"></textarea>
        </div>
        
        {/* Cart section */}
        <div className={styles.cartSection}>
          <div className={styles.cartTitle}>
            <span>Sản phẩm</span>
            <span>Tổng</span>
          </div>
          
          <div className={styles.cartItem}>
            <div className={styles.cartItemImage}></div>
            <div className={styles.cartItemDetails}>
              <div className={styles.cartItemName}>Đường thốt nốt An Giang</div>
              <div className={styles.cartItemDesc}>làm sạch da chết có thể</div>
            </div>
            <div className={styles.cartItemPrice}>165.000 đ</div>
          </div>
          
          <div className={styles.cartItem}>
            <div className={styles.cartItemImage}></div>
            <div className={styles.cartItemDetails}>
              <div className={styles.cartItemName}>Đường thốt nốt An Giang</div>
              <div className={styles.cartItemDesc}>làm sạch da chết có thể</div>
            </div>
            <div className={styles.cartItemPrice}>165.000 đ</div>
          </div>
          
          <div className={styles.cartSummary}>
            <div className={styles.summaryRow}>
              <span>Tổng</span>
              <span>7.605.000đ</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Mã giảm</span>
              <span>-100.000đ</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span>Tổng cộng</span>
              <span>7.705.000đ</span>
            </div>
            <div className={styles.summaryNote}>
              (Tổng giá phần anh giá đơn hàng của bạn, bao gồm tất cả các loại thuế và phí)
            </div>
          </div>
          
          <div className={styles.paymentMethods}>
            <div className={styles.paymentMethod}>
              <input type="radio" id="bank" name="payment" />
              <label htmlFor="bank">Chuyển khoản ngân hàng</label>
            </div>
            <div className={styles.paymentDescription}>
              Thực hiện thanh toán vào ngay tài khoản ngân hàng của chúng tôi. Vui lòng sử dụng Mã đơn hàng của bạn trong phần Nội dung thanh toán. Đơn hàng sẽ được giao sau khi tiền đã chuyển.
            </div>
            
            <div className={styles.paymentMethod}>
              <input type="radio" id="cod" name="payment" />
              <label htmlFor="cod">Trả tiền mặt khi nhận hàng</label>
            </div>
            <div className={styles.paymentDescription}>
              Trả tiền mặt khi nhận hàng
            </div>
          </div>
          
          <button className={styles.submitBtn}>Đặt hàng</button>
          
          <div className={styles.disclaimer}>
            Dữ liệu cá nhân của bạn sẽ được sử dụng để xử lý đơn đặt hàng của bạn, hỗ trợ trải nghiệm của bạn trên trang web này và cho các mục đích khác được mô tả trong chính sách bảo mật của chúng tôi.
          </div>
        </div>
      </div>
    </div>
  );
}