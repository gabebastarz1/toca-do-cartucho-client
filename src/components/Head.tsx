import React from "react";

interface HeadProps {
  title: string;
  iconHref?: string;
}

const Head: React.FC<HeadProps> = ({ title, iconHref = "/logo-icon.svg" }) => {
  React.useEffect(() => {
    // Atualiza o título da página
    document.title = title;
    // Atualiza o favicon
    let link = document.querySelector("link[rel='icon']");
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "icon");
      document.head.appendChild(link);
    }
    link.setAttribute("href", iconHref);
  }, [title, iconHref]);

  return null;
};

export default Head;


// ---Como importar--- 
/*
<Head title="Cadastrar anúncio - Apenas Venda" iconHref="/logo-icon.svg" />

Podendo manter também apenas o título:
<Head title="Cadastrar anúncio - Apenas Venda" />
*/