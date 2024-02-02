

  // Function to display logs in the table
  function displayLogs(logs) {
    const tableBody = $('#logTableBody');

    // Clear previous logs
    tableBody.empty();

    // Add each log as a row in the table
    logs.forEach(log => {
      const row = `<tr>
        <td>${log.id}</td>
        <td>${log.time}</td>
        <td>${log.method}</td>
        <td>${log.host}</td>
        <td>${log.createdAt}</td>
      </tr>`;
      tableBody.append(row);
    });
  }

  // Function to apply date filter
  function applyDateFilter() {
    const selectedDate = $("#datePicker").val();

    const formattedSelectedDate = new Date(selectedDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const filteredLogs = logData.filter(log => {
      const formattedLogDate = new Date(log.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      return formattedLogDate === formattedSelectedDate;
    });

    displayLogs(filteredLogs);
  }

  // Function to download logs in CSV format
  function downloadLogs() {
    const selectedDate = $("#datePicker").val();

    const formattedSelectedDate = new Date(selectedDate).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const filteredLogs = logData.filter(log => {
      const formattedLogDate = new Date(log.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      return formattedLogDate === formattedSelectedDate;
    });

    if (filteredLogs.length > 0) {
      const csvContent = 'data:text/csv;charset=utf-8,';
      const header = 'ID,Time,Method,Host,Date\n';
      const rows = filteredLogs.map(log => `${log.id},${log.time},${log.method},${log.host},"${log.createdAt}"`).join('\n');
      const data = header + rows;
      const encodedData = encodeURI(csvContent + data);

      // Create a hidden anchor element to trigger the download
      const link = document.createElement('a');
      link.setAttribute('href', encodedData);
      link.setAttribute('download', `filtered_logs_${formattedSelectedDate}.csv`);
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Remove the link from the DOM
      document.body.removeChild(link);
    } else {
      console.error('No logs available for download.');
    }
  }

  // Initialize Flatpickr for the date picker
  flatpickr("#datePicker", {
    dateFormat: "Y-m-d",
  });

  // Display initial logs
  displayLogs(logData);