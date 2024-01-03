$(document).ready(function () {
    // Initialize Scrum board with saved task lists
    renderTasks();


    // Function to remove all tasks in the "Closed" column

    // Click event for moving tasks between columns
    $('.task-list').on('click', '.task', function () {
        $(this).toggleClass('selected');
    });


    // Function to add a task
    function addTask(status) {
        var taskInput = $('#' + status + '-input');
        var taskText = taskInput.val();
        if (taskText.trim() !== '') {
            var taskItem = $('<li class="task">').text(taskText);
            $('#' + status + '-list').append(taskItem);
            taskInput.val('');

            // Save tasks for the specific status to localStorage
            saveTasksForStatus(status);
        }
    }

    // Function to move selected tasks to the next column
    function moveTasks(currentStatus) {
        var selectedTasks = $('#' + currentStatus + '-list .selected');
        if (selectedTasks.length > 0) {
            var nextStatus;
            switch (currentStatus) {
                case 'todo':
                    nextStatus = 'inprogress';
                    break;
                case 'inprogress':
                    nextStatus = 'completed';
                    break;
                case 'completed':
                    nextStatus = 'closed';
                    break;
                default:
                    return;
            }
            selectedTasks.appendTo('#' + nextStatus + '-list').removeClass('selected');

            // Save tasks for both the current and next statuses to localStorage after moving
            saveTasksForStatus(currentStatus);
            saveTasksForStatus(nextStatus);
        }
    }

    // Function to remove all tasks in the "Closed" column


    // Function to render task list from localStorage for a specific status
    function renderTasksForStatus(status) {
        var savedTasks = localStorage.getItem('scrumBoardTasks-' + status);
        if (savedTasks) {
            // Find the corresponding task list and update its content
            $('#' + status + '-list').html(savedTasks);
        }
    }

    // Function to render task lists from localStorage
    function renderTasks() {
        // Render each task list separately
        renderTasksForStatus('todo');
        renderTasksForStatus('inprogress');
        renderTasksForStatus('completed');
        renderTasksForStatus('closed');
    }

    // Function to save tasks for a specific status to localStorage
    function saveTasksForStatus(status) {
        var taskList = $('#' + status + '-list').html();
        localStorage.setItem('scrumBoardTasks-' + status, taskList);
    }

    function removeSelectedClosedTasks() {
        $('#closed-list .selected').remove();
        saveTasksForStatus('closed');
    }

    // Function to remove all tasks in the "Closed" column
    function removeAllClosedTasks() {
        console.log('removed');
        $('#closed-list').empty();
        saveTasksForStatus('closed');
    }

    $(".btn1").click(function(){
        $('#closed-list .selected').remove();
        saveTasksForStatus('closed');
    })

    $(".btn2").click(function(){
        $('#closed-list').empty();
        saveTasksForStatus('closed');
    })

    // Expose functions globally (for inline event handlers)
    window.addTask = addTask;
    window.moveTasks = moveTasks;
});

