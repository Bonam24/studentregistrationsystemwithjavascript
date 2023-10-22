const server = 'http://localhost:3001';
var studentId;
var studentName;
var studentGrade;
//Function to close the pop up form
function closeForm() {
    document.getElementById("myForm").style.display = "none";
  }
var usid;
var deleteid;
var ber = "Bonam"

// Fetch student functions
async function fetchStudents() {
    const url = server + '/students';
    const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    }
    const response = await fetch(url, options);
    const students = await response.json();
    populateContent(students);
}

// Add student function
async function addStudent() {
    const url = server + '/students';
    const student = { id: studentId, name: studentName, grade: studentGrade };
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(student)
    }
    const response = await fetch(url, options);
    if (response.ok) {
        populateContent(await fetchStudents()); // update the chart
    }
}



// Delete student function
async function deleteStudent(id) {
    const url = server + '/students/' + id;
    const options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const response = await fetch(url, options);
}

// Edit student function
async function editStudent(id, name, grade) {
    const url = server + '/students/' + id;
    const student = { id: id, name: name, grade: grade };
    const options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(student)
    }
    const response = await fetch(url, options);

    if (response.ok) {
        // If the response status is 200 or 204, assume the update was successful
        populateContent(await fetchStudents());
    }
}




function populateContent(students) { // populates an HTML table with the data from a list of students
    var arrayOfMarks = [];
    students.forEach((student) => {
      arrayOfMarks.push(parseInt(student.grade));
      document.getElementById("displaymedian").innerHTML = "The median score is " + getMedian(arrayOfMarks);
    });
    var table = document.getElementById('content');
    table.innerHTML = "<tr><th>Student Id</th><th>Full Name</th><th>Grade</th><th></th><th></th></tr>";

    // Display chart
    var gradeData = students;

    // Create an object to store the grades and their frequency
    var grades = {};
    gradeData.forEach(function (item) {
        if (grades[item.grade]) {
            grades[item.grade]++;
        } else {
            grades[item.grade] = 1;
        }
    });

    // Create an object to store the grades and their frequency
    var grades = {};
    gradeData.forEach(function (item) {
        var gradeRange = Math.floor(item.grade / 10) * 10 + 10;
        if (grades[gradeRange]) {
            grades[gradeRange]++;
        } else {
            grades[gradeRange] = 1;
        }
    });

    // Convert the grades object to an array of objects with x and y properties
    var xyValues = Object.keys(grades).map(function (key) {
        return { x: key, y: grades[key] };
    });

    // Sort the array by the x property in ascending order
    xyValues.sort(function (a, b) {
        return a.x - b.x;
    });

    // Create chart
    new Chart("myChart", {
        type: "bar",
        data: {
            datasets: [
                {
                    label: "Number of Students",
                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 2,
                    data: xyValues.map(function (item) {
                        return item.y;
                    }),
                },
            ],
            labels: xyValues.map(function (item) {
                return item.x;
            }),
        },
        options: {
            scales: {
                yAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            precision: 0,
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Number of Students",
                        },
                    },
                ],
                xAxes: [
                    {
                        ticks: {
                            beginAtZero: true,
                            stepSize: 10,
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Grade Range",
                        },
                        afterTickToLabelConversion: function (scaleInstance) {
                            scaleInstance.ticks.forEach(function (tick, index, ticks) {
                                var rangeStart = tick - 10;
                                var rangeEnd = tick;
                                ticks[index] = rangeStart + " - " + rangeEnd;
                            });
                        },
                    },
                ],
            },
        },
    });

    // View chart button
    var chartVisible = false;

    viewButton = document.getElementById('viewChartButton');
    viewButton.innerHTML = "View Chart";
    viewButton.onclick = function () {
        chartVisible = !chartVisible;
        document.getElementById('myChart').style.display = chartVisible ? 'block' : 'none';
    };


    // Creates the elements' rows
    students.forEach(student => {
        var row = document.createElement('tr');
        var dataId = document.createElement('td');
        var textId = document.createTextNode(student.id);
        dataId.appendChild(textId);

        var dataName = document.createElement('td');
        var textName = document.createTextNode(student.name);
        dataName.appendChild(textName);

        var dataGrade = document.createElement('td');
        var textGrade = document.createTextNode(student.grade);
        dataGrade.appendChild(textGrade);

        

        // Creates edit button
        let editButton = document.createElement("button");
        editButton.innerHTML = "Edit";
        editButton.style.backgroundColor = "#2867CB";
        editButton.addEventListener("mouseover", function () {
            editButton.style.backgroundColor = "blue";
            
        });

        editButton.addEventListener("mouseout", function () {
            editButton.style.backgroundColor = "#2867CB";
            
        });
        
        editButton.addEventListener("click", function () {
          document.getElementById("uid").value = student.id;
           usid = student.id;
          console.log(usid);
          document.getElementById("ulname").value = student.name;
          document.getElementById("uscore").value = student.grade;
          function openForm() {
            document.getElementById("myForm").style.display = "block";
          }
          openForm();
          
    
          document.getElementById("myForm").style.display = "block";
        });
       

        // Creates delete button
        var deleteButton = document.createElement('button');
        deleteButton.innerHTML = "Delete";
        deleteButton.style.backgroundColor = "#AF001C";
        deleteButton.addEventListener("mouseover", function () {
            deleteButton.style.backgroundColor = "darkred"; // set the background-color to darkred on hover
        });

        deleteButton.addEventListener("mouseout", function () {
            deleteButton.style.backgroundColor = "#AF001C"; // set the background-color back to red when the mouse leaves the button
        });
        deleteButton.onclick = function () {
            deleteid = student.id
            opendelete();
            
        };

        // Positioning of edit and delete button
        var dataEdit = document.createElement('td');
        dataEdit.appendChild(editButton);

        var dataDelete = document.createElement('td');
        dataDelete.appendChild(deleteButton);

        row.appendChild(dataId);
        row.appendChild(dataName);
        row.appendChild(dataGrade);
        row.appendChild(dataEdit);
        row.appendChild(dataDelete);
        table.appendChild(row);
    });

   
}

