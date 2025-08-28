document.addEventListener("DOMContentLoaded", () => {
  const newsWrap = document.getElementById("newsCards");
  const readMoreBtn = document.getElementById("readMore");
  const PAGE_SIZE = 8;
  let pos = 0;

  const MORE_NEWS = [
    {
      img: "https://picsum.photos/seed/201/600/400",
      title: "AI chips boom fuels record profits",
      text: "Chipmakers report all-time highs amid surging demand.",
    },
    {
      img: "https://picsum.photos/seed/202/600/400",
      title: "Global markets edge higher",
      text: "Investors weigh fresh inflation data and earnings.",
    },
    {
      img: "https://picsum.photos/seed/203/600/400",
      title: "Volcano eruption grounds flights",
      text: "Airlines issue waivers across several regions.",
    },
    {
      img: "https://picsum.photos/seed/204/600/400",
      title: "New cancer therapy shows promise",
      text: "Early trials point to improved survival rates.",
    },
    {
      img: "https://picsum.photos/seed/205/600/400",
      title: "Rivals agree to share charging network",
      text: "EV owners to gain access to 30k more chargers.",
    },
    {
      img: "https://picsum.photos/seed/206/600/400",
      title: "Space telescope captures rare comet",
      text: "Scientists release the sharpest images to date.",
    },
    {
      img: "https://picsum.photos/seed/207/600/400",
      title: "Music streamer launches hi-res tier",
      text: "Subscribers get lossless + spatial for same price.",
    },
    {
      img: "https://picsum.photos/seed/208/600/400",
      title: "City approves new riverside park",
      text: "Green corridor with 12 km of bike lanes.",
    },
    {
      img: "https://picsum.photos/seed/209/600/400",
      title: "Heatwave pushes power grid to limit",
      text: "Officials ask residents to reduce consumption.",
    },
    {
      img: "https://picsum.photos/seed/210/600/400",
      title: "Breakthrough in battery recycling",
      text: "Startup recovers 95% of lithium and cobalt.",
    },
    {
      img: "https://picsum.photos/seed/211/600/400",
      title: "Studio announces surprise sequel",
      text: "Cast to return; filming starts this fall.",
    },
    {
      img: "https://picsum.photos/seed/212/600/400",
      title: "Historic painting rediscovered",
      text: "Piece thought lost found in private collection.",
    },
    {
      img: "https://picsum.photos/seed/213/600/400",
      title: "Ocean plastics fall 12% in a year",
      text: "New policies begin to show measurable effect.",
    },
    {
      img: "https://picsum.photos/seed/214/600/400",
      title: "Major update lands for popular app",
      text: "Offline mode, faster sync, redesigned UI.",
    },
    {
      img: "https://picsum.photos/seed/215/600/400",
      title: "Researchers map ancient city",
      text: "Lidar reveals streets and temples under jungle.",
    },
    {
      img: "https://picsum.photos/seed/216/600/400",
      title: "Championship ends in dramatic finish",
      text: "Underdogs clinch title in overtime.",
    },
  ];

  function appendCards(items) {
    const html = items
      .map(
        (x) => `
  <a href="#" class="ncard">
    <img src="${x.img}" alt="">
    <div class="p">
      <h5>${x.title}</h5>
      <p>${x.text}</p>
    </div>
  </a>
`
      )
      .join("");
    newsWrap.insertAdjacentHTML("beforeend", html);
  }

  function loadNextPage() {
    if (pos >= MORE_NEWS.length) return false;
    const chunk = MORE_NEWS.slice(pos, pos + PAGE_SIZE);
    pos += chunk.length;
    appendCards(chunk);
    if (pos >= MORE_NEWS.length) {
      readMoreBtn.classList.add("hidden");
      readMoreBtn.textContent = "No more news";
      readMoreBtn.disabled = true;
    }
    return true;
  }

  readMoreBtn.addEventListener("click", () => {
    const prev = readMoreBtn.textContent;
    readMoreBtn.textContent = "Loading…";
    readMoreBtn.disabled = true;

    requestAnimationFrame(() => {
      const hadData = loadNextPage();
      if (hadData && pos < MORE_NEWS.length) {
        readMoreBtn.textContent = prev;
        readMoreBtn.disabled = false;
      }
    });
  });
});
