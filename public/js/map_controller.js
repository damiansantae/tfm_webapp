mapboxgl.accessToken = 'pk.eyJ1IjoiZGFtaWFuc2FudGFtYXJpYSIsImEiOiJjazcwdW9yam0wMGNpM2xvaDV0NGlicnoxIn0.PRsWLMpDqqSbZWaDn-x3XA';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/damiansantamaria/ck7iup26d6drn1irwmke4m0db',
    center: [-3.680737, 40.453232],
    zoom: 11.69
});

/*array de horas*/
var hours = [
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17',
    '18', '19', '20', '21', '22', '23', '24'
];

/**
 * Filtra los niveles NO2 según la hora
 * @param hour: hora para la que se quiere mostrar los niveles de NO2
 */
function filterBy(hour) {
    var filters = ['==', 'hour', hour];
    map.setFilter('nitro-circles', filters);
    map.setFilter('nitro-labels', filters);
    document.getElementById('hour').textContent = hours[hour];
}

/* Carga de mapa y sus componentes*/
map.on('load', function () {
    //Lectura de estaciones
    loadEstacionesJSON(function (response) {
        var actual_JSON = JSON.parse(response);
        //Carga de niveles de NO2 en mapa
        getNitroData((result) => {
            //Creacion de registro de niveles de NO2 geolocalizados
            var jsonsito = createNitroGeojson(result, actual_JSON);
            jsonsito.features = jsonsito.features.map(function (d) {
                d.properties.hour = parseInt(d.properties.hour);
                return d;
            });
            try {
                map.addSource('nitro', {
                    'type': 'geojson',
                    data: jsonsito
                });
            } catch (e) {
                console.log(Error(e))
            }
            try {
                //Se añaden al mapa las capas de circulos y etiquetas de los niveles de NO2
                map.addLayer({
                    'id': 'nitro-circles',
                    'type': 'circle',
                    'source': 'nitro',
                    'paint': {
                        'circle-color': [
                            'interpolate',
                            ['linear'],
                            ['get', 'mag'],
                            1,
                            '#FCA107',
                            15,
                            '#7F3121'
                        ],
                        'circle-opacity': 0.75,
                        'circle-radius': [
                            'interpolate',
                            ['linear'],
                            ['get', 'mag'],
                            1,
                            20,
                            15,
                            40
                        ]
                    }
                });
                map.addLayer({
                    'id': 'nitro-labels',
                    'type': 'symbol',
                    'source': 'nitro',
                    'layout': {
                        'text-field': [
                            'concat',
                            ['to-string', ['get', 'mag']],
                            'ug/m3'
                        ],
                        'text-font': [
                            'Open Sans Bold',
                            'Arial Unicode MS Bold'
                        ],
                        'text-size': 12
                    },
                    'paint': {
                        'text-color': 'rgba(0,0,0,0.5)'
                    }
                });
            } catch (e) {
                console.log(e)
            }
            //Control del filtro
            filterBy(1);
            document
                .getElementById('slider')
                .addEventListener('input', function (e) {
                    var hour = parseInt(e.target.value, 10);
                    filterBy(hour);
                });
        })
    });

    /*gojson de las camaras*/
    var cam_geojson = {
        'type': 'geojson',
        'data': {
            "type": "FeatureCollection",
            "features": [{
                "geometry": {"type": "Point", "coordinates": [40.40376974, -3.66657048]},
                "type": "Feature",
                "properties": {
                    "description": "09NC39TV01.jpg",
                    "marker-symbol": "cinema",
                    "title": "09NC39TV01",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/09NC39TV01.jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.71215353, 40.40016472]},
                "type": "Feature",
                "properties": {
                    "description": "15RR64TV01.jpg",
                    "marker-symbol": "cinema",
                    "title": "15RR64TV01",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/15RR64TV01.jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.69609328, 40.38773066]},
                "type": "Feature",
                "properties": {
                    "description": "13NL35TV01.jpg",
                    "marker-symbol": "cinema",
                    "title": "13NL35TV01",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/13NL35TV01.jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.73913179, 40.41070187]},
                "type": "Feature",
                "properties": {
                    "description": "04FT92TV01.jpg",
                    "marker-symbol": "cinema",
                    "title": "04FT92TV01",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/04FT92TV01.jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.72572553, 40.42218237]},
                "type": "Feature",
                "properties": {
                    "description": "18XC87TV01.jpg",
                    "marker-symbol": "cinema",
                    "title": "18XC87TV01",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/18XC87TV01.jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.7256353, 40.41604759]},
                "type": "Feature",
                "properties": {
                    "description": "03FL62TV01.jpg",
                    "marker-symbol": "cinema",
                    "title": "03FL62TV01",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/03FL62TV01.jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.66718628, 40.40255369]},
                "type": "Feature",
                "properties": {
                    "description": "03TL00TV01.jpg",
                    "marker-symbol": "cinema",
                    "title": "03TL00TV01",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/03TL00TV01.jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.67923898, 40.39522274]},
                "type": "Feature",
                "properties": {
                    "description": "11RE06TV01.jpg",
                    "marker-symbol": "cinema",
                    "title": "11RE06TV01",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/11RE06TV01.jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.70673832, 40.39628798]},
                "type": "Feature",
                "properties": {
                    "description": "14RH21TV01.jpg",
                    "marker-symbol": "cinema",
                    "title": "14RH21TV01",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/14RH21TV01.jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.71215353, 40.40016473]},
                "type": "Feature",
                "properties": {
                    "description": "15RR64TV01.jpg",
                    "marker-symbol": "cinema",
                    "title": "15RR64TV01",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/15RR64TV01.jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.72134063, 40.40943098]},
                "type": "Feature",
                "properties": {
                    "description": "17RA04TV01.jpg",
                    "marker-symbol": "cinema",
                    "title": "17RA04TV01",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/17RA04TV01.jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.725602, 40.42229064]},
                "type": "Feature",
                "properties": {
                    "description": "18NC86TV01.jpg",
                    "marker-symbol": "cinema",
                    "title": "18NC86TV01",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/18NC86TV01.jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.69029486, 40.38640603]},
                "type": "Feature",
                "properties": {
                    "description": "90EL10TV01.jpg",
                    "marker-symbol": "cinema",
                    "title": "90EL10TV01",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/90EL10TV01.jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.68567374, 40.38020018]},
                "type": "Feature",
                "properties": {
                    "description": "90ET20TV01.jpg",
                    "marker-symbol": "cinema",
                    "title": "90ET20TV01",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/90ET20TV01.jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.676831, 40.392318]},
                "type": "Feature",
                "properties": {
                    "description": "M30-PK10+900C(M.ALVARO).jpg",
                    "marker-symbol": "cinema",
                    "title": "M30-PK10+900C(M.ALVARO)",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/M30-PK10+900C(M.ALVARO).jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.686348, 40.380635]},
                "type": "Feature",
                "properties": {
                    "description": "M30-PK12+500C(NUDOSUR).jpg",
                    "marker-symbol": "cinema",
                    "title": "M30-PK12+500C(NUDOSUR)",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/M30-PK12+500C(NUDOSUR).jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.688331, 40.382379]},
                "type": "Feature",
                "properties": {
                    "description": "M30-PK12+500C(NUDOSUR-A4).jpg",
                    "marker-symbol": "cinema",
                    "title": "M30-PK12+500C(NUDOSUR-A4)",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/M30-PK12+500C(NUDOSUR-A4).jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.665703, 40.406188]},
                "type": "Feature",
                "properties": {
                    "description": "M30-PK09+100CDAIAVMEDIT..jpg",
                    "marker-symbol": "cinema",
                    "title": "M30-PK09+100CDAIAVMEDIT.",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/M30-PK09+100CDAIAVMEDIT..jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.658244, 40.418532]},
                "type": "Feature",
                "properties": {
                    "description": "M30-PK07+600D(ODONNELL).jpg",
                    "marker-symbol": "cinema",
                    "title": "M30-PK07+600D(ODONNELL)",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/M30-PK07+600D(ODONNELL).jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.672123, 40.47103]},
                "type": "Feature",
                "properties": {
                    "description": "M30-PK01+500C(PIOXII).jpg",
                    "marker-symbol": "cinema",
                    "title": "M30-PK01+500C(PIOXII)",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/M30-PK01+500C(PIOXII).jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.664906, 40.460277]},
                "type": "Feature",
                "properties": {
                    "description": "M30-PK02+900X(COSTARICA).jpg",
                    "marker-symbol": "cinema",
                    "title": "M30-PK02+900X(COSTARICA)",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/M30-PK02+900X(COSTARICA).jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.674698, 40.476106]},
                "type": "Feature",
                "properties": {
                    "description": "M30-PK00+900C.jpg",
                    "marker-symbol": "cinema",
                    "title": "M30-PK00+900C",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/M30-PK00+900C.jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.680755, 40.483276]},
                "type": "Feature",
                "properties": {
                    "description": "M30-PK31+700C.jpg",
                    "marker-symbol": "cinema",
                    "title": "M30-PK31+700C",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/M30-PK31+700C.jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.704535, 40.481956]},
                "type": "Feature",
                "properties": {
                    "description": "M30-PK29+800C(R.ACADEM.).jpg",
                    "marker-symbol": "cinema",
                    "title": "M30-PK29+800C(R.ACADEM.)",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/M30-PK29+800C(R.ACADEM.).jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.748273, 40.474492]},
                "type": "Feature",
                "properties": {
                    "description": "M30-PK25+000C(NUDOM-40).jpg",
                    "marker-symbol": "cinema",
                    "title": "M30-PK25+000C(NUDOM-40)",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/M30-PK25+000C(NUDOM-40).jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.750317, 40.468907]},
                "type": "Feature",
                "properties": {
                    "description": "M30-PK24+800D(ARR.FRESNO).jpg",
                    "marker-symbol": "cinema",
                    "title": "M30-PK24+800D(ARR.FRESNO)",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/M30-PK24+800D(ARR.FRESNO).jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.741546, 40.448882]},
                "type": "Feature",
                "properties": {
                    "description": "M30-PK22+400D(VETERINARIA).jpg",
                    "marker-symbol": "cinema",
                    "title": "M30-PK22+400D(VETERINARIA)",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/M30-PK22+400D(VETERINARIA).jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.733878, 40.426417]},
                "type": "Feature",
                "properties": {
                    "description": "M30-PK19+700D(MONISTROL).jpg",
                    "marker-symbol": "cinema",
                    "title": "M30-PK19+700D(MONISTROL)",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/M30-PK19+700D(MONISTROL).jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.738839, 40.434655]},
                "type": "Feature",
                "properties": {
                    "description": "M30-PK20+700D(P.FRANCESES).jpg",
                    "marker-symbol": "cinema",
                    "title": "M30-PK20+700D(P.FRANCESES)",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/M30-PK20+700D(P.FRANCESES).jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.722253, 40.403501]},
                "type": "Feature",
                "properties": {
                    "description": "M30-PK16+000C(CALDERON).jpg",
                    "marker-symbol": "cinema",
                    "title": "M30-PK16+000C(CALDERON)",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/M30-PK16+000C(CALDERON).jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.669686, 40.39844]},
                "type": "Feature",
                "properties": {
                    "description": "M30-PK10+000C.jpg",
                    "marker-symbol": "cinema",
                    "title": "M30-PK10+000C",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/M30-PK10+000C.jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.665966, 40.403653]},
                "type": "Feature",
                "properties": {
                    "description": "M30-PK09+800D(A3).jpg",
                    "marker-symbol": "cinema",
                    "title": "M30-PK09+800D(A3)",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/M30-PK09+800D(A3).jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.65984, 40.415411]},
                "type": "Feature",
                "properties": {
                    "description": "M30-PK08+000D(DAI).jpg",
                    "marker-symbol": "cinema",
                    "title": "M30-PK08+000D(DAI)",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/M30-PK08+000D(DAI).jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.659735, 40.444706]},
                "type": "Feature",
                "properties": {
                    "description": "M30-PK04+700D(AVAMERICA).jpg",
                    "marker-symbol": "cinema",
                    "title": "M30-PK04+700D(AVAMERICA)",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/M30-PK04+700D(AVAMERICA).jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.660291, 40.431775]},
                "type": "Feature",
                "properties": {
                    "description": "M30-PK06+000D(ALCALA).jpg",
                    "marker-symbol": "cinema",
                    "title": "M30-PK06+000D(ALCALA)",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/M30-PK06+000D(ALCALA).jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.673803, 40.484253]},
                "type": "Feature",
                "properties": {
                    "description": "M30-PK00+000C(MANOTERAS).jpg",
                    "marker-symbol": "cinema",
                    "title": "M30-PK00+000C(MANOTERAS)",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/M30-PK00+000C(MANOTERAS).jpg"
                }
            }, {
                "geometry": {"type": "Point", "coordinates": [-3.697122, 40.487767]},
                "type": "Feature",
                "properties": {
                    "description": "M30-PK30+500C(M607).jpg",
                    "marker-symbol": "cinema",
                    "title": "M30-PK30+500C(M607)",
                    "url": "www.mc30.es/components/com_hotspots/datos/imagenes_camaras/M30-PK30+500C(M607).jpg"
                }
            }]
        }
    };
    //Añadimos un marcador al mapa por cada camara
    cam_geojson.data.features.forEach(function (marker) {
        var el = document.createElement('div');
        el.className = 'camera-marker';
        el.addEventListener('click', function () {
            //Se abre una pestaña con la imagen mas reciente de la camara
            window.open(
                'http://' + marker.properties.url, "_blank")
        });
        new mapboxgl.Marker(el) //el: elemento HTML que representa el marcador
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);
    });
    map.addSource('point', cam_geojson);

    /*Carga de puntos de medida en el recorrido A1-A2*/
    loadPMJSON(function (response) {
        var actual_JSON = JSON.parse(response);
        //Añade un marcador por cada punto de medida
        actual_JSON.data.features.forEach(function (marker) {
            var pm_el = document.createElement('div');
            pm_el.className = 'pm-marker';
            //Listener del click sobre un punto de medida
            pm_el.addEventListener('click', function (e) {
                getPmData(marker.properties.id, (result) => {
                    //Mostrar alerta con la información en tiempo real del punto de medida clickeado
                    window.alert('PM: ' + marker.properties.id +
                        '\nIntensidad: ' + result.intensidad + ' vehículos/hora' +
                        '\nOcupacion: ' + result.ocupacion + '%' +
                        '\nVelocidad media: ' + result.velocidad_media + 'km/h')
                })
            });
            new mapboxgl.Marker(pm_el)
                .setLngLat(marker.geometry.coordinates)
                .addTo(map);
        });
    });

    /*Carga de trabajos planificados*/
    getTrabajos()
        .then(function (result) {
                map.addSource('trabajos', JSON.parse(result));
                map.addLayer({
                    'id': 'trabajos',
                    'type': 'line',
                    'source': 'trabajos',
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    'paint': {
                        'line-color': ' #cb3234',
                        'line-width': 8
                    }
                });
            }, function (e) {
                console.log(e)
            }
        );
    //Controlador de click sobre un trabajo planificado
    map.on('click', 'trabajos', function (e) {
        var description = "<h3>" + e.features[0].properties.description + "</h3>" +
            "<b>Inicio: </b>" + e.features[0].properties.start + "</br>" +
            "<b>Finalización: </b>" + e.features[0].properties.end + "</br>" +
            " <b>Tipo de core: </b>" + e.features[0].properties.type + "</br>" +
            " <b>Horario: </b>" + e.features[0].properties.sched + "";
        var coordinates = e.features[0].geometry.coordinates.slice();
        //Aseguramos que salga el pop-up aunque se haga zoom
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        new mapboxgl.Popup().setLngLat(coordinates[0]).setHTML(description).addTo(map)
    });
    //Control del hover sobre los trabajos planificados
    map.on('mouseenter', 'trabajos', function () {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'trabajos', function () {
        map.getCanvas().style.cursor = '';
    });
});
