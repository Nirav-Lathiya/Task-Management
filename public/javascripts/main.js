var idcount = 0;
var activeid = "";

var socket = io.connect();

const add_item = (id, title) => {
  console.log("add_item");
  //  event.preventDefault();
  let item = document.getElementById("box");

  if (id && title != "") {
    $("#" + id).remove();
    $("#list_item").append(`<div id="${id}">
    <span><li id='${id}_name'>${title}</li><td><i class="fa fa-pencil-alt" onclick = "edit('${id}')" style="padding-left:70px;"></i><i class="fas fa-trash-alt" onclick = 'remove("${id}")' style="padding-left:25px;"></i></td><br>${moment().format(
      "MMMM Do YYYY, h:mm:ss a"
    )}</span>
      <button onclick='inprogress("${id}","${title}")' class="btn btn-primary">inprogress</button>
      </div>`);

    updateStatus(id, "new");
  }
  else if (item.value != "") {
    console.log("testing here");
    insert(item.value);
    idcount++;
    item.value = "";
  } else {
    alert("make sure you enter item list or not");
  }

};

const inprogress = (idcount, title) => {
 
  $(`#${idcount}`).remove();
  $(`#list_item1`).append(
    `<div id='${idcount}'>
       <span><li id='${idcount}_name'>${title}</li><td><i class="fa fa-pencil-alt" onclick = "edit('${idcount}')" style="padding-left:70px;"></i></a><i class="fas fa-trash-alt" onclick ='remove("${idcount}")' style="padding-left:25px;"></i></td><br>${moment().format(
      "MMMM Do YYYY, h:mm:ss a"
    )}</span>
    <button id = ${idcount} onclick='Done("${idcount}","${title}")' class="btn btn-primary">done</button>
  
    </div>`
  );

  updateStatus(idcount, "in progress");
};

const Done = (idcount, title ) => {
  $(`#${idcount}`).remove();
  $(`#list_item2`).append(
    `<div id='${idcount}'>
 <span><li id='${idcount}_name'>${title}</li><td><i class="fa fa-pencil-alt" onclick = "edit('${idcount}')" style="padding-left:70px;"></i></a><i class="fas fa-trash-alt" onclick='remove("${idcount}")' style="padding-left:25px;"></i><td><br>${moment().format(
      "MMMM Do YYYY, h:mm:ss a"
    )}</span>
    <button id  = ${idcount} onclick='inprogress("${idcount}","${title}")' class="btn btn-primary">inprogress</button>
    <button id = ${idcount} onclick='add_item("${idcount}","${title}")' class="btn btn-primary">new</button>
  </div>`
  );

  updateStatus(idcount, "done");
};

socket.on("add item", (data) => {
  console.log("database to all", data);
  console.log("insert id", data.id);

  $("#list_item").append(
    `<div id='${data.id}'>
                <span><li id ='${data.id}_name'>${data.title1}</li><td><i class="fa fa-pencil-alt"  onclick = "edit('${data.id}')" style="padding-left:70px;"></i></a><i class="fas fa-trash-alt" onclick = "remove('${data.id}')"style="padding-left:25px;"></i></td><br><br>${data.date1}</span>
         <button  onclick='inprogress("${data.id}","${data.title1}","${data.date1}")' class="btn btn-primary">inprogress</button>
        
         </div>`
  );
});

function insert(val) {
  console.log("test");
  event.preventDefault();
  console.log("values", val);
  $.ajax({
    url: "/tasks/add",
    type: "POST",
    data: {
      title: $("#box").val(),
      date1: moment().format("MMMM Do YYYY, h:mm:ss a"),
    },

    success: function (data, status, xhr) {
      console.log("insert data", data);
      // let id = data.id;
      // $("#list_item").append(`<div id='${id}'>
      // <span><li id='${id}_name'>${val}</li><i class="fa fa-pencil-alt" onclick = "edit('${id}')" style="padding-left:70px;"></i><i class="fas fa-trash-alt" onclick = 'remove("${id}")' style="padding-left:25px;"></i></td><br>${moment().format(
      //   "MMMM Do YYYY, h:mm:ss a"
      // )}</span>
      //   <button  id = '${id}' onclick='inprogress("${id}","${val}","${
      //   data.date1
      // }")' class="btn btn-primary">inprogress</button>
      //   </div>`);
    },

    error: function (err, xhr) {
      alert(err);
    },
  });
}
socket.on("edit", (data) => {
  console.log("edit data", data);
  console.log("id data", data.id);
  
  $(`#${data.id}_name`).text(data.title)
});

function edit(idcount) {
  var name = $(`#${idcount}_name`).text();
  console.log("name " + name);
  activeid = idcount;
  $(`#examplemode`).modal("show");
  $(`#box1`).val(name);

}

function updateTitle() 
{
   
  console.log("edit here");
  console.log(activeid); 
  event.preventDefault();

  $.ajax({
    url: "/tasks/edit",
    type: "POST",
    data: {
      id: activeid,
      title: $(`#box1`).val(),
    },
    success: function (data, status, xhr) {
      console.log(data);
      swal(JSON.stringify("OK"));
      $(`#${activeid}_name`).text(data.title);
    },
    error: function (err, xhr) {
      console.log(err);
      swal(err);
    },
  });
}


