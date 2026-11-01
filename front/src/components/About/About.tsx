import Foto from "../../assets/jogos.png";
import Foto2 from "../../assets/pc_gamer.png";
import Foto3 from "../../assets/fundo_pc.jpg";
import "./About.css";

function About() {
  return (
    <>
      <section className="section-foto">
        <div className="div-foto__img">
          <img src={Foto3} alt="" />
        </div>
        <div className="div-foto__text">
          <h2>Surgimento</h2>
          <p>
            No final dos anos 70, o surgimento do IBM PC marcou o início da era
            do computador pessoal. Inicialmente com chips de 8 bits, o hardware
            evoluiu rapidamente com processadores Intel e AMD. A introdução de
            placas de vídeo dedicadas, como as da NVIDIA e AMD, revolucionou o
            processamento gráfico, tornando possíveis as interfaces visuais e os
            jogos de alta resolução que conhecemos hoje.
          </p>
          <p>
            Com o passar do tempo, a corrida por desempenho levou a inovações
            contínuas: mais núcleos de processamento, velocidades de clock mais
            altas e tecnologias de memória mais rápidas, como RAM DDR5 e SSDs
            NVMe. Essa evolução acelerada impulsionou o desenvolvimento de
            softwares complexos, de programas de edição de vídeo a inteligência
            artificial, criando uma indústria bilionária em torno do hardware e
            do entretenimento digital.
          </p>
        </div>
      </section>

      <section className="section-foto2">
        <div className="div-foto__text2">
          <h2>PC Gamer</h2>
          <div className="div-text-location">
            <img src="/img/desempenho.png" alt="" />
            <p>
              Projetados para alto desempenho, os PCs gamer se destacam por sua
              performance gráfica e capacidade de processamento. Equipados com
              placas de vídeo dedicadas e processadores potentes.
            </p>
          </div>
          <div className="div-text-location">
            <img src="/img/memoria.png" alt="" />
            <p>
              Garantem uma jogabilidade fluida com gráficos impressionantes,
              seja para jogos competitivos ou títulos com alta demanda. A
              memória RAM ampla assegura que multitarefas rodem sem atrasos.
            </p>
          </div>
          <div className="div-text-location">
            <img src="/img/upgrade.png" alt="" />
            <p>
              A principal vantagem é a possibilidade de personalização e
              upgrades, permitindo que a máquina evolua com as novas tecnologias
              e necessidades do usuário ao longo do tempo.
            </p>
          </div>
        </div>
        <div className="div-foto__img2">
          <img src={Foto2} alt="" />
        </div>
      </section>
      <section className="section-foto">
        <div className="div-foto__img">
          <img src={Foto} alt="" />
        </div>
        <div className="div-foto__text">
          <h2>PolyStation</h2>
          <p>
            Em meados da década de 1990, o PolyStation surgiu como um notório
            console clone, capitalizando sobre a imensa popularidade do Sony
            PlayStation. O produto, que não passava de uma imitação, combinava a
            aparência externa do console da Sony com o hardware de 8 bits do
            Nintendo Famicom, rodando jogos de cartucho em vez de discos.
          </p>
          <p>
            O PolyStation era frequentemente vendido em mercados informais e de
            pirataria sob vários nomes, como FunStation, e era notável por sua
            baixa qualidade de construção e jogos antiquados. Apesar de ser um
            exemplo claro de pirataria e de sua péssima performance, o console
            se tornou um símbolo da época e um item de colecionador,
            representando a influência cultural do PlayStation original e a
            extensão da pirataria na indústria dos videogames.
          </p>
        </div>
      </section>
    </>
  );
}

export default About;
