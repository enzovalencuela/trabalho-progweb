-- =============================================================
-- NexGen Store — Seed Data
-- Apenas INSERTs idempotentes (ON CONFLICT DO NOTHING)
-- Compatível 100% com o schema das entidades JPA do backend
-- =============================================================

-- Compatibilidade de coluna de imagem caso exista com nome alternativo
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'product_reviews' AND column_name = 'image_url') 
       AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'product_reviews' AND column_name = 'img_url') THEN
        ALTER TABLE public.product_reviews RENAME COLUMN image_url TO img_url;
    END IF;
END $$;

-- -------------------------
-- USERS
-- Colunas exatas da entidade User.java:
-- id, name, email, password, balance, role, cpf, phone, address, number, neighborhood, city, zip, state, firebase_uid, created_at, updated_at
-- -------------------------
INSERT INTO public.users (id, name, email, password, balance, role, cpf, phone, address, number, neighborhood, city, zip, state, firebase_uid, created_at, updated_at)
VALUES
  (1,  'Administrador NexGen',   'admin@nexgen.com.br',     'senha_hash_admin_1',  0.00, 'admin', '000.000.000-01', '67999990001', 'Rua das Flores',      '100', 'Centro',      'Campo Grande', '79000-000', 'MS', 'mock_firebase_uid_00000000001', NOW(), NOW()),
  (6,  'Ana Beatriz Souza',      'ana.souza@email.com',     'senha_hash_mock_6',   0.00, 'user',  NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'mock_firebase_uid_00000000006', NOW(), NOW()),
  (11, 'Carlos Eduardo Lima',    'carlos.lima@email.com',   NULL,                  0.00, 'user',  NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'mock_firebase_uid_00000000011', NOW(), NOW()),
  (13, 'Fernanda Costa Martins', 'fernanda.cm@email.com',   NULL,                  0.00, 'user',  NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'mock_firebase_uid_00000000013', NOW(), NOW()),
  (15, 'Rafael Pereira Santos',  'rafael.santos@email.com', NULL,                  0.00, 'user',  NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'mock_firebase_uid_00000000015', NOW(), NOW()),
  (16, 'Julia Alves Ramos',      'julia.ramos@email.com',   NULL,                  0.00, 'user',  NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'mock_firebase_uid_00000000016', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('public.users', 'id'), COALESCE((SELECT MAX(id) FROM public.users), 1));