socket.on("update", (data) => {
  console.log("update status", data);
 $(`#${data._id}`).remove();
   const { status } = data;
  if (status == "new") {
    $("#list_item").append(
      `<div id='${data._id}'>
                  <span><li id ='${data._id}_name'>${data.title1}</li><td><i class="fa fa-pencil-alt"  onclick = "edit('${data._id}')" style="padding-left:70px;"></i></a><i class="fas fa-trash-alt" onclick = "remove('${data._id}')"style="padding-left:25px;"></i></td><br>${data.date1}</span>
           <button  onclick='inprogress("${data._id}","${data.title1}","${data.date1}")' class="btn btn-primary">inprogress</button>
          
           </div>`
    );
  } else if (status == "in progress") {
    $("#list_item1").append(
      `<div id='${data._id}'>
              <span><li id ='${data._id}_name'>${data.title1}</li><td><i class="fa fa-pencil-alt"  onclick = "edit('${data._id}')" style="padding-left:70px;"></i></a><i class="fas fa-trash-alt" onclick = "remove('${data._id}')" style="padding-left:25px;"></i></td><br>${data.date1}</span>
           <button onclick='Done("${data._id}","${data.title1}","${data.date1}")' class="btn btn-primary">Done</button>
           
           </div>`
    );
  } else if (status == "done") {
    $("#list_item2").append(
      `<div id='${data._id}'>
              <span><li id ='${data._id}_name'>${data.title1}</li><td><i class="fa fa-pencil-alt" onclick = "edit('${data._id}')" style="padding-left:70px;"></i></a><i class="fas fa-trash-alt" onclick = "remove('${data._id}')" style="padding-left:25px;"></i></td><br>${data.date1}</span>
           <button onclick='inprogress("${data._id}","${data.title1}","${data.date1}")' class="btn btn-primary">in progress</button>
            <button onclick='add_item("${data._id}","${data.title1}","${data.date1}")' class="btn btn-primary">new</button>
        </div>`
    );
  }
  
});
function updateStatus(idcount, status) {
  

  event.preventDefault();
  $.ajax({
    url: "/tasks/update",
    type: "POST",
    data : {
      id: idcount,
      status: status,
     
    },

    success: function (data, status, xhr) {
      console.log(data);
      swal(JSON.stringify("OK"));

    },
    error: function (err, xhr) {
      swal(err);
    },
  });
}

$(document).ready(() => {
  fetchdata();
});

function fetchdata() {
  console.log("testing");
  $.ajax({
    url: "/tasks/getdata",
    type: "GET",
    datatype: "json",
    success: function (data, status, xhr) {
      $("#list_item1").empty();
      console.log("all datas", data);

      data.forEach((item) => {
        console.log(item);
        var status = item.status;
        if (status == "new") {
          $("#list_item").append(
            `<div id='${item._id}'>
                        <span><li id ='${item._id}_name'>${item.title1}</li><td><i class="fa fa-pencil-alt" onclick = "edit('${item._id}')" style="padding-left:70px;"></i></a><i class="fas fa-trash-alt" onclick = "remove('${item._id}')"style="padding-left:25px;"></i></td><br>${item.date1}</span>
                 <button  onclick='inprogress("${item._id}","${item.title1}","${item.date1}")' class="btn btn-primary">inprogress</button>
                
                 </div>`
          );
        } else if (status == "in progress") {
          $("#list_item1").append(
            `<div id='${item._id}'>
                    <span><li id ='${item._id}_name'>${item.title1}</li><td><i class="fa fa-pencil-alt" onclick = "edit('${item._id}')" style="padding-left:70px;"></i></a><i class="fas fa-trash-alt" onclick = "remove('${item._id}')" style="padding-left:25px;"></i><br>${item.date1}</span>
                 <button onclick='Done("${item._id}","${item.title1}","${item.date1}")' class="btn btn-primary">Done</button>
                 
                 </div>`
          );
        } else if (status == "done") {
          $("#list_item2").append(
            `<div id='${item._id}'>
                    <span><li id ='${item._id}_name'>${item.title1}</li><td><i class="fa fa-pencil-alt" onclick = "edit('${item._id}')" style="padding-left:70px;"></i></a><i class="fas fa-trash-alt" onclick = "remove('${item._id}')" style="padding-left:25px;"></i><br>${item.date1}</span>
                 <button onclick='inprogress("${item._id}","${item.title1}","${item.date1}")' class="btn btn-primary">in progress</button>
                  <button onclick='add_item("${item._id}","${item.title1}","${item.date1}")' class="btn btn-primary">new</button>
                
                  </div>`
          );
        }
      });
    },
    error: function (err, xhr) {
      alert(err);
    },
  });
}

socket.on("delete", (data) => {
  console.log("delete data", data);
  $(`#${data.id}`).remove();
});

function remove(id) {
  console.log("delete");
  $(`#${id}`).remove();
  $.ajax({
    url: "/tasks/delete",
    method: "POST",
    data: {
      id: id,
    },
    success: function (data, status, xhr) {
      console.log(data);
      swal(JSON.stringify(data));
    },
    error: function (err, xhr) {
      swal(err);
    },
  });
}
