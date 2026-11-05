--
-- PostgreSQL database dump
--

-- Dumped from database version 18.6
-- Dumped by pg_dump version 18.1

-- Started on 2026-11-01 19:23:31

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 16694)
-- Name: cart_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_items (
    id integer NOT NULL,
    user_id integer,
    product_id integer
);


--
-- TOC entry 220 (class 1259 OID 16698)
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.cart_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3524 (class 0 OID 0)
-- Dependencies: 220
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- TOC entry 221 (class 1259 OID 16699)
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments (
    id integer NOT NULL,
    user_id integer,
    amount numeric(10,2) NOT NULL,
    currency character varying(255) DEFAULT 'BRL'::character varying NOT NULL,
    status character varying(255) NOT NULL,
    provider character varying(255),
    provider_payment_id character varying(255),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    additional_info jsonb,
    installments integer
);


--
-- TOC entry 222 (class 1259 OID 16711)
-- Name: payments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3525 (class 0 OID 0)
-- Dependencies: 222
-- Name: payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payments_id_seq OWNED BY public.payments.id;


--
-- TOC entry 228 (class 1259 OID 35912)
-- Name: product_reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_reviews (
    id integer NOT NULL,
    product_id integer NOT NULL,
    user_id integer NOT NULL,
    nota numeric(38,2) NOT NULL,
    titulo character varying(255),
    comentario text,
    img_url text,
    compra_verificada boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT product_reviews_nota_check CHECK (((nota >= (1)::numeric) AND (nota <= (5)::numeric)))
);


--
-- TOC entry 227 (class 1259 OID 35911)
-- Name: product_reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3526 (class 0 OID 0)
-- Dependencies: 227
-- Name: product_reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_reviews_id_seq OWNED BY public.product_reviews.id;


--
-- TOC entry 223 (class 1259 OID 16712)
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id integer NOT NULL,
    titulo character varying(255) NOT NULL,
    preco numeric(10,2) NOT NULL,
    preco_original numeric(10,2),
    img character varying(500) NOT NULL,
    descricao text,
    categoria character varying(255),
    tags character varying(255)[],
    disponivel boolean DEFAULT true NOT NULL,
    max_parcelas integer DEFAULT 1,
    taxa_parcela numeric(10,2) DEFAULT 1,
    cores text[],
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    peso_kg numeric(6,3) DEFAULT 0.500,
    largura_cm integer DEFAULT 20,
    altura_cm integer DEFAULT 10,
    comprimento_cm integer DEFAULT 20,
    estoque integer DEFAULT 50
);


--
-- TOC entry 224 (class 1259 OID 16726)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3527 (class 0 OID 0)
-- Dependencies: 224
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 225 (class 1259 OID 16727)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255),
    balance numeric(10,2) DEFAULT 0.00 NOT NULL,
    role character varying(255) DEFAULT 'user'::character varying NOT NULL,
    cpf character varying(255),
    phone character varying(255),
    address character varying(255),
    number character varying(255),
    neighborhood character varying(255),
    city character varying(255),
    zip character varying(255),
    state character varying(255),
    firebase_uid character varying(255),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 226 (class 1259 OID 16740)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3528 (class 0 OID 0)
-- Dependencies: 226
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 3306 (class 2604 OID 16741)
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- TOC entry 3307 (class 2604 OID 16742)
-- Name: payments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments ALTER COLUMN id SET DEFAULT nextval('public.payments_id_seq'::regclass);


--
-- TOC entry 3327 (class 2604 OID 35915)
-- Name: product_reviews id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_reviews ALTER COLUMN id SET DEFAULT nextval('public.product_reviews_id_seq'::regclass);


--
-- TOC entry 3311 (class 2604 OID 16743)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 3322 (class 2604 OID 16744)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3509 (class 0 OID 16694)
-- Dependencies: 219
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.cart_items VALUES (63, 1, 3);
INSERT INTO public.cart_items VALUES (64, 1, 5);
INSERT INTO public.cart_items VALUES (70, 13, 6);
INSERT INTO public.cart_items VALUES (91, 1, 82);
INSERT INTO public.cart_items VALUES (92, 1, 83);
INSERT INTO public.cart_items VALUES (93, 1, 6);
INSERT INTO public.cart_items VALUES (94, 1, 61);


--
-- TOC entry 3511 (class 0 OID 16699)
-- Dependencies: 221
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.payments VALUES (92, 1, 1500.00, 'BRL', 'rejected', 'mercadopago', '126926292523', '2025-09-25 13:47:02.582648', '2025-09-25 13:47:02.582648', '{"items": [{"id": "4", "title": "Monitor Ultrawide", "quantity": "1", "unit_price": "1500.00", "category_id": "Monitores", "description": "Monitor gamer Full HD de 23.8 polegadas com taxa de atualiza├º├úo de 100Hz e tempo de resposta de 1ms, ideal para uma jogabilidade fluida."}], "payer": {"first_name": "Edilson Enzo", "registration_date": "2025-09-25T13:47:01.535Z"}, "tracking_id": "platform:v22|v22.15.1,so:so;,type:SDK2.9.0,security:none"}', 1);
INSERT INTO public.payments VALUES (109, 1, 2.30, 'BRL', 'rejected', 'mercadopago', '139538225309', '2025-12-31 15:44:25.716709', '2025-12-31 15:44:25.716709', '{"items": [{"id": "58", "title": "Teste", "quantity": "1", "unit_price": "2.30", "category_id": "Monitores", "description": "Produto teste"}], "payer": {"first_name": "Enzo SIlva", "registration_date": "2025-12-31T15:44:22.600Z"}, "tracking_id": "platform:v22|v22.20.0,so:so;,type:SDK2.9.0,security:none"}', 1);
INSERT INTO public.payments VALUES (110, 1, 1.01, 'BRL', 'approved', 'mercadopago', '140209351522', '2025-12-31 18:13:36.229714', '2025-12-31 18:13:36.229714', '{"items": [{"id": "58", "title": "Teste", "quantity": "1", "unit_price": "1.01", "category_id": "Monitores", "description": "Produto teste"}], "payer": {"first_name": "Enzo SIlva", "registration_date": "2025-12-31T18:13:33.174Z"}, "tracking_id": "platform:v22|v22.20.0,so:so;,type:SDK2.9.0,security:none"}', 1);


--
-- TOC entry 3518 (class 0 OID 35912)
-- Dependencies: 228
-- Data for Name: product_reviews; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.product_reviews VALUES (1, 53, 1, 5.00, NULL, 'Excelente produto, recomendo bastante!', NULL, true, '2026-09-21 14:59:52.262079');
INSERT INTO public.product_reviews VALUES (2, 9, 1, 5.00, NULL, 'Ótimo produto', NULL, true, '2026-09-21 17:37:06.667947');


