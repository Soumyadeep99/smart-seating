const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/generate-plan', async (req, res) => {
    const { students, halls } = req.body;

    if(!students || !halls) return res.status(400).json({error: "Missing students or halls data"});

    const prompt = `
You are an expert exam seating planner.
Allocate students to seats in the following halls with these constraints:
- Students from same department or subject should not sit together.
- Distribute students evenly across halls.
- Respect hall rows and columns.
- Provide JSON output with tables (array per hall) and summary (text).

Students: ${JSON.stringify(students)}
Halls: ${JSON.stringify(halls)}
`;

    try{
        const response = await axios.post('https://api.openai.com/v1/chat/completions',{
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt}],
            max_tokens: 2000
        }, {
            headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }
        });

        const aiText = response.data.choices[0].message.content;
        res.json({ aiText });

    } catch(err){
        console.error(err.response?.data || err);
        res.status(500).json({error: 'AI request failed'});
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
