//socketIO connection verification
var socket = io();
socket.on('connect', function() {
    socket.emit('my event', {data: 'I\'m connected!'});
});

let selectedTask = null;

function selectTask(taskElement) {
    if (selectedTask !== null) {
    // Unselect the previously selected task
    selectedTask.classList.remove("selected-task");
    }
    
    // Select the new task
    selectedTask = taskElement;
    selectedTask.classList.add("selected-task");
}