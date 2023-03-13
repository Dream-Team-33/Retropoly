//Selects task
//get all tasks
var tasks = document.querySelectorAll(".task");

//wait for any clicks
tasks.forEach(function(task) {
  task.addEventListener("click", function() {
    //when clicked take out all other options
    tasks.forEach(function(t) {
      t.classList.remove("selected");
    });
    task.classList.add("selected");
  });
});


document.getElementById("send-button").addEventListener("click", function() {
  var selectedTask = document.querySelector(".task.selected");
  var selectedTaskId = selectedTask.id;
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/my-flask-endpoint');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({ selectedTaskId: selectedTaskId }));
});
