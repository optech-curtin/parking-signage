var date = new Date();
var imageData;
var allData;
var eventsList =[];

document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    getConfigImages();
    setTimeout(() => {
        getEvents();
        var calendar = new FullCalendar.Calendar(calendarEl, {
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
            },
            initialDate: date,
            navLinks: true, // can click day/week names to navigate views
            nowIndicator: true,
        
            weekNumbers: true,
            weekNumberCalculation: 'ISO',
        
            editable: true,
            selectable: true,
            dayMaxEvents: true, // allow "more" link when too many events
            events: eventsList
            });
        
            calendar.render();
      }, 300);

});


async function getConfigImages() {
    var data = await fetch('/config/config.json')
        .then(response => response.text()) // Parse the response as text
        .then(text => {
          try {
            data = JSON.parse(text); // Try to parse the response as JSON
            if(data.image_data != null){
                allData = data;
                imageData = data.image_data;
            }else{
                alert("Error in config file.");
            }
          } catch(err) {
            alert("Config Error" + err);
          }
    });
}

function getEvents(){
    var lastEventStart = new Date();
    var lastEventEnd = new Date();
    lastEventEnd.setMinutes(lastEventEnd.getMinutes() + 10);
    for (let [key, value] of Object.entries(imageData)) { //Loop all image objects in images_data
        imgEvent = {
            title: value.image_path.split("/")[1],
            start: lastEventStart,
            end: lastEventEnd
        }
        eventsList.push(imgEvent);
        lastEventStart.setMinutes(lastEventStart.getMinutes() + 10)
        lastEventEnd.setMinutes(lastEventEnd.getMinutes() + 10);
    }
}