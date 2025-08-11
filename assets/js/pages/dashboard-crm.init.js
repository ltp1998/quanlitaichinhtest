<script>
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

    // Hàm tạo biểu đồ cột từ dữ liệu chitieu
    async function createColumnChart() {
        var chartId = "custom-column-chart"; // ID của biểu đồ
        const supabase = window.supabase.createClient(
            'https://ejmfnprjqllamousmrim.supabase.co',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqbWZucHJqcWxsYW1vdXNtcmltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMjU3ODUsImV4cCI6MjA2OTcwMTc4NX0.KX0Vd7c9SQhlkdxiMeET0XrI31n-PhMSU-fjxiGckSA'
        );

        // Lấy dữ liệu từ bảng chitieu
        const { data, error } = await supabase
            .from('chitieu')
            .select('hangmuccha, sotienchi')
            .order('hangmuccha', { ascending: true }); // Sắp xếp theo HangMucCha

        if (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
            return;
        }

        // Chuẩn bị dữ liệu cho biểu đồ
        const categories = [...new Set(data.map(item => item.hangmuccha))]; // Loại bỏ trùng lặp HangMucCha
        const seriesData = categories.map(category => {
            const total = data
                .filter(item => item.hangmuccha === category)
                .reduce((sum, item) => sum + (item.sotienchi || 0), 0);
            return total;
        });

        var colors = getChartColorsArray(chartId);
        var options = {
            series: [{
                name: 'Số tiền chi',
                data: seriesData // Tổng SoTienChi theo HangMucCha
            }],
            chart: {
                type: 'bar',
                height: 350
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded'
                },
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            xaxis: {
                categories: categories, // Trục x là HangMucCha
                title: {
                    text: 'Hạng mục cha'
                }
            },
            yaxis: {
                title: {
                    text: 'Số tiền chi (triệu VND)'
                },
                labels: {
                    formatter: function (val) {
                        return (val / 1000000).toFixed(2); // Chuyển đổi sang triệu VND
                    }
                }
            },
            fill: {
                opacity: 1
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return (val / 1000000).toFixed(2) + " triệu VND";
                    }
                }
            },
            colors: colors
        };

        // Hủy biểu đồ cũ nếu có
        if (window.columnChart) {
            window.columnChart.destroy();
        }
        // Tạo và render biểu đồ mới
        window.columnChart = new ApexCharts(document.querySelector("#" + chartId), options);
        window.columnChart.render();
    }

    // Gọi hàm khi trang load và resize
    window.onresize = function () {
        setTimeout(() => {
            createColumnChart();
        }, 0);
    };
    createColumnChart();
</script>
