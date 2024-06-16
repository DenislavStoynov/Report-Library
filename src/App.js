import React, { useState } from 'react';
import Wrapper from './components/Wrapper/Wrapper';
import Buttons from './components/Buttons/Buttons';
import Reports from './components/Reports/Reports';
import Formats from './components/Formats/Formats';
import Result from './components/Result/Result';
import StepsComponent from './components/StepsComponent/StepsComponent';
import { ReportProvider } from './contexts/ReportContext';


const renderComponent = (curStep) => {
  switch (curStep) {
    case 0:
      return <Reports />
    case 1:
      return <Formats />
    case 2:
      return <Result />
    default:
      return null;
  }
}

function App() {
  const [curStep, setCurStep] = useState(0);

  return (
    <ReportProvider>
      <section className="App">
        <Wrapper>
          <StepsComponent curStep={curStep} />
          {renderComponent(curStep)}
          <Buttons curStep={curStep} setCurStep={setCurStep} />
        </Wrapper>
      </section>
    </ReportProvider>

  );
}

export default App;
