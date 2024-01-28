function downloadAsExcel() {
    // Get the current date
    var currentDate = new Date();
    var formattedDate = currentDate.toISOString().slice(0, 10); // Format as YYYY-MM-DD

    // Create a new workbook
    var wb = XLSX.utils.book_new();
    // Convert logData to a worksheet
    var ws = XLSX.utils.json_to_sheet(logData);
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Log Data');
    // Create a blob with the Excel file content
    var blob = XLSX.write(wb, { bookType: 'xlsx', type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    // Trigger the download with the filename including the current date
    saveAs(blob, 'log_data_' + formattedDate + '.xlsx');
  }
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize flatpickr on the date input
    flatpickr("#datepicker", {
      dateFormat: "Y-m-d",
      onChange: function(selectedDates, dateStr, instance) {
        // Call a function to filter logs based on the selected date
        filterLogsByDate(dateStr);
      }
    });

    function filterLogsByDate(selectedDate) {
      // Use logData to filter logs based on the selected date
      var filteredLogs = logData.filter(function(entry) {
        return entry.createdAt.startsWith(selectedDate);
      });

      // Render the filtered logs in the table
      renderLogsTable(filteredLogs);
    }

    function renderLogsTable(logs) {
      var tableBody = document.getElementById('logsTableBody');
      tableBody.innerHTML = '';

      logs.forEach(function(entry) {
        var row = document.createElement('tr');
        row.innerHTML = `
          <td>${entry.id}</td>
          <td>${entry.time}</td>
          <td>${entry.method}</td>
          <td>${entry.host}</td>
          <td>${entry.createdAt}</td>
        `;
        tableBody.appendChild(row);
      });
    }
  });