document.addEventListener('DOMContentLoaded', function () {
    let intervalId;
    let ganttBoxes = [];
    let currentStep = 0;
  
    const processCountInput = document.getElementById('numProcess');
    const generateTableBtn = document.getElementById('generate-table');
    const inputTableBody = document.getElementById('input-table-body');
    const calculateBtn = document.getElementById('calculate');
  
    generateTableBtn.addEventListener('click', function () {
      const count = parseInt(processCountInput.value);
      if (count < 1 || count > 10) {
        alert('Jumlah proses harus 1 - 10');
        return;
      }
      generateInputTable(count);
    });
  
    function generateInputTable(count) {
      inputTableBody.innerHTML = '';
      for (let i = 0; i < count; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>P${i + 1}</td>
          <td><input type="number" id="arrival${i}" min="0" value="0"></td>
          <td><input type="number" id="burst${i}" min="1" value="1"></td>
        `;
        inputTableBody.appendChild(row);
      }
    }
  
    calculateBtn.addEventListener('click', simulateFIFO);
  
    function simulateFIFO() {
        const num = parseInt(processCountInput.value);
        let processes = [];
      
        for (let i = 0; i < num; i++) {
          const arrival = parseInt(document.getElementById(`arrival${i}`).value);
          const burst = parseInt(document.getElementById(`burst${i}`).value);
          processes.push({ id: i + 1, arrival, burst });
        }
      
        processes.sort((a, b) => a.arrival - b.arrival);
      
        let currentTime = 0;
        const tbody = document.querySelector("#resultTable tbody");
        tbody.innerHTML = "";
        document.getElementById("animationArea").innerHTML = "";
        document.getElementById("ganttChart").innerHTML = "";
        document.getElementById("averageResult").innerHTML = "";
      
        ganttBoxes = [];
        let totalTAT = 0;
        let totalWaiting = 0;
      
        processes.forEach(p => {
          if (currentTime < p.arrival) currentTime = p.arrival;
          const start = currentTime;
          const finish = currentTime + p.burst;
          const tat = finish - p.arrival;
          const wait = tat - p.burst;
          currentTime = finish;
      
          totalTAT += tat;
          totalWaiting += wait;
      
          const gantt = document.createElement("div");
          gantt.className = "gantt-box";
          gantt.style.width = `${p.burst * 30}px`;
          gantt.textContent = `P${p.id}`;
          document.getElementById("ganttChart").appendChild(gantt);
          ganttBoxes.push(gantt);
      
          const box = document.createElement("div");
          box.className = "process-box";
          box.textContent = `P${p.id}`;
          document.getElementById("animationArea").appendChild(box);
      
          tbody.innerHTML += `
            <tr>
              <td>P${p.id}</td>
              <td>${p.arrival}</td>
              <td>${p.burst}</td>
              <td>${finish}</td>
              <td>${tat}</td>
              <td>${wait}</td>
            </tr>`;
        });
      
        const avgTAT = totalTAT / processes.length;
        const avgWaiting = totalWaiting / processes.length;
      
        document.getElementById("averageResult").innerHTML = `
          <h3>Rata-rata Turnaround Time (TAT): ${avgTAT.toFixed(2)}</h3>
          <p>Total TAT: ${totalTAT} &divide; ${processes.length} proses = ${avgTAT.toFixed(2)}</p>
      
          <h3>Rata-rata Waiting Time (WT): ${avgWaiting.toFixed(2)}</h3>
          <p>Total WT: ${totalWaiting} &divide; ${processes.length} proses = ${avgWaiting.toFixed(2)}</p>
        `;
      
        currentStep = 0;
      }

      function simulateFIFO() {
  const num = parseInt(processCountInput.value);
  let processes = [];

  for (let i = 0; i < num; i++) {
    const arrival = parseInt(document.getElementById(`arrival${i}`).value);
    const burst = parseInt(document.getElementById(`burst${i}`).value);
    processes.push({ id: i + 1, arrival, burst });
  }

  processes.sort((a, b) => a.arrival - b.arrival);

  let currentTime = 0;
  const tbody = document.querySelector("#resultTable tbody");
  tbody.innerHTML = "";
  document.getElementById("animationArea").innerHTML = "";
  document.getElementById("ganttChart").innerHTML = "";
  document.getElementById("averageResult").innerHTML = "";

  ganttBoxes = [];
  let totalTAT = 0;
  let totalWaiting = 0;

  processes.forEach(p => {
    if (currentTime < p.arrival) currentTime = p.arrival;
    const start = currentTime;
    const finish = currentTime + p.burst;
    const tat = finish - p.arrival;
    const wait = tat - p.burst;
    currentTime = finish;

    totalTAT += tat;
    totalWaiting += wait;

    const gantt = document.createElement("div");
    gantt.className = "gantt-box";
    gantt.style.width = `${p.burst * 30}px`;
    gantt.textContent = `P${p.id}`;
    document.getElementById("ganttChart").appendChild(gantt);
    ganttBoxes.push(gantt);

    const box = document.createElement("div");
    box.className = "process-box";
    box.textContent = `P${p.id}`;
    document.getElementById("animationArea").appendChild(box);

    tbody.innerHTML += `
      <tr>
        <td>P${p.id}</td>
        <td>${p.arrival}</td>
        <td>${p.burst}</td>
        <td>${finish}</td>
        <td>${tat}</td>
        <td>${wait}</td>
      </tr>`;
  });

  const avgTAT = totalTAT / processes.length;
  const avgWaiting = totalWaiting / processes.length;

  document.getElementById("averageResult").innerHTML = `
    <h3>Rata-rata Turnaround Time (TAT): ${avgTAT.toFixed(2)}</h3>
    <p>Total TAT: ${totalTAT} &divide; ${processes.length} proses = ${avgTAT.toFixed(2)}</p>

    <h3>Rata-rata Waiting Time (WT): ${avgWaiting.toFixed(2)}</h3>
    <p>Total WT: ${totalWaiting} &divide; ${processes.length} proses = ${avgWaiting.toFixed(2)}</p>
  `;

  currentStep = 0;
}

window.playAnimation = function () {
    if (intervalId) return;

    intervalId = setInterval(() => {
      if (currentStep > 0) {
        ganttBoxes[currentStep - 1].classList.remove("active");
      }

      if (currentStep < ganttBoxes.length) {
        ganttBoxes[currentStep].classList.add("active");
        currentStep++;
      } else {
        clearInterval(intervalId);
        intervalId = null;
      }
    }, 1000);
}

  
    window.pauseAnimation = function () {
      clearInterval(intervalId);
      intervalId = null;
    };
  
    // Generate default table
    generateInputTable(3);
  });
  