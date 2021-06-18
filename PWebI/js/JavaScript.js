/**
 * Guillem Serra Cazorla (guillem.serra)
 * guillem.serra@students.salle.url.edu
 */

//Class WidgetList equivalent a la de Dashboard
/**
 * Classe on guardem tota la informacio dels widgets, un array de widgets es el seu principal atribut.
 */
class WidgetList{
    constructor() {
        this.arrayWidgets = [];
    }

    addWidget(widget){
        this.arrayWidgets.push(widget);

    }
    removeWidget(position){
        this.arrayWidgets.splice(position, 1);
    }

    removeAll(){
        this.arrayWidgets.splice(0, this.arrayWidgets.length);
    }
}

/**
 * Abstraccio en forma de classe que representa un widget o un sensor. Guarda tant la informacio general del sensor, com les lectures (readings).
 */
class Widget{
    constructor(id, title, value, updated_at, unit) {
        this.id = id;
        this.title = title;
        this.value = value;
        this.updated_at = updated_at
        this.arrayReadings = [];
        this.unit = unit;

    }
}

/**
 * Funcio encarregada de mostrar tots els widgets a nivell de HTML.
 */
function showAllWidgets(widgetsArray){

    widgetsArray.forEach(function(w) {
        //El bloc on aniran tots els widgets
        var basicBlock = document.getElementById("#widgetsBlock");

        const widget = document.createElement("div");
        widget.className = "col-md-4";

        var widget2 = document.createElement("div");
        widget2.classList.add("card");
        widget2.classList.add("text-center");
        widget2.classList.add("resizeable");
        widget.appendChild(widget2);

        var widget3 = document.createElement("div");
        widget3.className = "card-body";
        widget2.appendChild(widget3)

        //Titol
        var textH5 = document.createElement("h5");
        widget3.appendChild(textH5);

        var text = document.createTextNode(w.title);
        textH5.appendChild(text);

        //Value
        var textH5 = document.createElement("h5");
        widget3.appendChild(textH5);

        var text = document.createTextNode(w.value);
        textH5.appendChild(text);

        //Posem el "html" que hem creat
        document.getElementById("widgetsBlock").appendChild(widget);


    });
}

/**
 * Funcio encarregada de obtenir tots els widgets amb el GET.
 * @returns {*}
 */
function getSensors() {
    return axios.get('http://api.smartcitizen.me/v0/devices/1616').then(resp => {
        //fiquem el primer widget que indica en numero de Widgets
        var numWidgets = resp.data['data']['sensors'].length
        widgetList.addWidget(new Widget(null, 'Total sensores', numWidgets));

        //agreguem tots els widgets a WidgetList que tindra com atribut l'array de widgets
        console.log(resp.data['data']['sensors'].forEach(res => widgetList.addWidget(new Widget(res['id'], res['name'], res['value'], new Date(res['updated_at']), res['unit']))));


    });
}

/**
 * Funcio encarregada de fer el GET per defecte per obtenir les lectures dels sensors tot filtrant per les dates dels parametres.
 * @param idSensor: id del sensor que volem obtenir la lectura
 * @param from: filtre de data inici que volem les lectures
 * @param to: filtre de la data final a la que volem les lectures
 * @returns {*}
 */
function getReadingsWithDate(idSensor, from, to){
    if(from > to) {
        console.log("Ordre de les dates incorrecte");
    }else {
        try {
            return axios.get('https://api.smartcitizen.me/v0/devices/1616/readings?sensor_id=' + idSensor + '&rollup=4h&from=' + from.toString() + '&to=' + to.toString()).then(resp => {
                //fiquem el primer widget que indica en numero de Widgets


                //agreguem tots els widgets a WidgetList que tindra com atribut l'array de widgets
                resp['data']['readings'].forEach(function (res) {
                    widgetList.arrayWidgets.forEach((r) => {
                        if (r.id === idSensor) r.arrayReadings.push(res)
                    });
                });
            });
        } catch (er) {
            console.log("ERROR! aquest sensor no te readings.")
        }
    }
}

/**
 * Funcio encarregada de fer el GET per defecte per obtenir les lectures dels sensors.
 * @param idSensor: id del sensor que volem obtenir la lectura
 * @returns {*}
 */
function getReadings(idSensor){
    try {
        return axios.get('https://api.smartcitizen.me/v0/devices/1616/readings?sensor_id=' + idSensor + '&rollup=4h&from=2015-07-27&to=2015-07-30').then(resp => {
            //fiquem el primer widget que indica en numero de Widgets


            //agreguem tots els widgets a WidgetList que tindra com atribut l'array de widgets
            resp['data']['readings'].forEach(function (res) {
                widgetList.arrayWidgets.forEach( (r) => {
                    if(r.id === idSensor) r.arrayReadings.push(res)
                });
            });
        });
    }catch(er){
        console.log("ERROR! aquest sensor no te readings.")
    }
}

