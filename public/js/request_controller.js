var trabajos_btn = document.getElementById('trabajos_planificados_btn');
MODELS_URL = 'http://127.0.0.1:5000/';


trabajos_btn.addEventListener('click', function () {
    const http = new XMLHttpRequest();
    http.open("GET", '/firebase/trabajos_planificados');
    http.send();
    http.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var res = http.response;
            console.log(res);
        }

    }

});

/**
 * Solicita los trabajos planificados en las vías
 * @returns {Promise<>}
 */
function getTrabajos() {
    return new Promise(function (resolve, reject) {
        try {
            const http = new XMLHttpRequest();
            http.open("GET", '/firebase/trabajos_planificados');
            http.send();
            http.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    var res = http.response;
                    resolve(res)
                }
            }
        } catch (e) {
            reject(Error(e))
        }
    })
}

function getPmData(id, _cb) {
    const http = new XMLHttpRequest();
    http.open("GET", '/firebase/pms?id=' + id);
    http.send();
    http.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            console.log('Response');
            var res = http.response;
            var json_res = JSON.parse(res);
            console.log(json_res);
            console.log('GetPmData result: ');
            console.log(json_res);
            _cb({
                    'intensidad': json_res.intensidad,
                    'ocupacion': json_res.ocupacion,
                    'velocidad_media': json_res.velocidad
                }
            );
        }
    }
}

function getNitroData(_cb) {
    const http = new XMLHttpRequest();
    http.open("GET", '/firebase/nitro');
    http.send();
    http.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            console.log('Response');
            var res = http.response;
            var json_res = JSON.parse(res);
            _cb(json_res);
        }
    }
}

function getPrediction(dt, _cb) {
    const http = new XMLHttpRequest();
    http.open("POST", MODELS_URL + '/predict');
    var params = 'datetime=' + dt;
    http.send(params);
    http.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            console.log('Response');
            //TODO: Cambiar formato de respuesta
            var res = http.response;
            console.log('Respuesta:' + res);
            //var json_res = JSON.parse(res);
            _cb(res);
        }
    }
}

