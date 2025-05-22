"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { use } from "react";
import { User , Option } from "@/app/components/user_interface";
import styles from "./edituser.module.css";

export default function EditUser({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({
    address: {
      addressLine: "",
      ward: "",
      district: "",
      cityOrProvince: "",
    },
  });
  const [cities, setCities] = useState<Option[]>([]);
  const [districts, setDistricts] = useState<Option[]>([]);
  const [wards, setWards] = useState<Option[]>([]);
  const router = useRouter();

  // Fetch user data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Không có token. Vui lòng đăng nhập.");
      setLoading(false);
      router.push("/login");
      return;
    }

    fetch(`https://api-zeal.onrender.com/api/users/userinfo`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Lỗi khi tải thông tin người dùng.");
        }
        return res.json();
      })
      .then((data) => {
        if (data._id !== id) {
          setError("Không tìm thấy người dùng với ID này.");
        } else {
          const address = typeof data.address === "string"
            ? {
                addressLine: data.address.split(", ")[0] || "",
                ward: data.address.split(", ")[1] || "",
                district: data.address.split(", ")[2] || "",
                cityOrProvince: data.address.split(", ")[3] || "",
              }
            : data.address || {
                addressLine: "",
                ward: "",
                district: "",
                cityOrProvince: "",
              };
          setUser({ ...data, address });
          setFormData({
            username: data.username,
            email: data.email,
            phone: data.phone,
            address,
            birthday: data.birthday,
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Lỗi khi tải thông tin người dùng.");
        setLoading(false);
      });
  }, [id, router]);

  // Fetch cities on component mount
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/?depth=1")
      .then((res) => res.json())
      .then((data) => setCities(data))
      .catch(() => setError("Lỗi khi tải danh sách tỉnh/thành phố."));
  }, []);

  // Fetch districts when a city is selected
  useEffect(() => {
    if (formData.address?.cityOrProvince) {
      const selectedCity = cities.find(
        (city) => city.name === formData.address?.cityOrProvince
      );
      if (selectedCity) {
        fetch(`https://provinces.open-api.vn/api/p/${selectedCity.code}?depth=2`)
          .then((res) => res.json())
          .then((data) => setDistricts(data.districts || []))
          .catch(() => setError("Lỗi khi tải danh sách quận/huyện."));
      }
    } else {
      setDistricts([]);
    }
    setWards([]); // Reset wards when city changes
  }, [formData.address?.cityOrProvince, cities]);

  // Fetch wards when a district is selected
  useEffect(() => {
    if (formData.address?.district) {
      const selectedDistrict = districts.find(
        (district) => district.name === formData.address?.district
      );
      if (selectedDistrict) {
        fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict.code}?depth=2`)
          .then((res) => res.json())
          .then((data) => setWards(data.wards || []))
          .catch(() => setError("Lỗi khi tải danh sách phường/xã."));
      }
    } else {
      setWards([]);
    }
  }, [formData.address?.district, districts]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (["addressLine", "ward", "district", "cityOrProvince"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        address: {
          ...((prev.address as any) || {}),
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Không có token. Vui lòng đăng nhập.");
      router.push("/login");
      return;
    }

    try {
      const response = await fetch(`https://api-zeal.onrender.com/api/users/update/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/user/userinfo");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Lỗi khi cập nhật thông tin.");
      }
    } catch (err) {
      setError("Lỗi khi gửi yêu cầu cập nhật.");
    }
  };

  if (loading) return <p>Đang tải thông tin...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return <p>Không tìm thấy thông tin người dùng.</p>;



return (
  <div className={styles.container}>
    <h2 className={styles.title}>Chỉnh sửa thông tin người dùng</h2>
    {loading && <p className={styles.loading}>Đang tải thông tin...</p>}
    {error && <p className={styles.error}>{error}</p>}
    {!user && !loading && !error && (
      <p className={styles.error}>Không tìm thấy thông tin người dùng.</p>
    )}
    {user && (
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="username" className={styles.label}>
            Tên:
          </label>
          <input
            id="username"
            type="text"
            name="username"
            value={formData.username || ''}
            onChange={handleInputChange}
            required
            placeholder="Nhập tên"
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email:
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email || ''}
            onChange={handleInputChange}
            required
            placeholder="Nhập email"
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="phone" className={styles.label}>
            SĐT:
          </label>
          <input
            id="phone"
            type="text"
            name="phone"
            value={formData.phone || ''}
            onChange={handleInputChange}
            pattern="[0-9]{10}"
            title="Số điện thoại phải có 10 chữ số"
            placeholder="Nhập số điện thoại"
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="addressLine" className={styles.label}>
            Địa chỉ cụ thể (số nhà, đường):
          </label>
          <input
            id="addressLine"
            type="text"
            name="addressLine"
            value={(formData.address as any)?.addressLine || ''}
            onChange={handleInputChange}
            placeholder="Ví dụ: 391 Tô Ký"
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="city" className={styles.label}>
            Tỉnh/Thành phố:
          </label>
          <select
            id="city"
            name="cityOrProvince"
            value={(formData.address as any)?.cityOrProvince || ''}
            onChange={handleInputChange}
            title="Chọn tỉnh/thành phố"
            className={styles.select}
          >
            <option value="" disabled>
              Chọn tỉnh thành
            </option>
            {cities.map((city) => (
              <option key={city.code} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="district" className={styles.label}>
            Quận/Huyện:
          </label>
          <select
            id="district"
            name="district"
            value={(formData.address as any)?.district || ''}
            onChange={handleInputChange}
            disabled={!formData.address?.cityOrProvince}
            title="Chọn quận/huyện"
            className={styles.select}
          >
            <option value="" disabled>
              Chọn quận huyện
            </option>
            {districts.map((district) => (
              <option key={district.code} value={district.name}>
                {district.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="ward" className={styles.label}>
            Phường/Xã:
          </label>
          <select
            id="ward"
            name="ward"
            value={(formData.address as any)?.ward || ''}
            onChange={handleInputChange}
            disabled={!formData.address?.district}
            title="Chọn phường/xã"
            className={styles.select}
          >
            <option value="" disabled>
              Chọn phường xã
            </option>
            {wards.map((ward) => (
              <option key={ward.code} value={ward.name}>
                {ward.name}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="birthday" className={styles.label}>
            Ngày sinh:
          </label>
          <input
            id="birthday"
            type="date"
            name="birthday"
            value={formData.birthday ? formData.birthday.split('T')[0] : ''}
            onChange={handleInputChange}
            placeholder="Chọn ngày sinh"
            className={styles.input}
          />
        </div>
        <div className={styles.buttonGroup}>
          <button type="submit" className={styles.submitButton}>
            Lưu thay đổi
          </button>
          <Link href="/user/userinfo">
            <button type="button" className={styles.cancelButton}>
              Hủy
            </button>
          </Link>
        </div>
      </form>
    )}
    <h2 id="result" className={styles.result}>
      {(formData.address as any)?.cityOrProvince &&
      (formData.address as any)?.district &&
      (formData.address as any)?.ward
        ? `${(formData.address as any).cityOrProvince} | ${(formData.address as any).district} | ${(formData.address as any).ward}`
        : ''}
    </h2>
  </div>
);
}