// Function to format a date
function date(value) {
    return new Intl.DateTimeFormat('en-US').format(value);
  }
  
  // Function to format a time
  function time(value) {
      if (!value) throw new Error('value is required');
      return new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true
      }).format(value);
  }
  
  // Function to format a date and time
  function dateTime(value) {
      if (!value) throw new Error('value is required');
      return new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
          year: 'numeric',
          month: 'numeric',
          day: 'numeric'
      }).format(value);
  }
  
  // Function to format a number
  function number(value) {
      if (!value) throw new Error('value is required');
      return new Intl.NumberFormat('en-US').format(value);
  }
  
  // Export the functions as a module
  module.exports = {
      date,
      time,
      dateTime,
      number
  };
  