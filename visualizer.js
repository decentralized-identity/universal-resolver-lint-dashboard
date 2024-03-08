// Sample JSON data
const jsonData = {
  "did:btcr": {
    "status": "no response",
    "identifiers": [
      {
        "did:btcr:xz35-jznz-q9yu-ply": {
          "valid": false,
          "error": "Uniresolver cannot resolve did:btcr:xz35-jznz-q9yu-ply",
          "duration": 3.307621916,
          "valid_json-schema": false,
          "valid_jsonld": false
        }
      },
      // Other identifiers...
    ]
  },
  "did:sov": {
    "status": "partially compliant",
    "identifiers": [
      {
        "did:sov:WRfXPg8dantKVubE3HX8pw": {
          "valid": false,
          // Additional details...
        }
      },
      // Other identifiers...
    ]
  }
  // Additional methods...
};

// Function to create the table using D3
function createTable(data) {
  const container = d3.select("#table-container");
  const table = container.append("table");
  const thead = table.append("thead");
  const tbody = table.append("tbody");

  // Creating table headers
  thead.append("tr")
    .selectAll("th")
    .data(["Method", "Status"])
    .enter()
    .append("th")
      .text(d => d);

  // Creating rows for each method
  const rows = tbody.selectAll("tr")
    .data(Object.entries(data))
    .enter()
    .append("tr");

  // Creating cells for method and status
  rows.selectAll("td")
    .data(function(d) {
      return [d[0], d[1].status]; // Adjusting to match provided JSON structure
    })
    .enter()
    .append("td")
      .text(d => d)
      .on("click", function(event, d) {
        if (typeof d === "string" && d.startsWith("did")) {
          showDetails(data[d]);
        }
      });
}

// Function to display detailed information
function showDetailsTODODelete(methodData) {
  const detailModal = d3.select("#detail-modal");
  const detailContent = d3.select("#detail-content");
  detailContent.html(""); // Clear existing content
  
  // Generate and display detailed content
  methodData.identifiers.forEach(identifier => {
    Object.entries(identifier).forEach(([key, value]) => {
      detailContent.append("p").text(`${key}: ${JSON.stringify(value, null, 2)}`);
    });
  });

  detailModal.style("display", "block");
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
document.addEventListener("DOMContentLoaded", function() {
  createTable(jsonData);
});
