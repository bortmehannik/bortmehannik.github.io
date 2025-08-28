document.addEventListener("DOMContentLoaded", () => {
  const m1 = document.getElementById("m1");
  const m2 = document.getElementById("m2");
  const chips = document.getElementById("chips");
  const btnPrev = document.getElementById("prev");
  const btnNext = document.getElementById("next");
  let isPointerDown = false;

  btnPrev.addEventListener("click", () => {
    chips.scrollBy({ left: -260, behavior: "smooth" });
  });
  btnNext.addEventListener("click", () => {
    chips.scrollBy({ left: 260, behavior: "smooth" });
  });

  chips.addEventListener("scroll", updateArrows, { passive: true });
  window.addEventListener("resize", () => {
    requestAnimationFrame(updateArrows);
  });

  requestAnimationFrame(updateArrows);

  const start = new Date(2024, 7, 1);
  const end = new Date(2026, 5, 1);

  const months = [];

  const ctx = document.getElementById("chart").getContext("2d");
  const red = getComputedStyle(document.documentElement)
    .getPropertyValue("--red")
    .trim();

  const blue = getComputedStyle(document.documentElement)
    .getPropertyValue("--blue")
    .trim();

  const connectOnHover = {
    id: "connectOnHover",
    afterDatasetsDraw(chart) {
      const act = chart.getActiveElements();
      if (!act || !act.length) return;

      const i = act[0].index;
      const m0 = chart.getDatasetMeta(0);
      const m1 = chart.getDatasetMeta(1);
      const p0 = m0?.data?.[i];
      const p1 = m1?.data?.[i];
      if (!p0 || !p1) return;

      const { top, bottom } = chart.chartArea;
      const x = p0.x; // у обоих точек одинаковый x

      const ctx = chart.ctx;
      ctx.save();
      // «чёткий» 1px (без размытия) с учётом DPR
      const dpr = chart.currentDevicePixelRatio || window.devicePixelRatio || 1;
      const crispX = Math.round(x * dpr) / dpr + 0.5 / dpr;

      ctx.beginPath();
      ctx.moveTo(crispX, top);
      ctx.lineTo(crispX, bottom);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(0,0,0,0.25)"; // тонко и ненавязчиво
      ctx.setLineDash([4, 4]); // если хочешь пунктир — разблокируй
      ctx.stroke();
      ctx.restore();
    },
  };

  const pointBubbles = {
    id: "pointBubbles",
    afterDatasetsDraw(c) {
      const act = c.getActiveElements();
      if (!act || !act.length) return;

      const i = act[0].index;
      const ctx = c.ctx;

      const infos = [0, 1].map((di) => {
        const pt = c.getDatasetMeta(di).data[i];
        const label = c.data.labels[i];
        const val = c.data.datasets[di].data[i] || 0;
        const gb = Math.round(val * 1024) + " GB";
        const color = c.data.datasets[di].borderColor;
        return { pt, label, gb, color };
      });

      // старт — оба сверху
      let place0 = "above",
        place1 = "above";

      // невидимый прогон для расчёта коллизий
      ctx.save();
      ctx.globalAlpha = 0;
      const r0 = drawTooltip(
        ctx,
        infos[0].pt,
        infos[0].label,
        infos[0].gb,
        infos[0].color,
        place0
      );
      const r1 = drawTooltip(
        ctx,
        infos[1].pt,
        infos[1].label,
        infos[1].gb,
        infos[1].color,
        place1
      );
      ctx.restore();

      const overlap = !(
        r0.x + r0.w < r1.x ||
        r1.x + r1.w < r0.x ||
        r0.y + r0.h < r1.y ||
        r1.y + r1.h < r0.y
      );
      if (overlap) place1 = "below";

      drawTooltip(
        ctx,
        infos[0].pt,
        infos[0].label,
        infos[0].gb,
        infos[0].color,
        place0
      );
      drawTooltip(
        ctx,
        infos[1].pt,
        infos[1].label,
        infos[1].gb,
        infos[1].color,
        place1
      );
    },
  };

  const chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Chart 1",
          data: [],
          borderColor: red,
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: red,
          pointHoverBorderColor: "#fff",
          pointHoverBorderWidth: 2,
        },
        {
          label: "Chart 2",
          data: [],
          borderColor: blue,
          tension: 0,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: blue,
          pointHoverBorderColor: "#fff",
          pointHoverBorderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: "index", intersect: false },
      plugins: { legend: { display: false }, tooltip: { enabled: false } },
      scales: {
        x: { grid: { display: false } },
        y: { suggestedMin: 0, suggestedMax: 1 },
      },
    },
    plugins: [connectOnHover, pointBubbles],
  });

  for (const d = new Date(start); d <= end; d.setMonth(d.getMonth() + 1)) {
    months.push({ y: d.getFullYear(), m: d.getMonth() });
  }

  let activeIndex = Math.min(1, months.length - 1);

  renderChips();

  btnPrev.addEventListener("click", () =>
    chips.scrollBy({ left: -260, behavior: "smooth" })
  );

  btnNext.addEventListener("click", () =>
    chips.scrollBy({ left: 260, behavior: "smooth" })
  );

  chips.addEventListener("pointerdown", () => {
    isPointerDown = true;
    setTimeout(() => (isPointerDown = false), 0); // сбросим после события
  });

  chips.addEventListener("focusin", (e) => {
    if (isPointerDown) return; // пропускаем, если фокус пришёл от клика
    const chip = e.target.closest(".chip");
    if (chip) {
      setActive(+chip.dataset.i, true);
    }
  });

  chips.addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    setActive(+b.dataset.i, true);
  });

  chips.addEventListener("keydown", (e) => {
    const focusable = [...chips.querySelectorAll(".chip")];
    const idx = focusable.indexOf(document.activeElement);
    if (idx < 0) return;

    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = focusable[idx + 1] || focusable[0];
      next.focus();
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = focusable[idx - 1] || focusable.at(-1);
      prev.focus();
    }
  });

  chart.canvas.addEventListener("mousemove", () => {
    const act = chart.getActiveElements();
    if (act.length) setMetrics(act[0].index);
  });

  chart.canvas.addEventListener("mouseleave", () =>
    setMetrics(chart.data.labels.length - 1)
  );

  setActive(activeIndex, true);

  function setActive(idx, scrollChip) {
    if (scrollChip) {
      chips.children[idx].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
      setTimeout(updateArrows, 250);
    } else {
      updateArrows();
    }
  }

  function updateArrows() {
    const max = chips.scrollWidth - chips.clientWidth;
    const atStart = chips.scrollLeft <= 1;
    const atEnd = chips.scrollLeft >= max - 1;
    btnPrev.classList.toggle("disabled", atStart);
    btnPrev.disabled = atStart;

    btnNext.classList.toggle("disabled", atEnd);
    btnNext.disabled = atEnd;
  }

  function mLabel(y, m) {
    return (
      new Date(y, m, 1).toLocaleString("en", { month: "short" }) +
      ", " +
      String(y).slice(-2)
    );
  }
  function renderChips() {
    chips.innerHTML = months
      .map(
        (x, i) =>
          `<button class="chip" role="tab" aria-selected="${
            i === activeIndex
          }" data-i="${i}">${mLabel(x.y, x.m)}</button>`
      )
      .join("");
  }

  function drawTooltip(ctx, pt, label, gb, color, place) {
    const lineHeight = 6;
    ctx.save();
    ctx.font = "600 14px Roboto";

    const w =
      Math.max(ctx.measureText(label).width, ctx.measureText(gb).width) + 20;
    const h = 55;
    const r = 5;
    const T = 8;
    const pad = 14;

    const ca = chart.chartArea;
    let x = pt.x - w / 2;
    let y = place === "above" ? pt.y - h - pad : pt.y + pad;

    if (x < ca.left + 4) x = ca.left + 4;
    if (x + w > ca.right - 4) x = ca.right - 4 - w;

    if (place === "above" && y < ca.top + 4)
      (y = pt.y + pad), (place = "below");
    if (place === "below" && y + h > ca.bottom - 4)
      (y = pt.y - h - pad), (place = "above");

    ctx.beginPath();
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    if (place === "below") {
      const L = Math.max(x + r + 4, Math.min(pt.x - T, x + w - r - 4));
      const R = Math.min(x + w - r - 4, Math.max(pt.x + T, x + r + 4));

      ctx.moveTo(x + r, y);
      ctx.lineTo(L, y);
      ctx.lineTo(pt.x, pt.y + 2);
      ctx.lineTo(R, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
    } else {
      const L = Math.max(x + r + 4, Math.min(pt.x - T, x + w - r - 4));
      const R = Math.min(x + w - r - 4, Math.max(pt.x + T, x + r + 4));

      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(R, y + h);
      ctx.lineTo(pt.x, pt.y - 2);
      ctx.lineTo(L, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
    }

    ctx.closePath();
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.stroke();

    // текст
    ctx.fillStyle = "#111";
    ctx.fillText(label, x + 10, y + 20);
    ctx.fillStyle = color;
    ctx.fillText(gb, x + 10, y + 37 + lineHeight);

    ctx.restore();
    return { x, y, w, h };
  }

  function setMetrics(idx) {
    const a = chart.data.datasets[0].data[idx] ?? 0;
    const b = chart.data.datasets[1].data[idx] ?? 0;
    m1.textContent = Math.round(a * 1024) + " GB";
    m2.textContent = Math.round(b * 1024) + " GB";
  }

  function setActive(idx, scrollChip) {
    activeIndex = idx;
    [...chips.children].forEach((el, i) =>
      el.setAttribute("aria-selected", i === idx ? "true" : "false")
    );

    const { y, m } = months[idx];
    const d = makeData(y, m);
    chart.data.labels = d.labels;
    chart.data.datasets[0].data = d.a;
    chart.data.datasets[1].data = d.b;
    chart.update();

    setMetrics(d.labels.length - 1);

    // скроллим к чипу
    if (scrollChip) {
      chips.children[idx].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }

    // 🔥 обновляем состояние стрелок
    btnPrev.classList.toggle("disabled", idx === 0);
    btnNext.classList.toggle("disabled", idx === months.length - 1);
  }

  function makeData(y, m) {
    const days = new Date(y, m + 1, 0).getDate();
    const labels = Array.from({ length: days }, (_, i) => {
      const d = new Date(y, m, i + 1);
      return d.toLocaleString("en", { day: "numeric", month: "short" });
    });
    const a = [],
      b = [];
    for (let i = 0; i < days; i++) {
      const t = i / days;
      a.push(
        Math.max(
          0.1,
          Math.min(
            0.95,
            0.35 + 0.35 * Math.sin(t * 6) + (Math.random() - 0.5) * 0.12
          )
        )
      );
      b.push(
        Math.max(
          0.1,
          Math.min(
            0.95,
            0.45 + 0.3 * Math.sin(t * 7 + 1.3) + (Math.random() - 0.5) * 0.12
          )
        )
      );
    }
    return { labels, a, b };
  }
});
