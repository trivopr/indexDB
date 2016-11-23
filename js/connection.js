$(document).ready(function() {

  let request = indexedDB.open('customermanager', 3);

  request.onupgradeneeded = function (e) {
      var db = e.target.result;
      console.log('Upgrade...');
      if (!db.objectStoreNames.contains('customers')) {
        var os = db.createObjectStore('customers', {keyPath: 'id', autoIncrement: true});

        // Create Index for Name
        os.createIndex('name', 'name', {unique: false});
      }
  };

  request.onsuccess = function(e) {
    console.log('Success Open Connection...');
    db = e.target.result;
    db.createIndex('name', 'name', {unique: false});
    showCustomers();
  };

  request.onerror = function (e) {
    console.log('Error Connection');
  };

  $('#frmAddMember').on('submit', function(e) {
    addCustomer();
  });
});

let addCustomer = () => {
  console.log('addCustomer');
  let name = $('#name').val();
  let email = $('#email').val();

  let transaction = db.transaction(['customers'], 'readwrite');

  // Ask for ObjectStore

  let store = transaction.objectStore('customers');

  // Define Customer
  let customer = {
    name: name,
    email: email
  };

  // Perform the Add

  let request = store.add(customer);

  //Success
  request.onsuccess = function (e) {
    window.location.href='index.html';
  };

  //Error
  request.onerror = function (e) {
    alert('SORRY, The Customer is not added');
    console.log("Error:", e.target.error.name);
  };
};


let showCustomers = () => {
  let transaction = db.transaction(['customers'], 'readonly');
  // Ask for ObjectStore
  let store = transaction.objectStore('customers');
  let index = store.index('name');
  let output = '';

  index.openCursor().onsuccess = function (e) {
      let cursor = e.target.result;

      if (cursor) {
        output += '<tr>';
        output += '<td> <span>' + cursor.value.id + '</span></td>';
        output += '<td> <span>' + cursor.value.name + '</span></td>';
        output += '<td> <span>' + cursor.value.email + '</span></td>';
        output += '<td><a href="">Delete</a></td>';
        output += '</tr>';
        cursor.continue();
      }

      $('#customer').html(output);
  };
};
