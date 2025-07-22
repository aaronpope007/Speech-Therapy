import React from 'react';

const TestApp: React.FC = () => {
  console.log('TestApp: Component rendering');
  
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'lightblue', 
      color: 'black',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>Test App - React is Working!</h1>
      <p>If you can see this, React is loading correctly.</p>
      <p>Check the console for debug messages.</p>
    </div>
  );
};

export default TestApp; 