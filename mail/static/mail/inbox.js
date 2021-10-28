document.addEventListener('DOMContentLoaded', function() {
  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => display_emails('inbox'));
  document.querySelector('#sent').addEventListener('click', () => display_emails('sent'));
  document.querySelector('#archived').addEventListener('click', () => display_emails('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  // By default, load the inbox
  display_emails('inbox')
});

function compose_email() {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  // document.querySelector('#reply-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  document.getElementById('compose-form').addEventListener('submit', send_email)
}

function display_email(id, data) {
  console.log(id)
  document.querySelector('#reply-button').addEventListener('click', function() {
    console.log('button pressed')
    reply(data)
  })
  fetch(`/emails/${id}`)
      .then(response => response.json())
      .then(data => {
          let subject = data.subject;
          let timestamp = data.timestamp;
          let recipients = data.recipients;
          const sender = data.sender;
          console.log(subject, timestamp, recipients)
          load_email(`${data.subject}`)
          document.querySelector('#from').innerHTML = sender;
          document.querySelector('#to').innerHTML = data.recipients;
          document.querySelector('#subject').innerHTML = subject;
          document.querySelector('#timezone').innerHTML = timestamp;
          console.log(data.body)
          document.querySelector('#mail-body').innerText = data.body;
      })
  // Mark email as read
  fetch(`/emails/${id}`, {
          method: 'PUT',
          body: JSON.stringify({
              read: true
          }),
      })
      .catch(error => {
          console.log(error)
      });
}

function display_emails(mailbox) {
  load_mailbox(`${mailbox}`)
  fetch(`/emails/${mailbox}`)
      .then(response => response.json())
      .then(data => console.log(data.forEach(function(data) {
          let subject = data.subject;
          let timestamp = data.timestamp;
          let recipients = data.recipients;
          let sender = data.sender;
          display_mails(recipients, sender, subject, timestamp, data, mailbox)
      })));
}

// Generating UI for mails
function display_mails(mail, sender, heading, time, data, mailbox) {
  // Creating div row for each mail
  const row = document.createElement('div')
  if (data.read) {
      row.className = 'row border border-dark bg-secondary';
  } else {
      row.className = 'row border border-dark bg-white';
  }

  if (mailbox != 'sent') {
      let archive_status = '';
      let icon_div = document.createElement('div')
      icon_div.className = 'col-sm';
      let archive_icon = document.createElement('i')
      archive_icon.className = 'fas fa-archive text-black'

      icon_div.addEventListener('click', function(e) {
          if (data.archived === true) {
              archive_status = false
          } else {
              archive_status = true
          }

          fetch(`/emails/${data.id}`, {
                  method: 'PUT',
                  body: JSON.stringify({
                      archived: archive_status
                  }),
              })
              .then(() => {
                  console.log('success')
                  display_emails('inbox')
              })
              .catch(error => {
                  console.log(error)
              });
          e.stopPropagation();
      })
      icon_div.append(archive_icon)
      row.append(icon_div)
  }

  row.addEventListener('click', function() {
      display_email(data.id, data)
  })

  const email = document.createElement('div')
  email.className = 'col-sm-3 col-md-3';
  email.innerHTML = sender;
  // for (onemail in mail) {
  //     email.innerHTML += mail[onemail] + ' ';
  // }
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

function get_emails(arr) {
  let senders = ''
  for (let i = 0; i < arr.length; i++) {
    if (arr === 0) {
      return arr
    }
    else if (i+1 === arr.length) {
      senders += arr[i];
    } else {
      senders += arr[i] + ', ';
    }
  }
   return document.querySelector('#reply-recipients').value = senders;
}

function reply(data) {
  document.querySelector('#email-view').style.display = 'none';
  // document.querySelector('#reply-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#compose-recipients').value = data.sender
  document.querySelector('#compose-subject').value = get_subject(data.subject)
  document.querySelector('#compose-body').value = get_body(data)
  document.getElementById('compose-form').addEventListener('submit', send_email)
  

}

function get_body(data) {
  return `\nOn ${data.timestamp} ${data.sender} wrote:
${data.body}`


}

function get_subject(subject) {
  if (subject.startsWith('Re: ')) {
    return subject;
  } else {
    return 'Re: ' + subject;
  }
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
  // document.querySelector('#reply-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}

function load_email(subject) {
  // Show the mailbox and hide other views
  document.querySelector('#email-view').style.display = 'block';
  console.log('block')
  document.querySelector('#emails-view').style.display = 'none';
  // document.querySelector('#reply-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#from').value = 'hello';
  document.querySelector('#to').value = '';
  document.querySelector('#subject').value = '';
  // Show the mailbox name
  // document.querySelector('#email-view').innerHTML = '';
}