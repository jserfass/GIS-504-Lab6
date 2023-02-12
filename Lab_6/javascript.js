var map = L.map('map').setView([47.4711, -120.7401], 7.5);
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/outdoors-v12',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoianNlcmZhc3MiLCJhIjoiY2w5eXA5dG5zMDZydDN2cG1zeXduNDF5eiJ9.6-9p8CxqQlWrUIl8gSjmNw'
}).addTo(map);
// create an editable layer on the map
var drawnItems = L.featureGroup().addTo(map);
// add the drawing control
new L.Control.Draw({
    draw : {
        polygon : true,
        polyline : false,
        rectangle : true,     
        circle : true,        
        circlemarker : false,  
        marker: true
    },
    edit : {
        featureGroup: drawnItems
    }
}).addTo(map);
// HTML form that allows the user to enter attribute information while responding to questions in the form.
function createFormPopup() {
    var popupContent = 
    '<form>' + 
        'What species was observed?<input type="text" id="input_species"><br>' + 
        'Approximate number of individuals observed?<br><input type="number" id="input_number"><br>' + 
        'Date of sighting:<br><input type="date" id="input_date"><br>' + 
        'Time of sighting:<br><input type="time" id="input_time"><br>' + 
        'Please provide a photo of the animal (Optional):<br><input type="file" id="input_photo" accept="image/png, image/jpeg"><br>' + 
        'Description of area (Optional):<br><input type="text" id="input_desc"><br>' + 
        'Your name:<input type="text" id="input_name"><br>' + 
        'Contact info (Optional):<br><input type="text" id="input_contact"><br>' + 
        '<input type="button" value="Submit" id="submit">' + 
        '</form>'
    drawnItems.bindPopup(popupContent).openPopup();
}
// add an event listener that triggers a function to add the shape as a layer to the drawnItems feature group & print the geometry of the shapes to the console so we can inspect them
map.addEventListener("draw:created", function(e) {
    e.layer.addTo(drawnItems);
    createFormPopup();
});
// attach the event listener to the submit button and define a function to run when it is clicked
function setData(e) {
    if(e.target && e.target.id == "submit") {
        // Get pop up variables
        var enteredSpecies = document.getElementById("input_species").value;
        var enteredIndividuals = document.getElementById("input_number").value;
        var enteredDate = document.getElementById("input_date").value;
        var enteredTime = document.getElementById("input_time").value;
        var enteredPhoto = document.getElementById("input_photo").value;
        var enteredDescription = document.getElementById("input_desc").value;
        var enteredUsername = document.getElementById("input_name").value;
        var enteredContactinfo = document.getElementById("input_contact").value;
        // Print user name and description to console
        console.log(enteredSpecies);
        console.log(enteredIndividuals);    
        console.log(enteredDate);    
        console.log(enteredTime);    
        console.log(enteredPhoto);    
        console.log(enteredDescription);
        console.log(enteredUsername);
        console.log(enteredContactinfo);
        // Get and print GeoJSON for each drawn layer
        drawnItems.eachLayer(function(layer) {
            var drawing = JSON.stringify(layer.toGeoJSON().geometry);
            console.log(drawing);
        });
        // Clear drawn items layer
        drawnItems.closePopup();
        drawnItems.clearLayers();
    }
}
// add an event listener to the end of your JavaScript code so that when the submit button is clicked, the setData function will run
document.addEventListener("click", setData);
// to close the popup when the user enters the “edit” or “delete” modes, and re-open it when done editing or deleting
map.addEventListener("draw:editstart", function(e) {
    drawnItems.closePopup();
});
map.addEventListener("draw:deletestart", function(e) {
    drawnItems.closePopup();
});
map.addEventListener("draw:editstop", function(e) {
    drawnItems.openPopup();
});
map.addEventListener("draw:deletestop", function(e) {
    if(drawnItems.getLayers().length > 0) {
        drawnItems.openPopup();
    }
});
// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());