-- -------------------------
-- PRODUCTS
-- Colunas exatas da entidade Product.java:
-- id, titulo, preco, preco_original, img, descricao, categoria, tags, disponivel, max_parcelas, taxa_parcela, cores, created_at, updated_at
-- (Sem colunas inexistentes como peso_kg, largura_cm, altura_cm, comprimento_cm, estoque)
-- -------------------------
INSERT INTO public.products (id, titulo, preco, preco_original, img, descricao, categoria, tags, disponivel, max_parcelas, taxa_parcela, cores, created_at, updated_at)
VALUES
  (1,  'Fone de Ouvido Gamer',              99.00,   110.00,  'https://cdn.awsli.com.br/2500x2500/1307/1307157/produto/138258516/cd9356d94a.jpg',
       'Fone de ouvido de alta qualidade com som estéreo potente. Design confortável para longas horas de uso e compatível com PC e consoles.',
       'Periféricos', '{fone,headphone,confortável,gamer}', true, 12, 5.00, '{Preto,RGB}', NOW(), NOW()),

  (2,  'Mouse Gamer Razer Cobra RGB',        144.00,  160.00,  'https://img.terabyteshop.com.br/produto/g/mouse-gamer-razer-cobra-rgb-6-botoes-programaveis-8500-dpi-black-rz0104650100r3u_180092.jpg',
       'Mouse ergonômico com iluminação RGB, 6 botões programáveis e sensor óptico de 8500 DPI para precisão máxima nos jogos.',
       'Periféricos', '{mouse,gamer,rgb,ergonômico}', true, 6, 5.00, '{Preto,RGB}', NOW(), NOW()),

  (3,  'Teclado Mecânico Gamer Switch Blue',  252.00,  280.00,  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT7v4_hBRpFke1LOCdKc_wpQk8rkIifTQiNw&s',
       'Teclado mecânico com switches Blue de alta durabilidade e feedback tátil auditivo. Iluminação RGB por tecla e estrutura em alumínio.',
       'Periféricos', '{teclado,mecânico,gamer,switch-blue}', true, 12, 5.00, '{Preto}', NOW(), NOW()),

  (5,  'Webcam Full HD 1080p',               90.00,   NULL,    'https://m.media-amazon.com/images/I/61-K2lXmHQL._UF894,1000_QL80_.jpg',
       'Webcam com resolução Full HD para videochamadas nítidas. Possui microfone embutido com cancelamento de ruído e ajuste automático de luminosidade.',
       'Acessórios', '{webcam,hd,videochamada,streamer}', true, 6, 5.00, '{Preto}', NOW(), NOW()),

  (6,  'PlayStation 5 Standard + DualSense',  3150.00, 3500.00, 'https://m.media-amazon.com/images/I/41bsdF9lMPL._UF1000,1000_QL80_.jpg',
       'Console de última geração com gráficos em 4K, carregamento ultra-rápido via SSD e áudio 3D imersivo. Acompanha controle DualSense com feedback háptico.',
       'Consoles', '{console,playstation,ps5,sony}', true, 12, 5.00, '{Branco,Preto}', NOW(), NOW()),

  (8,  'Cadeira Gamer Ergonômica Pro',        990.00,  1100.00, 'https://lojagoldentec.vteximg.com.br/arquivos/ids/165902-600-600/image-cff5e7dc880d4c21bb11ed10984a894b.jpg?v=638483534503930000',
       'Cadeira ergonômica com design gamer premium, suporte lombar ajustável, apoio de braços 4D e encosto reclinável até 180°. Ideal para sessões prolongadas.',
       'Periféricos', '{cadeira,gamer,ergonômica,conforto}', true, 12, 5.00, '{Preto,Azul}', NOW(), NOW()),

  (9,  'Notebook Gamer Asus ROG RTX 4060',    5520.00, 6000.00, 'https://images3.kabum.com.br/produtos/fotos/467613/notebook-gamer-asus-rog-strix-g16-rtx-4060-16gb-ram-brinde-controle-ps4-g614jv-n3094w_1721229589_gg.jpg',
       'Notebook de alta performance com processador Intel Core i7, placa RTX 4060, 16GB RAM e SSD 512GB. Tela de 16" FHD 165Hz para uma experiência de jogo fluida.',
       'Notebooks', '{notebook,gamer,asus,rtx,intel}', true, 12, 5.00, '{""}', NOW(), NOW()),

  (10, 'Notebook Gamer Asus ROG Strix 18"',   5580.00, 6200.00, 'https://images.kabum.com.br/produtos/fotos/sync_mirakl/872622/xlarge/Notebook-Gamer-Asus-Rog-Strix-Scar-18-Intel-Core-Ultra-9-275hx-64GB-RAM-Nvidia-RTX5090-SSD-4TB-Tela-18-240Hz-Windows-11-Home-Black-G835lx_1755889506.jpg',
       'O topo de linha da Asus ROG. Tela de 18" 240Hz QHD, RTX 5090, 64GB DDR5 e SSD de 4TB. Uma verdadeira máquina de guerra para o setup mais exigente.',
       'Notebooks', '{notebook,gamer,asus,rtx,4k,ultrawide}', true, 12, 5.00, '{""}', NOW(), NOW()),

  (11, 'Setup Gamer Premium RGB',             3960.00, 4400.00, 'https://cdn.dooca.store/559/products/c1-2.png?v=1719521111&webp=0',
       'PC gamer completo com gabinete full tower, RTX 4070, Ryzen 7, 32GB DDR5. Pronto para rodar qualquer jogo no ultra com alto FPS.',
       'Setups', '{pc,setup,gamer,gabinete,rgb}', true, 12, 5.00, '{Azul,Preto,RGB}', NOW(), NOW()),

  (12, 'Setup Gamer Custo-Benefício',          2240.00, 3200.00, 'https://http2.mlstatic.com/D_730175-MLA87599323835_072025-C.jpg',
       'Setup gamer com GPU RTX 3060, Ryzen 5 5600X, 16GB RAM e SSD 500GB. Componentes equilibrados para rodar todos os jogos atuais com ótimo desempenho.',
       'Setups', '{pc,setup,gamer,custo-benefício}', true, 12, 5.00, '{Preto,RGB}', NOW(), NOW()),

  (13, 'Setup Gamer Entrada',                 1750.00, 2500.00, 'https://m.media-amazon.com/images/I/71yKcQlBe3L.jpg',
       'PC gamer de entrada com processador Intel Core i5, 8GB RAM e GTX 1660. Roda jogos populares como Valorant, CS2 e FIFA com boa performance.',
       'Setups', '{pc,setup,gamer,entrada}', true, 12, 5.00, '{Preto,Vermelho,RGB}', NOW(), NOW()),

  (17, 'Kit Mouse e Mousepad Gamer',           88.80,   NULL,    'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcT2z88fUKY-6moIHlqoGzDrE_uCFQWVoxEvftjHRERr8Q6cZRnFjQSNa6WWxZIli3qMqF9JnlRdWOnAjBjeRNwKu_gyjQOc0vAr6rdMAKFkkLUX8z3YFRz7Uw',
       'Kit com mouse gamer de 3200 DPI e mousepad com base de borracha antiderrapante. Combo essencial para qualquer setup gamer.',
       'Periféricos', '{kit,mouse,mousepad,gamer}', true, 10, 5.00, '{Preto,RGB}', NOW(), NOW()),

  (18, 'Headset Gamer Havit 7.1',              157.90,  171.90,  'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQTTzbU4WohMOrxdqK5v7KaeD6XLBWM1_zsU6DRmTpThdqUncDzr85dV60lLU7SFmCz9Owasm-Iqt6yAkn0A2Z0hs0sezMSyv1PXbSLQDJinvp_s7WJLo1K1wQ',
       'Headset gamer com som surround 7.1, microfone removível e almofadas de espuma memory foam. LED RGB e compatível com PC, PS4 e Xbox.',
       'Áudio', '{headset,gamer,microfone,surround,led}', true, 6, 5.00, '{""}', NOW(), NOW()),

  (20, 'Microfone Gamer RGB Condensador',      134.90,  154.90,  'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSZ8dXO0EfxjqEWs-VvV7U0fNtchj3R-IdVZtIVwaTncS3LPS2cyruayVgRa5bMffdWuZP40zwWuKeYrGpg43knVL-4CruN',
       'Microfone condensador USB com iluminação RGB dinâmica. Padrão cardioide com alta sensibilidade, perfeito para streaming e podcasts.',
       'Áudio', '{microfone,gamer,rgb,streaming,condensador}', true, 6, 5.00, NULL, NOW(), NOW()),

  (52, 'Nintendo Switch OLED + Mario Kart 8', 2151.00, 2389.90, 'https://www.kabum.com.br/_next/image?url=https%3A%2F%2Fimages3.kabum.com.br%2Fprodutos%2Ffotos%2Fsync_mirakl%2F637633%2Fxlarge%2FConsole-Nintendo-Switch-OLED-Branco-Com-Mario-Kart-8_1758382781.jpg&w=1920&q=75',
       'Console híbrido com tela OLED de 7" para cores vibrantes. Jogue em casa na TV ou em qualquer lugar no modo portátil. Inclui Mario Kart 8 Deluxe.',
       'Consoles', '{nintendo,switch,console,portable}', true, 12, 5.00, '{Branco,Preto}', NOW(), NOW()),

  (53, 'Console Xbox Series X 1TB',            5380.10, NULL,    'https://www.kabum.com.br/_next/image?url=https%3A%2F%2Fimages5.kabum.com.br%2Fprodutos%2Ffotos%2Fsync_mirakl%2F311895%2Fxlarge%2FConsole-Xbox-Series-X-1TB-Microsoft-Preto-Rrt-00001_1744657832.jpg&w=1920&q=75',
       'O Xbox mais potente de todos os tempos. 12 teraflops, Ray Tracing, 4K 120FPS, Quick Resume e compatibilidade com centenas de jogos retroativos.',
       'Consoles', '{console,xbox,microsoft,4k}', true, 12, 5.00, '{Preto}', NOW(), NOW()),

  (57, 'Mouse Gamer HyperX Pulsefire Core RGB', 197.90, 219.90,  'https://www.kabum.com.br/_next/image?url=https%3A%2F%2Fimages5.kabum.com.br%2Fprodutos%2Ffotos%2Fsync_mirakl%2F177165%2Fxlarge%2FMouse-Gamer-Hyperx-Pulsefire-Core-Com-Fio-RGB-6200-Dpi-7-Bot-es-Hx-mc004b_1742320235.jpg&w=1920&q=75',
       'Sensor óptico Pixart 3327 de 6200 DPI sem aceleração. 7 botões programáveis, iluminação RGB e design ergonômico para longas sessões.',
       'Periféricos', '{mouse,gamer,rgb,hyperx,ergonômico}', true, 12, 5.00, '{Preto,RGB}', NOW(), NOW()),

  (62, 'Teclado Mecânico RGB Pro Switch Blue',  299.90,  349.90,  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXnIabQ5BKdIU_QZlBFlYL7HqBewSpE4vVdKD4jiwgrrBQ0USrOjR7DN3j&s=10',
       'Teclado mecânico de alta precisão com iluminação RGB por tecla personalizável, switches táteis e estrutura em alumínio reforçado. Layout ABNT2.',
       'Periféricos', '{gamer,teclado,rgb,mecânico,abnt2}', true, 12, 5.00, '{preto,branco}', NOW(), NOW()),

  (65, 'Monitor Gamer 27" FHD 165Hz IPS',      1299.00, 1499.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgvf27FYnO1NRkRg3TUyOsh9Pl2Oc0isDEnAHU6lOOhK8kbQsFDSqc-j4&s=10',
       'Painel IPS FHD com reprodução fiel de cores, taxa de atualização de 165Hz e tempo de resposta de 1ms. Suporte FreeSync e G-Sync. Visual elegante e bordas ultrafinas.',
       'Monitores', '{monitor,165hz,ips,freesync,setup}', true, 12, 0.00, '{preto}', NOW(), NOW()),

  (66, 'Placa Gráfica RTX 4060 8GB GDDR6',     2399.90, 2699.90, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpy7MMm87dAGf6xRW7rqnscY1h9KucWlh34I9t2BroICWDY__WiYuSYgI&s=10',
       'GPU Nvidia RTX 4060 com suporte a Ray Tracing, DLSS 3 Frame Generation e encoder AV1. Arrefecimento duplo silencioso e excelente para 1080p e 1440p.',
       'Hardware', '{gpu,rtx,nvidia,hardware,placa-de-video}', true, 12, 0.00, '{preto}', NOW(), NOW()),

  (67, 'Cadeira Gamer Ergonômica Reclinável',   899.00,  1099.00, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjtOPDTi-9bCZrNKUvpdXSx7Wmnyz-nmk7-rwAsWanykAL-ZpM2JWzHKg&s=10',
       'Design esportivo premium com ajuste de braços 3D, apoio lombar e cervical ajustáveis e reclinamento de até 160°. Revestida em couro PU de alta densidade.',
       'Periféricos', '{cadeira,ergonomia,setup,conforto,reclinável}', true, 10, 0.00, '{preto,azul}', NOW(), NOW()),

  (68, 'Processador AMD Ryzen 7 5700X3D',       1399.90, 1599.90, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3Dnu1s1vQ96jPqru12R0R3B1GgT6MNUHrhMCInZtPjiJspx6WvUqoj8E&s=10',
       'CPU gamer de alta performance com tecnologia 3D V-Cache exclusiva AMD, 8 núcleos e 16 threads. Enorme ganho de FPS em games comparado ao 5700X padrão.',
       'Hardware', '{processador,ryzen,cpu,amd,3d-vcache}', true, 12, 0.00, '{cinza}', NOW(), NOW()),

  (70, 'PlayStation 5 Slim Digital',            3799.00, NULL,    'https://images.kabum.com.br/produtos/fotos/542929/console-playstation-5-slim-ssd-1tb-edicao-digital-branco-2-jogos-1000038914_1728056167_gg.jpg',
       'PS5 Slim edição digital com SSD de 1TB ultra-rápido, suporte a 4K e 120fps, áudio 3D Tempest e retrocompatibilidade com jogos PS4. Inclui 2 jogos digitais.',
       'Consoles', '{console,ps5,playstation,sony,slim}', true, 12, 0.00, '{branco}', NOW(), NOW()),

  (71, 'Mousepad RGB Extra Grande 900x400mm',   89.90,   119.90,  'https://images.kabum.com.br/produtos/fotos/1003628/mousepad-gamer-rise-mode-rgb-pro-estendido-900x400mm-preto-rm-mpp-07-rgb_1787575075_gg.jpg',
       'Mousepad desk mat em tecido de microfibra de alta densidade com bordas costuradas anti-desfio, base de borracha e iluminação RGB nas laterais.',
       'Acessórios', '{mousepad,rgb,deskmat,900x400}', true, 3, 0.00, '{preto}', NOW(), NOW()),

  (72, 'Memória RAM DDR5 32GB 6000MHz Kit',      849.90,  999.90,  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYx8bAxkZMCgE0ds4Nh0F3mhHtLGy0YnjAqiJy4PpvgzYSha_DuvDiwS1E&s=10',
       'Kit dual-channel 2x16GB DDR5 6000MHz com dissipador em alumínio anodizado. Latência otimizada para plataformas Intel e AMD Ryzen. Plug-and-play XMP/EXPO.',
       'Hardware', '{ram,ddr5,memoria,hardware,kit}', true, 10, 0.00, '{preto,prata}', NOW(), NOW()),

  (74, 'SSD M.2 NVMe 2TB PCIe 4.0',            929.90,  1099.90, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhxQ8p9QqqqZKHkeLNNKyEXsCCUNyYsj4cvcojltqWjvchGLjzKUMc_1E&s=10',
       'SSD com velocidade de leitura de 7300 MB/s e escrita de 6600 MB/s. Reduz drasticamente o tempo de carregamento de jogos e ideal para edição de vídeo em 4K.',
       'Hardware', '{ssd,nvme,m2,pcie4,armazenamento}', true, 10, 0.00, '{preto}', NOW(), NOW()),

  (75, 'Microfone Condensador USB Streamer',     349.90,  NULL,    'https://images.kabum.com.br/produtos/fotos/sync_mirakl/690545/xlarge/Microfone-Gamer-USB-Condensador-com-LED-para-Streaming-e-Jogos-Preto-com-Filtro_1744914035.jpg',
       'Microfone com padrão polar cardioide para voz nítida com rejeição de ruídos laterais. Controle de ganho e botão Mute tátil. Inclui filtro pop e suporte articulado.',
       'Áudio', '{microfone,streamer,usb,condensador,cardioide}', true, 6, 0.00, '{preto,rosa}', NOW(), NOW()),

  (76, 'Gabinete Gamer Mid Tower Vidro',         399.00,  459.00,  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtRGb0X6Eun5xSd5GR4L_EgS9IA2MiQ4WnQoUaQpH43ABWVA_mPtHEIT8&s=10',
       'Gabinete Mid Tower com painel frontal Mesh para máximo fluxo de ar. Lateral em vidro temperado magnético. Suporte a ATX/mATX. 3 ventoinhas ARGB inclusas.',
       'Hardware', '{gabinete,setup,rgb,pc,mid-tower}', true, 6, 0.00, '{preto,branco}', NOW(), NOW()),

  (77, 'Water Cooler ARGB 240mm',               429.90,  499.90,  'https://images.kabum.com.br/produtos/fotos/248205/water-cooler-gamer-rise-mode-argb-intel-e-amd-240mm-preto-rm-wcb-04-argb_1663778106_gg.jpg',
       'Sistema de refrigeração líquida All-in-One com radiador de 240mm, bomba silenciosa e duas ventoinhas ARGB de 120mm. Compatível com Intel LGA e AMD AM4/AM5.',
       'Hardware', '{cooler,watercooler,argb,refrigeração}', true, 6, 0.00, '{preto,branco}', NOW(), NOW()),

  (81, 'Webcam Full HD 60fps Microfone Duplo',   279.90,  329.90,  'https://cdn.shoppub.io/cdn-cgi/image/w=1000,h=1000,q=80,f=auto/oficinadosbits/media/uploads/produtos/foto/widruvcx/file.png',
       'Webcam Full HD 1080p 60fps com autofoco rápido, correção de luz por IA, microfone estéreo com cancelamento de eco e tampa de privacidade integrada.',
       'Acessórios', '{webcam,fullhd,streamer,60fps}', true, 10, 0.00, '{preto}', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('public.products', 'id'), COALESCE((SELECT MAX(id) FROM public.products), 1));


