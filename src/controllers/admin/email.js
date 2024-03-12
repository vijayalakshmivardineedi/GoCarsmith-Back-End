const Admin = require('../../models/admin/auth');
const User = require("../../models/user/auth");
const Employee = require("../../models/serviceCenter/employee/auth");
const ServiceCenter = require("../../models/serviceCenter/auth");
const bcrypt = require('bcrypt');
const shortid = require('shortid');
const { sendEmail, imapConfig, sendEmailNotification } = require('../../validator/email');
const NodeCache = require('node-cache');
const schedule = require('node-schedule');
const simpleParser = require('mailparser').simpleParser;

const saltRounds = 10;
const Imap = require('node-imap');
const notifier = require('node-notifier');
const emailValidator = require('email-validator');
const { generateJwtToken, generateVerificationCode, scheduledDateTime } = require('../../common-middleware/code');
let unseenEmailCount = 0;
const emailVerificationCache = new NodeCache();
const fs = require('fs');
const path = require('path');




exports.commonEmailSend = (req, res) => {
  const to = req.body.email;
  const subject = `Replying for the Mail`;
  const text = req.body.text;

  sendEmail(to, subject, text)
    .then(() => {
      res.send('Email sent successfully');
    })
    .catch((error) => {
      console.error('Error sending email:', error);
      res.status(500).send('Internal Server Error');
    });
};


// this is the function common to search for user,employee,servicecenter.
const sendNotification = async (to, userType, dynamicText) => {
  // Check if the provided email is valid
  if (!emailValidator.validate(to)) {
    // The email is not valid
    return Promise.reject('Invalid email address');
  }

  // Determine the model based on the user type
  const userModel = userType === 'user' ? User : (userType === 'employee' ? Employee : ServiceCenter);

  // Check if the email exists in the database
  try {
    const user = await userModel.findOne({ email: to });

    if (!user) {
      return Promise.reject(`${userType} not found in the database`);
    }

    const firstName = user.firstName;
    const subject = 'Notifications';


    const text = `<p>Hi ${firstName}.</p> <p>${dynamicText}</p>`; // Use dynamic text from the request body

    // Schedule email to be sent at the specified date and time
    const scheduledJob = schedule.scheduleJob(scheduledDateTime, function () {
      // Logic to send email notifications here
      sendEmail(to, subject, text);
    });

    if (!scheduledJob) {
      // If scheduling fails (e.g., due to an invalid date), send the email immediately
      sendEmail(to, subject, text);
    }

    return Promise.resolve(`Sent Notification to ${firstName}'s email with dynamic text`);
  } catch (error) {
    console.error('Database error:', error);
    return Promise.reject('Internal server error');
  }
};




exports.sendSingleUserNotifications = async (req, res) => {
  const to = req.body.email;
  const dynamicText = req.body.dynamicText || '';

  try {
    const result = await sendNotification(to, 'user', dynamicText);
    res.send(result);
  } catch (error) {
    res.status(400).send(error);
  }
};




