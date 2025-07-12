const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Data file path
const DATA_FILE = path.join(__dirname, 'faqs.json');

// Initialize data file if it doesn't exist
const initializeDataFile = async () => {
  try {
    await fs.access(DATA_FILE);
  } catch (error) {
    const initialData = {
      java: [],
      dbms: [],
      os: [],
      cn: [],
      js: [],
      react: [],
      api: [],
      aws: [],
      docker: []
    };
    await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
};

// Helper function to read data
const readData = async () => {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return {};
  }
};

// Helper function to write data
const writeData = async (data) => {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing data:', error);
    throw error;
  }
};

// Routes
app.get('/api/faqs/:section', async (req, res) => {
  try {
    const { section } = req.params;
    const data = await readData();
    
    if (!data[section]) {
      return res.status(404).json({ message: 'Section not found' });
    }
    
    res.json(data[section]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.get('/api/faqs', async (req, res) => {
  try {
    const data = await readData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.post('/api/faqs', async (req, res) => {
  try {
    const { section, question, answer } = req.body;
    
    if (!section || !question || !answer) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const data = await readData();
    
    if (!data[section]) {
      return res.status(400).json({ message: 'Invalid section' });
    }
    
    const newFAQ = {
      id: Date.now().toString(),
      question,
      answer,
      createdAt: new Date().toISOString()
    };
    
    data[section].push(newFAQ);
    await writeData(data);
    
    res.status(201).json({ message: 'FAQ added successfully', faq: newFAQ });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/api/faqs/:section/:id', async (req, res) => {
  try {
    const { section, id } = req.params;
    const data = await readData();
    
    if (!data[section]) {
      return res.status(404).json({ message: 'Section not found' });
    }
    
    const faqIndex = data[section].findIndex(faq => faq.id === id);
    if (faqIndex === -1) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    
    data[section].splice(faqIndex, 1);
    await writeData(data);
    
    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.listen(PORT, async () => {
  await initializeDataFile();
  console.log(`Server running on port ${PORT}`);
});
