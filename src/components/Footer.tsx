import React from "react";
// Assumindo que você tenha ícones similares. 
// Os da imagem são específicos, mas Github e Linkedin são mais comuns.
import { Github, Linkedin } from "lucide-react"; 

interface FooterProps {
  showBackToTopButton?: boolean;
  onBackToTop?: () => void;
}

const Footer: React.FC<FooterProps> = ({
  showBackToTopButton = false,
  onBackToTop,
}) => {
  return (
    <footer className="bg-[#211C49] text-white pb-8 mt-16">
      {/* Back to Top Button */}
      {showBackToTopButton && onBackToTop && (
        <div className="mt-8">
          <button
            onClick={onBackToTop}
            className="bg-[#2B2560] hover:bg-[#1a1640] w-full py-4 font-semibold transition-colors rounded-lg"
          >
            VOLTAR AO INICIO
          </button>
        </div>
      )}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Seção Superior: Conteúdo principal */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          
          {/* Grupo da Esquerda: Conheça-nos e Contato */}
          <div className="flex gap-16">
            {/* Coluna Conheça-nos */}
            <div>
              <h3 className="font-semibold text-white mb-4">Conheça-nos</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/sobre" className="hover:text-white transition-colors">
                    Sobre
                  </a>
                </li>
              </ul>
            </div>

            {/* Coluna Contato */}
            <div>
              <h3 className="font-semibold text-white mb-4">Contato</h3>
              <div className="space-y-3">
                {/* Contato Eric */}
                <div className="flex items-center gap-4">
                  <span>Eric Moura</span>
                  <div className="flex items-center gap-2">
                    <a
                      href="https://github.com/Wr3tchedTorch/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                      aria-label="GitHub de Eric Moura"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/eric-moura-dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                      aria-label="LinkedIn de Eric Moura"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
                {/* Contato Gabriel */}
                <div className="flex items-center gap-4">
                  <span>Gabriel Bastarz</span>
                  <div className="flex items-center gap-2">
                    <a
                      href="https://github.com/gabebastarz1"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                      aria-label="GitHub de Gabriel Bestana"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/gabrielbastarz" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                      aria-label="LinkedIn de Gabriel Bestana"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grupo da Direita: Créditos IGDB */}
          <div className="text-left md:text-right">
            <p>
              Games metadata is powered by{" "}
              <a
                href="https://www.igdb.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-white hover:underline"
              >
                IGDB.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Seção Inferior: Divisor e Copyright */}
      <div className="border-t border-gray-700">
        <p className="text-center text-sm text-white pt-8">
          Copyright © 2025
        </p>
      </div>
    </footer>
  );
};

export default Footer;