let halls=[];

function generateHallForms(){
    const num = parseInt(document.getElementById('numHalls').value);
    const container = document.getElementById('hallForms');
    container.innerHTML='';
    halls=[];
    for(let i=0;i<num;i++){
        const div = document.createElement('div');
        div.className='room';
        div.innerHTML=`
            <h3>Hall ${i+1}</h3>
            <label>Name: <input type="text" id="hallName${i}" value="Hall ${i+1}"></label><br>
            <label>Rows: <input type="number" id="rows${i}" value="5"></label>
            <label>Cols: <input type="number" id="cols${i}" value="6"></label>
            <label>Teachers per hall: <input type="number" id="teachers${i}" value="1"></label>
        `;
        container.appendChild(div);
        halls.push({name:`Hall ${i+1}`, rows:5, cols:6, teachers:1});
    }
}

async function generateSeating(){
    const studentCSV = document.getElementById('studentsInput').value.trim();
    if(!studentCSV){ alert('Enter students'); return;}
    const students = studentCSV.split('\n').map(line=>{
        const [name,roll,dept,sem,subject] = line.split(',').map(s=>s.trim());
        return {name,roll,dept,sem,subject};
    });

    for(let i=0;i<halls.length;i++){
        halls[i].name = document.getElementById('hallName'+i).value;
        halls[i].rows = parseInt(document.getElementById('rows'+i).value);
        halls[i].cols = parseInt(document.getElementById('cols'+i).value);
        halls[i].teachers = parseInt(document.getElementById('teachers'+i).value);
    }

    document.getElementById('aiOutput').innerHTML='AI generating plan...';

    try{
        const res = await fetch('http://localhost:5000/generate-plan',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({ students,halls })
        });
        const data = await res.json();
        document.getElementById('aiOutput').innerHTML='<pre>'+data.aiText+'</pre>';
    }catch(err){
        document.getElementById('aiOutput').innerHTML='Error: '+err;
    }
}
