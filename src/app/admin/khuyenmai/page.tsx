"use client";  // Thêm dòng này ở đầu file

import { useState } from "react";
import "../khuyenmai/khuyenmai.css";

export default function KhuyenmaiPage() {
    const [showPopup, setShowPopup] = useState(false);

    return (
        <>
            {showPopup && (
                <div className="popup-form">
                    <h3>Thêm khuyến mãi</h3>
                    <form id="promoForm" action="index.php?page=khuyenMai" method="post">
                        <label htmlFor="promoCode">Mã khuyến mãi</label>
                        <input type="text" id="promoCode" name="promoCode" placeholder="Nhập mã khuyến mãi" required />

                        <label htmlFor="discount">Phần trăm giảm</label>
                        <input type="number" id="discount" name="discount" placeholder="Nhập phần trăm giảm" required />

                        <label htmlFor="startDate">Ngày bắt đầu</label>
                        <input type="date" id="startDate" name="startDate" required />

                        <label htmlFor="endDate">Ngày kết thúc</label>
                        <input type="date" id="endDate" name="endDate" required />

                        <input className="addButton" type="submit" value="Thêm" name="submit" />
                        <button type="button" className="cancel" onClick={() => setShowPopup(false)}>Hủy</button>
                    </form>
                </div>
            )}

            <div className="title_container">
                <h1>KHUYẾN MÃI</h1>
            </div>

            <div className="container">
                <button onClick={() => setShowPopup(true)}>Thêm khuyến mãi</button>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Mã giảm giá</th>
                                <th>Phần trăm giảm</th>
                                <th>Ngày bắt đầu</th>
                                <th>Ngày kết thúc</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td className="code">TrieuYeuYen</td>
                                <td>100%</td>
                                <td>20-03-2025</td>
                                <td>30-03-2025</td>
                                <td>
                                    <form method="POST" action="">
                                        <input type="hidden" name="delete_id" value="" />
                                        <input className="delInput" type="submit" name="delete_submit" value="Xóa" />
                                    </form>
                                </td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td className="code">YenYeuQuan</td>
                                <td>100%</td>
                                <td>20-03-2025</td>
                                <td>30-03-2025</td>
                                <td>
                                    <form method="POST" action="">
                                        <input type="hidden" name="delete_id" value="" />
                                        <input className="delInput" type="submit" name="delete_submit" value="Xóa" />
                                    </form>
                                </td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td className="code">YenYeuTrieu</td>
                                <td>0%</td>
                                <td>20-03-2025</td>
                                <td>30-03-2025</td>
                                <td>
                                    <form method="POST" action="">
                                        <input type="hidden" name="delete_id" value="" />
                                        <input className="delInput" type="submit" name="delete_submit" value="Xóa" />
                                    </form>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
