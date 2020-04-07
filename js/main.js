$(document).ready(function () {

    richiamaDati();


    function creaGrafico(mese, vendite) {
        var ctx = $('#grafico-annuale');
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

    function richiamaDati() {
        $.ajax({
            url: "http://157.230.17.132:4023/sales",
            method: "GET",
            success: function (data) {
                var datiVendite = data;
                var annoVendite = [];
                for (var i = 0; i < datiVendite.length; i++) {
                    var datoVendita = datiVendite[i];
                    var dataVendita = moment(datoVendita.date , "L");
                    var meseVendita = {
                        numeroMese: dataVendita.format("MM"),
                        mese: dataVendita.format("MMMM"),
                        numeroVendite: datoVendita.amount

                    }
                    annoVendite.push(meseVendita);
                }
                annoVendite.sort(function(a,b) {
                    return a.numeroMese- b.numeroMese;
                })
                console.log(annoVendite);

                creaDatiGrafico(annoVendite);
            },

            error: function() {
                alert('ERRORE');
            }
        })
    }

    function creaDatiGrafico(anno) {
        var venditeAssociate = {};

        for (var i = 0; i < anno.length; i++) {
            var meseTemp = anno[i].mese;
            if (venditeAssociate[meseTemp] === undefined) {
                venditeAssociate[meseTemp] = 0;
            }
            // console.log('al mese ' + meseTemp + ' aggiungo: ' + anno[i].numeroVendite);
            venditeAssociate[meseTemp] += anno[i].numeroVendite;
            // console.log('chiamata numero: ' + i + ' dato: ',venditeAssociate);
        }
        // console.log('-----------------------------------------------------');
        // console.log(venditeAssociate);
        var arrayMese = [];
        var arrayVendite = [];

        for (var key in venditeAssociate) {
            arrayMese.push(key);
            arrayVendite.push(venditeAssociate[key]);
        }
        // console.log(arrayMese);
        // console.log(arrayVendite);
        creaGrafico(arrayMese, arrayVendite);
    }
});
