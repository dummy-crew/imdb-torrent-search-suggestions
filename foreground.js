(() => {
  let kebab = function (str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  };

  function objectToCSS(obj) {
    let css = '';
    for (let key in obj) {
      css += kebab(key) + ':' + obj[key] + ';';
    }
    return css;
  }

  const styles = {
    button: {
      minWidth: '115px',
      textAlign: 'center',
      backgroundColor: '#f5c518',
      borderRadius: '6px',
      display: 'inline-block',
      color: '#000000',
      fontWeight: 'bold',
      padding: '.6em .7em',
      position: ' fixed',
      zIndex: 9999,
      top: '10px',
      right: '10px',
      textDecoration: 'none',
    },
  };

  const isMovie = document.querySelector('meta[property="og:type"]').content === 'video.movie';

  // get movie title
  let title;

  if (isMovie) {
    const titleElement = document.querySelector('[data-testid="hero-title-block__original-title"]');
    const targetElement = titleElement || document.querySelector('[data-testid="hero-title-block__title"]');

    if (targetElement.innerText.includes(':')) {
      title = targetElement.innerText.split(':')[1].trim();
    } else title = targetElement.innerText;
  } else {
    title = document.querySelector('[data-testid="hero-title-block__title"]').innerText;
  }

  const parsedTitle = encodeURIComponent(title);

  const providers = [
    {
      name: '1337x',
      url: `https://1337x.unblockninja.com/srch?search=${parsedTitle}`,
    },
    {
      name: 'RARBG',
      url: `https://rarbg.to/torrents.php?search=${parsedTitle}`,
    },
    {
      name: 'Serchinganx (Torrent Paradise)',
      url: `https://vkygil.github.io/serchinganx/index.html?q=${parsedTitle}`,
    },
    {
      name: 'KickassTorrents',
      url: `https://katcr.to/usearch/${parsedTitle}`,
    },
    {
      name: 'The Pirate Bay',
      url: `https://tpb.one/search.php?q=${parsedTitle}`,
    },
  ];

  if (isMovie) {
    providers.push({
      name: 'YTS',
      url: `https://yts.mx/browse-movies/${parsedTitle}`,
    });
  }

  const elementRef = document.createElement('div');
  elementRef.id = 'imdb-torrent-search-engine';

  const elementRefStyle = document.createElement('style');
  elementRefStyle.textContent = `a { ${objectToCSS(styles.button)} }`;

  const shadow = elementRef.attachShadow({ mode: 'open' });
  shadow.appendChild(elementRefStyle);

  providers.forEach((provider, index) => {
    const button = document.createElement('a');
    button.href = provider.url;
    button.target = '_blank';
    button.setAttribute('data-provider', kebab(provider.name));
    button.innerText = provider.name;
    button.style.top = Number(styles.button.top.replace('px', '')) + index * 40 + 'px',
    shadow.appendChild(button);
  });
  if (!document.getElementById('imdb-torrent-search-engine')) {
    document.body.appendChild(elementRef);
  }
})();