--
-- TOC entry 3513 (class 0 OID 16712)
-- Dependencies: 223
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.products VALUES (20, 'Microfone Gamer Rgb', 134.90, 154.90, 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSZ8dXO0EfxjqEWs-VvV7U0fNtchj3R-IdVZtIVwaTncS3LPS2cyruayVgRa5bMffdWuZP40zwWuKeYrGpg43knVL-4CruN', 'Microfone de alta sensibilidade com ilumina├º├úo RGB. Perfeito para streaming, podcasts e chamadas em alta defini├º├úo.', '├üudio', '{microfone,gamer,rgb,streaming}', true, 1, 1.00, NULL, '2026-04-29 02:16:37.21076', '2026-04-29 02:16:37.21076', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (12, 'Setup Gamer', 2240.00, 3200.00, 'https://http2.mlstatic.com/D_730175-MLA87599323835_072025-C.jpg', 'Setup gamer com componentes equilibrados para rodar a maioria dos jogos atuais. ├ôtimo custo-benef├¡cio.', 'Setups', '{pc,setup,gamer,custo-benef├¡cio}', true, 12, 5.00, '{Preto,RGB}', '2026-04-29 02:16:37.21076', '2026-04-29 02:16:37.21076', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (11, 'Setup Gamer', 3960.00, 4400.00, 'https://cdn.dooca.store/559/products/c1-2.png?v=1719521111&webp=0', 'PC gamer completo com gabinete moderno e componentes de alto desempenho para uma experi├¬ncia de jogo inigual├ível.', 'Setups', '{pc,setup,gamer,gabinete}', true, 12, 5.00, '{Azul,Preto,RGB}', '2026-04-29 02:16:37.21076', '2026-04-29 02:16:37.21076', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (5, 'Webcam HD', 90.00, NULL, 'https://m.media-amazon.com/images/I/61-K2lXmHQL._UF894,1000_QL80_.jpg', 'Webcam com resolu├º├úo HD para videochamadas n├¡tidas e claras. Possui microfone embutido para praticidade.', 'Acess├│rios', '{webcam,hd,videochamada}', true, 6, 5.00, '{Preto}', '2026-04-29 02:16:37.21076', '2026-04-29 02:16:37.21076', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (6, 'PlayStation 5', 3150.00, 3500.00, 'https://m.media-amazon.com/images/I/41bsdF9lMPL._UF1000,1000_QL80_.jpg', 'Console de ├║ltima gera├º├úo com gr├íficos em 4K, carregamento ultra-r├ípido e ├íudio 3D. Acompanha controle sem fio DualSense.', 'Consoles', '{console,playstation,ps5,sony}', true, 12, 5.00, '{Branco,Preto}', '2026-04-29 02:16:37.21076', '2026-04-29 02:16:37.21076', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (13, 'Setup Gamer', 1750.00, 2500.00, 'https://m.media-amazon.com/images/I/71yKcQlBe3L.jpg', 'PC gamer de entrada, ideal para quem quer come├ºar a jogar. Roda jogos populares com boa performance.', 'Setups', '{pc,setup,gamer,entrada}', true, 12, 5.00, '{Preto,Vermelho,RGB}', '2026-04-29 02:16:37.21076', '2026-04-29 02:16:37.21076', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (14, 'PC Gamer Intel 12900', 5850.00, 6500.00, 'https://alfatecnologico.com.br/cdn/shop/files/minipc1site_2da5fa9b-4fb9-4c6a-ad47-264436d68aad_500x.jpg?v=1692657159', 'PC gamer compacto e poderoso, com processador Intel Core i9 de 12┬¬ gera├º├úo e placa de v├¡deo de alta performance.', 'Setups', '{pc,gamer,intel,compacto,gabinete}', true, 12, 5.00, '{Preto,Vermelho,RGB}', '2026-04-29 02:16:37.21076', '2026-04-29 02:16:37.21076', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (17, 'Kit Mouse e Mousepad', 88.80, NULL, 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcT2z88fUKY-6moIHlqoGzDrE_uCFQWVoxEvftjHRERr8Q6cZRnFjQSNa6WWxZIli3qMqF9JnlRdWOnAjBjeRNwKu_gyjQOc0vAr6rdMAKFkkLUX8z3YFRz7Uw', 'Kit com mouse gamer de alta precis├úo e mousepad com base de borracha antiderrapante. Perfeito para gamers.', 'Perif├®ricos', '{kit,mouse,mousepad,gamer}', true, 10, 5.00, '{Preto,RGB}', '2026-04-29 02:16:37.21076', '2026-04-29 02:16:37.21076', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (16, 'Volante Gamer com Pedal', 512.10, NULL, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcR2Wd7wEYFlKi5jFJ_us0avuMblHasaxMQ--As_mA4clnPAmLVKeXAT5CbSu-XCfRJya2ipiLlYzaCl8KzuCuzRyQFl4NSpBZi41PHVGGvQ-p-dqE3pHSya2w', 'Volante com rota├º├úo de 270┬░ e pedais sens├¡veis. Ideal para jogos de corrida no PC ou console.', 'Perif├®ricos', '{volante,gamer,pedal,corrida}', true, 12, 5.00, '{Preto}', '2026-04-29 02:16:37.21076', '2026-04-29 02:16:37.21076', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (3, 'Teclado Mecânico', 252.00, 280.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT7v4_hBRpFke1LOCdKc_wpQk8rkIifTQiNw&s', 'Teclado mecânico com switches de alta durabilidade e feedback tátil, perfeito para jogos e digitação intensa.', 'Periféricos', '{teclado,mecânico,gamer,durável}', true, 12, 5.00, '{Preto}', '2026-04-29 02:16:37.21076', '2026-04-29 02:16:37.21076', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (7, 'Óculos VR Quest', 4950.00, 5500.00, 'https://m.media-amazon.com/images/I/51pdPTbbjzL._UF894,1000_QL80_.jpg', 'Dispositivo de realidade virtual sem fio, ideal para jogos, filmes e experiências imersivas. Confortável e fácil de usar.', 'Realidade VR', '{vr,óculos,realidade-virtual,meta}', true, 12, 5.00, '{""}', '2026-04-29 02:16:37.21076', '2026-04-29 03:14:27.438303', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (8, 'Cadeira Gamer', 990.00, 1100.00, 'https://lojagoldentec.vteximg.com.br/arquivos/ids/165902-600-600/image-cff5e7dc880d4c21bb11ed10984a894b.jpg?v=638483534503930000', 'Cadeira ergon├┤mica com design gamer, suporte lombar e ajuste de altura. Perfeita para sess├Áes de jogo e trabalho prolongadas.', 'Periféricos', '{cadeira,gamer,ergon├┤mica}', true, 12, 5.00, '{Preto,Azul}', '2026-04-29 02:16:37.21076', '2026-09-21 01:15:39.822351', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (18, 'Headset Gamer Havit', 157.90, 171.90, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQTTzbU4WohMOrxdqK5v7KaeD6XLBWM1_zsU6DRmTpThdqUncDzr85dV60lLU7SFmCz9Owasm-Iqt6yAkn0A2Z0hs0sezMSyv1PXbSLQDJinvp_s7WJLo1K1wQ', 'Headset gamer com som surround, microfone ajust├ível e ilumina├º├úo LED. Design confort├ível para longas sess├Áes de jogo.', 'Áudio', '{headset,gamer,microfone,led}', true, 1, 1.00, '{""}', '2026-04-29 02:16:37.21076', '2026-09-21 01:16:09.420365', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (19, 'Headset Gamer Logitech', 292.90, 324.90, 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTxLlA7eHCcgf1kjA0Va_ove87EzLbYnUjlFxuw_udFV6UWQV6OghM7yRy-xq9iH32H87wnSwSET-3EwnFH8fL-XjvpzZgJUBUOojktvJn4IubazW9fVxnE3A', 'Headset Logitech com ├íudio de alta fidelidade e microfone com cancelamento de ru├¡do. Conforto e clareza para a comunica├º├úo em jogos.', 'Áudio', '{headset,gamer,logitech,microfone}', true, 1, 1.00, '{""}', '2026-04-29 02:16:37.21076', '2026-09-21 01:16:32.809835', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (10, 'Notebook Gamer', 5580.00, 6200.00, 'https://images.kabum.com.br/produtos/fotos/sync_mirakl/872622/xlarge/Notebook-Gamer-Asus-Rog-Strix-Scar-18-Intel-Core-Ultra-9-275hx-64GB-RAM-Nvidia-RTX5090-SSD-4TB-Tela-18-240Hz-Windows-11-Home-Black-G835lx_1755889506.jpg', 'Notebook gamer com tela de 18 polegadas, 240Hz, 64GB de RAM e 4TB de SSD. Uma verdadeira máquina para o seu setup.', 'Notebooks', '{notebook,gamer,asus,rtx,4k}', true, 12, 5.00, '{""}', '2026-04-29 02:16:37.21076', '2026-09-21 21:00:39.375182', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (22, 'Mouse Pad com Led Rgb', 49.90, 62.90, 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQd6yYl49cAP-28HZxSqXmHnSgInDl3iE5rB2iiw7hMqlFi3p17J9xkw1jmM2JxUhLIVnCSM4Q01aGcizj7_2nlzUWu3A1bYo1WqyjHEYCwHugurmnaOnC9Kg', 'Mousepad grande com ilumina├º├úo LED RGB nas bordas. Superf├¡cie lisa para movimentos precisos do mouse.', 'Acess├│rios', '{mousepad,led,rgb,gamer}', true, 1, 1.00, NULL, '2026-04-29 02:16:37.21076', '2026-04-29 02:16:37.21076', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (25, 'Microfone Maono', 199.90, 229.90, 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTx5vhqXWvHODONYux_BQmqOgKD7Qm4aD0I0wtAN0NHI4m1ey62n9hy20-jo1zohvaZtALwmJs-c97LPpgejI0_MrfSZ2LFu4y9kJukL_YHFMDhhSJKaPvwbQ', 'Microfone condensador USB com suporte de mesa e filtro pop. Ideal para grava├º├úo de voz e podcasts.', '├üudio', '{microfone,maono,streaming,podcast}', true, 1, 1.00, NULL, '2026-04-29 02:16:37.21076', '2026-04-29 02:16:37.21076', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (26, 'Fone De Ouvido Gamer', 115.90, 129.90, 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRCTXZef71YBVcPh4AGJlUhHQGADubNuoACXKhYf6tWPLIZLvTDUr_7RGJwp7lhNgrAWNDB6AnSKWeDk76mgLBpCzUXA77VXwqZJLCS_mHMRicV1vtqlgwf-jE', 'Fone de ouvido gamer com ├íudio de alta qualidade e graves potentes. Conector de 3.5mm compat├¡vel com diversas plataformas.', '├üudio', '{fone,gamer,headset,som}', true, 1, 1.00, NULL, '2026-04-29 02:16:37.21076', '2026-04-29 02:16:37.21076', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (37, 'Cadeira Gamer Prizi', 647.90, 719.90, 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTmYPHbVeuK779e3fvHOGzjF_7C47w2E5N1VElcQXLClCW0H_plIFl7DCs3ImVrHpEnyA5QCBpdL6-A62nhfbRRytUe5UXdJYKCTtX46iXOHVCP6DAovMVk2g', 'Desenvolvida para que o usu├írio tenha uma experi├¬ncia extremamente confort├ível e ergon├┤mica, mesmo que precise utilizar por muitas horas seguidas, seja para jogar, trabalhar, assistir um filme ou s├®rie, etc.', 'Acess├│rios', '{cadeira-gamer,confort├ível,preta,couro}', true, 12, 5.00, '{Preto}', '2026-04-29 02:16:37.21076', '2026-04-29 02:16:37.21076', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (24, 'Controle Wirelless Gamer', 169.90, 193.90, 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTlIRvPWFP6BpLgKRpjvdW_quhMiljc6_pPvtE7Bdg7G8WsJ5Y4Pvc_OCJbokl1kg85GC811SvKmXKVSdTqc_NcvWK0zG6Z3T550vEfCbjPWJ9Vj96KG8WnBA', 'Controle sem fio com design robusto e gatilhos responsivos. Compat├¡vel com PC, PlayStation e Nintendo Switch.', 'Consoles', '{controle,wireless,gamer,multiplataforma}', true, 1, 1.00, '{""}', '2026-04-29 02:16:37.21076', '2026-04-29 02:16:37.21076', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (47, 'Notebook Multi Ultra Celeron', 1290.90, 1499.90, 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRqJ7LN0cxV8Hrfu4Is5442_Y2fr1Z1FMbwnDaswrH4zS3n86r0bP-bjtq5cE-PqhwgEZlzzCzhEpstlmU7N8Lmm1l-IlPJ1ouyNbplP85G6QDEkwSHWkA9', 'Para quem busca tecnologia, acessibilidade e mobilidade, tudo em um ├║nico Notebook, o Notebook Multilaser Ultra 14" 128GB UB250 Windows 11 Cinza Escovado ├® a op├º├úo.

Como ele trabalhar e estudar ficar├í mais f├ícil. Al├®m de possuir Windows 11 Home, conta com:
 
4GB de Mem├│ria RAM e 128GB eMMC, entregando uma velocidade maior na utiliza├º├úo di├íria e armazenamento para suprir a necessidade de quem precisa de espa├ºo para suas fotos, v├¡deos e arquivos no dia a dia.
 
Com Processador Celeron N4020C, ├® ideal para quem quer tecnologia e pot├¬ncia aliadas ├á mobilidade. Tecla de atalho Prime v├¡deo, YouTube e Globo Play.', 'Notebooks', '{pc,gabinete,notebook,celeron}', true, 1, 1.00, NULL, '2026-04-29 02:16:37.21076', '2026-04-29 02:16:37.21076', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (23, 'Kit Teclado e Mouse Gamer', 54.31, NULL, 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSSdsAuWllgRwsTxEZo6kMAHmAG-43Zz-oGRzEQMI4uMQmsoxhbK3KOzUG-eaFsn3cIxYw1aPa_3nKfIDCiiqLiqkIN-LT4ZYkIGW4XlY3PADBMwhjemiAm', 'Kit essencial para gamers iniciantes. Teclado com teclas de atalho e mouse ergon├┤mico com DPI ajust├ível.', 'Perif├®ricos', '{kit,teclado,mouse,gamer,iniciante}', true, 6, 5.00, '{Preto,RGB}', '2026-04-29 02:16:37.21076', '2026-04-29 02:16:37.21076', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (27, 'Kit Mouse e Mousepad', 70.31, NULL, 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQqmPq-H4xFQo8L66M0mNW9RITeuZlL75L7d16wYr69jEWLWLOXnsNcy2LDfVCauzN_WMLn_uPi0HU_4kK-rRBBBv9XGsverkDxAO8N7m_k', 'Kit de mousepad estendido com ilumina├º├úo RGB e mouse gamer sem fio. Ideal para quem busca um setup minimalista.', 'Perif├®ricos', '{kit,mouse,mousepad,gamer,rgb,"sem fio"}', true, 6, 5.00, '{Laranja,Preto}', '2026-04-29 02:16:37.21076', '2026-04-29 02:16:37.21076', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (21, 'Controle 8BitDo Ultimate', 159.90, 184.90, 'https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQEmKI1haBD7B48t_neK4gr1LhqjMDEREREgSxf_5oFywMLCNkpW-Fy09xHxzziKGpQhlQtOfVKA06--EdVPWmNZAmzuVFbVw', 'Controle sem fio com alta compatibilidade e bot├Áes program├íveis. Bateria de longa dura├º├úo para sess├Áes de jogo estendidas.', 'Consoles', '{controle,"sem fio",8bitdo,gamer}', true, 1, 1.00, '{""}', '2026-04-29 02:16:37.21076', '2026-04-29 02:16:37.21076', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (48, 'Notebook 2 Em 1 Positivo', 1099.00, 1399.90, 'https://lojapositivo.vtexassets.com/arquivos/ids/163956/Positivo_Duo_2023_Ang_22.jpg?v=638189049199030000', 'Notebook 2 em 1 positivo duo c4128b-3 intel celeron dual core windows11 home 11,6┬┤┬┤ - cinza escuro - inclui microsoft 365*notebook ou tablet? Qual voc├¬ prefere para estudar e colocar em a├º├úo as atividades de trabalho com mais facilidade? Sem d├║vida, vai preferir o notebook positivo duo 2 em 1. Vers├ítil, o dispositivo ├® convers├¡vel e tem tela touchscreen. S├úo 4 posi├º├Áes diferentes para usar, que fazem dele multitarefas, sendo elas o modo cabana, tablet, modo apresenta├º├úo e o modo notebook, sendo ideal para sua rotina, adaptando-se ├á necessidade do seu momento.com tela touch hd ips de cores vivas e n├¡tidas, c├ómera integrada e 11,6 polegadas, o duo ├® leve e fino, pesando apenas 1,15kg. ', 'Notebooks', '{pc,notebook,positivo}', true, 1, 1.00, NULL, '2026-04-29 02:16:37.21076', '2026-04-29 02:16:37.21076', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (28, 'Kit Acess├│rios Mobile', 197.90, NULL, 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSacZCf-uht84OmNhvT5y6eMoPDjokVzkGSaDvDE-pS2G47MGxuQzUJGyUZxoRTGoUjkpWL23DXP8mtCxB4OkgxQQiJv79yZE51LypR2YVBCBDyz33S0HM5qQ', 'Kit gamer completo com teclado, mouse, mousepad, trip├® para celular e cabos adaptadores.', 'Perif├®ricos', '{fone,gamer,headset,confort├ível}', true, 12, 5.00, '{Preto,RGB}', '2026-04-29 02:16:37.21076', '2026-04-29 02:16:37.21076', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (9, 'Notebook Gamer', 5520.00, 6000.00, 'https://images3.kabum.com.br/produtos/fotos/467613/notebook-gamer-asus-rog-strix-g16-rtx-4060-16gb-ram-brinde-controle-ps4-g614jv-n3094w_1721229589_gg.jpg', 'Notebook de alta performance com processador Intel Core e placa de v├¡deo RTX, ideal para rodar os jogos mais exigentes.', 'Notebooks', '{notebook,gamer,asus,rtx}', true, 12, 5.00, '{""}', '2026-04-29 02:16:37.21076', '2026-04-29 02:16:37.21076', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (57, 'Mouse Gamer HyperX', 197.90, 219.90, 'https://www.kabum.com.br/_next/image?url=https%3A%2F%2Fimages5.kabum.com.br%2Fprodutos%2Ffotos%2Fsync_mirakl%2F177165%2Fxlarge%2FMouse-Gamer-Hyperx-Pulsefire-Core-Com-Fio-RGB-6200-Dpi-7-Bot-es-Hx-mc004b_1742320235.jpg&w=1920&q=75', 'Ter uma precis├úo extrema faz toda a diferen├ºa em uma partida e esse mouse gamer ir├í te auxiliar nas partidas para que voc├¬ busque sempre o primeiro lugar! Para deixar sua configura├º├úo mais pessoal e com exatid├úo, ├® poss├¡vel chegar at├® a 6200 DPI e isso gra├ºas ao incr├¡vel Sensor ├ôptico Pixart 3327 que tamb├®m n├úo deixa com acelera├º├úo para melhor desempenho.', 'Perif├®ricos', '{mouse,gamer,rgb,ergon├┤mico}', true, 12, 5.00, '{Preto,RGB}', '2026-04-29 02:16:37.21076', '2026-04-29 02:16:37.21076', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (52, 'Console Nintendo Switch OLED', 2151.00, 2389.90, 'https://www.kabum.com.br/_next/image?url=https%3A%2F%2Fimages3.kabum.com.br%2Fprodutos%2Ffotos%2Fsync_mirakl%2F637633%2Fxlarge%2FConsole-Nintendo-Switch-OLED-Branco-Com-Mario-Kart-8_1758382781.jpg&w=1920&q=75', 'O Console Nintendo Switch OLED Branco com Mario Kart 8 ├® a vers├úo definitiva para quem deseja a melhor experi├¬ncia de jogos em qualquer lugar. Com uma tela OLED de 7 polegadas, voc├¬ poder├í desfrutar de cores vibrantes e contraste superior, seja jogando no modo port├ítil, no modo de mesa ou na TV. O console oferece at├® tr├¬s formas diferentes de jogar, garantindo flexibilidade e divers├úo para todos os tipos de jogadores.
Al├®m da tecnologia OLED, esta vers├úo acompanha o aclamado jogo **Mario Kart 8 Deluxe**, permitindo que voc├¬ entre direto nas corridas mais emocionantes do mundo Mario. Gra├ºas aos Joy-Con remov├¡veis, voc├¬ pode jogar com seus amigos e familiares a qualquer hora. Este pacote ├® perfeito para quem busca qualidade gr├ífica, portabilidade e os melhores jogos da Nintendo.', 'Consoles', '{nintendo,switch,console,"video game"}', true, 12, 5.00, '{Branco,Preto}', '2026-04-29 02:16:37.21076', '2026-04-29 02:16:37.21076', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (54, ' Retro Classic Gaming Gamepads', 86.31, NULL, 'https://m.media-amazon.com/images/I/61H7LzYs5rL._AC_SX342_SY445_QL70_ML2_.jpg', 'F├ícil de usar: s├│ precisa conectar o console do jogo ├á interface da TV, o cabo de dados da fonte de alimenta├º├úo USB no host, a fonte da TV ├® ajustada ao canal de alta defini├º├úo correspondente para exibir a tela da lista de jogos na TV, e a al├ºa ├® colocada na bateria para controle remoto, ou seja, Plug and Play, simples e generosa, f├ícil de operar.', 'Consoles', '{console,"video game",retro}', true, 12, 5.00, '{Preto}', '2026-04-29 02:16:37.21076', '2026-04-29 02:16:37.21076', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (55, 'Sony Playstation 4 Standard', 2403.90, 2670.90, 'https://www.kabum.com.br/_next/image?url=https%3A%2F%2Fimages8.kabum.com.br%2Fprodutos%2Ffotos%2Fsync_mirakl%2F376298%2Fxlarge%2FConsole-Sony-Playstation-4-Standard-500GB-Preto_1746916230.jpg&w=1920&q=75', 'Console Ps4 Playstation 4 500gb + 1 Controle Dualshock Voc├¬ n├úo s├│ poder├í baixar os melhores jogos, mas tamb├®m navegar na web sem limites, gra├ºas ├á sua interconectividade global, tamb├®m ter├í a possibilidade de competir online com seus amigos e com pessoas de todo o mundo desfrutando de aventuras inesquec├¡veis. Qualidade de outro n├¡vel Voc├¬ poder├í reproduzir m├║sica, assistir seus filmes e s├®ries favoritos atrav├®s dos aplicativos disponibilizados.', 'Consoles', '{console,"video game",ps4,"playstation 4"}', true, 12, 5.00, '{Preto}', '2026-04-29 02:16:37.21076', '2026-04-29 02:16:37.21076', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (53, 'Console Xbox Series X, 1TB', 5380.10, NULL, 'https://www.kabum.com.br/_next/image?url=https%3A%2F%2Fimages5.kabum.com.br%2Fprodutos%2Ffotos%2Fsync_mirakl%2F311895%2Fxlarge%2FConsole-Xbox-Series-X-1TB-Microsoft-Preto-Rrt-00001_1744657832.jpg&w=1920&q=75', 'O Xbox Series X chega para revolucionar o mundo dos games!
Sendo o mais potente Xbox de todos os tempos ├® ideal para jogar seus jogos com excelente qualidade! Pode alcan├ºar at├® 120FPS e qualidade 4K de verdade nos jogos!

Os 12 teraflops de pot├¬ncia de processamento alojados no sistema em um chip (SOC), trabalham com as arquiteturas Zen 2 e RDNA 2 da AMD para resultar em mundos que exigem um olhar mais atento.', 'Consoles', '{console,xbox,"video game"}', true, 12, 5.00, '{Preto}', '2026-04-29 02:16:37.21076', '2026-04-29 02:16:37.21076', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (15, 'Setup Gamer Completo', 4050.00, 4500.00, 'https://shopinfo.vteximg.com.br/arquivos/ids/1718054-400-400/1.png?v=638877679507700000', 'Setup completo com PC, monitor e acess├│rios. Pronto para jogar, trabalhar e estudar. ├ôtimo para quem busca praticidade.', 'Setups', '{pc,setup,gamer,completo,acess├│rios}', true, 12, 5.00, '{Preto,RGB}', '2026-04-29 02:16:37.21076', '2026-04-29 02:16:37.21076', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (59, 'Mouse Sem fio Gamer Logitech G305', 99.39, 152.90, 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTFEmhUqNJtEGaDAuDYnMx3jLOrSmFOfSoIrhjw70UxUNTfR50il0VezIrOIsAyZ-lM5iMu8M3OgYNzzFeiyiUIXmUylBLv', 'Sensor HERO de 12.000 DPI
O G305 apresenta o sensor HERO de ├║ltima gera├º├úo com sensibilidade de 200 a 12.000 DPI para precis├úo de n├¡vel de competi├º├úo. 

 

Pilha de dura├º├úo ultralonga 
A tecnologia sem fio LIGHTSPEED oferece desempenho super r├ípido de 1ms. Com incr├¡vel efici├¬ncia de energia, o G305 permanece ligado e pronto para jogar por at├® 250 horas com uma ├║nica pilha AA inclusa. 

 

Design Ultraleve, Compacto e Port├ítil
Jogue em qualquer lugar com este mouse para jogos ultra-port├ítil e leve que pesa apenas 99 gramas, ├® f├ícil de transportar com voc├¬ e tem armazenamento integrado para o receptor sem fio USB incluso. Use o Software Logitech G HUB para programar rapidamente os 6 bot├Áes com comandos instant├óneos, configura├º├Áes de DPI e muito mais. O G305 ├® o mouse sem fio LIGHTSPEED para todos.', 'Perif├®ricos', '{mouse,gamer,rgb,ergon├┤mico,"sem fio"}', true, 10, 10.00, '{Preto}', '2026-04-29 02:16:37.21076', '2026-04-29 02:16:37.21076', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (73, 'Óculos de Realidade Virtual Meta Quest 3 128GB', 4299.90, 4599.90, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_Plcllln2USueLxKMs-iXRlbihvceCIgYX88fC9bdcchCS-nEwOd_0WY&s=10', 'Headset VR independente com tecnologia de realidade mista avançada, controles Touch Plus com sensores de precisão e áudio 3D integrado.', 'Realidade VR', '{vr,meta,realidade-virtual,tech}', true, 12, 0.00, '{branco}', '2026-09-19 21:51:58.427519', '2026-09-19 21:51:58.427519', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (2, 'Mouse Gamer', 144.00, 160.00, 'https://img.terabyteshop.com.br/produto/g/mouse-gamer-razer-cobra-rgb-6-botoes-programaveis-8500-dpi-black-rz0104650100r3u_180092.jpg', 'Mouse ergonômico com iluminação RGB, 6 botões programáveis e 8500 DPI para uma experiência de jogo precisa e responsiva.', 'Periféricos', '{mouse,gamer,rgb,ergonômico}', true, 6, 5.00, '{Preto,RGB}', '2026-04-29 02:16:37.21076', '2026-04-29 02:16:37.21076', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (1, 'Fone de Ouvido', 99.00, 110.00, 'https://cdn.awsli.com.br/2500x2500/1307/1307157/produto/138258516/cd9356d94a.jpg', 'Fone de ouvido de alta qualidade, ideal para músicas e chamadas com clareza sonora. Design confortável para longas horas de uso.', 'Periféricos', '{fone,fio,headphone,confortável}', true, 12, 5.00, '{Preto,RGB}', '2026-04-29 02:16:37.21076', '2026-09-21 00:01:25.109404', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (62, 'Teclado Mecânico RGB Pro Switch Blue', 299.90, 349.90, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXnIabQ5BKdIU_QZlBFlYL7HqBewSpE4vVdKD4jiwgrrBQ0USrOjR7DN3j&s=10', 'Teclado mecânico de alta precisão com iluminação RGB personalizável, switches táteis e estrutura em alumínio reforçado.', 'Periféricos', '{gamer,teclado,rgb,mecanico}', true, 12, 0.00, '{preto,branco}', '2026-09-19 21:51:58.427519', '2026-09-19 21:51:58.427519', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (63, 'Mouse Gamer Sem Fios Ultra-Leve 26K DPI', 249.00, 299.00, 'https://images.kabum.com.br/produtos/fotos/904355/mouse-gamer-sem-fio-attack-shark-x6-white_1767896841_gg.jpg', 'Rato ergonómico de alta sensibilidade com sensor ótico de 26.000 DPI, bateria de longa duração e peso reduzido de 55g.', 'Periféricos', '{gamer,mouse,wireless,eSports}', true, 10, 0.00, '{preto,cinzento}', '2026-09-19 21:51:58.427519', '2026-09-19 21:51:58.427519', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (64, 'Headset Gamer Som Surround 7.1 USB', 189.90, NULL, 'https://images.kabum.com.br/produtos/fotos/486211/headset-gamer-fifine-h9-som-surround-7-1-usb-console-e-pc-preto-h9_1707222199_gg.jpg', 'Auscultadores com microfone com cancelamento de ruído, drivers de 50mm e almofadas de espuma de memória confortáveis.', 'Áudio', '{headset,audio,surround,streamer}', true, 6, 0.00, '{preto,vermelho}', '2026-09-19 21:51:58.427519', '2026-09-19 21:51:58.427519', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (65, 'Monitor Gamer 27" FHD 165Hz 1ms IPS', 1299.00, 1499.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgvf27FYnO1NRkRg3TUyOsh9Pl2Oc0isDEnAHU6lOOhK8kbQsFDSqc-j4&s=10', 'Painel IPS com reprodução de cor fiel, taxa de atualização de 165Hz e compatibilidade com tecnologia FreeSync/G-Sync.', 'Monitores', '{monitor,165hz,ips,setup}', true, 12, 0.00, '{preto}', '2026-09-19 21:51:58.427519', '2026-09-19 21:51:58.427519', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (66, 'Placa Gráfica RTX 4060 8GB GDDR6', 2399.90, 2699.90, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpy7MMm87dAGf6xRW7rqnscY1h9KucWlh34I9t2BroICWDY__WiYuSYgI&s=10', 'Desempenho gráfico elevado com suporte para Ray Tracing, DLSS 3 e arrefecimento de ventoinha dupla eficiente.', 'Hardware', '{gpu,rtx,hardware,placa-de-video}', true, 12, 0.00, '{preto}', '2026-09-19 21:51:58.427519', '2026-09-19 21:51:58.427519', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (67, 'Cadeira Gamer Ergonómica Pro Reclinável', 899.00, 1099.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjtOPDTi-9bCZrNKUvpdXSx7Wmnyz-nmk7-rwAsWanykAL-ZpM2JWzHKg&s=10', 'Design desportivo com ajuste de braços 3D, apoio lombar e cervical ajustável, revestida em pele sintética de alta densidade.', 'Periféricos', '{cadeira,ergonomia,setup,conforto}', true, 10, 0.00, '{preto,azul}', '2026-09-19 21:51:58.427519', '2026-09-19 21:51:58.427519', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (68, 'Processador AMD Ryzen 7 5700X3D 3.0GHz', 1399.90, 1599.90, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3Dnu1s1vQ96jPqru12R0R3B1GgT6MNUHrhMCInZtPjiJspx6WvUqoj8E&s=10', 'Processador gamer de alta performance com tecnologia 3D V-Cache, 8 núcleos e 16 threads para taxa de quadros máxima nos jogos.', 'Hardware', '{processador,ryzen,cpu,amd}', true, 12, 0.00, '{cinza}', '2026-09-19 21:51:58.427519', '2026-09-19 21:51:58.427519', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (69, 'Notebook Gamer i7 16GB RAM RTX 4050', 4899.00, 5299.00, 'https://images.kabum.com.br/produtos/fotos/sync_mirakl/916712/xlarge/Notebook-Gamer-Acer-Nitro-V15-Intel-Core-i7-13620H-13-Gera-o-16GB-RAM-SSD-512GB-RTX-4050-Tela-15-6-Full-HD-165Hz-Linux-ANV15-52-737P_1788550120.jpg', 'Notebook de alto desempenho para jogos e criação de conteúdo, com tela FHD 144Hz, SSD NVMe de 512GB e teclado retroiluminado.', 'Notebooks', '{notebook,gamer,rtx,intel}', true, 12, 0.00, '{preto}', '2026-09-19 21:51:58.427519', '2026-09-19 21:51:58.427519', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (70, 'Console PlayStation 5 Slim Edição Digital', 3799.00, NULL, 'https://images.kabum.com.br/produtos/fotos/542929/console-playstation-5-slim-ssd-1tb-edicao-digital-branco-2-jogos-1000038914_1728056167_gg.jpg', 'Aproveite o carregamento hiper-rápido com um SSD de altíssima velocidade, imersão mais profunda com suporte a feedback tátil e áudio 3D.', 'Consoles', '{console,ps5,playstation,sony}', true, 12, 0.00, '{branco}', '2026-09-19 21:51:58.427519', '2026-09-19 21:51:58.427519', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (71, 'Mousepad Gamer Extra Grande 900x400mm RGB', 89.90, 119.90, 'https://images.kabum.com.br/produtos/fotos/1003628/mousepad-gamer-rise-mode-rgb-pro-estendido-900x400mm-preto-rm-mpp-07-rgb_1787575075_gg.jpg', 'Superfície em tecido de microfibra de alta densidade otimizada para sensores óticos e laser, com bordas costuradas e iluminação RGB.', 'Acessórios', '{mousepad,rgb,deskmat,acessorios}', true, 3, 0.00, '{preto}', '2026-09-19 21:51:58.427519', '2026-09-19 21:51:58.427519', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (72, 'Memória RAM DDR5 32GB (2x16GB) 6000MHz', 849.90, 999.90, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYx8bAxkZMCgE0ds4Nh0F3mhHtLGy0YnjAqiJy4PpvgzYSha_DuvDiwS1E&s=10', 'Kit de memória de alta velocidade otimizado para plataformas Intel e AMD de última geração com dissipador de calor em alumínio.', 'Hardware', '{ram,ddr5,memoria,hardware}', true, 10, 0.00, '{preto,prata}', '2026-09-19 21:51:58.427519', '2026-09-19 21:51:58.427519', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (61, 'Teste', 1.99, NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr_w-WquCZlbEq_pGnJHcdMNc_1UiNNKjeXQ&s', 'Teste', 'Áudio', '{""}', false, 1, 0.00, '{""}', '2026-04-29 03:16:13.448095', '2026-09-20 01:52:39.801783', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (74, 'SSD M.2 NVMe 2TB PCIe 4.0 7300MB/s', 929.90, 1099.90, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhxQ8p9QqqqZKHkeLNNKyEXsCCUNyYsj4cvcojltqWjvchGLjzKUMc_1E&s=10', 'Taxas de transferência ultra-rápidas ideais para reduzir o tempo de carregamento de jogos pesados e edição de vídeo em 4K.', 'Hardware', '{ssd,nvme,armazenamento,hardware}', true, 10, 0.00, '{preto}', '2026-09-19 21:51:58.427519', '2026-09-19 21:51:58.427519', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (75, 'Microfone Condensador USB para Streamer', 349.90, NULL, 'https://images.kabum.com.br/produtos/fotos/sync_mirakl/690545/xlarge/Microfone-Gamer-USB-Condensador-com-LED-para-Streaming-e-Jogos-Preto-com-Filtro_1744914035.jpg', 'Captura de áudio cristalina com padrão polar cardioide, controle de ganho integrado, botão Mute sensível ao toque e filtro pop.', 'Áudio', '{microfone,streamer,usb,audio}', true, 6, 0.00, '{preto,rosa}', '2026-09-19 21:51:58.427519', '2026-09-19 21:51:58.427519', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (76, 'Gabinete Gamer Mid Tower Vidro Temperado', 399.00, 459.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtRGb0X6Eun5xSd5GR4L_EgS9IA2MiQ4WnQoUaQpH43ABWVA_mPtHEIT8&s=10', 'Painel frontal em mesh para fluxo de ar máximo, lateral em vidro temperado magnético e suporte para até 6 ventoinhas de 120mm.', 'Setups', '{gabinete,setup,rgb,pc}', true, 6, 0.00, '{preto,branco}', '2026-09-19 21:51:58.427519', '2026-09-19 21:51:58.427519', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (77, 'Water Cooler ARGB 240mm para Processador', 429.90, 499.90, 'https://images.kabum.com.br/produtos/fotos/248205/water-cooler-gamer-rise-mode-argb-intel-e-amd-240mm-preto-rm-wcb-04-argb_1663778106_gg.jpg', 'Sistema de arrefecimento líquido de alto desempenho com bomba silenciosa, tubos trançados de alta durabilidade e duas ventoinhas ARGB.', 'Hardware', '{cooler,watercooler,argb,hardware}', true, 6, 0.00, '{preto,branco}', '2026-09-19 21:51:58.427519', '2026-09-19 21:51:58.427519', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (79, 'Braço Articulado para Microfone com Organizador de Cabos', 199.00, 229.00, 'https://http2.mlstatic.com/D_NQ_NP_860770-MLB89315371656_082025-O-braco-articulado-para-microfone-com-organizador-de-cabos.webp', 'Braço de suporte ajustável para microfones de estúdio, com rotação 360°, molas internas e canal de gestão de cabos escondido.', 'Acessórios', '{acessorios,microfone,streamer,suporte}', true, 6, 0.00, '{preto}', '2026-09-19 21:51:58.427519', '2026-09-19 21:51:58.427519', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (80, 'Filtro de Linha e Protetor de Surto 8 Tomadas + 4 USB', 129.90, NULL, 'https://carrefourbr.vtexassets.com/arquivos/ids/213291960-848-848/image-0.jpg?v=639087564354230000', 'Filtro de linha profissional contra picos de tensão, com interruptor individual, circuito de proteção e portas de carregamento rápido USB.', 'Acessórios', '{acessorios,energia,setup,protecao}', true, 4, 0.00, '{preto,branco}', '2026-09-19 21:51:58.427519', '2026-09-19 21:51:58.427519', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (81, 'Webcam Full HD 1080p 60fps com Microfone Duplo', 279.90, 329.90, 'https://cdn.shoppub.io/cdn-cgi/image/w=1000,h=1000,q=80,f=auto/oficinadosbits/media/uploads/produtos/foto/widruvcx/file.png', 'Webcam de alta definição com focado automático rápido, correção de luz automática e tampa de privacidade integrada.', 'Acessórios', '{acessorios,webcam,streamer,fullhd}', true, 10, 0.00, '{preto}', '2026-09-19 21:51:58.427519', '2026-09-19 21:51:58.427519', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (82, 'Apoio de Pulso Ergonómico em Gel para Teclado', 59.90, 79.90, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlwks5JRyePQcvCkPE_K4E9YE7hmnkISaaee8SgxVTd4DT_wc3J_cHfv4&s=10', 'Base de apoio em espuma de memória macia e gel refrigerante para evitar fadiga muscular durante longas sessões de trabalho ou jogo.', 'Acessórios', '{acessorios,ergonomia,teclado,conforto}', true, 2, 0.00, '{preto}', '2026-09-19 21:51:58.427519', '2026-09-19 21:51:58.427519', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (83, 'Suporte Articulado a Gás para 2 Monitores (17" a 32")', 349.00, 399.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR80XAJse1WaMwJGlev9tF634qD6a66k1kDUgbjAThrBzsWUjF4QZ_ZqSQ&s=10', 'Pistão a gás para ajuste suave de altura, inclinação e rotação 360° para dois monitores simultâneos, libertando espaço na secretária.', 'Acessórios', '{acessorios,suporte,monitor,setup}', true, 10, 0.00, '{preto}', '2026-09-19 21:51:58.427519', '2026-09-19 21:51:58.427519', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (84, 'Kit de Ferramentas de Precisão 120 em 1 para Eletrónica', 99.90, 119.90, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7N-A0Xkq0lTn0zmNjDmQlrz6Pqfi8UC_M5P7Vjqx1t1F8nvydDQwo9gTn&s=10', 'Conjunto completo de chaves e pontas magnéticas em aço CR-V para manutenção de computadores, portáteis, telemóveis e consolas.', 'Acessórios', '{acessorios,ferramentas,manutencao,hardware}', true, 3, 0.00, '{azul,preto}', '2026-09-19 21:51:58.427519', '2026-09-19 21:51:58.427519', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (85, 'Cabo HDMI 2.1 Ultra High Speed 8K 60Hz 2 Metros', 69.90, NULL, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDszXk_ELIPiVSYe3phzWh16c8wqQbfkXaJTU_bjHWxR0V267OtHpXWNbF&s=10', 'Cabo com revestimento em nylon trançado, conetores banhados a ouro e suporte a eARC, Dynamic HDR e largura de banda de 48Gbps.', 'Acessórios', '{acessorios,cabo,hdmi,8k}', true, 2, 0.00, '{preto}', '2026-09-19 21:51:58.427519', '2026-09-19 21:51:58.427519', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (49, 'Notebook Acer Intel', 2589.99, 2799.99, 'https://acerstore.vtexassets.com/arquivos/ids/167513-800-auto?v=639217229694130000&width=800&height=auto&aspect=true', 'O Aspire 3 foi desenvolvido para aqueles que querem estudar, trabalhar ou se divertir com facilidade gastando pouco. Independente do seu estilo de vida e da sua fam├¡lia, o processador Intel Core i3 n├úo vai deixar ningu├®m na m├úo.
Nada melhor do que abrir arquivos e dispositivos importantes sem ter que esperar para ter acesso, n├úo ├® mesmo? Com o SSD 256 GB a leitura e grava├º├úo das informa├º├Áes ├® feita em quest├úo de segundos ap├│s ligar o notebook.', 'Notebooks', '{pc,notebook,acer,intel}', true, 1, 1.00, '{""}', '2026-04-29 02:16:37.21076', '2026-09-20 01:55:22.140361', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (60, 'Fone de ouvido Logitech G Series G435', 344.92, 459.90, 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcQuh8ohkmdl7Jmpv5jzNnBuK5gVYCiBDuodeze9tqmwpg_-9zDBYhYsp2Xx24fUZQYFsk8MgH1OgXIIGsYEBzMGb0l_RMW8PQ', 'Jogue jogos e escute m├║sica com conforto com um som potente e cristalino. Os microfones que formam um feixe duplo reduzem o ru├¡do de fundo. Conecte a seus dispositivos via LIGHTSPEED sem fio e Bluetooth┬« de baixa lat├¬ncia.

LIGHTSPEED ├® uma tecnologia sem fio de grau de jogo que lhe permite jogar com resposta de ├íudio de alto desempenho, forte conectividade e longa dura├º├úo da bateria. Todos com at├® 10 metros de alcance. Compat├¡vel com Windows, Mac, PlayStation 4 e PlayStation 5.', 'Áudio', '{fone,"sem fio",headphone,confort├ível}', true, 12, 12.00, '{Branco,Preto,Amarelo}', '2026-04-29 02:16:37.21076', '2026-09-21 01:15:08.22643', 0.500, 20, 10, 20, 50);
INSERT INTO public.products VALUES (78, 'Suporte para Headset RGB com Hub USB 3.0', 149.90, 189.90, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlBMb5I3N28cnwsgXstQjbDhNIIFCkaIp3eVn9zoRjXA&s=10', 'Suporte de mesa para auscultadores com base antiderrapante, iluminação RGB personalizável e 2 portas USB 3.0 integradas.', 'Acessórios', '{acessorios,headset,suporte,rgb}', true, 6, 0.00, '{preto}', '2026-09-19 21:51:58.427519', '2026-09-21 01:21:47.320315', 0.500, 20, 10, 20, 50);


--
-- TOC entry 3515 (class 0 OID 16727)
-- Dependencies: 225
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES (6, 'Cliente Exemplo 1', 'cliente1@exemplo.com.br', 'senha_hash_mock_6', 0.00, 'user', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'mock_firebase_uid_00000000006', '2026-04-29 02:16:37.21076', '2026-04-29 02:16:37.21076');
INSERT INTO public.users VALUES (11, 'Cliente Exemplo 2', 'cliente2@exemplo.com.br', NULL, 0.00, 'user', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'mock_firebase_uid_00000000011', '2026-09-17 14:57:32.099127', '2026-09-17 14:57:32.099127');
INSERT INTO public.users VALUES (13, 'Cliente Exemplo 3', 'cliente3@exemplo.com.br', NULL, 0.00, 'user', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'mock_firebase_uid_00000000013', '2026-09-18 19:09:08.970676', '2026-09-18 19:09:08.970676');
INSERT INTO public.users VALUES (1, 'Administrador Teste', 'admin@exemplo.com.br', 'senha_hash_mock_1', 0.90, 'admin', NULL, '67999998888', 'Rua das Flores', '100', 'Centro', 'CAMPO GRANDE', '79000000', 'MS', 'mock_firebase_uid_00000000001', '2026-04-29 02:16:37.21076', '2026-04-29 02:16:37.21076');


--
-- TOC entry 3529 (class 0 OID 0)
-- Dependencies: 220
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 94, true);


--
-- TOC entry 3530 (class 0 OID 0)
-- Dependencies: 222
-- Name: payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payments_id_seq', 128, true);


--
-- TOC entry 3531 (class 0 OID 0)
-- Dependencies: 227
-- Name: product_reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_reviews_id_seq', 2, true);


--
-- TOC entry 3532 (class 0 OID 0)
-- Dependencies: 224
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_id_seq', 61, true);


--
-- TOC entry 3533 (class 0 OID 0)
-- Dependencies: 226
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 23, true);


--
-- TOC entry 3332 (class 2606 OID 16746)
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3334 (class 2606 OID 16748)
-- Name: cart_items cart_items_user_id_product_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_user_id_product_id_key UNIQUE (user_id, product_id);


--
-- TOC entry 3338 (class 2606 OID 16750)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- TOC entry 3340 (class 2606 OID 16752)
-- Name: payments payments_provider_payment_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_provider_payment_id_key UNIQUE (provider_payment_id);


--
-- TOC entry 3356 (class 2606 OID 35926)
-- Name: product_reviews product_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_pkey PRIMARY KEY (id);


--
-- TOC entry 3342 (class 2606 OID 16754)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 3336 (class 2606 OID 52400)
-- Name: cart_items uk1vhvont0fdtramle6nmghntj7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT uk1vhvont0fdtramle6nmghntj7 UNIQUE (user_id, product_id);


--
-- TOC entry 3344 (class 2606 OID 52313)
-- Name: users users_cpf_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_cpf_key UNIQUE (cpf);


--
-- TOC entry 3346 (class 2606 OID 16758)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3348 (class 2606 OID 52326)
-- Name: users users_firebase_uid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_firebase_uid_key UNIQUE (firebase_uid);


--
-- TOC entry 3350 (class 2606 OID 52350)
-- Name: users users_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_number_key UNIQUE (number);


--
-- TOC entry 3352 (class 2606 OID 52363)
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- TOC entry 3354 (class 2606 OID 16766)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3357 (class 2606 OID 16767)
-- Name: cart_items cart_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 3358 (class 2606 OID 16772)
-- Name: cart_items cart_items_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3359 (class 2606 OID 16777)
-- Name: payments payments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3360 (class 2606 OID 35927)
-- Name: product_reviews product_reviews_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 3361 (class 2606 OID 35932)
-- Name: product_reviews product_reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2026-11-01 19:24:12

--
-- PostgreSQL database dump complete
--

