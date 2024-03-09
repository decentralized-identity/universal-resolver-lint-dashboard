// Sample JSON data

// Function to create the table using D3
function createTable(data) {
  const container = d3.select("#table-container");
  const table = container.append("table");
  const thead = table.append("thead");
  const tbody = table.append("tbody");
  const theData = Object.values(data);
  const timestamps = theData[0].results.map((d) => d.timestamp);

  // Creating table headers
  thead
    .append("tr")
    .selectAll("th")
    .data(["Method", ...timestamps])
    .enter()
    .append("th")
    .text((d) => d);

  // Creating rows for each method
  const rows = tbody.selectAll("tr").data(theData).enter().append("tr");

  // Creating cells for method and status
  rows
    .selectAll("td")
    .data(function (d) {
      const statuses = d.results.map((e) => e.value.status);
      return [d.method, ...statuses]; // Adjusting to match provided JSON structure
    })
    .enter()
    .append("td")
    .text((d) => {
      return d;
    })
    .on("click", function (event, d) {
      if (typeof d === "string" && d.startsWith("did")) {
        showDetails(data[d]);
      }
    });
}

const baseUrl = "https://identity.foundation/universal-resolver-lint-dashboard";
const startIndex = "result_".length;

function readAndMergeFiles() {
  const fileList = `${baseUrl}/files.json`;

  // Fetch the list of files in the directory
  fetch(fileList)
    .then((response) => response.json())
    .then((fileNames) => {
      // Fetch and process each file
      return Promise.all(
        fileNames.map((file) =>
          fetch(`${baseUrl}/${file}`).then((response) => {
            return response.json().then((data) => {
              var timestamp = file.substring(
                startIndex,
                file.lastIndexOf(".json")
              );
              return Object.keys(data).map((key) => {
                return {
                  method: key,
                  timestamp: `${timestamp}`,
                  value: data[key],
                };
              });
            });
          })
        )
      );
    })
    .then((results) => results.flat())
    .then((results) => {
      return Object.groupBy(results, ({ method }) => method);
    })
    .then((results) => {
      return Object.keys(results).map((method) => {
        const r = results[method].map((d) => {
          return {
            timestamp: d.timestamp,
            value: d.value,
          };
        });
        return {
          method,
          results: r,
        };
      });
    })
    .then((results) => {
      createTable(results);
    })
    .catch((error) =>
      console.error("Error fetching repository contents:", error)
    );

  /*

  const readers = [];

  // Initialize an object to hold your merged results
  const mergedResults = {};

  // Use FileReader to read each selected file
  for (let file of files) {
    const reader = new FileReader();
    reader.readAsText(file);
    readers.push(
      new Promise((resolve) => {
        reader.onload = () => {
          resolve(JSON.parse(reader.result));
        };
      })
    );
  }

  // Wait for all files to be read and processed
  Promise.all(readers).then((results) => {
    results.forEach((data) => {
      // Assuming each file is an object with methods as keys
      Object.keys(data).forEach((method) => {
        if (!mergedResults[method]) {
          mergedResults[method] = [];
        }
        // Push this file's data for the method into the array
        mergedResults[method].push(data[method]);
      });
    });

    // At this point, `mergedResults` is populated with your data
    console.log(mergedResults);

    // Optionally, process `mergedResults` further or display it on the page
  });*/
}

function showDetails(methodData) {
  const detailModal = d3.select("#detail-modal");
  const detailContent = d3.select("#detail-content");
  // Convert JSON object to a pretty-printed string
  const formattedJson = JSON.stringify(methodData, null, 2);
  // Display the formatted JSON string in the modal
  detailContent.text(formattedJson);
  detailModal.style("display", "block");
}

// Close modal function
function closeModal() {
  d3.select("#detail-modal").style("display", "none");
}

// Call createTable with jsonData when document is ready
document.addEventListener("DOMContentLoaded", function () {
  readAndMergeFiles();
});
