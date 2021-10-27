document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => display_emails('inbox'));
  document.querySelector('#sent').addEventListener('click', () => display_emails('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);



  // By default, load the inbox
  display_emails('inbox')
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


function display_emails(mailbox) {
  console.log(mailbox, typeof(mailbox))
  load_mailbox(`${mailbox}`)

  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(data => console.log(data.forEach(function (data) {

      let subject = data.subject;
      let timestamp = data.timestamp;
      let recipients = data.recipients;

      display_mails(recipients, subject, timestamp)
    }))
    );
}

// Generating UI for sent mails
function display_mails(mail, heading, time) {
  // Creating row for each mail
  const row = document.createElement('div')
  row.className = 'row border border-dark';
  row.addEventListener('click', function () {
    console.log('This element has been clicked!')
  })


  const email = document.createElement('div')
  email.className = 'col-sm-4 col-md-3';
  for (onemail in mail) {
    email.innerHTML += mail[onemail] + ' ';
  }

  const topic = document.createElement('div')
  topic.className = 'col-sm-4 col-md-5'
  topic.innerHTML = heading;

  const date = document.createElement('div')
  date.className = 'col-sm-4 col-md-3'
  date.innerHTML = time;

  row.append(email, topic, date)
  document.querySelector('#emails-view').append(row)

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
      display_emails('sent');
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