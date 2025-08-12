<<<<<<< HEAD
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
=======
function getChartColorsArray(e){if(null!==document.getElementById(e)){var t="data-colors"+("-"+document.documentElement.getAttribute("data-theme")??""),t=document.getElementById(e).getAttribute(t)??document.getElementById(e).getAttribute("data-colors");if(t)return(t=JSON.parse(t)).map(function(e){var t=e.replace(" ","");return-1===t.indexOf(",")?getComputedStyle(document.documentElement).getPropertyValue(t)||t:2==(e=e.split(",")).length?"rgba("+getComputedStyle(document.documentElement).getPropertyValue(e[0])+","+e[1]+")":t});console.warn("data-colors attributes not found on",e)}}var salesForecastChart="",dealTypeCharts="",revenueExpensesCharts="";function loadCharts(){var e,t;(t=getChartColorsArray("sales-forecast-chart"))&&(e={series:[{name:"Goal",data:[37]},{name:"Pending Forcast",data:[12]},{name:"Revenue",data:[18]}],chart:{type:"bar",height:341,toolbar:{show:!1}},plotOptions:{bar:{horizontal:!1,columnWidth:"65%"}},stroke:{show:!0,width:5,colors:["transparent"]},xaxis:{categories:[""],axisTicks:{show:!1,borderType:"solid",color:"#78909C",height:6,offsetX:0,offsetY:0},title:{text:"Total Forecasted Value",offsetX:0,offsetY:-30,style:{color:"#78909C",fontSize:"12px",fontWeight:400}}},yaxis:{labels:{formatter:function(e){return"$"+e+"k"}},tickAmount:4,min:0},fill:{opacity:1},legend:{show:!0,position:"bottom",horizontalAlign:"center",fontWeight:500,offsetX:0,offsetY:-14,itemMargin:{horizontal:8,vertical:0},markers:{width:10,height:10}},colors:t},""!=salesForecastChart&&salesForecastChart.destroy(),(salesForecastChart=new ApexCharts(document.querySelector("#sales-forecast-chart"),e)).render()),(t=getChartColorsArray("deal-type-charts"))&&(e={series:[{name:"Pending",data:[80,50,30,40,100,20]},{name:"Loss",data:[20,30,40,80,20,80]},{name:"Won",data:[44,76,78,13,43,10]}],chart:{height:341,type:"radar",dropShadow:{enabled:!0,blur:1,left:1,top:1},toolbar:{show:!1}},stroke:{width:2},fill:{opacity:.2},legend:{show:!0,fontWeight:500,offsetX:0,offsetY:-8,markers:{width:8,height:8,radius:6},itemMargin:{horizontal:10,vertical:0}},markers:{size:0},colors:t,xaxis:{categories:["2016","2017","2018","2019","2020","2021"]}},""!=dealTypeCharts&&dealTypeCharts.destroy(),(dealTypeCharts=new ApexCharts(document.querySelector("#deal-type-charts"),e)).render());(t=getChartColorsArray("revenue-expenses-charts"))&&(e={series:[{name:"Revenue",data:[20,25,30,35,40,55,70,110,150,180,210,250]},{name:"Expenses",data:[12,17,45,42,24,35,42,75,102,108,156,199]}],chart:{height:290,type:"area",toolbar:"false"},dataLabels:{enabled:!1},stroke:{curve:"smooth",width:2},xaxis:{categories:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]},yaxis:{labels:{formatter:function(e){return"$"+e+"k"}},tickAmount:5,min:0,max:260},colors:t,fill:{opacity:.06,colors:t,type:"solid"}},""!=revenueExpensesCharts&&revenueExpensesCharts.destroy(),(revenueExpensesCharts=new ApexCharts(document.querySelector("#revenue-expenses-charts"),e)).render())}window.onresize=function(){setTimeout(()=>{loadCharts()},0)},loadCharts();
>>>>>>> parent of 60a5010 (Update dashboard-crm.init.js)
