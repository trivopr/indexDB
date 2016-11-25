$(document).ready(function() {

  let request = indexedDB.open('customermanager', 1);

  request.onupgradeneeded = function (e) {
      var db = e.target.result;
      console.log('Upgrade...');
      if (!db.objectStoreNames.contains('customers')) {
        var os = db.createObjectStore('customers', {keyPath: 'id', autoIncrement: true});
        // Create Index for Name
        os.createIndex('name', 'name', {unique: false});
      }
  };

  $('#frmAddMember').on('submit', function(e) {
    addCustomer();
  });

  request.onsuccess = function(e) {
    db = e.target.result;
    showCustomers();
  };

  request.onerror = function (e) {
    console.log('Error Connection');
  };
});

let addCustomer = () => {

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
    return false;
  };

  //Error
  request.onerror = function (e) {
    alert('SORRY, The Customer is not added');
    return false;
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
        output += '<tr id="customer_'+cursor.value.id+'">';
        output += '<td> <span>' + cursor.value.id + '</span></td>';
        output += '<td> <span>' + cursor.value.name + '</span></td>';
        output += '<td> <span>' + cursor.value.email + '</span></td>';
        output += '<td><a  href="#" data-delete="true">Delete</a></td>';
        output += '</tr>';
        cursor.continue();
      }

      $('#customer').html(output);
  };
};



let deleteCustomer = (id) => {
  let transaction = db.transaction(['customers'], 'readonly');
  // Ask for ObjectStore
  let store = transaction.objectStore('customers');
  var request = store.delete(id);

  // Success
  request.onsuccess = function() {
    console.log('customer' + id + ' Deleted');
    $('.customer_' + id).remove();
  };

  request.onerror = function(e) {
    alert('Sorry, The customer was not Removed');
    console.log('Error', e.target.error.name);
  };
};
