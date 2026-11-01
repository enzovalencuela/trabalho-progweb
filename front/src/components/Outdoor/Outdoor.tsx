import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
import Img1 from "../../assets/fundo_pc_gamer.png";
import Img2 from "../../assets/fone_fundo.png";
import Img3 from "../../assets/Cadeira-Gamer.png";
import "./Outdoor.css";

function Outdoor() {
  return (
    <section className="section-outdoor">
      <Swiper
        modules={[Pagination, Autoplay]}
        grabCursor
        loop={true}
        speed={800}
        slideToClickedSlide
        slidesPerView={1}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
      >
        <SwiperSlide className="outdoor slide1">
          <img src={Img1} alt="" />
          <div className="div-outdoor__text">
            <h2>
              <b>SETUP</b> GAMER
            </h2>
            <p>A vista com até</p>
            <h3>30% off</h3>
          </div>
        </SwiperSlide>
        <SwiperSlide className="outdoor slide2">
          <img src={Img2} alt="" />
          <div className="div-outdoor__text">
            <h2>
              <b>FONE</b> GAMER
            </h2>
            <p>e todos acessórios com até</p>
            <h3>10% off</h3>
          </div>
        </SwiperSlide>
        <SwiperSlide className="outdoor slide3">
          <img src={Img3} alt="" />
          <div className="div-outdoor__text">
            <h2>
              <b>CADEIRA</b> GAMER
            </h2>
            <p>Em até 12x no cartão</p>
            <h3>SEM JUROS</h3>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  );
}

export default Outdoor;
