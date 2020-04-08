$(document).ready(function () {
    var meseSelezionato = '';
    var venditoreSelezionato = '';
    var venditeSelezionate = 0;

    $('.slct-venditori').change(function() {
        venditoreSelezionato = $('.slct-venditori').val();
    })

    $('.input-data').keyup(function(event) {

            if (event.key == "Enter") {
                meseSelezionato = $('.input-data').val();
                meseSelezionato = moment(meseSelezionato , 'YYYY-MM-DD');
                venditeSelezionate = $('.input-num').val();
                spedisciDato(meseSelezionato, venditoreSelezionato, venditeSelezionate);
            }
    })



    $('.btn').click(function() {
    meseSelezionato = $('.input-data').val();
    meseSelezionato = moment(meseSelezionato , 'YYYY-MM-DD');
    venditeSelezionate = $('.input-num').val();
    spedisciDato(meseSelezionato, venditoreSelezionato, venditeSelezionate);
    })

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
                alert('ERRORE GET');
            }
        })
    }

    function spedisciDato(mese, venditore, numero) {
        var questoDato = {
            salesman: venditore,
            date: mese.format("DD-MM-YYYY"),
            amount: parseInt(numero)
        }
        $.ajax({
            url: "http://157.230.17.132:4023/sales",
            method: "POST",
            data: questoDato,
            success: function (data) {
                console.log('Hai inviato il dato!');
                richiamaGet();
            },
            error: function() {
                alert('ERROR POST');
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
                numeroVendite: parseInt(datoVendita.amount)
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
                $('.slct-mese').append('<option value="'+meseTemp+'">'+meseTemp+'</option>');
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
                $('.slct-venditori').append('<option value="'+questoVenditore+'">'+questoVenditore+'</option>');
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
        var graficoUno = new Chart(ctx, {
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
        // var graficoUnoAggiornato = new Chart($('#grafico-vendite-annuale'), graficoUno);
        // window.graficoUnoAggiornato.update();
    }

    function creaGraficoDue (venditori, vendite) {
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
        // var graficoDueAggiornato = new Chart($('#grafico-addetti-vendite'), myPieChart);
        // window.graficoDueAggiornato.update();
    }
});
