$(document).ready(function () {
    // Initialize Scrum board with saved task lists
    renderTasks();

    // Click event for moving tasks between columns
    $('.task-list').on('click', '.task', function () {
        $(this).toggleClass('selected');
    });

     // Function to clear local storage
     function clearLocalStorage() {
        localStorage.clear();
        // After clearing local storage, you may want to re-render the tasks
        renderTasks();
    }

    $(".btn-clear-localstorage").click(function () {
        clearLocalStorage();
    });


    // Make tasks draggable
    $('.task-list').on('mouseenter', '.task', function () {
        $(this).draggable({
            helper: 'original',
            cursor: 'move',
            revert: 'invalid',
        });
    });

    // Make columns droppable
    $('.column').droppable({
        accept: '.task-list .task',
        drop: function (event, ui) {
            var droppedTask = ui.helper.clone();
            var originalTask = ui.helper;

            if ($(this).find('.task-list').data('status') !== originalTask.parent().data('status')) {
                // Append the cloned task to the new column
                $(this).find('.task-list').append(droppedTask);

                // Remove the original task from its previous location
                originalTask.remove();

            }
        },
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

    $(".btnr").click(function removeSelectedTasks(status) {
        var confirmDelete = confirm("Are you sure you want to remove the selected tasks?");
            if (confirmDelete) {
        $('#todo-list .selected').remove();
        saveTasksForStatus('todo');
            }
    })

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