-- -------------------------
-- PAYMENTS (histórico diversificado)
-- Colunas exatas da entidade PaymentRecord.java:
-- id, user_id, amount, currency, status, provider, provider_payment_id, created_at, updated_at, additional_info, installments
-- -------------------------
INSERT INTO public.payments (id, user_id, amount, currency, status, provider, provider_payment_id, created_at, updated_at, additional_info, installments)
VALUES
  -- Usuário 1 (admin): compras variadas
  (101, 1, 252.00, 'BRL', 'APPROVED', 'simulated_gateway', 'SIM_PAY_101', '2026-08-10 09:00:00', '2026-08-10 09:05:00',
   '{"items":[{"id":3,"title":"Teclado Mecânico Gamer Switch Blue","quantity":1,"unit_price":252.00,"img":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT7v4_hBRpFke1LOCdKc_wpQk8rkIifTQiNw&s","category_id":"Periféricos"}]}', 1),

  (102, 1, 1299.00, 'BRL', 'APPROVED', 'simulated_gateway', 'SIM_PAY_102', '2026-08-22 14:30:00', '2026-08-22 14:35:00',
   '{"items":[{"id":65,"title":"Monitor Gamer 27\" FHD 165Hz IPS","quantity":1,"unit_price":1299.00,"img":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgvf27FYnO1NRkRg3TUyOsh9Pl2Oc0isDEnAHU6lOOhK8kbQsFDSqc-j4&s=10","category_id":"Monitores"}]}', 3),

  (103, 1, 849.90, 'BRL', 'APPROVED', 'simulated_gateway', 'SIM_PAY_103', '2026-09-05 11:15:00', '2026-09-05 11:20:00',
   '{"items":[{"id":72,"title":"Memória RAM DDR5 32GB 6000MHz Kit","quantity":1,"unit_price":849.90,"img":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYx8bAxkZMCgE0ds4Nh0F3mhHtLGy0YnjAqiJy4PpvgzYSha_DuvDiwS1E&s=10","category_id":"Hardware"}]}', 1),

  (104, 1, 2399.90, 'BRL', 'CANCELLED', 'simulated_gateway', 'SIM_PAY_104', '2026-09-18 16:00:00', '2026-09-18 16:10:00',
   '{"items":[{"id":66,"title":"Placa Gráfica RTX 4060 8GB GDDR6","quantity":1,"unit_price":2399.90,"img":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpy7MMm87dAGf6xRW7rqnscY1h9KucWlh34I9t2BroICWDY__WiYuSYgI&s=10","category_id":"Hardware"}]}', 1),

  (105, 1, 90.00, 'BRL', 'PENDING', 'simulated_gateway', 'SIM_PAY_105', '2026-10-01 10:00:00', '2026-10-01 10:00:00',
   '{"items":[{"id":5,"title":"Webcam Full HD 1080p","quantity":1,"unit_price":90.00,"img":"https://m.media-amazon.com/images/I/61-K2lXmHQL._UF894,1000_QL80_.jpg","category_id":"Acessórios"}]}', 1),

  -- Usuário 6 (Ana Beatriz): compras aprovadas
  (106, 6, 3150.00, 'BRL', 'APPROVED', 'simulated_gateway', 'SIM_PAY_106', '2026-07-15 10:00:00', '2026-07-15 10:08:00',
   '{"items":[{"id":6,"title":"PlayStation 5 Standard + DualSense","quantity":1,"unit_price":3150.00,"img":"https://m.media-amazon.com/images/I/41bsdF9lMPL._UF1000,1000_QL80_.jpg","category_id":"Consoles"}]}', 12),

  (107, 6, 157.90, 'BRL', 'APPROVED', 'simulated_gateway', 'SIM_PAY_107', '2026-08-03 18:45:00', '2026-08-03 18:50:00',
   '{"items":[{"id":18,"title":"Headset Gamer Havit 7.1","quantity":1,"unit_price":157.90,"img":"https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQTTzbU4WohMOrxdqK5v7KaeD6XLBWM1_zsU6DRmTpThdqUncDzr85dV60lLU7SFmCz9Owasm-Iqt6yAkn0A2Z0hs0sezMSyv1PXbSLQDJinvp_s7WJLo1K1wQ","category_id":"Áudio"}]}', 1),

  (108, 6, 989.80, 'BRL', 'CANCELLED', 'simulated_gateway', 'SIM_PAY_108', '2026-09-12 13:00:00', '2026-09-12 13:30:00',
   '{"items":[{"id":9,"title":"Notebook Gamer Asus ROG RTX 4060","quantity":1,"unit_price":5520.00,"img":"https://images3.kabum.com.br/produtos/fotos/467613/notebook-gamer-asus-rog-strix-g16-rtx-4060-16gb-ram-brinde-controle-ps4-g614jv-n3094w_1721229589_gg.jpg","category_id":"Notebooks"}]}', 1),

  -- Usuário 11 (Carlos Eduardo): compras variadas
  (109, 11, 5380.10, 'BRL', 'APPROVED', 'simulated_gateway', 'SIM_PAY_109', '2026-06-20 09:30:00', '2026-06-20 09:38:00',
   '{"items":[{"id":53,"title":"Console Xbox Series X 1TB","quantity":1,"unit_price":5380.10,"img":"https://www.kabum.com.br/_next/image?url=https%3A%2F%2Fimages5.kabum.com.br%2Fprodutos%2Ffotos%2Fsync_mirakl%2F311895%2Fxlarge%2FConsole-Xbox-Series-X-1TB-Microsoft-Preto-Rrt-00001_1744657832.jpg&w=1920&q=75","category_id":"Consoles"}]}', 10),

  (110, 11, 429.90, 'BRL', 'APPROVED', 'simulated_gateway', 'SIM_PAY_110', '2026-07-30 15:00:00', '2026-07-30 15:05:00',
   '{"items":[{"id":77,"title":"Water Cooler ARGB 240mm","quantity":1,"unit_price":429.90,"img":"https://images.kabum.com.br/produtos/fotos/248205/water-cooler-gamer-rise-mode-argb-intel-e-amd-240mm-preto-rm-wcb-04-argb_1663778106_gg.jpg","category_id":"Hardware"}]}', 1),

  (111, 11, 144.00, 'BRL', 'PENDING', 'simulated_gateway', 'SIM_PAY_111', '2026-10-28 20:00:00', '2026-10-28 20:00:00',
   '{"items":[{"id":2,"title":"Mouse Gamer Razer Cobra RGB","quantity":1,"unit_price":144.00,"img":"https://img.terabyteshop.com.br/produto/g/mouse-gamer-razer-cobra-rgb-6-botoes-programaveis-8500-dpi-black-rz0104650100r3u_180092.jpg","category_id":"Periféricos"}]}', 1),

  -- Usuário 13 (Fernanda): compras aprovadas
  (112, 13, 990.00, 'BRL', 'APPROVED', 'simulated_gateway', 'SIM_PAY_112', '2026-05-18 11:00:00', '2026-05-18 11:10:00',
   '{"items":[{"id":8,"title":"Cadeira Gamer Ergonômica Pro","quantity":1,"unit_price":990.00,"img":"https://lojagoldentec.vteximg.com.br/arquivos/ids/165902-600-600/image-cff5e7dc880d4c21bb11ed10984a894b.jpg?v=638483534503930000","category_id":"Periféricos"}]}', 10),

  (113, 13, 2151.00, 'BRL', 'APPROVED', 'simulated_gateway', 'SIM_PAY_113', '2026-08-08 17:30:00', '2026-08-08 17:38:00',
   '{"items":[{"id":52,"title":"Nintendo Switch OLED + Mario Kart 8","quantity":1,"unit_price":2151.00,"img":"https://www.kabum.com.br/_next/image?url=https%3A%2F%2Fimages3.kabum.com.br%2Fprodutos%2Ffotos%2Fsync_mirakl%2F637633%2Fxlarge%2FConsole-Nintendo-Switch-OLED-Branco-Com-Mario-Kart-8_1758382781.jpg&w=1920&q=75","category_id":"Consoles"}]}', 6),

  -- Usuário 15 (Rafael): compras variadas
  (114, 15, 1399.90, 'BRL', 'APPROVED', 'simulated_gateway', 'SIM_PAY_114', '2026-07-04 12:00:00', '2026-07-04 12:07:00',
   '{"items":[{"id":68,"title":"Processador AMD Ryzen 7 5700X3D","quantity":1,"unit_price":1399.90,"img":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3Dnu1s1vQ96jPqru12R0R3B1GgT6MNUHrhMCInZtPjiJspx6WvUqoj8E&s=10","category_id":"Hardware"}]}', 1),

  (115, 15, 929.90, 'BRL', 'APPROVED', 'simulated_gateway', 'SIM_PAY_115', '2026-09-25 09:00:00', '2026-09-25 09:05:00',
   '{"items":[{"id":74,"title":"SSD M.2 NVMe 2TB PCIe 4.0","quantity":1,"unit_price":929.90,"img":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhxQ8p9QqqqZKHkeLNNKyEXsCCUNyYsj4cvcojltqWjvchGLjzKUMc_1E&s=10","category_id":"Hardware"}]}', 1),

  -- Usuário 16 (Julia): compra aprovada
  (116, 16, 349.90, 'BRL', 'APPROVED', 'simulated_gateway', 'SIM_PAY_116', '2026-10-10 14:00:00', '2026-10-10 14:08:00',
   '{"items":[{"id":75,"title":"Microfone Condensador USB Streamer","quantity":1,"unit_price":349.90,"img":"https://images.kabum.com.br/produtos/fotos/sync_mirakl/690545/xlarge/Microfone-Gamer-USB-Condensador-com-LED-para-Streaming-e-Jogos-Preto-com-Filtro_1744914035.jpg","category_id":"Áudio"}]}', 1),

  (117, 16, 134.90, 'BRL', 'APPROVED', 'simulated_gateway', 'SIM_PAY_117', '2026-10-22 19:30:00', '2026-10-22 19:35:00',
   '{"items":[{"id":20,"title":"Microfone Gamer RGB Condensador","quantity":1,"unit_price":134.90,"img":"https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSZ8dXO0EfxjqEWs-VvV7U0fNtchj3R-IdVZtIVwaTncS3LPS2cyruayVgRa5bMffdWuZP40zwWuKeYrGpg43knVL-4CruN","category_id":"Áudio"}]}', 1)
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('public.payments', 'id'), COALESCE((SELECT MAX(id) FROM public.payments), 1));


