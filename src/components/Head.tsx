import React from "react";

interface HeadProps {
  title: string;
  iconHref?: string;
}

const Head: React.FC<HeadProps> = ({
  title,
  iconHref = "/Logos/logo-icon.svg",
}) => {
  React.useEffect(() => {
    document.title = title;
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
