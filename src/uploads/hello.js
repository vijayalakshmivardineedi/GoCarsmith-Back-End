exports.ScheduledDateTimeExathhhh = (req, res, next) => {
    const requestedDateTime = req.body.scheduledDateTime ? new Date(req.body.scheduledDateTime) : null;
  
    if (requestedDateTime && requestedDateTime > new Date()) {
      // If the requestedDateTime is provided and it's in the future, use it
      req.scheduledDateTime = requestedDateTime;
    } else {
      // If not provided or in the past, default to the current date and time
      req.scheduledDateTime = new Date();
    }
  
    next();
  };
  