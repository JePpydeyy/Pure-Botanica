import "./about.css";

export default function AboutPage() {
    return (
        <div>
            {/* Banner */}
            <section className="banner-title">
                <img src="/images/banner.png" alt="Banner Pure-Botanica" />
                <div className="title">
                    <h1>Về Chúng Tôi</h1>
                </div>
            </section>

            {/* Nội dung chính */}
            <section className="main">
                {/* Ý Nghĩa Thương Hiệu */}
                <section className="brand-meaning">
                    <h2>Ý NGHĨA THƯƠNG HIỆU</h2>
                    <p><strong>Pure Botanica</strong> – Tinh túy thiên nhiên, thân thiện chăm sóc vẻ đẹp Việt</p>

                    <p>
                        Pure Botanica mang trong mình ý nghĩa về sự tinh túy thiên nhiên và sự sống, kết nối với vẻ đẹp.
                        Đó không chỉ là sứ mệnh của chúng tôi mà còn là một lời hứa về sự tự nhiên, lành tính, hiệu quả và
                        an toàn cho làn da của bạn.
                    </p>

                    <p>
                        Chúng tôi tin rằng, vẻ đẹp chân thật và bền vững là sự nuôi dưỡng tinh tế từ những gì tự nhiên nhất
                        mà thiên nhiên ban tặng. Vì vậy, tất cả các sản phẩm của Pure Botanica đều được nghiên cứu kỹ lưỡng và
                        áp dụng những tiêu chuẩn cao nhất để mang lại sự an toàn tuyệt đối.
                    </p>

                    <p>
                        Với mỗi sản phẩm, chúng tôi cam kết không thử nghiệm trên động vật và sử dụng các nguyên liệu thuần chay,
                        thân thiện với môi trường. Chúng tôi luôn đặt sự minh bạch lên hàng đầu, để bạn hoàn toàn yên tâm khi
                        sử dụng.
                    </p>

                    <p>
                        Cùng Pure Botanica, chúng tôi không chỉ chăm sóc làn da bạn mà còn hướng đến một lối sống bền vững và
                        yêu thương môi trường xung quanh, hãy đồng hành cùng chúng tôi vì một tương lai tốt đẹp hơn!
                    </p>

                    <img src="images/suppbanner1.png" alt="Ý Nghĩa Thương Hiệu Pure-Botanica" />
                </section>

                {/* Sứ Mệnh */}
                <section className="mission">
                    <h2 style={{ textAlign: "end", fontSize: "48px" }}>SỨ MỆNH</h2>

                    <p>
                        Chúng tôi được sinh ra để mang lại cho bạn một làn da, một mái tóc luôn khỏe mạnh, trẻ trung và tràn đầy sức sống từ những nguồn nguyên liệu đơn giản và gần gũi mà bạn ăn hằng ngày. Chúng tôi luôn giữ một nhiệm vụ trong tâm trí: áp dụng các lợi ích của thực phẩm quanh ta kết hợp với sự hiểu biết khoa học để tạo ra các sản phẩm mỹ phẩm an toàn và hiệu quả cho tất cả mọi người.
                    </p>
                    <br />
                    <p>
                        Hành trình gian nan tìm đến vẻ đẹp thật sự không phải là nhiệm vụ của riêng bạn, chúng tôi sẽ cùng bạn đi trên hành trình đó. Luôn luôn là như vậy, mãi mãi là như vậy.
                    </p>
                    <img src="images/suppbanner2.png" alt="Sứ Mệnh Pure-Botanica" />
                </section>

                {/* Cam Kết Luôn Đi Đôi Với Hành Động */}
                <section className="commitment-action">
                    <h2>CAM KẾT LUÔN ĐI ĐÔI VỚI HÀNH ĐỘNG</h2>

                    <p><strong>Pure-Botanica</strong> – Cam kết nhân đạo, thuần chay và không thử nghiệm trên động vật.</p>

                    <p>
                        Tại Pure-Botanica, chúng tôi tin rằng vẻ đẹp thực sự không cần sự đánh đổi từ bất kỳ sinh linh nào.
                        Chính vì vậy, ngay từ những ngày đầu thành lập, chúng tôi đã kiên định theo đuổi con đường mỹ phẩm thuần chay,
                        không thử nghiệm trên động vật và hướng tới một vẻ đẹp nhân ái, bền vững.
                    </p>

                    <p>
                        Chúng tôi không thực hiện thử nghiệm trên động vật, cũng không ủy quyền cho bất kỳ bên thứ ba nào thực hiện
                        hành vi này dưới danh nghĩa của thương hiệu.
                    </p>

                    <p>
                        Pure-Botanica đang trong quá trình hoàn thiện hồ sơ để tham gia các chương trình chứng nhận uy tín toàn cầu như
                        Leaping Bunny của Cruelty Free International và Beauty Without Bunnies của PETA.
                    </p>

                    <p>
                        Song song đó, tất cả sản phẩm của Pure-Botanica đều đạt tiêu chuẩn 100% thuần chay theo định nghĩa quốc tế,
                        và đang trong quá trình đăng ký với The Vegan Society – tổ chức chứng nhận thuần chay lâu đời và uy tín nhất thế giới.
                    </p>

                    <p>
                        Pure-Botanica tự hào là thương hiệu mỹ phẩm thuần chay – không thử nghiệm trên động vật – được sản xuất 100%
                        tại Việt Nam, sử dụng các nguyên liệu bản địa quý giá để tạo ra những sản phẩm mang đậm tinh thần của thiên nhiên Việt.
                    </p>

                    <p className="highlight-text" style={{ textAlign: "start" }}>
                        <strong>Pure-Botanica – Cam kết nhân đạo, thuần chay và<br />không thử nghiệm trên động vật</strong>
                    </p>
                </section>

                {/* Giá Trị Thương Hiệu */}
                <section className="brand-value">
                    <div className="brand-value-left">
                        <h2>GIÁ TRỊ THƯƠNG HIỆU</h2>

                        <p>
                            Pure-Botanica tin rằng vẻ đẹp không nên đánh đổi bằng sự tàn nhẫn.
                        </p>

                        <p>
                            Chúng tôi tự hào hướng đến các tiêu chuẩn cruelty-free (không thử nghiệm trên động vật) cao nhất.
                            Là thương hiệu mỹ phẩm thuần chay đến từ Việt Nam, Pure-Botanica cam kết mọi sản phẩm được phát triển
                            một cách nhân đạo, an toàn, và không gây hại đến bất kỳ sinh vật nào.
                        </p>
                    </div>

                    <div className="brand-value-right">
                        <img src="images/suppbanner3.png" alt="Giá Trị Thương Hiệu Pure-Botanica" />
                    </div>
                    <div className="brand-value-bottom">
                        <p>
                            Chúng tôi đang tích cực tham gia các chương trình chứng nhận quốc tế như Leaping Bunny – tiêu chuẩn vàng toàn cầu cho mỹ phẩm không thử nghiệm trên động vật. Chương trình này yêu cầu các thương hiệu phải tuân thủ các quy định nghiêm ngặt, vượt trên cả yêu cầu pháp lý hiện hành, để đảm bảo không có bất kỳ hình thức thử nghiệm trên động vật nào trong toàn bộ chuỗi cung ứng.
                        </p>
                    </div>
                </section>
            </section>
        </div>
    );
}