var firebase = require('firebase/app');
var realtime_db = require('firebase/database');
var express = require('express');
var router = express.Router();

/**
 * Gestiona la peticion de informacion de los trabajos planificados
 */
router.get('/trabajos_planificados', function (req, res, next) {

    getTrabajosPlanificados(res)
        .then(value => {
            console.log(value.val());
            getGeoJson_rep(value.val())
                .then(function (result) {
                    console.log(result);
                    res.send(result)
                }, function (e) {
                    console.log(e)
                });
        })
});

/**
 * Gestiona la peticion de informacion de los puntos de medida
 */
router.get('/pms', function (req, res, next) {
    getPmData(req.query.id)
        .then(function (result) {
            console.log(result);
            res.send(result)
        }, function (e) {
            console.log(e)
        });
});

/**
 * Gestiona la peticion de informacion de contaminacion
 */
router.get('/nitro', function (req, res, next) {
    getNitroData(req.query.id)
        .then(function (result) {
            console.log(result);
            res.send(result)
        }, function (e) {
            console.log(e)
        });
});




// Configuracion de la base de datos
var firebaseConfig = {
    apiKey: "AIzaSyBMj-lb3Fdvtt6dzZfR32fZ1BnBuJ0r5tQ",
    authDomain: "movies-d342f.firebaseapp.com",
    databaseURL: "https://movies-d342f.firebaseio.com",
    projectId: "movies-d342f",
    storageBucket: "movies-d342f.appspot.com",
    messagingSenderId: "692829630241",
    appId: "1:692829630241:web:354cf4b2720de6a611d860"
};

// Inicializacion de la instancia de la bbdd
firebase.initializeApp(firebaseConfig);
var db = firebase.database();

/**
 * Obtiene de la BBDD la informacion de los trabajos planificados
 * @returns {Promise<firebase.database.DataSnapshot>}
 */
function getTrabajosPlanificados() {
    console.log('get_trabajos_planificados function');
    var ref = db.ref('last_reg/trabajos_planificados');
    return ref.once('value', function (snapshot) {
    })
}

/**
 * Obtiene la informacion mas reciente de la BBDD del punto de medida pasado por parametros
 * @param pm_code: codigo del punto de medida
 * @returns {Promise<unknown>}
 */
function getPmData(pm_code) {
    console.log('getPmData function : ' + pm_code);
    var ref = db.ref('last_reg').child('datos_trafico_mad');
    return new Promise(function (resolve, reject) {
        try {
            ref.once('value', function (snapshot) {
                let snap = snapshot.val();
                for (i in snap) {
                    console.log("\n" + i);
                    var obj = snap[i];
                    if (obj.idelem == pm_code) {
                        resolve(obj);
                    }
                }
            });
        } catch (e) {
            reject(e)
        }
    })
}

/**
 * Obtiene la informacion mas reciente de la BBDD de los niveles de NO2
 * @returns {Promise<unknown>}
 */
function getNitroData() {
    console.log('getNitroData function ');
    var ref = db.ref('last_reg').child('contaminacion');
    return new Promise(function (resolve, reject) {
        try {
            ref.once('value', function (snapshot) {
                let snap = snapshot.val();
                var list = [];
                for (i in snap) {
                    var obj = snap[i];
                    if (obj.magnitud == '8') { //la medida de NO2 se identifica con el codigo 8
                        list.push(obj)
                    }
                }
                resolve(list);
            });
        } catch (e) {
            reject(e)
        }
    })
}

/**
 * Transforma los trabajos planificados en formato json a formato geojson para poder ser representados en el cliente
 *
 */
function getGeoJson_rep(json_file) {
    console.log('getGeoJson_rep function');
    return new Promise(function (resolve, reject) {
        try {
            var geojson_file = {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': []
                }
            };
            var i;
            for (i = 0; i < json_file.length; i++) {
                var feature = {
                    'type': 'Feature',
                    'properties': {
                        'color': '#F7455D',
                        'start': json_file[i].fecha_inicio,
                        'end': json_file[i].fecha_fin,
                        'description': json_file[i].descripcion,
                        'type': json_file[i].tipo_corte,
                        'sched': json_file[i].horario
                    },
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': []
                    }
                };
                var puntos = json_file[i].puntos;
                var j;
                for (j = 0; j < puntos.length; j++) {
                    var coordinate = [parseFloat(puntos[j][1].replace(",", ".")), parseFloat(puntos[j][0].replace(",", "."))];
                    //Añadir a geometry.coordinate
                    var current_cordinates = feature.geometry.coordinates;
                    current_cordinates.push(coordinate);
                    feature.geometry.coordinates = current_cordinates;
                }
                //añadir feature a features
                var current_feature = geojson_file.data.features;
                current_feature.push(feature);
                geojson_file.data.features = current_feature;
            }
            resolve(geojson_file)
        } catch (e) {
            reject(Error(e))
        }
    })
}
module.exports = router;