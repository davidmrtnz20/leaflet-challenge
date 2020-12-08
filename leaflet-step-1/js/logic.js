var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

d3.json(url, function (data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
            "</h3><hr><p>" + new Date(feature.properties.time) + "</p");
    }

    function radiusSize(magnitude) {
        return magnitude * 20000;
    }

    function circleColor(magnitude) {
        if (magnitude < 1) {
            return "#ffffb2"
        }
        else if (magnitude < 2) {
            return "#fed976"
        }
        else if (magnitude < 3) {
            return "#feb24c"
        }
        else if (magnitude < 4) {
            return "#fd8d3c"
        }
        else if (magnitude < 5) {
            return "#f03b20"
        }
        else {
            return "#bd0026"
        }
    }

    var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (earthquakeData, latlng) {
            return L.circle(latlng, {
                radius: radiusSize(earthquakeData.properties.mag),
                color: circleColor(earthquakeData.properties.mag),
                fillOpacity: 1
            });
        },
        onEachFeature: onEachFeature
    });

    createMap(earthquakes);
}

function createMap(earthquakes) {
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });

    var map = L.map("map", {
        center: [41.850033, -87.6500523],
        zoom: 4,
        layers: [lightmap, earthquakes]
    });

    function getColor(d) {
        return d > 4.99 ? '#bd0026' :
            d > 3.99 ? '#f03b20' :
                d > 2.99 ? '#fd8d3c' :
                    d > 1.99 ? '#feb24c' :
                        d > 0.99 ? '#fed976' :
                            '#ffffb2';
    }

    var legend = L.control({ position: 'topright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            magslvl = [0, 1, 2, 3, 4, 5],
            labels = [];

        for (var i = 0; i < magslvl.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(magslvl[i] + 1) + '"></i> ' +
                magslvl[i] + (magslvl[i + 1] ? '&ndash;' + magslvl[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(map);
}

