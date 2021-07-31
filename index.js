var filterResults = function () {
  $(this).addClass('active');
  $(this).siblings().removeClass('active');
  getTasks();
}

var getTasks = function() {
  $.ajax({
    type: "GET",
    url: "https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=117",
    dataType: "json",
    success: function (response, textStatus) {
      $('.to-dos').empty();

      var returnActiveTasks = response.tasks.filter(function (task) {
        if (!task.completed) {
          return task.id;
        }
      });
      var returnCompletedTasks = response.tasks.filter(function (task) {
        if (task.completed) {
          return task.id;
        }
      });

      var filter = $('.active').attr('id');

      if (filter === 'all' || filter === '') {
        taskItems = response.tasks;
      }
      if (filter === 'active') {
        taskItems = returnActiveTasks;
      }
      if (filter === 'completed') {
        taskItems = returnCompletedTasks;
      }

      taskItems.forEach(function (task) {
        var taskContent = `
          <div class="to-do">
            <div class="left-side">
              <button class="select" data-id="${task.id}" data-completed="${task.completed}">
                <ion-icon name=${task.completed ? "checkmark-circle-outline" : "ellipse-outline"} size="large"></ion-icon>
              </button>
              <p class=${task.completed ? "task-content-completed" : "task-content"}>${task.content}</p>
            </div>
            <button class="delete" data-id="${task.id}"><ion-icon name="close-outline" size="large"></ion-icon></button>
          </div>
        `;
        $('.to-dos').append(taskContent);
      })

      // update the amount of task items
      $('.to-do-amount span').text(response.tasks.length);
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
  });
}

var submitTask = function () {

  var taskInput = $('.new-to-do input');
  
  $.ajax({
    type: "POST",
    url: "https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=117",
    contentType: 'application/json',
    data: JSON.stringify({
      task: {
        content: taskInput.val()
      }
    }),
    dataType: "json",
    success: function (response, textStatus) {
      console.log(response);
      getTasks();
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
  });

  taskInput.val('');  

};

var deleteTask = function (id) {
  $.ajax({
    type: "DELETE",
    url: `https://altcademy-to-do-list-api.herokuapp.com/tasks/${id}?api_key=117`,
    success: function (response, textStatus) {
      console.log(response);
      getTasks();
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
  });
};

var taskIsComplete = function(id) {
  $.ajax({
    type: 'PUT',
    url: `https://altcademy-to-do-list-api.herokuapp.com/tasks/${id}/mark_complete?api_key=117`,
    dataType: 'json',
    success: function (response, textStatus) {
      console.log(response);
      getTasks();
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
  }); 
} 

var taskIsActive = function(id) {
  $.ajax({
    type: 'PUT',
    url: `https://altcademy-to-do-list-api.herokuapp.com/tasks/${id}/mark_active?api_key=117`,
    dataType: 'json',
    success: function (response, textStatus) {
      console.log(response);
      getTasks();
    },
    error: function (request, textStatus, errorMessage) {
      console.log(errorMessage);
    }
  }); 
}

$(document).ready(function () {

  getTasks();

  $('.new-to-do').on('submit', function (event) {
    event.preventDefault();
    submitTask();
  });

  $(document).on('click', '.delete', function () {
    deleteTask($(this).data('id'));
  });
  
  $(document).on('click', '.select', function () {
    if ($(this).data('completed')) {
      taskIsActive($(this).data('id'));
    } else {
    } taskIsComplete($(this).data('id'));
  });

  // filtering
  $('.to-do-filter button').on('click', filterResults);

});