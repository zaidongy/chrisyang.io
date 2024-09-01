exports.handler = async (event) => {
    try {
      const { exec } = require('child_process');
  
      exec('git submodule update --init --recursive', (error, stdout, stderr) => {
        if (error) {
          return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to update submodules' }),
          };
        }
  
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Submodules updated successfully' }),
        };
      });
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'An error occurred' }),
      };
    }
  };