exports.sendSingleEmployeeNotifications = async (req, res) => {
  const to = req.body.email;
  const dynamicText = req.body.dynamicText || '';

  try {
    const result = await sendNotification(to, 'employee', dynamicText);
    res.send(result);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.sendSingleServiceCenterNotifications = async (req, res) => {
  const to = req.body.email;
  const dynamicText = req.body.dynamicText || '';

  try {
    const result = await sendNotification(to, 'serviceCenter', dynamicText);
    res.send(result);
  } catch (error) {
    res.status(400).send(error);
  }
};



// Common function to send notifications
const sendAllNotifications = (queryResult, subject, text, res, successMessage, errorMessage) => {
  const scheduledJob = schedule.scheduleJob(scheduledDateTime, function () {
    // Logic to send email notifications here
    sendEmailNotification(queryResult, subject, text, res, successMessage, errorMessage);
  });

  if (!scheduledJob) {
    // If scheduling fails (e.g., due to an invalid date), send the email immediately
    sendEmailNotification(queryResult, subject, text, res, successMessage, errorMessage);
  }
};

// Usage in sendAllUsersNotifications
exports.sendAllUsersNotifications = (req, res) => {
  const subject = 'Notification';
  const dynamicText = req.body.dynamicText || '';

  User.find({}, (err, users) => {
    if (err) {
      console.error("Database error:", err);
      res.status(500).send('Internal server error');
      return;
    }

    if (users.length === 0) {
      res.status(404).send('No users found in our database');
      return;
    }

    
    const firstName = users[0].firstName; // Assuming you want the first user's first name
    const text = `<p>Hello ${firstName}.</p><p>${dynamicText}</p>`;

    sendAllNotifications(users, subject, text, res, 'Email notifications sent to all employees', 'Error sending email notifications');
  });
};

// Usage in sendAllEmployeeNotifications
exports.sendAllEmployeeNotifications = (req, res) => {
  const subject = 'Notification';
  const dynamicText = req.body.dynamicText || '';

  Employee.find({}, (err, employees) => {
    if (err) {
      console.error("Database error:", err);
      res.status(500).send('Internal server error');
      return;
    }

    if (employees.length === 0) {
      res.status(404).send('No employees found in our database');
      return;
    }

    

    const text = `<p>Hello ${firstName}.</p><p>${dynamicText}</p>`;


    sendAllNotifications(employees, subject, text, res, 'Email notifications sent to all employees', 'Error sending email notifications');
  });
};

// Usage in sendAllServiceCentersNotifications
exports.sendAllServiceCentersNotifications = (req, res) => {
  const subject = 'Notification';
  const dynamicText = req.body.dynamicText || '';

  ServiceCenter.find({}, (err, serviceCenters) => {
    if (err) {
      console.error("Database error:", err);
      res.status(500).send('Internal server error');
      return;
    }

    if (serviceCenters.length === 0) {
      res.status(404).send('No serviceCenters found in our database');
      return;
    }


    const text = `<p>Hello ${firstName}.</p><p>${dynamicText}</p>`;

    
    sendAllNotifications(serviceCenters, subject, text, res, 'Email notifications sent to all serviceCenters', 'Error sending email notifications');
  });
};






exports.getAllEmails = (callback) => {
  
  // Create a new Imap instance with the provided configuration (presumably defined elsewhere as imapConfig).
  const imap = new Imap(imapConfig);

  // Set up an event listener for the 'ready' event.
  imap.once('ready', () => {
    // Once the connection is ready, open the 'INBOX'.
    imap.openBox('INBOX', true, (err, box) => {
      // Handle any errors that occur while opening the 'INBOX'.
      if (err) {
        imap.end();
        return callback(err);
      }

      // Search for all emails using the 'ALL' criterion.
      imap.search(['ALL'], (searchErr, results) => {
        // Handle any errors that occur during the search.
        if (searchErr) {
          imap.end();
          return callback(searchErr);
        }

        // Fetch email bodies based on the search results.
        const fetch = imap.fetch(results, { bodies: '' });

        // Initialize an array to store email content.
        const emails = [];

        // Set up an event listener for the 'message' event.
        fetch.on('message', (msg) => {
          // For each message, set up an event listener for the 'body' event.
          msg.on('body', (stream, info) => {
            // Initialize a buffer to store the email body.
            let buffer = '';

            // Set up an event listener for the 'data' event.
            stream.on('data', (chunk) => {
              // Append the chunk of data to the buffer.
              buffer += chunk.toString('utf8');
            });

            // Set up an event listener for the 'end' event.
            stream.once('end', () => {
              // When the stream ends, push the email content to the emails array.
              emails.push(buffer);
            });
          });
        });

        // Set up an event listener for the 'end' event of the fetch process.
        fetch.once('end', () => {
          // Close the IMAP connection.
          imap.end();
          // Call the callback with the fetched emails.
          callback(null, emails);
        });

        // Set up an event listener for errors during the fetch process.
        fetch.once('error', (fetchErr) => {
          // Close the IMAP connection.
          imap.end();
          // Call the callback with the fetch error.
          callback(fetchErr);
        });
      });
    });
  });

  // Set up an event listener for errors during the IMAP connection.
  imap.once('error', (err) => {
    // Log the IMAP connection error.
    console.error('IMAP connection error:', err.message);
    // Call the callback with the IMAP connection error.
    callback(err);
  });

  // Connect to the IMAP server.
  imap.connect();
};



exports.getEmailNotifications = (req, res) => {
  const imap = new Imap(imapConfig);
  const emailDetails = []; // Array to store email details
const attachmentsDirectory = path.join(__dirname, '../../attachments');

  imap.once('ready', () => {
    imap.openBox('INBOX', false, (err, box) => {
      if (err) {
        console.error('Error opening mailbox:', err);
        res.status(500).json({ error: 'Error opening mailbox' });
        return;
      }

      // Ensure the attachments directory exists
      if (!fs.existsSync(attachmentsDirectory)) {
        fs.mkdirSync(attachmentsDirectory, { recursive: true });
      }

      // Search for unseen emails
      imap.search(['UNSEEN'], (err, unseenResults) => {
        if (err) {
          console.error('Error searching for unseen emails:', err);
          res.status(500).json({ error: 'Error searching for unseen emails' });
          return;
        }

        // Search for seen emails
        imap.search(['SEEN'], (err, seenResults) => {
          if (err) {
            console.error('Error searching for seen emails:', err);
            res.status(500).json({ error: 'Error searching for seen emails' });
            return;
          }

          const unseenCount = unseenResults.length;
          const seenCount = seenResults.length;

          

          const processEmails = (results, isSeen) => {
            const fetch = imap.fetch(results, { bodies: '', markSeen: false, struct: true }); // Include message structure

            fetch.on('message', (msg, seqno) => {
              const emailContent = {
                seqno,
                from: '',
                subject: '',
                text: '',
                html: '',
                seen: isSeen,
                date: '',
                attachments: [],
              };

              msg.on('body', (stream, info) => {
                let buffer = '';

                stream.on('data', (chunk) => {
                  buffer += chunk.toString('utf8');
                });

                stream.on('end', () => {
                  // 'buffer' contains the email content
                  // Use simpleParser to parse the email content
                  simpleParser(buffer, (err, parsed) => {
                    if (err) {
                      console.error('Error parsing email:', err);
                      res.status(500).json({ error: 'Error parsing email' });
                      return;
                    }

                    emailContent.from = parsed.from.text;
                    emailContent.subject = parsed.subject;
                    emailContent.text = parsed.text;
                    emailContent.html = parsed.html;
                    emailContent.date = parsed.date;

                    if (parsed.attachments && parsed.attachments.length > 0) {
                      parsed.attachments.forEach((attachment, index) => {
                        const fileName = `attachment${index + 1}_${attachment.filename}`;
                        const filePath = path.join(attachmentsDirectory, fileName); // Specify the directory for attachments

                        fs.writeFileSync(filePath, attachment.content);
                        emailContent.attachments.push({ fileName, filePath });
                      });
                    }

                   

                    emailDetails.push(emailContent);

                    // If all emails have been processed, send the array in the response
                    if (emailDetails.length === unseenCount + seenCount) {
                      res.json(emailDetails);
                      imap.end(); // Close the IMAP connection
                    }
                  });
                });
              });
            });

            fetch.once('error', (err) => {
              console.error('Fetch error:', err);
              res.status(500).json({ error: 'Error fetching emails' });
            });
          };

          // Process unseen emails
          if (unseenCount > 0) {
            processEmails(unseenResults, false);
          }

          // Process seen emails
          if (seenCount > 0) {
            processEmails(seenResults, true);
          }
        });
      });
    });
  });

  imap.once('error', (err) => {
    console.error('IMAP connection error:', err);
    res.status(500).json({ error: 'IMAP connection error' });
  });

  imap.once('end', () => {
    console.log('IMAP connection ended');
  });

  imap.connect();
};


exports.getAttachmentsById = (req, res) => {
  const fileName = req.params.fileName;

  // Check if fileName is undefined
  if (!fileName) {
    return res.status(400).json({ message: 'Invalid parameters' });
  }

  const attachmentsDirectory = path.join(__dirname, '../../attachments');
  const filePath = path.join(attachmentsDirectory, fileName);

 

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ message: 'File not found' });
  }
};

