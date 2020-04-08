$(document).ready(function () {

    richiamaGet();

    function richiamaGet() {
        $.ajax({
            url: "http://157.230.17.132:4023/sales",
            method: "GET",
            success: function (data) {
                var datiGrezzi = ottieniDatiGrezzi(data);

                var datiGraficoUno = creaDatiGraficoUno(datiGrezzi);
                creaGraficoUno(datiGraficoUno.mese, datiGraficoUno.vendite);

                var datiGraficoDue = creaDatiGraficoDue(datiGrezzi);
                creaGraficoDue(datiGraficoDue.venditori, datiGraficoDue.vendite);
            },
            error: function() {
                alert('ERRORE');
            }
        })
    }

    function ottieniDatiGrezzi(data) {
        var datiVendite = data;
        var annoVendite = [];
        for (var i = 0; i < datiVendite.length; i++) {
            var datoVendita = datiVendite[i];
            var dataVendita = moment(datoVendita.date , "L");
            var elementoVendita = {
                id: datoVendita.id,
                venditore: datoVendita.salesman,
                indiceMese: dataVendita.format("MM"),
                mese: dataVendita.format("MMMM"),
                numeroVendite: datoVendita.amount
            }
            annoVendite.push(elementoVendita);
        }
        annoVendite.sort(function(a,b) {
            return a.indiceMese - b.indiceMese;
        })

        return annoVendite;
    }

    function creaDatiGraficoUno(anno) {
        var venditeAssociate = {};
        for (var i = 0; i < anno.length; i++) {
            var meseTemp = anno[i].mese;
            if (venditeAssociate[meseTemp] === undefined) {
                venditeAssociate[meseTemp] = 0;
            }
            venditeAssociate[meseTemp] += anno[i].numeroVendite;
        }
        var arrayMese = [];
        var arrayVendite = [];
        for (var key in venditeAssociate) {
            arrayMese.push(key);
            arrayVendite.push(venditeAssociate[key]);
        }
        return {
            mese: arrayMese,
            vendite: arrayVendite
        }
    }

    function creaDatiGraficoDue(dati) {
        var venditeSingole = {};
        for (var i = 0; i < dati.length; i++) {
            var questoVenditore = dati[i].venditore;
            if (venditeSingole[questoVenditore] === undefined) {
                venditeSingole[questoVenditore] = 0;
            }
            venditeSingole[questoVenditore] += dati[i].numeroVendite;
        }

        var arrayVenditori = [];
        var arrayVendite = [];
        for (var key in venditeSingole) {
            arrayVenditori.push(key);
            arrayVendite.push(venditeSingole[key]);
        }

        return {
            venditori: arrayVenditori,
            vendite: arrayVendite
        }
    }

    function creaGraficoUno(mese, vendite) {
        var ctx = $('#grafico-vendite-annuale');
        var chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: mese,
                datasets: [{
                    label: 'Anno 2017',
                    backgroundColor: '#5300c6',
                    borderColor: '#5300c6',
                    pointBackgroundColor: '#ffba37',
                    data: vendite
                }]
            },
        });
    }

    function creaGraficoDue (venditori, vendite) {
        console.log(venditori);
        console.log(vendite);
        // var venditeTotali = 0;
        // for (var i = 0; i < vendite.length; i++) {
        //     venditeTotali += vendite[i];
        // }
        var ctx = $('#grafico-addetti-vendite');
        var myPieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: venditori,

                datasets: [{
                    data: vendite,
                    label: 'Report Addetti Anno 2017',
                    backgroundColor: ['red', 'blue', 'yellow', 'green']
                }]
            }
        });
    }
});
