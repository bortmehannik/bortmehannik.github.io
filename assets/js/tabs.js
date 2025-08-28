document.addEventListener("DOMContentLoaded", () => {
  const tabNews = document.getElementById("tab-news");
  const tabCharts = document.getElementById("tab-charts");
  const panelCharts = document.getElementById("panel-charts");
  const panelNews = document.getElementById("panel-news");

  function showPanel(which) {
    const isCharts = which === "charts";
    tabCharts.setAttribute("aria-selected", isCharts);
    tabNews.setAttribute("aria-selected", !isCharts);
    panelCharts.classList.toggle("hidden", !isCharts);
    panelNews.classList.toggle("hidden", isCharts);
  }

  tabNews.addEventListener("click", () => showPanel("news"));
  tabCharts.addEventListener("click", () => showPanel("charts"));
});
