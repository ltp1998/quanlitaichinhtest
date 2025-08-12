// Hàm lấy màu biểu đồ
function getChartColorsArray(e) {
    if (null !== document.getElementById(e)) {
        var t = "data-colors" + ("-" + document.documentElement.getAttribute("data-theme") ?? ""),
            t = document.getElementById(e).getAttribute(t) ?? document.getElementById(e).getAttribute("data-colors");
        if (t) return (t = JSON.parse(t)).map(function (e) {
            var t = e.replace(" ", "");
            return -1 === t.indexOf(",") ? getComputedStyle(document.documentElement).getPropertyValue(t) || t : 2 == (e = e.split(",")).length ? "rgba(" + getComputedStyle(document.documentElement).getPropertyValue(e[0]) + "," + e[1] + ")" : t;
        });
        console.warn("data-colors attributes not found on", e);
    }
}

var salesForecastChart = "", dealTypeCharts = "", revenueExpensesCharts = "";

async function loadCharts() {
    const supabase = window.supabase.createClient(
        'https://ejmfnprjqllamousmrim.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqbWZucHJqcWxsYW1vdXNtcmltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMjU3ODUsImV4cCI6MjA2OTcwMTc4NX0.KX0Vd7c9SQhlkdxiMeET0XrI31n-PhMSU-fjxiGckSA'
    );

    // Lấy dữ liệu từ bảng thuchi cho sales-forecast-chart
    const { data, error } = await supabase
        .from('thuchi')
        .select('sotienthu, sotienchi');

    let goalData = [37]; // Giá trị mặc định hoặc tính toán
    let pendingData = [0];
    let revenueData = [0];

    if (error) {
        console.warn('Lỗi lấy dữ liệu từ thuchi:', error.message);
    } else if (data && data.length > 0) {
        // Tính tổng SoTienChi cho Pending Forecast
        pendingData = [data.reduce((sum, item) => sum + (item.sotienchi || 0), 0)];

        // Tính tổng SoTienThu cho Revenue
        revenueData = [data.reduce((sum, item) => sum + (item.sotienthu || 0), 0)];

        // Goal có thể là tổng SoTienThu + SoTienChi
        goalData = [revenueData[0] + pendingData[0]];
    }

    // Biểu đồ sales-forecast-chart với dữ liệu từ thuchi
    var colors = getChartColorsArray("sales-forecast-chart");
    var options = {
        series: [{
            name: "Goal",
            data: goalData
        }, {
            name: "Pending Forecast",
            data: pendingData
        }, {
            name: "Revenue",
            data: revenueData
        }],
        chart: {
            type: "bar",
            height: 341,
            toolbar: { show: false }
        },
        plotOptions: {
            bar: { horizontal: false, columnWidth: "65%" }
        },
        stroke: { show: true, width: 5, colors: ["transparent"] },
        xaxis: {
            categories: [""],
            axisTicks: { show: false },
            title: {
                text: "Total Forecasted Value",
                offsetX: 0,
                offsetY: -30,
                style: { color: "#78909C", fontSize: "12px", fontWeight: 400 }
            }
        },
        yaxis: {
            labels: { formatter: function (e) { return "$" + e + "k" } },
            tickAmount: 4,
            min: 0
        },
        fill: { opacity: 1 },
        legend: {
            show: true,
            position: "bottom",
            horizontalAlign: "center",
            fontWeight: 500,
            offsetX: 0,
            offsetY: -14,
            itemMargin: { horizontal: 8, vertical: 0 },
            markers: { width: 10, height: 10 }
        },
        colors: colors
    };

    if (salesForecastChart !== "") salesForecastChart.destroy();
    salesForecastChart = new ApexCharts(document.querySelector("#sales-forecast-chart"), options);
    salesForecastChart.render();

    // Giữ nguyên deal-type-charts
    colors = getChartColorsArray("deal-type-charts");
    options = {
        series: [{
            name: "Pending",
            data: [80, 50, 30, 40, 100, 20]
        }, {
            name: "Loss",
            data: [20, 30, 40, 80, 20, 80]
        }, {
            name: "Won",
            data: [44, 76, 78, 13, 43, 10]
        }],
        chart: {
            height: 341,
            type: "radar",
            dropShadow: { enabled: true, blur: 1, left: 1, top: 1 },
            toolbar: { show: false }
        },
        stroke: { width: 2 },
        fill: { opacity: 0.2 },
        legend: {
            show: true,
            fontWeight: 500,
            offsetX: 0,
            offsetY: -8,
            markers: { width: 8, height: 8, radius: 6 },
            itemMargin: { horizontal: 10, vertical: 0 }
        },
        markers: { size: 0 },
        colors: colors,
        xaxis: { categories: ["2016", "2017", "2018", "2019", "2020", "2021"] }
    };

    if (dealTypeCharts !== "") dealTypeCharts.destroy();
    dealTypeCharts = new ApexCharts(document.querySelector("#deal-type-charts"), options);
    dealTypeCharts.render();

    // Giữ nguyên revenue-expenses-charts
    colors = getChartColorsArray("revenue-expenses-charts");
    options = {
        series: [{
            name: "Revenue",
            data: [20, 25, 30, 35, 40, 55, 70, 110, 150, 180, 210, 250]
        }, {
            name: "Expenses",
            data: [12, 17, 45, 42, 24, 35, 42, 75, 102, 108, 156, 199]
        }],
        chart: { height: 290, type: "area", toolbar: false },
        dataLabels: { enabled: false },
        stroke: { curve: "smooth", width: 2 },
        xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] },
        yaxis: { labels: { formatter: function (e) { return "$" + e + "k" } }, tickAmount: 5, min: 0, max: 260 },
        colors: colors,
        fill: { opacity: 0.06, colors: colors, type: "solid" }
    };

    if (revenueExpensesCharts !== "") revenueExpensesCharts.destroy();
    revenueExpensesCharts = new ApexCharts(document.querySelector("#revenue-expenses-charts"), options);
    revenueExpensesCharts.render();
}

// Gọi hàm khi trang load và resize
window.onresize = function () {
    setTimeout(() => {
        loadCharts();
    }, 0);
};
loadCharts();