// The submit function

document.querySelector('form').addEventListener('submit', async (e) => {
    studentId = document.getElementById('studentId').value;
    studentName = document.getElementById('studentName').value;
    studentGrade = document.getElementById('studentGrade').value;
    if (studentId && studentName && studentGrade) {
        studentId = parseInt(studentId);
        studentGrade = parseInt(studentGrade);
        await editStudent(studentId, studentName, studentGrade); // Call the editStudent function instead of addStudent
        addStudent();
        fetchStudents();

        form.reset();
    }
    e.preventDefault();
});
//update
async function update(student) {
    const url = "/update/" + usid;
    options = {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(student),
    };
    const response = await fetch(url, options);
  }
  function handleUpdate(event) {
    event.preventDefault();
  
    const holdDisplay = display();
    console.log(holdDisplay);
    update(holdDisplay);
    closeForm();
   fetchStudents();
  }
  function display() {
    id = document.getElementById("uid").value;
    lname = document.getElementById("ulname").value;
    scores = document.getElementById("uscore").value;
    const student2 = { id:id, name:lname, grade:scores };
    return student2;
  }
  //function to calculate median marks and add median to the table
  
    function getMedian(data) {
        if (data.length == 0) {
          return "no mark";
        }
        data.sort((a, b) => a - b);
        const halfway = Math.floor(data.length / 2);
        let medianMark;
        if (data.length % 2 === 1) {
          medianMark = data[halfway]; //
        } else {
          medianMark = (data[halfway - 1] + data[halfway]) / 2;
        }
        return medianMark;
      } 

      //function to delete
      function opendelete(){
        document.getElementById('deleteform').style.display = 'block';
      }

      function closedelete(){
        document.getElementById('deleteform').style.display = 'none';
      }
      function Handledeletevent(event){
        event.preventDefault();
        deleteStudent(deleteid);
        closedelete();
        fetchStudents()
      }