/**
 * Funcio que es crida quan s'actualitzen els filtres per dates.
 * Agafa els nous parametres de dade i fa la crida per obtenir totes les lectures.
 */
function updateDateFilters(){
    var date1Value = document.getElementById("date1").value;
    var date2Value = document.getElementById("date2").value;

    //eliminem les lectures que teniem
    for (let i = 0; i < widgetList.arrayWidgets.length; i++) {
        widgetList.arrayWidgets[i].arrayReadings = [];
    }

    //tornem a demanar les lectures amb els parametres corresponents
    Promise.all(widgetList.arrayWidgets.map(async (res) =>{

        if (res.id != null){
            return getReadingsWithDate(res.id, date1Value, date2Value);
        }else{
            return new Promise((resolve)=>resolve())
        }

    })).then((r) => {
        deleteAllWidgets()
        showAllWidgets(widgetList.arrayWidgets);
        generateGraph(widgetList.arrayWidgets);
        deleteTables();
        generateTables(widgetList.arrayWidgets);
    });
}

/**
 * Funcio encarregada d'eliminar tots els widgets que es mostren per el HTML
 **/
function deleteAllWidgets(){
    const basicBlock = document.getElementById("widgetsBlock");
    while (basicBlock.firstChild) {
        basicBlock.removeChild(basicBlock.firstChild);
    }
}

/**
 * Funcio encarregada de elimninar el graph a nivell de HTML
 */
function deleteGraph(){
    const basicBlock = document.getElementById("chartContainer");
    while (basicBlock.firstChild) {
        basicBlock.removeChild(basicBlock.firstChild);
    }
}

/**
 * Funcio encarregada de elimninar totes les taules a nivell de HTML
 */
function deleteTables(){
    const basicBlock = document.getElementById("sensorsBlock");
    while (basicBlock.firstChild) {
        basicBlock.removeChild(basicBlock.firstChild);
    }
}

/**
 * Funcio encarregada de generar el graphic lineal
 * @param widgets: array de widgets que mostrarem al graphic
 */
function generateGraph(widgets = []) {
    const basicBlock = document.getElementById("chartContainer");
    while (basicBlock.firstChild) {
        basicBlock.removeChild(basicBlock.firstChild);
    }

    if (widgets === []) return;
    var data = [];
    widgets.forEach((r) => {
        var datapointsWidget = [];
        r.arrayReadings.forEach((res) =>
            datapointsWidget.push({x: new Date(res[0]), y: res[1]})
        );
        data.push({
            name: r.title,
            type: "spline",
            yValueFormatString: ("#0.## " + r.unit),
            showInLegend: true,
            dataPoints: datapointsWidget
        })
    })
    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        title: {
            text: "Readings"
        },
        axisX: {
            valueFormatString: "DD MMM YY hh:mm"
        },
        axisY: {
            title: "Mesurement" /*"(in " + widget.unit + ")"*/,
            suffix: "" /*+ widget.unit*/
        },
        legend: {
            cursor: "pointer",
            fontSize: 15,
            itemclick: toggleDataSeries
        },
        toolTip: {
            shared: true
        },
        data: data
    });
    chart.render();

    function toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        chart.render();
    }
}

/**
 * Funcio encarregada de mostrar per el HTML la taula amb les lectures mostrades per pantalla.
 * @param name: nom del sensor
 * @param arrayReadings: array de lectures (data i mesura)
 */
function showTable(name, arrayReadings){
    //cas en que el sensor no te cap reading no generem la taula
    if(arrayReadings.length === 0) return;

    //El bloc on aniran tots els widgets
    const widget = document.createElement("div");
    widget.className = "col-md-4";

    var widget2 = document.createElement("div");
    widget2.classList.add("card");
    widget2.classList.add("text-center");
    widget2.classList.add("resizeable");
    widget.appendChild(widget2);

    var widget3 = document.createElement("div");
    widget3.className = "card-body";
    widget2.appendChild(widget3)

    //Titol
    var textH5 = document.createElement("h5");
    widget3.appendChild(textH5);

    var text = document.createTextNode(name);
    textH5.appendChild(text);

    //Value
    var table= document.createElement("table");
    widget3.appendChild(table);

    var content = document.createElement("tr");
    table.appendChild(content);

    //cabecera
    var text = document.createElement("th");
    content.appendChild(text);

    var textTable = document.createTextNode("Dia");
    text.appendChild(textTable);

    var text = document.createElement("th");
    content.appendChild(text);

    var textTable = document.createTextNode("Lectura");
    text.appendChild(textTable);

    //info
    for (let i = 0; i < 10 && i < arrayReadings.length; i++) {
        var content = document.createElement("tr");
        table.appendChild(content);

        var text = document.createElement("td");
        content.appendChild(text);

        var textTable = document.createTextNode(arrayReadings[i][0].split("T")[0]);
        text.appendChild(textTable);

        var text = document.createElement("td");
        content.appendChild(text);

        var textTable = document.createTextNode(arrayReadings[i][1].toFixed(2));
        text.appendChild(textTable);
    }

    //Posem el "html" que hem creat
    document.getElementById("sensorsBlock").appendChild(widget);
}

