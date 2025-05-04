module.exports = async (req, res) => {
    const { phone } = req.query;
  
    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required' });
    }
  
    const url = `http://xstrosession.koyeb.app/pair?phone=${phone}`;
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
  
      const text = await response.text();
      console.log('Raw response:', text);
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}, Body: ${text}`);
      }
  
      try {
        const data = JSON.parse(text);
        res.status(200).json(data);
      } catch (parseError) {
        throw new Error(`Invalid JSON: ${text}`);
      }
    } catch (error) {
      console.error('Proxy error:', error);
      res.status(500).json({ error: 'Failed to fetch session code', details: error.message });
    }
  };