-- -------------------------
-- PRODUCT REVIEWS
-- Colunas exatas da entidade ProductReview.java:
-- id, product_id, user_id, nota, titulo, comentario, img_url, compra_verificada, created_at
-- -------------------------
INSERT INTO public.product_reviews (id, product_id, user_id, nota, titulo, comentario, img_url, compra_verificada, created_at)
VALUES
  -- Teclado Mecânico (id=3) — comprado pelo usuário 1
  (1, 3, 1, 5.0, 'Melhor teclado que já usei',
   'Os switches Blue têm um clique satisfatório que torna a digitação um prazer. A estrutura em alumínio é robusta e o RGB é muito bem calibrado. Recomendo muito para quem trabalha e joga.',
   NULL, true, '2026-08-15 10:30:00'),

  -- Monitor 27" (id=65) — comprado pelo usuário 1
  (2, 65, 1, 5.0, 'Imagem incrível para jogos e trabalho',
   'Os 165Hz fazem toda a diferença em jogos competitivos. O painel IPS entrega cores fiéis e ângulos de visão excelentes. Instalação super fácil e acabamento premium.',
   NULL, true, '2026-08-28 16:45:00'),

  -- RAM DDR5 (id=72) — comprado pelo usuário 1
  (3, 72, 1, 4.0, 'Desempenho sólido, fácil instalação',
   'Plug-and-play com XMP habilitado. Rodou direto nos 6000MHz sem qualquer ajuste manual. O dissipador é elegante e não interfere no cooler. Perdi meio ponto pois a caixa chegou amassada.',
   NULL, true, '2026-09-10 11:00:00'),

  -- PS5 Standard (id=6) — comprado pelo usuário 6 (Ana)
  (4, 6, 6, 5.0, 'Console perfeito, entrega rápida',
   'O PS5 superou todas as expectativas. Os jogos carregam em segundos e o controle DualSense com feedback háptico muda completamente a experiência. Já estou zerando Demon''s Souls pela segunda vez.',
   NULL, true, '2026-07-20 20:00:00'),

  -- Headset Havit (id=18) — comprado pelo usuário 6 (Ana)
  (5, 18, 6, 4.0, 'Ótimo custo-benefício para o preço',
   'O som surround 7.1 é surpreendente para o valor. As almofadas são confortáveis mas esquentam um pouco após 2h de uso. O microfone é claro e elimina bem o ruído de fundo.',
   NULL, true, '2026-08-10 09:15:00'),

  -- Xbox Series X (id=53) — comprado pelo usuário 11 (Carlos)
  (6, 53, 11, 5.0, 'O melhor console do mercado atualmente',
   'Desempenho de outra categoria. 4K nativo em todos os jogos do Xbox, Quick Resume funcionando perfeitamente com até 5 jogos em standby. O Game Pass Ultimate é o melhor custo-benefício em jogos.',
   NULL, true, '2026-06-28 17:30:00'),

  -- Water Cooler (id=77) — comprado pelo usuário 11 (Carlos)
  (7, 77, 11, 4.0, 'Excelente refrigeração e ótimo visual',
   'Instalação tranquila com todos os adaptadores inclusos. O Ryzen 7 5800X3D fica consistentemente abaixo de 70°C mesmo em stress test prolongado. As ventoinhas ARGB são silenciosas e bonitas.',
   NULL, true, '2026-08-05 14:00:00'),

  -- Cadeira Gamer (id=8) — comprada pelo usuário 13 (Fernanda)
  (8, 8, 13, 5.0, 'Minha coluna agradeceu muito',
   'Depois de meses com dores nas costas por usar uma cadeira simples, investir nessa foi a melhor decisão. O suporte lombar e cervical são reguláveis e fazem uma diferença enorme. Super estável e durável.',
   NULL, true, '2026-05-28 11:45:00'),

  -- Nintendo Switch (id=52) — comprado pelo usuário 13 (Fernanda)
  (9, 52, 13, 5.0, 'Perfeito para jogar em qualquer lugar',
   'A tela OLED é lindíssima com cores vibrantes. Mario Kart é diversão garantida com toda a família. A portabilidade é fantástica e a bateria dura bem mais do que eu esperava. Vale cada centavo.',
   NULL, true, '2026-08-18 20:30:00'),

  -- Ryzen 7 5700X3D (id=68) — comprado pelo usuário 15 (Rafael)
  (10, 68, 15, 5.0, 'Ganho de FPS absurdo vs gerações anteriores',
   'Vindo de um Ryzen 5 3600, o ganho foi de quase 60% nos jogos. A tecnologia 3D V-Cache é de outro nível para gaming. Instala direto na placa B550 com update de BIOS. CPU mais custo-efetiva para games hoje.',
   NULL, true, '2026-07-12 10:00:00'),

  -- SSD NVMe 2TB (id=74) — comprado pelo usuário 15 (Rafael)
  (11, 74, 15, 4.0, 'Velocidade impressionante, vale o investimento',
   'CrystalDiskMark confirmou 7200MB/s de leitura. Jogos que antes demoravam 30s para carregar agora abrem em menos de 5s. Apenas um detalhe: a garantia poderia ser de 5 anos como a concorrência.',
   NULL, true, '2026-10-02 08:30:00'),

  -- Microfone Streamer (id=75) — comprado pelo usuário 16 (Julia)
  (12, 75, 16, 5.0, 'Qualidade de estúdio em casa',
   'O padrão cardioide capta minha voz com clareza sem pegar o som do PC ou do ambiente. O botão Mute é muito responsivo e o filtro pop que veio incluso já elimina os sons oclusivos. Minha live nunca soou tão profissional.',
   NULL, true, '2026-10-18 21:00:00'),

  -- Microfone RGB (id=20) — comprado pelo usuário 16 (Julia)
  (13, 20, 16, 4.0, 'Bonito, prático e com boa captação',
   'O RGB é um diferencial estético lindo no setup. A captação é boa para o preço mas percebo um leve ruído de fundo em ambientes com AC. Para streaming casual e reuniões é mais do que suficiente. Recomendo!',
   NULL, true, '2026-10-28 22:15:00'),

  -- Teclado RGB Pro (id=62) — avaliação extra
  (14, 62, 1, 3.0, 'Bom mas com ressalvas',
   'O teclado é bonito e o RGB fica incrível, mas os switches ficam um pouco barulhentos em sessões longas de digitação de código. Para jogos funciona muito bem. Esperava uma qualidade de construção melhor pelo preço.',
   NULL, true, '2026-09-15 15:30:00'),

  -- Mouse Cobra (id=2) — avaliação por usuário 11
  (15, 2, 11, 5.0, 'Mouse perfeito para FPS e RTS',
   'Muito leve e preciso. O sensor não tem aceleração perceptível e os cliques são firmes e responsivos. O cabo flexível não atrapalha o movimento. Uso diariamente há 3 meses sem nenhum problema.',
   NULL, true, '2026-07-05 09:00:00')
ON CONFLICT (id) DO NOTHING;

SELECT setval(pg_get_serial_sequence('public.product_reviews', 'id'), COALESCE((SELECT MAX(id) FROM public.product_reviews), 1));


-- -------------------------
-- CART ITEMS SEQUENCE
-- -------------------------
SELECT setval(pg_get_serial_sequence('public.cart_items', 'id'), COALESCE((SELECT MAX(id) FROM public.cart_items), 1));
