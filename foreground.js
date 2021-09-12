(() => {
  function objectToCSS(obj) {
    let kebab = function (str) {
      return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    };
    let css = "";
    for (let key in obj) {
      css += kebab(key) + ":" + obj[key] + ";";
    }
    return css;
  }

  const styles = {
    button: {
      minWidth: "115px",
      textAlign: "center",
      backgroundColor: "#f5c518",
      borderRadius: "6px",
      display: "inline-block",
      color: "#000000",
      fontWeight: "bold",
      padding: ".6em .7em",
      position: " fixed",
      zIndex: 9999,
      top: "10px",
      right: "10px",
      textDecoration: "none",
    },
  };

  // return original title
  let movieTitle;

  // get movie title
  const isMovieTitle = () =>
    document.querySelector('[data-testid="hero-title-block__original-title"]');

  if (isMovieTitle()) {
    movieTitle = isMovieTitle().innerText.split(": ").slice(1).join();
  } else {
    movieTitle = document.querySelector(
      '[data-testid="hero-title-block__title"]'
    ).innerText;
  }

  const parsedTitle = encodeURIComponent(movieTitle);

  const providers = [
    {
      name: "1337x",
      url: `https://1337x.unblockninja.com/srch?search=${parsedTitle}`,
    },
    {
      name: "RARBG",
      url: `https://rarbg.to/torrents.php?search=${parsedTitle}`,
    },
    {
      name: "Serchinganx (Torrent Paradise)",
      url: `https://vkygil.github.io/serchinganx/index.html?q=${parsedTitle}`,
    },
    {
      name: "KickassTorrents",
      url: `https://katcr.to/usearch/${parsedTitle}`,
    },
    {
      name: "The Pirate Bay",
      url: `https://tpb.one/search.php?q=${parsedTitle}`,
    },
  ];

  providers.forEach((provider, index) => {
    const button = document.createElement("a");
    button.href = provider.url;
    button.target = "_blank";
    button.innerText = provider.name;
    button.style = objectToCSS({
      ...styles.button,
      top: Number(styles.button.top.replace("px", "")) + index * 40 + "px",
    });
    document.body.appendChild(button);
  });
})();
