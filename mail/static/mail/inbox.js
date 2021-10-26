document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', display_sent);
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);



  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  document.getElementById('compose-form').addEventListener('submit', send_email)

}


 function display_sent() {
   load_mailbox('sent')
    addTable(); 

 
   let element = document.createElement('div')
   element.className = 'row';
   element.id = 'element';
  
  document.querySelector('#emails-view').append(element)
 

  fetch('/emails/sent')
  .then(response => response.json())
  .then(data => console.log(data.forEach(function(data) {
    let subject = data.subject;
    let timestamp = data.timestamp;
    let recipients = data.recipients;

    display_mails(recipients, subject, timestamp)
    
  }))

    );


 }

 // Generating UI for sent mails
 function display_mails(mail, heading, time) {
    let email = document.createElement('div')
    email.className = 'col-sm-4 col-md-3';
    for (onemail in mail) {
       email.innerHTML += mail[onemail] + ' ';
    }
    // let email = document.createElement('div')
    // email.className = 'col-sm-4 col-md-3';
    // email.innerHTML = mail;
    
    let topic = document.createElement('div')
    topic.className = 'col-sm-4 col-md-5'
    topic.innerHTML = heading;

    let date = document.createElement('div')
    date.className = 'col-sm-4 col-md-3'
    date.innerHTML = time;

    document.querySelector('#emails-view').append(email, topic, date)
    document.querySelector('#element').append(email, topic, date)
}

 function addTable() {
  const element = document.createElement('div').className = "row pr-5";
  element.value = "hello"

}

 

 function send_email(event) {
    
    const recipient = document.querySelector('#compose-recipients').value
    const subject = document.querySelector('#compose-subject').value
    const body = document.querySelector('#compose-body').value
    console.log(` Recipient ${recipient}, subject ${subject}, body ${body} `);

    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: recipient,
          subject: subject,
          body: body
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log(result);
        load_mailbox('sent')
    })
    .catch(error => {
      console.log(`Error ${error}`);
  });


    event.preventDefault();
  }

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}