/**
 * Funcio encarregada de recorrer els widgets passats per parametres i mostrarlos a nivell de HTML cridant "showTable()"
 * @param widgets: array de widgets que s'han de mostrar
 */
function generateTables(widgets){
    widgets.forEach((r) =>{
        showTable(r.title, r.arrayReadings);
    })
}

/**
 * Funcio encarregada de iniciar la web quan s'entra
 */
function startSystem() {
    getSensors().then((res) => {
        showAllWidgets(widgetList.arrayWidgets);
        Promise.all(widgetList.arrayWidgets.map(async (res) => {

            if (res.id != null) {
                return getReadings(res.id);
            } else {
                return new Promise((resolve) => resolve())
            }

        })).then((r) => {
            generateGraph(widgetList.arrayWidgets);
            generateTables(widgetList.arrayWidgets);
            showSensorsFilters();
            deleteBarChart();
        });

    });
}

/**
 * Funcio encarregada de generar els filtres del desplegable (dropdown).
 */
function showSensorsFilters(){
    var num = 0;
    widgetList.arrayWidgets.forEach(function(w) {

        //El bloc on aniran tots els widgets
        if(w.id != null) {
            var basicBlock = document.getElementById("#sensorFilter");

            const widget = document.createElement("li");
            widget.setAttribute("onclick", "showOnlyASensor(" + num + ")")

            var widget2 = document.createElement("a");
            widget2.className = "dropdown-item";
            widget.appendChild(widget2);

            var widget3 = document.createTextNode(w.title);
            widget2.appendChild(widget3);
            //Posem el "html" que hem creat
            document.getElementById("sensorFilter").appendChild(widget);
        }
        num+=1;

    });
}

/**
 * Funcio encarregada de gestionar el filtratge (quan vols mostrar nomes un sensor).
 * @param idSensor
 */
function showOnlyASensor(idSensor){
    deleteAllWidgets();
    deleteGraph();
    deleteTables();

    var sensor = widgetList.arrayWidgets[idSensor];

    showAllWidgets([sensor]);
    generateGraph([sensor]);
    generateTables([sensor]);
    showBarChart(sensor);
}

/**
 * Funcio encarregada de eliminar tota la informacio (widgets, graphs i taules) a nivell de HTML
 */
function hideAll(){
    //amaguem la seccio de widgets
    deleteAllWidgets();
    deleteGraph();
    deleteTables();
    deleteBarChart();

}

/**
 * Funcio encarregada de mostrar tota la informacio (widgets, graphs i taules) a nivell de HTML a nivell per defecte
 */
function showAll(){
    //els eliminem per si hi ha algún de algun filtre (en el cas que vinguin de "show nothing" no eliminara res
    deleteAllWidgets();
    deleteGraph();
    deleteTables();
    deleteBarChart();
    //mostrem tots els parametres
    showAllWidgets(widgetList.arrayWidgets);
    generateGraph(widgetList.arrayWidgets);
    generateTables(widgetList.arrayWidgets);
}

/**
 * Funcio encarregada de mostrar a nivell de HTMl el graphic de barres donat un widget.
 * @param widgets: widget a mostrar
 */
function showBarChart(widgets){
    const basicBlock = document.getElementById("barChartContainer");
    while (basicBlock.firstChild) {
        basicBlock.removeChild(basicBlock.firstChild);
    }

    const cardBarChart = document.getElementById("barChartCard");
    cardBarChart.setAttribute("style", "");

    if (widgets === []) return;
    var data = [];

    var datapointsWidget = [];
    var num = 0;
    widgets.arrayReadings.forEach((res) => {
        if (num < 10) datapointsWidget.push({x: new Date(res[0]), y: res[1]});
        num += 1;
    });
    data.push({
        type: "column",
        showInLegend: true,
        legendMarkerColor: "grey",
        legendText: widgets.title,
        dataPoints: datapointsWidget
    });

    var chart = new CanvasJS.Chart("barChartContainer", {
        animationEnabled: true,
        theme: "light2",
        title:{
            text: widgets.title + " readings"
        },
        axisY: {
            title: "Unit (" + widgets.unit + ")"
        },
        data: data
    });
    chart.render();
}

/**
 * Funcio encarregada de elimninar el bar chart a nivell de HTML
 */
function deleteBarChart(){
    const basicBlock = document.getElementById("barChartContainer");
    while (basicBlock.firstChild) {
        basicBlock.removeChild(basicBlock.firstChild);
    }
    //amaguem l'espai del grafic de barres
    const cardBarChart = document.getElementById("barChartCard");
    cardBarChart.setAttribute("style", "display: none;");
}

const widgetList = new WidgetList();
startSystem();
