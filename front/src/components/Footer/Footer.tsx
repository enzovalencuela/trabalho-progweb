import "./Footer.css";
import LinkSection from "../LinkSection/LinkSection";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedin,
  faGithub,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

function Footer() {
  return (
    <footer>
      <div className="footer1">
        <div className="div-footer">
          <div className="div-logo-social">
            <div className="logo_marca">
              <img src="/LOGO_MARCA.png" alt="" />
            </div>
            <div className="social-media">
              <a href="" target="_blank" rel="noreferrer">
                <FontAwesomeIcon icon={faCircleUser} />
              </a>
              <a href="" target="_blank" rel="noreferrer">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="" target="_blank" rel="noreferrer">
                <FontAwesomeIcon icon={faGithub} />
              </a>
              <a href="" target="_blank" rel="noreferrer">
                <FontAwesomeIcon icon={faLinkedin} />
              </a>
            </div>
          </div>

          <LinkSection title="Institucional">
            <p>Sobre Nós</p>
            <p>Nossas Lojas</p>
            <p>Privacidade e Segurança</p>
            <p>Termos e Condições</p>
          </LinkSection>

          <LinkSection title="Central de ajuda">
            <p>Fale Conosco</p>
            <p>Frete e Entrega</p>
            <p>Trocas e Devoluções</p>
            <p>Formas de Pagamento</p>
            <p>FAQ</p>
          </LinkSection>

          <LinkSection title="Atendimento">
            <p>
              <b>Telefone:</b> (67) 99846-8831
            </p>
            <p>
              <b>E-mail:</b> ecommerce@example.com
            </p>
            <p>
              <b>Horário de atendimento:</b>
            </p>
            <p>Segunda a Sábado: 07h00 às 23h00</p>
            <p>Domingos e Feriados: 07h00 às 21h00</p>
          </LinkSection>
        </div>
        <div className="meios-pagamento">
          <img src="./img/amex.svg" alt="" />
          <img src="./img/mastercard.svg" alt="" />
          <img src="./img/visa.svg" alt="" />
          <img src="./img/hipercard.svg" alt="" />
          <img src="./img/elo.svg" alt="" />
          <img src="./img/b.svg" alt="" />
          <img src="./img/paypal.svg" alt="" />
          <img src="./img/pix.svg" alt="" />
          <img src="./img/boleto.svg" alt="" />
        </div>
      </div>
      <div className="div-footer2">
        <p>
          Este site é um projeto fictício, criado com o propósito de estudo e
          aprimoramento em tecnologias web. Ele serve como um laboratório para a
          aplicação de conceitos de front-end e back-end, focando em algumas das
          ferramentas e técnicas mais relevantes do mercado. Nosso principal
          objetivo com este site é simular um ambiente de e-commerce real.
        </p>
        <div className="parceiros">
          <img className="logo" src="/LOGO_MARCA.png" alt="" />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
