function generateInput() {
  const count = parseInt(document.getElementById('processCount').value);
  const container = document.getElementById('inputContainer');
  container.innerHTML = '';

  for (let i = 0; i < count; i++) {
    container.innerHTML += `
      <div class="proses">
        <strong>Proses P${i + 1}</strong>
        waktu kedatangan: <input type="number" id="arrival${i}" min="0" />
        Burst Time: <input type="number" id="burst${i}" min="1" />
      </div>
    `;
  }
}

function runSJF() {
  const count = parseInt(document.getElementById('processCount').value);
  let processes = [];

  for (let i = 0; i < count; i++) {
    const arrival = parseInt(document.getElementById(`arrival${i}`).value);
    const burst = parseInt(document.getElementById(`burst${i}`).value);
    processes.push({
      pid: `P${i + 1}`,
      arrival,
      burst,
      start: 0,
      completion: 0,
      turnaround: 0,
      waiting: 0,
      finished: false
    });
  }

  processes.sort((a, b) => a.arrival - b.arrival);

  let time = 0;
  let completed = 0;

  while (completed < count) {
    const ready = processes.filter(p => p.arrival <= time && !p.finished);
    if (ready.length === 0) {
      time++;
      continue;
    }

    ready.sort((a, b) => a.burst - b.burst);
    const current = ready[0];
    current.start = time;
    current.completion = time + current.burst;
    current.turnaround = current.completion - current.arrival;
    current.waiting = current.start - current.arrival;
    current.finished = true;
    time = current.completion;
    completed++;
  }

  let output = `
    <h3>Hasil SJF</h3>
    <table>
      <thead>
        <tr>
          <th>PID</th>
          <th>Arrival</th>
          <th>Burst</th>
          <th>Start</th>
          <th>Completion</th>
          <th>Turnaround</th>
          <th>Waiting</th>
        </tr>
      </thead>
      <tbody>
  `;

  let totalTAT = 0, totalWT = 0;

  for (const p of processes) {
    output += `
      <tr>
        <td>${p.pid}</td>
        <td>${p.arrival}</td>
        <td>${p.burst}</td>
        <td>${p.start}</td>
        <td>${p.completion}</td>
        <td>${p.turnaround}</td>
        <td>${p.waiting}</td>
      </tr>
    `;
    totalTAT += p.turnaround;
    totalWT += p.waiting;
  }

  const avgTAT = (totalTAT / count).toFixed(2);
  const avgWT = (totalWT / count).toFixed(2);

  output += `
      </tbody>
    </table>
    <p><strong>Rata-rata Turnaround Time:</strong> ${avgTAT}</p>
    <p><strong>Rata-rata Waiting Time:</strong> ${avgWT}</p>
    <h3>Diagram Gantt</h3>
    <div id="ganttChart"></div>
  `;

  document.getElementById('outputContainer').innerHTML = output;

  const ganttContainer = document.getElementById('ganttChart');
  ganttContainer.innerHTML = '';

  const colors = ['#ffd966', '#a2c4c9', '#f4cccc', '#d9ead3', '#d0e0e3', '#fce5cd'];
  let colorIndex = 0;

  processes.sort((a, b) => a.start - b.start);
  for (const p of processes) {
    const block = document.createElement('div');
    block.className = 'gantt-block';
    block.style.flex = p.burst;
    block.style.backgroundColor = colors[colorIndex % colors.length];
    block.innerHTML = `<strong>${p.pid}</strong><br>${p.start} - ${p.completion}`;
    ganttContainer.appendChild(block);
    colorIndex++;
  }
}